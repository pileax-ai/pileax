# Electron

## Icons

### icongenie
Use [Icon Genie CLI](https://quasar.dev/icongenie/introduction) to generate icons.

```shell
yarn global add @quasar/icongenie
```
```shell
icongenie generate -m electron -i /path/to/icon.png
```

### magick
```shell
cd src-electron
magick -background transparent icons/icon.svg -define icon:auto-resize=16,32,48,64,128,256 icon.ico
```

### tray icon
```shell
magick -background transparent icons/icon.svg -resize 512x512 icons/tray-icon.png
```
