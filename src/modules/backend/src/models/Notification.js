const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const item = {
    JSONkey: String,
    STATEkey: String,
    description: String,
    type: String,
    value: String,
    tmp: {
        lastSendAt: Date,
        lastSatisfied: Boolean
    },
    advanced: {
        interval: { $type: Number, default: -1 },
        from: { $type: String, default: '00:00' },
        to: { $type: String, default: '23:59' },
        daysOfWeek: { $type: Array, default: [0, 1, 2, 3, 4, 5, 6] },
    }
}

const notifySchema = new Schema(
    {
        device: { $type: ObjectId, ref: 'Device', index: { unique: true } },
        user: { $type: ObjectId, ref: 'User' },
        sensors: {
            items: [item]
        },

        control: [
            {
                _id: false,
                JSONkey: String,
                items: [item]
            }
        ]
    }, { typeKey: '$type' })


notifySchema.statics.addOrUpdateSensors = async function (userId, deviceId, items) {
    const Notify = this.model('Notify')

    return Notify.updateOne({ device: ObjectId(deviceId), "user": ObjectId(userId) }, {
        $set: {
            "sensors.items": items,
            "control": []   // for properly working arrayFilters in controlNotify
        }
    }, { upsert: true, setDefaultsOnInsert: true }).exec()
}

notifySchema.statics.addOrUpdateControl = async function (userId, deviceId, JSONkey, items) {
    console.log("BLABLA", userId, deviceId, JSONkey, JSON.stringify(items))

    const Notify = this.model('Notify')

    let doc = await Notify.findOne({ device: ObjectId(deviceId), "user": ObjectId(userId) }).select("control").lean()

    if (!doc) doc = await new Notify({ device: ObjectId(deviceId), "user": ObjectId(userId), control: [] }).save()

    const id = doc.control.findIndex(({ JSONkey: key }) => key === JSONkey)
    const finID = id === -1 ? doc.control.length : id;

    return Notify.updateOne({ _id: doc._id }, {
        $set: {
            [`control.${finID}.JSONkey`]: JSONkey,
            [`control.${finID}.items`]: items,
        }
    }).exec()
}

notifySchema.statics.getSensors = function (deviceId, userId) {
    console.log({ deviceId, userId })
    return this.model('Notify')
        .findOne({
            device: ObjectId(deviceId),
            user: ObjectId(userId)
        }).select({
            "_id": 0,
            "sensors": 1
        }).then(doc => doc ? doc.sensors : doc)
}

notifySchema.statics.getControl = function (deviceId, userId, JSONkey) {
    console.log({ deviceId, userId, JSONkey })
    return this.model('Notify')
        .findOne({
            device: ObjectId(deviceId),
            user: ObjectId(userId)
        }).select({
            "_id": 0,
            "control": {
                $elemMatch: {
                    "JSONkey": JSONkey,
                }
            }
        }).then(doc => doc ? doc.control[0] : doc)
}

