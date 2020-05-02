const mongoose = require('mongoose')
const Schema = mongoose.Schema

const notifySchema = new Schema(
    {
        device: { type: mongoose.Types.ObjectId, ref: 'Device' },
        sensors: [
            {
                _id: false,
                user: {type: mongoose.Types.ObjectId, ref: 'User' },
                JSONkey: String,
                description: String,
                type: String,
                value: String,
                interval: Number,
            }
        ],
        control: [
 {
                _id: false,
                user: {type: mongoose.Types.ObjectId, ref: 'User' },
                JSONkey: String,
                description: String,
                type: String,   // change?
                // value: String,
                // interval: Number,
            }
        ]
    })

export default mongoose.model('Notify', notifySchema)