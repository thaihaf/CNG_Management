import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../api/dashboard.api";
import { DASHBOARD_KEY } from "../constants/dashboard.key";

export const DASHBOARD_FEATURE_KEY = DASHBOARD_KEY;

export const getDashboardCustomerDaily = createAsyncThunk(
  "product/getDashboardCustomerDaily",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await api.getDashboardCustomerDaily(startDate, endDate);
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
  listDashboardCustomerDaily: [],
  totalElements: 0,
  totalPages: 0,
  size: 0,
};

const dashboardSlice = createSlice({
  name: DASHBOARD_FEATURE_KEY,
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
    [getDashboardCustomerDaily.fulfilled]: (state, action) => {
      state.listDashboardCustomerDaily = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.totalPages = action.payload.totalPages;
      state.size = action.payload.size;
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

export const { updateProductDetails } = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice.reducer;
