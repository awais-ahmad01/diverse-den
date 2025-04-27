import React, { useState, useEffect } from "react";
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
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp,
  MonetizationOn,
  Timeline,
  ThumbUp,
  Comment,
  ShoppingCart,
  Star,
} from "@mui/icons-material";

// Mock data for charts and tables
const generateSalesMockData = (period, count) => {
  const data = [];
  let date = new Date();
  let totalAmount = 0;

  for (let i = 0; i < count; i++) {
    let dateStr;

    switch (period) {
      case "daily":
        date.setDate(date.getDate() - 1);
        dateStr = date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        break;
      case "monthly":
        date.setMonth(date.getMonth() - 1);
        dateStr = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        break;
      case "yearly":
        date.setFullYear(date.getFullYear() - 1);
        dateStr = date.getFullYear().toString();
        break;
      default:
        dateStr = "";
    }

    const amount = Math.floor(Math.random() * 5000) + 1000;
    totalAmount += amount;

    data.push({
      date: dateStr,
      sales: amount,
      orders: Math.floor(Math.random() * 50) + 10,
    });
  }

  return { data: data.reverse(), totalAmount };
};

const generateTrendingProducts = () => {
  const products = [
    { id: 1, name: "Premium T-Shirt", category: "Apparel", price: 29.99 },
    { id: 2, name: "Designer Jeans", category: "Apparel", price: 89.99 },
    {
      id: 3,
      name: "Wireless Headphones",
      category: "Electronics",
      price: 129.99,
    },
    { id: 4, name: "Smartwatch", category: "Electronics", price: 199.99 },
    { id: 5, name: "Running Shoes", category: "Footwear", price: 79.99 },
    { id: 6, name: "Coffee Maker", category: "Home", price: 149.99 },
    { id: 7, name: "Protein Powder", category: "Nutrition", price: 39.99 },
    { id: 8, name: "Yoga Mat", category: "Fitness", price: 24.99 },
  ];

  return products
    .map((product) => ({
      ...product,
      sales: Math.floor(Math.random() * 500) + 50,
      rank: Math.floor(Math.random() * 10) + 1,
      growth: Math.floor(Math.random() * 40) - 10,
    }))
    .sort((a, b) => b.sales - a.sales);
};

const generateProductImpressions = () => {
  const products = [
    { id: 1, name: "Premium T-Shirt", category: "Apparel" },
    { id: 2, name: "Designer Jeans", category: "Apparel" },
    { id: 3, name: "Wireless Headphones", category: "Electronics" },
    { id: 4, name: "Smartwatch", category: "Electronics" },
    { id: 5, name: "Running Shoes", category: "Footwear" },
    { id: 6, name: "Coffee Maker", category: "Home" },
    { id: 7, name: "Protein Powder", category: "Nutrition" },
    { id: 8, name: "Yoga Mat", category: "Fitness" },
  ];

  return products.map((product) => ({
    ...product,
    likes: Math.floor(Math.random() * 500) + 50,
    comments: Math.floor(Math.random() * 100) + 5,
    purchases: Math.floor(Math.random() * 200) + 20,
    views: Math.floor(Math.random() * 2000) + 500,
  }));
};

const generateEarningsMockData = (period, count) => {
  const data = [];
  let date = new Date();
  let totalEarnings = 0;

  for (let i = 0; i < count; i++) {
    let dateStr;

    switch (period) {
      case "weekly":
        date.setDate(date.getDate() - 7);
        dateStr = `Week ${Math.floor(i + 1)}`;
        break;
      case "monthly":
        date.setMonth(date.getMonth() - 1);
        dateStr = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        break;
      case "yearly":
        date.setFullYear(date.getFullYear() - 1);
        dateStr = date.getFullYear().toString();
        break;
      default:
        dateStr = "";
    }

    const revenue = Math.floor(Math.random() * 20000) + 5000;
    const expenses = Math.floor(Math.random() * 10000) + 2000;
    const earnings = revenue - expenses;
    totalEarnings += earnings;

    data.push({
      date: dateStr,
      revenue,
      expenses,
      earnings,
    });
  }

  return { data: data.reverse(), totalEarnings };
};

const generateSubscriptionData = (period, count) => {
  const data = [];
  let date = new Date();
  let totalRevenue = 0;

  for (let i = 0; i < count; i++) {
    let dateStr;

    switch (period) {
      case "daily":
        date.setDate(date.getDate() - 1);
        dateStr = date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        break;
      case "monthly":
        date.setMonth(date.getMonth() - 1);
        dateStr = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        break;
      case "yearly":
        date.setFullYear(date.getFullYear() - 1);
        dateStr = date.getFullYear().toString();
        break;
      default:
        dateStr = "";
    }

    const newSubs = Math.floor(Math.random() * 30) + 5;
    const renewals = Math.floor(Math.random() * 50) + 20;
    const cancellations = Math.floor(Math.random() * 10) + 2;
    const revenue = (newSubs + renewals) * 19.99;
    totalRevenue += revenue;

    data.push({
      date: dateStr,
      newSubscriptions: newSubs,
      renewals,
      cancellations,
      totalActive: newSubs + renewals - cancellations,
      revenue,
    });
  }

  return { data: data.reverse(), totalRevenue };
};

