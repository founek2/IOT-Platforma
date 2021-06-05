import { ActionTypes } from '../../constants/redux';

const setFieldDescriptors = {
    next(state, action) {
        return action.payload;
    },
};

export const fieldDescriptorReducers = {
    [ActionTypes.SET_FIELD_DESCRIPTORS]: setFieldDescriptors,
};
