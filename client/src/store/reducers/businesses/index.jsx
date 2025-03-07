import { createSlice } from "@reduxjs/toolkit";
import { listBusinesses, getBusinessProductReviews, verifyBusiness, getBusinessProducts } from "../../actions/businesses";

let default_state = {
  isloading: false,
  businesses: [],
  businessProductReviews: [],
  businessProducts:[]
  
};

export const businessesSlice = createSlice({
  name: "businesses",
  initialState: default_state,
  reducers: {},
  extraReducers: (builder) => {
    builder


      .addCase(listBusinesses.pending, (state) => {
        state.isloading = true;
      })
      .addCase(listBusinesses.fulfilled, (state, action) => {
        state.isloading = false;
        state.businesses = action.payload.data;
        state.meta = action.payload.metaData;
      })
      .addCase(listBusinesses.rejected, (state) => {
        state.isloading = false;
        state.businesses = [];
      })


      .addCase(getBusinessProductReviews.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getBusinessProductReviews.fulfilled, (state, action) => {
        state.isloading = false;
        state.businessProductReviews = action.payload.data;
        state.reviewsMeta = action.payload.metaData;
      })
      .addCase(getBusinessProductReviews.rejected, (state) => {
        state.isloading = false;
      })


      .addCase(getBusinessProducts.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getBusinessProducts.fulfilled, (state, action) => {
        state.isloading = false;
        state.businessProducts = action.payload.data;
        state.productsMeta = action.payload.metaData;
      })
      .addCase(getBusinessProducts.rejected, (state) => {
        state.isloading = false;
      })



      .addCase(verifyBusiness.pending, (state) => {
        state.isloading = true;
      })
      .addCase(verifyBusiness.fulfilled, (state, action) => {
        state.isloading = false;
        state.businessVerify = action.payload.data;
     
      })
      .addCase(verifyBusiness.rejected, (state) => {
        state.isloading = false;
      })


  },
});

export default businessesSlice.reducer;

