import config from "@/config";
import axios from "axios";

export async function getSiteService({ id }: { id: string }) {
    try {
        const response = await axios.get(`${config.API}/assets/${id}`);
        return { success: true, data: response.data , message: "Site fetched successfully" };  
    } catch (error: any ) {
        return { success: false, data: null, message: "Error fetching site", error: error };
    }
}