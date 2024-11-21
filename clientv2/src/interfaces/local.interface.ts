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
    address:string,
    phone: string,
    email: string,
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
}