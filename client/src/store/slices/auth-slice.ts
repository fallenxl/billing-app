import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "../../interfaces/auth/auth";



const initialState:AuthState = {
    isAuthenticated : true,
    user: null
}
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        }
    }
});


export const { login, logout } = authSlice.actions;
export default authSlice.reducer;