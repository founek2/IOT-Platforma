import { mapObjIndexed, ifElse, is, identity, map } from "ramda";

export function trimData(formData: any) {
    function trim(data: any) {
        const recTrim: any = ifElse(
            is(Object),
            trim,
            ifElse(
                is(String),
                val => val.trim(),
                identity)
        )


        return ifElse(
            is(Array),
            map(
                recTrim
            ),
            mapObjIndexed(
                recTrim
            )
        )(data)
    }
    return trim(formData);
}