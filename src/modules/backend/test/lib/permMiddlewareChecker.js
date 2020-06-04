import supertest from "supertest";
import config from "../resources/config.js";
import getAdminToken from "./getAdminToken";
import getUserToken from "./getUserToken.js";

const server = supertest.agent(config.url);

export default async function (path, method) {
    const {token} = await getUserToken()
    const res = await server[method](path)
        .set('Authorization-JWT', token)
        .expect(208)
    return res.body.error 
}