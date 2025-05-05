import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const addRiderDetails = createAsyncThunk(
  "rider/addRiderDetails",
  async (formData, thunkAPI) => {
    try {
      console.log("Add rider Details.....");

      console.log("formData:", formData);

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal("No token found"));
        return;
      }
      


      const response = await axios.post(
        "http://localhost:3000/branchOwner/addProduct",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("riderDetails:", response.data);

     

      return true;
    } catch (error) {
      
      console.log(error.response.data.message);
      throw error;
    }
  }
);














