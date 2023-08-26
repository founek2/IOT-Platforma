import mongoose, { Model } from 'mongoose';
import { IUser } from './interface/userInterface.js';
import { IUserDocument, userSchemaPlain } from './schema/userSchema.js';
import { NotifyModel } from './notifyModel.js';
import { DeviceModel } from './deviceModel.js';

const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;

export const userSchema = new Schema<IUserDocument, IUserModel>(userSchemaPlain, {
    toObject: {
        transform: function (doc, ret) {
            ret.id = ret._id.toString();
            delete ret.__v;
            // delete ret._id;
            delete ret.accessTokens;
            if (ret.auth) delete ret.auth;
        },
    },
    timestamps: true,
});

export interface IUserModel extends Model<IUserDocument> {
    findByUserName(userName: string): Promise<IUser | null>;
    findAllNotRoot(): Promise<IUserDocument[]>;
    findAll(): Promise<IUserDocument[]>;
    removeUsers(ids: Array<IUser['_id']>): Promise<{ deletedCount?: number }>;
    findAllUserNames(): Promise<Array<{ _id: IUserDocument['_id']; info: { userName: string } }>>;
    addNotifyToken(userId: IUser['_id'], token: string): Promise<void>;
    removeNotifyTokens(tokens: string[]): Promise<void>;
    getNotifyTokens(userId: IUser['_id']): Promise<{ notifyTokens: string[] }>;
    checkExists(userId?: string): Promise<boolean>;
}

userSchema.statics.findByUserName = function (userName) {
    return this.findOne({ 'info.userName': userName }).lean();
};

userSchema.statics.findAll = function () {
    return this.find({});
};

userSchema.statics.findAllNotRoot = function () {
    return this.find({ groups: { $ne: 'root' } });
};

userSchema.statics.removeUsers = function (arrayOfIDs: Array<IUser['_id']>) {
    const ids = arrayOfIDs.map((id) => mongoose.Types.ObjectId(id));
    NotifyModel.deleteMany({
        user: { $in: ids },
    }).exec();
    DeviceModel.updateMany(
        {},
        {
            $pull: {
                // @ts-ignore
                'permissions.read': { $in: ids },
                'permissions.write': { $in: ids },
                'permissions.control': { $in: ids },
            },
        }
    ).exec();
    return this.deleteMany({ _id: { $in: ids } });
};

userSchema.statics.findAllUserNames = function () {
    return this.find({}, 'info.userName').lean().sort({ 'info.userName': 1 });
};

userSchema.statics.addNotifyToken = function (userID: IUser['_id'], token: string) {
    return this.updateOne({ _id: ObjectId(userID) }, { $addToSet: { notifyTokens: token } });
};

userSchema.statics.removeNotifyTokens = function (tokens) {
    return this.updateMany(
        {
            notifyTokens: { $in: tokens },
        },
        {
            $pull: { notifyTokens: { $in: tokens } },
        }
    ).exec();
};

userSchema.statics.getNotifyTokens = function (userID: IUser['_id']) {
    return this.findOne({ _id: ObjectId(userID) })
        .select('notifyTokens')
        .lean();
};

userSchema.statics.checkExists = async function (userID: IUser['_id']) {
    return await this.exists({
        _id: mongoose.Types.ObjectId(userID),
    });
};

export const UserModel = mongoose.model<IUserDocument, IUserModel>('User', userSchema);
