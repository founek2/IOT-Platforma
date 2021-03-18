import Device from '../../models/Device'

export default function (options) {
    return async ({ params: { id }, user = {} }, res, next) => {
        const exist = await Device.checkExist(id)
        if (!exist) return res.status(208).send({ error: 'InvalidDeviceId' })

        if (user.admin)
            return next()

        if (await Device.checkWritePerm(id, user.id)) {
            return next()
        }

        return res.status(208).send({ error: 'invalidPermissions' })
    }
}