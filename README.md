# IoT Platform

[![Build Status](https://jenkins.iotdomu.cz/buildStatus/icon?job=IoT+Platform%2Frelease)](https://jenkins.iotdomu.cz/job/IoT%20Platform/job/release/)

[Documentation](https://founek2.github.io/IOT-Platform/)

## Up and running

### 1. Clone the hosting repo

To get started quickly, download the IoT-Platform-hosting repo as a starting point. It has everything you need to boot up your own IoT Platform server.

```bash
git clone https://github.com/founek2/IOT-Platform-hosting.git
cd IOT-Platform-hosting
```

Alternatively, you can download and extract the repo as a zip.

```bash
wget https://github.com/founek2/IOT-Platform-hosting/archive/refs/heads/master.zip
unzip master.zip
cd IOT-Platform-hosting-master
cp .env.example .env
```

In the downloaded directory you'll find two important file:

- docker-compose.yml - installs and orchestrates networking between your IoT Platform server, Mongo database and RabbitMQ (MQTT broker). It comes with some defaults that are ready to go, although you're free to tweak the configuration to match your needs
- .env.example - contains example configuration (enviroment variables) and options can be found in [documentation here](https://docs.iotplatforma.cloud/#/quickstart?id=enviroment-promněné).

### 2. Start the server

Once you are happy with configuration in your custom `.env`, you're ready to start up the server:

```bash
docker-compose up -d
```

When you run this command for the first time, it does the following:

Creates a Mongo database for data, InfluxDB for time-series data, Node-red for visual programming, all microServices
Starts the server on port 8050
You can now open browser and see the login screen. First user, who will register will be given admin permissions. Services:

- [http://localhost](http://localhost) - platform
- [http://localhost:81](http://localhost:81) - NodeRed
- [http://localhost:81](http://localhost:82) - INFLUXDB_PORT
- [localhost:1883](http://localhost:1883) - MQTT
- [localhost:8883](http://localhost:8883) - MQTT over TLS

# There is more

- Deno library <https://github.com/founek2/IOT-Platform-deno>
- Arduino library <https://github.com/founek2/IOT-Platform-arduino>
- Integrations <https://github.com/founek2/IOT-Platform-integration>
  - zigbee2mqtt
  - Frigate (NVR)
  - and much more...
