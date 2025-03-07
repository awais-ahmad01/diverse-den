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
