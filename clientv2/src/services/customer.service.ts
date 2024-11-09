
import config from "@/config";
import { ICustomer, ICustomerRelations } from "@/interfaces/customer.interface";
import axios, { AxiosError } from "axios";

export async function getCustomersService() {
    try {
        const response = await axios.get(`${config.API}/assets/group`);
        return { success: true, data: response.data.data , message: "Customer group fetched successfully"};
    } catch (error: any | AxiosError) {
        return { success: false, data: null, message: error.response?.data.split(": ")[1], error: error };
    }
}

export async function getCustomerByIdService(id: string) {
    try {
        const response = await axios.get(`${config.API}/customer/${id}`);
        return { success: true, data: response.data as ICustomer, message: "Customer fetched successfully" };    
    } catch (error: any | AxiosError) {
        return { success: false, data: null, message: "Error fetching customer", error: error };
    }
}


export async function getCustomerRelationsById(id: string) {
    try {
        const response = await axios.get(`${config.API}/customer/${id}/relation`);
        return { success: true, data: response.data as ICustomerRelations[], message: "Customer relations fetched successfully" };    
    } catch (error: any | AxiosError) {
        return { success: false, data: null, message: "Error fetching customer relations", error: error };
    }
}