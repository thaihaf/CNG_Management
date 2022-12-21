import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";
import { WAREHOUSE_KEY } from "../constants/warehouse.key";

import api from "../api/warehouse.api";

export const WAREHOUSE_FEATURE_KEY = WAREHOUSE_KEY;

export const getWarehouses = createAsyncThunk(
  "warehouse/getWarehouses",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getWarehouses(params);
      return response.data;
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
  async ({ id, dataRender }, { rejectWithValue }) => {
    try {
      const response = await api.updateDetails(id, dataRender);
      return response.data;
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
        await api.deleteWarehouse(id);
      });
      return true;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const createDetails = createAsyncThunk(
  "warehouse/createDetails",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.createDetails(data);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

const initialState = {
  listWarehouses: [],
  totalElements: 0,
  page: 0,
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
    updateListWarehouses: (state, action) => {
      state.listWarehouses = action.payload;
    },
  },
  extraReducers: {
    [getWarehouses.fulfilled]: (state, action) => {
      state.listWarehouses = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.page = action.payload.number + 1;
      state.size = action.payload.size;
    },
    [getWarehouseDetails.fulfilled]: (state, action) => {
      state.dataDetails = action.payload;
      state.errorProcess = "";
      state.createMode = false;
    },
    [updateDetails.fulfilled]: (state, action) => {
      const res = action.payload;
      state.listWarehouses = state.listWarehouses.map((c) => {
        if (c.id === res.id) {
          return res;
        } else {
          return c;
        }
      });
    },
    [getWarehouseDetails.rejected]: (state, action) => {
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
export const { updateErrorProcess, updateListWarehouses } = warehouseSlice.actions;

export const warehousesReducer = warehouseSlice.reducer;
