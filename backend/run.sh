#! /bin/sh

# ==============================================================================
# Description: Run and build scripts
# ==============================================================================
LEVEL=INFO
APP="PileaX"

## Func
## -----------------------------------------------------------------------------
detect_os() {
    local uname_out
    uname_out=$(uname -s 2>/dev/null || echo "")

    case "$uname_out" in
        Darwin)
            echo "macos"
            ;;
        Linux)
            echo "linux"
            ;;
        CYGWIN*|MINGW*|MSYS*)
            # Git Bash / MinGW / MSYS / Cygwin
            echo "windows"
            ;;
        "")
            echo "windows"
            ;;
        *)
            echo "unknown"
            ;;
    esac
}

build_windows() {
  echo "Build for windows ..."
  source .venv/bin/activate

  docker run --rm --platform linux/amd64 -v $(pwd):/app -w /app pyinstaller-windows \
      uv run pyinstaller \
      --onedir \
      --name runnable \
      --add-data ".env:.env" \
      --collect-all passlib \
      --noconfirm \
      app/main.py
}

build_macos() {
  echo "Build for macos ..."
  source .venv/bin/activate
  uv sync
  uv add --dev pyinstaller
  uv run pyinstaller \
  --onedir \
  --name runnable \
  --add-data ".env:.env" \
  --add-data "alembic.ini:." \
  --add-data "alembic:alembic" \
  --add-data "conf:conf" \
  --collect-all passlib \
  --additional-hooks-dir=hooks \
  --noconfirm \
  app/main.py
}


## Main
## -----------------------------------------------------------------------------
platform=$1

if [ -z $platform ]
then
  platform=$(detect_os)
fi

echo "$APP: Build backend runnable for $platform"
case $platform in
  win)
    build_win
    ;;
  *)
    build_macos
    ;;
esac
