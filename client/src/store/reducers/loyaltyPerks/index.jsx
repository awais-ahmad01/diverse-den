import { createSlice } from "@reduxjs/toolkit";
import { customerLoyaltyPoints } from "../../actions/loyaltyPerks";

let default_state = {
  isloading: false,
  customerLoyaltyData: [],

};

export const loyaltyPerksSlice = createSlice({
  name: "loyaltyPerks",
  initialState: default_state,
  reducers: {
    
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(customerLoyaltyPoints.pending, (state) => {
        state.isloading = true;
      })
      .addCase(customerLoyaltyPoints.fulfilled, (state, action) => {
        state.isloading = false;
        state.customerLoyaltyData = action.payload.data;
        
      })
      .addCase(customerLoyaltyPoints.rejected, (state) => {
        state.isloading = false;
        state.customerLoyaltyData = [];
      })

      
  },
});

export default loyaltyPerksSlice.reducer;