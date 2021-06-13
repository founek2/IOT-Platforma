#!/bin/bash


zip -r build.zip packages/backend/{distpackage.json} packages/backend-mqtt/{dist,package.json} packages/common/{lib,package.json} packages/framework-ui/{lib,package.json} packages/frontend/build


# Build
# Publish on github
echo "Publishing on Github..."
token="$USER_CREDENTIALS"
# Get the last tag name
tag=$(git describe --tags)
# Get the full message associated with this tag
message="$(git for-each-ref refs/tags/$tag --format='%(contents)')"
# Get the title and the description as separated variables
name=$(echo "$message" | head -n1)
description=$(echo "$message" | tail -n +3)
description=$(echo "$description" | sed -z 's/\n/\\n/g') # Escape line breaks to prevent json parsing problems
# Create a release
release=$(curl -XPOST -H "Authorization: token $token" --data "{\"tag_name\": \"$tag\", \"target_commitish\": \"master\", \"name\": \"$name\", \"body\": \"$description\", \"draft\": false, \"prerelease\": true}" https://api.github.com/repos/founek2/IOT-Platforma/releases)
# Extract the id of the release from the creation response
id=$(echo "$release" | sed -n -e 's/"id":\ \([0-9]\+\),/\1/p' | head -n 1 | sed 's/[[:blank:]]//g')
# Upload the artifact
curl -XPOST -H "Authorization: token $token" -H "Content-Type:application/octet-stream" --data-binary @build.zip https://uploads.github.com/repos/founek2/IOT-Platforma/releases/$id/assets?name=build.zip