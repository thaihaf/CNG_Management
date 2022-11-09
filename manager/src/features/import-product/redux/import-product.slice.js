import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";
import { IMPORT_PRODUCT_KEY } from "../constants/import-product.key";

import api from "../api/import-product.api";

export const IMPORT_PRODUCT_FEATURE_KEY = IMPORT_PRODUCT_KEY;

export const createProductImport = createAsyncThunk(
  "product/createProductImport",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.createProductImport(data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

const initialState = {
  productsImport: [],
  listProductLv2: [],
};

const importProductSlice = createSlice({
  name: IMPORT_PRODUCT_FEATURE_KEY,
  initialState,
  reducers: {
    updateProductImport: (state, action) => {
      state.productsImport = action.payload;
    },
    updateListProductLv2: (state, action) => {
      state.listProductLv2 = action.payload;
    },
  },
  extraReducers: {
    // [getProducts.fulfilled]: (state, action) => {
    //   state.listProducts = action.payload.content;
    // },
    ["LOGOUT"]: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  updateProductImport,
  updateListProductLv2,
  updateListProductLv3,
} = importProductSlice.actions;

export const importProductReducer = importProductSlice.reducer;
