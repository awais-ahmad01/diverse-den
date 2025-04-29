import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWeeklySales, getMonthlySales, getYearlySales } from "../../../../store/actions/analytics";
import { showToast } from "../../../../tools";

import SalesTab from "./salesTab";
import EarningsTab from "./earningsTab";
import TrendingProductsTab from "./trendingProductsTab";
import SubscriptionTab from "./subscriptionTab";


import {
  Tabs,
  Tab,
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  TextField,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Timeline,
  TrendingUp,
  MonetizationOn,
  ShoppingCart,
} from "@mui/icons-material";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Color palette for charts
const COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042"];

const AnalyticsAndTrends = () => {
  

  const [tabValue, setTabValue] = useState(0);
 


  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };



    

  return (
    <div className="container mx-auto p-4">
      <Typography
        variant="h4"
        className="mb-6 font-bold text-center md:text-left"
      >
        Analytics & Trends
      </Typography>

      <Paper className="mb-6">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="analytics tabs"
        >
          <Tab label="Sales Report" icon={<Timeline />} iconPosition="start" />
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
          <Tab
            label="Subscriptions"
            icon={<ShoppingCart />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

  
        <>
          {/* Sales Report Tab */}
          {tabValue === 0 && <SalesTab />}

          {tabValue === 1 && <EarningsTab/>}

          {tabValue === 2 && <TrendingProductsTab/>}

          {tabValue === 3 && <SubscriptionTab/>}

        </>
    </div>
  );
};

export default AnalyticsAndTrends;