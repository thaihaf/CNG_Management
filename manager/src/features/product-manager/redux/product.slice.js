import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";
import { PRODUCT_KEY } from "../constants/product.key";

import api from "../api/product.api";

export const PRODUCT_FEATURE_KEY = PRODUCT_KEY;

export const getProducts = createAsyncThunk("product/getProducts", async () => {
     const response = await api.getProducts();
     return response.data;
});
export const getDetailsProduct = createAsyncThunk(
     "product/getDetailsProduct",
     async (id, { rejectWithValue }) => {
          try {
               const response = await api.getDetailsProduct(id);
               return response.data;
          } catch (error) {
               throw rejectWithValue(error);
          }
     }
);
export const createProduct = createAsyncThunk(
     "product/createProduct",
     async ({ data }, { rejectWithValue }) => {
          try {
               const response = await api.createProduct(data);
               return response;
          } catch (error) {
               throw rejectWithValue(error);
          }
     }
);
export const updateProduct = createAsyncThunk(
     "product/updateProduct",
     async ({ id, data }, { rejectWithValue }) => {
          try {
               const response = await api.updateProduct(id, data);
               return response;
          } catch (error) {
               throw rejectWithValue(error);
          }
     }
);

const initialState = {
     listProducts: [],
     totalElements: 0,
     totalPages: 0,
     size: 0,
     errorProcess: "",
};

const productSlice = createSlice({
     name: PRODUCT_FEATURE_KEY,
     initialState,
     reducers: {
          updateErrorProcess: (state, action) => {
               state.errorProcess = action.payload;
          },
     },
     extraReducers: {
          [getProducts.fulfilled]: (state, action) => {
               state.listProducts = action.payload.content;
               state.totalElements = action.payload.totalElements;
               state.totalPages = action.payload.totalPages;
               state.size = action.payload.size;
          },
          ["LOGOUT"]: (state) => {
               Object.assign(state, initialState);
          },
     },
});

export const {} = productSlice.actions;

export const productReducer = productSlice.reducer;
