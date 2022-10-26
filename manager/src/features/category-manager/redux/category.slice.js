import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";
import { CATEGORY_KEY } from "../constants/category.key";

import api from "../api/category";

export const CATEGORIES_FEATURE_KEY = CATEGORY_KEY;

export const getCategories = createAsyncThunk(
  "category/getCategories",
  async () => {
    const response = await api.getCategories();
    console.log(response);
    return response.data;
  }
);
export const getActiveCategories = createAsyncThunk(
  "category/getActiveCategories",
  async () => {
    const response = await api.getActiveCategories();
    return response.data;
  }
);
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.createCategory(data);
      return response;
    } catch (error) {
      throw rejectWithValue(error);
    }
  }
);
export const getCategoryDetails = createAsyncThunk(
  "category/getCategoryDetails",
  async (id) => {
    const response = await api.getCategoryDetails(id);
    return response.data;
  }
);

export const updateDetails = createAsyncThunk(
  "category/updateDetails",
  async ({ id, data }, { rejectWithValue }) => {
       try {
            const response = await api.updateDetails(id, data);
            return response;
       } catch (error) {
            throw rejectWithValue(error);
       }
  }
);
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
       try {
            const response = await api.deleteCategory(id);
            return response;
       } catch (error) {
            throw rejectWithValue(error);
       }
  }
);
export const deleteCategories = createAsyncThunk(
  "category/deleteCategories",
  async (list, { rejectWithValue }) => {
       try {
            list.forEach(async (id) => {
                 await api.deleteCategory(id);
            });
            return true;
       } catch (error) {
            console.log(error);
            throw rejectWithValue(error);
       }
  }
);

export const createDetails = createAsyncThunk(
  "category/createDetails",
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
  listCategories: [],
  listActiveCategories: [],
  totalElements: 0,
  totalPages: 0,
  size: 0,
  dataDetails: null,
  errorProcess: "",
  createMode: false,
};

const categorySlice = createSlice({
  name: CATEGORIES_FEATURE_KEY,
  initialState,
  reducers: {
    updateErrorProcess: (state, action) => {
      state.errorProcess = action.payload;
    },
  },
  extraReducers: {
    [getCategories.fulfilled]: (state, action) => {
      state.listCategories = action.payload.content;
      state.totalElements = action.payload.totalElements;
      state.totalPages = action.payload.totalPages;
      state.size = action.payload.size;
    },
    [getActiveCategories.fulfilled]: (state, action) => {
      state.listActiveCategories = action.payload;
    },
    [createCategory.fulfilled]: (state, action) => {
      state.errorProcess = "";
    },
    [getCategoryDetails.fulfilled]: (state, action) => {
      state.dataDetails = action.payload;
      state.errorProcess = "";
      state.createMode = false;
    },
    [getCategoryDetails.rejected]: (state, action) => {
      state.createMode = true;
    },
		["LOGOUT"]: (state) => {
			Object.assign(state, initialState);
 },
  },
});
export const { updateErrorProcess, updateDataDetails } = categorySlice.actions;

export const categoriesReducer = categorySlice.reducer;
