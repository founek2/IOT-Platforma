#!/bin/bash
set -e

export JWT_PRIVATE_KEY="${JWT_PRIVATE_KEY:-/keys/jwtRS256.key}"
export JWT_PUBLIC_KEY="${JWT_PUBLIC_KEY:-/keys/jwtRS256.key.pub}"

# Generate keys for JWT if not exists
if [ ! -f "$JWT_PRIVATE_KEY" ]; then
    ssh-keygen -t rsa -b 4096 -m PEM -f "$JWT_PRIVATE_KEY"
    openssl rsa -in "$JWT_PRIVATE_KEY" -pubout -outform PEM -out "$JWT_PUBLIC_KEY"
fi

pm2-runtime process.json
