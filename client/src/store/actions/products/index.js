import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { errorGlobal, successGlobal } from '../../reducers/notifications';

export const addProduct = createAsyncThunk(
    'products/addProduct',
  async (body , thunkAPI) => {
      try {
        console.log("Add Product.....");

        console.log("Body:", body)
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
          thunkAPI.dispatch(errorGlobal('No token found'));
          return;
        }

  
        const response = await axios.post('http://localhost:3000/branchOwner/', body, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
         
        })                     
  
        console.log("product:", response.data);
  
        thunkAPI.dispatch(successGlobal('Product added successfully'));
        
        return { data: response.data};
      } catch (error) {
        console.log("errro000r................")
        thunkAPI.dispatch(errorGlobal(error.response?.data?.message || 'Failed to add product'));
        console.log(error)
        throw error;
      }
    }
  );
