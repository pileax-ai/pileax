import json
import os
import sys

from alembic.config import Config
from alembic.script import ScriptDirectory


def get_all_revisions():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    ini_path = os.path.join(base_dir, "alembic.ini")

    config = Config(ini_path)
    script = ScriptDirectory.from_config(config)

    revisions = [r.revision for r in script.walk_revisions()]
    # reverse array，from old to new: [v1, v2, ..., v10]
    return revisions[::-1]


if __name__ == "__main__":
    try:
        revs = get_all_revisions()
        print(json.dumps(revs))
    except Exception as e:
        sys.stderr.write(f"Error: {str(e)}\n")
        sys.exit(1)
