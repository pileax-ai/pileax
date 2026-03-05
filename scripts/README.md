# Scripts

## Get alembic revisions

```shell
python scripts/get_alembic_revisions.py
```

## Bump version

```shell
python scripts/update_version.py 0.2.0

# or
yarn bump-version 0.2.0
```

## Release sync
Download release assets from Github and sync to R2

```shell
python scripts/release_sync.py download
python scripts/release_sync.py upload
python scripts/release_sync.py verify -v 0.1.0
```
