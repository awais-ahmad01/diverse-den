import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'


export const listUsers = createAsyncThunk(
    'users/listUsers',
    async({pageNo=1, limit=7})=>{
        try{


            const token = localStorage.getItem("token"); 

            console.log("Retrieved Token auth...:", token);
            if (!token) {
                console.log("No token found!");
                
                return { data:{},auth:false }; 
            }


            const request = await axios.get('http://localhost:3000/', 
                {
                    headers: {
                      Authorization: `Bearer ${token}`, 
                      "Content-Type": "application/json",
                    },
                    params: {
                        pageNo,
                        limit
                      },
                }
             );

            
            return {data:request.data.users, metaData: response.data.meta}
        }
        catch(error){
            
            throw error;
        }
    }

)



export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async({toRemove}, {getState}) =>{
  
      try {
        console.log("Delete USer.....");
  
        console.log("toremove:", toRemove)
    
  
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
          dispatch(errorGlobal('No token found'));
          return;
        }
  
  
      
  
  
        const response = await axios.post('http://localhost:3000/deleteBranch', toRemove,  {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
  
       
  
        console.log("user Deleted: ", response.data)
  
  
        const {meta} = getState().users;
        const pageNo = meta.currentPage
        dispatch(listUsers({ business, pageNo}))
  
        return true
  
      } catch (error) {
        console.log(error.response.data.message)
        throw error;
      }    
  
    }
  )
