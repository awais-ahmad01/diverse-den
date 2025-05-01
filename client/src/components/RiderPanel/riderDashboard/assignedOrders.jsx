import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../tools";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Typography,
  Grid,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Box,
  TextField,
  Avatar,
  Badge,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { format } from "date-fns";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CallIcon from "@mui/icons-material/Call";

const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
  },
});

// Mock order data
const mockOrders = [
  {
    _id: "ORD123456",
    userInfo: {
      firstname: "Ali",
      lastname: "Ahmad",
      email: "ali.ahmad@example.com",
      phone: "03001234567",
      address: "123 Main Street, Block F, DHA Phase 1, Lahore",
      paymentMethod: "Cash on Delivery",
    },
    cartItems: [
      {
        quantity: 2,
        productId: {
          title: "Espresso Coffee",
          price: 350,
        },
      },
      {
        quantity: 1,
        productId: {
          title: "Chocolate Croissant",
          price: 220,
        },
      },
    ],
    status: "Pending",
    subTotal: 920,
    shippingCost: 150,
    totalAmount: 1070,
    cartItemCount: 3,
    createdAt: "2025-04-25T10:30:00.000Z",
    assignedTo: "Rider123",
    estimatedDeliveryTime: "30-45 minutes",
    deliveryInstructions: "Please call when at the gate",
  },
  {
    _id: "ORD789012",
    userInfo: {
      firstname: "Sara",
      lastname: "Khan",
      email: "sara.khan@example.com",
      phone: "03123456789",
      address: "45 Park Avenue, Gulberg III, Lahore",
      paymentMethod: "Cash on Delivery",
    },
    cartItems: [
      {
        quantity: 1,
        productId: {
          title: "Cappuccino",
          price: 400,
        },
      },
      {
        quantity: 2,
        productId: {
          title: "Blueberry Muffin",
          price: 180,
        },
      },
    ],
    status: "Out for Delivery",
    subTotal: 760,
    shippingCost: 150,
    totalAmount: 910,
    cartItemCount: 3,
    createdAt: "2025-04-26T09:15:00.000Z",
    assignedTo: "Rider123",
    estimatedDeliveryTime: "15-30 minutes",
    deliveryInstructions: "Apartment 3B, 2nd floor",
  },
  {
    _id: "ORD345678",
    userInfo: {
      firstname: "Mohammad",
      lastname: "Asif",
      email: "m.asif@example.com",
      phone: "03214567890",
      address: "789 Railway Road, Cantt, Karachi",
      paymentMethod: "Online Payment",
    },
    cartItems: [
      {
        quantity: 3,
        productId: {
          title: "Cold Brew Coffee",
          price: 450,
        },
      },
      {
        quantity: 1,
        productId: {
          title: "Almond Biscotti",
          price: 200,
        },
      },
    ],
    status: "Delivered",
    subTotal: 1550,
    shippingCost: 200,
    totalAmount: 1750,
    cartItemCount: 4,
    createdAt: "2025-04-24T14:45:00.000Z",
    assignedTo: "Rider123",
    estimatedDeliveryTime: "Delivered at 15:30",
    deliveryInstructions: "",
  },
  {
    _id: "ORD901234",
    userInfo: {
      firstname: "Ayesha",
      lastname: "Malik",
      email: "ayesha.m@example.com",
      phone: "03331234567",
      address: "56 Jinnah Road, Block B, Bahria Town, Islamabad",
      paymentMethod: "Cash on Delivery",
    },
    cartItems: [
      {
        quantity: 1,
        productId: {
          title: "Latte",
          price: 380,
        },
      },
      {
        quantity: 2,
        productId: {
          title: "Cheese Danish",
          price: 250,
        },
      },
    ],
    status: "Returned",
    subTotal: 880,
    shippingCost: 150,
    totalAmount: 1030,
    cartItemCount: 3,
    createdAt: "2025-04-23T11:20:00.000Z",
    assignedTo: "Rider123",
    estimatedDeliveryTime: "N/A",
    deliveryInstructions: "Call before delivery",
    returnReason: "Customer unavailable at location",
  },
];

