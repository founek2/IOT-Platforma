const mongoose = require('mongoose')
const Schema = mongoose.Schema

const controlSchema = new Schema({
    recipe: [
        {
            _id: false,
            name: String,
            type: { type: String },   // mongoos would type interpret as internal type keyword
            JSONkey: String,
            description: String,
            ipAddress: String,
        }
    ],
    current: {
        data: Object, // {jsonKey: {state: 1, updatedAt: Date.now()}}
    },
},
    {
        toObject: {
            transform: function (doc, ret) {
                delete ret.__v
            }
        },
        _id: false
    }
)

export default controlSchema
