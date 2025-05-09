import { createSlice } from "@reduxjs/toolkit";
import {
  addProduct,
  getProducts,
  getBranchProducts,
  getProductByID,
  searchProduct,
  getSubCategoryProducts,
  getCustomerProductById,
  getCartItems,
  getProductReviews,
  getSaleProductById,
 

} from "../../actions/products";

const default_State = {
  isloading: false,
  products: [],
  branchProducts: [],
  searchedProducts:[],
  subCategoryProducts:[],
  cartItems:[],
  productReviews:[],
  saleProduct:[],


  
};

export const addProductSlice = createSlice({
  name: "products",
  initialState: default_State,
  reducers: {
    clearSubCategoryProducts:(state)=>{
      state.subCategoryProducts = []
    }
  },
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

      .addCase(searchProduct.pending, (state) => {
        state.isloading = true;
      })
      .addCase(searchProduct.fulfilled, (state, action) => {
        state.isloading = false;
        state.searchedProducts = action.payload.data;
      })
      .addCase(searchProduct.rejected, (state) => {
        state.isloading = false;
      })


      .addCase(getSubCategoryProducts.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getSubCategoryProducts.fulfilled, (state, action) => {
        state.isloading = false;
        state.subCategoryProducts = action.payload.data;
      })
      .addCase(getSubCategoryProducts.rejected, (state) => {
        state.isloading = false;
      })



      .addCase(getCustomerProductById.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getCustomerProductById.fulfilled, (state, action) => {
        state.isloading = false;
        state.customerProduct = action.payload.data;
      })
      .addCase(getCustomerProductById.rejected, (state) => {
        state.isloading = false;
      })



      .addCase(getSaleProductById.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getSaleProductById.fulfilled, (state, action) => {
        state.isloading = false;
        state.saleProduct = action.payload.data;
      })
      .addCase(getSaleProductById.rejected, (state) => {
        state.isloading = false;
      })


      .addCase(getCartItems.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.isloading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(getCartItems.rejected, (state) => {
        state.isloading = false;
      })



      .addCase(getProductReviews.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.isloading = false;
        state.productReviews = action.payload.data;
      })
      .addCase(getProductReviews.rejected, (state) => {
        state.isloading = false;
      })

      .add



  
 
 
 
      
  },
});

export const {clearSubCategoryProducts} = addProductSlice.actions;

export default addProductSlice.reducer;