const generateBranchRatingData = () => {
  return [
    {
      branch: "Branch A",
      rating: 4.5,
      reviews: 125,
      positive: 105,
      neutral: 15,
      negative: 5,
    },
    {
      branch: "Branch B",
      rating: 4.8,
      reviews: 87,
      positive: 80,
      neutral: 5,
      negative: 2,
    },
    {
      branch: "Branch C",
      rating: 3.9,
      reviews: 64,
      positive: 40,
      neutral: 15,
      negative: 9,
    },
    {
      branch: "Branch D",
      rating: 4.2,
      reviews: 112,
      positive: 90,
      neutral: 10,
      negative: 12,
    },
    {
      branch: "Branch E",
      rating: 4.7,
      reviews: 156,
      positive: 135,
      neutral: 15,
      negative: 6,
    },
  ];
};

// Color palette for charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const AnalyticsAndTrends = () => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [tabValue, setTabValue] = useState(0);
  const [salesPeriod, setSalesPeriod] = useState("daily");
  const [trendingPeriod, setTrendingPeriod] = useState("weekly");
  const [earningsPeriod, setEarningsPeriod] = useState("monthly");
  const [subscriptionPeriod, setSubscriptionPeriod] = useState("monthly");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data states
  const [salesData, setSalesData] = useState({ data: [], totalAmount: 0 });
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [productImpressions, setProductImpressions] = useState([]);
  const [earningsData, setEarningsData] = useState({
    data: [],
    totalEarnings: 0,
  });
  const [subscriptionData, setSubscriptionData] = useState({
    data: [],
    totalRevenue: 0,
  });
  const [branchRatings, setBranchRatings] = useState([]);

  // Simulate API loading
  useEffect(() => {
    setTimeout(() => {
      setSalesData(
        generateSalesMockData(
          salesPeriod,
          salesPeriod === "daily" ? 14 : salesPeriod === "monthly" ? 12 : 5
        )
      );
      setTrendingProducts(generateTrendingProducts());
      setProductImpressions(generateProductImpressions());
      setEarningsData(
        generateEarningsMockData(
          earningsPeriod,
          earningsPeriod === "weekly"
            ? 8
            : earningsPeriod === "monthly"
            ? 12
            : 5
        )
      );
      setSubscriptionData(
        generateSubscriptionData(
          subscriptionPeriod,
          subscriptionPeriod === "daily"
            ? 14
            : subscriptionPeriod === "monthly"
            ? 12
            : 5
        )
      );
      setBranchRatings(generateBranchRatingData());
      setIsLoading(false);
    }, 1000);
  }, []);

  // Re-generate data when period changes
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setSalesData(
        generateSalesMockData(
          salesPeriod,
          salesPeriod === "daily" ? 14 : salesPeriod === "monthly" ? 12 : 5
        )
      );
      setIsLoading(false);
    }, 500);
  }, [salesPeriod]);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setEarningsData(
        generateEarningsMockData(
          earningsPeriod,
          earningsPeriod === "weekly"
            ? 8
            : earningsPeriod === "monthly"
            ? 12
            : 5
        )
      );
      setIsLoading(false);
    }, 500);
  }, [earningsPeriod]);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setSubscriptionData(
        generateSubscriptionData(
          subscriptionPeriod,
          subscriptionPeriod === "daily"
            ? 14
            : subscriptionPeriod === "monthly"
            ? 12
            : 5
        )
      );
      setIsLoading(false);
    }, 500);
  }, [subscriptionPeriod]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getChartHeight = () => {
    if (isMobile) return 200;
    if (isTablet) return 250;
    return 300;
  };

  // Responsive table variants
  const getTableSize = () => isMobile ? "small" : "medium";
  
  // Responsive padding
  const getContainerPadding = () => {
    if (isMobile) return "px-2 py-3";
    if (isTablet) return "px-4 py-4";
    return "px-6 py-5";
  };




  return (
    <div className={`container mx-auto ${getContainerPadding()}`}>
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        className="mb-4 font-bold text-center sm:text-left"
      >
        Analytics & Trends
      </Typography>
      
      <Paper className="mb-4">
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
              minWidth: isMobile ? 'auto' : 120,
              padding: isMobile ? '6px 10px' : '12px 16px',
              fontSize: isMobile ? '0.75rem' : '0.875rem',
            }
          }}
        >
          <Tab 
            label={isMobile ? "" : "Sales"} 
            icon={<Timeline />} 
            iconPosition={isMobile ? "top" : "start"} 
            aria-label="Sales"
          />
          <Tab 
            label={isMobile ? "" : "Products"} 
            icon={<TrendingUp />} 
            iconPosition={isMobile ? "top" : "start"} 
            aria-label="Products"
          />
          {/* <Tab 
            label={isMobile ? "" : "Impressions"} 
            icon={<ThumbUp />} 
            iconPosition={isMobile ? "top" : "start"} 
            aria-label="Impressions"
          /> */}
          <Tab 
            label={isMobile ? "" : "Earnings"} 
            icon={<MonetizationOn />} 
            iconPosition={isMobile ? "top" : "start"} 
            aria-label="Earnings"
          />
          <Tab 
            label={isMobile ? "" : "Subscriptions"} 
            icon={<ShoppingCart />} 
            iconPosition={isMobile ? "top" : "start"} 
            aria-label="Subscriptions"
          />
          {/* <Tab 
            label={isMobile ? "" : "Ratings"} 
            icon={<Star />} 
            iconPosition={isMobile ? "top" : "start"} 
            aria-label="Ratings"
          /> */}
        </Tabs>
      </Paper>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <CircularProgress />
        </div>
      ) : (
        <div>
          {/* Sales Report Tab */}
          {tabValue === 0 && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
                <Typography variant={isMobile ? "h6" : "h5"} className="mb-2 sm:mb-0">
                  Sales Report
                </Typography>
                <FormControl 
                  variant="outlined" 
                  size={isMobile ? "small" : "medium"} 
                  sx={{ 
                    minWidth: isMobile ? 100 : 120, 
                    width: isMobile ? '100%' : 'auto', 
                    maxWidth: 200 
                  }}
                >
                  <InputLabel>Period</InputLabel>
                  <Select
                    value={salesPeriod}
                    onChange={(e) => setSalesPeriod(e.target.value)}
                    label="Period"
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </div>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Paper className={isMobile ? "p-2" : "p-4"}>
                    <Typography variant="h6" className="mb-2 sm:mb-4">
                      {salesPeriod.charAt(0).toUpperCase() + salesPeriod.slice(1)} Sales Trend
                    </Typography>
                    <div style={{ width: '100%', height: getChartHeight() }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart 
                          data={salesData.data}
                          margin={{ 
                            top: 5, 
                            right: isMobile ? 5 : 20, 
                            left: isMobile ? 0 : 20, 
                            bottom: isMobile ? 5 : 5 
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: isMobile ? 10 : 12 }}
                            interval={isMobile ? 1 : 0}
                            angle={isMobile ? -45 : 0}
                            textAnchor={isMobile ? "end" : "middle"}
                            height={isMobile ? 60 : 30}
                          />
                          <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                          <RechartsTooltip />
                          <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                          <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 6 }} name="Sales ($)" />
                          <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper className="p-2 sm:p-4 h-full">
                    <Typography variant="h6" className="mb-2 sm:mb-4">Sales Summary</Typography>
                    <div className="mb-2 sm:mb-4">
                      <Typography variant="subtitle2" color="textSecondary">Total {salesPeriod} Sales</Typography>
                      <Typography variant="h5" className="font-bold text-primary">
                        ${salesData.totalAmount.toLocaleString()}
                      </Typography>
                    </div>
                    
                    <Divider className="my-2 sm:my-4" />
                    
                    <Typography variant="subtitle2" className="mb-1 sm:mb-2">Top Selling Days</Typography>
                    {salesData.data.slice(0, 5).map((day, index) => (
                      <div key={index} className="flex justify-between mb-1 sm:mb-2">
                        <Typography variant="body2" className="text-sm sm:text-base">{day.date}</Typography>
                        <Typography variant="body2" className="font-bold text-sm sm:text-base">${day.sales.toLocaleString()}</Typography>
                      </div>
                    ))}
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper className={isMobile ? "p-2" : "p-4"}>
                    <Typography variant="h6" className="mb-2 sm:mb-4">
                      {salesPeriod.charAt(0).toUpperCase() + salesPeriod.slice(1)} Sales Distribution
                    </Typography>
                    <div style={{ width: '100%', height: getChartHeight() }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={salesData.data}
                          margin={{ 
                            top: 5, 
                            right: isMobile ? 5 : 20, 
                            left: isMobile ? 0 : 20, 
                            bottom: isMobile ? 5 : 5 
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: isMobile ? 10 : 12 }}
                            interval={isMobile ? 1 : 0}
                            angle={isMobile ? -45 : 0}
                            textAnchor={isMobile ? "end" : "middle"}
                            height={isMobile ? 60 : 30}
                          />
                          <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                          <RechartsTooltip />
                          <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                          <Bar dataKey="sales" fill="#8884d8" name="Sales ($)" />
                          <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper className={isMobile ? "p-2" : "p-4"}>
                    <Typography variant="h6" className="mb-2 sm:mb-4">Detailed Sales Table</Typography>
                    <TableContainer className="overflow-x-auto">
                      <Table size={getTableSize()}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Orders</TableCell>
                            <TableCell align="right">Sales Amount</TableCell>
                            <TableCell align="right">Avg. Order Value</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {salesData.data.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">{row.date}</TableCell>
                              <TableCell align="right">{row.orders}</TableCell>
                              <TableCell align="right">${row.sales.toLocaleString()}</TableCell>
                              <TableCell align="right">${(row.sales / row.orders).toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            </div>
          )}
          
          {/* Trending Products Tab */}
          {tabValue === 1 && (
  <div>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
      <Typography variant={isMobile ? "h6" : "h5"} className="mb-2 sm:mb-0">
        Trending Products
      </Typography>
      <FormControl 
        variant="outlined" 
        size={isMobile ? "small" : "medium"} 
        sx={{ 
          minWidth: isMobile ? 100 : 120, 
          width: isMobile ? '100%' : 'auto', 
          maxWidth: 200 
        }}
      >
        <InputLabel>Period</InputLabel>
        <Select
          value={trendingPeriod}
          onChange={(e) => setTrendingPeriod(e.target.value)}
          label="Period"
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </Select>
      </FormControl>
    </div>
    
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Paper className={isMobile ? "p-2" : "p-4"}>
          <Typography variant="h6" className="mb-2 sm:mb-4">Top Selling Products</Typography>
          <div style={{ width: '100%', height: getChartHeight() }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trendingProducts.slice(0, 5)}
                layout="vertical"
                margin={{ 
                  top: 5, 
                  right: isMobile ? 5 : 20, 
                  left: isMobile ? 60 : 80, 
                  bottom: isMobile ? 5 : 5 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: isMobile ? 10 : 12 }} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={isMobile ? 60 : 80} 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <RechartsTooltip />
                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }}/>
                <Bar dataKey="sales" fill="#8884d8" name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Paper className={isMobile ? "p-2" : "p-4"}>
          <Typography variant="h6" className="mb-2 sm:mb-4">Category Distribution</Typography>
          <div style={{ width: '100%', height: getChartHeight() }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trendingProducts.reduce((acc, product) => {
                    const existingCategory = acc.find(item => item.name === product.category);
                    if (existingCategory) {
                      existingCategory.value += product.sales;
                    } else {
                      acc.push({ name: product.category, value: product.sales });
                    }
                    return acc;
                  }, [])}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={isMobile ? 60 : 80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => isMobile ? 
                    `${(percent * 100).toFixed(0)}%` : 
                    `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {trendingProducts.reduce((acc, product) => {
                    const existingCategory = acc.find(item => item.name === product.category);
                    if (!existingCategory) {
                      acc.push({ name: product.category });
                    }
                    return acc;
                  }, []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Paper>
      </Grid>
      
      <Grid item xs={12}>
        <Paper className={isMobile ? "p-2" : "p-4"}>
          <Typography variant="h6" className="mb-2 sm:mb-4">Trending Products Details</Typography>
          <TableContainer className="overflow-x-auto">
            <Table size={getTableSize()}>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Units Sold</TableCell>
                  <TableCell align="right">Growth</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trendingProducts.map((product, index) => (
                  <TableRow key={product.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                    <TableCell align="right">{product.sales}</TableCell>
                    <TableCell align="right" className={product.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {product.growth > 0 ? '+' : ''}{product.growth}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  </div>
)}



{/* Earnings Tab  */}
{tabValue === 2 && (
  <div>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
      <Typography variant={isMobile ? "h6" : "h5"} className="mb-2 sm:mb-0">
        Earnings Summary
      </Typography>
      <FormControl
        variant="outlined"
        size={isMobile ? "small" : "medium"}
        sx={{ 
          minWidth: isMobile ? 100 : 120, 
          width: isMobile ? '100%' : 'auto', 
          maxWidth: 200 
        }}
      >
        <InputLabel>Period</InputLabel>
        <Select
          value={earningsPeriod}
          onChange={(e) => setEarningsPeriod(e.target.value)}
          label="Period"
        >
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
        </Select>
      </FormControl>
    </div>

    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Paper className={isMobile ? "p-2" : "p-4"}>
          <Typography variant="h6" className="mb-2 sm:mb-4">
            {earningsPeriod.charAt(0).toUpperCase() + earningsPeriod.slice(1)} Earnings Trend
          </Typography>
          <div style={{ width: '100%', height: getChartHeight() }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={earningsData.data}
                margin={{ 
                  top: 5, 
                  right: isMobile ? 5 : 20, 
                  left: isMobile ? 0 : 20, 
                  bottom: isMobile ? 5 : 5 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  interval={isMobile ? 1 : 0}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? "end" : "middle"}
                  height={isMobile ? 60 : 30}
                />
                <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                <RechartsTooltip />
                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ff8042"
                  name="Expenses"
                />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#82ca9d"
                  name="Net Earnings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper className={isMobile ? "p-2" : "p-4"}>
          <Typography variant="h6" className="mb-2 sm:mb-4">
            Earnings Summary
          </Typography>
          <div className="mb-2 sm:mb-4">
            <Typography variant="subtitle2" color="textSecondary">
              Total {earningsPeriod} Earnings
            </Typography>
            <Typography variant="h5" className="font-bold text-primary">
              ${earningsData.totalEarnings.toLocaleString()}
            </Typography>
          </div>

          <Divider className="my-2 sm:my-4" />

          <Typography variant="subtitle2" className="mb-1 sm:mb-2">
            Top Earning Periods
          </Typography>
          {earningsData.data.slice(0, 3).map((period, index) => (
            <div key={index} className="flex justify-between mb-1 sm:mb-2">
              <Typography variant="body2" className="text-sm sm:text-base">
                {period.date}
              </Typography>
              <Typography variant="body2" className="font-bold text-sm sm:text-base">
                ${period.earnings.toLocaleString()}
              </Typography>
            </div>
          ))}
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper className={isMobile ? "p-2" : "p-4"}>
          <Typography variant="h6" className="mb-2 sm:mb-4">
            {earningsPeriod.charAt(0).toUpperCase() + earningsPeriod.slice(1)} Earnings Distribution
          </Typography>
          <div style={{ width: '100%', height: getChartHeight() }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={earningsData.data}
                margin={{ 
                  top: 5, 
                  right: isMobile ? 5 : 20, 
                  left: isMobile ? 0 : 20, 
                  bottom: isMobile ? 5 : 5 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  interval={isMobile ? 1 : 0}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? "end" : "middle"}
                  height={isMobile ? 60 : 30}
                />
                <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                <RechartsTooltip />
                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                <Bar dataKey="revenue" stackId="a" fill="#8884d8" name="Revenue" />
                <Bar dataKey="expenses" stackId="a" fill="#ff8042" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper className={isMobile ? "p-2" : "p-4"}>
          <Typography variant="h6" className="mb-2 sm:mb-4">
            Detailed Earnings Table
          </Typography>
          <TableContainer className="overflow-x-auto">
            <Table size={getTableSize()}>
              <TableHead>
                <TableRow>
                  <TableCell>Period</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="right">Expenses</TableCell>
                  <TableCell align="right">Net Earnings</TableCell>
                  <TableCell align="right">Profit Margin</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {earningsData.data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row.date}
                    </TableCell>
                    <TableCell align="right">
                      ${row.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      ${row.expenses.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      ${row.earnings.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      {((row.earnings / row.revenue) * 100).toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  </div>
)}




{tabValue === 3 && (
  <div>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
      <Typography variant={isMobile ? "h6" : "h5"} className="mb-2 sm:mb-0">
        Subscription Reports
      </Typography>
      <FormControl
        variant="outlined"
        size={isMobile ? "small" : "medium"}
        sx={{ 
          minWidth: isMobile ? 100 : 120, 
          width: isMobile ? '100%' : 'auto', 
          maxWidth: 200 
        }}
      >
        <InputLabel>Period</InputLabel>
        <Select
          value={subscriptionPeriod}
          onChange={(e) => setSubscriptionPeriod(e.target.value)}
          label="Period"
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
        </Select>
      </FormControl>
    </div>

    <Grid container spacing={2}>
      {/* Main subscription activity chart */}
      <Grid item xs={12} lg={8}>
        <Paper className={isMobile ? "p-2" : "p-4"}>
          <Typography variant="h6" className="mb-2 sm:mb-4">
            {subscriptionPeriod.charAt(0).toUpperCase() + subscriptionPeriod.slice(1)} Subscription Activity
          </Typography>
          <div className="w-full overflow-x-auto">
            <div style={{ 
              minWidth: isMobile ? '500px' : '100%', 
              height: getChartHeight() 
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={subscriptionData.data}
                  margin={{ 
                    top: 5, 
                    right: 30, 
                    left: 20, 
                    bottom: isMobile ? 60 : 30 
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    height={isMobile ? 70 : 30}
                    angle={isMobile ? -45 : 0}
                    textAnchor={isMobile ? "end" : "middle"}
                    interval={isMobile ? (subscriptionData.data.length > 10 ? 1 : 0) : 0}
                  />
                  <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <RechartsTooltip />
                  <Legend 
                    wrapperStyle={{ 
                      fontSize: isMobile ? 10 : 12,
                      paddingTop: 10 
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="newSubscriptions"
                    stroke="#8884d8"
                    name="New Subscriptions"
                    strokeWidth={isMobile ? 1.5 : 2}
                    dot={{ r: isMobile ? 2 : 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="renewals"
                    stroke="#82ca9d"
                    name="Renewals"
                    strokeWidth={isMobile ? 1.5 : 2}
                    dot={{ r: isMobile ? 2 : 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cancellations"
                    stroke="#ff8042"
                    name="Cancellations"
                    strokeWidth={isMobile ? 1.5 : 2}
                    dot={{ r: isMobile ? 2 : 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Paper>
      </Grid>

      {/* Subscription summary card */}
      <Grid item xs={12} lg={4}>
        <Paper className={isMobile ? "p-2" : "p-4"} style={{ height: '100%' }}>
          <Typography variant="h6" className="mb-2 sm:mb-4">
            Subscription Summary
          </Typography>
          <div className="mb-4">
            <Typography variant="subtitle2" color="textSecondary">
              Total {subscriptionPeriod} Revenue
            </Typography>
            <Typography variant="h5" className="font-bold text-primary">
              ${subscriptionData.totalRevenue.toLocaleString()}
            </Typography>
          </div>

          <Divider className="my-4" />

          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="flex flex-col">
              <Typography variant="body2" color="textSecondary" className="text-sm">
                New Subscriptions
              </Typography>
              <Typography variant="body1" className="font-bold">
                {subscriptionData.data.reduce(
                  (sum, item) => sum + item.newSubscriptions,
                  0
                )}
              </Typography>
            </div>
            <div className="flex flex-col">
              <Typography variant="body2" color="textSecondary" className="text-sm">
                Renewals
              </Typography>
              <Typography variant="body1" className="font-bold">
                {subscriptionData.data.reduce(
                  (sum, item) => sum + item.renewals,
                  0
                )}
              </Typography>
            </div>
            <div className="flex flex-col">
              <Typography variant="body2" color="textSecondary" className="text-sm">
                Cancellations
              </Typography>
              <Typography variant="body1" className="font-bold">
                {subscriptionData.data.reduce(
                  (sum, item) => sum + item.cancellations,
                  0
                )}
              </Typography>
            </div>
            <div className="flex flex-col">
              <Typography variant="body2" color="textSecondary" className="text-sm">
                Net Growth
              </Typography>
              <Typography variant="body1" className="font-bold">
                {subscriptionData.data.reduce(
                  (sum, item) => sum + item.newSubscriptions + item.renewals - item.cancellations,
                  0
                )}
              </Typography>
            </div>
          </div>
        </Paper>
      </Grid>

      {/* Active subscribers chart */}
      <Grid item xs={12} md={6}>
        <Paper className={isMobile ? "p-2" : "p-4"}>
          <Typography variant="h6" className="mb-2 sm:mb-4">
            Active Subscribers
          </Typography>
          <div className="w-full overflow-x-auto">
            <div style={{ 
              minWidth: isMobile ? '500px' : '100%', 
              height: getChartHeight() 
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={subscriptionData.data}
                  margin={{ 
                    top: 5, 
                    right: 30, 
                    left: 20, 
                    bottom: isMobile ? 60 : 30 
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    height={isMobile ? 70 : 30}
                    angle={isMobile ? -45 : 0}
                    textAnchor={isMobile ? "end" : "middle"}
                    interval={isMobile ? (subscriptionData.data.length > 10 ? 1 : 0) : 0}
                  />
                  <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <RechartsTooltip />
                  <Legend 
                    wrapperStyle={{ 
                      fontSize: isMobile ? 10 : 12,
                      paddingTop: 10 
                    }}
                  />
                  <Bar 
                    dataKey="totalActive" 
                    fill="#8884d8" 
                    name="Active Subscribers"
                    barSize={isMobile ? 15 : 30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Paper>
      </Grid>

      {/* Subscription revenue chart */}
      <Grid item xs={12} md={6}>
        <Paper className={isMobile ? "p-2" : "p-4"}>
          <Typography variant="h6" className="mb-2 sm:mb-4">
            Subscription Revenue
          </Typography>
          <div className="w-full overflow-x-auto">
            <div style={{ 
              minWidth: isMobile ? '500px' : '100%', 
              height: getChartHeight() 
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={subscriptionData.data}
                  margin={{ 
                    top: 5, 
                    right: 30, 
                    left: 20, 
                    bottom: isMobile ? 60 : 30 
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    height={isMobile ? 70 : 30}
                    angle={isMobile ? -45 : 0}
                    textAnchor={isMobile ? "end" : "middle"}
                    interval={isMobile ? (subscriptionData.data.length > 10 ? 1 : 0) : 0}
                  />
                  <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <RechartsTooltip />
                  <Legend 
                    wrapperStyle={{ 
                      fontSize: isMobile ? 10 : 12,
                      paddingTop: 10 
                    }}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="#82ca9d" 
                    name="Revenue ($)"
                    barSize={isMobile ? 15 : 30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Paper>
      </Grid>

      {/* Detailed subscription table */}
      <Grid item xs={12}>
        <Paper className={isMobile ? "p-2" : "p-4"}>
          <Typography variant="h6" className="mb-2 sm:mb-4">
            Subscription Details
          </Typography>
          <div className="w-full overflow-x-auto">
            <Table 
              size={getTableSize()} 
              sx={{ 
                minWidth: 650,
                "& .MuiTableCell-root": {
                  whiteSpace: "nowrap",
                  padding: isMobile ? "6px 8px" : "16px"
                }
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Period</TableCell>
                  <TableCell align="right">New</TableCell>
                  <TableCell align="right">Renewals</TableCell>
                  <TableCell align="right">Cancellations</TableCell>
                  <TableCell align="right">Net Change</TableCell>
                  <TableCell align="right">Total Active</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="right">ARPU</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subscriptionData.data.map((row, index) => (
                  <TableRow key={index} hover>
                    <TableCell component="th" scope="row">
                      {row.date}
                    </TableCell>
                    <TableCell align="right">
                      <span className="text-blue-600 font-medium">{row.newSubscriptions}</span>
                    </TableCell>
                    <TableCell align="right">
                      <span className="text-green-600 font-medium">{row.renewals}</span>
                    </TableCell>
                    <TableCell align="right">
                      <span className="text-red-600 font-medium">-{row.cancellations}</span>
                    </TableCell>
                    <TableCell align="right">
                      <span className={`font-medium ${row.newSubscriptions + row.renewals - row.cancellations >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {row.newSubscriptions + row.renewals - row.cancellations > 0 ? '+' : ''}
                        {row.newSubscriptions + row.renewals - row.cancellations}
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      {row.totalActive}
                    </TableCell>
                    <TableCell align="right">
                      ${row.revenue.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      ${(row.revenue / (row.newSubscriptions + row.renewals)).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Paper>
      </Grid>
    </Grid>
  </div>
)}

         
        </div>
      )}
    </div>
  );
};


