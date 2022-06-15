#!/usr/bin/env bash
set -e

tag=$(git describe --abbrev=0)
name=founek2/iot-platform
name_private="docker-registry.iotdomu.cz/iot-platform/server"

wget https://github.com/founek2/IOT-Platforma/releases/download/v2.0.0-beta/assets.zip -O assets.zip

docker build -t $name_private:$tag-beta -t $name_private:latest-beta --progress plain .

docker push $name_private:latest-beta
docker push $name_private:$tag-beta