import { is } from 'ramda';
import { NOTIFY_INTERVALS } from '@common/constants';

function getMinFromEpoch(date) {
    return date / 1000 / 60;
}

function getMinDiff(d1, d2) {
    return getMinFromEpoch(d1) - getMinFromEpoch(d2);
}

/**
 *
 * @param {String|Date} time in format: "HH:MM" or Date instance
 */
function timeToNumeric(time) {
    if (is(String, time)) {
        const [hours, mins] = time.split(':');
        return Number(hours) * 60 + Number(mins);
    }
    if (is(Date, time)) {
        const [hours, mins] = [time.getHours(), time.getMinutes()];
        return Number(hours) * 60 + Number(mins);
    }

    throw Error('Invalid type - only supported String|Date');
}

function isInRange(now, from, to) {
    now = timeToNumeric(now);
    from = from ? timeToNumeric(from) : 0;
    to = to ? timeToNumeric(to) : Number.MAX_SAFE_INTEGER;
    return now > from && now < to;
}

export default function shouldSend({ interval, from, to, daysOfWeek }, tmp = {}) {
    const now = new Date();
    const enabled = daysOfWeek.includes(now.getDay()) && isInRange(now, from, to);

    if (enabled && interval === NOTIFY_INTERVALS.JUST_ONCE) {
        // just once
        if (!tmp?.lastSatisfied) return true;
    } else if (enabled && interval === NOTIFY_INTERVALS.ALWAYS) return true;
    //always
    else if (enabled && (!tmp?.lastSendAt || getMinDiff(now, tmp.lastSendAt) > interval)) return true; //in interval

    return false;
}
