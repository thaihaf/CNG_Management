import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";
import { CUSTOMER_KEY } from "../constants/customer.key";

import api from "../api/customer.api";

export const CUSTOMERS_FEATURE_KEY = CUSTOMER_KEY;

export const getCustomers = createAsyncThunk(
  "customer/getCustomers",
  async () => {
    const response = await api.getCustomers();
    return response.data;
  }
);
export const getCustomerDetails = createAsyncThunk(
  "customer/getCustomerDetails",
  async (id) => {
    const response = await api.getCustomerDetails(id);
    return response.data;
  }
);

export const updateDetails = createAsyncThunk(
  "customer/updateDetails",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.updateDetails(id, data);
      return response;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.deleteCustomer(id);
      return response;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const deleteCustomers = createAsyncThunk(
  "customer/deleteCustomers",
  async (list, { rejectWithValue }) => {
    try {
      list.forEach(async (id) => {
        await api.deleteCustomer(id);
      });
      return true;
    } catch (error) {
      console.log(error);
      throw rejectWithValue(error);
    }
  }
);

export const createDetails = createAsyncThunk(
  "customer/createDetails",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.createDetails(data);
      return response;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

const initialState = {
  listCustomers: [],
  totalElements: 0,
  totalPages: 0,
  size: 0,
  dataDetails: null,
  errorProcess: "",
  createMode: false,
};

const customerSlice = createSlice({
  name: CUSTOMERS_FEATURE_KEY,
  initialState,
  reducers: {
    updateErrorProcess: (state, action) => {
      state.errorProcess = action.payload;
    },
  },
  extraReducers: {
    [getCustomers.fulfilled]: (state, action) => {
      state.listCustomers = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.totalPages = action.payload.totalPages;
      state.size = action.payload.size;
    },
    [getCustomerDetails.fulfilled]: (state, action) => {
      state.dataDetails = action.payload;
      state.errorProcess = "";
      state.createMode = false;
    },
    [getCustomerDetails.rejected]: (state, action) => {
      state.createMode = true;
    },
    [createDetails.fulfilled]: (state, action) => {
      state.createMode = false;
    },
    ["LOGOUT"]: (state) => {
      Object.assign(state, initialState);
    },
  },
});
export const { updateErrorProcess, updateDataDetails } = customerSlice.actions;

export const customersReducer = customerSlice.reducer;
