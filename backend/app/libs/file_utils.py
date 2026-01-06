from pathlib import Path

from app.configs import app_config


def get_root_dir(*paths: str) -> str:
    """
    获取项目根目录，自动缓存结果。
    支持附加路径：get_root_dir('app', 'config', 'settings.py')
    """
    base_dir = Path(__file__).resolve().parents[2]  # 上两级目录
    if paths:
        return str(base_dir.joinpath(*paths))
    return str(base_dir)


def get_cache_dir(*paths: str) -> str:
    return get_root_dir(app_config.CACHE_ROOT, *paths)
