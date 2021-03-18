import Device from '../../models/Device'

export default function (options) {
    return async ({ params: { id }, user = {} }, res, next) => {
        if (user.admin) {
            if (await Device.checkExist(id))
                return next()
        } else {
            if (await Device.checkControlPerm(id, user.id))
                return next()
            else if (await Device.checkExist(id)) return res.status(208).send({ error: 'invalidPermissions' })
        }

        res.status(208).send({ error: 'InvalidDeviceId' })
    }
}