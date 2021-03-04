import mongoose from "mongoose";
import { infoLog, errorLog } from "../logger";

export default () => {
	const UserModel = mongoose.model("User");
	UserModel.findByUserName("root")
		.exec()
		.then((doc) => {
			if (!doc) {
				var readline = require("readline");

				var rl = readline.createInterface({
					input: process.stdin,
					output: process.stdout,
				});

				rl.stdoutMuted = true;

				errorLog("Uživatel Root neexistuje! Proto bude vytvořen, zadejte heslo:");
				function readPasswd() {
					rl.question("Password: ", function (password) {
						if (password.length < 6) {
							console.log("Heslo musí mít minimálně 6 znaků.");
							readPasswd();
						} else {
							rl.close();
							console.log("\n");
							UserModel.create({
								info: { userName: "root", firstName: "root", lastName: "root" },
								auth: { password: password },
								groups: ["root"],
							}).then(() => infoLog("Root byl vytvořen"));
						}
					});
				}
				readPasswd();

				rl._writeToOutput = function _writeToOutput(stringToWrite) {
					if (rl.stdoutMuted) rl.output.write("*");
					else rl.output.write(stringToWrite);
				};
			}
		});
};
