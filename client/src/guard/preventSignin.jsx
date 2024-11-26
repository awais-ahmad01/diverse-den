import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PreventSignin = (props) => {

    const location = useLocation()
    const users = useSelector(state => state.auth)

    
    if(users.isauthenticated){

        if(users.user){
            const userRole = users.user.role

            if(userRole === 'Branch Owner'){

                if(users.user.activePlan){
                    return <Navigate to='/branchOwnerPanel/branchOwnerDashboard' state={{from:location}} replace/>
                }
                return <Navigate to='/branchOwnerPanel/subscription' state={{from:location}} replace/>
            }

            if(userRole === 'Rider'){
                return <Navigate to='/riderPanel' state={{from:location}} replace/>
            }

            if(userRole === 'Customer'){
                return <Navigate to='/customerPanel' state={{from:location}} replace/>
            }

            
        }


        
    }

    return props.children
}

export default PreventSignin
