# Electron

## Icons

### icongenie
Use [Icon Genie CLI](https://quasar.dev/icongenie/introduction) to generate icons.

```shell
yarn global add @quasar/icongenie
icongenie generate -m electron -i /path/to/icon.png
```

### magick
Keep 128x128 and 256x256 image in icon.ico:
```shell
cd src-electron
magick -background transparent icons/icon.png -define icon:auto-resize=128,256 icon.ico
```

## tray icon
```shell
magick -background transparent icons/icon.svg -resize 512x512 icons/tray-icon.png
```
