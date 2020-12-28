import { Emitter } from '../service/eventEmitter'
import * as types from '../types'
import user from './user'
import device from './device'

export default function (eventEmitter: Emitter<types.EmitterEvents>) {
    user(eventEmitter)
    device(eventEmitter)
}