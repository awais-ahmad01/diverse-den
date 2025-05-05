import { createSlice } from "@reduxjs/toolkit";
import { emptyCart, getDiscountData } from "../../actions/cart";

let default_state = {
  isloading: false,
  discountedData: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: default_state,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getDiscountData.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getDiscountData.fulfilled, (state, action) => {
        state.isloading = false;
        state.discountedData = action.payload.data;
      })
      .addCase(getDiscountData.rejected, (state) => {
        state.isloading = false;
        state.discountedData = [];
      });
  },
});

export default cartSlice.reducer;
