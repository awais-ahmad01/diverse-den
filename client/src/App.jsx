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

function App() {
  const dispatch = useDispatch();

  const { isloading, isauthenticated, user } = useSelector((state) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    console.log("Token Verification....");
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
            </Route>
          </Route>

          <Route path="/riderPanel" element={<RiderPanel />} />




          {/* Cutomer  */}

          <Route path="/" element={<CustomerPanel />}>
            <Route path="/" element={<HomePage />} />

            <Route path="/category/:slug" element={<CategoryPage />} />
                  
          </Route>
          
            
          
          
          <Route path="/product-details" element={<ProductDetails />} />
          

          <Route path="addsubscription" element={<AddSubscription />} />

      
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
