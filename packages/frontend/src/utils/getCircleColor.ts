import { red } from "@material-ui/core/colors";
import { DeviceStatus } from "common/lib/models/interface/device";
import isAfk from "./isAfk";

export enum CircleColors {
	Grey = "grey",
	Orange = "orange",
	Green = "green",
	Red = "red",
}

export function getCircleTooltipText(inTransition: boolean, status: DeviceStatus) {
	if (!status || status === DeviceStatus.disconnected || status === DeviceStatus.lost) return "Odpojeno";
	else if (inTransition) return "Čeká na potvrzení";
	else if (status === DeviceStatus.alert) return "Zařízení vyžaduje pozornost";
	else if (status === DeviceStatus.ready) return "Aktivní";

	return "Chybový stav";
}

export default function getCircleColor(inTransition: boolean, status: DeviceStatus): CircleColors {
	if (!status || status === DeviceStatus.disconnected || status === DeviceStatus.lost) return CircleColors.Grey;
	else if (status === DeviceStatus.alert) return CircleColors.Orange;
	else if (status === DeviceStatus.ready) return CircleColors.Green;

	return CircleColors.Red;
}
