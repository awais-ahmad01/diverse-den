

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../../tools";
import { Link } from "react-router-dom";
import {
  listOrders,
  updateOrderStatus,
  deleteOrder
} from "../../../../store/actions/orders";
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
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Loader } from "../../../../tools";
import { format } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
    
  },
});

const OrderDetailsDialog = ({ open, onClose, order }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-[#603F26] text-white">
        Order Details - #{order._id}
      </DialogTitle>
      <DialogContent className="mt-4">
        <Grid container spacing={3}>
         
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className="font-bold mb-2">
              Customer Information
            </Typography>
            <Typography>
              Name: {order.userInfo?.firstname} {order.userInfo?.lastname}
            </Typography>
            <Typography>Email: {order.userInfo?.email}</Typography>
            <Typography>Phone: {order.userInfo?.phone}</Typography>
          </Grid>

      
          <Grid item xs={12} md={6}>
            <Typography>{order.userInfo?.address}</Typography>
          </Grid>

       
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

          <Grid item xs={12} md={6}>
            <Typography variant="h6" className="font-bold mb-2">
              Payment Information
            </Typography>
            <Typography>Method: {order.userInfo?.paymentMethod}</Typography>
            {/* <Typography>Status: {order?.status}</Typography> */}
            {/* <Typography>Transaction ID: {order.transactionId}</Typography> */}
          </Grid>

       
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className="font-bold mb-2">
              Order Status
            </Typography>
            <Typography>
              Current Status:
              <Chip
                label={order.status}
                color={
                  order.status === "Delivered"
                    ? "success"
                    : order.status === "Cancelled"
                    ? "error"
                    : "primary"
                }
                className="ml-2"
              />
            </Typography>
            <Typography>
              Order Date: {format(new Date(order.createdAt), "PPP")}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  orderNumber,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="text-red-600">Delete Order</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete order #{orderNumber}? This action
          cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ListOrders = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const business = user?.business;
  const { orders, isloading, meta } = useSelector((state) => state.orders);

  console.log("orders:", orders);

  const [viewOrderDetails, setViewOrderDetails] = useState(null);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  const totalOrders = meta?.totalOrders || 0;

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }))
        .unwrap()
        .then((response) => {
          
          const business = user?.business;
          dispatch(listOrders({ business }));
          showToast("SUCCESS", "Status Updated Successfully!!");
        })
        .catch((error) => {
          showToast("ERROR", "Failed! to update status");
          // throw error;
        });
  };


    const handleNextPage = (page) => {
      const business = user?.business;
      if (business && page) {
        dispatch(listOrders({ business, pageNo: page }));
       
      }
    };
  
    const handlePrevPage = (page) => {
      const business = user?.business;
      if (business && page) {
        dispatch(listOrders({ business, pageNo: page }));
       
      }
    };
  

  const handleViewDetails = (order) => {
    setViewOrderDetails(order);
  };

  const handleDeleteClick = (orderId) => {
    setDeleteOrderId(orderId);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteOrder({deleteOrderId, business}))
      .unwrap()
        .then((response) => {
          
          showToast("SUCCESS", "Order deleted Successfully!!");
        })
        .catch((error) => {
          showToast("ERROR", "Failed! to delete order");
          // throw error;
        });

     
    } catch (error) {
      console.error("Failed to delete order:", error);
    } finally {
      setDeleteOrderId(null);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    if (orderNumber.trim() !== "") {
     
      filtered = filtered.filter((order) => {
        const shortOrderId = order._id.slice(-6);
        return shortOrderId.includes(orderNumber.trim());
      });
    }

    if (customerName.trim() !== "") {
     
      filtered = filtered.filter((order) => {
        const fullName = `${order?.userInfo?.firstname || ""} ${order?.userInfo?.lastname || ""}`.toLowerCase();
        return fullName.includes(customerName.trim().toLowerCase());
      });
    }

    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    if (orders) {
      setFilteredOrders(orders);
    }
  }, [orders]);

  useEffect(() => {
    const business = user?.business;
    dispatch(listOrders({ business }));
    
  }, [dispatch, user]);

  if (isloading) {
    return <Loader />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5">
       
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
          <Typography
            variant="h4"
            sx={{ color: "#603F26", fontWeight: "bold" }}
          >
            Orders
          </Typography>
        </Box>

        <Box
          sx={{
            px: { xs: 2, md: 4, lg: 6 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box >
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
                {String(totalOrders).padStart(2, "0")}
              </Typography>
              <Typography variant="body2">Total Orders</Typography>
            </Paper>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ReceiptLongIcon />}
              component={Link}
              to="../OrdersPaymentHistory"
            >
              Payment History
            </Button>

            <Button
              variant="outlined"
              color="primary"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </Box>
        </Box>
       

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
                <TextField
                  label="Customer Name"
                  placeholder="Search by customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  displayEmpty
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={applyFilters}
                >
                  Apply Filters
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setOrderNumber("");
                    setCustomerName("");
                    setStatusFilter("");
                    setFilteredOrders(orders);
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            </Paper>
          </Box>
        )}

        <div className="w-full px-4 md:px-8 lg:px-12 mt-4 flex-grow">
          {!filteredOrders || filteredOrders.length === 0 ? (
            <div className="text-3xl font-bold flex justify-center">
              No Orders found
            </div>
          ) : (
            <>
            
            {/* Desktop view */}
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden xl:block">
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="orders table">
                    <TableHead sx={{ backgroundColor: "#603F26" }}>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Order ID
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Customer
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Date
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Items
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Total
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>#{order._id.slice(-6)}</TableCell>
                          <TableCell>
                            {order?.userInfo?.firstname}{" "}
                            {order?.userInfo?.lastname}
                          </TableCell>
                          <TableCell>
                            {format(new Date(order?.createdAt), "PP")}
                          </TableCell>
                          <TableCell>{order?.cartItemCount}</TableCell>
                          <TableCell>Rs {order?.totalAmount}</TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order._id, e.target.value)
                              }
                              className={getStatusColor(order.status)}
                            >
                              <MenuItem value="Pending">Pending</MenuItem>
                              <MenuItem value="Processing">Processing</MenuItem>
                              <MenuItem value="Shipped">Shipped</MenuItem>
                              <MenuItem value="Delivered">Delivered</MenuItem>
                              <MenuItem value="Cancelled">Cancelled</MenuItem>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Tooltip title="View Details">
                                <IconButton
                                  onClick={() => handleViewDetails(order)}
                                  color="primary"
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Order">
                                <IconButton
                                  onClick={() => handleDeleteClick(order._id)}
                                  color="error"
                                  disabled={
                                    order.status === "Shipped" ||
                                    order.status === "Delivered"
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              {/* Mobile View */}
              <div className="block xl:hidden space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white p-4 rounded-lg shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold">#{order._id.slice(-6)}</p>
                        <p>
                          {order?.userInfo?.firstname}{" "}
                          {order?.userInfo?.lastname}
                        </p>
                      </div>
                      <Chip
                        label={order.status}
                        className={getStatusColor(order.status)}
                      />
                    </div>

                    <div className="space-y-2">
                      <p>Date: {format(new Date(order?.createdAt), "PP")}</p>
                      <p>Items: {order?.cartItemCount}</p>
                      <p>Total: Rs {order?.totalAmount}</p>
                    </div>

                    <div className="mt-4 space-y-2">
                      <Select
                        fullWidth
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Processing">Processing</MenuItem>
                        <MenuItem value="Shipped">Shipped</MenuItem>
                        <MenuItem value="Delivered">Delivered</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>

                      <div className="flex gap-2">
                        <Button
                          variant="contained"
                          onClick={() => handleViewDetails(order)}
                          fullWidth
                        >
                          View Details
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteClick(order._id)}
                          disabled={
                            order.status === "Shipped" ||
                            order.status === "Delivered"
                          }
                          fullWidth
                        >
                          Delete
                        </Button>
                        
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

     {/* Pagination */}
     {meta?.nextPage || meta?.previousPage ? (
          <nav className="w-full flex justify-center items-center my-16">
            <ul className="inline-flex items-center -space-x-px text-sm">
              {meta?.previousPage && (
                <>
                  <li 
                    onClick={() => handlePrevPage(meta?.previousPage)}
                    className="px-4 py-2 border rounded-l hover:bg-gray-100 cursor-pointer"
                  >
                    Previous
                  </li>
                  <li 
                    onClick={() => handlePrevPage(meta?.previousPage)}
                    className="px-4 py-2 border hover:bg-gray-100 cursor-pointer"
                  >
                    {meta?.previousPage}
                  </li>
                </>
              )}
              <li className="px-4 py-2 bg-[#603F26] text-white border">
                {meta?.currentPage}
              </li>
              {meta?.nextPage && (
                <>
                  <li 
                    onClick={() => handleNextPage(meta?.nextPage)}
                    className="px-4 py-2 border hover:bg-gray-100 cursor-pointer"
                  >
                    {meta?.nextPage}
                  </li>
                  <li 
                    onClick={() => handleNextPage(meta?.nextPage)}
                    className="px-4 py-2 border rounded-r hover:bg-gray-100 cursor-pointer"
                  >
                    Next
                  </li>
                </>
              )}
            </ul>
          </nav>
        ) : null}

      
        <OrderDetailsDialog
          open={!!viewOrderDetails}
          onClose={() => setViewOrderDetails(null)}
          order={viewOrderDetails}
        />

     
        <DeleteConfirmationDialog
          open={!!deleteOrderId}
          onClose={() => setDeleteOrderId(null)}
          onConfirm={handleDeleteConfirm}
          orderNumber={deleteOrderId?.slice(-6)}
        />
      </div>

    </ThemeProvider>
  );
};

export default ListOrders;