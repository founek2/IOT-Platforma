import { baseLogger } from 'framework-ui/src/Logger'
import { getFormData, getToken } from 'framework-ui/src/utils/getters'
import {
    fetchDeviceData as fetchDeviceDataApi,
    updateNotify as updateNotifyApi,
    getNotify as getNotifyApi,
} from '../../../../api/deviceApi'
import { updateTmpData } from 'framework-ui/src/redux/actions/tmpData'
import { validateRegisteredFields, fillForm } from 'framework-ui/src/redux/actions/formsData'
import { transformNotifyForFE } from '../../../../utils/transform'

export function fetchData(id, JSONkey) {
    return (dispatch, getState) =>
        (from, to) => {
            baseLogger("FETCH CONTROL DATA")
            const params = {
                from: from.getTime(),
                to: to ? to.getTime() : undefined,
                type: "control",
                JSONkey,
            }

            if (!params.to) delete params.to
            return fetchDeviceDataApi({
                token: getToken(getState()),
                id,
                params,
                onSuccess: json => {
                    dispatch(updateTmpData({ control: { data: json.data, id } }))
                }
            }, dispatch)
        }
}

export function prefillNotify(id, JSONkey) {
    return async function (dispatch, getState) {
        return getNotifyApi({
            token: getToken(getState()),
            params: {
                type: "control",
                JSONkey
            },
            id,
            onSuccess: (json) => {
                const formData = transformNotifyForFE(json.doc.items);
                formData.key = JSONkey
                dispatch(fillForm("EDIT_NOTIFY_CONTROL")(formData))
            }
        }, dispatch)
    }
}

export function updateNotify(id) {
    return async function (dispatch, getState) {
        const EDIT_NOTIFY_CONTROL = 'EDIT_NOTIFY_CONTROL'
        baseLogger(EDIT_NOTIFY_CONTROL)
        const result = dispatch(validateRegisteredFields(EDIT_NOTIFY_CONTROL)())
        const formData = getFormData(EDIT_NOTIFY_CONTROL)(getState())
        if (result.valid) {
            return updateNotifyApi({
                token: getToken(getState()),
                body: { formData: { [EDIT_NOTIFY_CONTROL]: formData } },
                id,
                onSuccess: () => {
                    console.log("SUCESS notify sensors")
                    // const { sampleInterval, sensors } = transformSensorsForBE(formData);
                    // dispatch(update({ id, sensors, sampleInterval }))
                }
            }, dispatch)
        }
    }
}
