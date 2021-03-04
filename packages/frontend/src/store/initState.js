import fieldDescriptors from "common/lib/fieldDescriptors";

export const createState = () => ({
	application: {
		user: {},
		notifications: [],
		users: [],
		devices: { data: [] },
		discovery: { data: [] },
	},
	fieldDescriptors,
	tmpData: {
		dialog: {},
	},
	history: {},
});
