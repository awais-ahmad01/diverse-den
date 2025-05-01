
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'


export const customerLoyaltyPoints = createAsyncThunk(
    'loyaltyPerks/customerLoyaltyPoints',
    async(userId)=>{

        try{

            console.log("userId:", userId);

             const token = localStorage.getItem("token");
                  console.log("myToken:", token);
            
                  if (!token) {
                    thunkAPI.dispatch(errorGlobal("No token found"));
                    return;
                  }
            

            const response = await axios.get('http://localhost:3000/customer/customerLoyaltyPoints' ,
                {

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },

                    params: {
                        userId
                      },
                    
                }
             );


             console.log("customerLoyaltyPoints:", response.data);



            
            return {data: response.data}
        }
        catch(error){

            console.log("errrrr",error.response.data.message)
            
            throw error;
        }
    }

)