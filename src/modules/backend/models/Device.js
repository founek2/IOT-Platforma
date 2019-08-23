import catcher from 'framework/src/mongoose/catcher'
import { isNotEmpty } from 'ramda-extension'
import sensorsScheme from './schema/sensors'
import hat from 'hat'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gpsSchema = new Schema({
     type: { type: String, default: 'Point' },
     coordinates: Array
})

const userRef = new Schema({
     type: { type: mongoose.Types.ObjectId, ref: 'User' }
})

const deviceSchema = new Schema(
     {
          title: { type: String, required: true },
          description: { type: String },
          imgPath: { type: String },
          gps: gpsSchema,
          sampleInterval: Number,
          sensors: sensorsScheme,
          controll: [],
          apiKey: { type: String, default: hat, index: { unique: true } },
          created: { type: Date, default: Date.now },
          createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
          // permissions: ["read"(senzory), "write"(upravovat device), "control" (ovládat)],
          publicRead: Boolean,
          permissions: {
               read: [{ type: 'ObjectId', ref: 'User' }],
               write: [{ type: 'ObjectId', ref: 'User' }],
               control: [{ type: 'ObjectId', ref: 'User' }]
          },
          topic: { type: String, required: true }
     },
     {
          toObject: {
               transform: function (doc, ret) {
                    ret.id = ret._id.toString()
                    delete ret.__v
                    delete ret._id
                    if (ret.gps) {

                         ret.gpsLat = ret.gps.coordinates[0]
                         ret.gpsLng = ret.gps.coordinates[1]
                         delete ret.gps;
                    }

               }
          }
     },
     { timestamps: true }
)

deviceSchema.statics.isExists = function (apiKey) {
     return this.model('Device').findOne({ apiKey }, "_id")
}

deviceSchema.statics.create = async function ({ topic, ...object }, imgExtension, userID) {
     const Device = this.model('Device')
     const coordinates = [object.gpsLng, object.gpsLat]
     const objID = mongoose.Types.ObjectId(userID)

     // check for existence of topic (between all devices with createdBy: id), then create
     const result = await Device.findOne({topic, createdBy: objID}).select("_id").lean()
     if (result) throw Error('topicAlreadyUsed')
     
     const newDevice = new Device({
          ...object,
          createdBy: objID,
          gps: { coordinates },
          permissions: { read: [objID], write: [objID], control: [objID] },
          topic: topic
     })
     if (imgExtension) newDevice.imgPath = `images/devices/${newDevice.id}.${imgExtension}`
     return newDevice
          .save()
          .then(obj => {
               const doc = obj.toObject()
               return doc
          })
          .catch(catcher('device'))
}

deviceSchema.statics.createAndAddToUser = function (object, imgExtension, userID) {
     return this.model('Device')
          .create(object, imgExtension, userID)
          .then(deviceDoc => {
               return this.model('User')
                    .addDevice(deviceDoc.id, userID)
                    .then(() => deviceDoc)
          })
          .catch(catcher('device'))
}

const aggregationFields = {
     id: '$_id',
     _id: 0,
     title: 1,
     description: 1,
     imgPath: 1,
     gpsLat: { $arrayElemAt: ['$gps.coordinates', 0] },
     gpsLng: { $arrayElemAt: ['$gps.coordinates', 1] },
     created: 1,
     createdBy: 1,
     sampleInterval: 1,
     publicRead: 1,
}

deviceSchema.statics.findForUser = function (userID, devices) {
     //return this.model('Device').find({ _id: { $in: arrayOfIDs.map(id => mongoose.Types.ObjectId(id)) } })
     const userObjID = mongoose.Types.ObjectId(userID)
     return this.model('Device')
          .aggregate([
               {
                    $match: { _id: { $in: devices.map(({ id }) => id) } }
               },
               {
                    $project: {
                         ...aggregationFields,
                         control: {
                              $cond: {
                                   if: { $in: [userObjID, '$permissions.control'] },
                                   then: '$control',
                                   else: '$$REMOVE'
                              }
                         },
                         sensors: {
                              $cond: {
                                   if: { $or: [{ $in: [userObjID, '$permissions.read'] }, '$publicRead'] },
                                   then: '$sensors',
                                   else: '$$REMOVE'
                              }
                         },
                         "permissions.write": {
                              $cond: {
                                   if: { $in: [userObjID, '$permissions.write'] },
                                   then: '$permissions.write',
                                   else: '$$REMOVE'
                              }
                         },
                         "permissions.read": {
                              $cond: {
                                   if: { $in: [userObjID, '$permissions.read'] },
                                   then: '$permissions.read',
                                   else: '$$REMOVE'
                              }
                         },
                         "permissions.control": {
                              $cond: {
                                   if: { $in: [userObjID, '$permissions.control'] },
                                   then: '$permissions.control',
                                   else: '$$REMOVE'
                              }
                         },
                    }
               }
          ])
          .then(docs => {
               return docs
          }).catch(catcher('device'))
}

