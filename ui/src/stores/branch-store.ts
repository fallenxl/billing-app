import { IBranch } from "@/interfaces";
import { ILocal } from "@/interfaces/local.interface";
import { create } from "zustand";
export interface branchState {
    branch: IBranch | null;
    setBranch: (branch: IBranch | null) => void;
    branchRelations: ILocal[],
    setBranchRelations: (branchRelations: ILocal[]) => void;
    updateBranch: (branch: IBranch) => void;
}

export const useBranchStore = create<branchState>((set, get) => ({
    branch: null,
    setBranch: (branch: IBranch | null) => set({ branch }),
    branchRelations: [] ,
    setBranchRelations: (branchRelations: ILocal[]) => set({ branchRelations }),
    updateBranch: (branch: IBranch) => {
        const branchState = get().branch;
        if (branchState) {
            set({
                branch: {
                    ...branchState,
                    ...branch,
                },
            });
        }
    }
}));