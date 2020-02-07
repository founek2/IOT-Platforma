module.exports = {
    dbUser: process.env.IOT_DB_USER ,
    dbPwd: process.env.IOT_DB_PASSWD ,
    port: 8085 || process.env.IOT_BACKEND_PORT,
    portAuth: 8084,
    bodyLimit: process.env.IOT_BODY_LIMIT || "100kb",
    privateKey: process.env.IOT_PRIVATE_KEY_PATH,
    publicKey: process.env.IOT_PUBLIC_KEY_PATH,
    mqttUser: process.env.IOT_MQTT_USER,
    mqttPassword: process.env.IOT_MQTT_PASSWD,
    imagesPath: process.env.IOT_IMAGES_PATH,
    testUser: "test1",
    testPassword: "123456"
  };