import mongoose, { Document } from 'mongoose';
import { IUser } from '../interface/userInterface';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

export interface IUserDocument extends IUser, Document {}

export const userSchemaPlain = {
    info: {
        userName: { type: String, required: true, index: { unique: true } },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, lowercase: true, index: { unique: true } },
        phoneNumber: { type: String },
    },
    auth: {
        type: { type: String, default: 'passwd', enum: ['passwd', 'webAuth'] },
        password: { type: String, required: true },
    },
    groups: { type: [String], default: ['user'] },
    devices: Object, // {sensors: {order: [id, id, id]}, }
    notifyTokens: [],
    accessTokens: [
        {
            name: String,
            token: { type: String },
            permissions: [{ type: String, enum: ['read', 'write', 'control'] }],
            createdAt: Date,
            validTo: Date,
        },
    ],
    realm: String,
};
