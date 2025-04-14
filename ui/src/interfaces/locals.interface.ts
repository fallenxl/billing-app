import { EntityId } from "./thingsboard.interface";

export interface ILocal {

    from: EntityId;
    to: EntityId;
    fromName?: string | null;
    toName?: string | null;
    buildingOwner: string; 
    label: string;
    phone: string;
    address: string;
    email: string;
}