import { red } from "@material-ui/core/colors";
import type { DeviceStatus } from "common/lib/models/interface/device";
import isAfk from "./isAfk";

export enum CircleColors {
	Grey = "grey",
	Orange = "orange",
	Green = "green",
	Red = "red",
}

export function getCircleTooltipText(inTransition: boolean, status: DeviceStatus) {
	if (!status || status === "disconnected" || status === "lost") return "Odpojeno";
	else if (inTransition) return "Čeká na potvrzení";
	else if (status === "ready") return "Aktivní";

	return "Chybový stav";
}

export default function getCircleColor(inTransition: boolean, status: DeviceStatus): CircleColors {
	if (!status || status === "disconnected" || status === "lost") return CircleColors.Grey;
	else if (inTransition) return CircleColors.Orange;
	else if (status === "ready") return CircleColors.Green;

	return CircleColors.Red;
}
