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


        const formdata = new FormData();

        formdata.append('data', JSON.stringify(body.data));
        formdata.append('business', body.business);

        if(body.data.media){
          body.data.media.forEach((file) => {
            formdata.append('media', file);
          });
        }

  
        const response = await axios.post('http://localhost:3000/branchOwner/', formdata, {
          headers: {
            Authorization: `Bearer ${token}`,
            
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
