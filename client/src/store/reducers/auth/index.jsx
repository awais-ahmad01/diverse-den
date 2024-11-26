import { createSlice } from "@reduxjs/toolkit";
import { registerUser, signInUser, isAuth } from "../../actions/auth";

let default_state = {
  isloading: false,
  user: null,
  isauthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: default_state,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(registerUser.pending, (state) => {
        state.isloading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isloading = false;
        state.user = action.payload.data;
        state.isauthenticated = action.payload.auth;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isloading = false;
      })

      .addCase(signInUser.pending, (state) => {
        state.isloading = true;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.isloading = false;
        state.user = action.payload.data;
        state.isauthenticated = action.payload.auth;
      })
      .addCase(signInUser.rejected, (state) => {
        state.isloading = false;
      })

      // IS AUTH
      .addCase(isAuth.pending, (state) => {
        state.isloading = true;
      })
      .addCase(isAuth.fulfilled, (state, action) => {
        state.isloading = false;
        state.user = action.payload.data;
        state.isauthenticated = action.payload.auth;
      })
      .addCase(isAuth.rejected, (state) => {
        state.isloading = false;
      });
  },
});

export default authSlice.reducer;
