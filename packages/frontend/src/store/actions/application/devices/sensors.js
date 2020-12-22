import { baseLogger } from 'framework-ui/lib/Logger'
import { getFormData, getToken } from 'framework-ui/lib/utils/getters'
import {
    fetchDeviceData as fetchDeviceDataApi,
    updateNotify as updateNotifyApi,
    getNotify as getNotifyApi,
} from '../../../../api/deviceApi'
import { updateTmpData } from 'framework-ui/lib/redux/actions/tmpData'
import { validateRegisteredFields, fillForm } from 'framework-ui/lib/redux/actions/formsData'
import { transformNotifyForFE } from 'common/lib/utils/transform'

export function fetchData(id) {
    return (dispatch, getState) =>
        (from, to) => {
            baseLogger("FETCH SENSOR DATA")
            const params = {
                from: from.getTime(),
                to: to ? to.getTime() : undefined,
                type: "sensors"
            }

            if (!params.to) delete params.to
            return fetchDeviceDataApi({
                token: getToken(getState()),
                id,
                params,
                onSuccess: json => {
                    dispatch(updateTmpData({ sensors: { data: json.data, id } }))
                }
            }, dispatch)
        }
}

export function updateNotifySensors(id) {
    return async function (dispatch, getState) {
        const EDIT_NOTIFY_SENSORS = 'EDIT_NOTIFY_SENSORS'
        baseLogger(EDIT_NOTIFY_SENSORS)
        const result = dispatch(validateRegisteredFields(EDIT_NOTIFY_SENSORS)())
        const formData = getFormData(EDIT_NOTIFY_SENSORS)(getState())
        if (result.valid) {
            return updateNotifyApi({
                token: getToken(getState()),
                body: { formData: { [EDIT_NOTIFY_SENSORS]: formData } },
                id,
            }, dispatch)
        }
    }
}

export function prefillNotify(id) {
    return async function (dispatch, getState) {
        return getNotifyApi({
            token: getToken(getState()),
            params: {
                type: "sensors"
            },
            id,
            onSuccess: (json) => {
                const formData = transformNotifyForFE(json.doc.items);
                dispatch(fillForm("EDIT_NOTIFY_SENSORS")(formData))
            }
        }, dispatch)
    }
}