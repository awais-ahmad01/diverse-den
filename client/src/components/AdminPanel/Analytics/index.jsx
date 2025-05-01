import React, { useState, useEffect } from "react";



import SubscriptionTab from "./subscriptionReports";


import {

  Typography,
 
} from "@mui/material";





const AnalyticsAndTrends = () => {
  

    

  return (
    <div className="container mx-auto p-4">
      <Typography
        variant="h4"
        className="mb-6 font-bold text-center md:text-left"
      >
        Analytics & Trends
      </Typography>

     
   
  
        <>
          
          <SubscriptionTab />

        </>
    </div>
  );
};

export default AnalyticsAndTrends;