import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";
import { EMPLOYEES_KEY } from "../constants/employee.key";

import api from "../api/employee.api";

export const EMPLOYEES_FEATURE_KEY = EMPLOYEES_KEY;

export const getEmployees = createAsyncThunk(
     "employee/getEmployees",
     async () => {
          const response = await api.getEmployees();
          return response.data;
     }
);
export const getEmployeeDetails = createAsyncThunk(
     "employee/getEmployeeDetails",
     async (id) => {
          const response = await api.getEmployeeDetails(id);
          return response.data;
     }
);

const initialState = {
     listEmployees: [],
     totalElements: 0,
     totalPages: 0,
     size: 0,
     dataDetails: null,
     errorProcess: "",
};

const employeesSlice = createSlice({
     name: EMPLOYEES_FEATURE_KEY,
     initialState,
     reducers: {},
     extraReducers: {
          [getEmployees.fulfilled]: (state, action) => {
               state.listEmployees = action.payload.content;
               state.totalElements = action.payload.totalElements;
               state.totalPages = action.payload.totalPages;
               state.size = action.payload.size;
          },
          [getEmployeeDetails.fulfilled]: (state, action) => {
               state.dataDetails = action.payload;
							 state.errorProcess = ""
          },
          [getEmployeeDetails.rejected]: (state, action) => {
               state.dataDetails = null;
          },
     },
});

export const { setEmployees, clearEmployees } = employeesSlice.actions;

export const employeesReducer = employeesSlice.reducer;
