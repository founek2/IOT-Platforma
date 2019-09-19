const should = require("should");
import tokenAuth from '../src/middlewares/tokenAuth'

describe("Middleware token Auth", function() {
    it("should not enter", async function() {
        let val = 0;
        const counter = ({error}) => {
            if (error === "invalidToken") ++val
        }
        const res = { status: () => ({ send: counter }) }

        await tokenAuth()({get: () => 'invalidToken'}, res)
        await tokenAuth({methods: ["POST"]})({get: () => 'jlskjdasd', method: "POST"}, res)
        val.should.equal(2)
    })

    it("should allow", async function() {
        let val = 0;
        const counter = () => {
             ++val
        }
        await tokenAuth({ restricted: false})({get: () => undefined}, null, counter)
        val.should.equal(1)
    })
})