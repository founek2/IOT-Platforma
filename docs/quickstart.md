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
-   **AUTH_PORT** - listening port for API - [authorisation and authentication for RabbitMQ](https://github.com/rabbitmq/rabbitmq-auth-backend-http)
-   **DATABASE_URI** - connection URI to mongodb ex. `mongodb://userName:password@localhost:27017/db_name`
-   **JWT_PRIVATE_KEY** - path to JWT private key
-   **JWT_PUBLIC_KEY** - path to JWT public key
-   **JWT_EXPIRES_IN** - lifespan of JWT token [14d]
-   **MQTT_URL** - domain of running MQTT broker with protocol ex. mqtt://localhost
-   **MQTT_PORT** - port on which listen MQTT broker

[Optional]

-   **BODY_LIMIT** - maximal size of body in API request, value passed to library [bytes](https://www.npmjs.com/package/bytes)
-   **FIREBASE_ADMIN_PATH** - path to firebase account credentials file
-   **AGENDA_JOB_TYPES** - which agenda jobs are enabled separeted with comma - email, clean
-   **EMAIL_HOST** - smtp email server
-   **EMAIL_PORT** - port on which smtp listen, ssl/tls is required [465]
-   **EMAIL_USERNAME** - username to email account
-   **EMAIL_PASSWORD** - password to email account
-   **HOME_PAGE** - url of main page - ex. https://iotplatforma.cloud
-   **OAUTH_SEZNAM_CLIENT_SECRET**
-   **REACT_APP_OAUTH_SEZNAM_CLIENT_ID**
-   **REACT_APP_OATUH_REDIRECT_URI**

## Lokální vývoj

Pro spuštění aplikace pro lokální vývoj jsou potřeba tyto příkazy:

```
# instalace potřebných závislostí (node_modules)
yarn

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

# spustí testy
yarn test
```
