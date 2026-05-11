# -*- mode: python ; coding: utf-8 -*-
import os
from PyInstaller.utils.hooks import collect_all

datas = [
    ('.env.example', '.'),
    ('alembic.ini', '.'),
    ('alembic', 'alembic'),
    ('conf', 'conf')
]
binaries = []
hiddenimports = []
tmp_ret = collect_all('passlib')
datas += tmp_ret[0]; binaries += tmp_ret[1]; hiddenimports += tmp_ret[2]

a = Analysis(
    ['app/main.py'],
    pathex=[],
    binaries=binaries,
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=['hooks'],
    hooksconfig={},
    runtime_hooks=[],
    excludes=['mypy', 'boto3', 'botocore', 's3transfer'],
    noarchive=False,
    optimize=0,
)

pyz = PYZ(a.pure)

target_arch = os.environ.get('TARGET_ARCH', None)
exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='runnable',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=target_arch,
    upx=False,
    codesign_identity=None,
    entitlements_file=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='runnable',
)
