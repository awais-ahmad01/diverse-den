import React, { useState } from 'react';
import Header from '../../../layouts/customerLayout/header';
import NavigationBar from '../../../layouts/customerLayout/navigationBar';
import HeroSection from './hero-section';
import MainContent from './mainContent';
import Footer from '../../../layouts/customerLayout/footer';


const HomePage = () => {


  return (
    <div className=''>


      <div > 
          <HeroSection/>

          <MainContent/>


      </div>
    </div>
  )
};

export default HomePage;