import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'


export const listUsers = createAsyncThunk(
    'users/listUsers',
    async({pageNo=1, limit=7})=>{
        try{

          console.log("List Users.....");

            const response = await axios.get('http://localhost:3000/admin/getAllUsers', 
                {
                    params: {
                        pageNo,
                        limit
                      },
                }
             );

             console.log("All Users:", response.data);

             
            return {data:response.data.users, metaData: response.data.meta}
        }
        catch(error){
            
            throw error;
        }
    }

)



export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async(deleteUserId, {getState, dispatch}) =>{
  
      try {
        console.log("Delete USer.....");
  
        const body = {
          userId: deleteUserId
        }
    

        const response = await axios.post('http://localhost:3000/admin/deleteUserById', body,  {
          
        })
  
       
  
        console.log("user Deleted: ", response.data)
  
  
        const {meta} = getState().users;
        const pageNo = meta.currentPage
        dispatch(listUsers({pageNo}))
  
        return true
  
      } catch (error) {
        console.log(error.response.data.message)
        throw error;
      }    
  
    }
  )




  

export const getUserDetails = createAsyncThunk(
  'users/getUserDetails',
  async(userId)=>{
      try{

        console.log("get User Details.....");

          const response = await axios.get('http://localhost:3000/user/getProfileDetails', 
              {
                  params: {
                      userId
                    },
              }
           );

           console.log("user Datails:", response.data);

           
          return {data:response.data}
      }
      catch(error){
          
          throw error;
      }
  }

)



export const updateUserDetails = createAsyncThunk(
  'users/updateUserDetails',
  async({userId, formData})=>{
      try{

        console.log("update User Details.....");

        const body = {
          userId,
          formData
        }

        console.log("Body:", body);

        const token = localStorage.getItem("token");
        console.log("myToken:", token);

        if (!token) {
          dispatch(errorGlobal("No token found"));
          return;
        }

          const response = await axios.post('http://localhost:3000/user/updateProfileDetails', body, 
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    // 'Content-Type': 'multipart/form-data',
                  
                  },
                }
                 
           );

           console.log("updated user Datails:", response.data);

           
          return response.data
      }
      catch(error){

        console.log("error:", error.response?.data?.message);
          
          throw error;
      }
  }

)




export const updateBusinessDetails = createAsyncThunk(
  'users/updateBusinessDetails',
  async({userId, formData})=>{
      try{

        console.log("update Business Details.....");

        const body = {
          userId,
          formData
        }

        console.log("Body:", body);

        const token = localStorage.getItem("token");
        console.log("myToken:", token);

        if (!token) {
          dispatch(errorGlobal("No token found"));
          return;
        }

          const response = await axios.post('http://localhost:3000/user/updateBusinessDetails', body, 
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    // 'Content-Type': 'multipart/form-data',
                  
                  },
                }
                 
           );

           console.log("updated Business Datails:", response.data);

           
          return response.data
      }
      catch(error){

        console.log("error:", error.response?.data?.message);
          
          throw error;
      }
  }

)



export const updatePassword = createAsyncThunk(
  'users/updatePassword',
  async({userId, formData})=>{
      try{

        console.log("update Password.....");

        const body = {
          userId,
          formData
        }

        console.log("Body:", body);

        const token = localStorage.getItem("token");
        console.log("myToken:", token);

        if (!token) {
          // dispatch(errorGlobal("No token found"));
          return;
        }

          const response = await axios.post('http://localhost:3000/user/updatePassword', body, 
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    // 'Content-Type': 'multipart/form-data',
                  
                  },
                }
                 
           );

           console.log("updated Password:", response.data);

           
          return response.data
      }
      catch(error){

        console.log("error:", error.response?.data?.message);
          
          throw error;
      }
  }

)



export const uploadImage = createAsyncThunk(
  'users/updateImage',
  async({userId, formData})=>{
      try{

        console.log("upload Image.....");

        const body = {
          userId,
          formData
        }

        console.log("Body:", body);

        const token = localStorage.getItem("token");
        console.log("myToken:", token);

        if (!token) {
          dispatch(errorGlobal("No token found"));
          return;
        }

          const response = await axios.post('http://localhost:3000/user/updatePicture', body, 
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                  
                  },
                }
                 
           );

           console.log("uloaded Image:", response.data);

           
          return response.data
      }
      catch(error){

        console.log("error:", error.response?.data?.message);
          
          throw error;
      }
  }

)






