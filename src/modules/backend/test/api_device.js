const supertest = require("supertest");
const should = require("should");
const config = require("./resources/config.json")
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const config_be = require("../config/index")
const getUserToken = require("./lib/getUserToken")
const forms = require("./resources/deviceForm")
const authChecker = require("./lib/authChecker")
const formDataChecker = require("./lib/formDataChecker")
import { deleteImage } from '../service/files'

const server = supertest.agent(config.url);

const db_url = `mongodb://${config_be.dbUser}:${config_be.dbPwd}@localhost:27017/IOTPlatform`
const db_opt = { useNewUrlParser: true, useUnifiedTopology: true }

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
    let client;
    let collection;
    before(async function () {
        client = await MongoClient.connect(db_url, db_opt)
        const db = client.db("IOTPlatform")
        collection = db.collection("devices")
    })

    it("should create device", function (done) {

        getUserToken().then(({ token, user }) => {
            createDevice(forms.create_device, token)
                .then(async function (res) {
                    should.exist(res.body.apiKey)
                    should.exist(res.body.doc)

                    deleteImage(res.body.doc.imgPath)   // delete img
                    done()
                }).finally(async () => {
                    const result = await collection.deleteOne({ createdBy: new mongo.ObjectID(user.id) })
                    result.result.n.should.equal(1)
                })
        })
    })

    it("should delete device", function (done) {

        getUserToken().then(({ token, user }) => {
            createDevice(forms.create_device, token)
                .then(async function (res) {
                    should.exist(res.body.apiKey)
                    should.exist(res.body.doc)

                    const countBefore = await collection.find({ createdBy: new mongo.ObjectID(user.id) }).count()
                    countBefore.should.equal(1)

                    await server
                        .delete("/api/device/" + res.body.doc.id)
                        .set('Authorization-JWT', token)
                        .expect(204) // THis is HTTP response

                    const countAfter = await collection.find({ createdBy: new mongo.ObjectID(user.id) }).count()
                    countAfter.should.equal(countBefore - 1)
                    done()

                }).finally(async () => {
                    await collection.deleteOne({ createdBy: new mongo.ObjectID(user.id) }) // clean - just in case of failure
                })
        })
    })

    it("should not delete device", function (done) {

        getUserToken().then(async ({ token, user }) => {

            const res = await server
                .delete("/api/device/" + "dsadasdasdas")
                .set('Authorization-JWT', token)
                .expect(208) // THis is HTTP response

            res.body.error.should.equal("InvalidDeviceId")
            done()
        })
    })

    it("should get list of devices", function (done) {

        getUserToken().then(({ token, user }) => {
            const userID = new mongo.ObjectID(user.id)
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
                            const publicCount = await collection.find({
                                $or: [
                                    { publicRead: true },
                                    { "permissions.read": userID },
                                    { "permissions.write": userID },
                                    { "permissions.control": userID }
                                ]
                            }).count()

                            should.exist(res.body.docs)
                            should.equal(res.body.docs.length, publicCount)   // check if get only one
                        })
                }).finally(async () => {
                    const result = await collection.deleteOne({ createdBy: userID })
                    result.result.n.should.equal(1)
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
                            const result = await collection.find({ createdBy: new mongo.ObjectID(user.id) }).toArray()

                            should.equal(result.length, 1)
                            should.equal(result[0].title, "Zmeneno")
                            return done()
                        })
                }).finally(async () => {
                    const result = await collection.deleteOne({ createdBy: new mongo.ObjectID(user.id) })
                    result.result.n.should.equal(1)
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
                    const doc = await collection.findOne({ createdBy: new mongo.ObjectID(user.id) })
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
                                    unit: '%'
                                }]
                        }
                    )
                    done()
                }).finally(async () => {
                    const result = await collection.deleteOne({ createdBy: new mongo.ObjectID(user.id) })
                    result.result.n.should.equal(1)
                })
        })
    })

    it("should update permissions", function (done) {
        getUserToken().then(async ({ token, user }) => {
            const userID = new mongo.ObjectID(user.id)
            const { body: { doc } } = await createDevice(forms.create_device, token)

            const docFound = await collection.findOne({ createdBy: userID })
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
                    const docFound2 = await collection.findOne({ createdBy: userID })
                    const permKeys = Object.keys(docFound2.permissions)
                    
                    permKeys.forEach(key => {   // convert ObjectID into String
                        docFound2.permissions[key] = docFound2.permissions[key].map(id => id.toString())
                    })

                    docFound2.permissions.should.eql(forms.update_permissions.formData.EDIT_PERMISSIONS)
                    done()
                }).finally(async () => {
                    const result = await collection.deleteOne({ createdBy: new mongo.ObjectID(user.id) })
                    result.result.n.should.equal(1)
                })

        })
    })

    after(function (done) {
        client.close()
        done()
    })
})

describe("Device API check middlewares", function () {
    it("should check auth middleware", async function () {
        should.equal(await authChecker("/api/device/42kjhk42kjlj2442", "put"), true)
        should.equal(await authChecker("/api/device", "post"), true)
        should.equal(await authChecker("/api/device/42kjhk42kjlj2442", "delete"), true)
        // should.equal(await authChecker("/api/device/42kjhk42kjlj2442", "patch"), true) // method removed
    })

    it("should check formData middleware", async function () {
        should.equal(await formDataChecker("/api/device/42kjhk42kjlj2442", "put"), true)
        should.equal(await formDataChecker("/api/device", "post"), true)
        // should.equal(await formDataChecker("/api/device/42kjhk42kjlj2442", "patch"), true)  // method removed
    })
})