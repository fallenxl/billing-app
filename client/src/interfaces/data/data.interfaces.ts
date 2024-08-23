import { IRelation } from "../relation/relation.interface";

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
        air: string | null;
    },
    rate:{
        water: number | null;
        energy: number | null;
        gas: number | null;
        air: number | null;
        hotWater: number | null;
    }
    currency: string;
    selectedDevices: IRelation[]
}

