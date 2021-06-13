FROM node:16-alpine3.11

RUN apk update && apk add openssh-keygen yarn openssl bash && mkdir /keys

RUN mkdir -p /var/www/platform
WORKDIR  /var/www/platform
COPY .  .
# RUN yarn && yarn pre && yarn build
# RUN yarn install --production
RUN ./docker-build.sh
COPY ./docker-entrypoint.sh .

CMD [ "./docker-entrypoint.sh" ]

