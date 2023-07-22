import { logger } from '../logger';
import { checkValidFormData } from '../utils/validation';
import { trimData } from 'framework-ui/src/utils/trimData';
import express from 'express';

type Options = { ingoreRequired?: boolean; allowedForms?: string[] } | undefined;
type FormData = { [key: string]: any };

/**
 * Middleware to check if formData in body are valid
 * @param {Options} options - allowedForms restrict forms only to those specified, ingoreRequired can disable checking require for fields
 */
export default function formDataChecker(fieldDescriptors: any, { ingoreRequired, allowedForms }: Options = {}) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        logger.debug('formData', req.body.formData);

        logger.debug('Validating formData');
        const formData: FormData = req.body.formData;
        // console.log('dad', Object.keys(formData), allowedForms);
        if (allowedForms && !Object.keys(formData).every((formName) => allowedForms.includes(formName)))
            return res.status(400).send({ error: 'notAllowedFormName' });

        if (formData) {
            const trimedData = trimData(formData);
            const { valid, errors } = checkValidFormData(trimedData, fieldDescriptors, ingoreRequired);

            if (valid) {
                next();
            } else {
                logger.debug('Validation Failed> ' + JSON.stringify(errors));
                res.status(400).send({ error: 'validationFailed', message: errors });
            }
        } else {
            // logger.debug('Missing formData');
            res.status(400).send({ error: 'missingFormData' });
        }
    };
}
