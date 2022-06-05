import { validateForm } from 'framework-ui/src/validations';
import { checkValid } from 'framework-ui/src/validations';
import { State } from 'framework-ui/src/types';

export const checkValidFormData = (
    formData: { [formName: string]: any },
    fieldDescriptors: any,
    ingoreRequired?: boolean
) => {
    const state = {
        formsData: {
            ...formData,
        },
        fieldDescriptors,
    };
    const result = validateForm(Object.keys(formData)[0], state as State, ingoreRequired);
    return checkValid(result);
};
