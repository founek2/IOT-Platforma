import resetTime from 'framework/src/utils/resetTime'
import mongoose from 'mongoose'
import HistoricalSchema from './schema/historical'

HistoricalSchema.index({ device: 1, day: -1 })

HistoricalSchema.statics.saveData = function (deviceID, pushQuery, sumInc, minQuery, maxQuery, sampleTime, isDay) {
    const nsamples = isDay ? "nsamples.day" : "nsamples.night"
    return this.model("SensorHistory").updateOne(
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

HistoricalSchema.statics.getData = function (deviceID, from, to) {
    return this.model("SensorHistory").find({
        device: mongoose.Types.ObjectId(deviceID),
        day: {
            $gte: from, $lte: to
        }
    }).sort({ "first": 1 }).lean().then(docs => {
        return docs
    })
}

export default mongoose.model('SensorHistory', HistoricalSchema)