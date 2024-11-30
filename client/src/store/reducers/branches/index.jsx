import { createSlice } from "@reduxjs/toolkit";
import { getBranches } from "../../actions/branches";

let default_state = {
  isloading: false,
  branches: []
};

export const branchesSlice = createSlice({
  name: "branches",
  initialState: default_state,
  reducers: {},
  extraReducers: (builder) => {
    builder

    //get Branches
      .addCase(getBranches.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getBranches.fulfilled, (state, action) => {
        state.isloading = false;
        state.branches = action.payload.data;
      })
      .addCase(getBranches.rejected, (state) => {
        state.isloading = false;
      })

      
  },
});

export default branchesSlice.reducer;
