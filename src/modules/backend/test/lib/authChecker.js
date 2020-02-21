import supertest from "supertest";
import config from "../resources/config.js";

const server = supertest.agent(config.url);

export default async function (path, method) {
    const res = await server[method](path)
        .set('Authorization-JWT', "123242433")
        .expect(208)
    return res.body.error === "invalidToken"
}