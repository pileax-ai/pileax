FROM python:3.12-slim AS base
LABEL maintainer="pileaxai@gmail.com"
WORKDIR /app

RUN pip install --no-cache-dir uv

FROM base AS packages

# Debian source
RUN echo "deb http://mirrors.aliyun.com/debian bullseye main contrib non-free" > /etc/apt/sources.list \
 && echo "deb http://mirrors.aliyun.com/debian-security bullseye-security main contrib non-free" >> /etc/apt/sources.list \
 && echo "deb http://mirrors.aliyun.com/debian bullseye-updates main contrib non-free" >> /etc/apt/sources.list


RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc python3-dev build-essential \
    || apt-get install -y --fix-missing \
    && rm -rf /var/lib/apt/lists/*

ENV UV_HTTP_TIMEOUT=300
ENV UV_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple
ENV PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple
COPY pyproject.toml uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev --no-install-project  --index-url https://pypi.tuna.tsinghua.edu.cn/simple --verbose

FROM base AS production

ENV TZ=UTC
ENV LANG=en_US.UTF-8
ENV LC_ALL=en_US.UTF-8
ENV PYTHONIOENCODING=utf-8

WORKDIR /app
COPY --from=packages /app/.venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

COPY . /app/

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
