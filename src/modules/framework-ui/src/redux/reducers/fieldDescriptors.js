import { actionTypes } from '../../constants/redux';

const setFieldDescriptors = {
     next(state, action) {
          return action.payload
     }
};

export const fieldDescriptorReducers = {
	[actionTypes.SET_FIELD_DESCRIPTORS]: setFieldDescriptors
}
