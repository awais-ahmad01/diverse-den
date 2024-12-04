import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { errorGlobal, successGlobal } from '../../reducers/notifications';
import { resolvePath } from 'react-router-dom';

export const getBranches = createAsyncThunk(
    'branches/getBranches',
    async ({business, pageNo=1, limit=7}, thunkAPI) => {
      try {
        console.log("Get Branches.....");

        console.log('business:',business)
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
          thunkAPI.dispatch(errorGlobal('No token found'));
          return;
        }
  
        const response = await axios.get('http://localhost:3000/viewBranches', {
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
  
        console.log("Branches:", response.data);
  
      

        console.log(response.data.meta)
        
        return { data: response.data.branches, metaData: response.data.meta, auth: false };
      } catch (error) {
        
        thunkAPI.dispatch(errorGlobal(error.response?.data?.message || 'Failed to fetch branches'));
        console.log(error)
        throw error;
      }
    }
  );


  // export const getBranch = createAsyncThunk(
  //   'branches/getBranch',
  //   async (_id, thunkAPI) => {
  //     try {
  //       console.log("Get Branch.....");

  //       console.log('branchId:', _id)
  
  //       const token = localStorage.getItem("token");
  //       console.log("myToken:", token);
  
  //       if (!token) {
  //         thunkAPI.dispatch(errorGlobal('No token found'));
  //         return;
  //       }
  
  //       const response = await axios.get('http://localhost:3000/', {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       })
  
  //       console.log("Branch:", response.data);
        
  //       return response.data

  //     } catch (error) {
        
  //       thunkAPI.dispatch(errorGlobal(error.response?.data?.message || 'Failed to fetch branch'));
  //       console.log(error)
  //       throw error;
  //     }
  //   }
  // );



  export const updateBranch = createAsyncThunk(
    'branches/updateBranch',
    async ({business, data}, thunkAPI) => {
      try {
        console.log("Update Branch.....");

        console.log('branchId:', business)
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
          thunkAPI.dispatch(errorGlobal('No token found'));
          return;
        }


        const body = {
          data,
          business
        }

  
        const response = await axios.post('http://localhost:3000/', body, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
  
        console.log("Branch:", response.data);

        thunkAPI.dispatch(successGlobal('Branch Updated Successfully!!'))
        
        return true

      } catch (error) {
        
        thunkAPI.dispatch(errorGlobal(error.response?.data?.message || 'Failed to update branch'));
        console.log(error)
        throw error;
      }
    }
  );



export const removeBranch = createAsyncThunk(
  'branches/removeBranches',
  async({toRemove, business}, { dispatch, getState}) =>{

    try {
      console.log("Delete Branch.....");

      console.log("toremove:", toRemove)
      console.log('business:', business)


      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        dispatch(errorGlobal('No token found'));
        return;
      }


      const body = {
        branchCode:toRemove,
        business
      }

      console.log('Body:', body)

      const response = await axios.post('http://localhost:3000/deleteBranch', body,  {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      dispatch(successGlobal('Branch deteled Successfully!!'))

      console.log("Branch Deleted: ", response.data)


      const {meta} = getState().branches;
      const pageNo = meta.currentPage
      dispatch(getBranches({ business, pageNo}))



      return true

    } catch (error) {

      console.log("Errrorrr...")
      
      dispatch(errorGlobal(error.response?.data?.message || 'Failed to delete branch'));
      console.log(error.response.data.message)
      // throw error;
    }    

  }
)



export const getAllBranches = createAsyncThunk(
  'branches/getAllBranches',
  async (business, thunkAPI) => {
    try {
      console.log("Get All Branches.....");

      console.log('business:',business)

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal('No token found'));
        return;
      }

      const response = await axios.get('http://localhost:3000/allBranches', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          business,
        },
      })

      console.log("All Branches: ", response.data)
      
      return { data: response.data.branches };
    } catch (error) {
      
      thunkAPI.dispatch(errorGlobal(error.response?.data?.message || 'Failed to fetch branches'));
      console.log(error)
      throw error;
    }
  }
);




  