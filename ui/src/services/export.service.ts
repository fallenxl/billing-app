import config from "@/config";
import { ILocal } from "@/interfaces/local.interface";
import axios, { AxiosError } from "axios";

export interface IExportData {
    format:  'pdf' | 'excel' | 'support';
    img: string | undefined;
    startDateTs: number;
    endDateTs: number;
    customer: string;
    branch: string;
    units: {
        water: string | null;
        energy: string | null;
        gas: string | null;
        air?: string | null;
    },
    rate:{
        water: number | null;
        energy: number | null;
        gas?: number | null;
        air?: number | null;
        hotWater?: number | null;
    }
    currency: string;
    selectedDevices: ILocal[]
}


export function getExtension(format: string) {
    switch (format) {
        case 'pdf':
            return 'pdf';
        case 'excel':
            return 'xlsx';
        case 'support':
            return 'zip';
        default:
            return 'pdf';
    }
}
export async function exportDataService(data: IExportData){
    try {
        const response = await axios.post(`${config.API}/data/export`, data, {
            responseType: 'blob'
        })
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const filename = `export-${data.format}.${getExtension(data.format)}`;
        return { success: true, data: { url, filename  }, message: "Data exported successfully" };


    } catch (error: any | AxiosError) {
        return { success: false, data: null, message: error.response?.data.split(": ")[1], error: error };
    }
}