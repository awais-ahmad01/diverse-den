import { createSlice } from "@reduxjs/toolkit";
import { getBranches, getAllBranches, getBranchProducts, getVariantRemainings } from "../../actions/branches";

let default_state = {
  isloading: false,
  branches: [],
  allBranches: [],
  branchProducts: [],
  variants: [],
  
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
        state.branches = [];
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



      .addCase(getBranchProducts.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getBranchProducts.fulfilled, (state, action) => {
        state.isloading = false;
        state.branchProducts = action.payload.data;
        state.branchMeta = action.payload.metaData;
      })
      .addCase(getBranchProducts.rejected, (state) => {
        state.isloading = false;
      })



      .addCase(getVariantRemainings.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getVariantRemainings.fulfilled, (state, action) => {
        state.isloading = false;
        state.variants = action.payload.data;
        
      })
      .addCase(getVariantRemainings.rejected, (state) => {
        state.isloading = false;
      })



     

      
  },
});

export default branchesSlice.reducer;
