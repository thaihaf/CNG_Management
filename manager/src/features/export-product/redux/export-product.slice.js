import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";

import api from "../api/export-product.api";
import { EXPORT_PRODUCT_KEY } from "../constants/export-product.key";

export const EXPORT_PRODUCT_FEATURE_KEY = EXPORT_PRODUCT_KEY;

export const getProductExportDetails = createAsyncThunk(
  "productExport/getProductExportDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getProductExportDetails(id);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const createProductExport = createAsyncThunk(
  "productExport/createProductExport",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.createProductExport(data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const updateProductExports = createAsyncThunk(
  "productExport/updateProductExports",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.updateProductExports(id, data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getAllProductExport = createAsyncThunk(
  "productExport/getAllProductExport",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getAllProductExport(params);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const deleteProductExport = createAsyncThunk(
  "productExport/deleteProductExport",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.deleteProductExport(id);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const deleteProductExportDetail = createAsyncThunk(
  "productExport/deleteProductExportDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.deleteProductExportDetail(id);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const deleteProductExportDetailWarehouse = createAsyncThunk(
  "productExport/deleteProductExportDetailWarehouse",
  async (warehouse, { rejectWithValue }) => {
    console.log(warehouse);
    try {
      const response = await api.deleteProductExportDetailWarehouse(warehouse);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

const initialState = {
  listAllProductExport: [],
  productsExport: [],
  listProductLv2: [],
  totalElements: 0,
  page: 0,
  size: 0,
  productExportDetails: null,
};

const exportProductSlice = createSlice({
  name: EXPORT_PRODUCT_FEATURE_KEY,
  initialState,
  reducers: {
    updateProductExport: (state, action) => {
      state.productsExport = action.payload;
    },
    updateListProductLv2: (state, action) => {
      state.listProductLv2 = action.payload;
    },
    clearProductExport: (state, action) => {
      state.productsExport = [];
      state.listProductLv2 = [];
      state.productExportDetails = null;
    },
  },
  extraReducers: {
    [getAllProductExport.fulfilled]: (state, action) => {
      state.listAllProductExport = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.page = action.payload.number + 1;
      state.size = action.payload.size;
    },
    [getProductExportDetails.fulfilled]: (state, action) => {
      let newProductExport = action.payload.exportProductDetailDTOS.map(
        (item, index) => {
          return { ...item, index: index + 1 };
        }
      );
      state.productExportDetails = action.payload;
      state.productsExport = newProductExport;
    },
    ["LOGOUT"]: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  updateProductExport,
  updateListProductLv2,
  clearProductExport,
} = exportProductSlice.actions;

export const exportProductReducer = exportProductSlice.reducer;
