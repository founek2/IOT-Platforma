[![Build Status](https://jenkins.iotplatforma.cloud/buildStatus/icon?job=IOT+multi%2Frelease)](https://jenkins.iotplatforma.cloud/job/IOT%20multi/job/release/)

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
```

In the downloaded directory you'll find one important file:

-   docker-compose.yml - installs and orchestrates networking between your IoT Platform server, Mongo database and RabbitMQ (MQTT broker). It comes with some defaults that are ready to go, although you're free to tweak the configuration to match your needs. All configuration options (enviroment variables) can be found in [documentation here](https://docs.iotplatforma.cloud/#/quickstart?id=enviroment-promněné). Just edit them in docker-compose.yml in environment section, where you can also find default values ex. DATABASE_URI and NODE_ENV.

## 2. Start the server

Once you are happy with configuration, you're ready to start up the server:

```
docker-compose up -d
```

When you run this command for the first time, it does the following:

Creates a Mongo database for persisten data
Starts the server on port 8050
You can now navigate to http://{hostname}:8050 and see the login screen. First user, who will register will be given admin permissions.
