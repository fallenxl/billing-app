
export interface ILocalCharges {
    name: string,
    description: string,
    amount: number | string,
    type?: "fixed" | "variable",
}
export interface ILocal {
    entityType: string,
    from: {
        id: string,
        entityType: string,
    },
    to: {
        id: string,
        entityType: string,
    },
    id: string,
    label: string,
    toName: string,
    address: string,
    phone: string,
    email: string,
    buildingOwner: string,
    latitude: number,
    longitude: number,
    charges: ILocalCharges[],
    meters: string
}


export interface ILocalUpdate {
    id: {
        entityType: string,
        id: string,
    },
    customerId: {
        entityType: string,
        id: string,
    },
    name: string,
    label: string,
    address: string,
    phone: string,
    email: string,
    buildingOwner: string,
    latitude: number,
    longitude: number,
    charges: ILocalCharges[],
}