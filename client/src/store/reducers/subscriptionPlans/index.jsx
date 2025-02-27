import { createSlice } from "@reduxjs/toolkit";
import { getSubscriptionPlans } from "../../actions/subscriptionPlans";

let default_state = {
  isloading: false,
  subscriptionPlans: [],
  
};

export const subscriptionPlansSlice = createSlice({
  name: "subscriptionPlans",
  initialState: default_state,
  reducers: {},
  extraReducers: (builder) => {
    builder


      .addCase(getSubscriptionPlans.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getSubscriptionPlans.fulfilled, (state, action) => {
        state.isloading = false;
        state.subscriptionPlans = action.payload.data;
      })
      .addCase(getSubscriptionPlans.rejected, (state) => {
        state.isloading = false;
        state.subscriptionPlans = [];
      })

    
      
  },
});

export default subscriptionPlansSlice.reducer;
