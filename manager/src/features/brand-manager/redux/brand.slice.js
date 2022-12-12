import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";
import { BRAND_KEY } from "../constants/brand.key";

import api from "../api/brand.api";

export const BRANDS_FEATURE_KEY = BRAND_KEY;

export const getBrands = createAsyncThunk(
  "brand/getBrands",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getBrands(params);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getBrandDetails = createAsyncThunk(
  "brand/getBrandDetails",
  async (id) => {
    const response = await api.getBrandDetails(id);
    return response.data;
  }
);

export const updateDetails = createAsyncThunk(
  "brand/updateDetails",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.updateDetails(id, data);
      return response;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const deleteBrand = createAsyncThunk(
  "brand/deleteBrand",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.deleteBrand(id);
      return response;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const deleteBrands = createAsyncThunk(
  "brand/deleteBrands",
  async (list, { rejectWithValue }) => {
    try {
      list.forEach(async (id) => {
        await api.deleteBrand(id);
      });
      return true;
    } catch (error) {
      console.log(error);
      throw rejectWithValue(error);
    }
  }
);

export const createDetails = createAsyncThunk(
  "brand/createDetails",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.createDetails(data);
      return response;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

const initialState = {
  listBrands: [],
  totalElements: 0,
  number: 0,
  size: 0,
  dataDetails: null,
  errorProcess: "",
  createMode: false,
};

const brandSlice = createSlice({
  name: BRANDS_FEATURE_KEY,
  initialState,
  reducers: {
    updateErrorProcess: (state, action) => {
      state.errorProcess = action.payload;
    },
  },
  extraReducers: {
    [getBrands.fulfilled]: (state, action) => {
      state.listBrands = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.number = action.payload.number + 1;
      state.size = action.payload.size;
    },
    [getBrandDetails.fulfilled]: (state, action) => {
      state.dataDetails = action.payload;
      state.errorProcess = "";
      state.createMode = false;
    },
    [getBrandDetails.rejected]: (state, action) => {
      state.createMode = true;
    },
    [createDetails.fulfilled]: (state, action) => {
      state.createMode = false;
    },
    ["LOGOUT"]: (state) => {
      Object.assign(state, initialState);
    },
  },
});
export const { updateErrorProcess, updateDataDetails } = brandSlice.actions;

export const brandsReducer = brandSlice.reducer;
