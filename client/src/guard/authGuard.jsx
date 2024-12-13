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

  if (isauthenticated){
    if(user.role === 'Customer'){
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    if(user.role === 'Rider'){
      return <Navigate to="/riderPanel" state={{ from: location }} replace />;
    }
  }

  console.log("auth Guard2222....");

  return props.children;
};

export default AuthGuard;
