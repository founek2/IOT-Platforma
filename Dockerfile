FROM node:16-alpine3.11

RUN apk add --no-cache openssh-keygen yarn openssl bash unzip && mkdir /keys

RUN mkdir -p /var/www/platform
WORKDIR  /var/www/platform
COPY .  .
# RUN yarn && yarn pre && yarn build
# RUN yarn install --production
RUN ./ci/jenkins/docker-build.sh
COPY ./ci/jenkins/docker-entrypoint.sh .

CMD [ "./docker-entrypoint.sh" ]

