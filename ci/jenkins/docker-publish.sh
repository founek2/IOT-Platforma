#!/usr/bin/env bash
set -e

tag=$(git describe --abbrev=0)
name=founek2/iot-platform
name_private="docker-registry-write.iotdomu.cz/iot-platform/server"

wget https://github.com/founek2/IOT-Platform/releases/latest/download/assets.zip -O assets.zip

docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 -t $name:$tag -t $name:latest -t $name_private:$tag -t $name_private:latest --push --progress plain .