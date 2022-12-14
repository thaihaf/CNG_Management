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
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getAllProductImport(params);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const deleteProductImport = createAsyncThunk(
  "productImport/deleteProductImport",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.deleteProductImport(id);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const deleteProductImportDetail = createAsyncThunk(
  "productImport/deleteProductImportDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.deleteProductImportDetail(id);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const deleteProductImportDetailWarehouse = createAsyncThunk(
  "productImport/deleteProductImportDetailWarehouse",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.deleteProductImportDetailWarehouse(id);
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
  dataSearch : [],
  totalElements: 0,
  page: 0,
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
    updateDataSearch: (state, action) => {
      state.dataSearch = action.payload;
    },
    clearProductImport: (state, action) => {
      state.productsImport = [];
      state.listProductLv2 = [];
      state.productImportDetails = null;
      state.dataSearch = [];
    },
  },
  extraReducers: {
    [getAllProductImport.fulfilled]: (state, action) => {
      state.listAllProductImport = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.page = action.payload.number + 1;
      state.size = action.payload.size;
    },
    [getProductImportDetails.fulfilled]: (state, action) => {
      let newProductImport = action.payload.importProductDetailDTOS.map(
        (item, index) => {
          return { ...item, index: index + 1 };
        }
      );
      state.productImportDetails = action.payload;
      state.productsImport = newProductImport;
    },
    ["LOGOUT"]: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  updateProductImport,
  updateListProductLv2,
  clearProductImport,
  updateDataSearch,
} = importProductSlice.actions;

export const importProductReducer = importProductSlice.reducer;
