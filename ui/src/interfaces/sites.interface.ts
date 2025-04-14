import { EntityId, ILocal } from ".";

export interface ISite {
    from: EntityId;
    to: EntityId;
    type: string;
    typeGroup: string;
    version: number;
    fromName?: string | null;
    toName?: string | null;
    additionalInfo?: any | null;
    locals: ILocal[] | null;
}

export type SitesResponse = ISite[];
