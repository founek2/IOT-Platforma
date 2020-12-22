class CallbackFactory {
    constructor() {
        this.callbacks = []
    }

    register = (fn) => {
        this.callbacks.push(fn)
    }

    exec = (...params) => {
        this.callbacks.forEach(fn => {
            console.log("executing")
            fn(...params)
        })
    }
}

export default CallbackFactory