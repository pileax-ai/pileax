# Alembic
Generic single-database configuration.

## Generate
```shell
alembic revision --autogenerate -m "v0.0.2"
```
Open the schema files to check if it is correct (manual fine-tuning may be required sometimes):
- imports
- enum
- default value
- server_default
- foreign key name

## Run migration
```shell
alembic upgrade head
```

## View migrations
```shell
alembic current | heads | history
```
