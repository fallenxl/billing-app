import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/auth-slice";
import assetSlice from "./slices/asset.slice";
import customerSlice from "./slices/customer.slice";
import branchSlice from "./slices/branch.slice";
import isLoadingSlice from "./slices/is-loading.slice";
export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        asset: assetSlice.reducer,
        customer:customerSlice.reducer,
        branch:branchSlice.reducer,
        isLoading: isLoadingSlice,
    },
});