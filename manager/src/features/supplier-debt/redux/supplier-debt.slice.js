import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";
import { SUPPLIER_DEBT_KEY } from "../constants/supplier-debt.key";

import api from "../api/supplier-debt.api";

export const SUPPLIER_DEBT_FEATURE_KEY = SUPPLIER_DEBT_KEY;

export const getSupplierDebts = createAsyncThunk(
  "product/getSupplierDebts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getSupplierDebts();
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getSupplierDebtDetails = createAsyncThunk(
  "product/getSupplierDebtDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getSupplierDebtDetails(id);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const createSupplierDebts = createAsyncThunk(
  "product/createSupplierDebts",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.createSupplierDebts(data);
      return response;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const updateSupplierDebts = createAsyncThunk(
  "product/updateSupplierDebts",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.updateSupplierDebts(id, data);
      return response;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

const initialState = {
  listSupplierDebt: [],
  totalElements: 0,
  totalPages: 0,
  size: 0,
  errorProcess: "",
  productDetails: null,
  supplierDebtDetails: [],
};

const supplierDebtSlice = createSlice({
  name: SUPPLIER_DEBT_FEATURE_KEY,
  initialState,
  reducers: {
    // updateErrorProcess: (state, action) => {
    //   state.errorProcess = action.payload;
    // },
    // updateProductDetails: (state, action) => {
    //   state.detailDTOList = action.payload;
    // },
  },
  extraReducers: {
    [getSupplierDebts.fulfilled]: (state, action) => {
      state.listSupplierDebt = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.totalPages = action.payload.totalPages;
      state.size = action.payload.size;
    },
    [getSupplierDebtDetails.fulfilled]: (state, action) => {
      state.supplierDebtDetails = action.payload;
    },
    },
    ["LOGOUT"]: (state) => {
      Object.assign(state, initialState);
    },
});

export const { updateProductDetails } = supplierDebtSlice.actions;

export const supplierDebtReducer = supplierDebtSlice.reducer;
