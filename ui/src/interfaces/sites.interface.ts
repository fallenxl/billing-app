import { EntityId, ILocal } from ".";
export interface LocalsData {
    locals: ILocal[];
    hasNext: boolean;
    totalElements: number;
    totalPages: number;
}
export interface ISite {
    id: string;
    customerId: string;
    name: string;
    type: string;
    label: string;
    localsData: LocalsData;
    localsGroup: string;
    web: string;
    address: string;
    phone: string;
    email: string;
    paymentInfo: string;
    supportInfo: string;
    globalCharges: {
        id: string;
        name: string;
        value: number;
        type: string;
    }[]
    currency: string;
    tariff: {
        energyRate: {
            value: string;
            unit: string;
        };
        waterRate: {
            value: string;
            unit: string;
        };
    },
}
export type SitesResponse = ISite[];
