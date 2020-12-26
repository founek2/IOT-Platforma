import fetch from "node-fetch"

// CHANGE_DEVICE_MUSIC_CAST
interface formType {
    JSONkey: string
    state: {
        on: number
    }
}
export async function handleMusicCast({ JSONkey, state: { on } }: formType, current: { state: any, updatedAt: string }, recipe: any) {
    const service = new MusicCastService(recipe.ipAddress)
    if (on === 1) {
        if (await service.powerOn()) {
            return {
                on: 1
            }
        }
    } else if (on === 0) {
        if (await service.powerOff()) {
            return {
                on: 0
            }
        }
    }

    return false;
}

class MusicCastService {
    url: string = ""
    constructor(ipAddress: string) {
        this.url = "http://" + ipAddress
    }

    async powerOff() {
        const res = await fetch(this.url + "/YamahaExtendedControl/v1/main/setPower?power=standby")
        return res.status === 200
    }

    async powerOn() {
        const res = await fetch(this.url + "/YamahaExtendedControl/v1/main/setPower?power=on")
        return res.status === 200
    }
}