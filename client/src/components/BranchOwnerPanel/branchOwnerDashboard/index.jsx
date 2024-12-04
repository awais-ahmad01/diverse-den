import React from 'react'
import { Outlet } from 'react-router-dom'
import BranchOwnerLayout from '../../../layouts/branchOwnerLayout'
import { useSelector } from 'react-redux'
import { showToast } from '../../../tools'
import { clearNotifications } from '../../../store/reducers/notifications'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'


const BranchOwnerDashboard = () => {

  const notifications = useSelector(state => state.notifications);

  const dispatch = useDispatch()

  useEffect(() => {
    let { global } = notifications;
    if (notifications && global.error) {
      const msg = global.msg || "Error";
      showToast("ERROR", msg);
      dispatch(clearNotifications());
    }
    if (notifications && global.success) {
      const msg = global.msg || "Good!!";
      showToast("SUCCESS", msg);
      dispatch(clearNotifications());
    }
  }, [notifications]);



  return (
    <BranchOwnerLayout>
      <Outlet/>
    </BranchOwnerLayout>
  )
}

export default BranchOwnerDashboard
