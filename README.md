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

## Start from source code

## Docker
```shell
cd docker
cp middleware.env.example middleware.env
docker compose -f docker-compose.middleware.yaml up -d
```

```shell
cd docker
docker compose up -d
docker compose down
```

## Docker Build
### web
```shell
make build-web
```
Web Docker image built successfully: pileax/pileax-web:latest

## Docker Run
### web
```shell
cd docker
docker compose up -d
```

Open http://localhost:21080 to view web.

### Reset
```shell
docker compose down
rm -rf volumes/db/data/
docker compose up -d
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
- [Anx Reader](https://github.com/Anxcye/anx-reader): A thoughtfully crafted e-book reader for book lovers.

## License
The MIT License (MIT). Please see [License File](LICENSE) for more information.
