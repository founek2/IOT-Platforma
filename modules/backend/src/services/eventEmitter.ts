import { EventEmitter } from 'events';
import * as types from '../types';
import { TypedEmitter } from "common/src/emitter/typedEmitter";

class MyClass extends TypedEmitter<types.EmitterEvents> { }

export type BackendEmitter = TypedEmitter<types.EmitterEvents>;
export default new MyClass()