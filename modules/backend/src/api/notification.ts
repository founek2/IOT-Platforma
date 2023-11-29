import fieldDescriptors from 'common/lib/fieldDescriptors';
import { IUser } from 'common/lib/models/interface/userInterface';
import { TokenModel } from 'common/lib/models/tokenModel';
import { UserModel } from 'common/lib/models/userModel';
import { UserService } from 'common/lib/services/userService';
import { RequestWithAuth } from 'common/lib/types';
import formDataChecker from 'common/lib/middlewares/formDataChecker';
import { rateLimiterMiddleware } from 'common/lib/middlewares/rateLimiter';
import resource from 'common/lib/middlewares/resource-router-middleware';
import tokenAuthMIddleware from 'common/lib/middlewares/tokenAuth';
import checkWritePerm from 'common/lib/middlewares/user/checkWritePerm';
import eventEmitter from '../services/eventEmitter';
import { getAllowedGroups } from 'common/lib/constants/privileges';

type Params = { userId: string };
type Request = RequestWithAuth<Params>;

/**
 * URL prefix /user
 */
export default () =>
    resource({
        mergeParams: true,
        middlewares: {
            create: [
                tokenAuthMIddleware(),
                checkWritePerm({ paramKey: 'userId' }),
                formDataChecker(fieldDescriptors, { allowedForms: ["ADD_PUSH_SUBSCRIPTION"] }),
            ],
        },

        async create({ body, user }: Request, res) {
            const { formData } = body;

            if (formData.ADD_PUSH_SUBSCRIPTION) {
                await UserModel.addNotifyToken(user._id, formData.ADD_PUSH_SUBSCRIPTION);
                res.sendStatus(204);
            } else {
                res.sendStatus(400);
            }
        },
    });
