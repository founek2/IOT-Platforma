FROM rabbitmq:3-management-alpine

RUN apk update && apk add openssh-keygen git openssl make python3 &&  mkdir /keys

COPY ./config/ /etc/rabbitmq/
COPY ./docker-entrypoint.sh .
CMD [ "./docker-entrypoint.sh" ]