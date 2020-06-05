import { prop, o, path } from 'ramda';
import { getApplication, getTmpData } from 'framework-ui/src/utils/getters'
import { getHistory } from 'framework-ui/src/utils/getters'

export const getDevices = o(path(["devices", "data"]), getApplication)

export const getQueryID = o(path(["query", "id"]), getHistory)

export const getQueryName = o(path(["query", "name"]), getHistory)

export const getSensors = o(prop("sensors"), getTmpData)

export const getUserNames = o(prop("userNames"), getApplication)