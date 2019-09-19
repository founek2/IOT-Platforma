const supertest = require("supertest");
const config = require("../resources/config.json")
const getAdminToken = require("./getAdminToken")

const server = supertest.agent(config.url);

module.exports = async function (path, method) {
    const token = await getAdminToken()
    const res = await server[method](path)
        .send({ formData: { someField: "abs" } })
        .set('Authorization-JWT', token)
        .expect(208)
    return res.body.error === "validationFailed"
}