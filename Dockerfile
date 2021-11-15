FROM node:16-alpine3.11

RUN apk add --no-cache openssh-keygen yarn openssl bash unzip && mkdir /keys

RUN mkdir -p /var/www/platform
WORKDIR  /var/www/platform
COPY ./ci  ./ci
RUN yarn global add --silent --cache-folder /tmp/.junk pm2 && rm -rf /tmp/.junk

# Download latest release
ADD https://github.com/founek2/IOT-Platforma/releases/latest/download/assets.zip assets.zip
# Unzip and install dependencies
RUN ./ci/jenkins/docker-build.sh

COPY ./ci/jenkins/docker-entrypoint.sh .

CMD [ "./docker-entrypoint.sh" ]

