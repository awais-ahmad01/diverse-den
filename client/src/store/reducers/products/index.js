import { createSlice } from "@reduxjs/toolkit";
import { addProduct } from "../../actions/products";

const default_State = {
    isloading: false,
    products:[]
}


export const addProductSlice = createSlice({
    name: 'salespersons',
    initialState: default_State,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(addProduct.pending, (state, action)=>{
            state.isloading = true
        })

        .addCase(addProduct.fulfilled, (state, action)=>{
            state.isloading = false,
            state.lastadded = action.payload
        })

        .addCase(addProduct.rejected, (state, action)=>{
            state.isloading = false
        })


    }
})

export default addProductSlice.reducer;