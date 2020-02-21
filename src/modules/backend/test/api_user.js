import supertest from "supertest";
import should from "should";
import config from "./resources/config.js"
import config_be from './resources/configBE'
import forms from "./resources/userForms"
import getAdminToken from "./lib/getAdminToken"
import getUserToken from "./lib/getUserToken"
import authChecker from "./lib/authChecker"
import formDataChecker from "./lib/formDataChecker"
import adminRestrictionChecker from "./lib/adminRestrictionChecker"
import {spawnChild, waitForServer, killChild} from './lib/startServer'
import dbConnect from './lib/db'
import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId;

import User from '../src/models/user'

const server = supertest.agent(config.url);

const startServer = spawnChild;
// const startServer = () => ({kill: () => {}});

describe("User API test", function () {
    let child;
    let db;
    before(async function () {
        this.timeout(10 * 1000);
        child = startServer()
        await waitForServer()

        db = await dbConnect()
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
                const result = await User.deleteOne({ "info.userName": forms.registration_form_test10.formData.REGISTRATION.info.userName }).exec()
                result.n.should.equal(1)
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

                        const result = await User.deleteOne({
                            "info.userName": forms.update_user_test10_lastName.formData.EDIT_USER.info.userName,
                            "info.lastName": forms.update_user_test10_lastName.formData.EDIT_USER.info.lastName
                        }).exec()
                        result.n.should.equal(1)
                        done();
                    })


            });

    });

    after(function (done) {
        killChild(child)
        db.close();
        done()
    })
});

describe("User API test2", async function () {
    let child;
    let db;
    before(async function () {
        this.timeout(10 * 1000);
        
        child = startServer()
        await waitForServer()

        db = await dbConnect()
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

                    const count = await User.find({
                        groups: {$ne: "root"}
                    }).countDocuments()
                    should.equal(res.body.users.length, count  -1 ) // 1 - logged user
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
                const count = await User.find({ "info.userName": user.info.userName }).countDocuments()
                should.equal(count, 1)

                const token = await getAdminToken()

                server  // delete user
                    .delete("/api/user")
                    .send(forms.user_management_selected(user.id))
                    .set('Authorization-JWT', token)
                    .expect(204)
                    .then(async function (res) {
                        // check if user was deleted
                        const count = await User.find({ "info.userName": user.info.userName }).countDocuments();
                        should.equal(count, 0)
                        done()
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

                    const userNames = await User.find({ groups: { $ne:  "root" } }).select("info.userName").sort("info.userName").lean()
                    res.body.data.should.be.eql(userNames.map(({ _id, info: { userName } }) => ({ _id: _id.toString(), userName })))
                    done()
                })
        })
    })

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

    after(function (done) {
        killChild(child)
        db.close();
        done()
    })
})