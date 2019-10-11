import catcher from 'framework/src/mongoose/catcher'
import { isNotEmpty } from 'ramda-extension'
import sensorsScheme from './schema/sensors'
import controlScheme from './schema/control'
import hat from 'hat'
import { devLog } from 'framework/src/Logger'
import SensorData from './SensorData'
import { keys } from 'ramda'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gpsSchema = new Schema({
     type: { type: String, default: 'Point' },
     coordinates: Array
})

const deviceSchema = new Schema(
     {
          title: { type: String, required: true },
          description: { type: String },
          imgPath: { type: String },
          gps: gpsSchema,
          sampleInterval: Number,
          sensors: sensorsScheme,
          control: controlScheme,
          apiKey: { type: String, default: hat, index: { unique: true } },
          // created: { type: Date, default: Date.now },
          createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
          // permissions: ["read"(senzory), "write"(upravovat device), "control" (ovládat)],
          publicRead: Boolean,
          permissions: {
               read: [{ type: 'ObjectId', ref: 'User' }],
               write: [{ type: 'ObjectId', ref: 'User' }],
               control: [{ type: 'ObjectId', ref: 'User' }]
          },
          topic: { type: String, required: true },
          lastLogin: Date,
          ack: Date,
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
          },
          timestamps: true
     },
)

deviceSchema.statics.updateAck = async function (ownerId, topic) {
     const result = await this.model('Device').updateOne({ createdBy: mongoose.Types.ObjectId(ownerId), topic }, { ack: new Date() })
     if (result.nModified != 1) throw new Error("Invalid id/topic")
}

deviceSchema.statics.login = async function (apiKey) {
     const result = await this.model('Device').updateOne({ apiKey }, { lastLogin: new Date() })
     return result.nModified === 1
}

deviceSchema.statics.create = async function ({ topic, ...object }, imgExtension, userID) {
     const Device = this.model('Device')
     const coordinates = [object.gpsLng, object.gpsLat]
     const objID = mongoose.Types.ObjectId(userID)

     // check for existence of topic (between all devices with createdBy: id), then create
     const result = await Device.findOne({ topic, createdBy: objID }).select("_id").lean()
     if (result) throw Error('topicAlreadyUsed')

     const newDevice = new Device({
          ...object,
          createdBy: objID,
          gps: { coordinates },
          permissions: { read: [objID], write: [objID], control: [objID] },
          topic: topic
     })
     if (imgExtension) newDevice.imgPath = `images/devices/${newDevice.id}.${imgExtension}`
     devLog("Creating device", newDevice)
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
     topic: 1,
}

deviceSchema.statics.findForUser = function (userID, devices) {
     console.log("loking for devices, userID=", userID)
     //return this.model('Device').find({ _id: { $in: arrayOfIDs.map(id => mongoose.Types.ObjectId(id)) } })
     const userObjID = mongoose.Types.ObjectId(userID)
     return this.model('Device')
          .aggregate([
               {
                    // $match: { _id: { $in: devices.map(({ id }) => id) } }
                    $match: {
                         $or: [
                              { publicRead: true },
                              { "permissions.write": userObjID },
                              { "permissions.read": userObjID },
                              { "permissions.control": userObjID },
                         ]
                    }
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
                         permissions: {
                              "read": {
                                   $cond: {
                                        if: { $in: [userObjID, '$permissions.read'] },
                                        then: '$permissions.read',
                                        else: '$$REMOVE'
                                   }
                              },
                              "write": {
                                   $cond: {
                                        if: { $in: [userObjID, '$permissions.write'] },
                                        then: '$permissions.write',
                                        else: '$$REMOVE'
                                   }
                              },
                              "control": {
                                   $cond: {
                                        if: { $in: [userObjID, '$permissions.control'] },
                                        then: '$permissions.control',
                                        else: '$$REMOVE'
                                   }
                              },
                         }
                    }
               }
          ])
          .catch(catcher('device'))
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

deviceSchema.statics.updateByFormData = function (deviceID, formData, imgExtension, { id, admin }) {
     if (formData.gpsLng && formData.gpsLat) {
          const coordinates = [formData.gpsLng, formData.gpsLat]
          formData.coordinates = coordinates
     }
     delete formData.gpsLat
     delete formData.gpsLng

     return this.model('Device')
          .findOne({ _id: mongoose.Types.ObjectId(deviceID) })
          .select('permissions createdBy imgPath')
          .then(async doc => {
               if (doc.permissions.write.some(id => id.toString() == id) || admin) { // two eq (==) are required
                    const { topic } = formData
                    if (topic) {
                         const result = await this.model('Device').find({ topic, createdBy: doc.createdBy, _id: { $ne: mongoose.Types.ObjectId(deviceID) } }).lean().count()
                         if (result) throw Error('topicAlreadyUsed')
                    }
                    const origImgPath = doc.imgPath
                    if (imgExtension) formData.imgPath = `images/devices/${doc.id}.${imgExtension}`
                    console.log("updating Device> ", formData)

                    return doc.updateOne(formData).then(() => origImgPath)
               } else {
                    throw Error("invalidPermissions")
               }
          }).catch(catcher('device'))
}

deviceSchema.statics.updateSensorsRecipe = async function (deviceId, sampleInterval, recipe, user) {
     const result = await this.model('Device')
          .updateOne(
               {
                    _id: deviceId,
                    ...(!user.admin && { "permissions.write": mongoose.Types.ObjectId(user.id) })
               },
               { $set: { "sensors.recipe": recipe, sampleInterval } }
          )

     if (result.nModified !== 1) throw new Error("invalidPermissions")
     return result
}

