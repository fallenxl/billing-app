export interface IBranch {
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
    type: "SITE" | "LOCAL",
    address:string,
    phone: string,
    email: string,
    settings: {
        currency: string,
        rate: {
            energy: number,
            water: number,
            gas: number,
            air: number,
        },
        units: {
            energy: string,
            water: string,
            gas: string,
            air: string,
        },
        templates: {
            pdf: string,
            excel: string,
            support: string,
        }
    }
}


export interface IBranchSettings {
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
    currency: string,
    rate: {
        energy: number,
        water: number,
        gas: number,
        air: number,
    },
    units: {
        energy: string,
        water: string,
        gas: string,
        air: string,
    },
    templates: {
        pdf: string,
        excel: string,
        support: string,
    }
}

