import { IBranch } from "@/interfaces";
import { create } from "zustand";
export interface branchState {
    branch: IBranch | null;
    setBranch: (branch: IBranch | null) => void;
    branchRelations: any[];
    setBranchRelations: (branchRelations: any[]) => void;
    updateBranch: (branch: IBranch) => void;
}

export const useBranchStore = create<branchState>((set, get) => ({
    branch: null,
    setBranch: (branch: IBranch | null) => set({ branch }),
    branchRelations: [],
    setBranchRelations: (branchRelations: any[]) => set({ branchRelations }),
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