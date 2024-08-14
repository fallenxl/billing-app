import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    isLoading: false,
    message: "",
    progress: 0,
}
const isLoadingSlice = createSlice({
    name: "isLoading",
    initialState,
    reducers: {
        setIsLoading: (_state, action) => action.payload,
    },
});

export const { setIsLoading } = isLoadingSlice.actions;
export default isLoadingSlice.reducer;