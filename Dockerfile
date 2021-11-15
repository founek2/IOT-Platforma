FROM node:16-alpine3.11

RUN apk add --no-cache openssh-keygen yarn openssl bash unzip && mkdir /keys

RUN mkdir -p /var/www/platform
WORKDIR  /var/www/platform
COPY ./ci  ./ci
# RUN yarn && yarn pre && yarn build
# RUN yarn install --production
ADD https://github.com/founek2/IOT-Platforma/releases/latest/download/assets.zip assets.zip
RUN ./ci/jenkins/docker-build.sh
COPY ./ci/jenkins/docker-entrypoint.sh .

CMD [ "./docker-entrypoint.sh" ]

