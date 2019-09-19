module.exports = {
    dbUser: process.env.DB_USER ,
    dbPwd: process.env.DB_PASSWD ,
    port: 8085 || process.env.BACKEND_PORT,
    portAuth: 8084,
    bodyLimit: process.env.BODY_LIMIT || "100kb",
    privateKey: process.env.PRIVATE_KEY || "/Users/martas/Work/certs/jwtRS256.key",
    publicKey: process.env.PUBLIC_KEY || "/Users/martas/Work/certs/jwtRS256.key.pub",
    mqttUser: process.env.MQTT_USER,
    mqttPassword: process.env.MQTT_PASSWD,
    testUser: "test1",
    testPassword: "123456"
  };