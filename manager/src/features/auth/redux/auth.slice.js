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
      throw rejectWithValue(error?.response?.data);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.changePassword(data);
      return response;
    } catch (error) {
      throw rejectWithValue(error?.response?.data);
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.forgotPassword(data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error?.response?.data);
    }
  }
);
export const verifyCode = createAsyncThunk(
  "auth/verifyCode",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.verifyCode(data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error?.response?.data);
    }
  }
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.resetPassword(data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error?.response?.data);
    }
  }
);

export const getAccountEmail = createAsyncThunk(
  "auth/getAccountEmail",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAccountEmail();
      return response.data;
    } catch (error) {
      throw rejectWithValue(error?.response?.data);
    }
  }
);
export const getAccountAvatar = createAsyncThunk(
  "auth/getAccountAvatar",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAccountAvatar();
      return response.data;
    } catch (error) {
      console.log(error);
      throw rejectWithValue(error?.response?.data);
    }
  }
);

const initialState = {
  accessToken: "",
  errorLogin: "",
  isSignedIn: false,
  userName: null,
  email: null,
  avatar: null,
  role: null,
  id: null,
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
    updateAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    postLogout: () => initialState,
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
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      console.log(action.payload);
    });
    builder.addCase(getAccountEmail.fulfilled, (state, action) => {
      state.email = action.payload.email;
    });
    builder.addCase(getAccountAvatar.fulfilled, (state, action) => {
      state.avatar = action.payload.filePath;
    });
    builder.addCase("LOGOUT", (state) => {
      Object.assign(state, initialState);
    });
  },
});

export const {
  updateAccessToken,
  updateError,
  updateUserName,
  postLogout,
  updateAvatar,
} = authenSlice.actions;

const authConfig = {
  key: "auth",
  storage,
  whitelist: ["accessToken", "isSignedIn", "userName", "role", "id"],
};

export const LOCAL_STORAGE_AUTH_KEY = "persist:auth";

export const authReducer = persistReducer(authConfig, authenSlice.reducer);