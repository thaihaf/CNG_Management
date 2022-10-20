import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";
import { SUPPLIER_KEY } from "../constants/supplier.key";

import api from "../api/supplier.api";

export const SUPPLIERS_FEATURE_KEY = SUPPLIER_KEY;

export const getSuppliers = createAsyncThunk(
  "supplier/getSuppliers",
  async () => {
    const response = await api.getSuppliers();
    console.log(response);
    return response.data;
  }
);
export const createSupplier = createAsyncThunk(
  "supplier/createSupplier",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.createSupplier(data);
      return response;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getSupplierDetails = createAsyncThunk(
  "supplier/getSupplierDetails",
  async (id) => {
    const response = await api.getSupplierDetails(id);
    return response.data;
  }
);

export const updateDetails = createAsyncThunk(
  "supplier/updateDetails",
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
export const deleteSupplier = createAsyncThunk(
  "supplier/deleteSupplier",
  async (id, { rejectWithValue }) => {
       try {
            const response = await api.deleteSupplier(id);
            return response;
       } catch (error) {
            throw rejectWithValue(error);
       }
  }
);
export const deleteSuppliers = createAsyncThunk(
  "supplier/deleteSuppliers",
  async (list, { rejectWithValue }) => {
       try {
            list.forEach(async (id) => {
                 console.log(id);
                 await api.deleteSupplier(id);
            });
            return true;
       } catch (error) {
            console.log(error);
            throw rejectWithValue(error);
       }
  }
);

export const createDetails = createAsyncThunk(
  "supplier/createDetails",
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
  listSuppliers: [],
  totalElements: 0,
  totalPages: 0,
  size: 0,
  dataDetails: null,
  errorProcess: "",
  createMode: false,
};

const supplierSlice = createSlice({
  name: SUPPLIERS_FEATURE_KEY,
  initialState,
  reducers: {
    updateErrorProcess: (state, action) => {
      state.errorProcess = action.payload;
    },
  },
  extraReducers: {
    [getSuppliers.fulfilled]: (state, action) => {
      state.listSuppliers = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.totalPages = action.payload.totalPages;
      state.size = action.payload.size;
    },
    [createSupplier.fulfilled]: (state, action) => {
      state.errorProcess = "";
    },
    [getSupplierDetails.fulfilled]: (state, action) => {
      state.dataDetails = action.payload;
      state.errorProcess = "";
      state.createMode = false;
    },
    [getSupplierDetails.rejected]: (state, action) => {
      state.createMode = true;
    },
  },
});
export const { updateErrorProcess, updateDataDetails } = supplierSlice.actions;

export const suppliersReducer = supplierSlice.reducer;