export default AnalyticsAndTrends;











// {/* Product Impressions Tab (Tab 3) */}
// {tabValue === 2 && (
//   <div>
//     <Typography variant={isMobile ? "h6" : "h5"} className="mb-4">
//       Product Impressions
//     </Typography>
    
//     <Grid container spacing={2}>
//       <Grid item xs={12} md={6}>
//         <Paper className={isMobile ? "p-2" : "p-4"}>
//           <Typography variant="h6" className="mb-2 sm:mb-4">Likes & Comments</Typography>
//           <div style={{ width: '100%', height: getChartHeight() }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart 
//                 data={productImpressions.slice(0, 5)}
//                 margin={{ 
//                   top: 5, 
//                   right: isMobile ? 5 : 20, 
//                   left: isMobile ? 0 : 20, 
//                   bottom: isMobile ? 5 : 5 
//                 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis 
//                   dataKey="name" 
//                   tick={{ fontSize: isMobile ? 10 : 12 }}
//                   interval={isMobile ? 1 : 0}
//                   angle={isMobile ? -45 : 0}
//                   textAnchor={isMobile ? "end" : "middle"}
//                   height={isMobile ? 60 : 30}
//                 />
//                 <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
//                 <RechartsTooltip />
//                 <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
//                 <Bar dataKey="likes" fill="#8884d8" name="Likes" />
//                 <Bar dataKey="comments" fill="#82ca9d" name="Comments" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </Paper>
//       </Grid>
      
