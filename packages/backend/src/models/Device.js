import catcher from 'framework/lib/mongoose/catcher'
import { isNotEmpty } from 'ramda-extension'
import sensorsScheme from './schema/sensors'
import controlScheme from './schema/control'
import hat from 'hat'
import { devLog } from 'framework/lib/logger'
import SensorHistory from './SensorHistory'
import { keys, head } from 'ramda'
import { IMAGES_DEVICES_FOLDER } from '../constants'
import { isDay } from '../lib/util'
import prepareControlHistoryData from '../lib/prepareControlHistoryData'
import ControlHistory from './ControlHistory'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const deviceSchema = new Schema(
    {
        info: {
            title: { type: String, required: true },
            description: { type: String },
            imgPath: { type: String },
        },
        gps: {
            type: { type: String, default: 'Point' },
            coordinates: Array
        },
        sensors: sensorsScheme,
        control: controlScheme,
        apiKey: { type: String, default: hat, index: { unique: true } },
        createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
        publicRead: Boolean,
        permissions: {
            read: [{ type: 'ObjectId', ref: 'User' }],
            write: [{ type: 'ObjectId', ref: 'User' }],
            control: [{ type: 'ObjectId', ref: 'User' }]
        },
        topic: { type: String, required: true },
        lastLogin: Date,
        ack: Date,
    },
    {
        toObject: {
            transform: function (doc, ret) {
                ret.id = ret._id.toString()
                delete ret.__v
                delete ret._id
                if (ret.gps) {

                    delete ret.gps;
                }

            }
        },
        timestamps: true
    },
)

deviceSchema.statics.updateAck = async function (ownerId, topic) {
    const doc = await this.model('Device').findOneAndUpdate(
        { createdBy: mongoose.Types.ObjectId(ownerId), topic },
        { ack: new Date() },
        { fields: { "permissions.control": 1 } }).lean()
    if (!doc) throw new Error("Invalid id/topic")
    return doc;
}

deviceSchema.statics.updateStateByDevice = async function (createdBy, topic, data, updateTime) {
    const updateStateQuery = prepareStateUpdate(data, updateTime)
    console.log("update query", updateStateQuery)
    const doc = await this.model('Device').findOneAndUpdate(
        { createdBy: mongoose.Types.ObjectId(createdBy), topic },
        { $set: { ...updateStateQuery, ack: updateTime } },
        {
            fields: {
                "control.sampleInterval": 1,
                "control.recipe": 1,
                "control.historical.updatedAt": 1,
                "permissions.control": 1,
                "info": 1,
            }
        }).lean()
    if (!doc) throw new Error("Invalid device") // TODO remove

    const JSONkey = head(keys(data))
    const state = data[JSONkey]
    const query = prepareControlHistoryData(state, JSONkey, doc.control, updateTime)

    ControlHistory.saveData(doc._id, JSONkey, query, updateTime)

    return doc
}

deviceSchema.statics.login = async function (apiKey) {
    const result = await this.model('Device').updateOne({ apiKey }, { lastLogin: new Date() })
    return result.nModified === 1
}

deviceSchema.statics.create = async function ({ topic, ...object }, imgExtension, userID) {
    const Device = this.model('Device')
    // const coordinates = [object.info.gpsLng, object.info.gpsLat]
    const objID = mongoose.Types.ObjectId(userID)

    // check for existence of topic (between all devices with createdBy: id), then create
    const result = await Device.findOne({ topic, createdBy: objID }).select("_id").lean()
    if (result) throw Error('topicAlreadyUsed')

    const newDevice = new Device({
        ...object,
        createdBy: objID,
        // gps: { coordinates },
        permissions: { read: [objID], write: [objID], control: [objID] },
        topic: topic
    })
    if (imgExtension) newDevice.info.imgPath = `/${IMAGES_DEVICES_FOLDER}/${newDevice.id}.${imgExtension}`
    devLog("Creating device", newDevice)
    return newDevice
        .save()
        .then(obj => {
            const doc = obj.toObject()
            return doc
        })
        .catch(catcher('device'))
}

