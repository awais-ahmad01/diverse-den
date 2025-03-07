import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'


export const listSaleEvents = createAsyncThunk(
    'saleEvents/listSaleEvents',
    async({business, pageNo=1, limit=5})=>{
        try{


            const token = localStorage.getItem("token"); 

            console.log("Retrieved Token auth...:", token);
            if (!token) {
                console.log("No token found!");
                
                return { data:{},auth:false }; 
            }


            const request = await axios.get('http://localhost:3000/branchOwner/viewSaleEvents', 
                {
                    headers: {
                      Authorization: `Bearer ${token}`, 
                      "Content-Type": "application/json",
                    },
                    params: {
                        businessId:business,
                        pageNo,
                        limit                        
                      },
                }
             );

             console.log("SaleEvents data:", request.data)

            
            return {data:request.data.events, metaData: request.data.meta
            }
        }
        catch(error){
            
            throw error;
        }
    }

)




export const getSaleEventById = createAsyncThunk(
    'saleEvents/getSaleEventById',
    async(eventId)=>{
        try{


            const token = localStorage.getItem("token"); 

            console.log("Retrieved Token auth...:", token);
            if (!token) {
                console.log("No token found!");
                
                return { data:{},auth:false }; 
            }


            const request = await axios.get('http://localhost:3000/branchOwner/viewSaleEventById', 
                {
                    headers: {
                      Authorization: `Bearer ${token}`, 
                      "Content-Type": "application/json",
                    },
                    params: {
                        eventId
                        
                      },
                }
             );

             console.log("SaleEvent by Id:", request.data)

            
            return {data:request.data, 
                // metaData: response.data.meta
            }
        }
        catch(error){
            
            throw error;
        }
    }

)








export const getSalesProducts = createAsyncThunk(
    'saleEvents/getSalesProducts',
    async(business)=>{
        try{


            const token = localStorage.getItem("token"); 

            console.log("Retrieved Token auth...:", token);
            if (!token) {
                console.log("No token found!");
                
                return { data:{},auth:false }; 
            }


            const request = await axios.get('http://localhost:3000/branchOwner/viewBusinessProductsbyIdWithoutPagination', 
                {
                    headers: {
                      Authorization: `Bearer ${token}`, 
                      "Content-Type": "application/json",
                    },
                    params: {
                        business,
                      },
                }
             );

             console.log("Products:", request.data)

            
            return {data:request.data.businessProducts}
        }
        catch(error){            
            throw error;
        }
    }

)



export const createSaleEvent = createAsyncThunk(
    'saleEvents/createSaleEvent',
    async(eventData)=>{
        try{

            console.log("Event DAta:", eventData)

            const token = localStorage.getItem("token"); 

            console.log("Retrieved Token auth...:", token);
            if (!token) {
                console.log("No token found!");
                
                return { data:{},auth:false }; 
            }



            const request = await axios.post('http://localhost:3000/branchOwner/createSaleEvent', eventData ,
                {
                    headers: {
                      Authorization: `Bearer ${token}`, 
                      "Content-Type": "application/json",
                    },
                    
                }
             );

            
            return true
        }
        catch(error){
            
            throw error;
        }
    }

)



export const updateSaleEvent = createAsyncThunk(
    'saleEvents/updateSaleEvent',
    async({eventData})=>{
        try{


            const token = localStorage.getItem("token"); 

            console.log("Retrieved Token auth...:", token);
            if (!token) {
                console.log("No token found!");
                
                return { data:{},auth:false }; 
            }


            const request = await axios.post('http://localhost:3000/', eventData ,
                {
                    headers: {
                      Authorization: `Bearer ${token}`, 
                      "Content-Type": "application/json",
                    },
                    
                }
             );

            
            return true
        }
        catch(error){
            
            throw error;
        }
    }

)








export const deleteSaleEvent = createAsyncThunk(
    'saleEvent/deleteSaleEvent',
    async({business,eventId}, {getState, dispatch}) =>{
  
      try {
        console.log("Delete USer.....");
  
        console.log("toremove:", eventId)
    
  
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
          dispatch(errorGlobal('No token found'));
          return;
        }

        const body = {
          
            eventId
        }
  
  
      
  
  
        const response = await axios.post('http://localhost:3000/branchOwner/deleteSaleEvent', body,  {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
  
       
  
        console.log("user Deleted: ", response.data)
  
  
        const {meta} = getState().saleEvents;
        const pageNo = meta.currentPage
        dispatch(listSaleEvents({ business, pageNo}))
  
        return true
  
      } catch (error) {
        console.log(error.response.data.message)
        throw error;
      }    
  
    }
  )

