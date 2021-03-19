import { NOTIFY_TYPES, NOTIFY_TYPES_CONTROL } from "common/lib/constants";
import shouldSend from "../../utils/shouldSend";
import { NotifyType } from "common/lib/models/interface/notifyInterface";

function below(value, limit, advanced, tmp) {
	const ruleSatisfied = value < limit;
	return {
		ruleSatisfied,
		valid: ruleSatisfied && shouldSend(advanced, tmp),
	};
}

function over(value, limit, advanced, tmp) {
	const ruleSatisfied = value > limit;
	return {
		ruleSatisfied,
		valid: ruleSatisfied && shouldSend(advanced, tmp),
	};
}

function always(value, limit, advanced, tmp) {
	return {
		ruleSatisfied: true,
		valid: true && shouldSend(advanced, tmp),
	};
}

// function on(value, limit, advanced, tmp) {
// 	const ruleSatisfied = value === 1;
// 	return {
// 		ruleSatisfied,
// 		valid: ruleSatisfied && shouldSend(advanced, tmp),
// 	};
// }

// function off(value, limit, advanced, tmp) {
// 	const ruleSatisfied = value === 0;
// 	return {
// 		ruleSatisfied,
// 		valid: ruleSatisfied && shouldSend(advanced, tmp),
// 	};
// }

export default {
	[NotifyType.below]: below,
	[NotifyType.over]: over,
	[NotifyType.always]: always,
};
