import { validateForm } from 'framework-ui/lib/validations';
import { checkValid } from 'framework-ui/lib/validations';

export const checkValidFormData = (formData: { [formName: string]: any }, fieldDescriptors: any, ingoreRequired?: boolean) => {
    const state = {
        formsData: {
            ...formData
        },
        fieldDescriptors
    };
    const result = validateForm(Object.keys(formData)[0], state, ingoreRequired);
    return checkValid(result);
};
