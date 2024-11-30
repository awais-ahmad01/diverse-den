import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { getBranches } from '../../../store/actions/branches'

const Test = () => {

  

  const dispatch = useDispatch()


  useEffect(()=>{

    console.log('getting.....')
    dispatch(getBranches())
  }, [])


  return (
    <div> 

        Dashboard Main Content
      
    </div>
  )
}

export default Test
