import fieldDescriptors from 'common/lib/fieldDescriptors'

const state = () => ({
    application: {
        user: {},
        notifications: {},
        users: [],
        devices: { data: [] }
    },
    fieldDescriptors,
    tmpData: {
        dialog: {}
    },
    history: {}
})

export default state
