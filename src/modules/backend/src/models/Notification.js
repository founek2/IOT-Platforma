const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const notifySchema = new Schema(
    {
        device: { $type: ObjectId, ref: 'Device', index: { unique: true } },
        sensors: [
            {
                _id: false,
                user: { $type: ObjectId, ref: 'User' },
                items: [{
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
                        daysOfWeek: [Number],
                    }
                }]
            }
        ],
        control: [
            {
                _id: false,
                user: { $type: ObjectId, ref: 'User' },
                items: [{
                    _id: false,
                    JSONkey: String,
                    description: String,
                    type: String,   // change?
                    // value: String,
                    // interval: Number,
                }]
            }
        ]
    }, { typeKey: '$type' })

/**
 * property - sensors/control
 */
notifySchema.statics.addOrUpdate = async function (userId, deviceId, array, property) {
    console.log("array", array)
    const Notify = this.model('Notify')

    const existForDevice = await Notify.exists({ device: ObjectId(deviceId), })

    if (existForDevice) {
        const existForUser = await Notify.exists({ device: ObjectId(deviceId), [`${property}.user`]: ObjectId(userId) })
        if (existForUser) {
            return Notify.updateOne({
                device: ObjectId(deviceId),
                [`${property}.user`]: ObjectId(userId)
            }, {
                $set: { [`${property}.$.items`]: array },
            }).exec()
        }
        else
            return Notify.updateOne({
                device: ObjectId(deviceId),
            }, {
                $push: {
                    [property]: {
                        user: ObjectId(userId),
                        items: array,
                    }
                },
            }).exec()

    } else {
        return new Notify({
            device: ObjectId(deviceId),
            [property]: [{
                user: ObjectId(userId),
                items: array,
            }]
        }).save()
    }
}

notifySchema.statics.addOrUpdateSensors = function (userId, deviceId, data) {
    return this.model('Notify').addOrUpdate(userId, deviceId, data, "sensors")
}

notifySchema.statics.addOrUpdateControl = function (userId, deviceId, data) {
    return this.model('Notify').addOrUpdate(userId, deviceId, data, "control")
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

export default mongoose.model('Notify', notifySchema)