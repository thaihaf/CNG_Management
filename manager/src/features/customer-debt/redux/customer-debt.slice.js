import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";

import api from "../api/customer-debt.api";
import { CUSTOMER_DEBT_KEY } from "../constants/customer-debt.key";

export const CUSTOMER_DEBT_FEATURE_KEY = CUSTOMER_DEBT_KEY;

export const getCustomerDebts = createAsyncThunk(
  "product/getCustomerDebts",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await api.getCustomerDebts(startDate, endDate);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getCustomerDebtDetails = createAsyncThunk(
  "product/getCustomerDebtDetails",
  async ({ id, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await api.getCustomerDebtDetails(id, startDate, endDate);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

const initialState = {
  listCustomerDebt: [],
  totalElements: 0,
  totalPages: 0,
  size: 0,
  errorProcess: "",
  customerDebtDetails: null,
  listDebtMoney : []
};

const customerDebtSlice = createSlice({
  name: CUSTOMER_DEBT_FEATURE_KEY,
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
    [getCustomerDebts.fulfilled]: (state, action) => {
      state.listCustomerDebt = action.payload.managementDebtMoneyDTOList;
      state.totalElements = action.payload.managementDebtMoneyDTOList.length;
    },
    [getCustomerDebtDetails.fulfilled]: (state, action) => {
      state.customerDebtDetails = action.payload;
      state.listDebtMoney = action.payload.managementDebtMoneyDetailDTOList;
    },
    ["LOGOUT"]: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { updateProductDetails } = customerDebtSlice.actions;

export const customerDebtReducer = customerDebtSlice.reducer;
