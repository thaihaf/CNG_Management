import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";
import { SUPPLIER_KEY } from "../constants/supplier.key";

import api from "../api/supplier.api";

export const SUPPLIER_FEATURE_KEY = SUPPLIER_KEY;

export const fetchTodos = createAsyncThunk("todos/fetch", async () => {
     // Fetch the backend endpoint:
     const response = await fetch(`https://jsonplaceholder.typicode.com/todos`);

     // Get the JSON from the response:
     const data = await response.json();

     // Return result:
     return data;
});

export const getSuppliers = createAsyncThunk(
     "supplier/getSupplier",
     async () => {
          const response = await api.getSupplier();
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

const initialState = {
     supplier: [],
};

// const supplierSlice = createSlice({
//      name: SUPPLIER_FEATURE_KEY,
//      initialState,
//      reducers: {
//           setSupplier: (state, action) => {
//                state.supplier = action.payload ?? [];
//           },
//           clearSupplier: (state) => {
//                state.supplier = [];
//           },
//      },
//      extraReducers: {
//           [fetchTodos.fulfilled]: (state, action) => {
//                state.errorLogin = null;
//                state.isSignedIn = true;
//           },
//           [fetchTodos.rejected]: (state, action) => {
//                state.errorLogin = CODE_ERROR.ERROR_LOGIN;
//           },
//      },
// });
const supplierSlice = createSlice({
     name: SUPPLIER_FEATURE_KEY,
     initialState,
     reducers: {},
     extraReducers: {
          [getSuppliers.fulfilled]: (state, action) => {
               state.listEmployees = action.payload.content;
               state.totalElements = action.payload.totalElements;
               state.totalPages = action.payload.totalPages;
               state.size = action.payload.size;
          },
          [getSupplierDetails.fulfilled]: (state, action) => {
               state.dataDetails = action.payload;
							 state.errorProcess = ""
          },
          [getSupplierDetails.rejected]: (state, action) => {
               state.dataDetails = null;
          },
     },
});

export const { setSupplier, clearSupplier } = supplierSlice.actions;

export const employeesReducer = supplierSlice.reducer;
