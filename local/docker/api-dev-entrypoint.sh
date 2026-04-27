#!/bin/sh

set -eu

CA_CERT_PATH="/usr/local/share/ca-certificates/local-dev-ca.crt"

if [ -s "$CA_CERT_PATH" ]; then
  echo "Configuring Java and Maven to use custom CA certificate..."

  if command -v update-ca-certificates >/dev/null 2>&1; then
    update-ca-certificates
  fi

  if command -v keytool >/dev/null 2>&1; then
    keytool -delete -alias local-dev-ca -cacerts -storepass changeit >/dev/null 2>&1 || true
    keytool -importcert -noprompt -trustcacerts \
      -alias local-dev-ca \
      -file "$CA_CERT_PATH" \
      -cacerts \
      -storepass changeit
  fi
fi

echo "Starting API workspace from /workspace/api..."
cd /workspace/api

exec "$@"
