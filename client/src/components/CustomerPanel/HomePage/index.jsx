import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../../../layouts/customerLayout/header';
import NavigationBar from '../../../layouts/customerLayout/navigationBar';
import HeroSection from './hero-section';
import MainContent from './mainContent';
import Footer from '../../../layouts/customerLayout/footer';

import RecommendedProducts from '../recommendedProducts';


const HomePage = () => {

  const {isauthenticated} = useSelector(state => state.auth); 




  return (
    <div className=''>


      <div > 
          <HeroSection/>

          {isauthenticated
            ? <RecommendedProducts/>
            : null
          }
          <MainContent/>


      </div>
    </div>
  )
};

export default HomePage;