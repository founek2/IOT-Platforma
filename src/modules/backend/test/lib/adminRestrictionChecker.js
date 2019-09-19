const supertest = require("supertest");
const config = require("../resources/config.json")
const getUserToken = require("./getUserToken")

const server = supertest.agent(config.url);

module.exports = async function(path, method, status = 208) {
    const {token} = await getUserToken()

    const res = await server[method](path)
        .set('Authorization-JWT', token)
        .expect(status)
    
    return res.body.error === "notAllowed"
}