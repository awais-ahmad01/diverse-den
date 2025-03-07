import { createSlice } from "@reduxjs/toolkit";
import { getSubscriptionPlans, viewActiveSubscriptionPlan } from "../../actions/subscriptionPlans";

let default_state = {
  isloading: false,
  subscriptionPlans: [],
  activeSubscriptionPlan:[]
  
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



      .addCase(viewActiveSubscriptionPlan.pending, (state) => {
        state.isloading = true;
      })
      .addCase(viewActiveSubscriptionPlan.fulfilled, (state, action) => {
        state.isloading = false;
        state.activeSubscriptionPlan = action.payload.data;
      })
      .addCase(viewActiveSubscriptionPlan.rejected, (state) => {
        state.isloading = false;
        state.activeSubscriptionPlan = [];
      })


    
      
  },
});

export default subscriptionPlansSlice.reducer;
