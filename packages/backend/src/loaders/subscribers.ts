import eventEmitter from "../services/eventEmitter";
import init from "../subscribers";

export default async () => {
	init(eventEmitter);
};
