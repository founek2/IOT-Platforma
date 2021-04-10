import { infoLog, errorLog, warningLog } from 'framework-ui/lib/logger';
import { checkValidFormData } from '../utils/validation';
import { trimFields } from 'framework-ui/lib/validations';
import { keys } from 'ramda';
import express from "express"

// TODO probably array validations do not work properly
type Options = { ingoreRequired?: boolean, allowedForms?: string[] } | undefined
type FormData = { [key: string]: any }

export default function formDataChecker(fieldDescriptors: any, { ingoreRequired, allowedForms }: Options = {}) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log('formData', req.body.formData);

        infoLog('Validating formData');
        const formData: FormData = req.body.formData;
        if (allowedForms && !Object.keys(formData).every((formName) => allowedForms.includes(formName)))
            res.status(400).send({ error: 'notAllowedFormName' });

        if (formData) {
            const trimedData = trimFields(formData);
            const { valid, errors } = checkValidFormData(trimedData, fieldDescriptors, ingoreRequired);

            if (valid) {
                next();
            } else {
                warningLog('Validation Failed> ' + JSON.stringify(errors));
                res.status(208).send({ error: 'validationFailed' });
            }
        } else {
            warningLog('Missing formData');
            res.status(208).send({ error: 'missingFormData' });
        }
    };
}
