# ACT
> Run GitHub actions locally by specifying the event name

## build-backend.yml
```shell
act \
  -W .github/workflows/build-backend.yml \
  --matrix '{"os":"ubuntu-latest"}' \
  -P ubuntu-latest=catthehacker/ubuntu:act-latest \
  --container-architecture linux/amd64 \
  --env SKIP=true \
  --reuse
```

## ci.yml
```shell
act \
  -W .github/workflows/ci.yml \
  -P ubuntu-latest=catthehacker/ubuntu:act-latest \
  --container-architecture linux/amd64 \
  --env SKIP=true \
  --reuse
```

## db-migration-test.yml

### Static Offline Validation
- Dry-run Upgrade
- Dry-run Downgrade

### Integration Online Testing
- Spin up a real PostgreSQL and Redis instance.
- Live Migration: Executes `alembic upgrade head` against the live Docker database.

```shell
act \
  -W .github/workflows/db-migration-test.yml \
  -P ubuntu-latest=catthehacker/ubuntu:act-latest \
  --container-architecture linux/amd64 \
  --env SKIP=true \
  --reuse
```

## db-migration-matrix-test.yml

- [ ] Todo: matrix test

```shell
act \
  -W .github/workflows/db-migration-matrix-test.yml \
  -j 2 \
  -P ubuntu-latest=catthehacker/ubuntu:act-latest \
  --container-architecture linux/amd64 \
  --env SKIP=true \
  --reuse
```
