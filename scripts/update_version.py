import re
import sys
from pathlib import Path

def update_version(new_version: str):
  """
  Updates the version string across multiple configuration files in the monorepo.
  Supported files: package.json, pyproject.toml, and Makefile.
  """
  # Define file paths and their logical keys
  files = {
    "root_json": "package.json",
    "frontend_json": "frontend/package.json",
    "collab_json": "packages/collab/package.json",
    "backend_toml": "backend/pyproject.toml",
    "makefile": "Makefile"
  }

  print(f"🚀 Updating project version to: {new_version}")

  for key, path_str in files.items():
    path = Path(path_str)
    if not path.exists():
      print(f"⚠️  Skipping {path_str}: File not found.")
      continue

    content = path.read_text(encoding="utf-8")
    new_content = content

    # 1. Handle JSON files (match "version": "x.y.z")
    if path.suffix == ".json":
      pattern = r'("version"\s*:\s*")([^"]+)(")'
      new_content = re.sub(pattern, rf'\g<1>{new_version}\g<3>', content)

    # 2. Handle TOML files (match version = "x.y.z")
    elif path.suffix == ".toml":
      pattern = r'(version\s*=\s*")([^"]+)(")'
      new_content = re.sub(pattern, rf'\g<1>{new_version}\g<3>', content)

    # 3. Handle Makefile (match VERSION ?= x.y.z or VERSION = x.y.z)
    elif path.name == "Makefile":
      # Match VERSION followed by = or ?=
      pattern = r'(VERSION\s*[\??]=\s*)([^\s\n]+)'
      new_content = re.sub(pattern, rf'\g<1>{new_version}', content)

    # Save changes if modifications were made
    if content != new_content:
      path.write_text(new_content, encoding="utf-8")
      print(f"✅  Updated {path_str}")
    else:
      print(f"ℹ️  No change needed for {path_str} (already up to date).")

if __name__ == "__main__":
  # Validate command line arguments
  if len(sys.argv) < 2:
    print("❌ Usage: python update_version.py <new_version>")
    sys.exit(1)

  version_input = sys.argv[1]

  # Basic semantic versioning validation (x.y.z)
  if not re.match(r"^\d+\.\d+\.\d+$", version_input):
    print(f"⚠️  Warning: '{version_input}' does not strictly follow semantic versioning (x.y.z).")

  try:
    update_version(version_input)
  except Exception as e:
    print(f"💥  Critical error updating versions: {e}")
    sys.exit(1)
