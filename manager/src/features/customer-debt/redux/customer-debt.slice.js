import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";

import api from "../api/customer-debt.api";
import { CUSTOMER_DEBT_KEY } from "../constants/customer-debt.key";

export const CUSTOMER_DEBT_FEATURE_KEY = CUSTOMER_DEBT_KEY;

export const getCustomerDebts = createAsyncThunk(
  "product/getCustomerDebts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getCustomerDebts(params);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getCustomerDebtDetails = createAsyncThunk(
  "product/getCustomerDebtDetails",
  async ({id, params}, { rejectWithValue }) => {
    try {
      const response = await api.getCustomerDebtDetails(id, params);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

const initialState = {
  listCustomerDebt: [],
  totalElements: 0,
  page: 0,
  size: 0,
  errorProcess: "",
  customerDebtDetails: null,
  debtMoney: {
    listDebtMoney: [],
    totalElements: 0,
    page: 0,
    size: 0,
  },
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
      state.listCustomerDebt = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.page = action.payload.number + 1;
      state.size = action.payload.size;
    },
    [getCustomerDebtDetails.fulfilled]: (state, action) => {
      const debtMoneyOb = action.payload.managementDebtMoneyDetailDTOList;

      state.customerDebtDetails = action.payload;
      state.debtMoney.listDebtMoney = debtMoneyOb.content;
      state.debtMoney.totalElements = debtMoneyOb.totalElements;
      state.debtMoney.page = debtMoneyOb.number + 1;
      state.debtMoney.size = debtMoneyOb.size;
    },
    ["LOGOUT"]: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { updateProductDetails } = customerDebtSlice.actions;

export const customerDebtReducer = customerDebtSlice.reducer;
