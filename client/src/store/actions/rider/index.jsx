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
     
        return;
      }
      


      const response = await axios.post(
        "http://localhost:3000/rider/addRiderDetails",
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





export const getListOfSalesperson = createAsyncThunk(
    "rider/getListOfSalesperson",
    async (riderId, thunkAPI) => {
      try {
        console.log("get list of salesperson.....");
  
      console.log("riderId:", riderId);
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
        
          return;
        }
        
  
  
        const response = await axios.get(
          "http://localhost:3000/rider/listOfSalesperson/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },

            params: {
              riderId,
            },
          }
        );
  
        console.log("salesperson List:", response.data);
  
       
  
        return {data: response.data.branches};
      } catch (error) {
        
        console.log(error.response.data.message);
        throw error;
      }
    }
  );





  
export const getUserChats = createAsyncThunk(
    "rider/getUserChats",
    async (userId, thunkAPI) => {
      try {
        console.log("get user chats.....");
  
     console.log("userId:", userId);
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
        
          return;
        }
        
  
  
        const response = await axios.get(
          "http://localhost:3000/api/chats/fetchChats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },

            params: {
              userId,
            },
          }
        );
  
        console.log("UserChatssssss:", response.data);
  
       
  
        return {data: response.data};
      } catch (error) {
        
        console.log(error.response.data.message);
        throw error;
      }
    }
  );




//   salesperson chat

export const getListOfRiders = createAsyncThunk(
    "rider/getListOfRiders",
    async (userId, thunkAPI) => {
      try {
        console.log("get list of riders....");
  
      console.log("iserId:", userId);
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
         
          return;
        }
        
  
  
        const response = await axios.get(
          "http://localhost:3000/branchOwner/listAllRiders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },

            params: {
              userId
            },
          }
        );
  
        console.log("Ridersssss List:", response.data);
  
       
  
        return {data: response.data};
      } catch (error) {
        
        console.log("errorrrr:",error.response.data.message);
        throw error;
      }
    }
  );




  export const getAllRiders = createAsyncThunk(
    "rider/getAllRiders",
    async ({pageNo=1, limit=7},thunkAPI) => {
      try {
        console.log("get list of All riders....");
  
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
       
          return;
        }
        
  
  
        const response = await axios.get(
          "http://localhost:3000/admin/getAllRiders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              pageNo,
              limit
            },
          }
        );
  
        console.log("Ridersssss List:", response.data);
  
       
  
        return {data: response.data.data, metaData: response.data.meta};
      } catch (error) {
        
        console.log("errorrrr:",error.response.data.message);
        throw error;
      }
    }
  );






  export const approveRider = createAsyncThunk(
    "rider/approveRider",
    async ({riderId}, thunkAPI) => {
      try {
        console.log("Approve Rider.....");

        console.log("riderId:", riderId);
  
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
       
          return;
        }
        
  
  
        const response = await axios.post(
          "http://localhost:3000/admin/approveRider", {riderId},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },

          }
        );
  
        console.log("Rider approved:", response.data);
  
       
  
        return true;
      } catch (error) {
        
        console.log("errorrrr:",error.response.data.message);
        throw error;
      }
    }
  );



  export const rejectRider = createAsyncThunk(
    "rider/rejectRider",
    async ({riderId}, thunkAPI) => {
      try {
        console.log("reject Rider.....");

        console.log("riderId:", riderId);
  
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
         
          return;
        }
        
  
  
        const response = await axios.post(
          "http://localhost:3000/admin/rejectRider", {riderId},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },

          }
        );
  
        console.log("Rider rejected:", response.data);
  
       
  
        return true;
      } catch (error) {
        
        console.log("errorrrr:",error.response.data.message);
        throw error;
      }
    }
  );



  export const deleteRider = createAsyncThunk(
    "rider/rejectRider",
    async ({riderId}, thunkAPI) => {
      try {
        console.log("dleete Rider.....");

        console.log("riderId:", riderId);
  
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
         
          return;
        }
        
  
  
        const response = await axios.post(
          "http://localhost:3000/admin/deleteRider", {riderId},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },

          }
        );
  
        console.log("Rider deleted:", response.data);
  
       
  
        return true;
      } catch (error) {
        
        console.log("errorrrr:",error.response.data.message);
        throw error;
      }
    }
  );




  
  
  












