import { createSlice } from "@reduxjs/toolkit";
import { listUsers, deleteUser } from "../../actions/users";

let default_state = {
  isloading: false,
  users: [],
  
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

    
      
  },
});

export default usersSlice.reducer;
