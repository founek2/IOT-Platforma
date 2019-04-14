import catcher from 'framework/src/mongoose/catcher'
import { isNotEmpty } from 'ramda-extension'
import sensors from './schema/sensors'
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
          sensors: sensors,
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
          }
     },
     {
          toObject: {
               transform: function(doc, ret) {
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
     }
)
deviceSchema.statics.create = function(object, imgExtension, userID) {
     const Device = this.model('Device')
     const coordinates = [object.gpsLng, object.gpsLat]
     const objID = mongoose.Types.ObjectId(userID)
     const newDevice = new Device({
          ...object,
          createdBy: objID,
          gps: { coordinates },
          permissions: { read: [objID], write: [objID], control: [objID] }
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

deviceSchema.statics.createAndAddToUser = function(object, imgExtension, userID) {
     return this.model('Device')
          .create(object, imgExtension, userID)
          .then(deviceDoc => {
               return this.model('User')
                    .addDevice(deviceDoc.id, userID)
                    .then(() => deviceDoc)
          })
          .catch(catcher('device'))
}

deviceSchema.statics.findForUser = function(userID, devices) {
     //return this.model('Device').find({ _id: { $in: arrayOfIDs.map(id => mongoose.Types.ObjectId(id)) } })
     const userObjID = mongoose.Types.ObjectId(userID)
     return this.model('Device')
          .aggregate([
               {
                    $match: { _id: { $in: devices.map(({ id }) => id) } }
               },
               {
                    $project: {
                         id: '$_id',
                         _id: 0,
                         title: 1,
                         description: 1,
                         imgPath: 1,
                         gpsLat: { $arrayElemAt: ['$gps.coordinates', 0] },
                         gpsLng: { $arrayElemAt: ['$gps.coordinates', 1] },
                         created: 1,
                         createdBy: 1,
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
                              $cond: {
                                   if: { $in: [userObjID, '$permissions.write'] },
                                   then: '$permissions',
                                   else: '$$REMOVE'
                              }
                         }
                    }
               }
          ])
          .then(docs => {
               return docs
          }).catch(catcher('device'))
}

deviceSchema.statics.updateByFormData = function(formData, userID) {
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
               if (doc.permissions.write.some(id => id.toString() === userID)){
				return this.model('Device').updateOne({ _id: mongoose.Types.ObjectId(formData.id) }, formData)
			}else {
				throw Error("invalidPermissions")
			}
          }).catch(catcher('device'))
}

const Device = mongoose.model('Device', deviceSchema)
export default Device
