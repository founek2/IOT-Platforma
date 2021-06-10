#!/bin/bash
set -e

if [ ! -f "/keys/server_key.pem" ]; then
    cd / && git clone https://github.com/michaelklishin/tls-gen tls-gen && cd tls-gen/basic &&
        make &&
        cp ./result/ca_certificate.pem ./result/server_certificate.pem ./result/server_key.pem /keys/
fi

rabbitmq-server
