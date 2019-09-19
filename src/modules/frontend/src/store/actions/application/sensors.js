import { ActionTypes } from '../../../constants/redux'
import { baseLogger } from 'framework-ui/src/Logger'
import { getFormData, getToken, getFormDescriptors } from 'framework-ui/src/utils/getters'
import {
     fetchDeviceData as fetchDeviceDataApi
} from '../../../api/device'
import {updateTmpData} from 'framework-ui/src/redux/actions/tmpData'

export function set(data) {
    return {
         type: ActionTypes.SET_SENSORS,
         payload: data
    }
}

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
                    dispatch(updateTmpData({sensors: {data: json.data, id}}))
                   }
              })
         }
}