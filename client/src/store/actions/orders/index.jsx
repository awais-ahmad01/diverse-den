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
    
      console.log(error);
      throw error;
    }
  }
);




export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({orderId, status}, thunkAPI) => {
    try {

      console.log("Status data:", orderId, status);

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal("No token found"));
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/updateOrderStatus",
        {
          orderId,
          status,
        },
        
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        }
      );

      console.log("status:", response.data);
      return true;
     
    } catch (error) {
      console.log("errro000r................");
     
      console.log(error);
      throw error;
    }
  }
);




export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async ({deleteOrderId, business}, {getState, dispatch}) => {
    try {

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        dispatch(errorGlobal('No token found'));
        return;
      }


      const body = {
        orderId: deleteOrderId
      }

      console.log('Body:', body)

      const response = await axios.post('http://localhost:3000/deleteOrder', body,  {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

     

      console.log("order Deleted: ", response.data)


      const {meta} = getState().orders;
      const pageNo = meta.currentPage
      dispatch(listOrders({ business, pageNo}))

      return true

     
    } catch (error) {
      console.log("errro000r................");
     
      console.log(error);
      throw error;
    }
  }
);





export const listPaymentHistory = createAsyncThunk(
  "orders/listPaymentHistory",
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
        "http://localhost:3000/",
        
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
      return { data: response.data.paymentHistory, paymentMetaData: response.data.meta, };
    } catch (error) {
      console.log("errro000r................");
      console.log(error);
      throw error;
    }
  }
);