//       <Grid item xs={12} md={6}>
//         <Paper className={isMobile ? "p-2" : "p-4"}>
//           <Typography variant="h6" className="mb-2 sm:mb-4">Purchases vs Views</Typography>
//           <div style={{ width: '100%', height: getChartHeight() }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart 
//                 data={productImpressions.slice(0, 5)}
//                 margin={{ 
//                   top: 5, 
//                   right: isMobile ? 5 : 20, 
//                   left: isMobile ? 0 : 20, 
//                   bottom: isMobile ? 5 : 5 
//                 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis 
//                   dataKey="name" 
//                   tick={{ fontSize: isMobile ? 10 : 12 }}
//                   interval={isMobile ? 1 : 0}
//                   angle={isMobile ? -45 : 0}
//                   textAnchor={isMobile ? "end" : "middle"}
//                   height={isMobile ? 60 : 30}
//                 />
//                 <YAxis yAxisId="left" orientation="left" tick={{ fontSize: isMobile ? 10 : 12 }} />
//                 <YAxis yAxisId="right" orientation="right" tick={{ fontSize: isMobile ? 10 : 12 }} />
//                 <RechartsTooltip />
//                 <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
//                 <Bar yAxisId="left" dataKey="purchases" fill="#8884d8" name="Purchases" />
//                 <Bar yAxisId="right" dataKey="views" fill="#82ca9d" name="Views" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </Paper>
//       </Grid>
      
