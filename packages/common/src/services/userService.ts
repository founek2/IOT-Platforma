import argon2 from 'argon2';
import addHours from 'date-fns/addHours';
import { logger } from 'common/lib/logger';
import mongoose from 'mongoose';
import dotify from 'node-dotify';
import { Either, Left, Right } from 'purify-ts/Either';
import { Just, Maybe, Nothing } from 'purify-ts/Maybe';
import { AuthType } from '../constants';
import { DeviceModel } from '../models/deviceModel';
import { IAccessToken, IOauth, IUser, Permission } from '../models/interface/userInterface';
import { NotifyModel } from '../models/notifyModel';
import { IToken, TokenModel, TokenType } from '../models/tokenModel';
import { UserModel } from '../models/userModel';
import { JwtService } from '../services/jwtService';
import { Security } from './SecurityService';

const ObjectId = mongoose.Types.ObjectId;

async function createHash(plainText: string) {
    return argon2.hash(plainText);
}

function comparePasswd(plainText: string, hash: string) {
    return argon2.verify(hash, plainText);
}

export type UserWithToken = { doc: IUser; token: string };
export type CredentialData = {
    userName: IUser['info']['userName'];
    password: string;
    authType: AuthType;
};

/**
 * User service handles complicated data manipulation with user
 */
export const UserService = {
    /**
     * Create new user
     */
    async create(
        object: Omit<IUser, 'realm' | 'groups' | 'createdAt' | 'updatedAt' | 'notifyTokens'>
    ): Promise<UserWithToken> {
        const { password, oauth } = object.auth;

        logger.debug('user creating:', object);

        const rootExists = await UserModel.exists({ groups: 'root' });
        const types = [password ? AuthType.passwd : AuthType.oauth];

        const user = new UserModel({
            ...object,
            auth: {
                types,
                password: password ? await createHash(password) : undefined,
                oauth,
            },
            realm: object.info.userName,
            groups: rootExists ? ['user'] : ['root'],
        });
        const obj = await user.save();
        const plainUser = obj.toObject();

        const token = await JwtService.sign(plainUser);
        return { doc: plainUser, token };
    },

    /**
     * Compare credentials with one saved in DB
     */
    async checkCreditals({
        userName,
        authType,
        password,
    }: CredentialData): Promise<Either<string, { doc: IUser; token: string }>> {
        // : Promise<{ doc?: IUser; token?: string; error?: string }>
        if (authType !== AuthType.passwd) return Left('notImplemented');

        const doc = await UserModel.findOne({ 'info.userName': userName, 'auth.types': authType });
        if (!doc) return Left('unknownUser');

        const matched = await comparePasswd(password, doc.auth.password as string);
        if (!matched) return Left('passwordMissmatch');

        const token = await JwtService.sign({ id: doc._id });

        return Right({
            token,
            doc: doc.toObject(),
        });
    },

    /**
     * Compare credentials with one saved in DB
     */
    async refreshAuthorization(
        email: string,
        userName: string,
        oauth: IOauth
    ): Promise<Maybe<{ token: string; doc: IUser; oldOauth?: IOauth }>> {
        let doc = await UserModel.findOneAndUpdate({ 'info.email': email }, { 'auth.oauth': oauth });
        if (!doc) {
            const { doc, token } = await UserService.create({
                info: {
                    userName,
                    email,
                },
                auth: {
                    oauth,
                },
            } as any);

            return Just({
                token,
                doc: doc,
                oldOauth: undefined,
            });
        }

        const token = await JwtService.sign({ id: doc._id, groups: doc.groups });
        return Just({
            token,
            doc: doc.toObject(),
            oldOauth: doc.auth.oauth,
        });
    },

    removeAuthorization(id: IUser['_id']) {
        UserModel.updateOne({ _id: ObjectId(id) }, { 'auth.oauth': undefined });
    },

    async getAuthorization(id: IUser['_id']) {
        let doc = await UserModel.findOne({ _id: ObjectId(id) }, { 'auth.oauth': 1 }).lean();
        return doc?.auth.oauth ? Just(doc.auth.oauth) : Nothing;
    },

    /**
     * Update user
     */
    async updateUser(userID: IUser['_id'], data: Partial<IUser>) {
        if (data.auth && data.auth.password) {
            const { password } = data.auth;
            const hash = await createHash(password);
            data.auth.password = hash;
        } else delete data.auth;

        const doc = await UserModel.findOneAndUpdate(
            { _id: ObjectId(userID) },
            { $set: dotify(data), $addToSet: { 'auth.types': AuthType.passwd } }
        );
        if (!doc) return Left('unknownUser');

        return Right(doc);
    },

    async changePassword(userID: IUser['_id'], password: string) {
        const hash = await createHash(password);
        const doc = await UserModel.findOneAndUpdate({ _id: ObjectId(userID) }, { 'auth.password': hash });
        if (!doc) return Left('unknownUser');

        return Right(doc);
    },

    /**
     * Update user
     */
    async updateAccessToken(
        tokenId: IAccessToken['_id'],
        userID: IUser['_id'],
        accessToken: { name: string; permissions: Permission[]; validTo?: Date }
    ) {
        UserModel.updateOne(
            { _id: ObjectId(userID), 'accessTokens._id': ObjectId(tokenId) },
            {
                $set: {
                    'accessTokens.$.name': accessToken.name,
                    'accessTokens.$.permissions': accessToken.permissions,
                    'accessTokens.$.validTo': accessToken.validTo,
                },
            }
        ).exec();
    },

    async createAccessToken(data: { name: string; permissions: Permission[]; validTo?: Date }, userID: IUser['_id']) {
        // : Promise<null | IAccessToken>
        const newToken = {
            ...data,
            token: Security.getRandomAsciToken(30),
            createdAt: new Date(),
        };
        if (await UserModel.exists({ 'accessTokens.token': newToken.token })) return Left('unableToCreate');

        const doc = await UserModel.findOneAndUpdate(
            {
                _id: ObjectId(userID),
            },
            {
                $push: { accessTokens: newToken },
            },
            { new: true, fields: 'accessTokens' }
        ).lean();
        if (!doc) return Left('unableToCreate');

        return Right(doc.accessTokens?.pop() as IAccessToken);
    },

    async deleteAccessToken(tokenId: IAccessToken['_id'], userID: IUser['_id']) {
        UserModel.updateOne(
            { _id: ObjectId(userID) },
            {
                $pull: {
                    accessTokens: { _id: ObjectId(tokenId) },
                },
            }
        ).exec();
    },

    /**
     * Delete user from DB and all his permissions from devices + his notification rules
     */
    async deleteById(id: IUser['_id']): Promise<boolean> {
        const userId = ObjectId(id);

        const result = await UserModel.deleteOne({
            _id: userId,
        });

        if (result.deletedCount !== 1) return false;
        NotifyModel.deleteMany({
            userId: userId,
        }).exec();

        DeviceModel.updateMany({
            $pull: {
                'permissions.read': userId,
                'permissions.control': userId,
                'permissions.write': userId,
            },
        }).exec();

        return true;
    },

    /**
     * Generate forgot token for user
     */
    async forgotPassword(email: IUser['info']['email']): Promise<Either<string, { token: IToken; user: IUser }>> {
        const user = await UserModel.findOne({ 'info.email': email }).lean();
        if (!user) return Left('userNotExist');

        const token = await TokenModel.create({
            type: TokenType.forgot_password,
            data: Security.getRandomToken(64),
            validTo: addHours(new Date(), 5),
            userId: user._id,
        });
        return Right({ token: token, user });
    },
};
