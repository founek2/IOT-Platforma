import supertest from "supertest";
import config from "../resources/config.js";
import getUserToken from "./getUserToken";

const server = supertest.agent(config.url);

export default async function(path, method, status = 208) {
    const {token} = await getUserToken()

    const res = await server[method](path)
        .set('Authorization-JWT', token)
        .expect(status)
    
    return res.body.error === "notAllowed"
}