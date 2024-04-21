import { logger } from '../logger';
import { checkValidFormData } from '../utils/validation';
import { trimData } from '../utils/trimData';
import { Next } from 'koa';
import { KoaContext } from '../types';

type Options = { ingoreRequired?: boolean; allowedForms?: string[] };
type FormData = { [key: string]: any };

/**
 * Middleware to check if formData in body are valid
 * @param {Options} options - allowedForms restrict forms only to those specified, ingoreRequired can disable checking require for fields
 */
export function formDataMiddleware<C extends KoaContext>(fieldDescriptors: any, options: Options = {}) {
    const { ingoreRequired, allowedForms } = options;
    return (ctx: C & { body: string }, next: Next) => {
        logger.debug('Validating formData');
        const formData = ctx.request.body?.formData;

        logger.silly('formData', formData);

        if (!formData) {
            ctx.status = 400;
            ctx.body = { error: 'missingFormData' };
            return;
        }

        // console.log('dad', Object.keys(formData), allowedForms);
        if (allowedForms && !Object.keys(formData).every((formName) => allowedForms.includes(formName))) {
            ctx.status = 400;
            ctx.body = { error: 'notAllowedFormName' };
            return;
        }

        if (formData) {
            const trimedData = trimData(formData);
            const { valid, errors } = checkValidFormData(trimedData, fieldDescriptors, ingoreRequired);

            if (valid) {
                return next();
            } else {
                logger.debug('Validation Failed> ' + JSON.stringify(errors));
                ctx.status = 400;
                ctx.body = { error: 'validationFailed' };
            }
        }
    };
}
