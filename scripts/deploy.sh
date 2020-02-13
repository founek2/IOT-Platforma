#!/bin/bash

BE_PATH="$IOT_DEPLOY_PATH/backend/backend/index.js"
BE_MQTT_PATH="$IOT_DEPLOY_PATH/backend/backend-mqtt/index.js"

SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

export NODE_ENV=production

build_src() {
    echo "Building optimized frontend..."
    yarn build > /dev/null
    echo "Transpiling backend..."
    yarn buildBE > /dev/null
    echo "Building done"
}

deploy_fe() {
    echo "Copying frontend files..."
    rm -rf "$IOT_DEPLOY_PATH"/frontend/*
    cp -r build/* "$IOT_DEPLOY_PATH"/frontend
}

deploy_be() {
    echo "Copying backend files..."
    rm -rf "$IOT_DEPLOY_PATH"/backend/*
    cp -r distBE/* "$IOT_DEPLOY_PATH"/backend
}

deploy_docs() {
    echo "Copying docs files..."
    rm -rf "$IOT_DEPLOY_PATH"/docs/*
    cp -r docs/* "$IOT_DEPLOY_PATH"/docs
}

check_forever() {
    if ! [ -x "$(command -v forever)" ]; then
    echo 'Error: forever is not installed.' >&2
    exit 1
    fi
}

stop_processes() {
    forever list | grep "$BE_PATH" | echo
    if forever list | grep "$BE_PATH" >/dev/null;then
        forever stop "$BE_PATH"
    else
        echo "No backend process found"
    fi
    if forever list | grep "$BE_MQTT_PATH" >/dev/null;then
        forever stop "$BE_MQTT_PATH"
    else
       echo "No backend-mqtt process found"
    fi
}

start_processes() {
    echo "Starting processes..."
    forever start "$BE_PATH" >/dev/null
    forever start "$BE_MQTT_PATH">/dev/null
    echo "Started"
    forever list
}

deploy_all() {
    build_src

    deploy_fe

    deploy_be

    deploy_docs
}

if [ -z "$IOT_DEPLOY_PATH" ];then
    echo "ERROR: variable IOT_DEPLOY_PATH is not defined" >&2
    exit 1
fi
if [[ ! -d "$IOT_DEPLOY_PATH" ]]
then
    echo "Deploy dir: $IOT_DEPLOY_PATH does not exists."
fi

if [[ ! -d "$IOT_DEPLOY_PATH"/backend ]]
then
    echo "Trying to create dir: $IOT_DEPLOY_PATH/backend"
    mkdir "$IOT_DEPLOY_PATH"/backend || { echo "Deploy dir: $IOT_DEPLOY_PATH/backend can't create."; exit 1; }
fi
if [[ ! -d "$IOT_DEPLOY_PATH"/frontend ]]
then
    echo "Trying to create dir: $IOT_DEPLOY_PATH/frontend"
    mkdir "$IOT_DEPLOY_PATH"/frontend || { echo "Deploy dir: $IOT_DEPLOY_PATH/frontend can't create."; exit 1; }
fi
if [[ ! -d "$IOT_DEPLOY_PATH"/docs ]]
then
    echo "Trying to create dir: $IOT_DEPLOY_PATH/docs"
    mkdir "$IOT_DEPLOY_PATH"/docs || { echo "Deploy dir: $IOT_DEPLOY_PATH/docs can't create."; exit 1; }
fi

case "$1" in
	deploy)
        #yarn --cwd "$SCRIPTPATH/../src/modules/backend" --modules-folder "$IOT_DEPLOY_PATH/node_modules" --prod install 
        
        yarn --modules-folder "$IOT_DEPLOY_PATH/node_modules" --prod install 
        deploy_all
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
    run)
        check_forever

        build_all

        stop_processes

        start_processes
		;;
    *)
		echo "Usage: $NAME {start|stop|restart|build|deploy|run}" >&2
		exit 3
		;;
esac