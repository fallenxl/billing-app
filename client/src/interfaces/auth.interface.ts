import { IUser } from "./user.interface";

export interface ICredentials {
    username: string;
    password: string;
}

export interface IAuthResponse {
    token: string;
    refreshToken: string;
    user: IUser;
}