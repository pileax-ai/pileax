#!/bin/sh

export API_BASE_URL="${API_BASE_URL:-http://localhost:21000/api/v1/}"

envsubst '$API_BASE_URL' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf

nginx -g 'daemon off;'
