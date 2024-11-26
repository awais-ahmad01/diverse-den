import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AuthGuard = (props) => {


    const location = useLocation()
    const users = useSelector(state => state.auth)

    if(!users.isauthenticated){
        return <Navigate to='/signin' state={{from:location}} replace/>
    }

    return props.children
  
}

export default AuthGuard
