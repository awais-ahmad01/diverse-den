import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { errorGlobal, successGlobal } from "../../reducers/notifications";

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (body, thunkAPI) => {
    try {
      console.log("Add Product.....");

      console.log("Body:", body);

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal("No token found"));
        return;
      }
      

      const formdata = new FormData();

      formdata.append("data", JSON.stringify(body.data));
      formdata.append("business", body.business);

      if (body.data.media) {
        body.data.media.forEach((file) => {
          formdata.append("media", file);
        });
      }

      const response = await axios.post(
        "http://localhost:3000/branchOwner/addProduct",
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("product:", response.data);

      thunkAPI.dispatch(successGlobal("Product added successfully"));

      return { data: response.data };
    } catch (error) {
      console.log("errro000r................");
      thunkAPI.dispatch(
        errorGlobal(error.response?.data?.message || "Failed to add product")
      );
      console.log(error.response.data.message);
      throw error;
    }
  }
);

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async ({ business, pageNo = 1, limit = 20 }, thunkAPI) => {
    try {
      console.log("Get Products.....");

      console.log("business:", business);

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal("No token found"));
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/branchOwner/viewBusinessProductsById",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            business,
            pageNo,
            limit,
          },
        }
      );

      console.log("Products data:", response.data);

      console.log(response.data.meta);

      return {
        data: response.data.businessProducts,
        metaData: response.data.meta,
      };
    } catch (error) {
      thunkAPI.dispatch(
        errorGlobal(error.response?.data?.message || "Failed to fetch products")
      );
      console.log(error);
      throw error;
    }
  }
);

export const getBranchProducts = createAsyncThunk(
  "products/getBranchProducts",
  async ({ branchId, pageNo = 1, limit = 7 }, thunkAPI) => {
    try {
      console.log("Get Branch Products.....");
      console.log("br Id:", branchId);

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal("No token found"));
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/branchOwner/viewBranchProductsById",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            branchId,
            pageNo,
            limit,
          },
        }
      );

      console.log("bracnh Products data:", response.data);

      console.log(response.data.meta);

      return { data: response.data.products, metaData: response.data.meta };
    } catch (error) {
      thunkAPI.dispatch(
        errorGlobal(
          error.response?.data?.message || "Failed to fetch Branch products"
        )
      );
      console.log(error);
      throw error;
    }
  }
);

export const getProductByID = createAsyncThunk(
  "products/getProductById",
  async (productId, thunkAPI) => {
    try {
      console.log("Get Product by Id.....");
      console.log("br Id:", productId);

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal("No token found"));
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/branchOwner/getProductById",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            productId,
          },
        }
      );

      console.log("Product by Id dataaaa:", response.data);

      return { data: response.data.product };
    } catch (error) {
      thunkAPI.dispatch(
        errorGlobal(error.response?.data?.message || "Failed to fetch product")
      );
      console.log(error);
      throw error;
    }
  }
);


export const removeProduct = createAsyncThunk(
  "products/removeProducts",
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

      const { meta } = getState().products;
      const pageNo = meta.currentPage;
      dispatch(getProducts({ business, pageNo }));

      return true;
    } catch (error) {
      console.log("Errrorrr...");

      dispatch(
        errorGlobal(error.response?.data?.message || "Failed to delete product")
      );
      console.log(error.response.data.message);
      throw error;
    }
  }
);



export const removeBranchProduct = createAsyncThunk(
  "products/removeBranchProduct",
  async ({ toRemove, branchId }, { dispatch, getState }) => {
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
        branchId
      };

      const response = await axios.post(
        "http://localhost:3000/branchOwner/deleteProductFromBranch",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(successGlobal("Product deteled Successfully!!"));

      console.log("product Deleted: ", response.data);

      const { branchMeta } = getState().products;
      const pageNo = branchMeta.currentPage;
      dispatch(getBranchProducts({ branchId, pageNo }));

      return true;
    } catch (error) {
      console.log("Errrorrr...");

      dispatch(
        errorGlobal(error.response?.data?.message || "Failed to delete product")
      );
      console.log(error.response.data.message);
      throw error;
    }

  }
);



export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (body, thunkAPI) => {
    try {
      console.log("update product.....");
      // console.log('br Id:', productId)

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal("No token found"));
        return;
      }

      const formdata = new FormData();

      formdata.append("data", JSON.stringify(body.data));
      formdata.append("business", body.business);

      if (body.data.media) {
        body.data.media.forEach((file) => {
          formdata.append("media", file);
        });
      }

      const response = await axios.post(
        "http://localhost:3000/branchOwner/updateProductById",
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            productId: body.productId,
          },
        }
      );

      console.log("updated Product:", response.data);

      thunkAPI.dispatch(successGlobal("Product updated successfully"));

      return true;
    } catch (error) {
      thunkAPI.dispatch(
        errorGlobal(error.response?.data?.message || "Failed to update product")
      );
      console.log(error);
      throw error;
    }
  }
);

