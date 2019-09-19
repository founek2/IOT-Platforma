const supertest = require("supertest");
const should = require("should");
const config = require("./resources/config.json")
const forms = require("./resources/userForms")
const MongoClient = require('mongodb').MongoClient;
const config_be = require("../config/index")
const getAdminToken = require("./lib/getAdminToken")
const getUserToken = require("./lib/getUserToken")
const authChecker = require("./lib/authChecker")
const formDataChecker = require("./lib/formDataChecker")
const adminRestrictionChecker = require("./lib/adminRestrictionChecker")

const server = supertest.agent(config.url);

const db_url = `mongodb://${config_be.dbUser}:${config_be.dbPwd}@localhost:27017/IOTPlatform`
const db_opt = { useNewUrlParser: true, useUnifiedTopology: true }

describe("User API test", function () {
    let client;
    let collection;
    before(async function () {
        client = await MongoClient.connect(db_url, db_opt)
        const db = client.db("IOTPlatform")
        collection = db.collection("users")
    })


    it("should create user: test10", function (done) {

        server  // create user
            .post("/api/user")
            .send(forms.registration_form_test10)
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200) // THis is HTTP response
            .then(async function (res) {
                // HTTP status should be 200
                res.body.user.info.should.be.eql(forms.registration_form_test10.formData.REGISTRATION.info)
                should.equal(res.body.user.info.userName, res.body.user.info.userName)
                should.exist(res.body.token)
            }).finally(async () => {
                // cleaning
                const result = await collection.deleteOne({ "info.userName": forms.registration_form_test10.formData.REGISTRATION.info.userName })
                result.result.n.should.equal(1)
                done();
            })

    });

    it("should fail validation - no userName", function (done) {

        server
            .post("/api/user")
            .send(forms.registration_form_no_username)
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(208) // THis is HTTP response
            .end(function (err, res) {
                should.not.exist(err);

                res.body.error.should.equal("validationFailed")
                done();
            });
    });

    it("should fail validation - extra field", function (done) {

        server
            .post("/api/user")
            .send(forms.registration_form_extra_field)
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(208) // THis is HTTP response
            .end(function (err, res) {
                should.not.exist(err);

                res.body.error.should.equal("validationFailed")
                done();
            });
    });

    it("should login", function (done) {

        server
            .post("/api/user")
            .send(forms.login(config_be.mqttUser, config_be.mqttPassword))
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200) // THis is HTTP response
            .end(function (err, res) {
                should.not.exist(err);

                should.exist(res.body.token)
                res.body.user.info.userName.should.equal(config_be.mqttUser)
                done();
            });
    });

    it("should not login", function (done) {

        server
            .post("/api/user")
            .send(forms.login(config_be.mqttUser, "1111111"))
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(208) // THis is HTTP response
            .end(function (err, res) {
                should.not.exist(err);
                res.body.error.should.equal("passwordMissmatch")
                done();
            });
    });

    it("should update user", function (done) {

        server  // create user: test10
            .post("/api/user")
            .send(forms.registration_form_test10)
            .set('Accept', 'application/json')
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200) // THis is HTTP response
            .end(async function (err, res) {
                should.not.exist(err);
                should.exist(res.body.user.info)

                const user = res.body.user
                const token = await getAdminToken()

                server  // update created user
                    .put("/api/user/" + user.id)
                    .send(forms.update_user_test10_lastName)
                    .set('Accept', 'application/json')
                    .set('Authorization-JWT', token)
                    .expect(204) // THis is HTTP response
                    .then(async function (res) {
                    }).finally(async () => {
                        const result = await collection.deleteOne({
                            "info.userName": forms.update_user_test10_lastName.formData.EDIT_USER.info.userName,
                            "info.lastName": forms.update_user_test10_lastName.formData.EDIT_USER.info.lastName
                        })

                        result.result.n.should.equal(1)
                        done();
                    })


            });

    });

    after(function (done) {
        client.close()
        done()
    })
});

describe("User API test2", async function () {
    let client;
    let collection;
    before(async function () {
        client = await MongoClient.connect(db_url, db_opt)
        const db = client.db("IOTPlatform")
        collection = db.collection("users")
    })

    it("should get list of all users", function (done) {
        getAdminToken().then(token => {
            server
                .get("/api/user")
                .set('Accept', 'application/json')
                .set('Authorization-JWT', token)
                .expect("Content-type", /json/)
                .expect(200) // THis is HTTP response
                .end(async function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body.users)

                    const count = await collection.find({}).count()
                    should.equal(res.body.users.length, count - 2) // 2 - (root and loged user)
                    done();
                });
        })
    })

    it("should delete created user", function (done) {
        server  // create user
            .post("/api/user")
            .send(forms.registration_form_test10)
            .set('Accept', 'application/json')
            .expect("Content-type", /json/)
            .expect(200) // THis is HTTP response
            .end(async function (err, res) {
                should.not.exist(err);
                res.body.user.info.should.be.eql(forms.registration_form_test10.formData.REGISTRATION.info)
                should.exist(res.body.token)

                const user = res.body.user

                // check if user was created
                const count = await collection.find({ "info.userName": user.info.userName }).count()
                should.equal(count, 1)

                const token = await getAdminToken()

                server  // delete user
                    .delete("/api/user")
                    .send(forms.user_management_selected(user.id))
                    .set('Authorization-JWT', token)
                    .expect(204)
                    .end(function (err, res) {
                        should.not.exist(err)

                        // check if user was deleted
                        collection.find({ "info.userName": user.info.userName }).count(function (err, count) {
                            should.equal(count, 0)
                            done();
                        })
                    })
            });
    })

    it("should get AuthType", function (done) {
        server
            .get(`/api/user/${config_be.testUser}`)
            .query({ attribute: "authType" })
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err)
                should.equal(
                    res.body.authType,
                    "passwd",
                )
                done()
            })
    })

    it("should get all userNames", function (done) {
        getUserToken().then(({ token }) => {
            server
                .get(`/api/user`)
                .query({ type: "userName" })
                .set('Authorization-JWT', token)
                .expect(200)
                .end(async function (err, res) {
                    should.not.exist(err)

                    const userNames = await collection.find({ groups: { $ne:  "root" } }, { projection: { "info.userName": 1 } }).sort({ "info.userName": 1 }).toArray()
                    res.body.data.should.be.eql(userNames.map(({ _id, info: { userName } }) => ({ _id: _id.toString(), userName })))
                    done()
                })
        })
    })

    after(function (done) {
        client.close()
        done()
    })
})

describe("User API check middlewares", function () {
    it("should check auth middleware", async function () {
        should.equal(await authChecker("/api/user", "get"), true)
        should.equal(await authChecker("/api/user", "delete"), true)
        should.equal(await authChecker("/api/user/42kjhk42kjlj2442", "put"), true)
    })

    it("should check formData middleware", async function () {
        should.equal(await formDataChecker("/api/user", "post"), true)
        should.equal(await formDataChecker("/api/user", "delete"), true)
        should.equal(await formDataChecker("/api/user/42kjhk42kjlj2442", "put"), true)
    })

    it("should check admin restriction middleware", async function () {
        should.equal(await adminRestrictionChecker("/api/user", "get", 500), false)     // Restriction was removed
        should.equal(await adminRestrictionChecker("/api/user", "delete"), true)
        should.equal(await adminRestrictionChecker("/api/user/42kjhk42kjlj2442", "put"), true)
    })
})