import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import type { RootState } from "../store";

// Define a type for the user slice state
interface UserState {
    token: string | null;
    isAuthenticated: boolean;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

// Initial state
const Access_token = localStorage.getItem("accessToken");

// Initial state without refresh token
const initialState: UserState = {
    token: Access_token || null,
    isAuthenticated: !!Access_token,
    status: "idle",
    error: null,
};

// Async action for signing in the user
export const signIn = createAsyncThunk(
    "user/signIn",
    async (
        userCredentials: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.post(
                "/account/login/",
                userCredentials
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || "Sign-in failed",
                status: error.response?.status || 500,
            });
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signOut: (state) => {
            localStorage.removeItem("accessToken");
            state.token = null;
            state.isAuthenticated = false;
            state.status = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle signIn
            .addCase(signIn.pending, (state) => {
                state.status = "loading";
            })
            .addCase(signIn.fulfilled, (state, action: PayloadAction<any>) => {
                console.log("Response Payload:", action.payload);

                const access = action.payload.tokens?.access;
                if (!access) {
                    console.error("Access token missing in payload");
                }

                localStorage.setItem("accessToken", access);
                state.token = access;
                state.isAuthenticated = true;
                state.status = "succeeded";
                state.error = null;
            })
            .addCase(signIn.rejected, (state, action: PayloadAction<any>) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { signOut } = userSlice.actions;

// Selectors
export const selectIsAuthenticated = (state: RootState) =>
    state.users.isAuthenticated;
export const selectToken = (state: RootState) => state.users.token;
export const selectUserStatus = (state: RootState) => state.users.status;
export const selectUserError = (state: RootState) => state.users.error;

export default userSlice.reducer;