notifySchema.statics.getSensorItems = function (deviceId, JSONkeys) {
    return this.model('Notify').aggregate([
        {
            $match: {
                device: mongoose.Types.ObjectId(deviceId),
                "sensors.items.JSONkey": { $in: JSONkeys }
            }
        },
        // { $unwind: "$sensors" },
        {
            $project: {
                "user": "$user",
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

notifySchema.statics.getControlItems = function (deviceId, STATEkeys, JSONkey) {
    console.log(deviceId, STATEkeys, JSONkey)
    return this.model('Notify').aggregate([
        {
            $match: {
                device: mongoose.Types.ObjectId(deviceId),
                "control.JSONkey": JSONkey,
                "control.items.JSONkey": { $in: STATEkeys }
            }
        },
        {
            $project: {
                "user": "$user",
                "control": {
                    $filter: {
                        input: "$control",
                        cond: { $in: ["$$this.JSONkey", [JSONkey]] }
                    }
                }
            }
        },
        { $unwind: "$control" },
        {
            $project: {
                "user": "$user",
                "control.items": {
                    $filter: {
                        input: "$control.items",
                        cond: { $in: ["$$this.JSONkey", STATEkeys] }
                    }
                }
            }
        },
    ])
}

notifySchema.statics.updateItems = function (deviceId, mode, itemIDs, userIDs, updateObj) {
    return this.model('Notify').updateMany({
        device: ObjectId(deviceId),
        user: { $in: userIDs },
        [`${mode}.items._id`]: {
            $in: itemIDs
        }
    }, updateObj,
        {
            arrayFilters: [{ "inner._id": { $in: itemIDs } }]
        })
}

notifySchema.statics.refreshSensorsItems = function (deviceId, { items: itemsSended, users: usersSended }, { unSatisfiedItems, satisfiedItems, users: usersNotSneded }) {
    usersSended = Array.from(usersSended).map(id => ObjectId(id))
    usersNotSneded = Array.from(usersNotSneded).map(id => ObjectId(id))
    itemsSended = itemsSended.map(id => ObjectId(id))
    satisfiedItems = satisfiedItems.map(id => ObjectId(id))
    unSatisfiedItems = unSatisfiedItems.map(id => ObjectId(id))

    const mode = "sensors"
    // TODO use Bulk write - https://mongoosejs.com/docs/api.html#model_Model.bulkWrite
    this.model("Notify").updateItems(deviceId, mode, itemsSended, usersSended, {
        $set: {
            "sensors.items.$[inner].tmp": {
                lastSendAt: new Date(),
                lastSatisfied: true,
            }
        }
    }).exec()

    this.model("Notify").updateItems(deviceId, mode, unSatisfiedItems, usersNotSneded, {
        $set: {
            "sensors.items.$[inner].tmp": {
                lastSatisfied: false,
            }
        }
    }).exec()

    this.model("Notify").updateItems(deviceId, mode, satisfiedItems, usersNotSneded, {
        $set: {
            "sensors.items.$[inner].tmp": {
                lastSatisfied: true,
            }
        }
    }).exec()
}

notifySchema.statics.refreshControlItems = function (deviceId, { items: itemsSended, users: usersSended }, { unSatisfiedItems, satisfiedItems, users: usersNotSneded }) {
    usersSended = Array.from(usersSended).map(id => ObjectId(id))
    usersNotSneded = Array.from(usersNotSneded).map(id => ObjectId(id))
    itemsSended = itemsSended.map(id => ObjectId(id))
    satisfiedItems = satisfiedItems.map(id => ObjectId(id))
    unSatisfiedItems = unSatisfiedItems.map(id => ObjectId(id))

    const mode = "control"
    // TODO use Bulk write - https://mongoosejs.com/docs/api.html#model_Model.bulkWrite
    this.model("Notify").updateItems(deviceId, mode, itemsSended, usersSended, {
        $set: {
            "control.$[].items.$[inner].tmp": {
                lastSendAt: new Date(),
                lastSatisfied: true,
            }
        }
    }).exec()

    this.model("Notify").updateItems(deviceId, mode, unSatisfiedItems, usersNotSneded, {
        $set: {
            "control.$[].items.$[inner].tmp": {
                lastSatisfied: false,
            }
        }
    }).exec()

    this.model("Notify").updateItems(deviceId, mode, satisfiedItems, usersNotSneded, {
        $set: {
            "control.$[].items.$[inner].tmp": {
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
            "sensors.items": { JSONkey: { $nin: JSONkeys } }
        }

    })
}

notifySchema.statics.removeSpareControl = function (deviceId, JSONkeys) {
    console.log(deviceId, JSONkeys)
    return this.model("Notify").updateOne({
        device: ObjectId(deviceId),
    }, {
        $pull: {
            "control": { JSONkey: { $nin: JSONkeys } }
        }

    })
}

export default mongoose.model('Notify', notifySchema)