import mongoose, { Model } from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

type IMigrate = {
    applied: number[];

    createdAt: Date;
    updatedAt: Date;
};

export interface IMigrateDocument extends IMigrate, Document {}

export interface IMigrateModel extends Model<IMigrateDocument> {}

export const migrateSchema = new Schema<IMigrateDocument, IMigrateModel>(
    {
        applied: [Number],
    },
    { timestamps: true }
);

export const MigrateModel = mongoose.model<IMigrateDocument, IMigrateModel>('migration', migrateSchema);
