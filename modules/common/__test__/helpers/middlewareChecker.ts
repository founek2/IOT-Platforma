import { server } from "common/__test__/helpers/superTest";
import { ActionKeys, actionMap } from "common/lib/middlewares/resource-router-middleware";

function expandUrlWithId(url: string, action: ActionKeys, id?: string) {
    if (action.endsWith("Id") || action === "read") {
        return `${url}/${id || "123"}`
    }
    return url;
}

export async function tokenMiddlewareIsPresent(url: string, actions: ActionKeys[], { id }: { id?: string } = {}) {
    for (const action of actions) {
        const method = actionMap[action];
        const res = await server[method](expandUrlWithId(url, action, id))

        expect(res.status).toEqual(400);
        expect(res.headers["content-type"]).toMatch(/json/);
        expect(res.body.error).toEqual("tokenNotProvided");
    }
}

export async function formDataMiddlewareIsPresent(url: string, actions: ActionKeys[], { accessToken, id }: { accessToken?: string, id?: string } = {}) {
    for (const action of actions) {
        const method = actionMap[action];
        const req = server[method](expandUrlWithId(url, action, id))

        if (accessToken)
            req.set("Authorization", `Bearer ${accessToken}`)

        const res = await req;

        expect(res.status).toEqual(400);
        expect(res.headers["content-type"]).toMatch(/json/);
        expect(res.body.error).toEqual("missingFormData");
    }
}