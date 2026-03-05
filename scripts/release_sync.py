#!/usr/bin/env python3
import argparse
import os
import hashlib
import base64
import boto3
import json
import subprocess
import sys

from pathlib import Path
from typing import Dict
from dotenv import load_dotenv

import yaml

load_dotenv(dotenv_path=Path(__file__).parent.parent / "backend/.env")

# ==============================================================================
# Config
# ==============================================================================
APP = "PileaX"
REPO = "pileax-ai/pileax"

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT_DIR = SCRIPT_DIR.parent
PACKAGE_JSON = ROOT_DIR / "package.json"


# ==============================================================================
# Utils
# ==============================================================================
def run(cmd: list[str]) -> str:
  """Run command and return stdout, or raise on error."""
  proc = subprocess.run(
    cmd,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
  )
  if proc.returncode != 0:
    raise RuntimeError(
      f"Command failed: {' '.join(cmd)}\n{proc.stderr}"
    )
  return proc.stdout.strip()


def run_live(cmd: list[str]) -> None:
  proc = subprocess.run(cmd)
  if proc.returncode != 0:
    raise RuntimeError(
      f"Command failed: {' '.join(cmd)}"
    )


def get_version() -> str:
  if not PACKAGE_JSON.exists():
    raise FileNotFoundError(f"{PACKAGE_JSON} not found")

  data = json.loads(PACKAGE_JSON.read_text())
  version = data.get("version")
  if not version:
    raise ValueError("version not found in package.json")

  return version


# ==============================================================================
# GitHub
# ==============================================================================
def get_release(repo: str, tag: str) -> Dict:
  """Fetch GitHub release by tag via gh CLI."""
  output = run([
    "gh",
    "api",
    f"repos/{repo}/releases/tags/{tag}",
  ])
  info = json.loads(output)

  print(f"📦  Release      : {info.get("name")}\n")

  return info


def get_local_files(dir: Path) -> set[str]:
  return {
    p.name
    for p in dir.iterdir()
    if p.is_file()
  }


def download_release_assets(
  repo: str,
  tag: str,
  release: dict,
  target_dir: Path,
) -> None:
  print(f"⏳ Checking release assets for {tag} ...")

  target_dir.mkdir(parents=True, exist_ok=True)

  local_files = get_local_files(target_dir)
  assets = release.get("assets", [])

  if not assets:
    print("⚠️  No assets found in release")
    return

  missing = [
    a["name"]
    for a in assets
    if a["name"] not in local_files
  ]

  if not missing:
    print("✅ All assets already downloaded")
    return

  print(f"⬇️  Downloading {len(missing)} missing assets:")
  for name in missing:
    print(f"   • {name}")

    run_live([
      "gh",
      "release",
      "download",
      tag,
      "-R",
      repo,
      "--pattern",
      name,
      "--dir",
      str(target_dir),
    ])

  print("✅ Missing assets downloaded")


