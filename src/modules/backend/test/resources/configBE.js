import path from 'path'

module.exports = {
    dbUser: "test",
    dbPwd: "test123",
    dbName: "IOTtest",
    port: 4545,
    portAuth: 4544,
    bodyLimit: process.env.IOT_BODY_LIMIT || "100kb",
    privateKey: path.join(__dirname, "keys", "jwtRS256.key"),
    publicKey: path.join(__dirname, "keys", "jwtRS256.key.pub"),
    // mqttUser: process.env.IOT_MQTT_USER,
    // mqttPassword: process.env.IOT_MQTT_PASSWD,
    imagesPath: process.env.IOT_IMAGES_PATH,
    testUser: "test1",
    testPassword: "123456"
    };