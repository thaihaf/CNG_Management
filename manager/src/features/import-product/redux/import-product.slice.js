import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";

import api from "../api/import-product.api";
import { IMPORT_PRODUCT_KEY } from "../constants/import-product.key";

export const IMPORT_PRODUCT_FEATURE_KEY = IMPORT_PRODUCT_KEY;

export const getProductImportDetails = createAsyncThunk(
  "productImport/getProductImportDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getProductImportDetails(id);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const createProductImport = createAsyncThunk(
  "productImport/createProductImport",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.createProductImport(data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const updateProductImports = createAsyncThunk(
  "productImport/updateProductImports",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.updateProductImports(id, data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getAllProductImport = createAsyncThunk(
  "productImport/getAllProductImport",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllProductImport();
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

const initialState = {
  listAllProductImport: [],
  productsImport: [],
  listProductLv2: [],
  totalElements: 0,
  totalPages: 0,
  size: 0,
  productImportDetails: null,
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
    [getAllProductImport.fulfilled]: (state, action) => {
      state.listAllProductImport = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.totalPages = action.payload.totalPages;
      state.size = action.payload.size;
    },
    [getProductImportDetails.fulfilled]: (state, action) => {
      state.productImportDetails = action.payload;
    },
    ["LOGOUT"]: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { updateProductImport, updateListProductLv2 } =
  importProductSlice.actions;

export const importProductReducer = importProductSlice.reducer;
