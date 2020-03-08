#!/bin/bash

# -u substitude with parametr, for undefined parametr expansion shall fail ${#parameter}
# -e when any command fails, the script emmediately exit
set -u

SCRIPTPATH="$(
    cd "$(dirname "$0")" >/dev/null 2>&1
    pwd -P
)"
PREFIX=${SCRIPTPATH}/..
export IOT_IMAGES_PATH=${SCRIPTPATH}/../public/images
export IOT_CONFIG=${SCRIPTPATH}/../src/modules/backend/test/resources/configBE.js
export NODE_ENV=development

BE_TEST_PATH=${PREFIX}/src/modules/backend/test
BE_MQTT_TEST_PATH=${PREFIX}/src/modules/backend-mqtt/test
FE_TEST_PATH=${PREFIX}/src/modules/frontend/test
FRAMEWORK_TEST_PATH=${PREFIX}/src/modules/framewrok/test
FRAMEWORK_UI_TEST_PATH=${PREFIX}/src/modules/framework-ui/test

# prepare folder for testing
rm -rf /tmp/images
mkdir -p /tmp/images/devices

TMUX_SESSION="Testing BE server"
run_server(){
    tmux kill-session -t "$TMUX_SESSION" > /dev/null 2>&1
    tmux new -s "$TMUX_SESSION" -d 'yarn babel-node ./src/modules/backend/src/index.js'
}

stop_server() {
    tmux kill-session -t "$TMUX_SESSION"
}

check_running() {
    yarn wait-port -t 10000 localhost:4545  # should load port number from IOT_CONFIG
    if [ $? != 0 ];then
        echo "Cant start server"
        exit 1
    fi;
}

case "$1" in
all-results)
    run_server

    check_running
    yarn mochaReport \
    "$BE_TEST_PATH" \
    "$BE_MQTT_TEST_PATH" \
    "$FRAMEWORK_UI_TEST_PATH"

    stop_server
    ;;
all)
    run_server

    check_running
    yarn mocha \
    "$BE_TEST_PATH" \
    "$BE_MQTT_TEST_PATH" \
    "$FRAMEWORK_UI_TEST_PATH"

    stop_server
    ;;
FE)
    yarn mocha "$FE_TEST_PATH"
    ;;
BE)
    run_server

    check_running
    yarn mocha "$BE_TEST_PATH"

    stop_server
    ;;
BE-mqtt)
    run_server

    check_running
    yarn mocha "$BE_MQTT_TEST_PATH"

    stop_server
    ;;
f)
    yarn mocha "$FRAMEWORK_TEST_PATH"
    ;;
f-ui)
    yarn mocha "$FRAMEWORK_UI_TEST_PATH"
    ;;
*)
    echo "Usage: {all|all-results|BE|BE-mqtt|FE|f|f-ui}" >&2
    exit 3
    ;;
esac
