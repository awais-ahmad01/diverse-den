import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const addGiftCard = createAsyncThunk(
    "giftCards/addGiftCard",
    async ({ businessId, formdata }, thunkAPI) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          thunkAPI.dispatch(errorGlobal("No token found"));
          return;
        }
  
        // Append businessId to the FormData
        formdata.append("businessId", businessId);
  
        const response = await axios.post(
          "http://localhost:3000/branchOwner/addGiftCard",
          formdata, // Send FormData directly as the body
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data", // Important for file uploads
            },
          }
        );

        console.log("Gift Card data:", response.data);

        return true;
      } catch (error) {
        console.error("Error adding gift card:", error.response?.data?.message || error.message);
        throw error;
      }
    }
  );



  export const updateGiftCard = createAsyncThunk(
    "giftCards/updateGiftCard",
    async ({ businessId, formdata }, thunkAPI) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          thunkAPI.dispatch(errorGlobal("No token found"));
          return;
        }
  
        // Log FormData contents before sending
     
  
        formdata.append("businessId", businessId);


        console.log("FormData contents:");
        for (let [key, value] of formdata.entries()) {
          console.log(`${key}:`, value);
        }
  
        const response = await axios.post(
          "http://localhost:3000/branchOwner/updateGiftCardDetails",
          formdata,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        console.log("Update Gift Card response:", response.data);
        return response.data; // Return the actual response data instead of just true
      } catch (error) {
        console.error("Error updating gift card:", error.response?.data?.message || error.message);
        throw error;
      }
    }
  );




export const getGiftCards = createAsyncThunk(
  "giftCards/getGiftCards",
  async ({ businessId, pageNo = 1, limit = 7 }, thunkAPI) => {
    try {
      console.log("Get Gift Cards.....");

      console.log("business:", businessId);

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
      
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/branchOwner/listBusinessGiftCards",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            businessId,
            pageNo,
            limit,
          },
        }
      );

      console.log("Gift Cards data:", response.data);

      console.log('metadata',response.data.meta);

      return {
        data: response.data,
        metaData: response.data.meta,
      };
    } catch (error) {
      
      console.log(error.response.data);
      throw error;
    }
  }
);



export const getAllGiftCards = createAsyncThunk(
    "giftCards/getAllGiftCards",
    async ( thunkAPI) => {
      try {
        console.log("Get All Gift Cards.....");
  
   
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
        
          return;
        }
  
        const response = await axios.get(
          "http://localhost:3000/branchOwner/listAllGiftCards",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          }
        );
  
        console.log("Gift Cards data:", response.data);
  
     
  
        return {
          data: response.data,
     
        };
      } catch (error) {
        
        console.log(error.response.data);
        throw error;
      }
    }

  );



  export const getGiftCardById = createAsyncThunk(
    "products/getGiftCardById",
    async (id, thunkAPI) => {
      try {
        console.log("Get Gift Card.....");
  
        console.log("giftCardId:", id);
  
        
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
        
          return;
        }
  
        const response = await axios.get(
          "http://localhost:3000/branchOwner/viewGiftCardDetails",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params: {
              giftCardId: id
            },
          }
        );
  
        console.log("Gift Cards data:", response.data);
  
  
        return {
          data: response.data,
      
        };
      } catch (error) {
        
        console.log(error.response.data);
        throw error;
      }
    }
  );
  





export const deleteGiftCard = createAsyncThunk(
  "giftCards/deleteGiftCard",
  async (giftCardId, { dispatch, getState }) => {
    try {
      console.log("Delete Guft Card.....");

      console.log("toremove:", giftCardId);

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
       
        return;
      }


      const response = await axios.post(
        "http://localhost:3000/branchOwner/deleteGiftCard",
        {giftCardId},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      console.log("gift card Deleted: ", response.data);

      const { meta } = getState().giftCards;
      const pageNo = meta.currentPage;
      dispatch(getGiftCards({ business, pageNo }));

      return true;
    } catch (error) {
      console.log("Errrorrr...");
      console.log(error.response.data.message);
      throw error;
    }
  }
);




export const placeGiftCardOrder = createAsyncThunk(
    "giftCards/placeGiftCardOrder",
    async (orderData, thunkAPI) => {
      try {

        console.log("Place Gift Card Order.....");

        console.log("orderData:", orderData);

        const token = localStorage.getItem("token");
        if (!token) {
         
          return;
        }
  
    
  
        const response = await axios.post(
          "http://localhost:3000/customer/purchaseAndSendGiftCard",
          orderData, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Gift Card Order:", response.data);

        return true;
      } catch (error) {
        console.error("Error adding gift card:", error.response?.data?.message || error.message);
        throw error;
      }
    }
  );