import unsetInPath from '../unsetInPath'
import { clone } from 'ramda'

describe("unSetInPath", () => {
    test("simple", () => {
        const obj = { title: { posts: { 1: { kekel: 10 }, 2: { title: "Submarine" } } } }
        const output = clone(obj)
        // @ts-ignore
        output.title.posts["1"].kekel = undefined

        expect(unsetInPath("title.posts.1.kekel", obj)).toEqual(output)
        expect(unsetInPath("monitor.0", { monitor: [{ title: "Snehurka" }, 4, 5], lazarus: 111 })).toEqual({ monitor: [4, 5], lazarus: 111 })
    });
});



