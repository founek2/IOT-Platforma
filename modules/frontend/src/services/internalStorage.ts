import { EventEmitter } from 'events';

type EventMap = Record<string, any>;

type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => void;

export interface Emitter<T extends EventMap> {
    on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
    off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
    emit<K extends EventKey<T>>(eventName: K, params: T[K]): void;
}

class MyEmitter<T extends EventMap> implements Emitter<T> {
    private emitter = new EventEmitter();
    on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>) {
        this.emitter.on(eventName, fn);
    }

    off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>) {
        this.emitter.off(eventName, fn);
    }

    emit<K extends EventKey<T>>(eventName: K, params: T[K]) {
        this.emitter.emit(eventName, params);
    }
}

type AccessTokenData = {
    token: string
    expiresAt: Number
};
export interface EmitterEvents {
    new_access_token: AccessTokenData;
}

class InternalStorage extends MyEmitter<EmitterEvents> {
    constructor() {
        super()

        this.on("new_access_token", (data) => {
            localStorage.setItem("accessToken", JSON.stringify(data))
        })
    }

    getAccessToken(): AccessTokenData | undefined {
        const data = localStorage.getItem("accessToken")
        return data ? JSON.parse(data) : data
    }

    delete() {
        localStorage.removeItem("accessToken")
    }
}

const internalStorage = new InternalStorage();
export default internalStorage;