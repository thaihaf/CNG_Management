import { createSlice } from "@reduxjs/toolkit";
import { PERMISSIONS_KEY } from "../contansts/permissions.key";

export const PERMISSIONS_FEATURE_KEY = PERMISSIONS_KEY;

const initialState = {
  permissions: [],
};

const permissionsSlice = createSlice({
  name: PERMISSIONS_FEATURE_KEY,
  initialState,
  reducers: {
    setPermissions: (state, action) => {
      state.permissions = action.payload ?? [];
    },
    clearPermissions: state => {
      state.permissions = [];
    },
  },
});

export const { setPermissions, clearPermissions } = permissionsSlice.actions;

export const permissionsReducer = permissionsSlice.reducer;