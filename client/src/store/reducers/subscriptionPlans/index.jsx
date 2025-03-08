import { createSlice } from "@reduxjs/toolkit";
import { getSubscriptionPlans, viewActiveSubscriptionPlan, getPlanSubscribers } from "../../actions/subscriptionPlans";

let default_state = {
  isloading: false,
  subscriptionPlans: [],
  activeSubscriptionPlan:[],
  planSubscribers:[]
  
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



      .addCase(getPlanSubscribers.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getPlanSubscribers.fulfilled, (state, action) => {
        state.isloading = false;
        state.planSubscribers = action.payload.data;
      })
      .addCase(getPlanSubscribers.rejected, (state) => {
        state.isloading = false;
        state.planSubscribers = [];
      })


    
      
  },
});

export default subscriptionPlansSlice.reducer;
