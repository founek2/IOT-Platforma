#!/bin/bash
set -e

unzip -q assets.zip

# backport compatibility for react-scripts v3
cp packages/frontend/build/service-worker.js packages/frontend/build/sw.js

yarn install --production --cache-folder /tmp/.junk
rm -rf /tmp/.junk
