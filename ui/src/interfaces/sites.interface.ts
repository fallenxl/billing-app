import { EntityId, ILocal } from ".";
export interface LocalsData {
    locals: ILocal[];
    hasNext: boolean;
    totalElements: number;
    totalPages: number;
}
export interface ISite {
    id: EntityId;
    customerId: EntityId;
    name: string;
    type: string;
    label: string;
    localsData: LocalsData;
    localsGroup: string;
    //  assetProfileId: EntityId; 
    //  externalId: EntityId | null;
    //  ownerId: EntityId;
    //  createdTime: number;
    //  tenantId: EntityId; 
}
export type SitesResponse = ISite[];
