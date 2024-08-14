import { createSlice } from "@reduxjs/toolkit";
import { CustomerState } from "../../interfaces/customer/customer.interface";
const initialState:CustomerState = null;
const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {
        setCustomer: (state, action) => {
            state = action.payload;
            return state;
        },
    },
});

export const { setCustomer } = customerSlice.actions;
export default customerSlice;