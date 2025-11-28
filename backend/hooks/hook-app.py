from PyInstaller.utils.hooks import collect_submodules

hiddenimports = []

hiddenimports += collect_submodules('app.api.routes')
hiddenimports += collect_submodules('app.extensions')
