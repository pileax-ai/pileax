# 🚀 Backend

Backend is built on top of [FastAPI](https://fastapi.tiangolo.com/).

## Dev

### Install Dependencies
the dependencies are managed with [uv](https://docs.astral.sh/uv/), from ./backend/ you can install all the dependencies with:
```shell
uv sync
```
Then you can activate the virtual environment with:
```shell
source .venv/bin/activate
```

### Star server
```shell
fastapi run --reload app/main.py

# or
python app/main.py
```

## Config
### Generate Secret Keys
Some environment variables in the .env file have a default value of changethis.

You have to change them with a secret key, to generate secret keys you can run the following command:

```angular2html
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Build
### Mac
```shell
uv sync
uv add --dev pyinstaller
uv run pyinstaller \
  --onedir \
  --name runnable \
  --add-data ".env:.env" \
  --collect-all passlib \
  app/main.py
```
The results are available in: ./dist/runnable

### Windows
```shell
# Build docker image
cd docker
docker build -f windows.Dockerfile -t pyinstaller-windows .
docker build  --platform linux/amd64 -f windows.Dockerfile -t pyinstaller-windows .

# build
./run.sh win
```

```shell
docker build --platform windows/amd64 -f docker/Dockerfile.win -t pyinstaller-windows .
```