const aggregationFields = {
    id: '$_id',
    _id: 0,
    "gps.coordinates": 1,
    // "gps.type": 0,
    info: 1,
    createdAt: 1,
    createdBy: 1,
    // sampleInterval: 1,
    publicRead: 1,
    topic: 1,
    ack: 1,
}

const controlFields = {
    id: '$_id',
    _id: 0,
    control: 1,
    ack: 1,
}

const sensorsFields = {
    id: '$_id',
    _id: 0,
    sensors: 1,
}

deviceSchema.statics.findForUser = function (userID, options = {}) {
    const { controlOnly, sensorsOnly } = options;
    const userObjID = ObjectId(userID)

    console.log("loking for devices, userID=", userID)

    if (controlOnly)
        return this.model('Device')
            .find({ "permissions.control": userObjID, "control": { $exists: true } })
            .select('control ack')
            .lean().then(docs => docs.map(doc => {
                doc.id = doc._id;
                delete doc._id;
                return doc;
            }))

    if (sensorsOnly)
        return this.model('Device')
            .find({ "permissions.read": userObjID, "sensors": { $exists: true } })
            .select('sensors')
            .lean().then(docs => docs.map(doc => {
                doc.id = doc._id;
                delete doc._id;
                return doc;
            }))


    return this.model('Device')
        .aggregate([
            {
                $match: {
                    $or: [
                        { publicRead: true },
                        { "permissions.write": userObjID },
                        { "permissions.read": userObjID },
                        { "permissions.control": userObjID },
                    ]
                }
            },
            {
                $project: {
                    ...aggregationFields,
                    control: {
                        $cond: {
                            if: { $in: [userObjID, '$permissions.control'] },
                            then: '$control',
                            else: '$$REMOVE'
                        }
                    },
                    sensors: {
                        $cond: {
                            if: { $or: [{ $in: [userObjID, '$permissions.read'] }, '$publicRead'] },
                            then: '$sensors',
                            else: '$$REMOVE'
                        }
                    },
                    permissions: {
                        "read": {
                            $cond: {
                                if: { $in: [userObjID, '$permissions.read'] },
                                then: '$permissions.read',
                                else: '$$REMOVE'
                            }
                        },
                        "write": {
                            $cond: {
                                if: { $in: [userObjID, '$permissions.write'] },
                                then: '$permissions.write',
                                else: '$$REMOVE'
                            }
                        },
                        "control": {
                            $cond: {
                                if: { $in: [userObjID, '$permissions.control'] },
                                then: '$permissions.control',
                                else: '$$REMOVE'
                            }
                        },
                    }
                }
            }
        ])
        .catch(catcher('device'))
}

deviceSchema.statics.findForAdmin = function (options = {}) {
    const { controlOnly, sensorsOnly } = options;

    if (controlOnly)
        return this.model('Device')
            .aggregate(
                [{ $match: { control: { $exists: true } } }, {
                    $project: controlFields
                }]
            )
            .then(docs => {
                return docs
            }).catch(catcher('device'))

    if (sensorsOnly)
        return this.model('Device')
            .aggregate(
                [{ $match: { sensors: { $exists: true } } }, {
                    $project: sensorsFields
                }]
            )
            .then(docs => {
                return docs
            }).catch(catcher('device'))

    return this.model('Device')
        .aggregate(
            [{
                $project: {
                    ...aggregationFields,
                    control: 1,
                    sensors: 1,
                    permissions: 1
                }
            }]
        )
        .then(docs => {
            return docs
        }).catch(catcher('device'))
}

deviceSchema.statics.findPublic = function ({ sensorsOnly } = {}) {
    if (sensorsOnly)
        return this.model('Device')
            .aggregate(
                [
                    { $match: { publicRead: true } },
                    {
                        $project: sensorsFields
                    }]
            )
            .then(docs => {
                return docs
            }).catch(catcher('device'))

    return this.model('Device')
        .aggregate(
            [
                { $match: { publicRead: true } },
                {
                    $project: {
                        ...aggregationFields,
                        sensors: 1,
                    }
                }]
        )
        .then(docs => {
            return docs
        }).catch(catcher('device'))
}

