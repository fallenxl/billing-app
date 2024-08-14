export interface IAsset {
    assetProfileId:{
        entityType:string,
        id:string,
    },
    id: {
        id: string,
        entityType: string,
    },
    label: string,
    name: string,
    img: string,
    currency: string,
    rate: {
        waterRate: number | null,
        energyRate: number | null,
        gasRate: number | null,
        airRate: number | null,
    }
}

export type AssetState = IAsset | null; 