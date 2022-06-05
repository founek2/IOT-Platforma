import mongoose from 'mongoose';
import { IDevice } from 'common/src/models/interface/device';
import { DeviceModel } from 'common/src/models/deviceModel';
import { HistoricalModel } from 'common/src/models/historyModel';
import { NotifyModel } from 'common/src/models/notifyModel';

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
