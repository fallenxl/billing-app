import { ICustomerRelations } from "@/interfaces";
import { IUser } from "@/interfaces/user.interface";
import { create } from "zustand";
export interface branchState {
    branch: ICustomerRelations | null;
    setBranch: (branch: ICustomerRelations | null) => void;
    branchRelations: any[];
    setBranchRelations: (branchRelations: any[]) => void;
}

export const useBranchStore = create<branchState>((set, get) => ({
    branch: null,
    setBranch: (branch: ICustomerRelations | null) => set({ branch }),
    branchRelations: [],
    setBranchRelations: (branchRelations: any[]) => set({ branchRelations }),
}));