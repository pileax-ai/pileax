from functools import lru_cache
from pathlib import Path


@lru_cache(maxsize=1)
def get_root_dir(*paths: str) -> str:
    """
    获取项目根目录，自动缓存结果。
    支持附加路径：get_root_dir('app', 'config', 'settings.py')
    """
    base_dir = Path(__file__).resolve().parents[2]  # 上两级目录
    if paths:
        return str(base_dir.joinpath(*paths))
    return str(base_dir)
