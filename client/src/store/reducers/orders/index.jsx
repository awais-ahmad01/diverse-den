
import { createSlice } from "@reduxjs/toolkit";
import { listOrders, updateOrderStatus } from "../../actions/orders";

const default_State = {
  isloading: false,
  orders: [],
  meta: []

  
};

export const ordersSlice = createSlice({
  name: "orders",
  initialState: default_State,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(listOrders.pending, (state) => {
        state.isloading = true;
      })

      .addCase(listOrders.fulfilled, (state, action) => {
        state.isloading = false, 
        state.orders = action.payload.data,
        state.meta = action.payload.metaData
      })

      .addCase(listOrders.rejected, (state) => {
        state.isloading = false;
      })


      .addCase(updateOrderStatus.pending, (state) => {
        state.isloading = true;
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isloading = false, 
        state.orderStatus = action.payload.data
      })

      .addCase(updateOrderStatus.rejected, (state) => {
        state.isloading = false;
      })
   
  },
});


export default ordersSlice.reducer;
