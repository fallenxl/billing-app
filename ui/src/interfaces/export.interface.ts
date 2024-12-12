import { ILocal } from "./local.interface";

export interface IExportData {
    branch: string;
    format: "pdf" | "excel" | "support";
    customer: string;
    currency: string;
    img: string;
    sendEmail: boolean;
    selectedDevices: ILocal[];
    units: {
        energy: string;
        water: string;
        gas: string;
        air: string;
    },
    rate: {
        energy: number;
        water: number;
        gas: number;
        air: number;
    },
    startDateTs: number;
    endDateTs: number;
}