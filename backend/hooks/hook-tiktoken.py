from PyInstaller.utils.hooks import collect_all, collect_data_files, collect_submodules

datas, binaries, hiddenimports = collect_all('tiktoken')

# 特别确保包含 tiktoken 的扩展模块
hiddenimports += ['tiktoken_ext.openai_public']

# 收集所有 tiktoken 的子模块（更彻底）
hiddenimports += collect_submodules('tiktoken')

# 确保编码文件等数据被包含
datas += collect_data_files('tiktoken')
