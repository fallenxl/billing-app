export interface ICustomer {
    assetProfileId: {
        id: string,
        entityType: string,
    },
    id: {
        id: string,
        entityType: string,
    },
    name: string,
    img: string,
    label: string,
}

export interface ICustomerRelations {
    entityType: string,
    from:{
        id: string,
        entityType: string,
    },
    to:{
        id: string,
        entityType: string,
    },
    id:string,
    label:string,
    toName:string,
    type: "SITE" | "LOCAL",
    settings: {
        currency: string | null,
        rate: {
            energy: number,
            water: number,
            gas: number,
        },
        rateType: "FIXED" | "VARIABLE",
        units: {
            energy: string,
            water: string,
            gas: string,
        }
    }
}