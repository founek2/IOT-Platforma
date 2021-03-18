import Agenda from "agenda";
import config from "common/lib/config";
import createMongoUri from "common/lib/utils/createMongoUri";
import logger from "framework-ui/lib/logger";

const agendaConfig = config.agenda;

const connectionOpts = {
	db: {
		address: createMongoUri(agendaConfig),
		collection: "agendaJobs",
		options: {
			useUnifiedTopology: true,
		},
	},
};

const agenda = new Agenda(connectionOpts);

const jobTypes = agendaConfig.jobs ? agendaConfig.jobs.split(",") : [];
logger.debug("loading jobs:", jobTypes);

jobTypes.forEach(async (type: string) => {
	const job = require("./jobs/" + type) as { default: (agenda: Agenda) => void };
	job.default(agenda);
});

agenda.processEvery("20 seconds");

agenda.on("start", (job) => {
	logger.debug("Job", job.attrs.name, "starting");
});

if (jobTypes.length) {
	(async () => {
		await agenda.start();
	})();
}

export default agenda;
