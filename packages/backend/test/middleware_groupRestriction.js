const should = require("should");
import groupRestriction from '../src/middlewares/groupRestriction'



describe("Middleware group restriction", function () {
    it("should allow", function (done) {
        let val = 0;
        const counter = () => ++val
        const user = { groups: ["lala", "userik", "admin"] }
        groupRestriction("userik", { methods: ["GET"] })({ user, method: "GET" }, {}, counter)
        groupRestriction("userik")({ user }, {}, counter)

        val.should.equal(2)
        done()
    })

    it("should not allow", function (done) {
        let val = 0;
        const counter = ({error}) => { if (error === "notAllowed") ++val}
        const res = { status: () => ({ send: counter }) }
        const user = { groups: ["lala", "userik", "admin"] }
        groupRestriction("kekel", { methods: ["GET"] })({ user, method: "GET" }, res)
        groupRestriction("root")({ user }, res)

        val.should.equal(2)
        done()
    })
})