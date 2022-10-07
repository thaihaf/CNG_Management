import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";
import { SUPPLIER_KEY } from "../constants/supplier.key";


export const SUPPLIER_FEATURE_KEY = SUPPLIER_KEY;

export const fetchTodos = createAsyncThunk("todos/fetch", async () => {
     // Fetch the backend endpoint:
     const response = await fetch(`https://jsonplaceholder.typicode.com/todos`);

     // Get the JSON from the response:
     const data = await response.json();

     // Return result:
     return data;
});

const initialState = {
     supplier: [],
};

const supplierSlice = createSlice({
     name: SUPPLIER_FEATURE_KEY,
     initialState,
     reducers: {
          setSupplier: (state, action) => {
               state.supplier = action.payload ?? [];
          },
          clearSupplier: (state) => {
               state.supplier = [];
          },
     },
     extraReducers: {
          [fetchTodos.fulfilled]: (state, action) => {
               state.errorLogin = null;
               state.isSignedIn = true;
          },
          [fetchTodos.rejected]: (state, action) => {
               state.errorLogin = CODE_ERROR.ERROR_LOGIN;
          },
     },
});

export const { setSupplier, clearSupplier } = supplierSlice.actions;

export const employeesReducer = supplierSlice.reducer;