deviceSchema.statics.updateByFormData = function (deviceID, formData, imgExtension, { id, admin }) {
    return this.model('Device')
        .findOne({ _id: ObjectId(deviceID) })
        .select('permissions createdBy imgPath info')
        .lean()
        .then(async doc => {
            const { topic } = formData
            if (topic) {
                const result = await this.model('Device').exists({ topic, createdBy: doc.createdBy, _id: { $ne: ObjectId(deviceID) } })
                if (result) throw Error('topicAlreadyUsed')
            }
            const origImgPath = doc.info.imgPath
            if (imgExtension) formData.info.imgPath = `/devices/${doc.id}.${imgExtension}`

            const formDataNested = { ...formData, info: { ...doc.info, ...(formData.info) } }    // merge original nested object "info" to preserve imagePath

            console.log("updating Device> ", formDataNested)
            return this.model('Device').updateOne({ _id: ObjectId(deviceID) }, formDataNested).then(() => origImgPath)
        }).catch(catcher('device'))
}

deviceSchema.statics.updateSensorsRecipe = async function (deviceId, sampleInterval, recipe) {
    return await this.model('Device')
        .updateOne(
            {
                _id: deviceId
            },
            { $set: { "sensors.recipe": recipe, "sensors.sampleInterval": sampleInterval } }
        )
}

deviceSchema.statics.getOwnerAndTopic = async function (apiKey) {
    return this.model('Device').findOne({ apiKey }, { createdBy: 1, topic: 1 }).lean().then(doc => {
        return doc ? { ownerId: doc.createdBy, topic: doc.topic } : {}
    })
}

deviceSchema.statics.updateSensorsData = async function (ownerId, topic, data, updateTime) {
    return this.model('Device')
        .findOneAndUpdate(
            { createdBy: ownerId, topic: topic },   // should be ObjectId?
            { $set: { "sensors.current": { data, updatedAt: updateTime } } },
            { fields: { "sensors.sampleInterval": 1, "sensors.recipe": 1, publicRead: 1, "sensors.historical.updatedAt": 1, "permissions.read": 1, "info.title": 1 } }
        ).then(doc => {
            if (doc) {
                console.log("sensorsData updated")
                const { sensors } = doc;
                const { historical: { updatedAt } = {} } = sensors

                // sampleInterval === -1 means never save
                if (sensors.sampleInterval !== -1 && (!updatedAt || (new Date() - updatedAt) / 1000 > sensors.sampleInterval)) {
                    const update = {}
                    const sum = {}
                    const min = {}
                    const max = {}
                    const day = isDay(updateTime)
                    doc.sensors.recipe.forEach(({ JSONkey }) => {
                        const val = Number(data[JSONkey])
                        update["samples." + JSONkey] = val
                        update["timestamps"] = updateTime
                        min["min." + JSONkey] = val;
                        max["max." + JSONkey] = val
                        if (day) {    // day
                            sum["sum.day." + JSONkey] = val
                        } else {   // night
                            sum["sum.night." + JSONkey] = val
                        }
                    })

                    SensorHistory.saveData(doc._id, update, sum, min, max, updateTime, day)
                    doc.updateOne({ "sensors.historical.updatedAt": updateTime }).exec()
                }

                return {
                    _id: doc._id.toString(),
                    info: doc.info,
                    publicRead: doc.publicRead,
                    permissions: { read: doc.permissions.read },
                    sensors: doc.sensors


                }

            } else {
                console.log("ERROR: saving sensors data to unexisting device")
            }
        })
}

