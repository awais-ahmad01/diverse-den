// import React from "react";
// import { useEffect } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { verifyBusiness } from "../store/actions/businesses";
// import { Loader } from "../tools";

// const PreventSignin = (props) => {
//   const { isauthenticated, user, isloading } = useSelector(
//     (state) => state.auth
//   );
//   const location = useLocation();

//   const dispatch = useDispatch();

//   const { businessVerify } = useSelector((state) => state.businesses);

//   console.log("Business Verifyyyy:", businessVerify);

//   useEffect(() => {
//     const businessId = user?.business;
//     dispatch(verifyBusiness(businessId));
//   }, [dispatch]);

//   if (isloading) {
//     return <Loader />;
//   }

//   if (isauthenticated) {
//     const userRole = user?.role;

//     if (userRole === "Admin") {
//       return <Navigate to="/adminPanel" state={{ from: location }} replace />;
//     }

//     if (userRole === "Branch Owner") {
//       if (user?.activePlan) {
//         if (businessVerify) {
//             console.log("businessVerified:", businessVerify);
//           return (
//             <Navigate
//               to="/branchOwnerPanel/branchOwnerDashboard"
//               state={{ from: location }}
//               replace
//             />
//           );
//         }
//         else{
//             return (
//                 <Navigate
//                   to="/branchOwnerPanel/business_setup"
//                   state={{ from: location }}
//                   replace
//                 />
//               );
//         }

      
//       } 
//       return (
//         <Navigate
//           to="/branchOwnerPanel/subscription"
//           state={{ from: location }}
//           replace
//         />
//       );
//     }

//     if (userRole === "Salesperson") {
//       return (
//         <Navigate
//           to="/branchOwnerPanel/salespersonDashboard"
//           state={{ from: location }}
//           replace
//         />
//       );
//     }

//     if (userRole === "Rider") {
//       return <Navigate to="/riderPanel" state={{ from: location }} replace />;
//     }

//     if (userRole === "Customer") {
//       return <Navigate to="/customer" state={{ from: location }} replace />;
//     }
//   }

//   return props.children;
// };

// export default PreventSignin;








import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PreventSignin = (props) => {

    const { isauthenticated, user, isloading } = useSelector((state) => state.auth);
    const location = useLocation();
  
    if (isloading) {
      return <div>Loading...</div>; // Optional: Add a loader
    }
  

    
    if(isauthenticated){

            const userRole = user?.role;

            if(userRole === 'Admin'){
                return <Navigate to='/adminPanel' state={{from:location}} replace/>
            }

            if(userRole === 'Branch Owner'){

                if(user.activePlan){
    
                    return <Navigate to='/branchOwnerPanel/branchOwnerDashboard' state={{from:location}} replace/>
                }
                return <Navigate to='/branchOwnerPanel/subscription' state={{from:location}} replace/>
            }

            if(userRole === 'Salesperson'){
                return <Navigate to='/branchOwnerPanel/salespersonDashboard' state={{from:location}} replace/>
            }

            if(userRole === 'Rider'){
                if(user?.isApproved && user?.status === 'Approved'){
                    return <Navigate to='/riderPanel/riderDashboard' state={{from:location}} replace/>
                }


                if(user?.isDetailsAdded && user?.status === 'Pending'){
                    return <Navigate to='/riderPanel/pendingApproval' state={{from:location}} replace/>
                }

                if(user?.isDetailsAdded && user?.status === 'Rejected'){
                    return <Navigate to='/riderPanel/rejectionPage' state={{from:location}} replace/>
                }
                return <Navigate to='/riderPanel/riderDetails' state={{from:location}} replace/>
            }


            if(userRole === 'Customer'){
                return <Navigate to='/customer' state={{from:location}} replace/>
            }

            
        }

        return props.children
        
    }

    


export default PreventSignin;








// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import CircularProgress from '@mui/material/CircularProgress';

// const PreventSignin = (props) => {
//   const { isauthenticated, isloading, user } = useSelector((state) => state.auth);
//   const location = useLocation();

//   if (isloading) {
//     return (
//       <div className="text-center mt-28">
//         <CircularProgress />
//       </div>
//     );
//   }

//   // Only prevent access to auth routes (signin/signup) for authenticated users
//   const isAuthRoute = ['/signin', '/signup'].includes(location.pathname);
  
//   if (isauthenticated && isAuthRoute) {
//     // Redirect to their respective dashboard based on role
//     const role = user?.role;
//     let redirectPath = '/';

//     switch (role) {
//       case 'Branch Owner':
//         redirectPath = '/branchOwnerPanel/branchOwnerDashboard';
//         break;
//       case 'Rider':
//         redirectPath = '/riderPanel/riderDashboard';
//         break;
//       case 'Salesperson':
//         redirectPath = '/branchOwnerPanel/salespersonDashboard';
//         break;
//       case 'Customer':
//         redirectPath = '/customer';
//         break;
//       case 'Admin':
//         redirectPath = '/adminPanel';
//         break;
//       default:
//         redirectPath = '/';
//     }

//     return <Navigate to={redirectPath} replace />;
//   }

//   return props.children;
// };

// export default PreventSignin;