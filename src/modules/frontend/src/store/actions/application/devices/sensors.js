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
                    onSuccess: () => {
                         console.log("SUCESS notify sensors")
                         // const { sampleInterval, sensors } = transformSensorsForBE(formData);
                         // dispatch(update({ id, sensors, sampleInterval }))
                    }
               }, dispatch)
          }
     }
}

export function prefillNotifySensors(id) {
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