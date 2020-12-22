import {AFK_INTERVAL} from '../constants'

export default function isAfk(ackTime) {
    return !ackTime || new Date() - new Date(ackTime) > AFK_INTERVAL
}