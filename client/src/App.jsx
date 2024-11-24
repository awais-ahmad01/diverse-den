import { useState } from 'react'
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import './App.css'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Signup from './components/auth/signup';
import Signin from './components/auth/signin';
import SubscriptionPlans from './components/branchOwnerDashboard/subscription';
import AddSubscription from './components/subscription/add_subscription';

function App() {
  

  return (
    <>

      <ToastContainer/>
      <BrowserRouter>


        <Routes>
          <Route path='signup' element={<Signup/>}/>
          <Route path='signin' element={<Signin/>}/>

          <Route path='subscription' element={<SubscriptionPlans/>}/>

          <Route path='addsubscription' element={<AddSubscription/>}/>
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
