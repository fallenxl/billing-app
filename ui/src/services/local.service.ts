import config from "@/config";
import { ILocalUpdate } from "@/interfaces";
import axios from "axios";

export async function getSiteService({ id }: { id: string }) {
    try {
        const response = await axios.get(`${config.API}/assets/${id}`);
        return { success: true, data: response.data , message: "Site fetched successfully" };  
    } catch (error: any ) {
        return { success: false, data: null, message: "Error fetching site", error: error };
    }
}

export async function updateLocalService({ id, data }: { id: string, data: Partial<ILocalUpdate> }) {
    try {
        const response = await axios.post(`${config.API}/assets/${id}/attributes`, data);
 
        return { success: true, data: response.data, message: "Branch settings updated successfully" };
    } catch (error) {
        return { success: false, data: null, message: "Error updating branch settings", error: error };
    }
}


export async function updateLocalNameService({ data }: {  data: ILocalUpdate }) {
    try {
        const response = await axios.patch(`${config.API}/assets/update-name`, 
        { 
            id: data.id,
            customerId: data.customerId,
            name: data.name,
            label: data.label,
        });
        console.log(response.data, data)
        return { success: true, data: response.data, message: "Branch name updated successfully" };
    } catch (error) {
        return { success: false, data: null, message: "Error updating branch name", error: error };
    }
}