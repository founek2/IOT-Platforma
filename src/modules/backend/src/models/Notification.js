const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const item = {
    JSONkey: String,
    description: String,
    type: String,   // type is reserver keyword
    value: String,
    tmp: {
        lastSendAt: Date,
        lastSatisfied: Boolean
    },
    advanced: {
        interval: { $type: Number, default: -1 },
        from: String,
        to: String,
        daysOfWeek: { $type: Array, default: [0, 1, 2, 3, 4, 5, 6] },
    }
}

const notifySchema = new Schema(
    {
        device: { $type: ObjectId, ref: 'Device', index: { unique: true } },
        sensors: [
            {
                _id: false,
                user: { $type: ObjectId, ref: 'User' },
                items: [item]
            }
        ],
        control: [
            {
                _id: false,
                user: { $type: ObjectId, ref: 'User' },
                container: [{
                    _id: false,
                    JSONkey: String,
                    items: [item]
                }]
            }
        ]
    }, { typeKey: '$type' })


notifySchema.statics.addOrUpdateSensors = async function (userId, deviceId, array) {
    const Notify = this.model('Notify')

    const existForDevice = await Notify.exists({ device: ObjectId(deviceId), })

    if (existForDevice) {
        const existForUser = await Notify.exists({ device: ObjectId(deviceId), "sensors.user": ObjectId(userId) })
        if (existForUser) {
            return Notify.updateOne({
                device: ObjectId(deviceId),
                "sensors.user": ObjectId(userId)
            }, {
                $set: { "sensors.$.items": array },
            }).exec()
        }
        else
            return Notify.updateOne({
                device: ObjectId(deviceId),
            }, {
                $push: {
                    sesnsors: {
                        user: ObjectId(userId),
                        items: array,
                    }
                },
            }).exec()

    } else {
        return new Notify({
            device: ObjectId(deviceId),
            sensors: [{
                user: ObjectId(userId),
                items: array,
            }]
        }).save()
    }
}

notifySchema.statics.addOrUpdateControl = async function (userId, deviceId, JSONkey, data) {
    console.log("BLABLA", userId, deviceId, JSONkey, JSON.stringify(data))

    const Notify = this.model('Notify')
    const userID = ObjectId(userId)

    const existForDevice = await Notify.findOne({ device: ObjectId(deviceId) }).select("_id").lean()
    console.log("existForDevice", existForDevice)

    if (existForDevice) {
        const existForUser = await Notify.exists({ _id: existForDevice._id, "control.user": userID })
        if (existForUser) {
            const existForJSONkey = await Notify.exists({ _id: existForDevice._id, "control.container.JSONkey": JSONkey })
            if (existForJSONkey) {
                return await Notify.updateOne({ _id: existForDevice._id }, {
                    $set: { "control.$[outer].container.$[inner].items": data }
                }, {
                    arrayFilters: [{ "outer.user": userID }, { "inner.JSONkey": { $in: JSONkey } }]
                })
            } else {
                return await Notify.updateOne({ _id: existForDevice._id }, {
                    $push: {
                        "control.$[outer].container": {
                            items: data,
                            JSONkey,
                        }
                    }
                }, {
                    arrayFilters: [{ "outer.user": userID }]
                })
            }
        } else
            return Notify.updateOne({
                device: ObjectId(deviceId),
            }, {
                $push: {
                    control: {
                        user: ObjectId(userId),
                        container: {
                            JSONkey,
                            items: data,
                        }
                    }
                },
            }).exec()

    } else {
        return new Notify({
            device: ObjectId(deviceId),
            control: [{
                user: ObjectId(userId),
                container: {
                    JSONkey,
                    items: data
                },
            }]
        }).save()
    }
}

notifySchema.statics.getSensors = function (deviceId, userId) {
    console.log({ deviceId, userId })
    return this.model('Notify')
        .findOne({
            device: ObjectId(deviceId),
        }).select({
            "_id": 0,
            "sensors": {
                $elemMatch: { "user": ObjectId(userId) }
            }
        }).then(doc => doc ? doc.sensors[0] : doc)
}

notifySchema.statics.getControl = function (deviceId, userId, JSONkey) {
    console.log({ deviceId, userId, JSONkey })
    return this.model('Notify')
        .findOne({
            device: ObjectId(deviceId),
        }).select({
            "_id": 0,
            "control": {
                $elemMatch: {
                    "user": ObjectId(userId),
                    "container": {
                        $elemMatch: { JSONkey }
                    }
                }
            }
        }).then(doc => doc ? doc.control[0].container[0] : doc)
}

notifySchema.statics.getSensorItems = function (deviceId, JSONkeys) {
    return this.model('Notify').aggregate([
        {
            $match: {
                device: mongoose.Types.ObjectId(deviceId),
                "sensors.items.JSONkey": { $in: JSONkeys }
            }
        },
        { $unwind: "$sensors" },
        {
            $project: {
                "user": "$sensors.user",
                "sensors.items": {
                    $filter: {
                        input: "$sensors.items",
                        cond: { $in: ["$$this.JSONkey", JSONkeys] }
                    }
                }
            }
        },
    ])
}

notifySchema.statics.updateItems = function (deviceId, itemIDs, userIDs, updateObj) {
    return this.model('Notify').updateMany({
        device: ObjectId(deviceId),
        "sensors.items._id": {
            $in: itemIDs
        }
    }, updateObj,
        {
            arrayFilters: [{ "outer.user": { $in: userIDs } }, { "inner._id": { $in: itemIDs } }]
        })
}

notifySchema.statics.refreshItems = function (deviceId, { items: itemsSended, users: usersSended }, { unSatisfiedItems, satisfiedItems, users: usersNotSneded }, userIDs) {
    usersSended = Array.from(usersSended).map(id => ObjectId(id))
    usersNotSneded = Array.from(usersNotSneded).map(id => ObjectId(id))
    itemsSended = itemsSended.map(id => ObjectId(id))
    satisfiedItems = satisfiedItems.map(id => ObjectId(id))
    unSatisfiedItems = unSatisfiedItems.map(id => ObjectId(id))

    // TODO use Bulk write - https://mongoosejs.com/docs/api.html#model_Model.bulkWrite
    this.model("Notify").updateItems(deviceId, itemsSended, usersSended, {
        $set: {
            "sensors.$[outer].items.$[inner].tmp": {
                lastSendAt: new Date(),
                lastSatisfied: true,
            }
        }
    }).exec()

    this.model("Notify").updateItems(deviceId, unSatisfiedItems, usersNotSneded, {
        $set: {
            "sensors.$[outer].items.$[inner].tmp": {
                lastSatisfied: false,
            }
        }
    }).exec()

    this.model("Notify").updateItems(deviceId, satisfiedItems, usersNotSneded, {
        $set: {
            "sensors.$[outer].items.$[inner].tmp": {
                lastSatisfied: true,
            }
        }
    }).exec()
}

notifySchema.statics.removeSpareSensors = function (deviceId, JSONkeys) {
    console.log(deviceId, JSONkeys)
    return this.model("Notify").updateOne({
        device: ObjectId(deviceId),
    }, {

        $pull: {
            "sensors.$[].items": { JSONkey: { $nin: JSONkeys } }
        }

    })
}

export default mongoose.model('Notify', notifySchema)