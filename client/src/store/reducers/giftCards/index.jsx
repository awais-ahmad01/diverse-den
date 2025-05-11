import { createSlice } from "@reduxjs/toolkit";
import { getGiftCards, getAllGiftCards, getGiftCardById } from "../../actions/giftCards";

const default_State = {
  isloading: false,
  giftCardsList:[],
  giftCardsData:[],
  giftCardById:[]

  
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
    
    .addCase(getAllGiftCards.pending, (state) => {
      state.isloading = true;
    })
    .addCase(getAllGiftCards.fulfilled, (state, action) => {
      state.isloading = false;
      state.giftCardsData = action.payload.data
   
    })
    .addCase(getAllGiftCards.rejected, (state) => {
      state.isloading = false;
      state.giftCardsData = [];
    })

    .addCase(getGiftCardById.pending, (state) => {
      state.isloading = true;
    })
    .addCase(getGiftCardById.fulfilled, (state, action) => {
      state.isloading = false;
      state.giftCardById = action.payload.data
    })
    .addCase(getGiftCardById.rejected, (state) => {
      state.isloading = false;
      state.giftCardById = [];
    })

 
      
  },
});



export default giftCardsSlice.reducer;
