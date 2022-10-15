export function findOrPush<T>(predicate: (value: T, index: number, obj: T[]) => boolean, toPush: T, arr: T[]): T {
    const found = arr.find(predicate);
    if (found) return found;

    arr.push(toPush);
    return toPush;
}
