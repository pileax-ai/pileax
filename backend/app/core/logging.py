"""
Logging module
"""
import logging
import os

from app.core.config import settings


def setup_logger():
    """
    初始化日志配置
    """
    app_name = settings.PROJECT_NAME
    filename = f'./log/console.log'
    format = f'%(asctime)s - %(levelname)s \t[{app_name}] %(process)d [%(name)s] %(funcName)s \t: %(message)s'
    datefmt = '%Y-%m-%d %H:%M:%S'

    # 创建日志目录
    if not os.path.exists(os.path.dirname(filename)):
        os.makedirs(os.path.dirname(filename))

    # 文件
    file_handler = logging.FileHandler(filename)
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(logging.Formatter(format, datefmt))

    # 控制台
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG)
    console_handler.setFormatter(logging.Formatter(format, datefmt))

    # 根日志记录器，不要再指定名称，以获取到默认的根日志记录器
    # 在其它模块使用时，可使用__name__指定名称
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)  # 全局默认级别
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

    # 测试
    # test()


def test():
    logger = logging.getLogger(__name__)
    logger.debug('This is a debug message: %s', 'debug')
    logger.info('This is an info message')
    logger.warning('This is a warning message')
    logger.error('This is an error message')
    logger.critical('This is a critical message')

    # json
    # logger.info(json.dumps(get_config('app'), indent=4, ensure_ascii=False))
