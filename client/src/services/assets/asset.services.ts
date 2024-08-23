import axios, { AxiosError } from "axios";
import config from "../../config";

export async function GetAssetGroupService() {
    try {
        const response = await axios.get(`${config.API}/assets/group`);
        return response.data.data
    } catch (error: any | AxiosError) {
        const errorMessage = error.response?.data.split(": ")[1];
        return errorMessage;
    }
}

export async function GetCustomerByIdService(id: string) {
    try {
        const response = await axios.get(`${config.API}/customer/${id}`);
        return response.data;
    } catch (error: any | AxiosError) {
        const errorMessage = error.response?.data.split(": ")[1];
        return errorMessage;
    }
}

export async function GetCustomerRelationsById(id: string) {
    try {
        const response = await axios.get(`${config.API}/customer/${id}/relation`);
        return response.data;
    } catch (error: any | AxiosError) {
        const errorMessage = error.response?.data.split(": ")[1];
        return errorMessage;
    }
}

export async function GetAssetRelationsById(id: string) {
    try {
        const response = await axios.get(`${config.API}/assets/${id}/relation`);
        console.log(response.data)
        return response.data;
    } catch (error: any | AxiosError) {
        const errorMessage = error.response?.data.split(": ")[1];
        return errorMessage;
    }
}