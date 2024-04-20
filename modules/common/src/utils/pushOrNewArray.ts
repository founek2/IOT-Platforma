export function pushOrNewArray<T>(array: T[] | undefined, item: T): T[] {
    if (!array) {
        return [item];
    }

    array.push(item)
    return array
}