import { validateForm } from 'framework-ui/src/validations';
import { checkValid } from 'framework-ui/src/validations';

export const checkValidFormsData = (formsData, ignoreRequiredFields, fieldDescriptors) => {
     const state = {
          formsData,
          fieldDescriptors
     };
	const formsValidation = {};
	let globalValid = true;
     for (const name in formsData) {
		const res = checkValid(validateForm(name, state, ignoreRequiredFields)[name]);
		formsValidation[name] = res;
		if(res.valid === false) globalValid = false;
	}
	formsValidation.globalValid = globalValid;
     return formsValidation;
};
export const checkValidFormData = (formData, fieldDescriptors, ingoreRequired) => {
	const name = "try";
     const state = {
          formsData: {
			[name]: formData,
		},
          fieldDescriptors,
     };
	const result = validateForm(name, state, ingoreRequired);
	return checkValid(result);
};
