from PyInstaller.utils.hooks import collect_submodules

hiddenimports = []

hiddenimports += collect_submodules('app.api.routes')
hiddenimports += collect_submodules('app.extensions')
hiddenimports += collect_submodules('app.core.llm.models.chat')
