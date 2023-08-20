#!/usr/bin/env bash
set -e

# Build
# Publish on github
echo "Publishing on Github..."
token="$USER_CREDENTIALS_PSW"
# id=$(curl -s https://api.github.com/repos/founek2/IOT-Platforma/releases/tags/v2.0.0-beta | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")
# zip_id=$(curl -s https://api.github.com/repos/founek2/IOT-Platforma/releases/tags/v2.0.0-beta | python3 -c "import sys, json; print(json.load(sys.stdin)['assets'][0]['id'])")
id=$(curl -s https://api.github.com/repos/founek2/IOT-Platforma/releases/tags/v2.0.0-beta | jq -r '.id')
zip_id=$(curl -s https://api.github.com/repos/founek2/IOT-Platforma/releases/tags/v2.0.0-beta | jq -r '.assets[0].id')

# Replace the artifact
curl -XDELETE -H "Authorization: token $token" -H "Content-Type:application/octet-stream" -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/founek2/IOT-Platforma/releases/assets/$zip_id
curl -XPOST -H "Authorization: token $token" -H "Content-Type:application/octet-stream" -H "Accept: application/vnd.github.v3+json" --data-binary @assets.zip https://uploads.github.com/repos/founek2/IOT-Platforma/releases/$id/assets?name=assets.zip
