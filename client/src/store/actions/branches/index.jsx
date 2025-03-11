import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { errorGlobal, successGlobal } from '../../reducers/notifications';


export const getBranches = createAsyncThunk(
    'branches/getBranches',
    async ({business, pageNo=1, limit=7}, thunkAPI) => {
      try {
        console.log("Get Branches.....");

        console.log('business:',business)
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
          thunkAPI.dispatch(errorGlobal('No token found'));
          return;
        }
  
        const response = await axios.get('http://localhost:3000/viewBranches', {
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
  
        console.log("Branches:", response.data);
  
      

        console.log(response.data.meta)
        
        return { data: response.data.branches, metaData: response.data.meta, auth: false };
      } catch (error) {
        
        thunkAPI.dispatch(errorGlobal(error.response?.data?.message || 'Failed to fetch branches'));
        console.log(error)
        throw error;
      }
    }
  );


  // export const getBranch = createAsyncThunk(
  //   'branches/getBranch',
  //   async (_id, thunkAPI) => {
  //     try {
  //       console.log("Get Branch.....");

  //       console.log('branchId:', _id)
  
  //       const token = localStorage.getItem("token");
  //       console.log("myToken:", token);
  
  //       if (!token) {
  //         thunkAPI.dispatch(errorGlobal('No token found'));
  //         return;
  //       }
  
  //       const response = await axios.get('http://localhost:3000/', {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       })
  
  //       console.log("Branch:", response.data);
        
  //       return response.data

  //     } catch (error) {
        
  //       thunkAPI.dispatch(errorGlobal(error.response?.data?.message || 'Failed to fetch branch'));
  //       console.log(error)
  //       throw error;
  //     }
  //   }
  // );



  export const updateBranch = createAsyncThunk(
    'branches/updateBranch',
    async ({business, data}, thunkAPI) => {
      try {
        console.log("Update Branch.....");

        console.log('branchId:', business)
  
        const token = localStorage.getItem("token");
        console.log("myToken:", token);
  
        if (!token) {
          thunkAPI.dispatch(errorGlobal('No token found'));
          return;
        }


        const body = {
          branchCode: data.branch_code,
          name: data.branch_name,
          city: data.branch_city,
          address: data.branch_address,
          contactNo: data.branch_contact,
          emailAddress: data.branch_email,
          business: business,
        };
  

        console.log("Bodyyyy!!:", body)

  
        const response = await axios.post('http://localhost:3000/updateBranch', body, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
  
        console.log("Branch:", response.data);

        thunkAPI.dispatch(successGlobal('Branch Updated Successfully!!'))
        
        return true

      } catch (error) {
        
        thunkAPI.dispatch(errorGlobal(error.response?.data?.message || 'Failed to update branch'));
        console.log(error)
        throw error;
      }
    }
  );



export const removeBranch = createAsyncThunk(
  'branches/removeBranches',
  async({toRemove, business}, { dispatch, getState}) =>{

    try {
      console.log("Delete Branch.....");

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

      const response = await axios.post('http://localhost:3000/deleteBranch', body,  {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      // dispatch(successGlobal('Branch deteled Successfully!!'))

      console.log("Branch Deleted: ", response.data)


      const {meta} = getState().branches;
      const pageNo = meta.currentPage
      dispatch(getBranches({ business, pageNo}))



      return true

    } catch (error) {

      console.log("Errrorrr...")
      
      // dispatch(errorGlobal(error.response?.data?.message || 'Failed to delete branch'));
      console.log(error.response.data.message)
      // throw error;
    }    

  }
)



export const getAllBranches = createAsyncThunk(
  'branches/getAllBranches',
  async (business, thunkAPI) => {
    try {
      console.log("Get All Branches.....");

      console.log('business:',business)

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal('No token found'));
        return;
      }

      const response = await axios.get('http://localhost:3000/allBranches', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          business,
        },
      })

      console.log("All Branches: ", response.data)
      
      return { data: response.data.branches };
    } catch (error) {
      
      console.log(error)
      throw error;
    }
  }
);





export const getBranchProducts = createAsyncThunk(
  'branches/getBranchProducts',
  async ({branchId, pageNo=1, limit=5}, thunkAPI) => {
    try {

      console.log("Get Branch Products.....");
      console.log("br Id:", branchId);
    

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal('No token found'));
        return;
      }

      const response = await axios.get('http://localhost:3000/branchOwner/viewBranchProductsById', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        params: {
          branchId,
          pageNo,
          limit
        },
      })

      console.log("All Branch Products: ", response.data)
      
      return { data: response.data.products , metaData: response.data.meta };
    } catch (error) {
      
      console.log(error)
      throw error;
    }
  }
);



export const getAllBranchProducts = createAsyncThunk(
  'branches/getBranchProducts',
  async ({branchCode, pageNo=1, limit=5}, thunkAPI) => {
    try {

    ;
    

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal('No token found'));
        return;
      }

      const response = await axios.get('http://localhost:3000/branchOwner/viewBranchProductsById', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },


        params: {
          branchCode,
          pageNo,
          limit
        },
      })

      console.log("All Branch Products: ", response.data)
      
      return { data: response.data.products , metaData: response.data.meta };
    } catch (error) {
      
      console.log(error.response.data.message)
      throw error;
    }
  }
);




export const getBranchProductsByBranchCode = createAsyncThunk(
  'branches/getBranchProductsByBranchCode',
  async (branchCode, thunkAPI) => {
    try {

      console.log("Get Branch Products by.....");
    
    

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal('No token found'));
        return;
      }

      const response = await axios.get('http://localhost:3000/branchOwner/viewBranchProductsByBranchCode', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        params: {
          branchCode
        },
      })

      console.log("All Branch Productsssss: ", response.data)
      
      return { data: response.data.products};
    } catch (error) {
      
      console.log(error.response.data.message)
      throw error;
    }
  }
);








export const getBranchProductDetails = createAsyncThunk(
  'branches/getBranchProductDetails',
  async ({branchCode, productId}, thunkAPI) => {
    try {

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal('No token found'));
        return;
      }


      const response = await axios.get('http://localhost:3000/branchOwner/viewBranchProductsDetail', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params:{
          branchCode,
        productId
        }

      })


      console.log("Branch Products details: ", response.data)
      
      return { data: response.data.productDetails};
    } catch (error) {
      
      console.log(error)
      throw error;
    }
  }
);


export const getVariantRemainings = createAsyncThunk(
  'branches/getVariantRemainings',
  async (productId, thunkAPI) => {
    try {

      console.log("Get Variants.....");
  
    

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal('No token found'));
        return;
      }

      const response = await axios.get('http://localhost:3000/branchOwner/calculateVariantRemainings', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        params: {
          productId
        }
      })

      console.log("All variants: ", response.data)
      
      return { data: response.data};
    } catch (error) {
      
      console.log(error)
      throw error;
    }
  }
);





export const addProductToBranch = createAsyncThunk(
  "branches/addProductToBranch",
  async ({branchCode, product}, thunkAPI) => {
    try {
      

      const body = {
        branchCode,
        product
      }

      console.log("Body:", body);

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal("No token found"));
        return;
      }

      

      const response = await axios.post(
        "http://localhost:3000/branchOwner/assignProductToBranch",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("product:", response.data);

    

      return { data: response.data };
    } catch (error) {
      console.log("errro000r................");
      
      console.log(error);
      throw error;
    }
  }
);




  