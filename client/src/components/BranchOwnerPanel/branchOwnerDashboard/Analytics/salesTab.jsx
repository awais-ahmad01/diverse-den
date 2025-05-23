import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWeeklySales, getMonthlySales, getYearlySales } from "../../../../store/actions/analytics";
import { showToast } from "../../../../tools";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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

// Theme matching ListProducts
const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
  },
});

// Color palette for charts
const COLORS = ["#603F26", "#82ca9d", "#FFBB28", "#FF8042"];

const SalesTab = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { weeklySales, monthlySales, yearlySales, isloading } = useSelector((state) => state.analytics);

  const business = user?.business;

  const [tabValue, setTabValue] = useState(0);
  const [salesPeriod, setSalesPeriod] = useState("weekly");

  // Date states for sales report
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(format(addDays(new Date(), -6), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  
  // Month and year for monthly sales
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Array of month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Processed sales data state
  const [salesData, setSalesData] = useState({ data: [], totalAmount: 0 });

  // Update date ranges based on selected period
  useEffect(() => {
    updateDateRange();
  }, [salesPeriod, selectedDate]);

  // Function to update date range based on selected period
  const updateDateRange = () => {
    let start, end;

    switch (salesPeriod) {
      case "weekly":
        end = format(selectedDate, "yyyy-MM-dd");
        start = format(addDays(selectedDate, -6), "yyyy-MM-dd");
        break;
      case "monthly":
        start = format(startOfMonth(selectedDate), "yyyy-MM-dd");
        end = format(endOfMonth(selectedDate), "yyyy-MM-dd");
        break;
      case "yearly":
        start = format(startOfYear(selectedDate), "yyyy-MM-dd");
        end = format(endOfYear(selectedDate), "yyyy-MM-dd");
        break;
      default:
        end = format(selectedDate, "yyyy-MM-dd");
        start = format(addDays(selectedDate, -6), "yyyy-MM-dd");
    }

    setStartDate(start);
    setEndDate(end);
  };

  // Fetch sales data from API
  const fetchSalesData = async () => {
    try {
      if (salesPeriod === "weekly") {
        await dispatch(getWeeklySales({ business, startDate, endDate }));
      } else if (salesPeriod === "monthly") {
        const monthName = monthNames[selectedMonth];
        await dispatch(getMonthlySales({ 
          business, 
          month: monthName, 
          year: selectedYear 
        }));
      } else if (salesPeriod === "yearly") {
        await dispatch(getYearlySales({ 
          business, 
          year: selectedYear 
        }));
      }
    } catch (error) {
      showToast("ERROR", error.message || "Failed to fetch sales data");
    }
  };

  // Effect to fetch data when dates, period, month or year changes
  useEffect(() => {
    fetchSalesData();
  }, [startDate, endDate, salesPeriod, selectedMonth, selectedYear]);

  // Process data from Redux store
  useEffect(() => {
    if (salesPeriod === "weekly" && weeklySales && weeklySales.dailySales) {
      const processedData = weeklySales.dailySales.map((day) => {
        const dateParts = day.date.split("-");
        const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
        const dateObj = new Date(formattedDate);

        return {
          date: format(dateObj, "MMM dd"),
          originalDate: day.date,
          sales: day.dailySales || 0,
          orders: day.dailyOrders || 0,
        };
      });

      const totalAmount = weeklySales.weeklySales?.totalSales ||
        processedData.reduce((sum, day) => sum + day.sales, 0);

      setSalesData({
        data: processedData,
        totalAmount: totalAmount,
      });
    } else if (salesPeriod === "monthly" && monthlySales && monthlySales.monthlySalesData) {
      const processedData = monthlySales.monthlySalesData.map((day) => {
        const dateParts = day.date.split("-");
        const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
        const dateObj = new Date(formattedDate);

        return {
          date: format(dateObj, "MMM dd"),
          originalDate: day.date,
          sales: day.totalSales || 0,
          orders: day.orderCount || 0,
        };
      });

      const totalAmount = monthlySales.totalMonthlySales ||
        processedData.reduce((sum, day) => sum + day.sales, 0);

      setSalesData({
        data: processedData,
        totalAmount: totalAmount,
      });
    }
    else if (salesPeriod === "yearly" && yearlySales && yearlySales.salesData) {
      const processedData = yearlySales.salesData.map((monthData) => {
        return {
          date: monthData.month,
          originalDate: `${selectedYear}-${monthNames.indexOf(monthData.month) + 1}`,
          sales: monthData.totalSales || 0,
          orders: monthData.orderCount || 0,
        };
      });
  
      const totalAmount = yearlySales.totalYearlySales ||
        processedData.reduce((sum, month) => sum + month.sales, 0);
  
      setSalesData({
        data: processedData,
        totalAmount: totalAmount,
      });
    }
  }, [weeklySales, monthlySales, yearlySales, salesPeriod]);

  // Prepare chart data for Chart.js
  const prepareLineChartData = () => {
    return {
      labels: salesData.data.map((item) => item.date),
      datasets: [
        {
          label: "Sales (Rs)",
          data: salesData.data.map((item) => item.sales),
          borderColor: COLORS[0],
          backgroundColor: `${COLORS[0]}33`,
          tension: 0.1,
          fill: false,
        },
        {
          label: "Orders",
          data: salesData.data.map((item) => item.orders),
          borderColor: COLORS[1],
          backgroundColor: `${COLORS[1]}33`,
          tension: 0.1,
          fill: false,
        },
      ],
    };
  };

  const prepareBarChartData = () => {
    return {
      labels: salesData.data.map((item) => item.date),
      datasets: [
        {
          label: "Sales (Rs)",
          data: salesData.data.map((item) => item.sales),
          backgroundColor: COLORS[0],
          // Make sure the bars don't overlap by setting barPercentage
          barPercentage: 0.5,
          // Use axis ID to separate sales and orders scales
          yAxisID: 'y-axis-sales',
        },
        {
          label: "Orders",
          data: salesData.data.map((item) => item.orders),
          backgroundColor: COLORS[1],
          // Make sure the bars don't overlap by setting barPercentage
          barPercentage: 0.5,
          // Use axis ID to separate sales and orders scales
          yAxisID: 'y-axis-orders',
        },
      ],
    };
  };

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${
          salesPeriod.charAt(0).toUpperCase() + salesPeriod.slice(1)
        } Sales Trend`,
        font: {
          size: 16,
          weight: 'bold'
        },
        color: '#603F26'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${
          salesPeriod.charAt(0).toUpperCase() + salesPeriod.slice(1)
        } Sales Distribution`,
        font: {
          size: 16,
          weight: 'bold'
        },
        color: '#603F26'
      },
      tooltip: {
        callbacks: {
          // Customize tooltip to display both sales and orders clearly
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${label.includes('Sales') ? 'Rs ' : ''}${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      'y-axis-sales': {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sales (Rs)',
          color: COLORS[0],
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: function(value) {
            return 'Rs ' + value.toLocaleString();
          }
        }
      },
      'y-axis-orders': {
        type: 'linear',
        position: 'right',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Orders',
          color: COLORS[1],
        },
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
  };

  // Render date picker based on period
  const renderDatePicker = () => {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {salesPeriod === "weekly" && (
            <DatePicker
              label="Select End Date"
              value={selectedDate}
              onChange={(newDate) => {
                if (newDate) {
                  setSelectedDate(newDate);
                }
              }}
              sx={{
                '& .MuiInputBase-root': {
                  height: '45px'
                }
              }}
            />
          )}
  
          {salesPeriod === "monthly" && (
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
  
          {salesPeriod === "yearly" && (
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
          )}
  
          {salesPeriod === "weekly" && (
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

  // Sales Report Tab Content
  const renderSalesReport = () => {
    let chartTitle, summaryTitle;
    
    switch (salesPeriod) {
      case "weekly":
        chartTitle = "Weekly Sales Trend";
        summaryTitle = "Weekly Sales";
        break;
      case "monthly":
        chartTitle = `Monthly Sales (${monthNames[selectedMonth]} ${selectedYear})`;
        summaryTitle = "Monthly Sales";
        break;
      case "yearly":
        chartTitle = `Yearly Sales (${selectedYear})`;
        summaryTitle = "Yearly Sales";
        break;
      default:
        chartTitle = "Sales Trend";
        summaryTitle = "Sales Summary";
    }

    return (
      <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ color: "#603F26", fontWeight: "bold" }}>
            Sales Report
          </Typography>
        </Box>

        {/* Controls Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Period</InputLabel>
                <Select
                  value={salesPeriod}
                  onChange={(e) => setSalesPeriod(e.target.value)}
                  label="Period"
                >
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              {renderDatePicker()}
            </Grid>
          </Grid>
        </Paper>

        {/* Charts Section */}
        <Grid container spacing={3}>
          {/* Line Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" sx={{ color: "#603F26", mb: 2 }}>
                {chartTitle}
              </Typography>
              <Box sx={{ height: 350 }}>
                <Line
                  data={prepareLineChartData()}
                  options={{
                    ...lineChartOptions,
                    plugins: {
                      ...lineChartOptions.plugins,
                      title: {
                        ...lineChartOptions.plugins.title,
                        text: chartTitle
                      }
                    }
                  }}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Summary Card */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" sx={{ color: "#603F26", mb: 2 }}>
                Sales Summary
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="textSecondary">
                  Total {summaryTitle}
                </Typography>
                <Typography variant="h4" sx={{ color: "#603F26", fontWeight: "bold" }}>
                  Rs {salesData.totalAmount.toLocaleString()}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" sx={{ mb: 2, color: "#603F26" }}>
                Top Selling Days
              </Typography>
              {salesData.data
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 5)
                .map((day, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{day.date}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Rs {day.sales.toLocaleString()}
                    </Typography>
                  </Box>
                ))}
            </Paper>
          </Grid>

          {/* Bar Chart */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: "#603F26", mb: 2 }}>
                {chartTitle} Distribution
              </Typography>
              <Box sx={{ height: 350 }}>
                <Bar 
                  data={prepareBarChartData()} 
                  options={barChartOptions}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5 pb-9">
        {isloading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress sx={{ color: "#603F26" }} />
          </Box>
        ) : (
          renderSalesReport()
        )}
      </div>
    </ThemeProvider>
  );
};

export default SalesTab;







// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getWeeklySales, getMonthlySales, getYearlySales } from "../../../../store/actions/analytics";
// import { showToast } from "../../../../tools";
// import { createTheme, ThemeProvider } from "@mui/material/styles";

// import {
//   Tabs,
//   Tab,
//   Box,
//   Paper,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardHeader,
//   FormControl,
//   Select,
//   MenuItem,
//   InputLabel,
//   CircularProgress,
//   TableContainer,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Divider,
//   TextField,
//   Button,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import {
//   format,
//   addDays,
//   startOfWeek,
//   endOfWeek,
//   startOfMonth,
//   endOfMonth,
//   startOfYear,
//   endOfYear,
// } from "date-fns";
// import { Line, Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import {
//   Timeline,
//   TrendingUp,
//   MonetizationOn,
//   ShoppingCart,
// } from "@mui/icons-material";

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// // Theme matching ListProducts
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#603F26",
//     },
//   },
// });

// // Color palette for charts
// const COLORS = ["#603F26", "#82ca9d", "#FFBB28", "#FF8042"];

// const SalesTab = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const { weeklySales, monthlySales, yearlySales, isloading } = useSelector((state) => state.analytics);

//   const business = user?.business;

//   const [tabValue, setTabValue] = useState(0);
//   const [salesPeriod, setSalesPeriod] = useState("weekly");

//   // Date states for sales report
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [startDate, setStartDate] = useState(format(addDays(new Date(), -6), "yyyy-MM-dd"));
//   const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  
//   // Month and year for monthly sales
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
//   // Array of month names
//   const monthNames = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];

//   // Processed sales data state
//   const [salesData, setSalesData] = useState({ data: [], totalAmount: 0 });

//   // Update date ranges based on selected period
//   useEffect(() => {
//     updateDateRange();
//   }, [salesPeriod, selectedDate]);

//   // Function to update date range based on selected period
//   const updateDateRange = () => {
//     let start, end;

//     switch (salesPeriod) {
//       case "weekly":
//         end = format(selectedDate, "yyyy-MM-dd");
//         start = format(addDays(selectedDate, -6), "yyyy-MM-dd");
//         break;
//       case "monthly":
//         start = format(startOfMonth(selectedDate), "yyyy-MM-dd");
//         end = format(endOfMonth(selectedDate), "yyyy-MM-dd");
//         break;
//       case "yearly":
//         start = format(startOfYear(selectedDate), "yyyy-MM-dd");
//         end = format(endOfYear(selectedDate), "yyyy-MM-dd");
//         break;
//       default:
//         end = format(selectedDate, "yyyy-MM-dd");
//         start = format(addDays(selectedDate, -6), "yyyy-MM-dd");
//     }

//     setStartDate(start);
//     setEndDate(end);
//   };

//   // Fetch sales data from API
//   const fetchSalesData = async () => {
//     try {
//       if (salesPeriod === "weekly") {
//         await dispatch(getWeeklySales({ business, startDate, endDate }));
//       } else if (salesPeriod === "monthly") {
//         const monthName = monthNames[selectedMonth];
//         await dispatch(getMonthlySales({ 
//           business, 
//           month: monthName, 
//           year: selectedYear 
//         }));
//       } else if (salesPeriod === "yearly") {
//         await dispatch(getYearlySales({ 
//           business, 
//           year: selectedYear 
//         }));
//       }
//     } catch (error) {
//       showToast("ERROR", error.message || "Failed to fetch sales data");
//     }
//   };

//   // Effect to fetch data when dates, period, month or year changes
//   useEffect(() => {
//     fetchSalesData();
//   }, [startDate, endDate, salesPeriod, selectedMonth, selectedYear]);

//   // Process data from Redux store
//   useEffect(() => {
//     if (salesPeriod === "weekly" && weeklySales && weeklySales.dailySales) {
//       const processedData = weeklySales.dailySales.map((day) => {
//         const dateParts = day.date.split("-");
//         const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
//         const dateObj = new Date(formattedDate);

//         return {
//           date: format(dateObj, "MMM dd"),
//           originalDate: day.date,
//           sales: day.dailySales || 0,
//           orders: day.dailyOrders || 0,
//         };
//       });

//       const totalAmount = weeklySales.weeklySales?.totalSales ||
//         processedData.reduce((sum, day) => sum + day.sales, 0);

//       setSalesData({
//         data: processedData,
//         totalAmount: totalAmount,
//       });
//     } else if (salesPeriod === "monthly" && monthlySales && monthlySales.monthlySalesData) {
//       const processedData = monthlySales.monthlySalesData.map((day) => {
//         const dateParts = day.date.split("-");
//         const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
//         const dateObj = new Date(formattedDate);

//         return {
//           date: format(dateObj, "MMM dd"),
//           originalDate: day.date,
//           sales: day.totalSales || 0,
//           orders: day.orderCount || 0,
//         };
//       });

//       const totalAmount = monthlySales.totalMonthlySales ||
//         processedData.reduce((sum, day) => sum + day.sales, 0);

//       setSalesData({
//         data: processedData,
//         totalAmount: totalAmount,
//       });
//     }
//     else if (salesPeriod === "yearly" && yearlySales && yearlySales.salesData) {
//       const processedData = yearlySales.salesData.map((monthData) => {
//         return {
//           date: monthData.month,
//           originalDate: `${selectedYear}-${monthNames.indexOf(monthData.month) + 1}`,
//           sales: monthData.totalSales || 0,
//           orders: monthData.orderCount || 0,
//         };
//       });
  
//       const totalAmount = yearlySales.totalYearlySales ||
//         processedData.reduce((sum, month) => sum + month.sales, 0);
  
//       setSalesData({
//         data: processedData,
//         totalAmount: totalAmount,
//       });
//     }
//   }, [weeklySales, monthlySales, yearlySales, salesPeriod]);

//   // Prepare chart data for Chart.js
//   const prepareLineChartData = () => {
//     return {
//       labels: salesData.data.map((item) => item.date),
//       datasets: [
//         {
//           label: "Sales (Rs)",
//           data: salesData.data.map((item) => item.sales),
//           borderColor: COLORS[0],
//           backgroundColor: `${COLORS[0]}33`,
//           tension: 0.1,
//           fill: false,
//         },
//         {
//           label: "Orders",
//           data: salesData.data.map((item) => item.orders),
//           borderColor: COLORS[1],
//           backgroundColor: `${COLORS[1]}33`,
//           tension: 0.1,
//           fill: false,
//         },
//       ],
//     };
//   };

//   const prepareBarChartData = () => {
//     return {
//       labels: salesData.data.map((item) => item.date),
//       datasets: [
//         {
//           label: "Sales (Rs)",
//           data: salesData.data.map((item) => item.sales),
//           backgroundColor: COLORS[0],
//         },
//         {
//           label: "Orders",
//           data: salesData.data.map((item) => item.orders),
//           backgroundColor: COLORS[1],
//         },
//       ],
//     };
//   };

//   // Chart options
//   const lineChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       title: {
//         display: true,
//         text: `${
//           salesPeriod.charAt(0).toUpperCase() + salesPeriod.slice(1)
//         } Sales Trend`,
//         font: {
//           size: 16,
//           weight: 'bold'
//         },
//         color: '#603F26'
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: 'rgba(0, 0, 0, 0.05)'
//         }
//       },
//       x: {
//         grid: {
//           color: 'rgba(0, 0, 0, 0.05)'
//         }
//       }
//     },
//   };

//   const barChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       title: {
//         display: true,
//         text: `${
//           salesPeriod.charAt(0).toUpperCase() + salesPeriod.slice(1)
//         } Sales Distribution`,
//         font: {
//           size: 16,
//           weight: 'bold'
//         },
//         color: '#603F26'
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: 'rgba(0, 0, 0, 0.05)'
//         }
//       },
//       x: {
//         grid: {
//           color: 'rgba(0, 0, 0, 0.05)'
//         }
//       }
//     },
//   };

//   // Render date picker based on period
//   const renderDatePicker = () => {
//     return (
//       <LocalizationProvider dateAdapter={AdapterDateFns}>
//         <div className="flex flex-col md:flex-row gap-4 items-center">
//           {salesPeriod === "weekly" && (
//             <DatePicker
//               label="Select End Date"
//               value={selectedDate}
//               onChange={(newDate) => {
//                 if (newDate) {
//                   setSelectedDate(newDate);
//                 }
//               }}
//               sx={{
//                 '& .MuiInputBase-root': {
//                   height: '45px'
//                 }
//               }}
//             />
//           )}
  
//           {salesPeriod === "monthly" && (
//             <div className="flex flex-col md:flex-row gap-4">
//               <FormControl variant="outlined" sx={{ minWidth: 150 }}>
//                 <InputLabel>Month</InputLabel>
//                 <Select
//                   value={selectedMonth}
//                   onChange={(e) => setSelectedMonth(e.target.value)}
//                   label="Month"
//                 >
//                   {monthNames.map((month, index) => (
//                     <MenuItem key={month} value={index}>
//                       {month}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
              
//               <FormControl variant="outlined" sx={{ minWidth: 100 }}>
//                 <InputLabel>Year</InputLabel>
//                 <Select
//                   value={selectedYear}
//                   onChange={(e) => setSelectedYear(e.target.value)}
//                   label="Year"
//                 >
//                   {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(
//                     (year) => (
//                       <MenuItem key={year} value={year}>
//                         {year}
//                       </MenuItem>
//                     )
//                   )}
//                 </Select>
//               </FormControl>
//             </div>
//           )}
  
//           {salesPeriod === "yearly" && (
//             <FormControl variant="outlined" sx={{ minWidth: 100 }}>
//               <InputLabel>Year</InputLabel>
//               <Select
//                 value={selectedYear}
//                 onChange={(e) => setSelectedYear(e.target.value)}
//                 label="Year"
//               >
//                 {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(
//                   (year) => (
//                     <MenuItem key={year} value={year}>
//                       {year}
//                     </MenuItem>
//                   )
//                 )}
//               </Select>
//             </FormControl>
//           )}
  
//           {salesPeriod === "weekly" && (
//             <div>
//               <Typography variant="caption" display="block" gutterBottom>
//                 Date Range: {startDate} to {endDate}
//               </Typography>
//             </div>
//           )}
//         </div>
//       </LocalizationProvider>
//     );
//   };

//   // Sales Report Tab Content
//   const renderSalesReport = () => {
//     let chartTitle, summaryTitle;
    
//     switch (salesPeriod) {
//       case "weekly":
//         chartTitle = "Weekly Sales Trend";
//         summaryTitle = "Weekly Sales";
//         break;
//       case "monthly":
//         chartTitle = `Monthly Sales (${monthNames[selectedMonth]} ${selectedYear})`;
//         summaryTitle = "Monthly Sales";
//         break;
//       case "yearly":
//         chartTitle = `Yearly Sales (${selectedYear})`;
//         summaryTitle = "Yearly Sales";
//         break;
//       default:
//         chartTitle = "Sales Trend";
//         summaryTitle = "Sales Summary";
//     }

//     return (
//       <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
//         <Box sx={{ mb: 4 }}>
//           <Typography variant="h5" sx={{ color: "#603F26", fontWeight: "bold" }}>
//             Sales Report
//           </Typography>
//         </Box>

//         {/* Controls Section */}
//         <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
//           <Grid container spacing={2} alignItems="center">
//             <Grid item xs={12} md={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Period</InputLabel>
//                 <Select
//                   value={salesPeriod}
//                   onChange={(e) => setSalesPeriod(e.target.value)}
//                   label="Period"
//                 >
//                   <MenuItem value="weekly">Weekly</MenuItem>
//                   <MenuItem value="monthly">Monthly</MenuItem>
//                   <MenuItem value="yearly">Yearly</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {renderDatePicker()}
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* Charts Section */}
//         <Grid container spacing={3}>
//           {/* Line Chart */}
//           <Grid item xs={12} md={8}>
//             <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
//               <Typography variant="h6" sx={{ color: "#603F26", mb: 2 }}>
//                 {chartTitle}
//               </Typography>
//               <Box sx={{ height: 350 }}>
//                 <Line
//                   data={prepareLineChartData()}
//                   options={{
//                     ...lineChartOptions,
//                     plugins: {
//                       ...lineChartOptions.plugins,
//                       title: {
//                         ...lineChartOptions.plugins.title,
//                         text: chartTitle
//                       }
//                     }
//                   }}
//                 />
//               </Box>
//             </Paper>
//           </Grid>

//           {/* Summary Card */}
//           <Grid item xs={12} md={4}>
//             <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
//               <Typography variant="h6" sx={{ color: "#603F26", mb: 2 }}>
//                 Sales Summary
//               </Typography>
//               <Box sx={{ mb: 3 }}>
//                 <Typography variant="subtitle1" color="textSecondary">
//                   Total {summaryTitle}
//                 </Typography>
//                 <Typography variant="h4" sx={{ color: "#603F26", fontWeight: "bold" }}>
//                   Rs {salesData.totalAmount.toLocaleString()}
//                 </Typography>
//               </Box>

//               <Divider sx={{ my: 2 }} />

//               <Typography variant="subtitle1" sx={{ mb: 2, color: "#603F26" }}>
//                 Top Selling Days
//               </Typography>
//               {salesData.data
//                 .sort((a, b) => b.sales - a.sales)
//                 .slice(0, 5)
//                 .map((day, index) => (
//                   <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                     <Typography variant="body2">{day.date}</Typography>
//                     <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//                       Rs {day.sales.toLocaleString()}
//                     </Typography>
//                   </Box>
//                 ))}
//             </Paper>
//           </Grid>

//           {/* Bar Chart */}
//           <Grid item xs={12}>
//             <Paper sx={{ p: 3, borderRadius: 2 }}>
//               <Typography variant="h6" sx={{ color: "#603F26", mb: 2 }}>
//                 {chartTitle} Distribution
//               </Typography>
//               <Box sx={{ height: 350 }}>
//                 <Bar 
//                   data={prepareBarChartData()} 
//                   options={{
//                     ...barChartOptions,
//                     plugins: {
//                       ...barChartOptions.plugins,
//                       title: {
//                         ...barChartOptions.plugins.title,
//                         text: `${chartTitle} Distribution`
//                       }
//                     }
//                   }}
//                 />
//               </Box>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Box>
//     );
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <div className="relative bg-gray-50 flex flex-col pt-5 pb-9">
//         {isloading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
//             <CircularProgress sx={{ color: "#603F26" }} />
//           </Box>
//         ) : (
//           renderSalesReport()
//         )}
//       </div>
//     </ThemeProvider>
//   );
// };

// export default SalesTab;










// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getWeeklySales, getMonthlySales, getYearlySales } from "../../../../store/actions/analytics";
// import { showToast } from "../../../../tools";

// import {
//   Tabs,
//   Tab,
//   Box,
//   Paper,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardHeader,
//   FormControl,
//   Select,
//   MenuItem,
//   InputLabel,
//   CircularProgress,
//   TableContainer,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Divider,
//   TextField,
//   Button,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import {
//   format,
//   addDays,
//   startOfWeek,
//   endOfWeek,
//   startOfMonth,
//   endOfMonth,
//   startOfYear,
//   endOfYear,
// } from "date-fns";
// import { Line, Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import {
//   Timeline,
//   TrendingUp,
//   MonetizationOn,
//   ShoppingCart,
// } from "@mui/icons-material";

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// // Color palette for charts
// const COLORS = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042"];

// const SalesTab = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const { weeklySales, monthlySales, yearlySales, isloading } = useSelector((state) => state.analytics);

//   const business = user?.business;

//   const [tabValue, setTabValue] = useState(0);
//   const [salesPeriod, setSalesPeriod] = useState("weekly");
 

//   // Date states for sales report
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [startDate, setStartDate] = useState(format(addDays(new Date(), -6), "yyyy-MM-dd"));
//   const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  
//   // Month and year for monthly sales
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
//   // Array of month names
//   const monthNames = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];

//   // Processed sales data state
//   const [salesData, setSalesData] = useState({ data: [], totalAmount: 0 });

//   console.log("saleData:", salesData);



//   // Update date ranges based on selected period
//   useEffect(() => {
//     updateDateRange();
//   }, [salesPeriod, selectedDate]);

//   // Function to update date range based on selected period
//   const updateDateRange = () => {
//     let start, end;

//     switch (salesPeriod) {
//       case "weekly":
//         end = format(selectedDate, "yyyy-MM-dd");
//         start = format(addDays(selectedDate, -6), "yyyy-MM-dd");
//         break;
//       case "monthly":
//         start = format(startOfMonth(selectedDate), "yyyy-MM-dd");
//         end = format(endOfMonth(selectedDate), "yyyy-MM-dd");
//         break;
//       case "yearly":
//         start = format(startOfYear(selectedDate), "yyyy-MM-dd");
//         end = format(endOfYear(selectedDate), "yyyy-MM-dd");
//         break;
//       default:
//         end = format(selectedDate, "yyyy-MM-dd");
//         start = format(addDays(selectedDate, -6), "yyyy-MM-dd");
//     }

//     setStartDate(start);
//     setEndDate(end);
//   };

//   // Fetch sales data from API
//   const fetchSalesData = async () => {
//     try {
//       if (salesPeriod === "weekly") {
//         await dispatch(getWeeklySales({ business, startDate, endDate }));
//       } else if (salesPeriod === "monthly") {
//         const monthName = monthNames[selectedMonth];
        
//         await dispatch(getMonthlySales({ 
//           business, 
//           month: monthName, 
//           year: selectedYear 
//         }));
//       } else if (salesPeriod === "yearly") {
//         console.log("selectedYear:", selectedYear)
//         await dispatch(getYearlySales({ 
//           business, 
//           year: selectedYear 
//         }));
//       }
//     } catch (error) {
//       showToast("ERROR", error.message || "Failed to fetch sales data");
//     }
//   };

//   // Effect to fetch data when dates, period, month or year changes
//   useEffect(() => {
//     fetchSalesData();
//   }, [startDate, endDate, salesPeriod, selectedMonth, selectedYear]);

//   // Process data from Redux store
//   useEffect(() => {
//     if (salesPeriod === "weekly" && weeklySales && weeklySales.dailySales) {
//       // Process weekly sales data
//       const processedData = weeklySales.dailySales.map((day) => {
//         const dateParts = day.date.split("-");
//         const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
//         const dateObj = new Date(formattedDate);

//         return {
//           date: format(dateObj, "MMM dd"),
//           originalDate: day.date,
//           sales: day.dailySales || 0,
//           orders: day.dailyOrders || 0,
//         };
//       });

//       const totalAmount = weeklySales.weeklySales?.totalSales ||
//         processedData.reduce((sum, day) => sum + day.sales, 0);

//       setSalesData({
//         data: processedData,
//         totalAmount: totalAmount,
//       });

      

//     } else if (salesPeriod === "monthly" && monthlySales && monthlySales.monthlySalesData) {
//       // Process monthly sales data
//       const processedData = monthlySales.monthlySalesData.map((day) => {
//         const dateParts = day.date.split("-");
//         const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
//         const dateObj = new Date(formattedDate);

//         return {
//           date: format(dateObj, "MMM dd"),
//           originalDate: day.date,
//           sales: day.totalSales || 0,
//           orders: day.orderCount || 0,
//         };
//       });

//       const totalAmount = monthlySales.totalMonthlySales ||
//         processedData.reduce((sum, day) => sum + day.sales, 0);

//       setSalesData({
//         data: processedData,
//         totalAmount: totalAmount,
//       });
//     }
//     else if (salesPeriod === "yearly" && yearlySales && yearlySales.salesData) {
//       // Process yearly sales data
//       const processedData = yearlySales.salesData.map((monthData) => {
//         return {
//           date: monthData.month,
//           originalDate: `${selectedYear}-${monthNames.indexOf(monthData.month) + 1}`,
//           sales: monthData.totalSales || 0,
//           orders: monthData.orderCount || 0,
//         };
//       });
  
//       const totalAmount = yearlySales.totalYearlySales ||
//         processedData.reduce((sum, month) => sum + month.sales, 0);
  
//       setSalesData({
//         data: processedData,
//         totalAmount: totalAmount,
//       });
//     }
//   }, [weeklySales, monthlySales, yearlySales, salesPeriod]);

//   // Prepare chart data for Chart.js
//   const prepareLineChartData = () => {
//     return {
//       labels: salesData.data.map((item) => item.date),
//       datasets: [
//         {
//           label: "Sales (Rs)",
//           data: salesData.data.map((item) => item.sales),
//           borderColor: COLORS[0],
//           backgroundColor: `${COLORS[0]}33`,
//           tension: 0.1,
//           fill: false,
//         },
//         {
//           label: "Orders",
//           data: salesData.data.map((item) => item.orders),
//           borderColor: COLORS[1],
//           backgroundColor: `${COLORS[1]}33`,
//           tension: 0.1,
//           fill: false,
//         },
//       ],
//     };
//   };

//   const prepareBarChartData = () => {
//     return {
//       labels: salesData.data.map((item) => item.date),
//       datasets: [
//         {
//           label: "Sales ($)",
//           data: salesData.data.map((item) => item.sales),
//           backgroundColor: COLORS[0],
//         },
//         {
//           label: "Orders",
//           data: salesData.data.map((item) => item.orders),
//           backgroundColor: COLORS[1],
//         },
//       ],
//     };
//   };

//   // Chart options
//   const lineChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       title: {
//         display: true,
//         text: `${
//           salesPeriod.charAt(0).toUpperCase() + salesPeriod.slice(1)
//         } Sales Trend`,
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   const barChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       title: {
//         display: true,
//         text: `${
//           salesPeriod.charAt(0).toUpperCase() + salesPeriod.slice(1)
//         } Sales Distribution`,
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   // Render date picker based on period
//   const renderDatePicker = () => {
//     return (
//       <LocalizationProvider dateAdapter={AdapterDateFns}>
//         <div className="flex flex-col md:flex-row gap-4 items-center">
//           {salesPeriod === "weekly" && (
//             <DatePicker
//               label="Select End Date"
//               value={selectedDate}
//               onChange={(newDate) => {
//                 if (newDate) {
//                   setSelectedDate(newDate);
//                 }
//               }}
//             />
//           )}
  
//           {salesPeriod === "monthly" && (
//             <div className="flex flex-col md:flex-row gap-4">
//               <FormControl variant="outlined" sx={{ minWidth: 150 }}>
//                 <InputLabel>Month</InputLabel>
//                 <Select
//                   value={selectedMonth}
//                   onChange={(e) => setSelectedMonth(e.target.value)}
//                   label="Month"
//                 >
//                   {monthNames.map((month, index) => (
//                     <MenuItem key={month} value={index}>
//                       {month}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
              
//               <FormControl variant="outlined" sx={{ minWidth: 100 }}>
//                 <InputLabel>Year</InputLabel>
//                 <Select
//                   value={selectedYear}
//                   onChange={(e) => setSelectedYear(e.target.value)}
//                   label="Year"
//                 >
//                   {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(
//                     (year) => (
//                       <MenuItem key={year} value={year}>
//                         {year}
//                       </MenuItem>
//                     )
//                   )}
//                 </Select>
//               </FormControl>
//             </div>
//           )}
  
//           {salesPeriod === "yearly" && (
//             <FormControl variant="outlined" sx={{ minWidth: 100 }}>
//               <InputLabel>Year</InputLabel>
//               <Select
//                 value={selectedYear}
//                 onChange={(e) => setSelectedYear(e.target.value)}
//                 label="Year"
//               >
//                 {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(
//                   (year) => (
//                     <MenuItem key={year} value={year}>
//                       {year}
//                     </MenuItem>
//                   )
//                 )}
//               </Select>
//             </FormControl>
//           )}
  
//           {salesPeriod === "weekly" && (
//             <div>
//               <Typography variant="caption" display="block" gutterBottom>
//                 Date Range: {startDate} to {endDate}
//               </Typography>
//             </div>
//           )}
//         </div>
//       </LocalizationProvider>
//     );
//   };

//   // Sales Report Tab Content
//   const renderSalesReport = () => {
//     let chartTitle, summaryTitle;
    
//     switch (salesPeriod) {
//       case "weekly":
//         chartTitle = "Weekly Sales Trend";
//         summaryTitle = "Weekly Sales";
//         break;
//       case "monthly":
//         chartTitle = `Monthly Sales (${monthNames[selectedMonth]} ${selectedYear})`;
//         summaryTitle = "Monthly Sales";
//         break;
//       case "yearly":
//         chartTitle = `Yearly Sales (${selectedYear})`;
//         summaryTitle = "Yearly Sales";
//         break;
//       default:
//         chartTitle = "Sales Trend";
//         summaryTitle = "Sales Summary";
//     }

//     return (
//       <div>
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//           <Typography variant="h5" className="mb-2 md:mb-0">
//             Sales Report
//           </Typography>
//           <div className="flex flex-col md:flex-row gap-4">
//             <FormControl variant="outlined" sx={{ minWidth: 200 }}>
//               <InputLabel>Period</InputLabel>
//               <Select
//                 value={salesPeriod}
//                 onChange={(e) => setSalesPeriod(e.target.value)}
//                 label="Period"
//               >
//                 <MenuItem value="weekly">Weekly</MenuItem>
//                 <MenuItem value="monthly">Monthly</MenuItem>
//                 <MenuItem value="yearly">Yearly</MenuItem>
//               </Select>
//             </FormControl>
//           </div>
//         </div>

//         {/* Date Selection */}
//         <Paper className="p-4 mb-6">{renderDatePicker()}</Paper>

//         <Grid container spacing={3}>
//           <Grid item xs={12} md={8}>
//             <Paper className="p-4 h-full">
//               <Typography variant="h6" className="mb-4">
//                 {chartTitle}
//               </Typography>
//               <div style={{ height: "300px" }}>
//                 <Line
//                   data={prepareLineChartData()}
//                   options={{
//                     ...lineChartOptions,
//                     plugins: {
//                       ...lineChartOptions.plugins,
//                       title: {
//                         ...lineChartOptions.plugins.title,
//                         text: chartTitle
//                       }
//                     }
//                   }}
//                 />
//               </div>
//             </Paper>
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <Paper className="p-4 h-full">
//               <Typography variant="h6" className="mb-4">
//                 Sales Summary
//               </Typography>
//               <div className="mb-4">
//                 <Typography variant="subtitle1" color="textSecondary">
//                   Total {summaryTitle}
//                 </Typography>
//                 <Typography variant="h4" className="font-bold text-primary">
//                   Rs {salesData.totalAmount.toLocaleString()}
//                 </Typography>
//               </div>

//               <Divider className="my-4" />

//               <Typography variant="subtitle1" className="mb-2">
//                 Top Selling Days
//               </Typography>
//               {salesData.data
//                 .sort((a, b) => b.sales - a.sales)
//                 .slice(0, 5)
//                 .map((day, index) => (
//                   <div key={index} className="flex justify-between mb-2">
//                     <Typography variant="body2">{day.date}</Typography>
//                     <Typography variant="body2" className="font-bold">
//                       Rs {day.sales.toLocaleString()}
//                     </Typography>
//                   </div>
//                 ))}
//             </Paper>
//           </Grid>

//           <Grid item xs={12}>
//             <Paper className="p-4">
//               <Typography variant="h6" className="mb-4">
//                 {chartTitle} Distribution
//               </Typography>
//               <div style={{ height: "300px" }}>
//                 <Bar 
//                   data={prepareBarChartData()} 
//                   options={{
//                     ...barChartOptions,
//                     plugins: {
//                       ...barChartOptions.plugins,
//                       title: {
//                         ...barChartOptions.plugins.title,
//                         text: `${chartTitle} Distribution`
//                       }
//                     }
//                   }}
//                 />
//               </div>
//             </Paper>
//           </Grid>

          
//         </Grid>
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto p-4">
//      {isloading ? (
//         <div className="flex justify-center items-center py-16">
//           <CircularProgress />
//         </div>
//       ) : (
//         <>
        
//           {tabValue === 0 && renderSalesReport()}

         
//         </>
//       )}


//     </div>
//   );
// };

// export default SalesTab;
