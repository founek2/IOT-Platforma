const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
          updatedAt: Date     // to calculate interval
     }, // {temp1: [[10, timestamp], ...]}
     sampleInterval: Number,
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
