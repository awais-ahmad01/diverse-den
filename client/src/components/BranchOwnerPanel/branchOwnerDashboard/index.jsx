import React from 'react'
import { Outlet } from 'react-router-dom'
import BranchOwnerLayout from '../../../layouts/branchOwnerLayout'


const BranchOwnerDashboard = () => {
  return (
    <BranchOwnerLayout>
      <Outlet/>
    </BranchOwnerLayout>
  )
}

export default BranchOwnerDashboard
