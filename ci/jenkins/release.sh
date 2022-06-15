#!/usr/bin/env bash
set -e

# Build
# Publish on github
echo "Publishing on Github..."
token="$USER_CREDENTIALS_PSW"
# Get the last tag name
tag=$(git describe --abbrev=0)
# Get the full message associated with this tag
message="$(git for-each-ref refs/tags/$tag --format='%(contents)' | awk '{ if ($0 == "-----BEGIN PGP SIGNATURE-----") { exit 0 } print }')"
# Get the title and the description as separated variables
name=$(echo "$message" | head -n1)
description=$(echo "$message" | tail -n +3)
description=$(echo "$description" | sed 's/\n/\\n/g') # Escape line breaks to prevent json parsing problems

# Create a release
echo "Creating releasing with tag_name=$tag"
echo curl -XPOST -H "Authorization: token $token" -H "Accept: application/vnd.github.v3+json" --data "{\"tag_name\": \"$tag\", \"target_commitish\": \"release\", \"name\": \"$name\", \"body\": \"$description\", \"draft\": false, \"prerelease\": false}" https://api.github.com/repos/founek2/IOT-Platforma/releases
release=$(curl -XPOST -H "Authorization: token $token" -H "Accept: application/vnd.github.v3+json" --data "{\"tag_name\": \"$tag\", \"target_commitish\": \"release\", \"name\": \"$name\", \"body\": \"$description\", \"draft\": false, \"prerelease\": false}" https://api.github.com/repos/founek2/IOT-Platforma/releases)
# Extract the id of the release from the creation response
echo "release response"
echo $release

id=$(echo "$release" | grep -Eo '"id": ([^,]*),' | head -n1 | grep -Eo '[0-9]+')
echo "\nid"
echo $id

# Upload the artifact
curl -XPOST -H "Authorization: token $token" -H "Content-Type:application/octet-stream" -H "Accept: application/vnd.github.v3+json" --data-binary @assets.zip https://uploads.github.com/repos/founek2/IOT-Platforma/releases/$id/assets?name=assets.zip
