import {prop, o, path} from 'ramda';
import {getApplication} from 'framework-ui/src/utils/getters'
import {getHistory} from 'framework-ui/src/utils/getters'

export const getDevices = o(path(["devices", "data"]),getApplication)

export const getQueryID = o(path(["query", "id"]),getHistory)