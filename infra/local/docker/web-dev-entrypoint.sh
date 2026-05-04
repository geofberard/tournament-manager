#!/bin/sh

set -eu

CA_CERT_PATH="/usr/local/share/ca-certificates/local-dev-ca.crt"

if [ -s "$CA_CERT_PATH" ]; then
  echo "Configuring Node.js and npm to use custom CA certificate..."
  export NODE_EXTRA_CA_CERTS="$CA_CERT_PATH"
  npm config set cafile "$CA_CERT_PATH"

  if command -v update-ca-certificates >/dev/null 2>&1; then
    update-ca-certificates
  fi
fi

echo "Ensuring web dependencies are installed in /workspace/web..."
cd /workspace/web

if ! npm install --include=dev --no-audit --no-fund; then
  echo "npm install failed in /workspace/web, cleaning node_modules volume and retrying once..."
  if [ -d node_modules ]; then
    find node_modules -mindepth 1 -maxdepth 1 -exec rm -rf {} +
  fi
  npm ci --include=dev --no-audit --no-fund
fi

exec "$@"
