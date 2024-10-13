#!/usr/bin/env bash
set -e

# Build
# Publish on github
echo "Publishing on Github..."
token="$USER_CREDENTIALS_PSW"
# Get the last tag name
tag=$(git describe --abbrev=0)
prev_tag=$(git describe --abbrev=0 $tag^)
# Get the full message associated with this tag
message="$(git for-each-ref refs/tags/$tag --format='%(contents)' | awk '{ if ($0 == "-----BEGIN PGP SIGNATURE-----") { exit 0 } print }')"
# Get the title and the description as separated variables
name=$(echo "$message" | head -n1)
description=$(echo "$message" | tail -n +3)
diff_commits=$(git log --pretty=oneline HEAD...$prev_tag)
description=$(echo "$description\n\n" "$diff_commits" | sed 's/$/\\n/g' | tr -d '\n' | sed 's/"//g') # Escape line breaks to prevent json parsing problems

# Create a release
echo "Creating releasing with tag_name=$tag"
# echo curl -XPOST -H "Authorization: token $token" -H "Accept: application/vnd.github.v3+json" --data "{\"tag_name\": \"$tag\", \"target_commitish\": \"release\", \"name\": \"$tag $name\", \"body\": \"$description\", \"draft\": false, \"prerelease\": false}" https://api.github.com/repos/founek2/IOT-Platform/releases
release=$(curl -XPOST -H "Authorization: token $token" -H "Accept: application/vnd.github.v3+json" --data "{\"tag_name\": \"$tag\", \"target_commitish\": \"release\", \"name\": \"$tag $name\", \"body\": \"$description\", \"draft\": false, \"prerelease\": false}" https://api.github.com/repos/founek2/IOT-Platform/releases)
# Extract the id of the release from the creation response
echo "release response"
echo $release

id=$(echo "$release" | grep -Eo '"id": ([^,]*),' | head -n1 | grep -Eo '[0-9]+')
echo "\nid"
echo $id

# Upload the artifact
curl -XPOST -H "Authorization: token $token" -H "Content-Type:application/octet-stream" -H "Accept: application/vnd.github.v3+json" --data-binary @assets.zip https://uploads.github.com/repos/founek2/IOT-Platform/releases/$id/assets?name=assets.zip
