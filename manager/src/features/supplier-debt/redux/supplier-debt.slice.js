import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";

import api from "../api/supplier-debt.api";
import { SUPPLIER_DEBT_KEY } from "../constants/supplier-debt.key";

export const SUPPLIER_DEBT_FEATURE_KEY = SUPPLIER_DEBT_KEY;

export const getSupplierDebts = createAsyncThunk(
  "product/getSupplierDebts",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await api.getSupplierDebts(startDate, endDate);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getSupplierDebtDetails = createAsyncThunk(
  "product/getSupplierDebtDetails",
  async ({ id, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await api.getSupplierDebtDetails(id, startDate, endDate);
      return response.data;
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
  supplierDebtDetails: null,
  listDebtMoney: [],
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
      state.listSupplierDebt = action.payload.managementDebtMoneyDTOList;
      state.totalElements = action.payload.managementDebtMoneyDTOList.length;
    },
    [getSupplierDebtDetails.fulfilled]: (state, action) => {
      console.log(action.payload);
      state.supplierDebtDetails = action.payload;
      state.listDebtMoney = action.payload.managementDebtMoneyDetailDTOList;
    },
    ["LOGOUT"]: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { updateProductDetails } = supplierDebtSlice.actions;

export const supplierDebtReducer = supplierDebtSlice.reducer;
