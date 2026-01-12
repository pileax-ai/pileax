from PyInstaller.utils.hooks import collect_all, collect_data_files, collect_submodules

datas, binaries, hiddenimports = collect_all("litellm")

hiddenimports += collect_submodules("litellm")
hiddenimports += collect_submodules("litellm.litellm_core_utils")

hiddenimports.extend(
    [
        "litellm.litellm_core_utils.tokenizers",
        "litellm.litellm_core_utils.llm_cost_calc",
        "litellm.litellm_core_utils.llm_cost_calc.utils",
    ]
)

datas += collect_data_files("litellm")
