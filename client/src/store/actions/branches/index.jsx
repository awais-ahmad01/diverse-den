import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { errorGlobal, successGlobal } from '../../reducers/notifications';

export const getBranches = createAsyncThunk(
    'branches/getBranches',
    async (_, thunkAPI) => {
      try {
        console.log("Get Branches.....");
  
        const token = localStorage.getItem("token");
        console.log("Retrieved Token:", token);
  
        if (!token) {
          thunkAPI.dispatch(errorGlobal('No token found'));
          return;
        }
  
        const response = await axios.get('http://localhost:3000/viewBranches', {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        console.log("Branches:", response.data);
  
        // Dispatch success notification if needed
        thunkAPI.dispatch(successGlobal('Branches fetched successfully'));
        
        return { data: response.data, auth: false };
      } catch (error) {
        // Dispatch error notification
        thunkAPI.dispatch(errorGlobal(error.response?.data?.message || 'Failed to fetch branches'));
        console.log(error)
        throw error;
      }
    }
  );
  