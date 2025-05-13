import React, { useState } from "react";
import { 
  Tabs, 
  Tab, 
  Paper, 
  Typography,
  Box,
  ThemeProvider
} from "@mui/material";
import {
  Timeline,
  TrendingUp,
  MonetizationOn,
  ShoppingCart,
} from "@mui/icons-material";
import { createTheme } from "@mui/material/styles";

import SalesTab from "./salesTab";
import EarningsTab from "./earningsTab";
import TrendingProductsTab from "./trendingProductsTab";
import SubscriptionTab from "./subscriptionTab";

const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
  },
});

const AnalyticsAndTrends = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5 pb-9">
        {/* Header */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
          <Typography variant="h4" sx={{ color: "#603F26", fontWeight: "bold" }}>
            Analytics & Trends
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
          <Paper className="shadow-md rounded-lg">
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="analytics tabs"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 64,
                  color: '#603F26',
                  '&.Mui-selected': {
                      color: '#603F26',
                      fontWeight: 'bold'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#603F26'
                }
              }}
            >
              <Tab 
                label="Sales Report" 
                icon={<Timeline />} 
                iconPosition="start" 
              />
              <Tab
                label="Trending Products"
                icon={<TrendingUp />}
                iconPosition="start"
              />
              <Tab
                label="Earnings"
                icon={<MonetizationOn />}
                iconPosition="start"
              />
              {/* <Tab
                label="Subscriptions"
                icon={<ShoppingCart />}
                iconPosition="start"
              /> */}
            </Tabs>
          </Paper>
        </Box>

        {/* Tab Content */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
          <Paper className="bg-white rounded-lg shadow-md p-4">
            {tabValue === 0 && <SalesTab />}
            {tabValue === 1 && <TrendingProductsTab />}
            {tabValue === 2 && <EarningsTab />}
            {tabValue === 3 && <SubscriptionTab />}
          </Paper>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default AnalyticsAndTrends;