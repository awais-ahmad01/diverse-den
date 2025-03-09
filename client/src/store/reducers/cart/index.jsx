import { createSlice } from "@reduxjs/toolkit";
import { emptyCart } from "../../actions/cart";

let default_state = {
  isloading: false,
  
  
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: default_state,
  reducers: {},
  extraReducers: (builder) => {
    builder


      


  },
});

export default cartSlice.reducer;

