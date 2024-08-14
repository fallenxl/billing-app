import { createSlice } from "@reduxjs/toolkit";
import { IAsset } from "../../interfaces/asset/asset.interface";

const initialState:IAsset | null = null;

const assetSlice = createSlice({
    name: "asset",
    initialState,
    reducers: {
        setAsset: (state, action) => {
            state = action.payload;
            return state;
        },
    },
});


export const { setAsset } = assetSlice.actions;
export default assetSlice;