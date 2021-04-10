import type { IDevice } from "common/lib/models/interface/device";
import { IDiscovery } from "common/lib/models/interface/discovery";
import { baseLogger } from "framework-ui/lib/logger";
import { validateForm } from "framework-ui/lib/redux/actions/formsData";
import { getFormData, getToken } from "framework-ui/lib/utils/getters";
import { addDiscoveredDevice, deleteDiscovery, fetchDiscovery } from "../../../api/discovery";
import { ActionTypes } from "../../../constants/redux";
import { add as addDeviceToState } from "./devices";


export function set(data: IDiscovery[]) {
    return {
        type: ActionTypes.SET_DISCOVERED_DEVICES,
        payload: data,
    };
}

export function add(data: IDiscovery[]) {
    return {
        type: ActionTypes.ADD_DISCOVERED_DEVICES,
        payload: data,
    };
}

export function remove(deviceId: string) {
    return {
        type: ActionTypes.REMOVE_DISCOVERED_DEVICE,
        payload: deviceId,
    };
}

export function fetch() {
    return function (dispatch: any, getState: any) {
        baseLogger("FETCH_DISCOVERED_DEVICES");
        return fetchDiscovery(
            {
                token: getToken(getState()),
                onSuccess: (json: { docs: IDiscovery[] }) => {
                    dispatch(set(json.docs));
                },
            },
            dispatch
        );
    };
}

export function deleteDevices() {
    return function (dispatch: any, getState: any) {
        baseLogger("DELETE_DISCOVERED_DEVICES");

        const DISCOVERY_DEVICES = "DISCOVERY_DEVICES";
        const result = dispatch(validateForm(DISCOVERY_DEVICES)());
        if (result.valid) {
            const formData = getFormData(DISCOVERY_DEVICES)(getState()) as any;
            formData.selected.map((id: IDiscovery["_id"]) => {
                return deleteDiscovery(
                    {
                        token: getToken(getState()),
                        id,
                        onSuccess: () => {
                            dispatch(remove(id));
                        },
                    },
                    dispatch
                );
            })

        }
    };
}

export function addDevice(id: IDiscovery["_id"]) {
    return function (dispatch: any, getState: any) {
        baseLogger("CREATE_DEVICE");

        const CREATE_DEVICE = "CREATE_DEVICE";
        const result = dispatch(validateForm(CREATE_DEVICE)());
        if (result.valid) {
            const formData = getFormData(CREATE_DEVICE)(getState()) as any;
            return addDiscoveredDevice(
                {
                    token: getToken(getState()),
                    id,
                    body: { formData: { [CREATE_DEVICE]: formData } },
                    onSuccess: (json: { doc: IDevice }) => {
                        dispatch(remove(id));
                        dispatch(addDeviceToState(json.doc));
                    },
                },
                dispatch
            );
        }
    };
}
