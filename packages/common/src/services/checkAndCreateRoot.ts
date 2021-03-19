import { infoLog, errorLog } from "framework-ui/lib/logger";
import { UserService } from "./userService";
import { UserModel } from "../models/userModel";
import { AuthTypes } from "../constants";

export default async () => {
	const doc = await UserModel.findByUserName("root");

	if (!doc) {
		var readline = require("readline");

		var rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		rl.stdoutMuted = true;

		errorLog("Uživatel Root neexistuje! Proto bude vytvořen, zadejte heslo:");
		const readPasswd = () => {
			rl.question("Password: ", function (password: string) {
				if (password.length < 6) {
					console.log("Heslo musí mít minimálně 6 znaků.");
					readPasswd();
				} else {
					rl.close();
					console.log("\n");
					UserService.create({
						info: { userName: "root", firstName: "root", lastName: "root" },
						auth: { password: password, type: AuthTypes.PASSWD },
						groups: ["root"],
					} as any).then(() => infoLog("Root byl vytvořen"));
				}
			});
		};
		readPasswd();

		rl._writeToOutput = function _writeToOutput(stringToWrite: string) {
			if (rl.stdoutMuted) rl.output.write("*");
			else rl.output.write(stringToWrite);
		};
	}
};
