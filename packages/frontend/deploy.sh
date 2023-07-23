#!/bin/bash

yarn build
rsync -a build/* free:/var/data/websites/ng.iotdomu.cz/