//       <Grid item xs={12}>
//         <Paper className={isMobile ? "p-2" : "p-4"}>
//           <Typography variant="h6" className="mb-2 sm:mb-4">Product Engagement</Typography>
//           <TableContainer className="overflow-x-auto">
//             <Table size={getTableSize()}>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Product</TableCell>
//                   <TableCell>Category</TableCell>
//                   <TableCell align="right">Views</TableCell>
//                   <TableCell align="right">Likes</TableCell>
//                   <TableCell align="right">Comments</TableCell>
//                   <TableCell align="right">Purchases</TableCell>
//                   <TableCell align="right">Conversion Rate</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {productImpressions.map((product) => (
//                   <TableRow key={product.id}>
//                     <TableCell>{product.name}</TableCell>
//                     <TableCell>{product.category}</TableCell>
//                     <TableCell align="right">{product.views}</TableCell>
//                     <TableCell align="right">{product.likes}</TableCell>
//                     <TableCell align="right">{product.comments}</TableCell>
//                     <TableCell align="right">{product.purchases}</TableCell>
//                     <TableCell align="right">
//                       {((product.purchases / product.views) * 100).toFixed(2)}%
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Paper>
//       </Grid>
//     </Grid>
//   </div>
// )}




//  {/* Branch Ratings Tab */}
//  {tabValue === 5 && (
//   <div>
//     <Typography variant="h5" className="mb-4 sm:mb-6 px-2 sm:px-0">
//       Branch Ratings
//     </Typography>

