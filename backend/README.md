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
