import supertest from"supertest";
import config from"../resources/config.js";
import getAdminToken from"./getAdminToken";

const server = supertest.agent(config.url);

export default  async function (path, method) {
    const token = await getAdminToken()
    const res = await server[method](path)
        .send({ formData: { someField: "abs" } })
        .set('Authorization-JWT', token)
        .expect(208)
    return res.body.error === "validationFailed"
}