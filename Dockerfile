FROM node:16-alpine3.11

RUN apk update && apk add openssh-keygen yarn openssl bash && mkdir /keys

RUN mkdir -p /var/www/platform
WORKDIR  /var/www/platform
COPY .  .
# RUN yarn && yarn pre && yarn build
# RUN yarn install --production
RUN yarn && yarn global add pm2 && \
    yarn clean && yarn pre && yarn build && \
    mv packages/frontend/build /var/www/frontend-build && rm -rf packages/frontend && \
    yarn install --production && yarn cache clean
COPY ./docker-entrypoint.sh .

CMD [ "./docker-entrypoint.sh" ]

