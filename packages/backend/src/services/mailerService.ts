import logger from 'framework-ui/lib/logger';
import Email from 'email-templates';
import { createTransport } from 'nodemailer';
import path from 'path';
import config from 'common/lib/config';
import { UserBasic } from '../types';
import { Config } from 'common/lib/types';

let defaultEmail: Email;

/**
 * Service for sending emails
 */
export class MailerService {
    static init = (emailConf?: Config['email']) => {
        if (!emailConf) return;

        const transporter = createTransport({
            host: emailConf.host,
            port: emailConf.port,
            secure: emailConf.secure,
            auth: {
                user: emailConf.userName,
                pass: emailConf.password,
            },
        });

        // transporter.verify((err, status) => {
        //     console.log("email verify:", err, status)
        // })
        defaultEmail = new Email({
            message: {
                from: emailConf.userName,
            },
            transport: transporter,
            send: process.env.NODE_ENV_TEST !== 'true',
            preview: false,
        });
    };

    static sendSignUp = async (user: UserBasic) => {
        const result = await defaultEmail.send({
            template: path.join(__dirname, '../templates/emails/registration'),
            message: {
                to: user.info.email,
            },
            locals: {
                url: config.homepage,
                // token: token,
                email: user.info.email,
                firstName: user.info.firstName,
                lastName: user.info.lastName,
                homepage: config.homepage,
            },
        });
    };

    static sendLogin = async ({ email }: { email: string }) => {
        await defaultEmail.send({
            template: path.join(__dirname, '../templates/emails/login'),
            message: {
                to: email,
            },
            locals: {
                data: 'test',
            },
        });
    };

    static sendForgotPassword = async (token: string, user: UserBasic) => {
        await defaultEmail
            .send({
                template: path.join(__dirname, '../templates/emails/password_reset'),
                message: {
                    to: user.info.email,
                    // attachments: [
                    //     {
                    //         filename: 'email_banner.png',
                    //         path: path.join(__dirname, '../templates/emails/password_reset/email_banner.png'),
                    //         cid: 'banner',
                    //     },
                    // ],
                },
                locals: {
                    url: config.homepage,
                    token: token,
                    email: user.info.email,
                    firstName: user.info.firstName,
                    lastName: user.info.lastName,
                },
            })
            .catch(logger.error);
        logger.debug('sending forgot password email');
    };
}
