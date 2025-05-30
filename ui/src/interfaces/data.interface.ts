import { ICustomer } from "./customer.interface";
import { ILocal } from "./locals.interface";
import { ICharge, ISite, ITariff } from "./sites.interface";

export interface IExportData { 
    localsSelected: ILocal[];
    customer: ICustomer;
    site: ISite;
    format: "pdf" | "excel" | "support";
    startDate: Date;
    endDate: Date;
    settings: {
        tariff: ITariff;
        globalCharges: ICharge[];
        currency: string;
    }
}   