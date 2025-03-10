import { Reviews } from '@mui/icons-material';
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'


export const listBusinesses = createAsyncThunk(
    'businesses/listBusinesses',
    async({pageNo=1, limit=6})=>{
        try{

            const response = await axios.get('http://localhost:3000/admin/getAllBussinesses', 
                {
                    params: {
                        pageNo,
                        limit
                      },
                }
             );


             console.log("All Businesses:", response.data);


            
            return {data:response.data.businesses, metaData: response.data.meta}
        }
        catch(error){
            
            throw error;
        }
    }

)



export const deleteBusiness = createAsyncThunk(
    'businesses/deleteBusiness',
    async(deleteBusinessId, {dispatch, getState}) =>{
  
      try {
        console.log("Delete Business.....");
  
  
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
          dispatch(errorGlobal('No token found'));
          return;
        }

        const body = {
          businessId: deleteBusinessId
        }
  
  
      
  
  
        const response = await axios.post('http://localhost:3000/admin/deleteBusinessById', body,  
        )
  
       
  
        console.log("business Deleted: ", response.data)
  
  
        const {meta} = getState().businesses;
        const pageNo = meta.currentPage
        dispatch(listBusinesses({pageNo}))
  
        return true
  
      } catch (error) {
        console.log(error.response.data.message)
        throw error;
      }    
  
    }
  )



  export const enableBusiness = createAsyncThunk(
    'businesses/enableBusiness',
    async(business)=>{
        try{


            const token = localStorage.getItem("token"); 

            console.log("Retrieved Token auth...:", token);
            if (!token) {
                console.log("No token found!");
                
                return { data:{},auth:false }; 
            }


            const request = await axios.post('http://localhost:3000/', business,
                {
                    headers: {
                      Authorization: `Bearer ${token}`, 
                      "Content-Type": "application/json",
                    },
                   
                }
             );

            
            return true;
        }
        catch(error){
            
            throw error;
        }
    }

)



export const disableBusiness = createAsyncThunk(
    'businesses/disableBusiness',
    async(business)=>{
        try{


            const token = localStorage.getItem("token"); 

            console.log("Retrieved Token auth...:", token);
            if (!token) {
                console.log("No token found!");
                
                return { data:{},auth:false }; 
            }


            const request = await axios.post('http://localhost:3000/', business,
                {
                    headers: {
                      Authorization: `Bearer ${token}`, 
                      "Content-Type": "application/json",
                    },
                   
                }
             );

            
            return true;
        }
        catch(error){
            
            throw error;
        }
    }

)






export const getBusinessProducts = createAsyncThunk(
  "businesses/getBusinessProducts",
  async ({businessId, pageNo=1, limit=7}, thunkAPI) => {
    try {

      console.log("BusinessID:", businessId)

      const token = localStorage.getItem("token"); 

            console.log("Retrieved Token auth...:", token);
            if (!token) {
                console.log("No token found!");
                
                return { data:{},auth:false }; 
            }
    

      const response = await axios.get(
        "http://localhost:3000/branchOwner/viewBusinessProductsById",
      
        {
          
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
          params: {
            business: businessId, 
            pageNo,
            limit
          },
        }
      );

      console.log("business products:", response.data);

      return { data: response.data.businessProducts, metaData: response.data.meta };
    } catch (error) {
      console.log("errro000r................");
    
      console.log(error);
      throw error;
    }
  }
);



export const deleteBusinessProduct = createAsyncThunk(
  "businesses/deleteBusinessProduct ",
  async ({ toRemove, business }, { dispatch, getState }) => {
    try {
      console.log("Delete Product.....");

      console.log("toremove:", toRemove);

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        dispatch(errorGlobal("No token found"));
        return;
      }

      const body = {
        productId: toRemove,
      };

      const response = await axios.post(
        "http://localhost:3000/branchOwner/deleteProductById",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      console.log("product Deleted: ", response.data);

      const { productsMeta } = getState().businesses;
      const pageNo = productsMeta.currentPage;
      dispatch(getBusinessProducts({ businessId: business, pageNo }));

      return true;
    } catch (error) {
      console.log("Errrorrr...");

      console.log(error.response.data.message);
      throw error;
    }
  }
);







// product Reviews


export const getBusinessProductReviews = createAsyncThunk(
  "businesses/getBusinessProductReviews",
  async ({businessId, pageNo=1, limit=7}, thunkAPI) => {
    try {

      console.log("BusinessID:", businessId)

      const token = localStorage.getItem("token"); 

            console.log("Retrieved Token auth...:", token);
            if (!token) {
                console.log("No token found!");
                
                return { data:{},auth:false }; 
            }
    

      const response = await axios.get(
        "http://localhost:3000/branchOwner/viewBusinessProductsReviews",
      
        {
          
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
          params: {
            businessId, 
            pageNo,
            limit
          },
        }
      );

      console.log("business Reviewss:", response.data);



      return { data: response.data.products, metaData: response.data.meta };
    } catch (error) {
      console.log("errro000r................");
    
      console.log(error.response.data.message);
      throw error;
    }
  }
);




export const deleteSpecificCustomerReview = createAsyncThunk(
  "businesses/deleteProductReview",
  async (reviewId, {thunkAPI, getState}) => {
    try {

    
    
      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal("No token found"));
        return;
      }
    

      const response = await axios.post(
        "http://localhost:3000/branchOwner/deleteSpecificCustomerReview",
        reviewId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(" delete customer Review:", response.data);

      // const { reviewsMeta } = getState().businesses;
      //       const pageNo = reviewsMeta.currentPage;
      //       dispatch(getBusinessProductReviews({ business, pageNo }));
      
            return true;

      return true;
    } catch (error) {
      console.log("errro000r................");
    
      console.log(error);
      throw error;
    }
  }
);




export const deleteAllSpecificProductReview = createAsyncThunk(
  "businesses/deleteAllSpecificProductReview",
  async (body, {thunkAPI, getState, dispatch}) => {
    try {

    console.log('Bodyyyy:', body)
    
      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal("No token found"));
        return;
      }
    

      const response = await axios.post(
        "http://localhost:3000/branchOwner/deleteAllSpecificProductReview",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(" delete product Review:", response.data);

            const { reviewsMeta } = getState().businesses;
            const pageNo = reviewsMeta.currentPage;
            const businessId = body.businessId;
            dispatch(getBusinessProductReviews({ businessId, pageNo }));

      return true;
    } catch (error) {
      console.log("errro000r................");
    
      console.log(error);
      throw error;
    }
  }
);




export const verifyBusiness = createAsyncThunk(
  "businesses/verifyBusiness",
  async (businessId, thunkAPI) => {
    try {

      console.log("BusinessID:", businessId)

      const token = localStorage.getItem("token"); 

            console.log("Retrieved Token auth...:", token);
            if (!token) {
                console.log("No token found!");
                
                return { data:{},auth:false }; 
            }
    

      const response = await axios.get(
        "http://localhost:3000/verifyBusiness",
      
        {
          
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
          params: {
            businessId
          },
        }
      );

      console.log("business verify:", response.data);



      
      return { data: response.data};
    } catch (error) {
      console.log("errro000r................");
    
      console.log(error);
      throw error;
    }
  }
);






