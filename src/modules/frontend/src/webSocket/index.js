import io from 'socket.io-client'

let socket;

function init(token) {
    if (socket) socket.close()
    socket = io(
        {
            query: {
                token
            },
            forceNew: true
        })
    socket.open()
}

function getSocket() {
    return socket
}

export default {
    init,
    getSocket
}