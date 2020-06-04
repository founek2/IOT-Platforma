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
                    _id: false,
                    JSONkey: String,
                    description: String,
                    type: String,   // type is reserver keyword
                    value: String,
                    interval: Number,
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
    console.log({deviceId, userId})
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

export default mongoose.model('Notify', notifySchema)