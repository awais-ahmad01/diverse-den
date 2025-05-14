// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getWeeklySubscriptionReports, getMonthlySubscriptionReports, getYearlySubscriptionReports } from "../../../store/actions/analytics";
// import { showToast } from "../../../tools";


// import {
//   Box,
//   Paper,
//   Typography,
//   Grid,
//   CardContent,
//   FormControl,
//   Select,
//   MenuItem,
//   InputLabel,
//   CircularProgress,
//   Divider,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import {
//   format,
//   addDays,
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

// const SubscriptionTab = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const { weeklySubscription, monthlySubscription, yearlySubscription, isloading } = useSelector((state) => state.analytics);

//   // Period state
//   const [subscriptionPeriod, setSubscriptionPeriod] = useState("weekly");
 
//   // Date states for subscription report
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [startDate, setStartDate] = useState(format(addDays(new Date(), -6), "yyyy-MM-dd"));
//   const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  
//   // Month and year for monthly subscriptions
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
//   // Array of month names
//   const monthNames = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];

//   // Processed subscription data state
//   const [subscriptionData, setSubscriptionData] = useState({ data: [], totalAmount: 0 });

//   // Update date ranges based on selected period
//   useEffect(() => {
//     updateDateRange();
//   }, [subscriptionPeriod, selectedDate]);

//   // Function to update date range based on selected period
//   const updateDateRange = () => {
//     let start, end;

//     switch (subscriptionPeriod) {
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

//   // Fetch subscription data from API
//   const fetchSubscriptionData = async () => {
//     try {
//       if (subscriptionPeriod === "weekly") {
//         await dispatch(getWeeklySubscriptionReports({ startDate, endDate }));
//       } else if (subscriptionPeriod === "monthly") {
//         const monthName = monthNames[selectedMonth];
        
//         await dispatch(getMonthlySubscriptionReports({ 
//           month: monthName, 
//           year: selectedYear 
//         }));
//       } else if (subscriptionPeriod === "yearly") {
//         const monthName = monthNames[selectedMonth];
//         await dispatch(getYearlySubscriptionReports({ 
//             month: monthName, 
//           year: selectedYear 
//         }));
//       }
//     } catch (error) {
//       showToast("ERROR", error.message || "Failed to fetch subscription data");
//     }
//   };

//   // Effect to fetch data when dates, period, month or year changes
//   useEffect(() => {
//     fetchSubscriptionData();
//   }, [startDate, endDate, subscriptionPeriod, selectedMonth, selectedYear]);

//   // Process data from Redux store
//   useEffect(() => {
//     if (subscriptionPeriod === "weekly" && weeklySubscription) {
//       // Process weekly subscription data
//       const dailyData = weeklySubscription.weekDaysSubscriptionRevenue || {};
//       const processedData = Object.entries(dailyData).map(([date, revenue]) => {
//         const dateParts = date.split("-");
//         const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
//         const dateObj = new Date(formattedDate);

//         return {
//           date: format(dateObj, "MMM dd"),
//           originalDate: date,
//           revenue: revenue || 0,
//           subscriptions: 0, // Count could be calculated if available in API response
//         };
//       }).sort((a, b) => new Date(a.originalDate) - new Date(b.originalDate));

//       const totalAmount = weeklySubscription.totalWeeklySubscriptionRevenue ||
//         processedData.reduce((sum, day) => sum + day.revenue, 0);

//       setSubscriptionData({
//         data: processedData,
//         totalAmount: totalAmount,
//       });
//     } else if (subscriptionPeriod === "monthly" && monthlySubscription) {
//       // Process monthly subscription data
//       const dailyData = monthlySubscription.monthDaysSubscriptionRevenue || {};
//       const processedData = Object.entries(dailyData).map(([date, revenue]) => {
//         const dateParts = date.split("-");
//         const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
//         const dateObj = new Date(formattedDate);

//         return {
//           date: format(dateObj, "MMM dd"),
//           originalDate: date,
//           revenue: revenue || 0,
//           subscriptions: 0, // Count could be calculated if available in API response
//         };
//       }).sort((a, b) => new Date(a.originalDate) - new Date(b.originalDate));

//       const totalAmount = monthlySubscription.totalMonthlySubscriptionRevenue ||
//         processedData.reduce((sum, day) => sum + day.revenue, 0);

