import { createSlice } from "@reduxjs/toolkit";
import { listBusinesses } from "../../actions/businesses";

let default_state = {
  isloading: false,
  businesses: [],
  
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


  },
});

export default businessesSlice.reducer;
