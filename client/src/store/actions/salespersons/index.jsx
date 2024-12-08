import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { errorGlobal, successGlobal } from '../../reducers/notifications';

export const addSalesperson = createAsyncThunk(
    'salespersons/addSalesperson',
  async (body , thunkAPI) => {
      try {
        console.log("Add Salesperson.....");

        console.log("Body:", body)
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
          thunkAPI.dispatch(errorGlobal('No token found'));
          return;
        }

  
        const response = await axios.post('http://localhost:3000/branchOwner/addSalesperson', body, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
         
        })                     
  
        console.log("Salesperson:", response.data);
  
        thunkAPI.dispatch(successGlobal('Salesperson added successfully'));
        
        return { data: response.data};
      } catch (error) {
        console.log("errro000r................")
        thunkAPI.dispatch(errorGlobal(error.response?.data?.message || 'Failed to add salesperson'));
        console.log(error)
        throw error;
      }
    }
  );



  export const getSalespersons = createAsyncThunk(
    'salespersons/getSalespersons',
    async ({business, pageNo=1, limit=7}, thunkAPI) => {
      try {
        console.log("Get Salespersons.....");

        console.log('business:',business)
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
          thunkAPI.dispatch(errorGlobal('No token found'));
          return;
        }
  
        const response = await axios.get('http://localhost:3000/branchOwner/viewSalesperson', {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            business,
            pageNo,
            limit
          },
        })
  
        console.log("viewSalesperson:", response.data);

        console.log(response.data.meta)
        
        return { data: response.data.salesperson, metaData: response.data.meta};
      } catch (error) {
        
        thunkAPI.dispatch(errorGlobal(error.response?.data?.message || 'Failed to fetch Salespersons'));
        console.log(error)
        throw error;
      }
      
    }
  );


  export const removeSalesperson = createAsyncThunk(
    'salespersons/removeSalesperson',
    async({toRemove, business}, { dispatch, getState}) =>{
  
      try {
        console.log("Delete Salesperson!!!.....");
  
        console.log("toremove:", toRemove)
      
  
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
          dispatch(errorGlobal('No token found'));
          return;
        }
  
  
        const body = {
          salespersonId:toRemove,
        }
  
        console.log('Body:', body)
  
        const response = await axios.post('http://localhost:3000/branchOwner/deleteSalesperson', body,  {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
  
        dispatch(successGlobal(response?.data?.message || 'Salesperson deleted Successfully!!!'))
  
        console.log("Salepersons Deleted!!!!: ", response.data)

        const {meta} = getState().salespersons;
        const pageNo = meta.currentPage
        dispatch(getSalespersons({ business, pageNo}))

        return true
  
      } catch (error) {
        console.log("Errrorrr!!!...")
        dispatch(errorGlobal(error.response?.data?.message || 'Failed to delete Salesperson'));
        console.log("Fuck...")
        console.log(error.response.data.message)
        // throw error;
      }    
  
    }
  )
  