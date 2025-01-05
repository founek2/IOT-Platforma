const KEY = 'deviceId';

export function generateDeviceId(): string {
    const currentId = localStorage.getItem(KEY);
    if (currentId) {
        return currentId;
    }

    const id = 'FE-' + Math.random().toString(36).slice(2, 7);
    localStorage.setItem(KEY, id);

    return id;
}