deviceSchema.statics.delete = async function (deviceID, user) {
    this.model('Notify').deleteMany({
        device: ObjectId(deviceID)
    }).exec()

    return this.model('Device')
        .findOneAndDelete({
            _id: ObjectId(deviceID)
        }).lean()
}

deviceSchema.statics.checkWritePerm = async function (deviceID, userId) {
    if (deviceID.length != 24) return false

    return await this.model('Device').exists({
        _id: ObjectId(deviceID),
        "permissions.write": ObjectId(userId)
    })
}

deviceSchema.statics.checkControlPerm = async function (deviceID, userId) {
    if (deviceID.length != 24) return false

    return await this.model('Device').exists({
        _id: ObjectId(deviceID),
        "permissions.control": ObjectId(userId)
    })
}

deviceSchema.statics.checkReadPerm = async function (deviceID, userId) {
    if (deviceID.length != 24) return false

    if (userId)         // public devices do exists -> no user
        return await this.model('Device').exists({
            _id: ObjectId(deviceID),
            $or: [{ "permissions.read": ObjectId(userId) }, { publicRead: true }]
        })
    else
        return await this.model('Device').exists({
            _id: ObjectId(deviceID),
            publicRead: true,
        })

}

deviceSchema.statics.checkExist = async function (deviceID = "") {
    if (deviceID.length !== 24) return false

    return await this.model('Device').exists({
        _id: ObjectId(deviceID),
    })
}

deviceSchema.statics.getSensorsDataForAdmin = async function (deviceID, from, to) {
    return SensorHistory.getData(deviceID, from, to)
}

deviceSchema.statics.getSensorsData = async function (deviceID, from, to, user = {}) {
    return SensorHistory.getData(deviceID, from, to)
}

deviceSchema.statics.getControlData = async function (deviceID, JSONkey, from, to, user = {}) {
    return ControlHistory.getData(deviceID, JSONkey, from, to)
}

deviceSchema.statics.getApiKey = async function (id, user = {}) {
    const doc = await this.model('Device').findOne({
        "_id": ObjectId(id),
        ...(!user.admin && { "permissions.write": ObjectId(user.id) })
    }, "-_id apiKey").lean()
    if (!doc) throw new Error("invalidPermissions")
    return doc.apiKey
}

deviceSchema.statics.updatePermissions = async function (id, permissions, user) {
    return await this.model('Device').updateOne({
        "_id": ObjectId(id),
    }, { permissions })
}

deviceSchema.statics.updateControlRecipe = async function (deviceID, controlRecipe, user) {
    return await this.model('Device')
        .updateOne(
            {
                _id: deviceID,
            },
            { $set: { "control.recipe": controlRecipe } }
        )
}

function prepareStateUpdate(data, updatedAt) {
    const result = {}
    const result2 = {}
    keys(data).forEach(key => {
        result["control.current.data." + key] = { state: data[key], updatedAt }
        keys(data[key]).forEach(propKey => {
            result2["control.current.data." + key + ".state." + propKey] = data[key][propKey]
        })
        result2["control.current.data." + key + ".updatedAt"] = updatedAt
    })

    return result2
}


deviceSchema.statics.initControl = async function (createdBy, topic, data, updateTime) {
    const updateStateQuery = prepareStateUpdate(data, updateTime)

    const doc = await this.model('Device').findOneAndUpdate({
        topic,
        createdBy
    }, {
        $set: updateStateQuery
    }, { fields: { "permissions.control": 1, "control.recipe": 1, "info": 1 }, new: true }).lean()
    if (!doc) throw new Error("invalidPermissions")

    const JSONkey = head(keys(data))
    const state = data[JSONkey]
    const query = prepareControlHistoryData(state, JSONkey, doc.control, updateTime)

    ControlHistory.saveData(doc._id, JSONkey, query, updateTime)

    return doc;
}

deviceSchema.statics.getTopicByApiKey = async function (apiKey) {
    const doc = await this.model('Device').findOne({
        apiKey
    }, "-_id topic createdBy").lean()
    return doc
}

export default mongoose.model('Device', deviceSchema)
