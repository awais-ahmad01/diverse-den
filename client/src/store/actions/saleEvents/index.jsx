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
    async(eventId, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token"); 
        console.log("Fetching sale event with ID:", eventId);
        console.log("Retrieved Token auth:", token);
        
        if (!token) {
          console.log("No token found!");
          return rejectWithValue("Authentication required");
        }
  
        const response = await axios.get('http://localhost:3000/branchOwner/viewSaleEventById', 
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
  
        console.log("SaleEvent by Id response:", response.data);
        
        // Check if the response data has the expected structure
        if (!response.data) {
          console.error("API response missing data");
          return rejectWithValue("Invalid API response");
        }
        
        return {

          data: response.data
        };
      }
      catch(error) {
        console.error("Error fetching sale event:", error);
        return rejectWithValue(error.message || "Failed to fetch sale event");
      }
    }
  );








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
    async(formData)=>{
        try{

            console.log("Form Data:", formData)

            const token = localStorage.getItem("token"); 

            console.log("Retrieved Token auth...:", token);
            if (!token) {
                console.log("No token found!");
                
                return { data:{},auth:false }; 
            }


            const request = await axios.post('http://localhost:3000/branchOwner/createSaleEvent', formData ,
                {
                    headers: {
                      Authorization: `Bearer ${token}`, 
                      "Content-Type": "multipart/form-data",
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



// export const updateSaleEvent = createAsyncThunk(
//     'saleEvents/updateSaleEvent',
//     async({formData, eventId})=>{
//         try{


//             const token = localStorage.getItem("token"); 

//             console.log("Retrieved Token auth...:", token);
//             if (!token) {
//                 console.log("No token found!");
                
//                 return { data:{},auth:false }; 
//             }


//             const request = await axios.post('http://localhost:3000/branchOwner/updateSaleEvent', {formData, eventId} ,
//                 {
//                     headers: {
//                       Authorization: `Bearer ${token}`, 
//                       "Content-Type": "application/json",
//                     },
                    
//                 }
//              );

            
//             return true
//         }
//         catch(error){

//           console.log(error.response.data.message)
            
//             throw error;
//         }
//     }

// )



export const updateSaleEvent = createAsyncThunk(
  'saleEvents/updateSaleEvent',
  async({formData, eventId}) => {
      try {
          const token = localStorage.getItem("token");
          
          console.log("Retrieved Token auth...:", token);
          if (!token) {
              console.log("No token found!");
              return { data:{}, auth:false }; 
          }
          
          // Extract products from FormData and parse it
          const productsString = formData.get('products');
          const products = JSON.parse(productsString);
          
          // Extract other fields from FormData
          const name = formData.get('name');
          const description = formData.get('description');
          const startDate = formData.get('startDate');
          const endDate = formData.get('endDate');
          const discountType = formData.get('discountType');
          const discountValue = formData.get('discountValue');
          const businessId = formData.get('businessId');
          
          // Create request data structure that matches the backend expectations
          const requestData = {
              eventId,
              name,
              description,
              startDate,
              endDate,
              discountType,
              discountValue,
              products,
              businessId
          };
          
          // If there's an image in the FormData, we need to use multipart/form-data
          if (formData.get('image')) {
              // Create a new FormData to send
              const dataToSend = new FormData();
              
              // Add all the JSON data as a single field
              dataToSend.append('data', JSON.stringify(requestData));
              
              // Add the image
              dataToSend.append('image', formData.get('image'));
              
              const request = await axios.post(
                  'http://localhost:3000/branchOwner/updateSaleEvent', 
                  dataToSend,
                  {
                      headers: {
                          Authorization: `Bearer ${token}`,
                          'Content-Type': 'multipart/form-data',
                      }
                  }
              );
              
              return true;
          } else {
              // No image, send as JSON
              const request = await axios.post(
                  'http://localhost:3000/branchOwner/updateSaleEvent', 
                  requestData,
                  {
                      headers: {
                          Authorization: `Bearer ${token}`,
                          'Content-Type': 'application/json',
                      }
                  }
              );
              
              return true;
          }
      } catch(error) {
          console.log(error.response?.data?.message || error.message);
          throw error;
      }
  }
);







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






export const getAllSaleEvents = createAsyncThunk(
    'saleEvents/getAllSaleEvents',
    async()=>{
        try{


            const request = await axios.get('http://localhost:3000/branchOwner/viewAllSaleEvents');

             console.log("sale events:", request.data)

            
            return {data:request.data}
        }
        catch(error){            
            throw error;
        }
    }

)




export const getSaleEventByIdWithProductDetails = createAsyncThunk(
  'saleEvents/getSaleEventByIdWithProductDetails',
  async(eventId)=>{
      try{


          const request = await axios.get('http://localhost:3000/branchOwner/viewSaleEventByIdWithProductDetails',
            {
              params: {
                eventId,
              },
            }
          );

           console.log("sale events in details:", request.data)

          
          return {data:request.data}
      }
      catch(error){            
          throw error;
      }
  }

)

