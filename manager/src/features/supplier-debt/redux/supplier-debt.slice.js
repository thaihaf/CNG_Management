import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";
import { SUPPLIER_DEBT_KEY } from "../constants/supplier-debt.key";

import api from "../api/supplier-debt.api";

export const SUPPLIER_DEBT_FEATURE_KEY = SUPPLIER_DEBT_KEY;

export const getProducts = createAsyncThunk("product/getProducts", async () => {
  const response = await api.getProducts();
  return response.data;
});
export const getDetailsProduct = createAsyncThunk(
  "product/getDetailsProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getDetailsProduct(id);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.createProduct(data);
      return response;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.updateProduct(id, data);
      return response;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const searchProduct = createAsyncThunk(
  "product/searchProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.searchProduct(id);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const searchProductBySupplier = createAsyncThunk(
  "product/searchProductBySupplier",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.searchProductBySupplier(data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const createDetailsProduct = createAsyncThunk(
  "product/createDetailsProduct",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.createDetailsProduct(data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error.response.data.Error);
    }
  }
);
export const updateDetailsProduct = createAsyncThunk(
  "product/updateDetailsProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.updateDetailsProduct(id, data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error.response.data.Error);
    }
  }
);
export const deleteDetailsProduct = createAsyncThunk(
  "product/deleteDetailsProduct",
  async (id, { rejectWithValue }) => {
    try {
      console.log(id);
      const response = await api.deleteDetailsProduct(id);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error.response.data.Error);
    }
  }
);

const initialState = {
  listProducts: [],
  totalElements: 0,
  totalPages: 0,
  size: 0,
  errorProcess: "",
  productDetails: null,
  detailDTOList: [],
};

const supplierDebt = createSlice({
  name: SUPPLIER_DEBT_FEATURE_KEY,
  initialState,
  reducers: {
    updateErrorProcess: (state, action) => {
      state.errorProcess = action.payload;
    },
    updateProductDetails: (state, action) => {
      state.detailDTOList = action.payload;
    },
  },
  extraReducers: {
    [getProducts.fulfilled]: (state, action) => {
      state.listProducts = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.totalPages = action.payload.totalPages;
      state.size = action.payload.size;
    },
    [getDetailsProduct.fulfilled]: (state, action) => {
      state.productDetails = action.payload;
      state.detailDTOList = action.payload.productDetailDTO;
    },
    [createDetailsProduct.fulfilled]: (state, action) => {
      state.detailDTOList = [...state.detailDTOList, action.payload];
    },
    [updateDetailsProduct.fulfilled]: (state, action) => {
      state.detailDTOList = state.detailDTOList.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        } else {
          return item;
        }
      });
    },
    ["LOGOUT"]: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { updateProductDetails } = supplierDebt.actions;

export const supplierDebtReducer = supplierDebt.reducer;