deviceSchema.statics.getOwnerAndTopic = async function (apiKey) {
     return this.model('Device').findOne({ apiKey }, { createdBy: 1, topic: 1, sampleInterval: 1, "sensors.historical.updatedAt": 1 }).lean().then(doc => {
          return doc ? { ownerId: doc.createdBy, topic: doc.topic } : {}
     })
}

deviceSchema.statics.updateSensorsData = async function (ownerId, topic, data, updateTime) {
     return this.model('Device')
          .findOneAndUpdate(
               { createdBy: ownerId, topic: topic },   // should be ObjectId?
               { $set: { "sensors.current": { data, updatedAt: updateTime } } },
               { fields: { sampleInterval: 1, "sensors.recipe": 1, "sensors.historical.updatedAt": 1, publicRead: 1, "sensors.historical.timestampsCount": 1, "permissions.read": 1 } }
          ).then(doc => {
               if (doc) {
                    console.log("sensorsData updated")
                    const { sampleInterval, sensors } = doc;
                    const { updatedAt } = sensors.historical

                    // -1 is never
                    if (sampleInterval !== -1 && (!updatedAt || (new Date() - updatedAt) / 1000 > sampleInterval)) {
                         const update = {}
                         const sum = {}
                         const min = {}
                         const max = {}
                         const isDay = updateTime.getHours() >= 6 && updateTime.getHours() < 20
                         doc.sensors.recipe.forEach(({ JSONkey }) => {
                              const val = Number(data[JSONkey])
                              update["samples." + JSONkey] = val
                              update["timestamps"] = updateTime
                              min["min." + JSONkey] = val;
                              max["max." + JSONkey] = val
                              if (isDay) {    // day
                                   sum["sum.day." + JSONkey] = val
                              } else {   // night
                                   sum["sum.night." + JSONkey] = val
                              }
                         })

                         SensorData.saveData(doc._id, update, sum, min, max, updateTime, isDay)     // async
                    } 
               
                    return { deviceID: doc._id.toString(), publicRead: doc.publicRead, permissions: {read: doc.permissions.read} }

               } else {
                    console.log("ERROR: saving sensors data to unexisting device")
               }
          })
}

deviceSchema.statics.delete = async function (deviceID, user) {  // TODO smazat případná data o zařízení u uživatelů
     return this.model('Device')
          .findOneAndDelete({
               _id: mongoose.Types.ObjectId(deviceID),
               ...(!user.admin && { "permissions.write": mongoose.Types.ObjectId(user.id) })
          }).lean().then(doc => {
               if (!doc) throw new Error("InvalidDeviceId")
               return doc
          })
}

deviceSchema.statics.getSensorsDataForAdmin = async function (deviceID, from, to) {
     return SensorData.getData(deviceID, from, to)
}

deviceSchema.statics.getSensorsData = async function (deviceID, from, to, user = {}) {

     const doc = await this.model('Device').findOne({
          _id: mongoose.Types.ObjectId(deviceID),
          $or: [{ "permissions.read": mongoose.Types.ObjectId(user.id) }, { publicRead: true }]
     }, "_id").lean()

     if (!doc) throw new Error("invalidPermissions")
     return SensorData.getData(deviceID, from, to)
}

deviceSchema.statics.getApiKey = async function (id, user = {}) {
     const doc = await this.model('Device').findOne({
          "_id": mongoose.Types.ObjectId(id),
          ...(!user.admin && { "permissions.write": mongoose.Types.ObjectId(user.id) })
     }, "-_id apiKey").lean()
     if (!doc) throw new Error("invalidPermissions")
     return doc.apiKey
}

deviceSchema.statics.updatePermissions = async function (id, permissions, user) {
     const result = await this.model('Device').updateOne({
          "_id": mongoose.Types.ObjectId(id),
          ...(!user.admin && { "permissions.write": mongoose.Types.ObjectId(user.id) })
     }, { permissions })
     if (result.nModified !== 1) throw new Error("invalidPermissions")
     return result
}

deviceSchema.statics.updateControlRecipe = async function (deviceID, controlRecipe, user) {
     const result = await this.model('Device')
          .updateOne(
               {
                    _id: deviceID,
                    ...(!user.admin && { "permissions.write": mongoose.Types.ObjectId(user.id) })
               },
               { $set: { "control.recipe": controlRecipe } }
          )

     if (result.nModified !== 1) throw new Error("invalidPermissions")
     return result
}

function prepareStateUpdate(data, updatedAt) {
     const result = {}
     keys(data).forEach(key => {
          result["control.current.data." + key] = { state: data[key], updatedAt }
     })

     return result
}

deviceSchema.statics.updateState = async function (deviceID, state, user) {
     const updateTime = new Date()
     const updateStateQuery = prepareStateUpdate(state, updateTime)

     const doc = await this.model('Device').findOneAndUpdate({
          "_id": mongoose.Types.ObjectId(deviceID),
          ...(!user.admin && { "permissions.control": mongoose.Types.ObjectId(user.id) })
     }, {
          $set: updateStateQuery
     }, { fields: { control: 1 }, new: true }).lean()
     if (!doc) throw new Error("invalidPermissions")
     return doc
}

deviceSchema.statics.canControl = async function (deviceID, user) {
     const doc = await this.model('Device').findOne({
          "_id": mongoose.Types.ObjectId(deviceID),
          ...(!user.admin && { "permissions.control": mongoose.Types.ObjectId(user.id) })
     }, "-_id").lean()
     return !!doc
}

deviceSchema.statics.getTopicByApiKey = async function (apiKey) {
     const doc = await this.model('Device').findOne({
          apiKey
     }, "-_id topic createdBy").lean()
     return doc
}

export default mongoose.model('Device', deviceSchema)
