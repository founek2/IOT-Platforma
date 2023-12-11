#!/bin/bash
set -e

./generate-jwt-certs.sh

node modules/entrypoint/dist/index.js
