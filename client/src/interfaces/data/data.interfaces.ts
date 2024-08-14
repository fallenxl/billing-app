import { IRelation } from "../relation/relation.interface";

export interface IExportData {
    format:  'pdf' | 'excel' | 'support';
    img: string | undefined;
    startDateTs: number;
    endDateTs: number;
    customer: string;
    branch: string;
    rate?:{
        water: {
            rate: number | null;
            unit: string;
        },
        hotWater: {
            rate: number | null;
            unit: string;
        
        },energy: {
            rate: number | null;
            unit: string;
        },air:{
            rate: number | null;
            unit: string;
        },gas:{
            rate: number | null;
            unit: string;
        }
    } | null;
    currency: string;
    selectedDevices: IRelation[]
}

