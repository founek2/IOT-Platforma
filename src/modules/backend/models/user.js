import mongoose, { Schema } from 'mongoose'
import Jwt from '../../framework/src/services/jwt'
import { createHash, compare } from '../lib/password'
import catcher from 'framework/src/mongoose/catcher'
import { isNotEmpty } from 'ramda-extension'
import { difference } from 'ramda'
import { isRoot } from 'framework/src/utils/groups'

const userSchema = new Schema(
     {
          userName: { type: String, required: true, index: { unique: true } },
          firstName: { type: String, required: true },
          lastName: { type: String, required: true },
          email: { type: String, lowercase: true },
          auth: {
               type: { type: String, default: 'passwd', enum: ['passwd', 'webAuth'] },
               password: { type: String, required: true }
          },
          phoneNumber: { type: String },
          created: { type: Date, default: Date.now },
          groups: { type: [String], default: ['user'] },
          devices: {type: Array, default: []}
     },
     {
          toObject: {
               transform: function(doc, ret) {
                    ret.id = ret._id.toString()
                    delete ret.__v
                    delete ret._id
                    delete ret.auth.password
               }
          }
     }
)

userSchema.statics.create = function(object) {
     const { password, authType } = object
     if (authType) throw new Error('notImplemented')
     const User = this.model('User')
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

userSchema.statics.findByUserName = function(userName) {
     return this.model('User').findOne({ userName: userName })
}

userSchema.statics.checkCreditals = function({ userName, password, authType }) {
     if (authType !== 'passwd') throw new Error('notImplemented')
     return this.model('User')
          .findOne({ userName, 'auth.type': { $eq: authType } })
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
                              } else throw Error('passwordMissMatch')
                         })
                    }
               } else {
                    throw Error('unknownUser')
               }
          })
          .catch(catcher('user'))
}

userSchema.statics.findAll = function() {
     return this.model('User')
          .find({}, '-password')
          .then(docs => {
               return docs.map(doc => doc.toObject())
          })
          .catch(catcher('user'))
}

userSchema.statics.findAllNotRoot = function() {
     return this.model('User')
          .find({ groups: { $ne: 'root' } }, '-password')
          .then(docs => {
               return docs.map(doc => doc.toObject())
          })
          .catch(catcher('user'))
}

userSchema.statics.removeUsers = function(arrayOfIDs) {
     return this.model('User')
          .deleteMany({ _id: { $in: arrayOfIDs.map(id => mongoose.Types.ObjectId(id)) } })
          .catch(catcher('user'))
}

userSchema.statics.addDevice = function(deviceID, userID) {
     return this.model('User')
          .updateOne(
               { _id: mongoose.Types.ObjectId(userID) },
               { $push: { devices: { id: mongoose.Types.ObjectId(deviceID) } } }
          )
          .catch(catcher('user'))
}

const User = mongoose.model('User', userSchema)
export default User