//       setSubscriptionData({
//         data: processedData,
//         totalAmount: totalAmount,
//       });
//     }
//     else if (subscriptionPeriod === "yearly" && yearlySubscription) {
//       // Process yearly subscription data
//       const monthlyData = yearlySubscription.yearlySubscriptionRevenue?.monthlySubscriptionRevenue || [];
//       const processedData = monthlyData.map((monthData) => {
//         return {
//           date: monthData.month,
//           originalDate: `${selectedYear}-${monthNames.indexOf(monthData.month) + 1}`,
//           revenue: monthData.revenue || 0,
//           subscriptions: 0, // Count could be calculated if available in API response
//         };
//       });
  
//       const totalAmount = yearlySubscription.yearlySubscriptionRevenue?.totalYearlySubscriptionRevenue ||
//         processedData.reduce((sum, month) => sum + month.revenue, 0);
  
//       setSubscriptionData({
//         data: processedData,
//         totalAmount: totalAmount,
//       });
//     }
//   }, [weeklySubscription, monthlySubscription, yearlySubscription, subscriptionPeriod]);

//   // Prepare chart data for Chart.js
//   const prepareLineChartData = () => {
//     return {
//       labels: subscriptionData.data.map((item) => item.date),
//       datasets: [
//         {
//           label: "Revenue (Rs)",
//           data: subscriptionData.data.map((item) => item.revenue),
//           borderColor: COLORS[0],
//           backgroundColor: `${COLORS[0]}33`,
//           tension: 0.1,
//           fill: false,
//         }
//       ],
//     };
//   };

//   const prepareBarChartData = () => {
//     return {
//       labels: subscriptionData.data.map((item) => item.date),
//       datasets: [
//         {
//           label: "Revenue (Rs)",
//           data: subscriptionData.data.map((item) => item.revenue),
//           backgroundColor: COLORS[0],
//         }
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
//           subscriptionPeriod.charAt(0).toUpperCase() + subscriptionPeriod.slice(1)
//         } Subscription Trend`,
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
//           subscriptionPeriod.charAt(0).toUpperCase() + subscriptionPeriod.slice(1)
//         } Subscription Distribution`,
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
//           {subscriptionPeriod === "weekly" && (
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
  
//           {subscriptionPeriod === "monthly" && (
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
  
//           {subscriptionPeriod === "yearly" && (
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
  
//           {subscriptionPeriod === "weekly" && (
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

//   // Subscription Report Content
//   const renderSubscriptionReport = () => {
//     let chartTitle, summaryTitle;
    
//     switch (subscriptionPeriod) {
//       case "weekly":
//         chartTitle = "Weekly Subscription Trend";
//         summaryTitle = "Weekly Subscription";
//         break;
//       case "monthly":
//         chartTitle = `Monthly Subscription (${monthNames[selectedMonth]} ${selectedYear})`;
//         summaryTitle = "Monthly Subscription";
//         break;
//       case "yearly":
//         chartTitle = `Yearly Subscription (${selectedYear})`;
//         summaryTitle = "Yearly Subscription";
//         break;
//       default:
//         chartTitle = "Subscription Trend";
//         summaryTitle = "Subscription Summary";
//     }

//     return (
//       <div>
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//           <Typography variant="h5" className="mb-2 md:mb-0">
//             Subscription Report
//           </Typography>
//           <div className="flex flex-col md:flex-row gap-4">
//             <FormControl variant="outlined" sx={{ minWidth: 200 }}>
//               <InputLabel>Period</InputLabel>
//               <Select
//                 value={subscriptionPeriod}
//                 onChange={(e) => setSubscriptionPeriod(e.target.value)}
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
//                 Subscription Summary
//               </Typography>
//               <div className="mb-4">
//                 <Typography variant="subtitle1" color="textSecondary">
//                   Total {summaryTitle} Revenue
//                 </Typography>
//                 <Typography variant="h4" className="font-bold text-primary">
//                   Rs {subscriptionData.totalAmount.toLocaleString()}
//                 </Typography>
//               </div>

//               <Divider className="my-4" />

