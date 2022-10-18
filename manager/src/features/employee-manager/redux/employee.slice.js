import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";
import { EMPLOYEES_KEY } from "../constants/employee.key";

import api from "../api/employee.api";

export const EMPLOYEES_FEATURE_KEY = EMPLOYEES_KEY;

export const getEmployees = createAsyncThunk(
     "employee/getEmployees",
     async () => {
          const response = await api.getEmployees();
          console.log(response);
          return response.data;
     }
);
export const createAccEmployee = createAsyncThunk(
     "employee/createAccEmployee",
     async ({ data }, { rejectWithValue }) => {
          try {
               const response = await api.createAccEmployee(data);
               return response;
          } catch (error) {
               throw rejectWithValue(error);
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

export const createDetails = createAsyncThunk(
     "employee/createDetails",
     async ({ data }, { rejectWithValue }) => {
          try {
               const response = await api.createDetails(data);
               return response;
          } catch (error) {
               throw rejectWithValue(error);
          }
     }
);

export const getAccounts = createAsyncThunk(
	"employee/getAccounts",
	async () => {
			 const response = await api.getAccounts();
			 console.log(response);
			 return response.data;
	}
);

const initialState = {
     listEmployees: [],
		 listAccounts: [],
     totalElements: 0,
     totalPages: 0,
     size: 0,
     dataDetails: null,
     errorProcess: "",
     createMode: false,
};

const employeesSlice = createSlice({
     name: EMPLOYEES_FEATURE_KEY,
     initialState,
     reducers: {
          updateErrorProcess: (state, action) => {
               state.errorProcess = action.payload;
          },
     },
     extraReducers: {
          [getEmployees.fulfilled]: (state, action) => {
               state.listEmployees = action.payload.content;
               state.totalElements = action.payload.totalElements;
               state.totalPages = action.payload.totalPages;
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
						state.createMode = true;
          },
					[getAccounts.fulfilled]: (state, action) => {
							 state.listAccounts = action.payload.content;
							 state.totalElements = action.payload.totalElements;
							 state.totalPages = action.payload.totalPages;
							 state.size = action.payload.size;
					},
     },
});

export const { updateErrorProcess, updateDataDetails } = employeesSlice.actions;

export const employeesReducer = employeesSlice.reducer;
