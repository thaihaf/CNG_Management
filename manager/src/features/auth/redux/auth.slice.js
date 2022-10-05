import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
     AuthenticationDetails,
     CognitoUserPool,
     CognitoUser,
} from "amazon-cognito-identity-js";
import Cookies from "js-cookie";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { ENV } from "constants/env";
import { CODE_ERROR } from "constants/errors.constants";

import api from "../api/auth.api";

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

export const getTokenCognito = createAsyncThunk(
     "auth/getTokenCognito",
     async ({ authenticationData }, { rejectWithValue }) => {
          try {
               const authenticationDetails = new AuthenticationDetails(
                    authenticationData
               );
               const poolData = {
                    UserPoolId: ENV.COGNITO_USER_POOL_ID,
                    ClientId: ENV.COGNITO_CLIENT_ID,
               };
               const userPool = new CognitoUserPool(poolData);
               const userData = {
                    Username: authenticationData.Username,
                    Pool: userPool,
               };

               const cognitoUser = new CognitoUser(userData);

               const cognitoApi = new Promise((resolve, reject) => {
                    cognitoUser.authenticateUser(authenticationDetails, {
                         onSuccess: (result) => {
                              const accessToken = result
                                   .getAccessToken()
                                   .getJwtToken();
                              const refreshToken = result
                                   .getRefreshToken()
                                   .getToken();
                              Cookies.set("refreshToken", refreshToken, {
                                   secure: true,
                              });
                              resolve(accessToken);
                         },
                         onFailure: (err) => {
                              reject(err);
                         },
                    });
               });
               return await cognitoApi;
          } catch (error) {
               throw rejectWithValue(error);
          }
     }
);

export const logoutCognito = createAsyncThunk(
     "auth/getTokenCognito",
     async (userName, { rejectWithValue }) => {
          try {
               const poolData = {
                    UserPoolId: ENV.COGNITO_USER_POOL_ID,
                    ClientId: ENV.COGNITO_CLIENT_ID,
               };
               const userPool = new CognitoUserPool(poolData);
               const userData = {
                    Username: userName ?? "",
                    Pool: userPool,
               };

               const cognitoUser = new CognitoUser(userData);
               return await cognitoUser.signOut();
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
};

const authSlice = createSlice({
     name: "auth",
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
          builder.addCase(postLogin.fulfilled, (state) => {
               state.errorLogin = null;
               state.isSignedIn = true;
          });
          builder.addCase(postLogin.rejected, (state) => {
               state.errorLogin = CODE_ERROR.ERROR_LOGIN;
          });
          builder.addCase(getTokenCognito.fulfilled, (state) => {
               state.errorLogin = null;
          });
          builder.addCase(getTokenCognito.rejected, (state) => {
               state.errorLogin = CODE_ERROR.ERROR_LOGIN;
          });
     },
});

export const { updateAccessToken, updateError, updateUserName } =
     authSlice.actions;

const authConfig = {
     key: "auth",
     storage,
     whitelist: ["accessToken", "isSignedIn", "userName"],
};

export const LOCAL_STORAGE_AUTH_KEY = "persist:auth";

export const authReducer =
     persistReducer < AuthState > (authConfig, authSlice.reducer);
