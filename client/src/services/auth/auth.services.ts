import axios, { AxiosError } from "axios";
import config from "../../config";

export async function authService(username: string, password: string) {
    try {
        const response = await axios.post(`${config.API}/auth/login`, {
            username,
            password
        })
        return response.data;
    } catch (error: any | AxiosError) {
        
       if(error.response){
        const message = error.response.data.split(': ')[1]
        if (message) {
            return JSON.parse(message)
        }
       }
    }
}

export async function getCurrentUserService(token: string) {
    try {
        const response = await axios.get(`${config.API}/auth/current`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error: any | AxiosError) {
        const message = error.response.data.split(': ')[1]
        if (message) {
            return JSON.parse(message)

        }
    }
}