import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { errorGlobal, successGlobal } from '../../reducers/notifications';

export const addProduct = createAsyncThunk(
    'products/addProduct',
  async (body , thunkAPI) => {
      try {
        console.log("Add Product.....");

        console.log("Body:", body)
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
          thunkAPI.dispatch(errorGlobal('No token found'));
          return;
        }


        const formdata = new FormData();

        formdata.append('data', JSON.stringify(body.data));
        formdata.append('business', body.business);

        if(body.data.media){
          body.data.media.forEach((file) => {
            formdata.append('media', file);
          });
        }

  
        const response = await axios.post('http://localhost:3000/branchOwner/', formdata, {
          headers: {
            Authorization: `Bearer ${token}`,
            
          },
         
        })                     
  
        console.log("product:", response.data);
  
        thunkAPI.dispatch(successGlobal('Product added successfully'));
        
        return { data: response.data};
      } catch (error) {
        console.log("errro000r................")
        thunkAPI.dispatch(errorGlobal(error.response?.data?.message || 'Failed to add product'));
        console.log(error)
        throw error;
      }
    }
  );



  export const getProducts = createAsyncThunk(
    'products/getProducts',
    async ({business, pageNo=1, limit=7}, thunkAPI) => {
      try {
        console.log("Get Products.....");

        console.log('business:',business)
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
          thunkAPI.dispatch(errorGlobal('No token found'));
          return;
        }
  
        const response = await axios.get('http://localhost:3000/', {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            business,
            pageNo,
            limit
          },
        })
  
        console.log("Products:", response.data);
  
        console.log(response.data.meta)
        
        return { data: response.data.products, metaData: response.data.meta};
      } catch (error) {
        
        thunkAPI.dispatch(errorGlobal(error.response?.data?.message || 'Failed to fetch products'));
        console.log(error)
        throw error;
      }
    }
  );





  export const removeProduct = createAsyncThunk(
    'products/removeProducts',
    async({toRemove, business}, { dispatch, getState}) =>{
  
      try {
        console.log("Delete Product.....");
  
        console.log("toremove:", toRemove)
        console.log('business:', business)
  
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
          dispatch(errorGlobal('No token found'));
          return;
        }
  
  
        const body = {
          branchCode:toRemove,
          business
        }
  
        console.log('Body:', body)
  
        const response = await axios.post('http://localhost:3000/', body,  {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
  
        dispatch(successGlobal('Product deteled Successfully!!'))
  
        console.log("product Deleted: ", response.data)
  
  
        const {meta} = getState().products;
        const pageNo = meta.currentPage
        dispatch(getProducts({ business, pageNo}))

        return true
  
      } catch (error) {
  
        console.log("Errrorrr...")
        
        dispatch(errorGlobal(error.response?.data?.message || 'Failed to delete product'));
        console.log(error.response.data.message)
        // throw error;
      }    
  
    }
  )