const OrderDetailsDialog = ({ open, onClose, order }) => {
  if (!order) return null;

  const [status, setStatus] = useState(order.status);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setStatusUpdateLoading(true);
    setStatus(newStatus);
    
    // Simulate API call
    setTimeout(() => {
      setStatusUpdateLoading(false);
      showToast("SUCCESS", `Order status updated to ${newStatus}`);
      onClose(newStatus);
    }, 1000);
  };

  return (
    <Dialog open={open} onClose={() => onClose(null)} maxWidth="md" fullWidth>
      <DialogTitle className="bg-[#603F26] text-white flex items-center justify-between">
        <div>Order Details - #{order._id.slice(-6)}</div>
        <Chip 
          label={order.status} 
          color={
            order.status === "Delivered" ? "success" :
            order.status === "Returned" ? "error" :
            order.status === "Out for Delivery" ? "primary" : "warning"
          }
          sx={{ ml: 2 }}
        />
      </DialogTitle>
      <DialogContent className="mt-4">
        <Grid container spacing={3}>
          {/* Customer Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className="font-bold mb-2">
              Customer Information
            </Typography>
            <Typography>
              <strong>Name:</strong> {order.userInfo?.firstname} {order.userInfo?.lastname}
            </Typography>
            <Typography>
              <strong>Email:</strong> {order.userInfo?.email}
            </Typography>
            <Box display="flex" alignItems="center" mt={1}>
              <strong>Phone:</strong> 
              <Typography ml={1}>{order.userInfo?.phone}</Typography>
              <IconButton 
                size="small" 
                color="primary" 
                sx={{ ml: 1 }}
                onClick={() => window.open(`tel:${order.userInfo?.phone}`)}
              >
                <CallIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Delivery Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className="font-bold mb-2">
              Delivery Information
            </Typography>
            <Typography>
              <strong>Address:</strong> {order.userInfo?.address}
            </Typography>
            <Typography>
              <strong>Payment Method:</strong> {order.userInfo?.paymentMethod}
            </Typography>
            {order.estimatedDeliveryTime && (
              <Typography>
                <strong>Estimated Time:</strong> {order.estimatedDeliveryTime}
              </Typography>
            )}
            {order.deliveryInstructions && (
              <Typography>
                <strong>Instructions:</strong> {order.deliveryInstructions}
              </Typography>
            )}
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12}>
            <Divider className="my-4" />
            <Typography variant="h6" className="font-bold mb-2">
              Order Summary
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.cartItems?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item?.productId?.title}</TableCell>
                      <TableCell align="right">{item?.quantity}</TableCell>
                      <TableCell align="right">Rs {item?.productId?.price}</TableCell>
                      <TableCell align="right">
                        Rs {item?.quantity * item?.productId?.price}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right" className="font-bold">
                      Subtotal:
                    </TableCell>
                    <TableCell align="right">Rs {order?.subTotal}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right" className="font-bold">
                      Shipping:
                    </TableCell>
                    <TableCell align="right">Rs {order?.shippingCost}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right" className="font-bold">
                      Total:
                    </TableCell>
                    <TableCell align="right" className="font-bold">
                      Rs {order.totalAmount}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Status Update */}
          <Grid item xs={12}>
            <Divider className="my-4" />
            <Typography variant="h6" className="font-bold mb-2">
              Update Status
            </Typography>
            <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
              <Button
                variant="contained"
                color="success"
                disabled={status === "Delivered" || statusUpdateLoading}
                onClick={() => handleStatusChange("Delivered")}
                startIcon={<DeliveryDiningIcon />}
                fullWidth
              >
                Mark as Delivered
              </Button>
              <Button
                variant="contained"
                color="error"
                disabled={status === "Returned" || statusUpdateLoading}
                onClick={() => handleStatusChange("Returned")}
                startIcon={<LocalShippingIcon />}
                fullWidth
              >
                Mark as Returned
              </Button>
            </Box>
            {order.status === "Returned" && order.returnReason && (
              <Typography sx={{ mt: 2, color: "error.main" }}>
                <strong>Return Reason:</strong> {order.returnReason}
              </Typography>
            )}
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(null)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const RiderOrders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [viewOrderDetails, setViewOrderDetails] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);

  const handleViewDetails = (order) => {
    setViewOrderDetails(order);
  };

  const handleStatusUpdate = (newStatus) => {
    if (newStatus && viewOrderDetails) {
      // Update the order in the list
      const updatedOrders = orders.map(order => 
        order._id === viewOrderDetails._id 
          ? { ...order, status: newStatus } 
          : order
      );
      setOrders(updatedOrders);
      setFilteredOrders(
        updatedOrders.filter(order => 
          filterOrder(order, orderNumber, statusFilter)
        )
      );
      setViewOrderDetails(null);
    } else {
      setViewOrderDetails(null);
    }
  };

  const filterOrder = (order, orderNum, status) => {
    const matchesOrderNum = orderNum ? 
      order._id.toLowerCase().includes(orderNum.toLowerCase()) : true;
    
    const matchesStatus = status ? 
      order.status === status : true;
    
    return matchesOrderNum && matchesStatus;
  };

  const applyFilters = () => {
    const filtered = orders.filter(order => 
      filterOrder(order, orderNumber, statusFilter)
    );
    setFilteredOrders(filtered);
  };

  const clearFilters = () => {
    setOrderNumber("");
    setStatusFilter("");
    setFilteredOrders(orders);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Returned":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Out for Delivery":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <DeliveryDiningIcon sx={{ color: "green" }} />;
      case "Returned":
        return <LocalShippingIcon sx={{ color: "red" }} />;
      case "Pending":
        return <DirectionsBikeIcon sx={{ color: "orange" }} />;
      case "Out for Delivery":
        return <DirectionsBikeIcon sx={{ color: "blue" }} />;
      default:
        return <DirectionsBikeIcon />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5">
        {/* Header */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
          <Typography variant="h4" sx={{ color: "#603F26", fontWeight: "bold" }}>
            My Deliveries
          </Typography>
        </Box>

        {/* Stats & Filters */}
        <Box
          sx={{
            px: { xs: 2, md: 4, lg: 6 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2
          }}
        >
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Paper
              sx={{
                bgcolor: "#603F26",
                color: "white",
                px: 3,
                py: 2,
                borderRadius: 2,
              }}
            >
              <Typography variant="h4" component="div">
                {String(filteredOrders.filter(o => o.status === "Pending" || o.status === "Out for Delivery").length).padStart(2, "0")}
              </Typography>
              <Typography variant="body2">Pending Deliveries</Typography>
            </Paper>
            
            <Paper
              sx={{
                bgcolor: "#4CAF50",
                color: "white",
                px: 3,
                py: 2,
                borderRadius: 2,
              }}
            >
              <Typography variant="h4" component="div">
                {String(filteredOrders.filter(o => o.status === "Delivered").length).padStart(2, "0")}
              </Typography>
              <Typography variant="body2">Completed Today</Typography>
            </Paper>
          </Box>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </Box>

        {/* Filters */}
        {showFilters && (
          <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <TextField
                  label="Order Number"
                  placeholder="Search by order number"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  displayEmpty
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Returned">Returned</MenuItem>
                </Select>
                <Button variant="contained" color="primary" onClick={applyFilters}>
                  Apply Filters
                </Button>
                <Button variant="outlined" color="primary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Order List */}
        <div className="w-full px-4 md:px-8 lg:px-12 mt-4 flex-grow">
          {!filteredOrders || filteredOrders.length === 0 ? (
            <div className="text-3xl font-bold flex justify-center">
              No Orders found
            </div>
          ) : (
            <>
              {/* Desktop view */}
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden lg:block">
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="orders table">
                    <TableHead sx={{ backgroundColor: "#603F26" }}>
                      <TableRow>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Order ID</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Customer</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Address</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Total</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>#{order._id.slice(-6)}</TableCell>
                          <TableCell>
                            {order?.userInfo?.firstname} {order?.userInfo?.lastname}
                          </TableCell>
                          <TableCell>
                            {order?.userInfo?.address.length > 30
                              ? `${order?.userInfo?.address.slice(0, 30)}...`
                              : order?.userInfo?.address}
                          </TableCell>
                          <TableCell>{format(new Date(order?.createdAt), "PP")}</TableCell>
                          <TableCell>Rs {order?.totalAmount}</TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              {getStatusIcon(order.status)}
                              <Chip
                                label={order.status}
                                className={getStatusColor(order.status)}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="View Details">
                              <IconButton
                                onClick={() => handleViewDetails(order)}
                                color="primary"
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              {/* Mobile View */}
              <div className="block lg:hidden space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold">#{order._id.slice(-6)}</p>
                        <p>
                          {order?.userInfo?.firstname} {order?.userInfo?.lastname}
                        </p>
                      </div>
                      <Chip
                        icon={getStatusIcon(order.status)}
                        label={order.status}
                        className={getStatusColor(order.status)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Typography noWrap><strong>Address:</strong> {order?.userInfo?.address}</Typography>
                      <div className="flex justify-between">
                        <Typography><strong>Date:</strong> {format(new Date(order?.createdAt), "PP")}</Typography>
                        <Typography><strong>Rs:</strong> {order?.totalAmount}</Typography>
                      </div>
                    </div>

                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => handleViewDetails(order)}
                        fullWidth
                      >
                        View Details
                      </Button>
                    </Box>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Order Details Dialog */}
        <OrderDetailsDialog
          open={!!viewOrderDetails}
          onClose={handleStatusUpdate}
          order={viewOrderDetails}
        />

      </div>
    </ThemeProvider>
  );
};

export default RiderOrders;