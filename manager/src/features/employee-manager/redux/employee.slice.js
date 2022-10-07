import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";
import { EMPLOYEES_KEY } from "../constants/employee.key";

export const EMPLOYEES_FEATURE_KEY = EMPLOYEES_KEY;

export const fetchTodos = createAsyncThunk("todos/fetch", async () => {
     // Fetch the backend endpoint:
     const response = await fetch(`https://jsonplaceholder.typicode.com/todos`);

     // Get the JSON from the response:
     const data = await response.json();

     // Return result:
     return data;
});

const initialState = {
     employees: [],
};

const employeesSlice = createSlice({
     name: EMPLOYEES_FEATURE_KEY,
     initialState,
     reducers: {
          setEmployees: (state, action) => {
               state.employees = action.payload ?? [];
          },
          clearEmployees: (state) => {
               state.employees = [];
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

export const { setEmployees, clearEmployees } = employeesSlice.actions;

export const employeesReducer = employeesSlice.reducer;
