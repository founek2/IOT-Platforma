#!/bin/bash
set -e

if  [ -z "$JWT_PRIVATE_KEY" ] || [ -z "$JWT_PUBLIC_KEY" ]; then
    echo "You have to specify JWT_PRIVATE_KEY and JWT_PUBLIC_KEY variable"
    exit 1;
fi

KEY_PRIVATE="$JWT_PRIVATE_KEY"
KEY_PUBLIC="$JWT_PUBLIC_KEY"



# Generate keys for JWT if not exists
if [ ! -f "$KEY_PRIVATE" ]; then
    ssh-keygen -t rsa -b 4096 -m PEM -f "$KEY_PRIVATE"
    openssl rsa -in "$KEY_PRIVATE" -pubout -outform PEM -out "$KEY_PUBLIC"
fi

pm2-runtime process.json
