# Quick start

## Generování JWT certifikátů

```
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
# Don't add passphrase
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
cat jwtRS256.key
cat jwtRS256.key.pub
```

## Enviroment promněné

Pro funkčnost aplikace je potřeba nastavit enviroment promněné, buď pomocí `.env` souboru v rootu projektu nebo v rámci systému. Promněné jsou následující:

-   **PORT** - listening port for backend API
-   **BODY_LIMIT** - maximal size of body in API request, value passed to library [bytes](https://www.npmjs.com/package/bytes)
-   **AUTH_PORT** - listening port for API - [authorisation and authentication for RabbitMQ](https://github.com/rabbitmq/rabbitmq-auth-backend-http)
-   **FIREBASE_ADMIN_PATH** - path to firebase account credentials file
-   **DATABASE_URL** - domain or ip address of running mongoDB [localhost]
-   **DATABASE_NAME** - name of database [IOTPlatform]
-   **DATABASE_USERNAME** - db user with read/write access to database
-   **DATABASE_PASSWORD** - password of db user
-   **DATABASE_PORT** - port, where mongoDB listen [27017]
-   **JWT_PRIVATE_KEY** - path to JWT private key
-   **JWT_PUBLIC_KEY** - path to JWT public key
-   **JWT_EXPIRES_IN** - lifespan of JWT token [14d]
-   **EMAIL_HOST** - smtp email server
-   **EMAIL_PORT** - port on which smtp listen, ssl/tls is required [465]
-   **EMAIL_USERNAME** - username to email account
-   **EMAIL_PASSWORD** - password to email account
-   **AGENDA_COLLECTION** - name of collection agenda will use
-   **AGENDA_JOB_TYPES** - which agenda jobs are enabled separeted with comma - email, clean
-   **MQTT_URL** - domain of running MQTT broker with protocol ex. mqtt://localhost
-   **MQTT_PORT** - port on which listen MQTT broker
-   **MQTT_USERNAME** - username, login to MQTT broker
-   **MQTT_PASSWORD** - password, login to MQTT broker

## Lokální vývoj

Pro spuštění aplikace pro lokální vývoj jsou potřeba tyto příkazy:

```
git clone https://github.com/founek2/IOT-Platforma.git iot-platforma
cd iot-platforma

# spustí interaktivní kompilaci balíčků framework-ui a common
yarn watch

# spustí server obsluhující API požadavky
yarn --cwd packages/backend dev

# server pro obsluhu MQTT zpráv + rabbitMQ authentication server + WebSocket
yarn --cwd packages/backend-mqtt dev

# webový server pro uživatelské rozhraní
yarn --cwd packages/frontend dev
```
