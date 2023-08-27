import { PropertyClass } from 'common/src/models/interface/thing.js';
import ThermometrIcon from './sensorIcons/thermometr.svg';
import HumidityIcon from './sensorIcons/humidity.svg';
import VoltageIcon from './sensorIcons/voltage.svg';
import BarometrIcon from './sensorIcons/barometer.svg';

export const SensorIcons = {
    [PropertyClass.humidity]: HumidityIcon,
    [PropertyClass.temperature]: ThermometrIcon,
    [PropertyClass.voltage]: VoltageIcon,
    [PropertyClass.pressure]: BarometrIcon,
};
