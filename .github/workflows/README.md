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
