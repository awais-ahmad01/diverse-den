import React from 'react'
import { Outlet } from 'react-router-dom'
import RiderLayout from '../../../layouts/riderLayout'


const RiderDashboard = () => {
  return (
  
    <RiderLayout>
      <Outlet />
    </RiderLayout>  

  )
}


export default RiderDashboard
