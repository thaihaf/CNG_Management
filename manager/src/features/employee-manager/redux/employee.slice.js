import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";
import { EMPLOYEES_KEY } from "../constants/employee.key";

import api from "../api/employee.api";

export const EMPLOYEES_FEATURE_KEY = EMPLOYEES_KEY;

export const getEmployees = createAsyncThunk(
  "employee/getEmployees",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getEmployees(params);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error?.response?.data);
    }
  }
);
export const createAccEmployee = createAsyncThunk(
  "employee/createAccEmployee",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.createAccEmployee(data);
      return response;
    } catch (error) {
      throw rejectWithValue(error?.response?.data);
    }
  }
);
export const getEmployeeDetails = createAsyncThunk(
  "employee/getEmployeeDetails",
  async (id) => {
    const response = await api.getEmployeeDetails(id);
    return response.data;
  }
);

export const updateDetails = createAsyncThunk(
  "employee/updateDetails",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.updateDetails(id, data);
      return response;
    } catch (error) {
      throw rejectWithValue(error?.response?.data);
    }
  }
);
export const deleteEmployee = createAsyncThunk(
  "employee/deleteEmployee",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.deleteEmployee(id);
      return response;
    } catch (error) {
      throw rejectWithValue(error?.response?.data);
    }
  }
);
export const deleteEmployees = createAsyncThunk(
  "employee/deleteEmployees",
  async (list, { rejectWithValue }) => {
    try {
      list.forEach(async (id) => {
        await api.deleteEmployee(id);
      });
      return true;
    } catch (error) {
      console.log(error);
      throw rejectWithValue(error?.response?.data);
    }
  }
);

export const createDetails = createAsyncThunk(
  "employee/createDetails",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.createDetails(data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error?.response?.data);
    }
  }
);

export const getAccounts = createAsyncThunk(
  "employee/getAccounts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getAccounts(params);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error?.response?.data);
    }
  }
);

const initialState = {
  listEmployees: [],
  listAccounts: [],
  totalElements: 0,
  number: 0,
  size: 0,
  dataDetails: null,
  errorProcess: "",
  createMode: false,
  firstTime: false,
};

const employeesSlice = createSlice({
  name: EMPLOYEES_FEATURE_KEY,
  initialState,
  reducers: {
    updateErrorProcess: (state, action) => {
      state.errorProcess = action.payload;
    },
    updateListEmployees: (state, action) => {
      state.listEmployees = action.payload;
    },
    updateFirstTime: (state, action) => {
      state.firstTime = action.payload;
      console.log(state.firstTime);
    },
  },
  extraReducers: {
    [getEmployees.fulfilled]: (state, action) => {
      state.listEmployees = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.number = action.payload.number + 1;
      state.size = action.payload.size;
    },
    [createAccEmployee.fulfilled]: (state, action) => {
      state.errorProcess = "";
    },
    [getEmployeeDetails.fulfilled]: (state, action) => {
      state.dataDetails = action.payload;
      state.errorProcess = "";
      state.createMode = false;
    },
    [getEmployeeDetails.rejected]: (state, action) => {
      state.dataDetails = null;
      state.createMode = true;
    },
    [createDetails.fulfilled]: (state, action) => {
      state.createMode = false;
    },
    [getAccounts.fulfilled]: (state, action) => {
      state.listAccounts = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.number = action.payload.number + 1;
      state.size = action.payload.size;
    },
    ["LOGOUT"]: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { updateErrorProcess, updateListEmployees, updateFirstTime } =
  employeesSlice.actions;

export const employeesReducer = employeesSlice.reducer;
