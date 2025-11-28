# PileaX

## Install

### tsc
```shell
yarn global add tsx dotenv-cli
```

## Dev
### Web
```shell
yarn dev
```

### Desktop
```shell
yarn dev:electron
```


## Build

### Web
```shell
yarn build
```
Output: frontend/dist/spa

### Desktop
```shell
# macOS
yarn build:desktop
```
Output: frontend/dist/electron

```shell
# Linux (deprecated)
docker run --rm \
  -v ${PWD}:/project \
  -v $HOME/.cache/electron:/root/.cache/electron \
  -v $HOME/.cache/electron-builder:/root/.cache/electron-builder \
  -w /project \
  electronuserland/builder \
  /bin/bash -c "yarn build:desktop:linux"

# Windows (deprecated)
docker run --rm \
  -v ${PWD}:/project \
  -v $HOME/.cache/electron:/root/.cache/electron \
  -v $HOME/.cache/electron-builder:/root/.cache/electron-builder \
  -w /project \
  electronuserland/builder:wine \
  /bin/bash -c "yarn build:desktop:win"
```

## Others
### project structure
```shell
tree -d -L 2 -I "node_modules|dist|public|types" pileax
```

```shell
pileax
├── frontend                # Quasar
│   ├── core
│   ├── env
│   ├── src
│   ├── src-electron
│   └── src-tauri
├── packages
│   └── icon
└── backend                  # FastAPI
    └── app
```

## Acknowledgements
- [Dify](https://github.com/langgenius/dify/): An open-source platform for developing LLM applications.
- [foliate-js](https://github.com/johnfactotum/foliate-js): Library for rendering e-books in the browser.
- [Yiitap](https://github.com/yiitap/yiitap): An AI powered, Notion-style WYSIWYG rich-text block-based editor built on top of [Tiptap](https://github.com/ueberdosis/tiptap) & [ProseMirror](https://github.com/ProseMirror/prosemirror).

## License
The MIT License (MIT). Please see [License File](LICENSE) for more information.
