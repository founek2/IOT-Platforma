import { infoLog, errorLog, warningLog } from 'framework-ui/lib/logger';
import { checkValidFormData } from 'common/lib/utils/validation';
import { trimData } from 'framework-ui/lib/utils/trimData';
import express from 'express';

type Options = { ingoreRequired?: boolean; allowedForms?: string[] } | undefined;
type FormData = { [key: string]: any };

/**
 * Middleware to check if formData in body are valid
 * @param {Options} options - allowedForms restrict forms only to those specified, ingoreRequired can disable checking require for fields
 */
export default function formDataChecker(fieldDescriptors: any, { ingoreRequired, allowedForms }: Options = {}) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log('formData', req.body.formData);

        infoLog('Validating formData');
        const formData: FormData = req.body.formData;
        console.log('dad', Object.keys(formData), allowedForms);
        if (allowedForms && !Object.keys(formData).every((formName) => allowedForms.includes(formName)))
            return res.status(400).send({ error: 'notAllowedFormName' });

        if (formData) {
            const trimedData = trimData(formData);
            const { valid, errors } = checkValidFormData(trimedData, fieldDescriptors, ingoreRequired);

            if (valid) {
                next();
            } else {
                warningLog('Validation Failed> ' + JSON.stringify(errors));
                res.status(400).send({ error: 'validationFailed' });
            }
        } else {
            warningLog('Missing formData');
            res.status(400).send({ error: 'missingFormData' });
        }
    };
}
