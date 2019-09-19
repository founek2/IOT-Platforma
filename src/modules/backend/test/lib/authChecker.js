const supertest = require("supertest");
const config = require("../resources/config.json")

const server = supertest.agent(config.url);

module.exports = async function (path, method) {
    const res = await server[method](path)
        .set('Authorization-JWT', "123242433")
        .expect(208)
    return res.body.error === "invalidToken"
}