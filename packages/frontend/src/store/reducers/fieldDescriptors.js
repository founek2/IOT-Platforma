import { handleActions } from 'redux-actions';
import { fieldDescriptorReducers } from 'framework-ui/lib/redux/reducers/fieldDescriptors';

export default handleActions(fieldDescriptorReducers, {})