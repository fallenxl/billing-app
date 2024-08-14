export interface ICustomer {
    id: {
        id: string,
        entityType: string,
    },
    label: string,
    name: string,
    img: string,
    currency: string,
    rate: {
        water: {
            rate: number | null,
            unit: string,
        },
        hotWater: {
            rate: number | null,
            unit: string,
        },
        energy: {
            rate: number | null,
            unit: string,
        },
        gas: {
            rate: number | null,
            unit: string,
        },
        air: {
            rate: number | null,
            unit: string,
        },
    }|null,
}

export type CustomerState = ICustomer | null;