import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";
import { PROVINCES_KEY } from "../constants/provinces.key";

import api from "../api/provinces.api";

export const PROVINCES_FEATURE_KEY = PROVINCES_KEY;

export const getProvinces = createAsyncThunk(
     "provinces/getProvinces",
     async () => {
          const response = await api.getProvinces();
          return response;
     }
);
export const getProvince = createAsyncThunk(
     "provinces/getProvince",
     async (value) => {
          const response = await api.getProvince(value);
          return response;
     }
);
export const getDistrict = createAsyncThunk(
     "provinces/getDistrict",
     async (value) => {
          const response = await api.getDistrict(value);
          return response;
     }
);

const initialState = {
     provinces: [],
     districts: [],
     wards: [],
};

const provincesSlice = createSlice({
     name: PROVINCES_FEATURE_KEY,
     initialState,
     reducers: {},
     extraReducers: {
          [getProvinces.fulfilled]: (state, action) => {
               state.provinces = action.payload;
          },
          [getProvince.fulfilled]: (state, action) => {
               console.log(action.payload.districts);
               state.districts = action.payload.districts;
          },
          [getDistrict.fulfilled]: (state, action) => {
               state.wards = action.payload.wards;
          },
          ["LOGOUT"]: (state) => {
               Object.assign(state, initialState);
          },
     },
});

export const provincesReducer = provincesSlice.reducer;
