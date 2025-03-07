import { tableBodyClasses } from '@mui/material';
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'


export const getSubscriptionPlans = createAsyncThunk(
    'subscriptionPlans/getSubscriptionPlans',
    async()=>{
        try{


            const token = localStorage.getItem("token"); 

            console.log("Retrieved Token auth...:", token);
            if (!token) {
                console.log("No token found!");
                
                return { data:{},auth:false }; 
            }


            const request = await axios.get("http://localhost:3000/subscriptionPlans", 
              {
                headers: {
                  Authorization: `Bearer ${token}`, 
                  "Content-Type": "application/json",
                },
              }
            );

            console.log("Plansss:", request.data)

            
            return {data:request.data.allplans}
        }
        catch(error){
            
            throw error;
        }
    }

)



export const viewActiveSubscriptionPlan = createAsyncThunk(
  'subscriptionPlans/viewActiveSubscriptionPlan',
  async(businessId)=>{
      try{


          const token = localStorage.getItem("token"); 

          console.log("Retrieved Token auth...:", token);
          if (!token) {
              console.log("No token found!");
              
              return { data:{},auth:false }; 
          }


          const request = await axios.get('http://localhost:3000/branchOwner/viewSubscriptionPlan', 
              {
                  headers: {
                    Authorization: `Bearer ${token}`, 
                    "Content-Type": "application/json",
                  },
                  params:{
                    businessId
                  }
                  
              }
           );

           console.log("Active Subscription Plan: ", request.data)


          
          return {data:request.data.planDetails}
      }
      catch(error){
          
          throw error;
      }
  }

)







export const addSubscriptionPlan = createAsyncThunk(
    'subscriptionPlans/addSubscriptionPlan',
    async(body) =>{
  
      try {
        console.log("Delete USer.....");
  
        console.log("toremove:", body)
    
  
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
          dispatch(errorGlobal('No token found'));
          return;
        }
  
  
      
  
  
        const response = await axios.post('http://localhost:3000/', body,  {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        console.log("subs added: ", response.data)   
  
        return true
  
      } catch (error) {
        console.log(error.response.data.message)
        throw error;
      }    
  
    }
  )


  export const updateSubscriptionPlan = createAsyncThunk(
    'subscriptionPlans/addSubscriptionPlan',
    async(body) =>{
  
      try {
        console.log("Delete USer.....");
  
        console.log("toremove:", body)
    
  
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
          dispatch(errorGlobal('No token found'));
          return;
        }
  
  
      
  
  
        const response = await axios.post('http://localhost:3000/', body,  {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        console.log("subs updated: ", response.data)   
  
        return true
  
      } catch (error) {
        console.log(error.response.data.message)
        throw error;
      }    
  
    }
  )




export const deleteSubscriptionPlan = createAsyncThunk(
    'subscriptionPlans/deleteSubscriptionPlan',
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
  
  
      
  
  
        const response = await axios.post('http://localhost:3000/', toRemove,  {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        console.log("subs Deleted: ", response.data)   
  
        return true
  
      } catch (error) {
        console.log(error.response.data.message)
        throw error;
      }    
  
    }
  )



  export const cancelSubscriptionPlan = createAsyncThunk(
    'subscriptionPlans/cancelSubscriptionPlan',
    async(userId, { dispatch }) =>{
  
      try {

        console.log("UserId:", userId)
        
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
          dispatch(errorGlobal('No token found'));
          return;
        }

        const response = await axios.post('http://localhost:3000/branchOwner/cancelSubscriptionPlan', { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        console.log("cancelled: ", response.data)   
  
        return true
  
      } catch (error) {
        console.log(error.response.data.message)
        throw error;
      }    
  
    }
  )


