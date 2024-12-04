import { createSlice } from "@reduxjs/toolkit";
import { getBranches, getAllBranches } from "../../actions/branches";

let default_state = {
  isloading: false,
  branches: [],
  allBranches: []
  
};

export const branchesSlice = createSlice({
  name: "branches",
  initialState: default_state,
  reducers: {},
  extraReducers: (builder) => {
    builder

    //get Pagination Branches
      .addCase(getBranches.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getBranches.fulfilled, (state, action) => {
        state.isloading = false;
        state.branches = action.payload.data;
        state.meta = action.payload.metaData;
      })
      .addCase(getBranches.rejected, (state) => {
        state.isloading = false;
      })

      //get All branches

      .addCase(getAllBranches.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getAllBranches.fulfilled, (state, action) => {
        state.isloading = false;
        state.allBranches = action.payload.data;
      })
      .addCase(getAllBranches.rejected, (state) => {
        state.isloading = false;
      })

      
  },
});

export default branchesSlice.reducer;
