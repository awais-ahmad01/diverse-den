import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Box,
  ThemeProvider
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import SubscriptionTab from "./subscriptionReports";

const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
  },
});

const Analytics = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5 pb-9">
        {/* Header */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: "#603F26", 
              fontWeight: "bold" 
            }}
          >
            Analytics
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
          <Paper className="bg-white rounded-lg shadow-md p-4">
            <SubscriptionTab />
          </Paper>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Analytics;