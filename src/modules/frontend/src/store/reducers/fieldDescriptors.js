import { handleActions } from 'redux-actions';
import {fieldDescriptorReducers} from 'framework-ui/src/redux/reducers/fieldDescriptors';

export default handleActions(fieldDescriptorReducers, {})