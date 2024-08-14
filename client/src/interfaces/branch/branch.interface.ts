export interface IBranch {
    id: {
        id: string,
        entityType: string,
    },
    toName: string,
    
}

export type BranchState = IBranch | null;