import catcher from 'framework/src/mongoose/catcher'
import { isNotEmpty } from 'ramda-extension'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dataSchema = new Schema({
     value: Number,
     timneStamp: { type: Date, default: Date.now }
})

const sensorSchema = new Schema({
     recipe: [{
          _id:false,
          name: String,
          unit: String,
          JSONkey: String,
          description: String,
     }],
     current: {
          data: Object,
          updatedAt: Date
     }, // {temp1: 100}
     historical: {
          updatedAt: Date
     }, // {temp1: [[10, timestamp], ...]}
},
{
     toObject: {
          transform: function(doc, ret) {
               delete ret.__v
          }
     },
     _id: false
}
)

export default sensorSchema
