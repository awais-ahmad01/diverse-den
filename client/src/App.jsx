import { useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
// import { isAuth } from './store/actions/auth';

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

function App() {
  const dispatch = useDispatch();

  // useEffect(()=>{
  //   dispatch(isAuth())
  // },[])

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

            
            {/* <Route path="business_setup" element={<BusinessSetup />} /> */}

            <Route path="branchOwnerDashboard" element={<BranchOwnerDashboard />} />
          </Route>


          <Route path="/riderPanel" element={<RiderPanel />} />

          <Route path="/customerPanel" element={<CustomerPanel />} />
          
          <Route path="addsubscription" element={<AddSubscription />} />

          <Route path="business_setup" element={<BusinessSetup />} />
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
