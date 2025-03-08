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

            
            return {data:request.data.plans}
        }
        catch(error){
            
            throw error;
        }
    }

)



export const getPlanSubscribers = createAsyncThunk(
  'subscriptionPlans/getPlanSubscribers',
  async()=>{
      try{

          

          const request = await axios.get("http://localhost:3000/admin/getPlanSubscribers", 
          
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
  
        const response = await axios.post('http://localhost:3000/admin/addSubscriptionPlan', body)

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
    async({planId, formData}) =>{
  
      try {
        
        const body = {
          planId,
          ...formData
        }   
        
        console.log("Update subscription.....");
  
        console.log("body:", body)
  
  
        const response = await axios.post('http://localhost:3000/admin/updateSubscriptionPlan', body)


        console.log("subs updated: ")  
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
    async(planId, {getState, dispatch}) =>{
  
      try {

        console.log("Delete subscription.....", planId);

        const response = await axios.post('http://localhost:3000/admin/deleteSubscriptionPlan', {planId})

        console.log("subs Deleted: ", response.data)   

  
        return true
  
      } catch (error) {
        console.log("errrrr",error.response.data.message)
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


