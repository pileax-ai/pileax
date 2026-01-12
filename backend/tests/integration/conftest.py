# Loading the .env file if it exists
import pathlib


def _load_env():
    current_file_path = pathlib.Path(__file__).absolute()
    # Items later in the list have higher precedence.
    files_to_load = [".env", "vdb.env"]

    env_file_paths = [current_file_path.parent / i for i in files_to_load]
    for path in env_file_paths:
        if not path.exists():
            continue

        from dotenv import load_dotenv

        # Set `override=True` to ensure values from `vdb.env` take priority over values from `.env`
        load_dotenv(str(path), override=True)


_load_env()
