import { ISite } from "./sites.interface";

interface EntityId {
    entityType: string;
    id: string;
  }
  
  // interface AdditionalInfo {
  //   description: string;
  //   allowWhiteLabeling: boolean;
  //   homeDashboardId: string | null;
  //   homeDashboardHideToolbar: boolean;
  // }
  
  export interface ICustomer {
    id: EntityId;
    name: string;
    customerId: string | null;
    img: string;
    sites: ISite[] | null;
    sitesGroup?: string;
    // ownerId: EntityId;
    // additionalInfo: AdditionalInfo;
    // createdTime: number;
    // country: string;
    // state: string | null;
    // city: string | null;
    // address: string | null;
    // address2: string | null;
    // zip: string | null;
    // phone: string | null;
    // email: string | null;
    // title: string;
    // tenantId: EntityId;
    // parentCustomerId: string | null;
    // externalId: string | null;
    // version: number;
    // customMenuId: string | null;
  }
  