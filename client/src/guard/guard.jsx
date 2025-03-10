import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Loader } from "../tools";
import { verifyBusiness } from "../store/actions/businesses";
import { useEffect } from "react";

const Guard = (props) => {

    const dispatch = useDispatch();
  const { isauthenticated, isloading, user } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

//   const { businessVerify } = useSelector((state) => state.businesses);

//   console.log("Business Verifyyyy:", businessVerify);

//   useEffect(() => {
//     const businessId = user?.business;
//     dispatch(verifyBusiness(businessId));
//   }, [dispatch]);

  if (isloading) {
    return <Loader />;
  }

  if (!isauthenticated) {
    console.log("Auth Guard: Not authenticated");
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

//   if (isauthenticated) {
    // if (user?.activePlan) {
    //   if (businessVerify) {
    //     console.log("businessVerified:", businessVerify);
    //     return (
    //       <Navigate
    //         to="/branchOwnerPanel/branchOwnerDashboard"
    //         state={{ from: location }}
    //         replace
    //       />
    //     );
    //   } else {
    //     return (
    //       <Navigate
    //         to="/branchOwnerPanel/business_setup"
    //         state={{ from: location }}
    //         replace
    //       />
    //     );
    //   }
    // }

//     console.log("auth Guard2222....");

//     return props.children;
//   }

return props.children;
};

export default Guard;
