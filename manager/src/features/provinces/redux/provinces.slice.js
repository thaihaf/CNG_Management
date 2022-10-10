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
     async () => {
          const response = await api.getProvince();
          return response;
     }
);
export const getDistrict = createAsyncThunk(
     "provinces/getDistrict",
     async () => {
          const response = await api.getDistrict();
          return response;
     }
);

const initialState = {
     provinces : [],
		 districts : [],
		 wards : [],
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
               state.districts = action.payload;
          },
          [getDistrict.fulfilled]: (state, action) => {
               state.wards = action.payload;
          },
     },
});

export const provincesReducer = provincesSlice.reducer;
