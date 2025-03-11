import { createSlice } from "@reduxjs/toolkit";
import { getBranches, getAllBranches, getBranchProducts, getVariantRemainings, getBranchProductDetails
  , getBranchProductsByBranchCode
 } from "../../actions/branches";

let default_state = {
  isloading: false,
  branches: [],
  allBranches: [],
  branchProducts: [],
  variants: [],
  branchProductDetails:[],
  branchProductsByBranchCode:[]
  
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



      .addCase(getBranchProductsByBranchCode.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getBranchProductsByBranchCode.fulfilled, (state, action) => {
        state.isloading = false;
        state.branchProductsByBranchCode = action.payload.data;
        
      })
      .addCase(getBranchProductsByBranchCode.rejected, (state) => {
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



      .addCase(getBranchProductDetails.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getBranchProductDetails.fulfilled, (state, action) => {
        state.isloading = false;
        state.branchProductDetails = action.payload.data;
        
      })
      .addCase(getBranchProductDetails.rejected, (state) => {
        state.isloading = false;
      })



     

      
  },
});

export default branchesSlice.reducer;
