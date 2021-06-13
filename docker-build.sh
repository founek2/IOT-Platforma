#!/bin/bash
yarn global add --silent pm2

BUILD=false
for d in packages/frontend/build packages/backend/dist packages/backend-mqtt/dist
do
    if [ ! $(find $d -mmin -60 | wc -l) -ne 0 ]; then
        BUILD=true
    fi
done

if [ $BUILD = "true" ]; then
    echo "Build files are older than 60 minutes -> BUILDING..."
    yarn install --silent
    yarn clean && yarn pre && yarn build 
else
    echo "Build files are new, skipping build..."
fi

mv packages/frontend/build /var/www/frontend-build
rm -rf packages/frontend

yarn install --production && yarn cache clean