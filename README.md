# PileaX

## Install

### tsc
```shell
yarn global add tsx dotenv-cli
```

## Scripts

### lint

### Build

#### Web
```shell
build
```

#### Desktop
```shell
# macOS
yarn build:desktop

# Linux
docker run --rm \
  -v ${PWD}:/project \
  -v $HOME/.cache/electron:/root/.cache/electron \
  -v $HOME/.cache/electron-builder:/root/.cache/electron-builder \
  -w /project \
  electronuserland/builder \
  /bin/bash -c "yarn build:desktop:linux"

# Windows
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
├── frontend                # Quasar框架
│   ├── core
│   ├── env
│   ├── src
│   ├── src-electron
│   └── src-tauri
├── packages
│   └── icon
└── server                  # Express
    └── src
```

## Acknowledgements
- [Dify](https://github.com/langgenius/dify/): An open-source platform for developing LLM applications.
- [foliate-js](https://github.com/johnfactotum/foliate-js): Library for rendering e-books in the browser.
- [Yiitap](https://github.com/yiitap/yiitap): An AI powered, Notion-style WYSIWYG rich-text block-based editor built on top of [Tiptap](https://github.com/ueberdosis/tiptap) & [ProseMirror](https://github.com/ProseMirror/prosemirror).

## License
The MIT License (MIT). Please see [License File](LICENSE) for more information.
