import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { errorGlobal, successGlobal } from "../../reducers/notifications";

export const listOrders = createAsyncThunk(
  "orders/listOrders",
  async ({business, pageNo=1, limit=7}, thunkAPI) => {
    try {
      console.log("List Orders.....");


  

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal("No token found"));
        return;
      }

      

      const response = await axios.get(
        "http://localhost:3000/getOrders",
        
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params:{
            business,
            pageNo,
            limit,
          }
        }
      );

      console.log("Orders:", response.data);
      return { data: response.data.businessOrders, metaData: response.data.meta, };
    } catch (error) {
      console.log("errro000r................");
      thunkAPI.dispatch(
        errorGlobal(error.response?.data?.message || "Failed to get Orders")
      );
      console.log(error);
      throw error;
    }
  }
);