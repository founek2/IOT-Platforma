#!/usr/bin/env bash
set -e

tag=$(git describe --abbrev=0)
name=founek2/iot-platform
name_private="docker-registry-write.iotdomu.cz/iot-platform/server"

wget https://github.com/founek2/IOT-Platforma/releases/latest/download/assets.zip -O assets.zip

docker build -t $name:$tag -t $name:latest -t $name_private:$tag -t $name_private:latest --progress plain .

docker push $name:latest
docker push $name:$tag

docker push $name_private:latest
docker push $name_private:$tag