//     <Grid container spacing={2}>
//       <Grid item xs={12} md={6}>
//         <Paper className="p-2 sm:p-4">
//           <Typography variant="h6" className="mb-2 sm:mb-4">
//             Branch Rating Overview
//           </Typography>
//           <div
//             style={{
//               width: "100%",
//               height: "250px",
//               maxHeight: "300px",
//             }}
//           >
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={branchRatings}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="branch" />
//                 <YAxis domain={[0, 5]} />
//                 <RechartsTooltip />
//                 <Legend />
//                 <Bar
//                   dataKey="rating"
//                   fill="#8884d8"
//                   name="Rating (out of 5)"
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </Paper>
//       </Grid>

//       <Grid item xs={12} md={6}>
//         <Paper className="p-2 sm:p-4">
//           <Typography variant="h6" className="mb-2 sm:mb-4">
//             Review Distribution
//           </Typography>
//           <div
//             style={{
//               width: "100%",
//               height: "250px",
//               maxHeight: "300px",
//             }}
//           >
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={branchRatings}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="branch" />
//                 <YAxis />
//                 <RechartsTooltip />
//                 <Legend />
//                 <Bar
//                   dataKey="positive"
//                   stackId="a"
//                   fill="#82ca9d"
//                   name="Positive"
//                 />
//                 <Bar
//                   dataKey="neutral"
//                   stackId="a"
//                   fill="#ffbb28"
//                   name="Neutral"
//                 />
//                 <Bar
//                   dataKey="negative"
//                   stackId="a"
//                   fill="#ff8042"
//                   name="Negative"
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </Paper>
//       </Grid>

