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
                return <Navigate to='/riderPanel' state={{from:location}} replace/>
            }

            if(userRole === 'Customer'){
                return <Navigate to='/customer' state={{from:location}} replace/>
            }

            
        }

        return props.children
        
    }

    


export default PreventSignin;
