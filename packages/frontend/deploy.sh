#!/bin/bash

yarn build
rsync -a build/* free:/home/websites/iotdomu-frontend-ng/www/