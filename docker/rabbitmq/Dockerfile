FROM rabbitmq:3-management-alpine

RUN apk update && apk add openssh-keygen git openssl make python3 &&  mkdir /keys /keys/mqtt
RUN cd / && git clone https://github.com/michaelklishin/tls-gen tls-gen && cd tls-gen/basic && \
    make && make info && ls -l ./result && \
    cp ./result/ca_certificate.pem ./result/server_certificate.pem ./result/server_key.pem /keys/mqtt

COPY ./config/ /etc/rabbitmq/