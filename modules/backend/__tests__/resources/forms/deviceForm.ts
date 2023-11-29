const update_device = {
    formData: {
        EDIT_DEVICE: {
            info: { title: 'Zmeneno' },
            topic: '/tedas/dasdasd/dasda',
            gps: { coordinates: ['32', '31'] },
        },
    },
};

const update_device_sensors = {
    formData: {
        EDIT_SENSORS: {
            count: 2,
            name: ['Teplota', 'Vlhkost'],
            unit: ['C', '%'],
            JSONkey: ['tmp', 'hum'],
            sampleInterval: 120,
            description: ['bla bla'],
        },
    },
};

const update_permissions = {
    formData: {
        EDIT_PERMISSIONS: {
            read: ['5d5554753beb3f419f9e4a63'],
            write: ['5d55a7eda08bcc45737abcef', '5d5554753beb3f419f9e4a63'],
            control: ['5d55a7eda08bcc45737abcef'],
        },
    },
};

const create_device = {
    formData: {
        CREATE_DEVICE: {
            info: { title: 'Testovaci zařízení' },
            gps: { coordinates: ['31', '32'] },
            topic: '/house/test/kekel',
        },
    },
};

export default {
    create_device,
    update_device,
    update_device_sensors,
    update_permissions,
};
