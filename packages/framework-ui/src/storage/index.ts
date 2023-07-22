let storage = localStorage;

export function getItem(key: string) {
    return storage.getItem(key);
}

export function setItem(key: string, value: any) {
    return storage.setItem(key, value);
}

export function removeItem(key: string) {
    storage.removeItem(key);
}

export function removeItems(array: string[]) {
    array.forEach((key) => {
        storage.removeItem(key);
    });
}

export function setStorage(type: 'local' | 'session') {
    if (type === 'local') storage = localStorage;
    else if (type === 'session') storage = sessionStorage;
    else console.error('Unsupported storage');
}
