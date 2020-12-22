import isAfk from './isAfk'

export default function getCircleColor(inTransition, ackTime) {
    if (isAfk(ackTime)) // afk for more then 10min
        return "red"
    else if (inTransition)
        return "orange"
    return "green"
}