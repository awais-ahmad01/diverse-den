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




export const getSalespersonOrders = createAsyncThunk(
  "orders/getSalespersonOrders",
  async ({branchCode, pageNo=1, limit=25}, thunkAPI) => {
    try {
      console.log("List Orders.....");

      console.log('branchCode:',branchCode)

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal("No token found"));
        return;
      }

      

      const response = await axios.get(
        "http://localhost:3000/getSalespersonOrders",
        
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params:{
            branchCode,
            pageNo,
            limit,
          }
        }
      );

      console.log("Orders:", response.data);
      return { data: response.data.branchOrders, metaData: response.data.meta, };
    } catch (error) {
      console.log("errro000r................");
    
      console.log(error);
      throw error;
    }
  }
);




export const assignOrderToBranch = createAsyncThunk(
  "orders/assignOrderToBranch",
  async ({orderId, branch, cartItems}, thunkAPI) => {
    try {

      console.log("Status data:", orderId, branch);

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal("No token found"));
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/assignOrderToBranch",
        {
          orderId,
          branch,
          cartItems
        },
        

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        }
      );

      console.log("branch assigned:", response.data);
      return true;
     
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Unknown error occurred";
      console.log("branch assign error", errorMessage);
      
      // Important: Reject with the error message to propagate it to the catch block
      return thunkAPI.rejectWithValue(errorMessage);
    
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








export const assignOrderToRider= createAsyncThunk(
  "orders/assignOrderToRider",
  async ({orderId, riderId}, thunkAPI) => {
    try {

      console.log("Status data:", orderId, riderId);

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal("No token found"));
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/assignOrderToRider",
        {
          orderId,
          riderId
        },
        

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        }
      );

      console.log("order assigned:", response.data);
      return true;
     
    } catch (error) {
      console.log("errro000r................");
     
      console.log(error.response.data.message); 
      throw error;
    }
  }
);




export const getRiderOrders = createAsyncThunk(
  "orders/getRiderOrders",
  async (riderId, thunkAPI) => {
    try {
      console.log("List Orders.....");

      console.log('riderId:',riderId)

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal("No token found"));
        return;
      }

      
      

      const response = await axios.get(
        "http://localhost:3000/rider/riderOrdersById",
        
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params:{
            riderId
          }
        }
      );

      console.log("rider Orders:", response.data);
      return { data: response.data.orders };
    } catch (error) {
      console.log("errro000r................");
    
      console.log(error?.response?.data?.message);
      throw error;
    }
  }
);


export const statusChangeByRider= createAsyncThunk(
  "orders/statusChangeByRider",
  async ({orderId, status, riderId}, thunkAPI) => {
    try {

      console.log("Status data:", orderId, riderId, status);

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal("No token found"));
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/rider/riderOrderStatus",
        {
          orderId,
          riderId, status
        },
        

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        }
      );

      console.log("status changed:", response.data);
      return true;
     
    } catch (error) {
      console.log("errro000r................");
     
      console.log(error.response.data.message); 
      throw error;
    }
  }
);

