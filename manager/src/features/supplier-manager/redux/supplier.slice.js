import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";
import { SUPPLIER_KEY } from "../constants/supplier.key";

import api from "../api/supplier.api";

export const SUPPLIERS_FEATURE_KEY = SUPPLIER_KEY;

export const getSuppliers = createAsyncThunk(
  "supplier/getSuppliers",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getSuppliers(params);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getActiveSuppliers = createAsyncThunk(
  "supplier/getActiveSuppliers",
  async () => {
    const response = await api.getActiveSuppliers();
    return response.data;
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
  async (data , { rejectWithValue }) => {
    try {
      const response = await api.createDetails(data);
      return response;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

// debt
export const getDebtSuppliers = createAsyncThunk(
  "supplier/getDebtSuppliers",
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const response = await api.getDebtSuppliers(id, params);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getDeptSupplierDetails = createAsyncThunk(
  "supplier/getDeptSupplierDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getDeptSupplierDetails(id);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const updateDeptSupplier = createAsyncThunk(
  "supplier/updateDeptSupplier",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.updateDeptSupplier(id, data);
      return response;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const deleteDeptSupplier = createAsyncThunk(
  "supplier/deleteDeptSupplier",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.deleteDeptSupplier(id);
      return response;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

export const createDeptSupplier = createAsyncThunk(
  "supplier/createDeptSupplier",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.createDeptSupplier(data);
      return response;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);

const initialState = {
  listSuppliers: [],
  listActiveSuppliers: [],
  page: 0,
  totalPages: 0,
  size: 0,
  dataDetails: null,
  errorProcess: "",
  createMode: false,
  debtSupplier: {
    listDebtSupplier: [],
    totalElements: 0,
    page: 0,
    size: 0,
    debtDataDetails: null,
  },
};

const supplierSlice = createSlice({
  name: SUPPLIERS_FEATURE_KEY,
  initialState,
  reducers: {
    updateErrorProcess: (state, action) => {
      state.errorProcess = action.payload;
    },
    updateDebtSuppliers: (state, action) => {
      state.debtSupplier.listDebtSupplier = action.payload;
    },
    updateListSuppliers: (state, action) => {
      state.listSuppliers = action.payload;
    },
  },
  extraReducers: {
    [getSuppliers.fulfilled]: (state, action) => {
      state.listSuppliers = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.page = action.payload.number + 1;
      state.size = action.payload.size;
    },
    [getActiveSuppliers.fulfilled]: (state, action) => {
      state.listActiveSuppliers = action.payload;
    },
    [getSupplierDetails.fulfilled]: (state, action) => {
      state.dataDetails = action.payload;
      state.errorProcess = "";
      state.createMode = false;
    },
    [getSupplierDetails.rejected]: (state, action) => {
      state.createMode = true;
    },
    [createDetails.fulfilled]: (state, action) => {
      state.createMode = false;
    },
    // debt
    [createDeptSupplier.fulfilled]: (state, action) => {
      state.debtSupplier.listDebtSupplier = [
        ...state.debtSupplier.listDebtSupplier,
        action.payload.data,
      ];
    },
    [updateDeptSupplier.fulfilled]: (state, action) => {
      state.debtSupplier.listDebtSupplier =
        state.debtSupplier.listDebtSupplier.map((item) => {
          if (item.id === action.payload.data.id) {
            return action.payload.data;
          } else {
            return item;
          }
        });
    },
    [getDebtSuppliers.fulfilled]: (state, action) => {
      state.debtSupplier.listDebtSupplier = action.payload.content;
      state.debtSupplier.totalElements = action.payload.totalElements;
      state.debtSupplier.page = action.payload.number + 1;
      state.debtSupplier.size = action.payload.size;
    },
    [getDeptSupplierDetails.fulfilled]: (state, action) => {
      state.debtSupplier.debtDataDetails = action.payload;
      state.errorProcess = "";
      state.createMode = false;
    },
    ["LOGOUT"]: (state) => {
      Object.assign(state, initialState);
    },
  },
});
export const {
  updateErrorProcess,
  updateDataDetails,
  updateDebtSuppliers,
  updateListSuppliers,
} = supplierSlice.actions;

export const suppliersReducer = supplierSlice.reducer;
