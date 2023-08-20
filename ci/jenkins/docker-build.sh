#!/bin/bash
set -e

unzip -q assets.zip

# backport compatibility for react-scripts v3
cp packages/frontend/build/service-worker.js packages/frontend/build/sw.js

# Remove all occurences of linked packages by workspace: syntax
sed -i'' '/workspace:/d' packages/*/package.json
sed -i'' '/"packageManager":/d' package.json

yarn install --production --cache-folder /tmp/.junk
rm -rf /tmp/.junk
