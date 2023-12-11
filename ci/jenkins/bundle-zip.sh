#!/usr/bin/env bash
set -e

# pack all release files
rm -f assets.zip
zip -qr assets.zip modules/backend/{dist,package.json} modules/backend-mqtt/{dist,package.json} modules/backend-auth/{dist,package.json}  modules/common/{lib,package.json} modules/entrypoint/{dist,package.json} modules/frontend/build package.json license.md yarn.lock