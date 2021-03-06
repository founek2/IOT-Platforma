import { DeviceClass } from "common/lib/models/interface/thing";
import { ReactComponent as ThermometrIcon } from "./sensorIcons/thermometr.svg";
import { ReactComponent as HumidityIcon } from "./sensorIcons/humidity.svg";
import { ReactComponent as VoltageIcon } from "./sensorIcons/voltage.svg";
import { ReactComponent as BarometrIcon } from "./sensorIcons/barometer.svg";

export const SensorIcons = {
	[DeviceClass.Humidity]: HumidityIcon,
	[DeviceClass.Temperature]: ThermometrIcon,
	[DeviceClass.Voltage]: VoltageIcon,
	[DeviceClass.Pressure]: BarometrIcon,
};
