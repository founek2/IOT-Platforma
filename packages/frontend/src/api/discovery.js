import { postJson, paramSender, deleteJson, patchJson, putJson } from "framework-ui/lib/api";

export const API_URL = "/api";

export const fetchDiscovery = (object, dispatch) =>
	paramSender({
		url: API_URL + "/discovery",
		...object,
		dispatch,
	});

export const deleteDiscovery = (object, dispatch) =>
	deleteJson({
		url: API_URL + "/discovery",
		...object,
		dispatch,
		successMessage: "deviceDeleted",
	});

export const addDiscoveredDevice = (object, dispatch) =>
	postJson({
		url: API_URL + "/discovery",
		...object,
		dispatch,
	});
