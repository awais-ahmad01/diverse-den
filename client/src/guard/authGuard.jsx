// import React, { useEffect } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { Loader } from "../tools";
// import { verifyBusiness } from "../store/actions/businesses";

// const AuthGuard = (props) => {

//   console.log("Auth Guard....");

//   const dispatch = useDispatch();
//   const { isauthenticated, isloading: authLoading, user } = useSelector((state) => state.auth);
//   const { businessVerify, isloading: businessLoading } = useSelector((state) => state.businesses);
//   const location = useLocation();

//   console.log("Businessssssss Verifyyyy:", businessVerify);

//   useEffect(() => {
//     console.log("Business Verification Status Updated:", businessVerify);
//   }, [businessVerify]);

//   // Dispatch verification when user or business changes
//   useEffect(() => {
//     if (user?.business) {
//       console.log("Dispatching verifyBusiness for business:", user?.business);
//       dispatch(verifyBusiness(user?.business));
//       console.log("Dispatched verifyBusiness for business:", user?.business);
//     }
//   }, [dispatch, user]);

//   if (authLoading || businessLoading) {
//     return <Loader />;
  
//   }

//   if (!isauthenticated) {
//     console.log("Auth Guard: Not authenticated");
//     return <Navigate to="/signin" state={{ from: location }} replace />;
//   }

//   // Guard routes based on user role
//   if (isauthenticated) {
//     const { role } = user;
//     const { allowedRoles } = props;

//     // Debugging: Log the current path
//     console.log("Current Path:", location.pathname);

//     // Check if the user is trying to access restricted routes
//     const isBranchOwnerDashboardRoute = location.pathname.toLowerCase().includes("/branchownerpanel/branchownerdashboard");
//     const isSubscriptionRoute = location.pathname.includes("/branchOwnerPanel/subscription");
//     const isBusinessSetupRoute = location.pathname.includes("/branchOwnerPanel/business_setup");

//     // Debugging: Log the route checks
//     console.log("isBranchOwnerDashboardRoute:", isBranchOwnerDashboardRoute);
//     console.log("isSubscriptionRoute:", isSubscriptionRoute);
//     console.log("isBusinessSetupRoute:", isBusinessSetupRoute);

//     // If the user is a Branch Owner
//     if (role === "Branch Owner") {
//       // Check if the user has an active plan and a verified business
//       const hasActivePlan = !!user?.activePlan;
//       const hasVerifiedBusiness = businessVerify;
//       // const hasVerifiedBusiness = true;


//       console.log('hasVerifiedBusiness:', hasVerifiedBusiness);

//       // Debugging: Log the user's plan and business verification status
//       console.log("hasActivePlan:", hasActivePlan);
//       console.log("hasVerifiedBusiness:", hasVerifiedBusiness);

//       // If the user has an active plan and a verified business, restrict access to subscription and business_setup
//       if (hasActivePlan && hasVerifiedBusiness) {
//         if (isSubscriptionRoute || isBusinessSetupRoute) {
//           return <Navigate to="/branchOwnerPanel/branchOwnerDashboard" state={{ from: location }} replace />;
//         }
//       }

//       // If the user does not have an active plan, restrict access to business_setup
//       if (!hasActivePlan && isBusinessSetupRoute) {
//         return <Navigate to="/branchOwnerPanel/subscription" state={{ from: location }} replace />;
//       }

//       // If the user has an active plan but no verified business, restrict access to subscription
//       if (hasActivePlan && !hasVerifiedBusiness && isSubscriptionRoute) {
//         return <Navigate to="/branchOwnerPanel/business_setup" state={{ from: location }} replace />;
//       }

//       // If the user is trying to access the dashboard, ensure they have an active plan and a verified business
//       if (isBranchOwnerDashboardRoute) {
//         console.log("User is trying to access the dashboard");
//         if (!hasActivePlan) {
//           return <Navigate to="/branchOwnerPanel/subscription" state={{ from: location }} replace />;
//         }
//         if (!hasVerifiedBusiness) {
//           return <Navigate to="/branchOwnerPanel/business_setup" state={{ from: location }} replace />;
//         }
//       }
//     }

//     // Check if the user's role is allowed to access the route
//     if (!allowedRoles.includes(role)) {
//       console.log("Auth Guard: Not allowed role");
//       // Redirect based on role
//       switch (role) {
//         case "Customer":
//           return <Navigate to="/customer" state={{ from: location }} replace />;
//         case "Rider":
//           return <Navigate to="/riderPanel" state={{ from: location }} replace />;
//         case "Salesperson":
//           return <Navigate to="/branchOwnerPanel/salespersonDashboard" state={{ from: location }} replace />;
//         case "Branch Owner":
//           return <Navigate to="/branchOwnerPanel/branchOwnerDashboard" state={{ from: location }} replace />;
//         case "Admin":
//           return <Navigate to="/adminPanel" state={{ from: location }} replace />;
//         default:
//           return <Navigate to="/" state={{ from: location }} replace />;
//       }
//     }
//   }

