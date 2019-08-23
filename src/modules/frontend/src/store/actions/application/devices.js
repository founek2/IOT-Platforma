import { ActionTypes } from '../../../constants/redux'
import { getFormData, getToken, getFormDescriptors } from 'framework-ui/src/utils/getters'
import { validateForm, resetForm, updateFormField } from 'framework-ui/src/redux/actions/formsData'
import { updateTmpData } from 'framework-ui/src/redux/actions/tmpData'
import { baseLogger } from 'framework-ui/src/Logger'
import loadFilesInFormData from 'framework-ui/src/utils/loadFilesInFormData'
import { dehydrateState } from 'framework-ui/src/redux/actions'
import { keys, head } from 'ramda'
import {
     createDevice as createDeviceApi,
     fetchDevices as fetchDevicesApi,
     updateDevice as updateDeviceApi,
     putDevice as putDeviceApi
} from '../../../api/device'
import { getDevices } from '../../../utils/getters'
import objectDiff from 'framework-ui/src/utils/objectDiff'
import { transformSensorsForBE } from '../../../utils/transform'

export function createDevice() {
     return async function (dispatch, getState) {
          const CREATE_SENSOR = 'CREATE_DEVICE'
          baseLogger(CREATE_SENSOR)
          const result = dispatch(validateForm(CREATE_SENSOR)())
          if (result.valid) {
               const state = getState()
               const formData = getFormData(CREATE_SENSOR)(state)
               const fieldDescriptors = getFormDescriptors(CREATE_SENSOR, state)
               const newFormDataWithFiles = await loadFilesInFormData(formData, keys(fieldDescriptors)) //
               return createDeviceApi(
                    {
                         body: { formData: { [CREATE_SENSOR]: newFormDataWithFiles } },
                         token: getToken(state),
                         onSuccess: json => {
                              dispatch(resetForm(CREATE_SENSOR)())
                              dispatch(updateTmpData({ dialog: { apiKey: json.apiKey } }))
                              dispatch(add(json.doc))
                              dispatch(dehydrateState())
                         }
                    },
                    dispatch
               )
          }
     }
}

export function updateDevice(id) {
     return async function (dispatch, getState) {
          const EDIT_DEVICE = 'EDIT_DEVICE'
          baseLogger(EDIT_DEVICE)
          const result = dispatch(validateForm(EDIT_DEVICE)())
          if (result.valid) {
               const state = getState()
               const formData = getFormData(EDIT_DEVICE)(state)
               const fieldDescriptors = getFormDescriptors(EDIT_DEVICE, state)
               const newFormDataWithFiles = await loadFilesInFormData(formData, keys(fieldDescriptors))

               const devices = getDevices(state)
               const device = devices.find(dev => dev.id === id)

               const diffObj = objectDiff(newFormDataWithFiles, device)
               const diff = { id: device.id }
               for (const field in diffObj) {
                    const val = head(diffObj[field])
                    if (val)
                         diff[field] = val
               }

               return updateDeviceApi(
                    {
                         body: { formData: { [EDIT_DEVICE]: diff } },
                         token: getToken(state),
                         onSuccess: () => {
                              dispatch(update(diff))
                              dispatch(dehydrateState())
                         }
                    },
                    dispatch
               )
          }
     }
}

export function update(device) {
     return {
          type: ActionTypes.UPDATE_DEVICE,
          payload: device
     }
}

export function add(data) {
     return {
          type: ActionTypes.ADD_DEVICE,
          payload: data
     }
}

export function fetch() {
     return function (dispatch, getState) {
          return fetchDevicesApi(
               {
                    token: getToken(getState()),
                    onSuccess: json => {
                         dispatch(set(json.docs))
                         dispatch(dehydrateState())
                    }
               },
               dispatch
          )
     }
}

export function set(data) {
     return {
          type: ActionTypes.SET_DEVICES,
          payload: data
     }
}

export function updateSensors(id) {
     return async function (dispatch, getState) {
          const EDIT_SENSORS = 'EDIT_SENSORS'
          baseLogger(EDIT_SENSORS)
          const result = dispatch(validateForm(EDIT_SENSORS)())
          const formData = getFormData(EDIT_SENSORS)(getState())

          if (result.valid) {
               return putDeviceApi({
                    token: getToken(getState()),
                    body: { formData: { [EDIT_SENSORS]: formData } },
                    id,
                    onSuccess: () => {
                         const { sampleInterval, sensors } = transformSensorsForBE(formData);
                         dispatch(update({ id, sensors, sampleInterval }))
                    }
               }, dispatch)
          }
     }
}