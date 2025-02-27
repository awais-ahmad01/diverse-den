import React from 'react'
import { Outlet } from 'react-router-dom'
import SalespersonLayout from '../../../layouts/salespersonLayout'



const SalespersonDashboard = () => {

  return (
    <SalespersonLayout>
      <Outlet/>
    </SalespersonLayout>
  )
}

export default SalespersonDashboard