export const searchProduct = createAsyncThunk(
  "products/searchProduct",
  async (query, thunkAPI) => {
    try {
      console.log("search prduct.....");
      console.log("que:", query);

      const response = await axios.get(
        "http://localhost:3000/customer/getSearchedProduct",
        {
          params: {
            searchQuery: query,
          },
        }
      );

      console.log("Product by Id data:", response.data);

      return { data: response.data.products };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const getSubCategoryProducts = createAsyncThunk(
  "products/getSubCategoryProducts",
  async ({ subcategory, productType }, thunkAPI) => {
    if (productType) {
      try {

        console.log("if.....");
        console.log("get subCategoryProduct.....");

        console.log("subCategory:", subcategory);

        console.log("type:", productType);

        const response = await axios.get("http://localhost:3000/customer/getProductsBySubcategoryAndType", {
          params: {
            subCategory: subcategory,
            productType: productType,
          },
        });

        console.log(response);

        console.log("subCategory.....:", response.data);

        return { data: response.data.products };
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      try {

        console.log("else....");

        console.log("get subCategoryProduct.....");

        console.log("subCategory:", subcategory);

        console.log("type:", productType);

        const response = await axios.get("http://localhost:3000/customer/getProductsBySubcategoryAndType", {
          params: {
            productType: subcategory,
          },
        });

        console.log(response);

        console.log("subCategory...:", response.data);

        return { data: response.data.products };
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  }
);



export const getCustomerProductById = createAsyncThunk(
  "products/getCustomerProductById",
  async (productId, thunkAPI) => {
    try {
      console.log("Get Product by Id.....");
      console.log("br Id:", productId);

      

      const response = await axios.get(
        "http://localhost:3000/customer/getCustomerProductById",
        {
          params: {
            productId,
          },
        }
      );

      console.log("Product by Id data:", response.data);

      return { data: response.data.product };
    } catch (error) {
      thunkAPI.dispatch(
        errorGlobal(error.response?.data?.message || "Failed to fetch product")
      );
      console.log(error);
      throw error;
    }
  }
);




export const getSaleProductById = createAsyncThunk(
  "products/getSaleProductById",
  async ({productId, eventId}, thunkAPI) => {
    try {

      console.log("Get Sale Product by Id.....");
      console.log("product Id:", productId);
      console.log("eventId:", eventId);
    

      const response = await axios.get(
        "http://localhost:3000/customer/getSaleEventProducts",
        {
          params: {
            productId,
            eventId          },
        }
      );

      console.log("Sale Product by Id data:", response.data);

      return { data: response.data.productDetails };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);




export const getCartItems = createAsyncThunk(
  "products/getCartItems",
  async (userId, thunkAPI) => {
    try {
      console.log("Get Cart.....");
      console.log("br Id:", userId);

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        dispatch(errorGlobal("No token found"));
        return;
      }


      const response = await axios.get(
        "http://localhost:3000/customer/viewCart",
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

      console.log("Cart:", response.data);

      return { data: response.data.userCart };
    } catch (error) {
      thunkAPI.dispatch(
        errorGlobal(error.response?.data?.message || "Failed to fetch Cart data")
      );
      console.log(error);
      throw error;
    }
  }
);


export const placeOrder = createAsyncThunk(
  "products/placeOrder",
  async (body, thunkAPI) => {
    try {
      console.log("Order.....");

      console.log("Body:", body);

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal("No token found"));
        return;
      }


      const response = await axios.post(
        "http://localhost:3000/addOrderDetails",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("order:", response.data);

     

      return true;
    } catch (error) {
      console.log("errro000r................");
      
      console.log("errrrrrrrr:::",error.response?.data?.message);
      throw error;
    }
  }
);





// Product Reviews


export const SubmitProductReviews = createAsyncThunk(
  "products/SubmitProductReviews",
  async (body, thunkAPI) => {
    try {

      console.log('Reviews:', body)
    
      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        thunkAPI.dispatch(errorGlobal("No token found"));
        return;
      }
    

      const response = await axios.post(
        "http://localhost:3000/customer/addProductReview",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(" Add Review:", response.data);


      return true;
    } catch (error) {
      console.log("errro000r................");
    
      console.log(error);
      throw error;
    }
  }
);




export const getProductReviews = createAsyncThunk(
  "products/getProductReviews",
  async (productId, thunkAPI) => {
    try {
    

      const response = await axios.get(
        "http://localhost:3000/customer/viewProductReviews",
        {
          params: {
            productId
          },
        }
      );

      console.log("Reviewss:", response.data);


      return { data: response.data };
    } catch (error) {
      console.log("errro000r................");
    
      console.log(error);
      throw error;
    }
  }
);





export const getRecomendedProducts = createAsyncThunk(
  "products/getRecomendedProducts",
  async (userId, thunkAPI) => {
    try {
    
      if (!userId) {
        throw new Error("User ID is required");
      }

      const response = await axios.post(
        "https://d582-35-234-170-59.ngrok-free.app/recommend",
        {
          user_id: userId,  
          k: 4
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': '69420'  
          },
         
          withCredentials: false  
        }
      );

     
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response format from server");
      }

      console.log("Recommended Products:", response.data);
      
      
      return { data: response.data };
      
    } catch (error) {
      console.error("Recommendation error:", error);
      
 
      let errorMessage = "Failed to get recommendations";
      let errorStatus = 500;
      
      if (error.response) {
        
        errorStatus = error.response.status;
        errorMessage = error.response.data?.detail || error.response.statusText;
      } else if (error.request) {
    
        errorMessage = "No response from server";
      } else {
       
        errorMessage = error.message;
      }
      
      return thunkAPI.rejectWithValue({
        message: errorMessage,
        status: errorStatus
      });
    }
  }
);




















