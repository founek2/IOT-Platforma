import supertest from "supertest";
import should from "should";
import config from "./resources/config.js"
import getUserToken from "./lib/getUserToken"
import forms from "./resources/deviceForm"
import authChecker from "./lib/authChecker"
import formDataChecker from "./lib/formDataChecker"
import dbConnect from './lib/db'
import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId;

import Device from '../src/models/Device'
import getAdminToken from "./lib/getAdminToken.js";
import permMiddlewareChecker from './lib/permMiddlewareChecker'

const server = supertest.agent(config.url);

function createDevice(form, token) {
    return server  // create device
        .post("/api/device")
        .send(form)
        .set('Accept', 'application/json')
        .set('Authorization-JWT', token)
        .expect("Content-type", /json/)
        .expect(200) // THis is HTTP response
        .then(res => {
            should.exist(res.body.apiKey)
            should.exist(res.body.doc)
            return res
        })
}

describe("Device API test", async function () {
    let db;
    before(async function () {
        db = await dbConnect()
    })

    it("should create device", function (done) {

        getUserToken().then(({ token, user }) => {
            createDevice(forms.create_device, token)
                .then(async function (res) {
                    should.exist(res.body.apiKey)
                    should.exist(res.body.doc)

                    done()
                }).finally(async () => {
                    const result = await Device.deleteOne({ createdBy: new ObjectId(user.id) }).exec();
                    result.n.should.equal(1)
                })
        })
    })

    it("should delete device", function (done) {

        getUserToken().then(({ token, user }) => {
            createDevice(forms.create_device, token)
                .then(async function (res) {
                    should.exist(res.body.apiKey)
                    should.exist(res.body.doc)

                    const countBefore = await Device.find({ createdBy: new ObjectId(user.id) }).countDocuments()
                    countBefore.should.equal(1)

                    await server
                        .delete("/api/device/" + res.body.doc.id)
                        .set('Authorization-JWT', token)
                        .expect(204) // THis is HTTP response

                    const countAfter = await Device.find({ createdBy: new ObjectId(user.id) }).countDocuments()
                    countAfter.should.equal(countBefore - 1)
                    done()

                }).finally(async () => {
                    await Device.deleteOne({ createdBy: new ObjectId(user.id) }).exec() // clean - just in case of failure
                })
        })
    })

    it("should not delete device", function (done) {

        getUserToken().then(async ({ token, user }) => {

            const res = await server
                .delete("/api/device/dsadasdasdas")
                .set('Authorization-JWT', token)
                .expect(208) // THis is HTTP response

            res.body.error.should.equal("InvalidDeviceId")
            done()
        })
    })

    it("should get list of devices", function (done) {

        getUserToken().then(({ token, user }) => {
            const userID = new ObjectId(user.id)
            createDevice(forms.create_device, token)
                .then(async function (res) {
                    should.exist(res.body.doc)
                    should.exist(res.body.apiKey)

                    return server  // get index for user
                        .get("/api/device")
                        .set('Accept', 'application/json')
                        .set('Authorization-JWT', token)
                        .expect("Content-type", /json/)
                        .expect(200) // THis is HTTP response
                        .then(async function (res) {
                            const publicCount = await Device.find({
                                $or: [
                                    { publicRead: true },
                                    { "permissions.read": userID },
                                    { "permissions.write": userID },
                                    { "permissions.control": userID }
                                ]
                            }).countDocuments()

                            should.exist(res.body.docs)
                            should.equal(res.body.docs.length, publicCount)   // check if get only one
                        })
                }).finally(async () => {
                    const result = await Device.deleteOne({ createdBy: userID })
                    result.n.should.equal(1)
                    done()
                })
        })
    })

    it("should update device", function (done) {
        getUserToken().then(({ token, user }) => {
            createDevice(forms.create_device, token)
                .then(async function (res) {
                    // should.not.exist(err)
                    const doc = res.body.doc

                    return server  // update device
                        .put(`/api/device/${doc.id}`)
                        .send(forms.update_device)
                        .set('Accept', 'application/json')
                        .set('Authorization-JWT', token)
                        .expect(204) // THis is HTTP response
                        .then(async function (res) {
                            // should.not.exist(err)
                            const result = await Device.find({ createdBy: new ObjectId(user.id) }).lean()

                            should.equal(result.length, 1)
                            should.equal(result[0].info.title, "Zmeneno")
                            return done()
                        })
                }).finally(async () => {
                    const result = await Device.deleteOne({ createdBy: new ObjectId(user.id) })
                    result.n.should.equal(1)
                })
        })
    })

    it("should update sensors", function (done) {
        getUserToken().then(async ({ token, user }) => {
            const { body: { doc } } = await createDevice(forms.create_device, token)

            return server  // update device
                .put(`/api/device/${doc.id}`)
                .send(forms.update_device_sensors)
                .set('Accept', 'application/json')
                .set('Authorization-JWT', token)
                .expect(204) // THis is HTTP response
                .then(async function (res) {
                    const doc = await Device.findOne({ createdBy: new ObjectId(user.id) }).lean()
                    doc.sensors.should.be.eql(
                        {
                            recipe:
                                [{
                                    name: 'Teplota',
                                    JSONkey: 'tmp',
                                    unit: 'C',
                                    description: 'bla bla'
                                },
                                {
                                    name: 'Vlhkost',
                                    JSONkey: 'hum',
                                    unit: '%',
                                    description: "",
                                }],
                            sampleInterval: 120,
                        }
                    )
                    done()
                }).finally(async () => {
                    const result = await Device.deleteOne({ createdBy: new ObjectId(user.id) })
                    result.n.should.equal(1)
                })
        })
    })

    it("should update permissions", function (done) {
        getUserToken().then(async ({ token, user }) => {
            const userID = new ObjectId(user.id)
            const { body: { doc } } = await createDevice(forms.create_device, token)

            const docFound = await Device.findOne({ createdBy: userID }).lean()
            docFound.permissions.should.eql({
                read: [userID],
                write: [userID],
                control: [userID],
            })
            return server  // update device
                .put(`/api/device/${doc.id}`)
                .send(forms.update_permissions)
                .set('Accept', 'application/json')
                .set('Authorization-JWT', token)
                .expect(204) // THis is HTTP response
                .then(async function (res) {
                    const docFound2 = await Device.findOne({ createdBy: userID }).lean()
                    const permKeys = Object.keys(docFound2.permissions)

                    permKeys.forEach(key => {   // convert ObjectID into String
                        docFound2.permissions[key] = docFound2.permissions[key].map(id => id.toString())
                    })

                    docFound2.permissions.should.eql(forms.update_permissions.formData.EDIT_PERMISSIONS)
                    done()
                }).finally(async () => {
                    const result = await Device.deleteOne({ createdBy: new ObjectId(user.id) })
                    result.n.should.equal(1)
                })

        })
    })

    it("should check auth middleware", async function () {
        should.equal(await authChecker("/api/device/dasdasdsad", "put"), true)
        should.equal(await authChecker("/api/device", "post"), true)
        should.equal(await authChecker("/api/device/dasdasda", "delete"), true)
        should.equal(await authChecker("/api/device/sdadasdasd", "patch"), true)
    })

    it("should check formData middleware", async function () {

        const { token, user } = await getUserToken()

        return createDevice(forms.create_device, token)
            .then(async function (res) {

                should.equal(await formDataChecker(`/api/device/${res.body.doc.id}`, "put"), true)
                should.equal(await formDataChecker("/api/device", "post"), true)
                should.equal(await formDataChecker(`/api/device/${res.body.doc.id}`, "patch"), true)

            }).finally(async () => {
                const result = await Device.deleteOne({ createdBy: new ObjectId(user.id) }).exec();
                result.n.should.equal(1)
            })
    })

    it("should check perm middleware", async function () {
        should.equal(await permMiddlewareChecker("/api/device/dsadasd", "put"), "InvalidDeviceId")
        should.equal(await permMiddlewareChecker("/api/device/dsadasd", "patch"), "InvalidDeviceId")
        should.equal(await permMiddlewareChecker("/api/device/dsadasd", "delete"), "InvalidDeviceId")
        should.equal(await permMiddlewareChecker("/api/device/dsadasd", "get"), "InvalidDeviceId")

        const token = await getAdminToken()
        const res = await createDevice(forms.create_device, token)  // created by admin

        // checking with normal user token
        should.equal(await permMiddlewareChecker(`/api/device/${res.body.doc.id}`, "put"), "invalidPermissions")
        should.equal(await permMiddlewareChecker(`/api/device/${res.body.doc.id}`, "patch"), "invalidPermissions")
        should.equal(await permMiddlewareChecker(`/api/device/${res.body.doc.id}`, "delete"), "invalidPermissions")
        should.equal(await permMiddlewareChecker(`/api/device/${res.body.doc.id}`, "get"), "invalidPermissions")

        await Device.deleteOne({ _id: new ObjectId(res.body.doc.id) }).exec() // clean
    })

    after(function (done) {
        db.close();
        done()
    })
})