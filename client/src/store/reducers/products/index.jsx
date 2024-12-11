import { createSlice } from "@reduxjs/toolkit";
import {
  addProduct,
  getProducts,
  getBranchProducts,
  getProductByID
} from "../../actions/products";

const default_State = {
  isloading: false,
  products: [],
  branchProducts: [],
  
};

export const addProductSlice = createSlice({
  name: "products",
  initialState: default_State,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => {
        state.isloading = true;
      })

      .addCase(addProduct.fulfilled, (state, action) => {
        (state.isloading = false), (state.lastadded = action.payload);
      })

      .addCase(addProduct.rejected, (state) => {
        state.isloading = false;
      })

      .addCase(getProducts.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isloading = false;
        state.products = action.payload.data;
        state.meta = action.payload.metaData;
      })
      .addCase(getProducts.rejected, (state) => {
        state.isloading = false;
        state.products = [];
      })

      .addCase(getBranchProducts.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getBranchProducts.fulfilled, (state, action) => {
        state.isloading = false;
        state.branchProducts = action.payload.data;
        state.branchMeta = action.payload.metaData;
      })
      .addCase(getBranchProducts.rejected, (state) => {
        state.isloading = false;
        state.branchProducts = [];
      })

      .addCase(getProductByID.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getProductByID.fulfilled, (state, action) => {
        state.isloading = false;
        state.productById = action.payload.data;
      })
      .addCase(getProductByID.rejected, (state) => {
        state.isloading = false;
      })
 
      
  },
});

export default addProductSlice.reducer;
