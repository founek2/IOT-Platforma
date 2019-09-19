const supertest = require("supertest");
const should = require("should");
const config = require("../resources/config.json")
const config_be = require("../../config/index")
const forms = require("../resources/userForms")

const server = supertest.agent(config.url);


module.exports = async function () {
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