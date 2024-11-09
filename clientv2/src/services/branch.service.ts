import config from "@/config";
import axios, { AxiosError } from "axios";

export async function getBranchRelationsById(id: string) {
    try {
        const response = await axios.get(`${config.API}/assets/${id}/relation`);
        return { success: true, data: response.data, message: "Branch relations fetched successfully" };
    } catch (error: any | AxiosError) {
        return { success: false, data: null, message: "Error fetching branch relations", error: error };
    }
}
