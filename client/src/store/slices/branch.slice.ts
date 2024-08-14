import { createSlice } from "@reduxjs/toolkit";
import { BranchState } from "../../interfaces/branch/branch.interface";

const initialState:BranchState = null;
const branchSlice = createSlice({
    name: "branch",
    initialState,
    reducers: {
        setBranch: (state, action) => {
            state = action.payload;
            return state;
        },
    },
});

export const { setBranch } = branchSlice.actions;
export default branchSlice;