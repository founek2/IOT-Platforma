import { infoLog, errorLog, warningLog } from '../logger'
import { checkValidFormData } from '../validations'
import { trimFields } from 'framework-ui/lib/validations';

// TODO probably array validations do not work properly
export default function formDataChecker(fieldDescriptors, { ingoreRequired, methods } = {}) {
    return (req, res, next) => {
        console.log("formData", req.body.formData)
        if (methods === undefined || methods.some(method => method === req.method)) {
            infoLog('Validating formData')
            const { formData } = req.body
            if (formData) {
                const trimedData = trimFields(formData);
                const { valid, errors } = checkValidFormData(trimedData, fieldDescriptors, ingoreRequired)

                if (valid) {
                    next()
                } else {
                    warningLog('Validation Failed> ' + JSON.stringify(errors))
                    res.status(208).send({ error: 'validationFailed' })
                }
            } else {
                warningLog('Missing formData')
                res.status(208).send({ error: 'missingFormData' })
            }
        } else next()
    }
}
