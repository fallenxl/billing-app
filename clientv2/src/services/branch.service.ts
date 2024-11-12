import config from "@/config";
import { IBranchSettings } from "@/interfaces";
import { Label } from "@radix-ui/react-label";
import axios, { AxiosError } from "axios";

export async function getBranchRelationsById(id: string) {
    try {
        const response = await axios.get(`${config.API}/assets/${id}/relation`);
        return { success: true, data: response.data, message: "Branch relations fetched successfully" };
    } catch (error: any | AxiosError) {
        return { success: false, data: null, message: "Error fetching branch relations", error: error };
    }
}


export async function updateBranchSettingsService({ id, data }: { id: string, data: IBranchSettings }) {
    try {
        const response = await axios.post(`${config.API}/assets/${id}/attributes`, data);
        return { success: true, data: response.data, message: "Branch settings updated successfully" };
    } catch (error: any | AxiosError) {
        return { success: false, data: null, message: "Error updating branch settings", error: error };
    }
}

export async function updateBranchNameService({ data }: {  data: IBranchSettings }) {
    try {
        const response = await axios.post(`${config.API}/assets`, 
        { 
            id: data.id,
            name: data.name,
            label: data.label,
        });
        return { success: true, data: response.data, message: "Branch name updated successfully" };
    } catch (error: any | AxiosError) {
        return { success: false, data: null, message: "Error updating branch name", error: error };
    }
}