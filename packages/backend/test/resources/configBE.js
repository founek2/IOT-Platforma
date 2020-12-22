import path from 'path'

module.exports=  {
    dbUser: "test",
    dbPwd: "test123",
    dbName: "IOTtest",
    port: 4545,
    portAuth: 4544,
    bodyLimit: process.env.IOT_BODY_LIMIT || "100kb",
    privateKey: path.join(__dirname, "keys", "jwtRS256.key"),
    publicKey: path.join(__dirname, "keys", "jwtRS256.key.pub"),
    mqttUser: "admin",
    mqttPassword: "12345666",
    imagesPath: "/tmp/images/",
    testUser: "test1",
    testPassword: "123456",
    mode: "test",
    };