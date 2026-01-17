# Alembic
Generic single-database configuration.

## Generate
```shell
alembic revision --autogenerate -m "v0.0.3"
```
Open the schema files to check if it is correct (manual fine-tuning may be required sometimes):
- imports
- UniqueConstraint name
- enum
- default value
- server_default
- foreign key name

### Constraint must have a name
```js
sa.UniqueConstraint('tenant_id', 'uuid', name='unique_tenant_book')
```

Do not use `unique=True` in model definition, use:
```python
__table_args__ = (UniqueConstraint("email", name="unique_email"),)
```

## Run migration
```shell
alembic upgrade head
```

## View migrations
```shell
alembic current | heads | history
```
