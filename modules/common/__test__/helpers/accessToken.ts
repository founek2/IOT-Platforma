import { UserModel, UserService } from "common";
import { JwtService } from "common/src/services/jwtService"

export function getTokenFactory(options: ConstructorParameters<typeof JwtService>[0]) {
    const jwtService = new JwtService(options);
    const userService = new UserService(jwtService);

    return async function ({ userName }: { userName: string }) {
        const user = await UserModel.findByUserName(userName)
        if (!user) throw new Error("Invalid user")
        const result = await userService.createTokens(user, "");
        const { refreshToken, accessToken } = result.unsafeCoerce();

        return { refreshToken, accessToken, user };
    }
}


// export function getAccessTokenFactory(options: ConstructorParameters<typeof JwtService>[0]) {
//     const jwtService = new JwtService(options);

//     return async function ({ userName }: { userName: string }) {
//         const user = await UserModel.findByUserName(userName)
//         if (!user) throw new Error("Invalid user")
//         const accessToken = await jwtService.sign({ iss: user._id, sub: user._id, groups: user.groups });

//         return accessToken
//     }
// }