//               <Typography variant="subtitle1" className="mb-2">
//                 Top Revenue Days
//               </Typography>
//               {subscriptionData.data
//                 .sort((a, b) => b.revenue - a.revenue)
//                 .slice(0, 5)
//                 .map((day, index) => (
//                   <div key={index} className="flex justify-between mb-2">
//                     <Typography variant="body2">{day.date}</Typography>
//                     <Typography variant="body2" className="font-bold">
//                       Rs {day.revenue.toLocaleString()}
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
//       {isloading ? (
//         <div className="flex justify-center items-center py-16">
//           <CircularProgress />
//         </div>
//       ) : (
//         renderSubscriptionReport()
//       )}
//     </div>
//   );
// };

// export default SubscriptionTab;





import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWeeklySubscriptionReports, getMonthlySubscriptionReports, getYearlySubscriptionReports } from "../../../store/actions/analytics";
import { showToast } from "../../../tools";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  format,
  addDays,
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

// Theme matching AnalyticsAndTrends
const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
  },
});

// Color palette for charts
const COLORS = ["#603F26", "#82ca9d", "#FFBB28", "#FF8042"];

const SubscriptionTab = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { weeklySubscription, monthlySubscription, yearlySubscription, isloading } = useSelector((state) => state.analytics);

  // Period state
  const [subscriptionPeriod, setSubscriptionPeriod] = useState("weekly");
 
  // Date states for subscription report
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(format(addDays(new Date(), -6), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  
  // Month and year for monthly subscriptions
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Array of month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Processed subscription data state
  const [subscriptionData, setSubscriptionData] = useState({ data: [], totalAmount: 0 });

  // Update date ranges based on selected period
  useEffect(() => {
    updateDateRange();
  }, [subscriptionPeriod, selectedDate]);

  // Function to update date range based on selected period
  const updateDateRange = () => {
    let start, end;

    switch (subscriptionPeriod) {
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

  // Fetch subscription data from API
  const fetchSubscriptionData = async () => {
    try {
      if (subscriptionPeriod === "weekly") {
        await dispatch(getWeeklySubscriptionReports({ startDate, endDate }));
      } else if (subscriptionPeriod === "monthly") {
        const monthName = monthNames[selectedMonth];
        
        await dispatch(getMonthlySubscriptionReports({ 
          month: monthName, 
          year: selectedYear 
        }));
      } else if (subscriptionPeriod === "yearly") {
        const monthName = monthNames[selectedMonth];
        await dispatch(getYearlySubscriptionReports({ 
          month: monthName, 
          year: selectedYear 
        }));
      }
    } catch (error) {
      showToast("ERROR", error.message || "Failed to fetch subscription data");
    }
  };

  // Effect to fetch data when dates, period, month or year changes
  useEffect(() => {
    fetchSubscriptionData();
  }, [startDate, endDate, subscriptionPeriod, selectedMonth, selectedYear]);

  // Process data from Redux store
  useEffect(() => {
    if (subscriptionPeriod === "weekly" && weeklySubscription) {
      // Process weekly subscription data
      const dailyData = weeklySubscription.weekDaysSubscriptionRevenue || {};
      const processedData = Object.entries(dailyData).map(([date, revenue]) => {
        const dateParts = date.split("-");
        const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
        const dateObj = new Date(formattedDate);

        return {
          date: format(dateObj, "MMM dd"),
          originalDate: date,
          revenue: revenue || 0,
          subscriptions: 0, // Count could be calculated if available in API response
        };
      }).sort((a, b) => new Date(a.originalDate) - new Date(b.originalDate));

      const totalAmount = weeklySubscription.totalWeeklySubscriptionRevenue ||
        processedData.reduce((sum, day) => sum + day.revenue, 0);

      setSubscriptionData({
        data: processedData,
        totalAmount: totalAmount,
      });
    } else if (subscriptionPeriod === "monthly" && monthlySubscription) {
      // Process monthly subscription data
      const dailyData = monthlySubscription.monthDaysSubscriptionRevenue || {};
      const processedData = Object.entries(dailyData).map(([date, revenue]) => {
        const dateParts = date.split("-");
        const formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
        const dateObj = new Date(formattedDate);

        return {
          date: format(dateObj, "MMM dd"),
          originalDate: date,
          revenue: revenue || 0,
          subscriptions: 0, // Count could be calculated if available in API response
        };
      }).sort((a, b) => new Date(a.originalDate) - new Date(b.originalDate));

      const totalAmount = monthlySubscription.totalMonthlySubscriptionRevenue ||
        processedData.reduce((sum, day) => sum + day.revenue, 0);

      setSubscriptionData({
        data: processedData,
        totalAmount: totalAmount,
      });
    }
    else if (subscriptionPeriod === "yearly" && yearlySubscription) {
      // Process yearly subscription data
      const monthlyData = yearlySubscription.yearlySubscriptionRevenue?.monthlySubscriptionRevenue || [];
      const processedData = monthlyData.map((monthData) => {
        return {
          date: monthData.month,
          originalDate: `${selectedYear}-${monthNames.indexOf(monthData.month) + 1}`,
          revenue: monthData.revenue || 0,
          subscriptions: 0, // Count could be calculated if available in API response
        };
      });
  
      const totalAmount = yearlySubscription.yearlySubscriptionRevenue?.totalYearlySubscriptionRevenue ||
        processedData.reduce((sum, month) => sum + month.revenue, 0);
  
      setSubscriptionData({
        data: processedData,
        totalAmount: totalAmount,
      });
    }
  }, [weeklySubscription, monthlySubscription, yearlySubscription, subscriptionPeriod]);

  // Prepare chart data for Chart.js
  const prepareLineChartData = () => {
    return {
      labels: subscriptionData.data.map((item) => item.date),
      datasets: [
        {
          label: "Revenue ($)",
          data: subscriptionData.data.map((item) => item.revenue),
          borderColor: COLORS[0],
          backgroundColor: `${COLORS[0]}33`,
          tension: 0.1,
          fill: false,
        }
      ],
    };
  };

  const prepareBarChartData = () => {
    return {
      labels: subscriptionData.data.map((item) => item.date),
      datasets: [
        {
          label: "Revenue ($)",
          data: subscriptionData.data.map((item) => item.revenue),
          backgroundColor: COLORS[0],
        }
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
          subscriptionPeriod.charAt(0).toUpperCase() + subscriptionPeriod.slice(1)
        } Subscription Trend`,
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
          subscriptionPeriod.charAt(0).toUpperCase() + subscriptionPeriod.slice(1)
        } Subscription Distribution`,
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

  // Render date picker based on period
  const renderDatePicker = () => {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {subscriptionPeriod === "weekly" && (
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
  
          {subscriptionPeriod === "monthly" && (
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
  
          {subscriptionPeriod === "yearly" && (
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
  
          {subscriptionPeriod === "weekly" && (
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

  // Subscription Report Content
  const renderSubscriptionReport = () => {
    let chartTitle, summaryTitle;
    
    switch (subscriptionPeriod) {
      case "weekly":
        chartTitle = "Weekly Subscription Trend";
        summaryTitle = "Weekly Subscription";
        break;
      case "monthly":
        chartTitle = `Monthly Subscription (${monthNames[selectedMonth]} ${selectedYear})`;
        summaryTitle = "Monthly Subscription";
        break;
      case "yearly":
        chartTitle = `Yearly Subscription (${selectedYear})`;
        summaryTitle = "Yearly Subscription";
        break;
      default:
        chartTitle = "Subscription Trend";
        summaryTitle = "Subscription Summary";
    }

    return (
      <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ color: "#603F26", fontWeight: "bold" }}>
            Subscription Report
          </Typography>
        </Box>

        {/* Controls Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Period</InputLabel>
                <Select
                  value={subscriptionPeriod}
                  onChange={(e) => setSubscriptionPeriod(e.target.value)}
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
                Subscription Summary
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="textSecondary">
                  Total {summaryTitle} Revenue
                </Typography>
                <Typography variant="h4" sx={{ color: "#603F26", fontWeight: "bold" }}>
                  $ {subscriptionData.totalAmount.toLocaleString()}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" sx={{ mb: 2, color: "#603F26" }}>
                Top Revenue Days
              </Typography>
              {subscriptionData.data
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5)
                .map((day, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{day.date}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      $ {day.revenue.toLocaleString()}
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
                  options={{
                    ...barChartOptions,
                    plugins: {
                      ...barChartOptions.plugins,
                      title: {
                        ...barChartOptions.plugins.title,
                        text: `${chartTitle} Distribution`
                      }
                    }
                  }}
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
          renderSubscriptionReport()
        )}
      </div>
    </ThemeProvider>
  );
};

export default SubscriptionTab;