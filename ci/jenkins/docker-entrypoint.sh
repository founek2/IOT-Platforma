#!/bin/bash
set -e

./generate-jwt-certs.sh

pm2-runtime --raw process.json
