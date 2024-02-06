import { server } from "common/__test__/helpers/superTest";
import { ActionKeys, actionMap } from "common/src/middlewares/resource-router-middleware";

export async function tokenMiddlewareIsPresent(url: string, actions: ActionKeys[]) {
    for (const action of actions) {
        const method = actionMap[action];
        const res = await server[method](url)
            .expect('Content-type', /json/)
            .expect(400);

        expect(res.body.error).toEqual("tokenNotProvided");
    }
}

export async function formDataMiddlewareIsPresent(url: string, actions: ActionKeys[], accessToken?: string) {
    for (const action of actions) {
        const method = actionMap[action];
        const req = server[method](url)
            .expect('Content-type', /json/)
            .expect(400);

        if (accessToken)
            req.set("Authorization", `Bearer ${accessToken}`)

        const res = await req;

        expect(res.body.error).toEqual("missingFormData");
    }
}