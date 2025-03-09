import { createSlice } from "@reduxjs/toolkit";
import { listSaleEvents, getSalesProducts, getSaleEventById, 
  getAllSaleEvents, getSaleEventByIdWithProductDetails

 } from "../../actions/saleEvents";

let default_state = {
  isloading: false,
  saleEvents: [],
  salesProducts: [],
  saleEventById: null ,
  allSaleEvents:[],
  saleEventsWithProductDetails:[],
};

export const saleEventsSlice = createSlice({
  name: "saleEvents",
  initialState: default_state,
  reducers: {
    // Add a reset action to clear event data when needed
    resetSaleEventData: (state) => {
      state.saleEventById = null;
    }
  },
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
        // Make sure we're setting an object, not an array
        state.saleEventById = action.payload.data;
      })
      .addCase(getSaleEventById.rejected, (state, action) => {
        state.isloading = false;
        state.saleEventById = null; // Reset to null on error
        console.error("Error fetching sale event:", action.error);
      })
      

      .addCase(getAllSaleEvents.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getAllSaleEvents.fulfilled, (state, action) => {
        state.isloading = false;
        state.allSaleEvents = action.payload.data;
       
      })
      .addCase(getAllSaleEvents.rejected, (state) => {
        state.isloading = false;
        state.allSaleEvents = [];
      })



      .addCase(getSaleEventByIdWithProductDetails.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getSaleEventByIdWithProductDetails.fulfilled, (state, action) => {
        state.isloading = false;
        state.saleEventsWithProductDetails = action.payload.data;
       
      })
      .addCase(getSaleEventByIdWithProductDetails.rejected, (state) => {
        state.isloading = false;
        state.saleEventsWithProductDetails = [];
      })
  },
});

export const { resetSaleEventData } = saleEventsSlice.actions;
export default saleEventsSlice.reducer;