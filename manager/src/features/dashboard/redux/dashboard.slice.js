import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../api/dashboard.api";
import { DASHBOARD_KEY } from "../constants/dashboard.key";

export const DASHBOARD_FEATURE_KEY = DASHBOARD_KEY;

export const getDashboardCustomerDaily = createAsyncThunk(
  "product/getDashboardCustomerDaily",
  async ({ startDate, endDate, customer, employee }, { rejectWithValue }) => {
    try {
      const response = await api.getDashboardCustomerDaily(
        startDate,
        endDate,
        customer,
        employee
      );
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getDashBoardByDay = createAsyncThunk(
  "product/getDashBoardByDay",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await api.getDashBoardByDay(month, year);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getDashBoardByMonth = createAsyncThunk(
  "product/getDashBoardByMonth",
  async (year, { rejectWithValue }) => {
    try {
      const response = await api.getDashBoardByMonth(year);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getDashBoardByYear = createAsyncThunk(
  "product/getDashBoardByYear",
  async ({ startYear, endYear }, { rejectWithValue }) => {
    try {
      const response = await api.getDashBoardByYear(startYear, endYear);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

const initialState = {
  dailyReport: {
    listDailyReport: [],
    totalElements: 0,
    totalPages: 0,
    size: 0,
  },
  dashboardByDay: {
    listDashboardByDay: [],
    totalElements: 0,
    totalPages: 0,
    size: 0,
    month: null,
    year: null,
  },
  dashboardByMonth: {
    listDashboardByMonth: [],
    totalElements: 0,
    totalPages: 0,
    size: 0,
    year2: null,
  },
  dashboardByYear: {
    listDashboardByYear: [],
    totalElements: 0,
    totalPages: 0,
    size: 0,
    startYear: null,
    endYear: null,
  },
};

const dashboardSlice = createSlice({
  name: DASHBOARD_FEATURE_KEY,
  initialState,
  reducers: {},
  extraReducers: {
    [getDashboardCustomerDaily.fulfilled]: (state, action) => {
      state.dailyReport.listDailyReport = action.payload.content;
      state.dailyReport.totalElements = action.payload.totalElements;
      state.dailyReport.totalPages = action.payload.totalPages;
      state.dailyReport.size = action.payload.size;
    },
    [getDashBoardByDay.fulfilled]: (state, action) => {
      state.dashboardByDay.listDashboardByDay = action.payload.content;
      state.dashboardByDay.totalElements = action.payload.totalElements;
      state.dashboardByDay.totalPages = action.payload.totalPages;
      state.dashboardByDay.size = action.payload.size;
      state.dashboardByDay.month = action.payload.content[0].month;
      state.dashboardByDay.year = action.payload.content[0].year;
    },
    [getDashBoardByMonth.fulfilled]: (state, action) => {
      state.dashboardByMonth.listDashboardByMonth = action.payload.content;
      state.dashboardByMonth.totalElements = action.payload.totalElements;
      state.dashboardByMonth.totalPages = action.payload.totalPages;
      state.dashboardByMonth.size = action.payload.size;
      state.dashboardByMonth.year2 = action.payload.content[0].year;
    },
    [getDashBoardByYear.fulfilled]: (state, action) => {
      const arr = action.payload.content;

      state.dashboardByYear.listDashboardByYear = arr;
      state.dashboardByYear.totalElements = action.payload.totalElements;
      state.dashboardByYear.totalPages = action.payload.totalPages;
      state.dashboardByYear.size = action.payload.size;
      state.dashboardByYear.startYear = arr[0].year;
      state.dashboardByYear.endYear = arr[arr.length - 1].year;
    },

    ["LOGOUT"]: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { updateProductDetails } = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice.reducer;