//       <Grid item xs={12}>
//         <Paper className="p-2 sm:p-4 overflow-x-auto">
//           <Typography variant="h6" className="mb-2 sm:mb-4">
//             Branch Rating Details
//           </Typography>
//           <TableContainer>
//             <Table size="small">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Branch</TableCell>
//                   <TableCell align="right">Rating</TableCell>
//                   <TableCell align="center">Rating Visual</TableCell>
//                   <TableCell align="right">Total Reviews</TableCell>
//                   <TableCell align="right">Positive</TableCell>
//                   <TableCell align="right">Neutral</TableCell>
//                   <TableCell align="right">Negative</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {branchRatings.map((branch) => (
//                   <TableRow key={branch.branch}>
//                     <TableCell component="th" scope="row">
//                       {branch.branch}
//                     </TableCell>
//                     <TableCell align="right">
//                       {branch.rating.toFixed(1)}
//                     </TableCell>
//                     <TableCell align="center">
//                       <Rating
//                         value={branch.rating}
//                         precision={0.1}
//                         readOnly
//                         size="small"
//                       />
//                     </TableCell>
//                     <TableCell align="right">
//                       {branch.reviews}
//                     </TableCell>
//                     <TableCell
//                       align="right"
//                       className="text-green-600"
//                     >
//                       {branch.positive} (
//                       {(
//                         (branch.positive / branch.reviews) *
//                         100
//                       ).toFixed(1)}
//                       %)
//                     </TableCell>
//                     <TableCell
//                       align="right"
//                       className="text-yellow-600"
//                     >
//                       {branch.neutral} (
//                       {(
//                         (branch.neutral / branch.reviews) *
//                         100
//                       ).toFixed(1)}
//                       %)
//                     </TableCell>
//                     <TableCell align="right" className="text-red-600">
//                       {branch.negative} (
//                       {(
//                         (branch.negative / branch.reviews) *
//                         100
//                       ).toFixed(1)}
//                       %)
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Paper>
//       </Grid>

