import { infoLog, errorLog } from '../Logger'
import { checkValidFormData } from '../validations'
import { trimFields } from 'framework-ui/src/validations';

export default function formDataChecker(fieldDescriptors, {ingoreRequired} = {}) {
     return (req, res, next) => {
          infoLog('Validating formData')
          const { formData } = req.body
          if (formData) {
			const trimedData = trimFields(formData);
               const { valid, errors } = checkValidFormData(trimedData, fieldDescriptors, ingoreRequired)

               if (valid) {
                    next()
               } else {
                    errorLog('Validation Failed> ' + JSON.stringify(errors))
                    res.status(208).send({ error: 'validationFailed' })
               }
          } else {
               errorLog('Missing formData')
               res.status(208).send({ error: 'missingFormData' })
          }
     }
}
