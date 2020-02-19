import mongoose from 'mongoose'

const Schema = mongoose.Schema

const deviceSchema = new Schema(
    {
        challenge: [],
    })

export default mongoose.model('Auth', deviceSchema)