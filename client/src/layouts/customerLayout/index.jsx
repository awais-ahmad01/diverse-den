import React from 'react'
import Header from './header'
import NavigationBar from './navigationBar'
import Footer from './footer'




const CustomerLayout = (props) => {
  return (
    <div>

        <Header/>

        <NavigationBar/>
      

        <div className='mt-[60px] md:mt-[120px]'>
            {props.children}
        </div>


        <Footer/>

    </div>
  )
}

export default CustomerLayout
