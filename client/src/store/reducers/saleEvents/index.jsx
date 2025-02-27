import { createSlice } from "@reduxjs/toolkit";
import { listSaleEvents } from "../../actions/saleEvents";

let default_state = {
  isloading: false,
  saleEvents: [],
  
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

    
      
  },
});

export default saleEventsSlice.reducer;
