#!/bin/sh
set -e

export API_BASE_URL="${API_BASE_URL:-http://localhost:8000/api/v1/}"

envsubst '$API_BASE_URL' < /app/config.js.template > /usr/share/nginx/html/config.js

exec "$@"
