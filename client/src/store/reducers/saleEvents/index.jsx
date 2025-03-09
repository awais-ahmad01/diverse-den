import { createSlice } from "@reduxjs/toolkit";
import { listSaleEvents, getSalesProducts, getSaleEventById } from "../../actions/saleEvents";

let default_state = {
  isloading: false,
  saleEvents: [],
  salesProducts: [],
  saleEventById: null // Initialize as null instead of empty array
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
      });
  },
});

export const { resetSaleEventData } = saleEventsSlice.actions;
export default saleEventsSlice.reducer;