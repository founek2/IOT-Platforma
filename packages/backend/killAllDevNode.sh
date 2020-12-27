ps -ef | grep 'ts-node-dev' | grep -v grep | awk '{print $2}' | xargs -r kill -9 
