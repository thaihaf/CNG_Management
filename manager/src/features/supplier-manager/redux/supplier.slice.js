import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";
import { SUPPLIER_KEY } from "../constants/supplier.key";

import api from "../api/supplier.api";

export const SUPPLIER_FEATURE_KEY = SUPPLIER_KEY;

export const getSuppliers = createAsyncThunk(
  "supplier/getSupplier",
  async () => {
    const response = await api.getSuppliers();
    console.log(response);
    return response.data;
  }
);
export const getSupplierDetails = createAsyncThunk(
  "supplier/getSupplierDetails",
  async (id) => {
    const response = await api.getSupplierDetails(id);
    return response.data;
  }
);

const initialState = {
  listSuppliers: [],
  totalElements: 0,
  totalPages: 0,
  size: 0,
  dataDetails: null,
  errorProcess: "",
};

const supplierSlice = createSlice({
  name: SUPPLIER_FEATURE_KEY,
  initialState,
  reducers: {},
  extraReducers: {
    [getSuppliers.fulfilled]: (state, action) => {
      state.listSuppliers = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.totalPages = action.payload.totalPages;
      state.size = action.payload.size;
    },
    [getSupplierDetails.fulfilled]: (state, action) => {
      state.dataDetails = action.payload;
      state.errorProcess = "";
    },
    [getSupplierDetails.rejected]: (state, action) => {
      state.dataDetails = null;
    },
  },
});
export const { setSuppliers, clearSuppliers } = supplierSlice.actions;

export const supplierReducer = supplierSlice.reducer;
