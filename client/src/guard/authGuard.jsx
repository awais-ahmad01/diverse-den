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