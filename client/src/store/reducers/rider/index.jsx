import { createSlice } from "@reduxjs/toolkit";


let default_state = {
  isloading: false,
  
};

export const saleEventsSlice = createSlice({
  name: "saleEvents",
  initialState: default_state,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      
  },
});


export default saleEventsSlice.reducer;