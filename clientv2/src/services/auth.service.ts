import config from "@/config";
import { IAuthResponse, ICredentials } from "@/interfaces";
import { IUser } from "@/interfaces/user.interface";
import axios, { AxiosError } from "axios";

export async function signInService({ username, password }: ICredentials) {
    try {
        const response = await axios.post(`${config.API}/auth/login`, {
            username,
            password
        })
        return { success: true, data: response.data as IAuthResponse, message: 'Login successful' };
    } catch (error: any | AxiosError) {

        return { success: false, data: null, error: error.response?.data.message || error.message, message: 'Username or password is incorrect' };
    }
}

export async function getCurrentAuthService({token}: {token: string}) {
    try {
        const response = await axios.get(`${config.API}/auth/current`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return { success: true, data: response.data as IUser, message: 'User fetched successfully' };
    } catch (error: any | AxiosError) {
        return { success: false, data: null, error: error.response?.data.message || error.message, message: 'Token expired' };
    }
}