FROM node:16-alpine3.11

RUN apk update && apk add openssh-keygen yarn openssl

RUN mkdir /keys /keys/platform
RUN cd /keys/platform && \
    ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key && \
    openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
ENV JWT_PRIVATE_KEY=/keys/platform/jwtRS256.key
ENV JWT_PUBLIC_KEY=/keys/platform/jwtRS256.key.pub


RUN mkdir -p /var/www/platform
WORKDIR  /var/www/platform
COPY .  .
# RUN yarn && yarn pre && yarn build
# RUN yarn install --production
RUN yarn && yarn global add pm2 && \
    yarn clean && yarn pre && yarn build && \
    mv packages/frontend/build /var/www/frontend-build && rm -rf packages/frontend && \
    yarn install --production && yarn cache clean


CMD [ "pm2-runtime", "process.json" ]

