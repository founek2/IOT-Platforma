import io from 'socket.io-client'
import { devLog } from 'framework-ui/src/Logger'
import { T } from "ramda"

class MySocket {
    constructor() {
        this._on = [];
        this.socket = { on: T, off: T, close: T }
    }

    init = (token) => {
        const newCon = io({
            query: {
                token
            },
        })
        newCon.open()
        mySocket.applyListeners(newCon)
        // newCon.on("connect", function() {
        //     console.log("connected")

        //     newCon.on("disconnect", function() {
        //         console.log("DC")
        //     })
        // })
        this.socket = newCon;
    }

    on = (action, fn) => {
        this.socket.on(action, fn)
        this._on.push([action, fn])
    }

    off = (action, fn) => {
        this.socket.off(action, fn)
        this._on.filter(([a, f]) => action !== a && f !== fn)
    }
    applyListeners = (socket) => {
        this._on.forEach(([action, fn]) => {
            socket.on(action, fn)
        })
    }

    close = () => {
        // if (this.socket.connected)
        this.socket.close()
    }

    emit = (...other) =>
        this.socket.emit(...other)

}

const mySocket = new MySocket();

function init(token = "") {
    devLog("connecting to socket")
    mySocket.close();
    mySocket.init(token)

}

function getSocket() {
    return mySocket
}

export default {
    init,
    getSocket
}