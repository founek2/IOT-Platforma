import { CONTROL_TYPES } from "common/lib/constants";
import { changeMusicCast, isOnlineMusicCast } from "./handler/MusicCast"
import { ChangeHandler, AckHandler } from "../types";

const mapping: { [key in CONTROL_TYPES]?: { changeHandler: ChangeHandler, isOnlineHandler: AckHandler } } = {
    [CONTROL_TYPES.MUSIC_CAST]: {
        changeHandler: changeMusicCast,
        isOnlineHandler: isOnlineMusicCast,
    }
}

const DeviceHandler: {
    handleChange: ChangeHandler,
    handleIsOnline: AckHandler
} = {
    handleChange: async function (form, currentState, recipe) {
        const handler = mapping[recipe.type]
        if (!handler) throw new Error("Invalid type")

        return handler.changeHandler(form, currentState, recipe)
    },
    handleIsOnline: async function (recipe) {
        const handler = mapping[recipe.type]
        if (!handler) throw new Error("Invalid type")

        return handler.isOnlineHandler(recipe)
    }
}

export default DeviceHandler