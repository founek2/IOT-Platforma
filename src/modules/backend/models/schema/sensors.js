import catcher from 'framework/src/mongoose/catcher'
import { isNotEmpty } from 'ramda-extension'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dataSchema = new Schema({
     value: Number,
     timneStamp: { type: Date, default: Date.now }
})

const subSensorSchema = new Schema({
     id: { type: mongoose.Types.ObjectId, default: mongoose.Types.ObjectId() },
     name: String,
     unit: String,
     actData: dataSchema,
     historicalData: [dataSchema],
     order: Number
})

const sensorSchema = new Schema(
     {
          public: Boolean,
          devices: [subSensorSchema]
     },
     {
          toObject: {
               transform: function(doc, ret) {
                    ret.id = ret._id.toString()
                    delete ret.__v
                    delete ret._id
               }
          }
     }
)

export default sensorSchema
