#!/usr/bin/env bash
set -e

tag=$(git describe --abbrev=0)
name=founek2/iot-platform

docker build -t $name:$tag -t $name:latest .

docker login -u "$USER_CREDENTIALS_USR" -p "$USER_CREDENTIALS_PSW"
docker push $name:latest
docker push $name:$tag
