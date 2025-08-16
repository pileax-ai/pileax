FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

# 国内源（中科大）
#RUN sed -i 's|http://archive.ubuntu.com/ubuntu/|http://mirrors.ustc.edu.cn/ubuntu/|g' /etc/apt/sources.list

# 添加 i386 架构支持
RUN dpkg --add-architecture i386

# 更新并安装依赖
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-distutils python3-venv \
    wine64 wine32 unzip zip curl git build-essential locales && \
    locale-gen en_US.UTF-8

ENV LANG=en_US.UTF-8
ENV LC_ALL=en_US.UTF-8

# 安装 Python 包
RUN pip3 install --no-cache-dir pyinstaller passlib uv uvicorn

WORKDIR /app
