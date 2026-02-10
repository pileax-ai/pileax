#!/bin/sh
set -e

# Default environment variables
export API_BASE_URL="${API_BASE_URL:-http://localhost:9620/api/v1}"
export COLLAB="${COLLAB:-true}"
export COLLAB_PROVIDER_URL="${COLLAB_PROVIDER_URL:-ws://localhost:9621}"

# List all variables to be substituted to avoid accidental overwriting of other shell variables
# Use '$' before each variable name in the list
envsubst '$API_BASE_URL,$COLLAB,$COLLAB_PROVIDER_URL' \
    < /app/config.js.template \
    > /usr/share/nginx/html/config.js

# Execute the passed command (usually nginx -g 'daemon off;')
exec "$@"
