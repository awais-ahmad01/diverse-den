import { createSlice } from "@reduxjs/toolkit";

import { getListOfSalesperson, getUserChats, getListOfRiders
  , getAllRiders
 } from "../../actions/rider";


let default_state = {
  isloading: false,
  listOfSalespersons: [],
  userChats:[],
  listOfRiders: [],
  allRiders: [],
  
};

export const riderSlice = createSlice({
  name: "rider",
  initialState: default_state,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder

    .addCase(getListOfSalesperson.pending, (state) => {
      state.isloading = true;
    })
    .addCase(getListOfSalesperson.fulfilled, (state, action) => {
      state.isloading = false;
      state.listOfSalespersons = action.payload.data;
    })
    .addCase(getListOfSalesperson.rejected, (state) => {
      state.isloading = false;
      state.listOfSalespersons = [];
    })


    .addCase(getUserChats.pending, (state) => {
      state.isloading = true;
    })
    .addCase(getUserChats.fulfilled, (state, action) => {
      state.isloading = false;
      state.userChats = action.payload.data;
    })
    .addCase(getUserChats.rejected, (state) => {
      state.isloading = false;
      state.userChats = [];
    })

    .addCase(getListOfRiders.pending, (state) => {
      state.isloading = true;
    })
    .addCase(getListOfRiders.fulfilled, (state, action) => {
      state.isloading = false;
      state.listOfRiders = action.payload.data;
    })
    .addCase(getListOfRiders.rejected, (state) => {
      state.isloading = false;
      state.listOfRiders = [];
    })


    .addCase(getAllRiders.pending, (state) => {
      state.isloading = true;
    })
    .addCase(getAllRiders.fulfilled, (state, action) => {
      state.isloading = false;
      state.allRiders = action.payload.data;
    })
    .addCase(getAllRiders.rejected, (state) => {
      state.isloading = false;
      state.allRiders = [];
    })


    
      
  },
});


export default riderSlice.reducer;