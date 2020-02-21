import supertest from "supertest";
import should from "should";
import config from "../resources/config.js";
import config_be from "../../config/index";
import forms from "../resources/userForms";

const server = supertest.agent(config.url);


export default async function () {
    return server
        .post("/api/user")
        .send(forms.login(config_be.mqttUser, config_be.mqttPassword))
        .set('Accept', 'application/json')
        .expect("Content-type", /json/)
        .expect(200) // THis is HTTP response
        .then(function (res) {
            should.exist(res.body.token)
            res.body.user.info.userName.should.equal(config_be.mqttUser)
            return res.body.token
        });
}