import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../api/dashboard.api";
import { DASHBOARD_KEY } from "../constants/dashboard.key";

export const DASHBOARD_FEATURE_KEY = DASHBOARD_KEY;

// daily report
export const getDashboardCustomerDaily = createAsyncThunk(
  "dashboard/getDashboardCustomerDaily",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getDashboardCustomerDaily(params);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

// dashboard
export const getDashBoardByDay = createAsyncThunk(
  "dashboard/getDashBoardByDay",
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
  "dashboard/getDashBoardByMonth",
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
  "dashboard/getDashBoardByYear",
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
  "dashboard/getProductInventory",
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
  "dashboard/getCategoryInventory",
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
  "dashboard/getSupplierInventory",
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
  "dashboard/getWarehouseInventory",
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
  "dashboard/getProductProfit",
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
  "dashboard/getCustomerProfit",
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
  "dashboard/getEmployeeProfit",
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
  "dashboard/getSupplierProfit",
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
  "dashboard/getCategoryProfit",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getCategoryProfit(params);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

// dashboard real
export const getProfitDashBoardByDay = createAsyncThunk(
  "dashboard/getProfitDashBoardByDay",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await api.getDashBoardByDay(month, year);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getProfitDashBoardByMonth = createAsyncThunk(
  "dashboard/getProfitDashBoardByMonth",
  async (year, { rejectWithValue }) => {
    try {
      const response = await api.getDashBoardByMonth(year);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getProfitDashBoardByYear = createAsyncThunk(
  "dashboard/getProfitDashBoardByYear",
  async ({ startYear, endYear }, { rejectWithValue }) => {
    try {
      const response = await api.getDashBoardByYear(startYear, endYear);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getCustomerDebtDashboard = createAsyncThunk(
  "dashboard/getCustomerDebtDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getCustomerDebtDashboard();
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getSupplierDebtDashboard = createAsyncThunk(
  "dashboard/getSupplierDebtDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getSupplierDebtDashboard();
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getDashboardTotal = createAsyncThunk(
  "dashboard/getDashboardTotal",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getDashboardTotal();
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
    page: 0,
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
    page: 0,
    size: 0,
  },
  categoryInventory: {
    listCategoryInventory: [],
    totalElements: 0,
    page: 0,
    size: 0,
  },
  supplierInventory: {
    listSupplierInventory: [],
    totalElements: 0,
    page: 0,
    size: 0,
  },
  warehouseInventory: {
    listWarehouseInventory: [],
    totalElements: 0,
    page: 0,
    size: 0,
  },
  // profit
  productProfit: {
    listProductProfit: [],
    totalElements: 0,
    page: 0,
    size: 0,
  },
  customerProfit: {
    listCustomerProfit: [],
    totalElements: 0,
    page: 0,
    size: 0,
  },
  employeeProfit: {
    listEmployeeProfit: [],
    totalElements: 0,
    page: 0,
    size: 0,
  },
  supplierProfit: {
    listSupplierProfit: [],
    totalElements: 0,
    page: 0,
    size: 0,
  },
  categoryProfit: {
    listCategoryProfit: [],
    totalElements: 0,
    page: 0,
    size: 0,
  },
  dashboard: {
    profit: {
      series: [
        {
          name: "Profit",
          data: [],
        },
      ],
      options: {
        chart: {
          type: "area",
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        yaxis: {
          tickAmount: 3,
          floating: false,

          labels: {
            style: {
              colors: "#8e8da4",
            },
            offsetY: -7,
            offsetX: 0,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        fill: {
          opacity: 0.6,
        },
        tooltip: {
          x: {
            format: "yyyy",
          },
          fixed: {
            enabled: false,
            position: "topRight",
          },
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
          offsetX: -10,
        },
      },
    },
    customerDebt: {
      data: { totalDebt: 0, totalPayment: 0 },
      series: [0],
      listTable: [],
    },
    supplierDebt: {
      data: { totalDebt: 0, totalPayment: 0 },
      series: [0],
      listTable: [],
    },
    total: [],
  },
};

const dashboardSlice = createSlice({
  name: DASHBOARD_FEATURE_KEY,
  initialState,
  reducers: {},
  extraReducers: {
    //dashboard real
    [getSupplierDebtDashboard.fulfilled]: (state, action) => {
      const values = action.payload;
      let num = (values.totalPayment / values.totalDebt) * 100;

      state.dashboard.supplierDebt.data = action.payload;
      state.dashboard.supplierDebt.series = [Math.ceil(num * 100) / 100];
    },
    [getCustomerDebtDashboard.fulfilled]: (state, action) => {
      const values = action.payload;
      let num = (values.totalPayment / values.totalDebt) * 100;

      state.dashboard.customerDebt.data = action.payload;
      state.dashboard.customerDebt.series = [Math.ceil(num * 100) / 100];
    },
    [getDashboardTotal.fulfilled]: (state, action) => {
      let value = action.payload;
      let arrTemp = [];
      for (const key in value) {
        arrTemp.push({ key: key, value: value[key] });
      }

      state.dashboard.total = [...arrTemp];
    },
    [getProfitDashBoardByDay.fulfilled]: (state, action) => {
      const arr = action.payload.content;
      state.dashboard.profit.series[0].data = arr.map((item) => {
        return { x: `${item.day}`, y: item.revenue };
      });
    },
    [getProfitDashBoardByMonth.fulfilled]: (state, action) => {
      const arr = action.payload.content;
      state.dashboard.profit.series[0].data = arr.map((item) => {
        return { x: item.month, y: item.revenue };
      });
    },
    [getProfitDashBoardByYear.fulfilled]: (state, action) => {
      const arr = action.payload.content;
      state.dashboard.profit.series[0].data = arr.map((item) => {
        return { x: item.year, y: item.revenue };
      });
    },

    // daily
    [getDashboardCustomerDaily.fulfilled]: (state, action) => {
      state.dailyReport.listDailyReport = action.payload.content;
      state.dailyReport.totalElements = action.payload.totalElements;
      state.dailyReport.page = action.payload.number + 1;
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
      state.productInventory.page = action.payload.number + 1;
      state.productInventory.size = action.payload.size;
    },
    [getCategoryInventory.fulfilled]: (state, action) => {
      state.categoryInventory.listCategoryInventory = action.payload.content;
      state.categoryInventory.totalElements = action.payload.totalElements;
      state.categoryInventory.page = action.payload.number + 1;
      state.categoryInventory.size = action.payload.size;
    },
    [getSupplierInventory.fulfilled]: (state, action) => {
      state.supplierInventory.listSupplierInventory = action.payload.content;
      state.supplierInventory.totalElements = action.payload.totalElements;
      state.supplierInventory.page = action.payload.number + 1;
      state.supplierInventory.size = action.payload.size;
    },
    [getWarehouseInventory.fulfilled]: (state, action) => {
      state.warehouseInventory.listWarehouseInventory = action.payload.content;
      state.warehouseInventory.totalElements = action.payload.totalElements;
      state.warehouseInventory.page = action.payload.number + 1;
      state.warehouseInventory.size = action.payload.size;
    },
    // profit
    [getProductProfit.fulfilled]: (state, action) => {
      state.productProfit.listProductProfit = action.payload.content;
      state.productProfit.totalElements = action.payload.totalElements;
      state.productProfit.page = action.payload.number + 1;
      state.productProfit.size = action.payload.size;
    },
    [getCustomerProfit.fulfilled]: (state, action) => {
      state.customerProfit.listCustomerProfit = action.payload.content;
      state.customerProfit.totalElements = action.payload.totalElements;
      state.customerProfit.page = action.payload.number + 1;
      state.customerProfit.size = action.payload.size;
    },
    [getEmployeeProfit.fulfilled]: (state, action) => {
      state.employeeProfit.listEmployeeProfit = action.payload.content;
      state.employeeProfit.totalElements = action.payload.totalElements;
      state.employeeProfit.page = action.payload.number + 1;
      state.employeeProfit.size = action.payload.size;
    },
    [getSupplierProfit.fulfilled]: (state, action) => {
      state.supplierProfit.listSupplierProfit = action.payload.content;
      state.supplierProfit.totalElements = action.payload.totalElements;
      state.supplierProfit.page = action.payload.number + 1;
      state.supplierProfit.size = action.payload.size;
    },
    [getCategoryProfit.fulfilled]: (state, action) => {
      state.categoryProfit.listCategoryProfit = action.payload.content;
      state.categoryProfit.totalElements = action.payload.totalElements;
      state.categoryProfit.page = action.payload.number + 1;
      state.categoryProfit.size = action.payload.size;
    },
    ["LOGOUT"]: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { updateProductDetails } = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice.reducer;
