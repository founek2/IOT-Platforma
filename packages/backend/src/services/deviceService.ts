import mongoose from 'mongoose';
import { IDevice } from 'common/lib/models/interface/device.js';
import { DeviceModel } from 'common/lib/models/deviceModel.js';
import { HistoricalModel } from 'common/lib/models/historyModel.js';
import { NotifyModel } from 'common/lib/models/notifyModel.js';

/**
 * Service for managing device
 */
export class DeviceService {
    /**
     * Delete provided device
     * @param {IDevice['_id']} deviceId
     */
    public static async deleteById(deviceId: IDevice['_id']): Promise<boolean> {
        const res = await DeviceModel.deleteOne({
            _id: mongoose.Types.ObjectId(deviceId),
        });

        if (res.deletedCount !== 1) return false;

        await HistoricalModel.deleteMany({
            device: mongoose.Types.ObjectId(deviceId),
        });
        await NotifyModel.deleteMany({
            deviceId: mongoose.Types.ObjectId(deviceId),
        });

        return true;
    }
}
