import { prop, o, path, curry } from 'ramda';
import { getApplication, getTmpData } from 'framework-ui/lib/utils/getters'
import { getHistory } from 'framework-ui/lib/utils/getters'

export const getDevices = o(path(["devices", "data"]), getApplication)

export const getQueryID = o(path(["query", "id"]), getHistory)

export const getQuerySimple = o(path(["query", "simpleView"]), getHistory)

export const getQueryName = o(path(["query", "name"]), getHistory)

export const getQueryField = curry((name, state) => o(path(["query", name]), getHistory)(state))

export const getSensors = o(prop("sensors"), getTmpData)

export const getControl = o(prop("control"), getTmpData)

export const getUserNames = o(prop("userNames"), getApplication)