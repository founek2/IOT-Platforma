import UserModel from '../../models/user'

export default function (options) {
    return async ({params: { id, ...other }, user = {}, url}, res, next) => {
        console.log("url: ", url, id, other)
        if (user.admin) {
            if (await UserModel.checkExist(id))
                return next()
        } else {
            if (id == user.id)
                return next()
            else if (await UserModel.checkExist(id)) return res.status(208).send({ error: 'invalidPermissions' })
        }

        res.status(208).send({ error: 'InvalidUserId' })
    }
}