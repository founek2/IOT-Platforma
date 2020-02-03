const mongoose = require('mongoose')
import resetTime from 'framework/src/utils/resetTime'
const Schema = mongoose.Schema


const SensorDataSchema = new Schema({
    device: { type: 'ObjectId', ref: 'Device' },
    day: Date,
    first: Date,
    last: Date,
    samples: Object, // {temp: [{val: Object, time: Date}]}
    timestamps: Array,
    min: Object,
    max: Object,
    sum: {
        day: Object,
        night: Object,
    },
    nsamples: {
        day: { type: Number, default: 0 },
        night: { type: Number, default: 0 },
    }

})

SensorDataSchema.index({ device: 1, day: -1 })

SensorDataSchema.statics.saveData = function (deviceID, pushQuery, sumInc, minQuery, maxQuery, sampleTime, isDay) {
    const nsamples = isDay ? "nsamples.day" : "nsamples.night"
    return this.model("SensorData").updateOne(
        {
            device: mongoose.Types.ObjectId(deviceID),
            "nsamples.day": { $lt: 200 },
            "nsamples.night": { $lt: 200 },
            day: resetTime(new Date())
        },
        {
            $push: pushQuery,
            $min: { first: sampleTime, ...minQuery },
            $max: { last: sampleTime, ...maxQuery },
            $inc: { [nsamples]: 1, ...sumInc },
        }, { upsert: true, setDefaultsOnInsert: true }).exec() // setDefaultsOnInsert is required to properly work with $lt and upsert
}

SensorDataSchema.statics.getData = function (deviceID, from, to) {
    return this.model("SensorData").find({
        device: mongoose.Types.ObjectId(deviceID),
        day: {
            $gte: from, $lte: to
        }
        // day: resetTime()
        // $or: [
        //     {
        //         first: {
        //             $gte: from, $lte: to
        //         }
        //     },
        //     {
        //         last: {
        //             $gte: from, $lte: to
        //         }
        //     }
        // ]
    }).sort({ "first": 1 }).then(docs => {
        return docs
    })
}

export default mongoose.model('SensorData', SensorDataSchema)