const should = require("should");
import {checkValidFormData} from '../src/validations/index'
import * as forms from './resources/forms'
import fieldDescriptors from './resources/fieldDescriptors'

describe("Check valid formData", function () {
    it("should validate form - valid", function(done) {
        checkValidFormData(forms.registration_form_test10, fieldDescriptors).should.be.eql({valid: true, errors: []})
        done()
    })

    it("should validate form - missing field", function(done) {
        checkValidFormData(forms.registration_form_no_username, fieldDescriptors).should.be.eql({valid: false, errors: [{
           "REGISTRATION.info.userName": [
               "Toto pole je povinné"
           ] 
        }]})
        done()
    })

    it("should validate form - ignore required", function(done) {
        checkValidFormData(forms.registration_form_no_username, fieldDescriptors, true).should.be.eql({valid: true, errors: []})
        done()
    })

    it("should validate form - extra field", function(done) {
        checkValidFormData(forms.registration_form_extra_field, fieldDescriptors).should.be.eql({valid: false, errors: [{
           "REGISTRATION.hobby": [
               "missingDescriptor"
           ] 
        }]})
        done()
    })
})