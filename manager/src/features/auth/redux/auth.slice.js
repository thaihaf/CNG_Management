import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { AUTHEN_ACCESS_TOKEN } from "../constants/auth.keys";
import { CODE_ERROR } from "constants/errors.constants";
import api from "../api/auth.api";

export const AUTHEN_FEATURE_KEY = AUTHEN_ACCESS_TOKEN;

export const postLogin = createAsyncThunk(
     "auth/postLogin",
     async ({ data }, { rejectWithValue }) => {
          try {
               const response = await api.loginApi(data);
               return response.data;
          } catch (error) {
               throw rejectWithValue(error);
          }
     }
);

const initialState = {
     accessToken: "",
     errorLogin: "",
     isSignedIn: false,
     userName: null,
     role: null,
		 id : null
};

const authenSlice = createSlice({
     name: AUTHEN_FEATURE_KEY,
     initialState,
     reducers: {
          updateAccessToken: (state, action) => {
               state.accessToken = action.payload;
          },
          updateError: (state, action) => {
               state.errorLogin = action.payload;
          },
          updateUserName: (state, action) => {
               state.userName = action.payload;
          },
     },
     extraReducers: (builder) => {
          builder.addCase(postLogin.fulfilled, (state, action) => {
               state.errorLogin = null;
               state.isSignedIn = true;
               state.accessToken = action.payload.token;
               state.userName = action.payload.username;
               state.id = action.payload.id;
               const roleAPI = action.payload.role;
               state.role = roleAPI
                    .substring(1, roleAPI.length - 1)
                    .split("_")[1]
                    .toLowerCase();
          });
          builder.addCase(postLogin.rejected, (state, action) => {
               state.errorLogin = CODE_ERROR.ERROR_LOGIN;
               state.isSignedIn = false;
               state.accessToken = "";
          });
     },
});

export const { updateAccessToken, updateError, updateUserName } =
     authenSlice.actions;

const authConfig = {
     key: "auth",
     storage,
     whitelist: ["accessToken", "isSignedIn", "userName", "role", "id"],
};

export const LOCAL_STORAGE_AUTH_KEY = "persist:auth";

export const authReducer = persistReducer(authConfig, authenSlice.reducer);
