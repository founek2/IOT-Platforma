import should from "should"
import * as validations from '../src/validations'
import { stateValid, stateInvalidPassword, stateEmptyUserName } from './resources/state.js'
import validationFactory from '../src/validations/validationFactory'
import * as validationFn from '../src/validations/validationFn'

describe("Validations test", function () {
    it("should create new fieldState - invalid", function (done) {
        validations.createFieldState(["required", "notString"]).should.be.eql(
            { valid: false, errorMessages: ["required", "notString"] }
        )
        done()
    })

    it("should create new fieldState - valid", function (done) {
        validations.createFieldState([]).should.be.eql(
            { valid: true, errorMessages: [] }
        )
        done()
    })

    it("should check fieldState - valid", function (done) {
        validations.checkValid({
            REGISTRATION: {
                info: {
                    userName: { valid: true, errorMessages: [] },
                },
                auth: {
                    type: { valid: true, errorMessages: [] }
                }
            }
        })
            .should.be.eql({
                valid: true, errors: []
            })
        done()
    })

    it("should check fieldState - invalid", function (done) {
        validations.checkValid({
            REGISTRATION: {
                info: {
                    userName: { valid: true, errorMessages: [] },
                    userName: { valid: false, errorMessages: ["required"] },
                }
            }
        })
            .should.be.eql({
                valid: false, errors: [{
                    "REGISTRATION.info.userName": ["required"]
                }]
            })
        done()
    })

    it("should validate field - valid", function (done) {
        validations.validateField("REGISTRATION.info.userName", stateEmptyUserName, true, true)
            .should.be.eql({ valid: true, errorMessages: [] })
        done()
    })

    it("should validate field - invalid", function (done) {
        validations.validateField("REGISTRATION.info.userName", stateEmptyUserName)
            .should.be.eql({ valid: false, errorMessages: ["Toto pole je povinné"] })
        done()
    })

    it("should validate form - valid", function (done) {
        validations.checkValid(
            validations.validateForm("REGISTRATION", stateValid)
        )
            .should.be.eql({ valid: true, errors: [] })
        done()
    })

    it("should validate form - invalid", function (done) {
        validations.checkValid(
            validations.validateForm("REGISTRATION", stateInvalidPassword)
        )
            .should.be.eql({
                valid: false, errors: [{
                    "REGISTRATION.auth.password": ["Text nesmí být kratší než 4"]
                }]
            })
        done()
    })
})

describe("Validation factory", function () {
    it("should validate String", function (done) {
        const fn = validationFn.isString
        fn([]).should.equal("notString")
        fn(3).should.equal("notString")
        fn({}).should.equal("notString")
        
        validationFn.isString("ble", { min: 3, max: 10 }).should.be.true()
        validationFn.isString("1234567891",{ min: 3, max: 10 }).should.be.true()
        validationFn.isString("b",{ min: 3, max: 10 }).should.equal("lowerLength")
        validationFn.isString("blablablablabla",{ min: 3, max: 10 }).should.equal("higherLength")
        validationFn.isString("b",  { startsWith: "/" }).should.equal("notStartsWith")
        done()
    })

    it("should validate Number", function (done) {
        const fn = validationFn.isNumber
        fn([]).should.equal("notNumber")
        fn(3).should.be.true()
        fn(3.3232).should.be.true()
        fn("3.3232").should.be.true()
        fn("3").should.be.true()
        fn({}).should.equal("notNumber")
        fn("").should.equal("notNumber")

        validationFn.isNumber(10, { min: 3, max: 10 }).should.be.true()
        validationFn.isNumber(3, { min: 3, max: 10 }).should.be.true()
        validationFn.isNumber(1, { min: 3, max: 10 }).should.equal("lowerValue")
        validationFn.isNumber(11, { min: 3, max: 10 }).should.equal("higherValue")
        done()
    })

    it("should validate Bool", function (done) {
        const fn = validationFn.isBool
        fn(false).should.be.true()
        fn(true).should.be.true()
        fn("false").should.be.true()
        fn("true").should.be.true()

        validationFn.isBool(6).should.equal("notBool")
        validationFn.isBool([]).should.equal("notBool")
        validationFn.isBool({}).should.equal("notBool")
        validationFn.isBool("").should.equal("notBool")
        validationFn.isBool("dsad").should.equal("notBool")
        done()
    })

    it("should validate noNumbers", function (done) {
        const fn = validationFn.noNumbers
        fn(false).should.be.true()
        fn(true).should.be.true()
        fn([]).should.be.true()
        fn({}).should.be.true()

        validationFn.noNumbers(6).should.equal("cannotContainNumbers")
        validationFn.noNumbers("adsad3dasd").should.equal("cannotContainNumbers")
        done()
    })

    it("should validate phone number", function (done) {
        const fn = validationFn.isPhoneNumber
        fn("732426100").should.be.true()
        fn("+420 732426100").should.be.true()
        fn("+420 732 426100").should.be.true()
        fn("+420 732426 100").should.be.true()
        fn("+420 732 426 100").should.be.true()
        fn("+420732426 100").should.be.true()
        fn("+420732 426 100").should.be.true()
        fn("+420732426 100").should.be.true()

        validationFn.isPhoneNumber(6).should.equal("isNotPhoneNumber")
        validationFn.isPhoneNumber([]).should.equal("isNotPhoneNumber")
        validationFn.isPhoneNumber({}).should.equal("isNotPhoneNumber")
        validationFn.isPhoneNumber("382 322 31").should.equal("isNotPhoneNumber")
        validationFn.isPhoneNumber("+42382 322 31").should.equal("isNotPhoneNumber")
        done()
    })

    it("should validate email", function (done) {
        const fn = validationFn.isEmail
        fn("skalic@seznam.cz").should.be.true()
        fn("s@s.cz").should.be.true()
        fn("s233!2@gmail.com").should.be.true()

        fn("s@s.c").should.equal("isNotEmail")
        fn("ssdads.com").should.equal("isNotEmail")
        fn("ssda@dscom").should.equal("isNotEmail")
        fn("ss3da@ds!.com").should.equal("isNotEmail")
        done()
    })

    it("should check validationFactory", function (done) {
        validationFactory("isString")("kekel").should.be.true()

        try {
             validationFactory("noNumbessadas")("kekel")
        }catch(err) {
            if (err instanceof Error && err.message === "Missing validation Fn named: noNumbessadas") done()
        }
    })

    // TODO validate isFile - implementation may change
})