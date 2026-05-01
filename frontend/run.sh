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
    echo "Usage: `basename "$0"` analyze|foliate"
    exit 1
fi

## Params
## -----------------------------------------------------------------------------
command=$1

## Func
## -----------------------------------------------------------------------------
run_analyze() {
  export analyze=true
  yarn build
}

run_foliate() {
  frontend_dir=$PWD
  foliate_dir="$frontend_dir/src/js/foliate-js"
  foliate_backup_dir="$frontend_dir/src/js/foliate-js.backup"
  foliate_src_dir="$frontend_dir/../../foliate-js"

  # backup
  echo "Backup foliate"
  mv $foliate_dir $foliate_backup_dir

  # update
  echo "Update foliate"
  cp -rf $foliate_src_dir $foliate_dir
  rm -rf "$foliate_dir/.github"
  cp -rf "$foliate_dir/vendor" "$frontend_dir/public/"

  # remove mjs.map
  rm -rvf "$frontend_dir"/public/vendor/pdfjs/*.mjs.map
}

## Main
## -----------------------------------------------------------------------------
case $command in
  analyze)
    run_analyze
    ;;
  foliate)
    run_foliate
    ;;
  *)
    ;;
esac
