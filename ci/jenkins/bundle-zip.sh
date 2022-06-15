#!/usr/bin/env bash
set -e

# pack all release files
ls -l packages
ls -l packages/backend-auth
zip -qr assets.zip packages/backend/{dist,package.json} packages/backend-mqtt/{dist,package.json} packages/backend-auth/{dist,package.json}  packages/common/{lib,package.json} packages/framework-ui/{lib,package.json} packages/frontend/build package.json license.md process.json yarn.lock