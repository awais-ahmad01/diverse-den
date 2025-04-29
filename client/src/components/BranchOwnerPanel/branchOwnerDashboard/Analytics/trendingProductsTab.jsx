import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../../tools";

import { getDailyTrendingProducts, getWeeklyTrendingProducts, getMonthlyTrendingProducts } from "../../../../store/actions/analytics";

import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, addDays } from "date-fns";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Color palette for charts
const COLORS = [
  "#8884d8", "#82ca9d", "#FFBB28", "#FF8042", "#0088FE", "#00C49F", 
  "#8884d8", "#ff5722", "#2196f3", "#4caf50", "#9c27b0", "#e91e63"
];

const TrendingProductsTab = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { dailyTrendingProducts, weeklyTrendingProducts, monthlyTrendingProducts, isloading } = useSelector((state) => state.analytics);
  

    console.log("daily Trending Products:", dailyTrendingProducts);
    console.log("weekly Trending Products:", weeklyTrendingProducts);
    console.log("monthly Trending Products:", monthlyTrendingProducts);

  const business = user?.business;

  const [timePeriod, setTimePeriod] = useState("daily");
  
  // Date states
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(format(addDays(new Date(), -6), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  
  // Month and year for monthly trending
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Array of month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Processed trending products data
  const [trendingData, setTrendingData] = useState({ 
    products: [], 
    totalSold: 0,
    periodLabel: ""
  });

  // Update date range when period changes
  useEffect(() => {
    updateDateRange();
  }, [timePeriod, selectedDate]);

  // Function to update date range based on selected period
  const updateDateRange = () => {
    if (timePeriod === "weekly") {
      setEndDate(format(selectedDate, "yyyy-MM-dd"));
      setStartDate(format(addDays(selectedDate, -6), "yyyy-MM-dd"));
    }
  };

  const fetchTrendingProductsData = async () => {
    try {
      if (timePeriod === "daily") {
        await dispatch(getDailyTrendingProducts({ 
          business, 
          date: format(selectedDate, "yyyy-MM-dd") 
        }));
      } else if (timePeriod === "weekly") {
        await dispatch(getWeeklyTrendingProducts({ 
          business, 
          startDate, 
          endDate
        }));
      } else if (timePeriod === "monthly") {
        const monthName = monthNames[selectedMonth];
        await dispatch(getMonthlyTrendingProducts({ 
          business, 
          month: monthName, 
          year: selectedYear  
        }));
      }
    } catch (error) {
      showToast("ERROR", error.message || "Failed to fetch trending products data");
    }
  };

  // Effect to fetch data when params change
  useEffect(() => {
    fetchTrendingProductsData();
  }, [timePeriod, selectedDate, startDate, endDate, selectedMonth, selectedYear, business]);

  // Process data from API responses
  useEffect(() => {
    let products = [];
    let totalSold = 0;
    let periodLabel = "";
    
    if (timePeriod === "daily" && dailyTrendingProducts) {
      products = dailyTrendingProducts.trendingProducts || [];
      totalSold = products.reduce((sum, product) => sum + product.totalSold, 0);
      periodLabel = `Daily Trending (${format(selectedDate, "yyyy-MM-dd")})`;
    } 
    else if (timePeriod === "weekly" && weeklyTrendingProducts) {
      products = weeklyTrendingProducts.trendingProducts || [];
      totalSold = products.reduce((sum, product) => sum + product.totalSold, 0);
      periodLabel = `Weekly Trending (${startDate} to ${endDate})`;
    } 
    else if (timePeriod === "monthly" && monthlyTrendingProducts) {
      products = monthlyTrendingProducts.trendingProducts || [];
      totalSold = products.reduce((sum, product) => sum + product.totalSold, 0);
      periodLabel = `Monthly Trending (${monthNames[selectedMonth]} ${selectedYear})`;
    }
    
    setTrendingData({
      products,
      totalSold,
      periodLabel
    });
  }, [timePeriod, dailyTrendingProducts, weeklyTrendingProducts, monthlyTrendingProducts, selectedDate, startDate, endDate, selectedMonth, selectedYear]);

  // Prepare pie chart data
  const preparePieChartData = () => {
    // Only use top 5 products for pie chart to avoid cluttering
    const topProducts = trendingData.products.slice(0, 5);
    
    // If there are more products beyond the top 5, group them into "Others"
    let othersQuantity = 0;
    if (trendingData.products.length > 5) {
      othersQuantity = trendingData.products
        .slice(5)
        .reduce((sum, product) => sum + product.totalSold, 0);
    }
    
    const labels = topProducts.map(product => product.productTitle);
    const data = topProducts.map(product => product.totalSold);
    
    if (othersQuantity > 0) {
      labels.push("Others");
      data.push(othersQuantity);
    }
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: COLORS.slice(0, labels.length),
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare bar chart data
  const prepareBarChartData = () => {
    // Use top 10 products for bar chart
    const topProducts = trendingData.products.slice(0, 10);
    
    return {
      labels: topProducts.map(product => {
        // Truncate long product names for better display
        const title = product.productTitle;
        return title.length > 15 ? title.substring(0, 15) + '...' : title;
      }),
      datasets: [
        {
          label: 'Quantity Sold',
          data: topProducts.map(product => product.totalSold),
          backgroundColor: COLORS.slice(0, topProducts.length),
        },
      ],
    };
  };

  // Chart options
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: {
            size: 10
          }
        },
      },
      title: {
        display: true,
        text: 'Product Distribution by Sales',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = Math.round((value / trendingData.totalSold) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  const barChartOptions = {
    indexAxis: 'y', // Horizontal bar chart
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Top Products by Quantity Sold',
        font: {
          size: 16
        }
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          precision: 0, // Force integers only (no decimals)
          stepSize: 5, // Set step size between ticks
          callback: function(value) {
            return value % 1 === 0 ? value : null; // Only show integers
          }
        },
        title: {
          display: true,
          text: 'Quantity Sold'
        }
      },
    },
  };

  // Render date picker based on period
  const renderDatePicker = () => {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {timePeriod === "daily" && (
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newDate) => {
                if (newDate) {
                  setSelectedDate(newDate);
                }
              }}
            />
          )}
          
          {timePeriod === "weekly" && (
            <DatePicker
              label="Select End Date"
              value={selectedDate}
              onChange={(newDate) => {
                if (newDate) {
                  setSelectedDate(newDate);
                }
              }}
            />
          )}
  
          {timePeriod === "monthly" && (
            <div className="flex flex-col md:flex-row gap-4">
              <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                <InputLabel>Month</InputLabel>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  label="Month"
                >
                  {monthNames.map((month, index) => (
                    <MenuItem key={month} value={index}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl variant="outlined" sx={{ minWidth: 100 }}>
                <InputLabel>Year</InputLabel>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  label="Year"
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(
                    (year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </div>
          )}
  
          {timePeriod === "weekly" && (
            <div>
              <Typography variant="caption" display="block" gutterBottom>
                Date Range: {startDate} to {endDate}
              </Typography>
            </div>
          )}
        </div>
      </LocalizationProvider>
    );
  };

  // Main render
  const renderTrendingProductsReport = () => {
    return (
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <Typography variant="h5" className="mb-2 md:mb-0">
            Trending Products Report
          </Typography>
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              label="Period"
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Date Selection */}
        <Paper className="p-4 mb-6">{renderDatePicker()}</Paper>

        <Grid container spacing={3}>
          {/* Bar Chart */}
          <Grid item xs={12} md={8}>
            <Paper className="p-4 h-full">
              <Typography variant="h6" className="mb-4">
                {trendingData.periodLabel}
              </Typography>
              <div style={{ height: "400px" }}>
                {trendingData.products.length > 0 ? (
                  <Bar
                    data={prepareBarChartData()}
                    options={barChartOptions}
                  />
                ) : (
                  <div className="flex h-full justify-center items-center">
                    <Typography variant="body1" color="textSecondary">
                      No trending products data available for this period
                    </Typography>
                  </div>
                )}
              </div>
            </Paper>
          </Grid>

          {/* Pie Chart & Summary */}
          <Grid item xs={12} md={4}>
            <Paper className="p-4 h-full">
              <Typography variant="h6" className="mb-4">
                Market Share
              </Typography>
              
              <div style={{ height: "200px" }} className="mb-4">
                {trendingData.products.length > 0 ? (
                  <Pie
                    data={preparePieChartData()}
                    options={pieChartOptions}
                  />
                ) : (
                  <div className="flex h-full justify-center items-center">
                    <Typography variant="body1" color="textSecondary">
                      No data available
                    </Typography>
                  </div>
                )}
              </div>

              <Divider className="my-4" />

              <div className="mb-4">
                <Typography variant="subtitle1" color="textSecondary">
                  Total Units Sold
                </Typography>
                <Typography variant="h4" className="font-bold text-primary">
                  {trendingData.totalSold}
                </Typography>
              </div>

              <Divider className="my-4" />

              <Typography variant="subtitle1" className="mb-2">
                Top Selling Products
              </Typography>
              {trendingData.products.slice(0, 5).map((product, index) => (
                <div key={index} className="flex justify-between mb-2">
                  <Typography variant="body2">{product.productTitle}</Typography>
                  <Typography variant="body2" className="font-bold">
                    {product.totalSold} units
                  </Typography>
                </div>
              ))}
            </Paper>
          </Grid>

          
        </Grid>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      {isloading ? (
        <div className="flex justify-center items-center py-16">
          <CircularProgress />
        </div>
      ) : (
        renderTrendingProductsReport()
      )}
    </div>
  );
};

export default TrendingProductsTab;