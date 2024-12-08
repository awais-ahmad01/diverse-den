import { createSlice } from "@reduxjs/toolkit";
import { addProduct, getProducts } from "../../actions/products";

const default_State = {
    isloading: false,
    products:[]
}


export const addProductSlice = createSlice({
    name: 'products',
    initialState: default_State,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(addProduct.pending, (state)=>{
            state.isloading = true
        })

        .addCase(addProduct.fulfilled, (state, action)=>{
            state.isloading = false,
            state.lastadded = action.payload
        })

        .addCase(addProduct.rejected, (state)=>{
            state.isloading = false
        })

        .addCase(getProducts.pending, (state) => {
            state.isloading = true;
          })
          .addCase(getProducts.fulfilled, (state, action) => {
            state.isloading = false;
            state.products = action.payload.data;
            state.meta = action.payload.metaData;
          })
          .addCase(getProducts.rejected, (state) => {
            state.isloading = false;
            state.products = [];
          })


    }
})

export default addProductSlice.reducer;