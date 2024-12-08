import { createSlice } from "@reduxjs/toolkit";
import { addSalesperson, getSalespersons } from "../../actions/salespersons";

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
            state.lastadded = action.payload
        })

        .addCase(addSalesperson.rejected, (state, action)=>{
            state.isloading = false
        })


        .addCase(getSalespersons.pending, (state, action)=>{
            state.isloading = true
        })
        .addCase(getSalespersons.fulfilled, (state, action)=>{
            state.isloading = false,
            state.salespersons = action.payload.data,
            state.meta = action.payload.metaData
        })
        .addCase(getSalespersons.rejected, (state, action)=>{
            state.isloading = false
            state.salespersons = [];
        })
    }
})

export default salespersonSlice.reducer;