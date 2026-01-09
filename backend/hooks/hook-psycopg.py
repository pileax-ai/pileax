from PyInstaller.utils.hooks import (
    collect_all,
    collect_submodules,
    collect_dynamic_libs,
)

datas, binaries, hiddenimports = collect_all("psycopg")

hiddenimports += collect_submodules("psycopg")

hiddenimports += [
    "psycopg_binary",
    "psycopg_c",
    "psycopg.pq",
    "psycopg.pq._pq",
]

binaries += collect_dynamic_libs("psycopg")
