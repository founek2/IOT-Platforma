#!/bin/bash

BE_PATH="$IOT_DEPLOY_PATH/backend/backend/index.js"
BE_MQTT_PATH="$IOT_DEPLOY_PATH/backend/backend-mqtt/index.js"

SCRIPTPATH="$(
    cd "$(dirname "$0")" >/dev/null 2>&1
    pwd -P
)"

export NODE_ENV=production

build_src() {
    echo "Building optimized frontend..."
    yarn buildFE >/dev/null
    echo "Transpiling backend..."
    yarn buildBE >/dev/null
    echo "Building done"
}

copy_fe() {
    echo "Copying frontend files..."
    rm -rf "$IOT_DEPLOY_PATH"/frontend/*
    cp -r build/* "$IOT_DEPLOY_PATH"/frontend
}

copy_be() {
    echo "Copying backend files..."
    rm -rf "$IOT_DEPLOY_PATH"/backend/*
    cp -r distBE/* "$IOT_DEPLOY_PATH"/backend
}

copy_docs() {
    echo "Copying docs files..."
    rm -rf "$IOT_DEPLOY_PATH"/docs/*
    cp -r docs/* "$IOT_DEPLOY_PATH"/docs
}

copy_all() {
    copy_fe
    copy_be
    copy_docs
}

check_forever() {
    if ! [ -x "$(command -v forever)" ]; then
        echo 'Error: forever is not installed.' >&2
        exit 1
    fi
}

stop_processes() {
    echo "Stoping running processes..."

    if forever list | grep "$BE_PATH" >/dev/null; then
        forever stop "$BE_PATH" >/dev/null
        echo "Stopped $BE_PATH"
    fi
    if forever list | grep "$BE_MQTT_PATH" >/dev/null; then
        forever stop "$BE_MQTT_PATH" >/dev/null
        echo "Stopped $BE_MQTT_PATH"
    fi
}

start_processes() {
    echo "Starting processes..."
    forever start "$BE_PATH" >/dev/null
    forever start "$BE_MQTT_PATH" >/dev/null
    echo "Started"
    forever list
}

if [ -z "$IOT_DEPLOY_PATH" ]; then
    echo "ERROR: variable IOT_DEPLOY_PATH is not defined" >&2
    exit 1
fi
if [ ! -d "$IOT_DEPLOY_PATH" ]; then
    echo "Deploy dir: $IOT_DEPLOY_PATH does not exists."
fi

if [ ! -d "$IOT_DEPLOY_PATH"/backend ]; then
    echo "Creating deploy dir: $IOT_DEPLOY_PATH/backend"
    mkdir "$IOT_DEPLOY_PATH"/backend || {
        echo "Deploy dir: $IOT_DEPLOY_PATH/backend can't create."
        exit 1
    }
fi

if [ ! -d "$IOT_DEPLOY_PATH"/frontend ]; then
    echo "Creating deploy dir: $IOT_DEPLOY_PATH/frontend"
    mkdir "$IOT_DEPLOY_PATH"/frontend || {
        echo "Deploy dir: $IOT_DEPLOY_PATH/frontend can't create."
        exit 1
    }
fi

if [ ! -d "$IOT_DEPLOY_PATH"/docs ]; then
    echo "Creating deploy dir: $IOT_DEPLOY_PATH/docs"
    mkdir "$IOT_DEPLOY_PATH"/docs || {
        echo "Deploy dir: $IOT_DEPLOY_PATH/docs can't create."
        exit 1
    }
fi

case "$1" in
deploy)
    yarn --modules-folder "$IOT_DEPLOY_PATH/node_modules" --prod install

    build_src
    copy_all
    ;;
build)
    build_src
    ;;
stop)
    check_forever

    stop_processes
    ;;
start)
    check_forever

    start_processes
    ;;
restart)
    check_forever

    stop_processes

    start_processes
    ;;
copy)
    copy_all
    ;;
copyFE)
    copy_fe
    ;;
copyBE)
    copy_be
    ;;
copyDocs)
    copy_docs
    ;;
*)
    echo "Usage: $NAME {start|stop|restart|build|deploy|copy|copyFE|copyBE|copyDocs}" >&2
    exit 3
    ;;
esac
