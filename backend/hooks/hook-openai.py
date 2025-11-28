from PyInstaller.utils.hooks import collect_all, collect_data_files, collect_submodules

datas, binaries, hiddenimports = collect_all('openai')

hiddenimports += collect_submodules('openai')

datas += collect_data_files('openai')
