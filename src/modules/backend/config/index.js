module.exports = {
    dbUser: process.env.DB_USER ,
    dbPwd: process.env.DB_PASSWD ,
    port: 8085 || process.env.BACKEND_PORT,
    portAuth: 8084,
    bodyLimit: "100kb" || process.env.BODY_LIMIT,
    "privateKey": "/Users/martas/Work/certs/jwtRS256.key" || process.env.PRIVATE_KEY,
    "publicKey": "/Users/martas/Work/certs/jwtRS256.key.pub" || process.env.PUBLIC_KEY,
    mqttUser: process.env.MQTT_USER,
    mqttPassword: process.env.MQTT_PASSWD,
    testUser: "test1",
    testPassword: "123456"
  };