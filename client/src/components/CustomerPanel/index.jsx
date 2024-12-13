import React from 'react'
import { Outlet } from 'react-router-dom'
import CustomerLayout from '../../layouts/customerLayout'


const CustomerPanel = () => {
  return (
    
    <CustomerLayout>
      <Outlet/>
    </CustomerLayout>
  )
}

export default CustomerPanel
