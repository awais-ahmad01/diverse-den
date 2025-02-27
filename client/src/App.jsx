import { useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";

import { useEffect } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { isAuth } from "./store/actions/auth";

import Signup from "./components/auth/signup";
import Signin from "./components/auth/signin";
import SubscriptionPlans from "./components/BranchOwnerPanel/subscription";
import AddSubscription from "./components/BranchOwnerPanel/addSubscription/add_subscription";
import BusinessSetup from "./components/BranchOwnerPanel/business_setup";
import PreventSignin from "./guard/preventSignin";
import AuthGuard from "./guard/authGuard";
import BranchOwnerPanel from "./components/BranchOwnerPanel";
import BranchOwnerDashboard from "./components/BranchOwnerPanel/branchOwnerDashboard";
import RiderPanel from "./components/RiderPanel";
import CustomerPanel from "./components/CustomerPanel";
import AddBranches from "./components/BranchOwnerPanel/branchOwnerDashboard/Branches/addBranches";
import UpdateBranch from "./components/BranchOwnerPanel/branchOwnerDashboard/Branches/updateBranch";
import ListBranches from "./components/BranchOwnerPanel/branchOwnerDashboard/Branches/listBranches";
import CircularProgress from "@mui/material/CircularProgress";
import ListSalespersons from "./components/BranchOwnerPanel/branchOwnerDashboard/salesperson/listSalespersons";
import AddSalesperson from "./components/BranchOwnerPanel/branchOwnerDashboard/salesperson/addSalesperson";
import UpdateSalesperson from "./components/BranchOwnerPanel/branchOwnerDashboard/salesperson/updateSalesperson";

import { getAllBranches } from "./store/actions/branches";

import { Loader } from "./tools";
import ListProducts from "./components/BranchOwnerPanel/branchOwnerDashboard/Products/listProducts";
import AddProduct from "./components/BranchOwnerPanel/branchOwnerDashboard/Products/addProduct";

import HomePage from "./components/CustomerPanel/HomePage";
import ViewBranch from "./components/BranchOwnerPanel/branchOwnerDashboard/Branches/viewBranch";
import ViewProduct from "./components/BranchOwnerPanel/branchOwnerDashboard/Products/viewProduct";
import UpdateProduct from "./components/BranchOwnerPanel/branchOwnerDashboard/Products/updateProduct";
import ProductDetails from "./components/CustomerPanel/productDetails.jsx";

import CategoryPage from "./components/CustomerPanel/categories/categoryPage.jsx";
import ViewBranchProduct from "./components/BranchOwnerPanel/branchOwnerDashboard/Branches/viewBranchProduct.jsx";
import SearchedProduct from "./components/CustomerPanel/searchedProduct/index.jsx";
import SubCategory from "./components/CustomerPanel/categories/subCategory.jsx";
import Cart from "./components/CustomerPanel/cart/index.jsx";
import Checkout from "./components/CustomerPanel/checkout/index.jsx";
import ListOrders from "./components/BranchOwnerPanel/branchOwnerDashboard/Orders/listOrders.jsx";
import BranchOwnerProfile from "./components/BranchOwnerPanel/branchOwnerDashboard/Profile/index.jsx";
import OrderPaymentHistory from "./components/BranchOwnerPanel/branchOwnerDashboard/Orders/orderPaymentsHistory.jsx";
import SaleEventsList from "./components/BranchOwnerPanel/branchOwnerDashboard/Sales/saleEventsList.jsx";
import CreateSaleEvent from "./components/BranchOwnerPanel/branchOwnerDashboard/Sales/createSaleEvent.jsx";
import UpdateSaleEvent from "./components/BranchOwnerPanel/branchOwnerDashboard/Sales/updateSaleEvent.jsx";
import ManageSubscriptions from "./components/BranchOwnerPanel/branchOwnerDashboard/ManageSubscription/index.jsx";
import ProductReviews from "./components/BranchOwnerPanel/branchOwnerDashboard/ManageProductReviews/index.jsx";
import DashboardLayout from "./layouts/adminLayout/index.jsx";
import ManageUsers from "./components/AdminPanel/ManageUsers/index.jsx";
import AdminPanel from "./components/AdminPanel/index.jsx";
import ManageBusinesses from "./components/AdminPanel/ManageBusinesses/index.jsx";
import ManageSubscriptionPlans from "./components/AdminPanel/ManageSubscriptions/index.jsx";
import SalespersonDashboard from "./components/BranchOwnerPanel/salespersonDashboard/index.jsx";
import OrderManagement from "./components/BranchOwnerPanel/salespersonDashboard/manageOrders/index.jsx";
import ChatSection from "./components/BranchOwnerPanel/salespersonDashboard/manageChats/index.jsx";
import SalespersonOrderManagement from "./components/BranchOwnerPanel/salespersonDashboard/manageOrders/index.jsx";

function App() {
  const dispatch = useDispatch();

  const { isloading, isauthenticated, user } = useSelector((state) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    console.log("Token Verification....auth");
    
    dispatch(isAuth())
      .finally(() => {
        setAuthChecked(true);
      });
  }, [dispatch]);
  
  useEffect(() => {
    if (user?.business) {
      console.log("Fetching branches for business:", user.business);
      dispatch(getAllBranches(user.business));
    }
  }, [user, dispatch]);

  if (!authChecked || isloading) {
    return <Loader/>
  }

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="signup" element={<Signup />} />

          <Route
            path="signin"
            element={
              <PreventSignin>
                <Signin />
              </PreventSignin>
            }
          />

          <Route
            path="/branchOwnerPanel"
            element={
              <AuthGuard>
                <BranchOwnerPanel />
              </AuthGuard>
            }
          >
            <Route path="subscription" element={<SubscriptionPlans />} />

            <Route path="business_setup" element={<BusinessSetup />} />


            <Route
              path="branchOwnerDashboard"
              element={<BranchOwnerDashboard />}
            >
              <Route path="branchesList" element={<ListBranches />} />

              <Route path="addBranch" element={<AddBranches />} />

              <Route path="updatebranch/:id" element={<UpdateBranch />} />

              <Route path="viewbranch/:id/:name" element={<ViewBranch/>} />

              <Route path="viewBranchProduct/:productId/:productTitle" element={<ViewBranchProduct />} />



              <Route path="addSalesperson" element={<AddSalesperson />} />

              <Route path="salespersonsList" element={<ListSalespersons />}>

                {/* <Route path="addSalesperson" element={<AddSalesperson />} /> */}

                {/* <Route
                  path="updateSalesperson"
                  element={<UpdateSalesperson />}
                /> */}
              </Route>

              <Route path="productsList" element={<ListProducts />} />
              <Route path="addProduct" element={<AddProduct />} />
              <Route path="viewProduct/:productId/:productTitle" element={<ViewProduct />} />
              <Route path="updateProduct/:productId" element={<UpdateProduct />} />

              <Route path="ordersList" element={<ListOrders />} />


              
              <Route path="branchOwnerProfile" element={<BranchOwnerProfile />} />

              <Route path="OrdersPaymentHistory" element={<OrderPaymentHistory />} />

              <Route path="createSaleEvent" element={<CreateSaleEvent />} />

              <Route path="updateSaleEvent/:id" element={<UpdateSaleEvent />} />

              <Route path="saleEventsList" element={<SaleEventsList />} />

              
              <Route path="manageSubscriptions" element={<ManageSubscriptions />} />

              <Route path="manageProductReviews" element={<ProductReviews/>} />


            </Route>




            <Route path="salespersonDashboard" element={<SalespersonDashboard />} >
                  
                <Route path="manageOrders" element={<SalespersonOrderManagement />} />

                <Route path="manageChats" element={<ChatSection />} />
            </Route>




          </Route>

          <Route path="/riderPanel" element={<RiderPanel />} />




          {/* Cutomer  */}


          <Route path="/" element={<CustomerPanel />}>
            <Route path="/" element={<HomePage />} />

            <Route path="/:slug" element={<CategoryPage />} />

            <Route path="/:category?/:subcategory?/:productType?" element={<SubCategory />} />

            <Route path="productDetails/:productId" element={<ProductDetails />} />
            
            <Route path="/searchedProduct" element={<SearchedProduct />} />

            <Route path="/cart" element={<Cart />} />

            <Route path="/checkout" element={<Checkout />} />



                  
          </Route>
            
                    

          <Route path="addsubscription" element={<AddSubscription />} />


          <Route path="adminPanel" element={<AdminPanel />}>
                  
              <Route path="manageUsers" element={<ManageUsers />} />

              <Route path="manageBusinesses" element={<ManageBusinesses />} />

              <Route path="manageSubscriptionPlans" element={<ManageSubscriptionPlans />} />
          
          </Route> 
          
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
