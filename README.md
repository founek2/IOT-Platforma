[![Build Status](https://jenkins.iotplatforma.cloud/buildStatus/icon?job=IoT+Platform%2Frelease)](https://jenkins.iotplatforma.cloud/job/IoT%20Platform/job/release/)

[Dokumentace](https://docs.iotplatforma.cloud)

# Up and running

## 1. Clone the hosting repo

To get started quickly, download the IoT-Platforma-hosting repo as a starting point. It has everything you need to boot up your own IoT Platform server.

```
git clone https://github.com/founek2/IOT-Platforma-hosting.git
cd IOT-Platforma-hosting
```

Alternatively, you can download and extract the repo as a zip.

```
wget https://github.com/founek2/IOT-Platforma-hosting/archive/refs/heads/master.zip
unzip master.zip
cd IOT-Platforma-hosting-master
cp .env.example .env
```

In the downloaded directory you'll find two important file:

-   docker-compose.yml - installs and orchestrates networking between your IoT Platform server, Mongo database and RabbitMQ (MQTT broker). It comes with some defaults that are ready to go, although you're free to tweak the configuration to match your needs
-   .env.example - contains example configuration (enviroment variables) and options can be found in [documentation here](https://docs.iotplatforma.cloud/#/quickstart?id=enviroment-promněné).

## 2. Start the server

Once you are happy with configuration in your custom `.env`, you're ready to start up the server:

```
docker-compose up -d
```

When you run this command for the first time, it does the following:

Creates a Mongo database for data, InfluxDB for time-series data, Node-red for visual programming, all microServices
Starts the server on port 8050
You can now open browser and see the login screen. First user, who will register will be given admin permissions. Services:

-   [http://localhost](http://localhost) - platform
-   [http://localhost:81](http://localhost:81) - NodeRed
-   [http://localhost:81](http://localhost:82) - INFLUXDB_PORT
-   [localhost:1883](http://localhost:1883) - MQTT
-   [localhost:8883](http://localhost:8883) - MQTT over TLS
