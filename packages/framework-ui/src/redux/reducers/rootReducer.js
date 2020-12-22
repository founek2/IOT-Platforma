import { actionTypes } from '../../constants/redux'
import { warningLog } from '../../logger'

export default appReducer => (state, action) => {
    if (actionTypes.HYDRATE_STATE === action.type) {
        warningLog('Hydrating state')
        const { application } = action.payload

        state = {
            application, fieldDescriptors: state.fieldDescriptors,
            // formsData: {...state.formsData, ...formsData}
            formsData: state.formsData
        }
    }

    // if (action.type === actionTypes.RESET_TO_DEFAULT) {
    // 	warningLog('RESET_TO_DEFAULT')
    // 	removeItems([STATE_DEHYDRATED])
    //      state.application = { notifications: state.application.notifications, user: {} }
    // }
    return appReducer(state, action)
}
