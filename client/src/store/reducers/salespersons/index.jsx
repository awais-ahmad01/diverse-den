import { createSlice } from "@reduxjs/toolkit";
import { addSalesperson } from "../../actions/salespersons";
import { act } from "react";

const default_State = {
    isloading: false,
    salespersons:[]
}


export const salespersonSlice = createSlice({
    name: 'salespersons',
    initialState: default_State,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(addSalesperson.pending, (state, action)=>{
            state.isloading = true
        })

        .addCase(addSalesperson.fulfilled, (state, action)=>{
            state.isloading = false,
            state.lastAdded = action.payload
        })

        .addCase(addSalesperson.rejected, (state, action)=>{
            state.isloading = false
        })
    }
})



export default salespersonSlice.reducer;