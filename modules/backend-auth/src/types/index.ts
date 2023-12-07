import { JwtService, UserService } from "common";
import { OAuthService } from "../services/oauthService";

export interface UpdateThingState {
    _id: string;
    state: any;
}
export type Context = {
    oauthService: OAuthService
    userService: UserService
    jwtService: JwtService
}

export type HasContext = {
    context: Context
}