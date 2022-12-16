import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../api/dashboard.api";
import { DASHBOARD_KEY } from "../constants/dashboard.key";

export const DASHBOARD_FEATURE_KEY = DASHBOARD_KEY;

// daily report
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

// dashboard
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

//inventory
export const getProductInventory = createAsyncThunk(
  "product/getProductInventory",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getProductInventory(params);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getCategoryInventory = createAsyncThunk(
  "product/getCategoryInventory",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getCategoryInventory(params);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getSupplierInventory = createAsyncThunk(
  "product/getSupplierInventory",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getSupplierInventory(params);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getWarehouseInventory = createAsyncThunk(
  "product/getWarehouseInventory",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getWarehouseInventory(params);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
//profit
export const getProductProfit = createAsyncThunk(
  "product/getProductProfit",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getProductProfit(params);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getCustomerProfit = createAsyncThunk(
  "product/getCustomerProfit",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getCustomerProfit(params);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getEmployeeProfit = createAsyncThunk(
  "product/getEmployeeProfit",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getEmployeeProfit(params);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getSupplierProfit = createAsyncThunk(
  "product/getSupplierProfit",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getSupplierProfit(params);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getCategoryProfit = createAsyncThunk(
  "product/getCategoryProfit",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getCategoryProfit(params);
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
  // dashboard
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
  // inventory
  productInventory: {
    listProductInventory: [],
    totalElements: 0,
    number: 0,
    size: 0,
  },
  categoryInventory: {
    listCategoryInventory: [],
    totalElements: 0,
    number: 0,
    size: 0,
  },
  supplierInventory: {
    listSupplierInventory: [],
    totalElements: 0,
    number: 0,
    size: 0,
  },
  warehouseInventory: {
    listWarehouseInventory: [],
    totalElements: 0,
    number: 0,
    size: 0,
  },
  // profit
  productProfit: {
    listProductProfit: [],
    totalElements: 0,
    number: 0,
    size: 0,
  },
  customerProfit: {
    listCustomerProfit: [],
    totalElements: 0,
    number: 0,
    size: 0,
  },
  employeeProfit: {
    listEmployeeProfit: [],
    totalElements: 0,
    number: 0,
    size: 0,
  },
  supplierProfit: {
    listSupplierProfit: [],
    totalElements: 0,
    number: 0,
    size: 0,
  },
  categoryProfit: {
    listCategoryProfit: [],
    totalElements: 0,
    number: 0,
    size: 0,
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
    // dashboard
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
    // inventory
    [getProductInventory.fulfilled]: (state, action) => {
      state.productInventory.listProductInventory = action.payload.content;
      state.productInventory.totalElements = action.payload.totalElements;
      state.productInventory.number = action.payload.number + 1;
      state.productInventory.size = action.payload.size;
    },
    [getCategoryInventory.fulfilled]: (state, action) => {
      state.categoryInventory.listCategoryInventory = action.payload.content;
      state.categoryInventory.totalElements = action.payload.totalElements;
      state.categoryInventory.number = action.payload.number + 1;
      state.categoryInventory.size = action.payload.size;
    },
    [getSupplierInventory.fulfilled]: (state, action) => {
      state.supplierInventory.listSupplierInventory = action.payload.content;
      state.supplierInventory.totalElements = action.payload.totalElements;
      state.supplierInventory.number = action.payload.number + 1;
      state.supplierInventory.size = action.payload.size;
    },
    [getWarehouseInventory.fulfilled]: (state, action) => {
      state.warehouseInventory.listWarehouseInventory = action.payload.content;
      state.warehouseInventory.totalElements = action.payload.totalElements;
      state.warehouseInventory.number = action.payload.number + 1;
      state.warehouseInventory.size = action.payload.size;
    },
    // profit
    [getProductProfit.fulfilled]: (state, action) => {
      state.productProfit.listProductProfit = action.payload.content;
      state.productProfit.totalElements = action.payload.totalElements;
      state.productProfit.number = action.payload.number + 1;
      state.productProfit.size = action.payload.size;
    },
    [getCustomerProfit.fulfilled]: (state, action) => {
      state.customerProfit.listCustomerProfit = action.payload.content;
      state.customerProfit.totalElements = action.payload.totalElements;
      state.customerProfit.number = action.payload.number + 1;
      state.customerProfit.size = action.payload.size;
    },
    [getEmployeeProfit.fulfilled]: (state, action) => {
      state.employeeProfit.listEmployeeProfit = action.payload.content;
      state.employeeProfit.totalElements = action.payload.totalElements;
      state.employeeProfit.number = action.payload.number + 1;
      state.employeeProfit.size = action.payload.size;
    },
    [getSupplierProfit.fulfilled]: (state, action) => {
      state.supplierProfit.listSupplierProfit = action.payload.content;
      state.supplierProfit.totalElements = action.payload.totalElements;
      state.supplierProfit.number = action.payload.number + 1;
      state.supplierProfit.size = action.payload.size;
    },
    [getCategoryProfit.fulfilled]: (state, action) => {
      state.categoryProfit.listCategoryProfit = action.payload.content;
      state.categoryProfit.totalElements = action.payload.totalElements;
      state.categoryProfit.number = action.payload.number + 1;
      state.categoryProfit.size = action.payload.size;
    },
    ["LOGOUT"]: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { updateProductDetails } = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice.reducer;
