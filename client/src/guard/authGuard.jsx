import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AuthGuard = (props) => {


    const { isauthenticated, isloading } = useSelector((state) => state.auth);
    const location = useLocation();
  
    if (isloading) {
      return <div>Loading...</div>; // Optional: Add a loader for better UX
    }

    if(!isauthenticated){
        console.log("Auth Guard: Not authenticated");
        return <Navigate to='/signin' state={{from:location}} replace/>
    }

    console.log('auth Guard2222....')

    return props.children
  
}

export default AuthGuard
