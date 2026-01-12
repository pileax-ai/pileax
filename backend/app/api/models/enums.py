import enum


class Status(enum.IntEnum):
    INACTIVE = -1
    PENDING = 0
    ACTIVE = 1
    ACCEPTED = 1


class Scope(enum.IntEnum):
    OFFLINE = 0
    OWNER = 1
    WORKSPACE = 2
    TENANT = 4
    PUBLIC = 8
