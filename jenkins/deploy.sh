#!/bin/bash
set -u -e 
echo 'shell scripts to deploy to server...'

shopt -s extglob

DEPLOY_PATH="$IOT_DEPLOY_PATH/backend/"

deployMaster(){
    set -u -e 
    shopt -s extglob

    sudo systemctl is-active --quiet iot-v3 && echo "Stoping service iot-v3" && sudo systemctl stop iot-v3 || echo "Service iot-v3 not running"
    sudo systemctl is-active --quiet iot-v3-mqtt && echo "Stoping service iot-v3-mqtt" && sudo systemctl stop iot-v3-mqtt || echo "Service iot-v3-mqtt not running"

    rm -rf "$DEPLOY_PATH"!(node_modules)
    rsync -a --exclude src/ --exclude node_modules/ packages "$DEPLOY_PATH"
    cp package.json "$DEPLOY_PATH"

    cd "$DEPLOY_PATH"
    yarn install --production

    echo "Starting service iot-v3"
    sudo systemctl start iot-v3
    echo "Starting service iot-v3-mqtt"
    sudo systemctl start iot-v3-mqtt
}
export -f deployMaster

deployDev(){
    set -u -e 
    shopt -s extglob
    
    sudo systemctl is-active --quiet iot-backend-test && echo "Stoping service iot-backend-test" && sudo systemctl stop iot-backend-test || echo "Service iot-backend-test not running"
    sudo systemctl is-active --quiet iot-backend-mqtt-test && echo "Stoping service iot-backend-mqtt-test" && sudo systemctl stop iot-backend-mqtt-test || echo "Service iot-backend-mqtt-test not running"

    rm -rf "$DEPLOY_PATH"/!(node_modules)
    rsync -a --exclude src/ --exclude node_modules/ packages "$DEPLOY_PATH"
    cp package.json "$DEPLOY_PATH"

    cd "$DEPLOY_PATH"
    yarn install --production

    echo "Starting service iot-backend-test"
    sudo systemctl start iot-backend-test
    echo "Starting service iot-backend-mqtt-test"
    sudo systemctl start iot-backend-mqtt-test
}
export -f deployDev

case "$1" in
  "master")
    scp -r packages/frontend/build/* proxy:/home/websites/iot-v3/www
    scp -r docs proxy:/home/websites/iot-v3/www

    sudo -u deployer bash -c "$(declare -f deployMaster); deployMaster"
    ;;
  "develop")
    scp -r packages/frontend/build/* proxy:/home/websites/v2iotplatformaDev/www
    scp -r docs proxy:/home/websites/v2iotplatformaDev/www

    sudo -u deployer-test bash -c "$(declare -f deployDev); deployDev"
    ;;
  *)
    echo "Invalid enviroment. Allowed are master|develop"
    exit 1
    ;;
esac



