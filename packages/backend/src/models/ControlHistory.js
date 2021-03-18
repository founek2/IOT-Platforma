import resetTime from "framework/lib/utils/resetTime";
import mongoose from "mongoose";
import { isDay as isDayFn } from "../utils";
const Schema = mongoose.Schema;

const HistoricalSchema = new Schema({
	device: { type: "ObjectId", ref: "Device" },
	JSONkey: String,
	day: Date,
	first: Date,
	last: Date,
	samples: Object, // {temp: [{val: Object, time: Date}]}
	timestamps: Array,
	nsamples: {
		day: { type: Number, default: 0 },
		night: { type: Number, default: 0 },
	},
});

HistoricalSchema.index({ device: 1, day: -1 });

HistoricalSchema.statics.saveData = function (deviceID, JSONkey, query, updateTime) {
	const nsamples = isDayFn(updateTime) ? "nsamples.day" : "nsamples.night";
	return this.model("ControlHistory")
		.updateOne(
			{
				device: mongoose.Types.ObjectId(deviceID),
				JSONkey,
				"nsamples.day": { $lt: 200 },
				"nsamples.night": { $lt: 200 },
				day: resetTime(new Date()),
			},
			{
				$push: query.update,
				$min: { first: updateTime },
				$max: { last: updateTime },
				$inc: { [nsamples]: 1 },
			},
			{ upsert: true, setDefaultsOnInsert: true }
		)
		.exec(); // setDefaultsOnInsert is required to properly work with $lt and upsert
};

HistoricalSchema.statics.getData = function (deviceID, JSONkey, from, to) {
	return this.model("ControlHistory")
		.find({
			device: mongoose.Types.ObjectId(deviceID),
			JSONkey,
			day: {
				$gte: from,
				$lte: to,
			},
		})
		.sort({ first: 1 })
		.lean()
		.then((docs) => {
			return docs;
		});
};

export default mongoose.model("ControlHistory", HistoricalSchema);
