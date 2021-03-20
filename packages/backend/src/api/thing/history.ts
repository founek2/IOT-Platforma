import { HistoricalModel } from "common/lib/models/historyModel";
import express from "express";
import resource from "../middlewares/resource-router-middleware";
import tokenAuthMIddleware from "../middlewares/tokenAuth";

export default ({ config, db }: any) =>
	resource({
		mergeParams: true,
		middlewares: {
			read: [tokenAuthMIddleware()],
		},
		/** GET /:param - List all entities */
		async index({ params, query: { from, to }, user }: any, res: express.Response) {
			const { deviceId, thingId } = params;
			console.log("par", params);
			const docs = await HistoricalModel.getData(
				deviceId,
				thingId,
				new Date(Number(from)),
				new Date(to ? Number(to) : new Date())
			);
			res.send({ docs });
		},
	});
