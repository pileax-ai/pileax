#! /bin/sh

# ==============================================================================
# Description: Run and build scripts
# ==============================================================================
PROMPT=INFO
APP="PileaX"

## Usage
## -----------------------------------------------------------------------------
if [ $# -lt 1 ]
then
    echo "Usage: `basename "$0"` macos|win|linux"
    exit 1
fi

## Params
## -----------------------------------------------------------------------------
platform=$1

if [ -z $platform ]
then
  platform="macos"
fi

## Func
## -----------------------------------------------------------------------------
build_win() {
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
  --collect-all passlib \
  --additional-hooks-dir=hooks \
  --noconfirm \
  app/main.py
}

## Main
## -----------------------------------------------------------------------------
case $platform in
  win)
    build_win
    ;;
  *)
    build_macos
    ;;
esac
