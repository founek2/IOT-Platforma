#!/bin/bash
set -e

KEY_PRIVATE="$JWT_PRIVATE_KEY"
KEY_PUBLIC="$JWT_PUBLIC_KEY"

# Generate keys for JWT if not exists
if [ ! -f "$KEY_PRIVATE" ]; then
    ssh-keygen -t rsa -b 4096 -m PEM -f "$KEY_PRIVATE"
    openssl rsa -in "$KEY_PRIVATE" -pubout -outform PEM -out "$KEY_PUBLIC"
fi

pm2-runtime process.json
