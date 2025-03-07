import { createSlice } from "@reduxjs/toolkit";
import { listSaleEvents, getSalesProducts, getSaleEventById } from "../../actions/saleEvents";

let default_state = {
  isloading: false,
  saleEvents: [],
  salesProducts:[],
  saleEventById:[]
  
};

export const saleEventsSlice = createSlice({
  name: "saleEvents",
  initialState: default_state,
  reducers: {},
  extraReducers: (builder) => {
    builder


      .addCase(listSaleEvents.pending, (state) => {
        state.isloading = true;
      })
      .addCase(listSaleEvents.fulfilled, (state, action) => {
        state.isloading = false;
        state.saleEvents = action.payload.data;
        state.meta = action.payload.metaData;
      })
      .addCase(listSaleEvents.rejected, (state) => {
        state.isloading = false;
        state.saleEvents = [];
      })


      .addCase(getSalesProducts.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getSalesProducts.fulfilled, (state, action) => {
        state.isloading = false;
        state.salesProducts = action.payload.data;
   
      })
      .addCase(getSalesProducts.rejected, (state) => {
        state.isloading = false;
        state.salesProducts = [];
      })



      .addCase(getSaleEventById.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getSaleEventById.fulfilled, (state, action) => {
        state.isloading = false;
        state.saleEventById = action.payload.data;
   
      })
      .addCase(getSaleEventById.rejected, (state) => {
        state.isloading = false;
        state.saleEventById = [];
      })

    
      
  },
});

export default saleEventsSlice.reducer;
