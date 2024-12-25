
import { createSlice } from "@reduxjs/toolkit";
import { listOrders } from "../../actions/orders";

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

      
 
 
 
      
  },
});


export default ordersSlice.reducer;
