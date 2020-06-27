import resetTime from 'framework/src/utils/resetTime'
import mongoose from 'mongoose'
import HistoricalSchema from './schema/historical'
import { isDay as isDayFn } from '../lib/util'

HistoricalSchema.index({ device: 1, day: -1 })

HistoricalSchema.statics.saveData = function (deviceID, query, updateTime) {
    const nsamples = isDayFn(updateTime) ? "nsamples.day" : "nsamples.night"
    return this.model("ControlHistory").updateOne(
        {
            device: mongoose.Types.ObjectId(deviceID),
            "nsamples.day": { $lt: 200 },
            "nsamples.night": { $lt: 200 },
            day: resetTime(new Date())
        },
        {
            $push: query.update,
            $min: { first: updateTime, ...query.min },
            $max: { last: updateTime, ...query.max },
            $inc: { [nsamples]: 1, ...query.inc },
        }, { upsert: true, setDefaultsOnInsert: true }).exec() // setDefaultsOnInsert is required to properly work with $lt and upsert
}

HistoricalSchema.statics.getData = function (deviceID, from, to) {
    return this.model("ControlHistory").find({
        device: mongoose.Types.ObjectId(deviceID),
        day: {
            $gte: from, $lte: to
        }
    }).sort({ "first": 1 }).then(docs => {
        return docs
    })
}

export default mongoose.model('ControlHistory', HistoricalSchema)