//       <Grid item xs={12}>
//         <Paper className="p-2 sm:p-4">
//           <Typography variant="h6" className="mb-2 sm:mb-4">
//             Branch Performance Summary
//           </Typography>
//           <Grid container spacing={2}>
//             {branchRatings.map((branch) => (
//               <Grid
//                 item
//                 xs={12}
//                 sm={6}
//                 md={4}
//                 lg={3}
//                 key={branch.branch}
//               >
//                 <Card elevation={2}>
//                   <CardHeader
//                     title={branch.branch}
//                     subheader={`${branch.reviews} reviews`}
//                     titleTypographyProps={{ variant: "subtitle1" }}
//                     subheaderTypographyProps={{ variant: "body2" }}
//                   />
//                   <CardContent className="p-2 sm:p-4">
//                     <div className="flex items-center justify-between mb-1 sm:mb-2">
//                       <Typography
//                         variant="body2"
//                         className="text-sm sm:text-base"
//                       >
//                         Rating:
//                       </Typography>
//                       <div className="flex items-center">
//                         <Typography
//                           variant="body2"
//                           className="font-bold mr-1 text-sm sm:text-base"
//                         >
//                           {branch.rating.toFixed(1)}
//                         </Typography>
//                         <Rating
//                           value={branch.rating}
//                           precision={0.1}
//                           size="small"
//                           readOnly
//                         />
//                       </div>
//                     </div>

//                     <Divider className="my-1 sm:my-2" />

//                     <Typography
//                       variant="body2"
//                       className="mb-1 text-sm sm:text-base"
//                     >
//                       Review Distribution:
//                     </Typography>
//                     <div className="flex items-center justify-between mb-1">
//                       <Typography
//                         variant="body2"
//                         className="text-green-600 text-xs sm:text-sm"
//                       >
//                         Positive:
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         className="text-green-600 font-bold text-xs sm:text-sm"
//                       >
//                         {(
//                           (branch.positive / branch.reviews) *
//                           100
//                         ).toFixed(1)}
//                         %
//                       </Typography>
//                     </div>
//                     <div className="flex items-center justify-between mb-1">
//                       <Typography
//                         variant="body2"
//                         className="text-yellow-600 text-xs sm:text-sm"
//                       >
//                         Neutral:
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         className="text-yellow-600 font-bold text-xs sm:text-sm"
//                       >
//                         {(
//                           (branch.neutral / branch.reviews) *
//                           100
//                         ).toFixed(1)}
//                         %
//                       </Typography>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <Typography
//                         variant="body2"
//                         className="text-red-600 text-xs sm:text-sm"
//                       >
//                         Negative:
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         className="text-red-600 font-bold text-xs sm:text-sm"
//                       >
//                         {(
//                           (branch.negative / branch.reviews) *
//                           100
//                         ).toFixed(1)}
//                         %
//                       </Typography>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Paper>
//       </Grid>
//     </Grid>
//   </div>
// )}