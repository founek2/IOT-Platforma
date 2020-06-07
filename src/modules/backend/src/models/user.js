import mongoose, { Schema } from 'mongoose'
import Jwt from 'framework/src/services/jwt'
import { createHash, compare } from '../lib/password'
import catcher from 'framework/src/mongoose/catcher'
import { keys } from 'ramda'
import { devLog } from 'framework/src/Logger'

const ObjectId = mongoose.Types.ObjectId
const userSchema = new Schema(
     {
          info: {
               userName: { type: String, required: true, index: { unique: true } },
               firstName: { type: String, required: true },
               lastName: { type: String, required: true },
               email: { type: String, lowercase: true },
               phoneNumber: { type: String },
          },
          auth: {
               type: { type: String, default: 'passwd', enum: ['passwd', 'webAuth'] },
               password: { type: String, required: true }
          },
          // created: { type: Date, default: Date.now },
          groups: { type: [String], default: ['user'] },
          devices: Object, // {sensors: {order: [id, id, id]}, }
          notifyTokens: [],
     },
     {
          toObject: {
               transform: function (doc, ret) {
                    ret.id = ret._id.toString()
                    delete ret.__v
                    delete ret._id
                    if (ret.auth) delete ret.auth.password
                    if (ret.deviceUser) delete ret.deviceUser.password
               }
          },
          timestamps: true
     },
)

userSchema.statics.create = function (object) {
     const { password, authType } = object.auth
     if (authType) throw new Error('notImplemented')
     const User = this.model('User')
     devLog("user creating:", object)
     return createHash(password)
          .then(hash => {
               const user = new User({ ...object, auth: { password: hash } })
               return user.save().then(obj => {
                    obj = obj.toObject()
                    delete obj.password

                    return Jwt.sign(obj).then(token => {
                         return { doc: obj, token }
                    })
               })
          })
          .catch(catcher('user'))
}

userSchema.statics.findByUserName = function (userName) {
     return this.model('User').findOne({ 'info.userName': userName })
}

userSchema.statics.checkCreditals = function ({ userName, password, authType }) {
     if (authType !== 'passwd') throw new Error('notImplemented')
     return this.model('User')
          .findOne({ 'info.userName': userName, 'auth.type': { $eq: authType } })
          .then(doc => {
               if (doc) {
                    if (authType === 'passwd') {
                         return compare(password, doc.auth.password).then(out => {
                              if (out) {
                                   return Jwt.sign({ id: doc._id }).then(token => {
                                        const obj = doc.toObject()
                                        delete obj.password
                                        return {
                                             token,
                                             doc: obj
                                        }
                                   })
                              } else throw Error('passwordMissmatch')
                         })
                    }
               } else {
                    throw Error('unknownUser')
               }
          })
          .catch(catcher('user'))
}

userSchema.statics.checkExist = async function (userID = "") {
     if (userID.length != 24) return false

     return await this.model('User').exists({
          _id: mongoose.Types.ObjectId(userID),
     })
}

userSchema.statics.findAll = function () {
     return this.model('User')
          .find({}, '-password')
          .then(docs => {
               return docs.map(doc => doc.toObject())
          })
          .catch(catcher('user'))
}

userSchema.statics.findAllNotRoot = function () {
     return this.model('User')
          .find({ groups: { $ne: 'root' } }, '-password')
          .then(docs => {
               return docs.map(doc => doc.toObject())
          })
          .catch(catcher('user'))
}

userSchema.statics.removeUsers = function (arrayOfIDs) {
     return this.model('User')
          .deleteMany({ _id: { $in: arrayOfIDs.map(id => mongoose.Types.ObjectId(id)) } })
          .catch(catcher('user'))
}

userSchema.statics.addDevice = function (deviceID, userID) {
     return this.model('User')
          .updateOne(
               { _id: mongoose.Types.ObjectId(userID) },
               { $push: { devices: { id: mongoose.Types.ObjectId(deviceID) } } }
          )
          .catch(catcher('user'))
}


userSchema.statics.updateUser = async function (userID, data) {
     if (keys(data.auth).length === 1) delete data.auth
     else if (data.auth && data.auth.password) {
          const { password } = data.auth;
          const hash = await createHash(password)
          data.auth.password = hash;
     }
     return this.model('User')
          .findOneAndUpdate({ _id: mongoose.Types.ObjectId(userID) }, { $set: data })
}

userSchema.statics.findAllUserNames = function () {
     return this.model("User").find({
          groups: { $ne: "root" }
     }, "info.userName").lean().sort({ "info.userName": 1 })

}

userSchema.statics.addNotifyToken = function (userID, token) {
     return this.model('User')
          .updateOne(
               { _id: ObjectId(userID) },
               { $addToSet: { notifyTokens: token } }
          )
}

userSchema.statics.removeNotifyTokens = function (tokens) {
     return this.model('User').updateMany({
          "notifyTokens": { $in: tokens }
     }, {
          $pull: { "notifyTokens": { $in: tokens } }
     })
}

userSchema.statics.getNotifyTokens = function (userID) {
     return this.model('User')
          .findOne(
               { _id: ObjectId(userID) },
          ).select("notifyTokens").lean()
}

const User = mongoose.model('User', userSchema)
export default User
