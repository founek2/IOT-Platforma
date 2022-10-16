export function not(value: boolean) {
    return !value;
}

export function head<T>(array: Array<T>) {
    if (array.length > 0) return array[0];

    return undefined;
}

export function append<T>(item: T, array: Array<T>) {
    return [...array, item];
}
