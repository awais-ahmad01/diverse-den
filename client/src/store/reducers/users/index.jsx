import { createSlice } from "@reduxjs/toolkit";
import { listUsers, deleteUser, getUserDetails } from "../../actions/users";

let default_state = {
  isloading: false,
  users: [],
  userDetails:[]
  
};


export const usersSlice = createSlice({
  name: "users",
  initialState: default_state,
  reducers: {},
  extraReducers: (builder) => {
    builder


      .addCase(listUsers.pending, (state) => {
        state.isloading = true;
      })
      .addCase(listUsers.fulfilled, (state, action) => {
        state.isloading = false;
        state.users = action.payload.data;
        state.meta = action.payload.metaData;
      })
      .addCase(listUsers.rejected, (state) => {
        state.isloading = false;
        state.users = [];
      })

      .addCase(getUserDetails.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.isloading = false;
        state.userDetails = action.payload.data;
       
      })
      .addCase(getUserDetails.rejected, (state) => {
        state.isloading = false;
        state.userDetails = [];
      })
    
      
  },
});

export default usersSlice.reducer;
