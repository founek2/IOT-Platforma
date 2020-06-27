const mongoose = require('mongoose')
const Schema = mongoose.Schema

export default new Schema({
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