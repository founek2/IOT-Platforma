import fieldDescriptors from 'common/lib/fieldDescriptors';
import { UserModel } from 'common/lib/models/userModel';
import formDataChecker from 'common/lib/middlewares/formDataChecker';
import resource from 'common/lib/middlewares/resource-router-middleware';
import { Request } from "express";

/**
 * URL prefix /user
 */
export default () =>
    resource({
        middlewares: {
            modify: [
                formDataChecker(fieldDescriptors, { allowedForms: ["MODIFY_PUSH_SUBSCRIPTION"] }),
            ],
        },
        async modify({ body }: Request, res) {
            const { formData } = body;

            if (formData.MODIFY_PUSH_SUBSCRIPTION) {
                await UserModel.modifyNotifyToken(formData.MODIFY_PUSH_SUBSCRIPTION.old, formData.MODIFY_PUSH_SUBSCRIPTION.new);
                res.sendStatus(204);
            } else {
                res.sendStatus(400);
            }
        },
    });