//   return props.children;
// };

// export default AuthGuard;












import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";

const AuthGuard = (props) => {
  const { isauthenticated, isloading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isloading) {
    return (
      <div className="text-center mt-28">
        <CircularProgress />
      </div>
    );
  }

  if (!isauthenticated) {
    console.log("Auth Guard: Not authenticated");
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Guard routes based on user role
  if (isauthenticated) {
    const { role } = user;
    const { allowedRoles } = props;

    if (!allowedRoles.includes(role)) {
      // Redirect based on role
      switch (role) {
        case 'Customer':
          return <Navigate to="/customer" state={{ from: location }} replace />;
        case 'Rider':
          return <Navigate to="/riderPanel" state={{ from: location }} replace />;
        case 'Salesperson':
          return <Navigate to="/branchOwnerPanel/salespersonDashboard" state={{ from: location }} replace />;
        case 'Branch Owner':
          return <Navigate to="/branchOwnerPanel/branchOwnerDashboard" state={{ from: location }} replace />;
        case 'Admin':
          return <Navigate to="/adminPanel" state={{ from: location }} replace />;
        default:
          return <Navigate to="/" state={{ from: location }} replace />;
      }
    }
  }

  return props.children;
};

export default AuthGuard;



















// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { Loader } from "../tools";

// import { verifyBusiness } from "../store/actions/businesses";
// import { useEffect } from "react";

// const AuthGuard = (props) => {

//   const dispatch = useDispatch();
//   const { isauthenticated, isloading, user } = useSelector(
//     (state) => state.auth
//   );
//   const location = useLocation();

//   const { businessVerify } = useSelector((state) => state.businesses);
  
//     console.log("Business Verifyyyy:", businessVerify);
  
//     useEffect(() => {
//       const businessId = user?.business;
//       dispatch(verifyBusiness(businessId));
//     }, [dispatch]);

//   console.log("Authguarddd Loadd:");

//   if (isloading) {
//     return (
//       <Loader/>
//     );
//   }

//   if (!isauthenticated) {
//     console.log("Auth Guard: Not authenticated");
//     return <Navigate to="/signin" state={{ from: location }} replace />;
//   }

//   // Guard routes based on user role
//   if (isauthenticated) {
//     const { role } = user;
//     const { allowedRoles } = props;

//     console.log("Auth Guard: Authenticated");

//     console.log("role:", role);

//     console.log("allowedRoles:", allowedRoles);

//     if (!allowedRoles.includes(role)) {
//       console.log("Auth Guard: Not allowed role");
//       // Redirect based on role
//       switch (role) {
//         case "Customer":
//           return <Navigate to="/customer" state={{ from: location }} replace />;
//         case "Rider":
//           return (
//             <Navigate to="/riderPanel" state={{ from: location }} replace />
//           );
//         case "Salesperson":
//           return (
//             <Navigate
//               to="/branchOwnerPanel/salespersonDashboard"
//               state={{ from: location }}
//               replace
//             />
//           );
//         case "Branch Owner":
//           console.log("Branch Owner:");

//           return (
//             <Navigate
//               to="/branchOwnerPanel/branchOwnerDashboard"
//               state={{ from: location }}
//               replace
//             />
//           );

//         case "Admin":
//           return (
//             <Navigate to="/adminPanel" state={{ from: location }} replace />
//           );
//         default:
//           return <Navigate to="/" state={{ from: location }} replace />;
//       }
//     }
//   }

//   if(user?.role === 'Branch Owner' && !user?.activePlan){
//     return (
//             <Navigate
//               to="/branchOwnerPanel/subscription"
//               state={{ from: location }}
//               replace
//             />
//           );
//   }


//   if(user?.role === 'Branch Owner' && !businessVerify){
//     return (
//             <Navigate
//               to="/branchOwnerPanel/business_setup"
//               state={{ from: location }}
//               replace
//             />
//           );
//   }

//   return props.children;
// };

// export default AuthGuard;

// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import CircularProgress from "@mui/material/CircularProgress";

// const AuthGuard = (props) => {
//   const { isauthenticated, isloading, user } = useSelector((state) => state.auth);
//   const location = useLocation();

//   if (isloading) {
//     return (
//       <div className="text-center mt-28">
//         <CircularProgress />
//       </div>
//     );
//   }

//   if (!isauthenticated) {
//     console.log("Auth Guard: Not authenticated");
//     return <Navigate to="/signin" state={{ from: location }} replace />;
//   }

//   if (isauthenticated){
//     if(user.role === 'Customer'){
//       return <Navigate to="/customer" state={{ from: location }} replace />;
//     }

//     if(user.role === 'Rider'){
//       return <Navigate to="/riderPanel" state={{ from: location }} replace />;
//     }
//   }

//   console.log("auth Guard2222....");

//   return props.children;
// };

// export default AuthGuard;