# ==============================================================================
# Verify
# ==============================================================================
def verify_assets(version: str | None = None) -> None:
  if version is None:
    version = get_version()

  """Verify downloaded assets using sha512 from all latest*.yml files."""
  release_dir = ROOT_DIR / "releases" / version

  print(f"\n🔍 Verifying asset integrity for version {version}...")

  # Get all latest*.yml
  yaml_files = list(release_dir.glob("latest*.yml"))
  if not yaml_files:
    print(f"⚠️  No latest*.yml files found in {release_dir}")
    return

  all_passed = True
  verified_files = set() # Avoid redundant hashing for same files across YMLs

  for yml_path in yaml_files:
    print(f"📄 Checking manifest: {yml_path.name}")
    try:
      with open(yml_path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    except Exception as e:
      print(f"❌ Failed to parse {yml_path.name}: {e}")
      continue

    # electron-builder yaml structure usually has a 'files' list
    files = data.get("files", [])
    if not files:
      continue

    for file_info in files:
      # Extract filename from url/path and get expected sha512
      file_name = Path(file_info.get("url", "")).name
      expected_sha512 = file_info.get("sha512")
      local_path = release_dir / file_name

      if not expected_sha512 or file_name in verified_files:
        continue

      if not local_path.exists():
        print(f"   ❌ Missing file: {file_name}")
        all_passed = False
        continue

      # Calculate SHA512
      sha512_hash = hashlib.sha512()
      with open(local_path, "rb") as f:
        # Read in 8KB chunks for memory efficiency
        for chunk in iter(lambda: f.read(8192), b""):
          sha512_hash.update(chunk)

      # Convert to Base64 (matches electron-builder format)
      actual_sha512 = base64.b64encode(sha512_hash.digest()).decode("utf-8")

      if actual_sha512 == expected_sha512:
        print(f"   ✅ {file_name} (Verified)")
        verified_files.add(file_name)
      else:
        print(f"   ❌ {file_name} (HASH MISMATCH!)")
        print(f"      Expected: {expected_sha512}")
        print(f"      Actual:   {actual_sha512}")
        all_passed = False

  if not all_passed:
    raise RuntimeError("Integrity check failed. Some assets are corrupted or missing.")

  print("✨ Integrity check passed for all assets.")


# ==============================================================================
# YAML update
# ==============================================================================
def update_yaml_file(
  file_path: Path,
  release: Dict,
  version: str,
) -> None:
  prefix = f"releases/{version}/"

  data = yaml.safe_load(file_path.read_text())
  if not isinstance(data, dict):
    print(f"⚠️  Skip invalid YAML: {file_path}")
    return

  # 1️⃣ release meta
  data["releaseName"] = release.get("name", "")
  data["releaseNotes"] = release.get("body", "")

  # 2️⃣ files[].url
  for f in data.get("files", []) or []:
    if "url" in f:
      f["url"] = prefix + Path(f["url"]).name

  # 3️⃣ path
  if data.get("path"):
    data["path"] = prefix + Path(data["path"]).name

  file_path.write_text(
    yaml.dump(
      data,
      sort_keys=False,
      allow_unicode=True,
      default_flow_style=False,
    )
  )

  print(f"✅ Updated {file_path.name}")


# ==============================================================================
# Upload
# ==============================================================================
def upload_file_to_r2(
  local_path: Path,
  bucket: str,
  key: str,
  s3_client=None,
  dry_run=False,
):
  if dry_run:
    print(f"[dry-run] Upload {local_path} → {bucket}/{key}")
    return

  if s3_client is None:
    s3_client = boto3.client("s3")

  s3_client.upload_file(
    Filename=str(local_path),
    Bucket=bucket,
    Key=key
  )
  print(f"✅ Uploaded {local_path.name} → {bucket}/{key}")


# ==============================================================================
# CMD
# ==============================================================================
def cmd_download() -> None:
  version = get_version()
  tag = f"v{version}"
  release_dir = ROOT_DIR / "releases" / version

  print(f"📦  App      : {APP}")
  print(f"🔖  Version  : {version}")
  print(f"🏷   Tag      : {tag}")
  print(f"📁  Dir      : {release_dir}\n")

  if not release_dir.exists():
    release_dir.mkdir(parents=True, exist_ok=True)

  print("🔍 Fetching GitHub release info...")
  release = get_release(REPO, tag)

  # Download assets
  download_release_assets(REPO, tag, release, release_dir)

  yaml_files = list(release_dir.glob("*.yml"))
  if not yaml_files:
    print("\n⚠️  No YAML files found")
    return

  print(f"\n🛠  Updating {len(yaml_files)} YAML files...")
  for yml in yaml_files:
    update_yaml_file(yml, release, version)

  print("\n🎉 All YAML files updated successfully")
  print("🎉 Download command finished")

  # Verify assets
  verify_assets(version)


def cmd_upload(dry_run: bool = False) -> None:
  version = get_version()
  release_dir = ROOT_DIR / "releases" / version

  if not release_dir.exists():
    raise FileNotFoundError(f"{release_dir} does not exist")

  # Init S3 client
  s3_client = s3_client = boto3.client(
    "s3",
    endpoint_url=f"https://{os.environ["R2_ACCOUNT_ID"]}.r2.cloudflarestorage.com",
    aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
    aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"],
    region_name=os.environ.get("R2_DEFAULT_REGION", "auto"),
  )
  bucket = "pileax"

  # Upload YAML files
  yml_files = list(release_dir.glob("*.yml"))
  for yml in yml_files:
    key = f"updater/{yml.name}"
    upload_file_to_r2(yml, bucket, key, s3_client, dry_run=dry_run)

  print(f"🎉  Upload {len(yml_files)} yml files finished. \n")

  # Upload release files
  other_files = [f for f in release_dir.iterdir() if f.is_file() and f.suffix != ".yml"]
  for f in other_files:
    key = f"updater/releases/{version}/{f.name}"
    upload_file_to_r2(f, bucket, key, s3_client, dry_run=dry_run)

  total = len(yml_files) + len(other_files)
  print(f"\n🎉  Upload total {total} files finished")


# ==============================================================================
# Main
# ==============================================================================
def main() -> None:
  parser = argparse.ArgumentParser(
    description="PileaX release utility"
  )
  subparsers = parser.add_subparsers(
    dest="command",
    required=True,
  )

  subparsers.add_parser(
    "download",
    help="Download release assets and update YAML files",
  )

  subparsers.add_parser(
    "upload",
    help="Upload release assets",
  )

  verify_parser = subparsers.add_parser(
    "verify",
    help="Verify release assets",
  )
  verify_parser.add_argument(
    "--version", "-v",
    help="Specific version to verify (defaults to package.json version)",
  )

  args = parser.parse_args()

  if args.command == "download":
    cmd_download()
  elif args.command == "upload":
    cmd_upload()
  elif args.command == "verify":
    verify_assets(args.version)


if __name__ == "__main__":
  try:
    main()
  except Exception as e:
    print(f"❌ Error: {e}", file=sys.stderr)
    sys.exit(1)
