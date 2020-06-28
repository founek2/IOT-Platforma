export default process.env.IOT_CONFIG
  ? require(process.env.IOT_CONFIG)
  : ({
    dbUser: process.env.IOT_DB_USER,
    dbPwd: process.env.IOT_DB_PASSWD,
    dbName: process.env.IOT_DB_NAME || "IOTPlatform",
    port: process.env.IOT_BACKEND_PORT || 8085,
    portAuth: process.env.IOT_AUTH_PORT || 8084,
    portMqtt: process.env.IOT_MQTT_PORT || 8883,
    bodyLimit: process.env.IOT_BODY_LIMIT || "100kb",
    privateKey: process.env.IOT_PRIVATE_KEY_PATH,
    publicKey: process.env.IOT_PUBLIC_KEY_PATH,
    mqttUser: process.env.IOT_MQTT_USER,
    mqttPassword: process.env.IOT_MQTT_PASSWD,
    imagesPath: process.env.IOT_IMAGES_PATH,
    firebaseAdminPath: process.env.IOT_FIREBASE_ADMIN_PATH,
    testUser: "test1",
    testPassword: "123456",
    homepage: process.env.IOT_HOME_PAGE,
  })