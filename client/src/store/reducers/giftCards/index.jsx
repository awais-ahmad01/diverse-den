import { createSlice } from "@reduxjs/toolkit";
import { getGiftCards } from "../../actions/giftCards";

const default_State = {
  isloading: false,
  giftCardsList:[]

  
};

export const giftCardsSlice = createSlice({
  name: "giftCards",
  initialState: default_State,
  reducers: {

  },
  extraReducers: (builder) => {
    builder

    .addCase(getGiftCards.pending, (state) => {
      state.isloading = true;
    })
    .addCase(getGiftCards.fulfilled, (state, action) => {
      state.isloading = false;
      state.giftCardsList = action.payload.data,
      state.meta = action.payload.metaData
    })
    .addCase(getGiftCards.rejected, (state) => {
      state.isloading = false;
      state.giftCardsList = [];
    })  

      


  
 
 
 
      
  },
});



export default giftCardsSlice.reducer;