deviceSchema.statics.findForAdmin = function () {
     return this.model('Device')
          .aggregate(
               [{
                    $project: {
                         ...aggregationFields,
                         control: 1,
                         sensors: 1,
                         permissions: 1
                    }
               }]
          )
          .then(docs => {
               return docs
          }).catch(catcher('device'))
}

deviceSchema.statics.findPublic = function () {
     return this.model('Device')
          .aggregate(
               [
                    { $match: { publicRead: true } },
                    {
                         $project: {
                              ...aggregationFields,
                              sensors: 1,
                         }
                    }]
          )
          .then(docs => {
               return docs
          }).catch(catcher('device'))
}

deviceSchema.statics.updateByFormData = function (formData, userID) {
     if (formData.gpsLng && formData.gpsLat) {
          const coordinates = [formData.gpsLng, formData.gpsLat]
          formData.coordinates = coordinates
     }
     delete formData.gpsLat
     delete formData.gpsLng

     return this.model('Device')
          .findOne({ _id: mongoose.Types.ObjectId(formData.id) })
          .select('permissions')
          .then(doc => {
               if (doc.permissions.write.some(id => id.toString() === userID)) {
                    console.log("updating Device> ", formData)
                    return this.model('Device').updateOne({ _id: mongoose.Types.ObjectId(formData.id) }, formData)
               } else {
                    throw Error("invalidPermissions")
               }
          }).catch(catcher('device'))
}

deviceSchema.statics.updateSensorsRecipe = function (deviceId, sampleInterval, recipe) {
     return this.model('Device')
          .findOneAndUpdate({ _id: deviceId }, { $set: { "sensors.recipe": recipe, sampleInterval } }).then((n, e) => { console.log(n, e) })
}

deviceSchema.statics.getOwnerAndTopic = async function (apiKey) {
     return this.model('Device').findOne({ apiKey }, { createdBy: 1, topic: 1, sampleInterval: 1, "sensors.historical.updatedAt": 1}).then(doc => {
          return doc ? { ownerId: doc.createdBy, topic: doc.topic } : {}
     })
}

deviceSchema.statics.updateSensorsData = async function (ownerId, topic, data, updateTime) {
     return this.model('Device')
          .findOneAndUpdate(
               { createdBy: ownerId, topic: topic },
               { $set: { "sensors.current": { data, updatedAt: updateTime} } },
               { fields: { sampleInterval: 1, "sensors.recipe": 1, "sensors.historical.updatedAt": 1, publicRead: 1 } }
          ).then(doc => {
               if (doc) {
                    console.log("sensorsData updated")
                    const { sampleInterval } = doc;
                    const { updatedAt } = doc.sensors.historical

                    const timeDiffSeconds = (new Date() - updatedAt) / 1000
                    if (sampleInterval !== -1 && !updatedAt || timeDiffSeconds > sampleInterval) {
                         const update = {}
                         doc.sensors.recipe.forEach(({ JSONkey }) => {
                              update["sensors.historical.data." + JSONkey] = [data[JSONkey], updateTime]
                         })

                         return doc.updateOne({ $push: update, "sensors.historical.updatedAt": new Date() }).then(out => {
                              console.log("sensorsData saved historical")
                              return {deviceID: doc._id, publicRead: doc.publicRead}
                         })
                    } else  return {deviceID: doc._id, publicRead: doc.publicRead}
                   
               }else {
                    console.log("ERROR: saving sensors data to unexisting device", )
               }
          })
}

const Device = mongoose.model('Device', deviceSchema)
export default Device
