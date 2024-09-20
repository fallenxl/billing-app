export interface IBranch {
    to: {
        id: string,
        entityType: string,
    },
    from: {
        id: string,
        entityType: string, 
    },
    id: string,
    toName: string,
    settings: {
        currency: string,
        units: {
            water: string | null,
            energy: string | null,
            gas: string | null,
            air: string | null,
        },
        rate: {
            water: number | null,
            energy: number | null,
            gas: number | null,
            air: number | null,
            hotWater: number | null,
        },
        rateType: string,
        eneeTariff: string,
        
    }
    
}

export type BranchState = IBranch | null;