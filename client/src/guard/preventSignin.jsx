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

    


export default PreventSignin
