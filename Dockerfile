FROM node:16-alpine3.11

RUN apk update && apk add openssh-keygen yarn git openssl make python3

RUN mkdir /keys /keys/mqtt /keys/platform
RUN cd /keys/platform && \
    ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key && \
    openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub

RUN cd / && git clone https://github.com/michaelklishin/tls-gen tls-gen && cd tls-gen/basic && \
    make && make info && ls -l ./result && \
    cp ./result/ca_certificate.pem ./result/server_certificate.pem ./result/server_key.pem /keys/mqtt

RUN mkdir -p /var/www/platform
WORKDIR  /var/www/platform
COPY .  .
RUN ls -l /var/www/platform
RUN yarn && yarn pre && yarn build

