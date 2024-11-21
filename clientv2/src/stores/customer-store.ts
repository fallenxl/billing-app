import { ICustomer } from "@/interfaces";
import { create } from "zustand";
export interface customerState {
    customer: ICustomer | null;
    setCustomer: (customer: ICustomer | null) => void;
}

export const useCustomerStore = create<customerState>((set, get) => ({
    customer: null,
    setCustomer: (customer: ICustomer | null) => set({ customer }),

}));