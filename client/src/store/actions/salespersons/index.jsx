import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { errorGlobal, successGlobal } from '../../reducers/notifications';

export const addSalesperson = createAsyncThunk(
    'salesperson/addSalesperson',
    async ( data , thunkAPI) => {
      try {
        console.log("Add Salesperson.....");

        console.log('Data: ',data)
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
          thunkAPI.dispatch(errorGlobal('No token found'));
          return;
        }
  
        const response = await axios.post('http://localhost:3000/', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
         
        })                     
  
        console.log("Salesperson:", response.data);
  
        thunkAPI.dispatch(successGlobal('Salesperson added successfully'));
        
        return { data: response.data, auth: false };
      } catch (error) {
        
        thunkAPI.dispatch(errorGlobal(error.response?.data?.message || 'Failed to add salesperson'));
        console.log(error)
        throw error;
      }
    }
  );