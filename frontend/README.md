# PileaX

PileaX AI

## Development

### Quasar cli
```shell
yarn global add @quasar/cli
```

### Install the dependencies
```bash
yarn

# electron rebuild
node_modules/.bin/electron-rebuild
```

### Start the app
```bash
yarn dev
yarn dev-electron
yarn dev-tauri
```

### Lint the files
```bash
yarn lint

# fix
yarn lint-fix
```

## Build

```bash
yarn build
yarn build:electron
yarn build:tauri
```

```shell
docker build -t pileax-web .

# start
docker run -d -p 8080:80 --name pileax-web-123 pileax-web

# stop
docker stop pileax-web-123
```

## Others
### project structure
```shell
tree -d -L 3 -I "node_modules|dist|public|types" pileax
```

```shell
pileax
├── frontend
│   ├── core
│   ├── env
│   ├── src
│   ├── src-electron
│   └── src-tauri
├── packages
│   └── icon
└── server
```
