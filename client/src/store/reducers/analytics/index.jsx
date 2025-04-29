import { createSlice } from "@reduxjs/toolkit";
import { getWeeklySales, getMonthlySales, getYearlySales, getWeeklyRevenue, getMonthlyRevenue, getYearlyRevenue,
  getDailyTrendingProducts, getWeeklyTrendingProducts, getMonthlyTrendingProducts, 
  getWeeklySubscriptionReports, getMonthlySubscriptionReports, getYearlySubscriptionReports
 } from "../../actions/analytics";
import { getMonth } from "date-fns";
let default_state = { 
  isloading: false, 
  weeklySales: [],
  monthlySales: [],
  yearlySales: [],
  weeklyRevenue: [],
  monthlyRevenue: [],
  yearlyRevenue: [],
  weeklyTrendingProducts: [],
  monthlyTrendingProducts: [],
  dailyTrendingProducts: [],
  weeklySubscription:[],
  monthlySubscription:[],
  yearlySubscription:[]

};
export const analyticsSlice = createSlice({
  name: "analytics",
  initialState: default_state,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWeeklySales.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getWeeklySales.fulfilled, (state, action) => {
        state.isloading = false;
        state.weeklySales = action.payload.data;
      })
      .addCase(getWeeklySales.rejected, (state) => {
        state.isloading = false;
        state.weeklySales = [];
      })


      .addCase(getMonthlySales.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getMonthlySales.fulfilled, (state, action) => {
        state.isloading = false;
        state.monthlySales = action.payload.data;
      })
      .addCase(getMonthlySales.rejected, (state) => {
        state.isloading = false;
        state.monthlySales = [];
      })


      .addCase(getYearlySales.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getYearlySales.fulfilled, (state, action) => {
        state.isloading = false;
        state.yearlySales = action.payload.data;
      })
      .addCase(getYearlySales.rejected, (state) => {
        state.isloading = false;
        state.yearlySales = [];
      })


      .addCase(getWeeklyRevenue.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getWeeklyRevenue.fulfilled, (state, action) => {
        state.isloading = false;
        state.weeklyRevenue = action.payload.data;
      })
      .addCase(getWeeklyRevenue.rejected, (state) => {
        state.isloading = false;
        state.weeklyRevenue = [];
      })

      .addCase(getMonthlyRevenue.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getMonthlyRevenue.fulfilled, (state, action) => {
        state.isloading = false;
        state.monthlyRevenue = action.payload.data;
      })
      .addCase(getMonthlyRevenue.rejected, (state) => {
        state.isloading = false;
        state.monthlyRevenue = [];
      })

      .addCase(getYearlyRevenue.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getYearlyRevenue.fulfilled, (state, action) => {
        state.isloading = false;
        state.yearlyRevenue = action.payload.data;
      })
      .addCase(getYearlyRevenue.rejected, (state) => {
        state.isloading = false;
        state.yearlyRevenue = [];
      })


      .addCase(getDailyTrendingProducts.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getDailyTrendingProducts.fulfilled, (state, action) => {
        state.isloading = false;
        state.dailyTrendingProducts = action.payload.data;
      })
      .addCase(getDailyTrendingProducts.rejected, (state) => {
        state.isloading = false;
        state.dailyTrendingProducts = [];
      })


      .addCase(getWeeklyTrendingProducts.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getWeeklyTrendingProducts.fulfilled, (state, action) => {
        state.isloading = false;
        state.weeklyTrendingProducts = action.payload.data;
      })
      .addCase(getWeeklyTrendingProducts.rejected, (state) => {
        state.isloading = false;
        state.weeklyTrendingProducts = [];
      })

    .addCase(getMonthlyTrendingProducts.pending, (state) => {
      state.isloading = true;
    })
    .addCase(getMonthlyTrendingProducts.fulfilled, (state, action) => {
      state.isloading = false;
      state.monthlyTrendingProducts = action.payload.data;
    })
    .addCase(getMonthlyTrendingProducts.rejected, (state) => {
      state.isloading = false;
      state.monthlyTrendingProducts = [];
    })




    .addCase(getWeeklySubscriptionReports.pending, (state) => {
      state.isloading = true;
    })
    .addCase(getWeeklySubscriptionReports.fulfilled, (state, action) => {
      state.isloading = false;
      state.weeklySubscription = action.payload.data;
    })
    .addCase(getWeeklySubscriptionReports.rejected, (state) => {
      state.isloading = false;
      state.weeklySubscription = [];
    })


    .addCase(getMonthlySubscriptionReports.pending, (state) => {
      state.isloading = true;
    })
    .addCase(getMonthlySubscriptionReports.fulfilled, (state, action) => {
      state.isloading = false;
      state.monthlySubscription = action.payload.data;
    })
    .addCase(getMonthlySubscriptionReports.rejected, (state) => {
      state.isloading = false;
      state.monthlySubscription = [];
    })


    .addCase(getYearlySubscriptionReports.pending, (state) => {
      state.isloading = true;
    })
    .addCase(getYearlySubscriptionReports.fulfilled, (state, action) => {
      state.isloading = false;
      state.yearlySubscription = action.payload.data;
    })
    .addCase(getYearlySubscriptionReports.rejected, (state) => {
      state.isloading = false;
      state.yearlySubscription = [];
    })
  },
});
export default analyticsSlice.reducer;
