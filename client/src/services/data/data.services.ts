import axios, { AxiosError } from "axios";
import { IExportData } from "../../interfaces/data/data.interfaces";
import config from "../../config";

function getExtension(format: string) {
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
export async function ExportDataService(data: IExportData){
    try {
        const response = await axios.post(`${config.API}/data/export`, data, {
            responseType: 'blob'
        })
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `export.${getExtension(data.format)}`);
        document.body.appendChild(link);
        link.click();


        return response.data;

        // const response = await axios.post(`${config.API}/data/export`, data)
        // console.log(response.data)
        // return response.data
    } catch (error: any | AxiosError) {
        const message = error.response.data.split(': ')[1]
        if (message) {
            return JSON.parse(message)

        }
    }
}