function getMinFromEpoch(date) {
    return date / 1000 / 60
}

function getMinDiff(d1, d2) {
    return getMinFromEpoch(d1) - getMinFromEpoch(d2)
}

export default function shouldSend(interval, tmp) {
    if (interval === -1) {
        if (!tmp || !tmp.lastSatisfied)
            return true
    }
    else if (getMinDiff(new Date(), tmp.lastSendAt) > interval)
        return true

    return false
}