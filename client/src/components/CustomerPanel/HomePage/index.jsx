import React, { useState } from 'react';
import Header from './header';
import NavigationBar from './navigationBar';
import HeroSection from './hero-section';
import MainContent from './mainContent';
import Footer from './footer';


const HomePage = () => {


  return (
    <div className=''>
      <Header/>
      <NavigationBar/>



      <div className='mt-[60px] md:mt-[120px]'> 
          <HeroSection/>

          <MainContent/>

          <Footer/>

      </div>
    </div>
  )
};

export default HomePage;