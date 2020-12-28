import fetch from "node-fetch"
import * as types from "../../types"

class MusicCastService {
    url: string = ""
    constructor(ipAddress: string) {
        this.url = "http://" + ipAddress
    }

    // async powerOff() {
    //     const res = await fetch(this.url + "/YamahaExtendedControl/v1/main/setPower?power=standby")
    //     return res.status === 200
    // }

    // async powerOn() {
    //     const res = await fetch(this.url + "/YamahaExtendedControl/v1/main/setPower?power=on")
    //     return res.status === 200
    // }

    async powerToggle() {
        const res = await fetch(this.url + "/YamahaExtendedControl/v1/main/setPower?power=toggle")
        return res.status === 200
    }

    async isOnline(): Promise<boolean> {
        const res = await fetch(this.url + "/YamahaExtendedControl/v1/system/getDeviceInfo")
        return res.status === 200
    }
}

export const changeMusicCast: types.ChangeHandler = async ({ JSONkey, state: { on } }, current, recipe: types.ControlRecipe) => {
    const service = new MusicCastService(recipe.ipAddress as string)
    if (on === 1) {
        if (await service.powerToggle()) {
            return {
                on: 1
            }
        }
    }

    return false;
}

export const isOnlineMusicCast: types.AckHandler = async (recipe) => {
    const service = new MusicCastService(recipe.ipAddress as string)
    return service.isOnline()
}