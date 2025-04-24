import { EntityId } from "./thingsboard.interface";


export interface ILocal {
    id: EntityId;
    customerId: EntityId;
    name: string;
    type: string;
    buildingOwner: string; 
    label: string;
    phone: string;
    address: string;
    email: string;
    //  assetProfileId: EntityId; 
    //  externalId: EntityId | null;
    //  ownerId: EntityId;
    //  createdTime: number;
    //  tenantId: EntityId; 
}