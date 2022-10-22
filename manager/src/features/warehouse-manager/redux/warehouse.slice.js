import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";
import { WAREHOUSE_KEY } from "../constants/warehouse.key";

import api from "../api/warehouse.api";

export const WAREHOUSE_FEATURE_KEY = WAREHOUSE_KEY;

export const getWarehouses = createAsyncThunk(
  "warehouse/getWarehouses",
  async () => {
    const response = await api.getWarehouses();
    console.log(response);
    return response.data;
  }
);
export const createWarehouse = createAsyncThunk(
  "warehouse/createWarehouse",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.createWarehouse(data);
      return response;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getWarehouseDetails = createAsyncThunk(
  "warehouse/getWarehouseDetails",
  async (id) => {
    const response = await api.getWarehouseDetails(id);
    return response.data;
  }
);

export const updateDetails = createAsyncThunk(
  "warehouse/updateDetails",
  async ({ id, data }, { rejectWithValue }) => {
       console.log(id);
       console.log(data);
       try {
            const response = await api.updateDetails(id, data);
            return response;
       } catch (error) {
            throw rejectWithValue(error);
       }
  }
);
export const deleteWarehouse = createAsyncThunk(
  "warehouse/deleteWarehouse",
  async (id, { rejectWithValue }) => {
       try {
            const response = await api.deleteWarehouse(id);
            return response;
       } catch (error) {
            throw rejectWithValue(error);
       }
  }
);
export const deleteWarehouses = createAsyncThunk(
  "warehouse/deleteWarehouses",
  async (list, { rejectWithValue }) => {
       try {
            list.forEach(async (id) => {
                 console.log(id);
                 await api.deleteWarehouse(id);
            });
            return true;
       } catch (error) {
            console.log(error);
            throw rejectWithValue(error);
       }
  }
);

export const createDetails = createAsyncThunk(
  "warehouse/createDetails",
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
  listWarehouses: [],
  totalElements: 0,
  totalPages: 0,
  size: 0,
  dataDetails: null,
  errorProcess: "",
  createMode: false,
};

const warehouseSlice = createSlice({
  name: WAREHOUSE_FEATURE_KEY,
  initialState,
  reducers: {
    updateErrorProcess: (state, action) => {
      state.errorProcess = action.payload;
    },
  },
  extraReducers: {
    [getWarehouses.fulfilled]: (state, action) => {
      state.listWarehouses = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.totalPages = action.payload.totalPages;
      state.size = action.payload.size;
    },
    [createWarehouse.fulfilled]: (state, action) => {
      state.errorProcess = "";
    },
    [getWarehouseDetails.fulfilled]: (state, action) => {
      state.dataDetails = action.payload;
      state.errorProcess = "";
      state.createMode = false;
    },
    [getWarehouseDetails.rejected]: (state, action) => {
      state.createMode = true;
    },
		["LOGOUT"]: (state) => {
			Object.assign(state, initialState);
 },
  },
});
export const { updateErrorProcess, updateDataDetails } = warehouseSlice.actions;

export const warehousesReducer = warehouseSlice.reducer;
