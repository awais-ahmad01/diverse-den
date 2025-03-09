import { Reviews } from '@mui/icons-material';
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'


export const emptyCart = createAsyncThunk(
    'cart/emptyCart',
    async(userId)=>{

        try{

             const token = localStorage.getItem("token");
                  console.log("myToken:", token);
            
                  if (!token) {
                    thunkAPI.dispatch(errorGlobal("No token found"));
                    return;
                  }
            

            const response = await axios.post('http://localhost:3000/customer/emptyCart', {userId} ,
                {

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                    
                }
             );


             console.log("Empty cart:", response.data);


            
            return true
        }
        catch(error){
            
            throw error;
        }
    }

)