import { useState } from 'react'
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import './App.css'

import Signup from './components/auth/signup';
import Signin from './components/auth/signin';

function App() {
  

  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route path='signup' element={<Signup/>}/>
          <Route path='signin' element={<Signin/>}/>
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
