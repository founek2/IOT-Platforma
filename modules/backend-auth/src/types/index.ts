import { JwtService, UserService } from "common";
import { OAuthService } from "../services/oauthService";
import { TemporaryPass } from "../services/TemporaryPass";

export interface UpdateThingState {
    _id: string;
    state: any;
}
export type Context = {
    oauthService: OAuthService
    userService: UserService
    jwtService: JwtService
    temporaryPassService: TemporaryPass
}

export type HasContext = {
    context: Context
}