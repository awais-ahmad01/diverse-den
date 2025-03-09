import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../../tools";
import { Link } from "react-router-dom";
import {
  listOrders,
  // updateOrderStatus,
  // assignRider,
  // deleteOrder,
  // placeInStoreOrder,
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
  FormControl,
  InputLabel,
  FormHelperText,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Loader } from "../../../../tools";
import { format } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StoreIcon from "@mui/icons-material/Store";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import PrintIcon from "@mui/icons-material/Print";

// Define theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
  },
});

// Receipt Component
// Receipt Dialog Component
// Receipt Dialog Component
const ReceiptDialog = ({ open, onClose, order }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print(); // Trigger browser print functionality
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-[#603F26] text-white print:hidden">
        Order Receipt - #{order._id?.slice(-6)}
      </DialogTitle>
      <DialogContent>
        {/* Print-specific styling */}
        <style type="text/css" media="print">
          {`
            @page {
              size: auto;
              margin: 20mm 10mm 20mm 10mm;
            }
            
            /* Hide UI elements during print */
            .print-hidden, 
            .MuiDialog-actions,
            .MuiDialogTitle-root {
              display: none !important;
            }
            
            /* Receipt styling for print */
            .receipt-container {
              padding: 0 !important;
              margin: 0 !important;
            }
            
            /* Force background colors to print */
            .receipt-header {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          `}
        </style>

        {/* Receipt Content */}
        <Box sx={{ p: 3, mt: 2 }} className="receipt-container">
          {/* Store Information */}
          <Box 
            sx={{ 
              textAlign: "center", 
              mb: 3,
              pb: 2,
              borderBottom: "1px dashed #ccc"
            }}
            className="receipt-header"
          >
            <Typography
              variant="h4"
              sx={{ 
                fontWeight: "bold", 
                color: "#603F26",
                mb: 1
              }}
            >
              Diverse Den
            </Typography>
            <Typography variant="body1">123 Main St, City, Country</Typography>
            <Typography variant="body1">Phone: +123 456 7890</Typography>
          </Box>

          {/* Order Information */}
          <Box 
            sx={{ 
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 2,
              borderBottom: "1px solid #eee"
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Order Receipt
              </Typography>
              <Typography>Order ID: #{order._id?.slice(-6)}</Typography>
              <Typography>
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
              <Typography>
                Time: {new Date(order.createdAt).toLocaleTimeString()}
              </Typography>
            </Box>
            <Box 
              sx={{ 
                border: "1px solid #603F26", 
                borderRadius: "4px", 
                p: 1,
                bgcolor: "#fff8e1"
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Status: {order.status}
              </Typography>
            </Box>
          </Box>

          {/* Customer Information */}
          <Box 
            sx={{ 
              mb: 3,
              p: 2,
              bgcolor: "#f5f5f5",
              borderRadius: "4px"
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#603F26" }}>
              Customer Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Name:</strong> {order.userInfo?.firstname} {order.userInfo?.lastname}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {order.userInfo?.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Phone:</strong> {order.userInfo?.phone}
                </Typography>
                <Typography>
                  <strong>Address:</strong> {order.userInfo?.address}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Product Details */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#603F26" }}>
              Order Summary
            </Typography>
            <TableContainer 
              component={Paper} 
              sx={{ 
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                "& .MuiTableCell-head": {
                  bgcolor: "#603F26", 
                  color: "white",
                  fontWeight: "bold"
                }
              }}
            >
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
                  {order.items?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell align="right">{item.totalQuantity}</TableCell>
                      <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        ${(item.totalQuantity * item.price).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell
                      colSpan={3}
                      align="right"
                      sx={{ fontWeight: "bold" }}
                    >
                      Subtotal:
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      ${order.subtotal?.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell
                      colSpan={3}
                      align="right"
                      sx={{ fontWeight: "bold" }}
                    >
                      Shipping:
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      ${order.shippingCost?.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: "#fffde7" }}>
                    <TableCell
                      colSpan={3}
                      align="right"
                      sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    >
                      Total:
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                      ${order.totalAmount?.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Payment Information */}
          <Box 
            sx={{ 
              mb: 3,
              p: 2,
              bgcolor: "#f5f5f5",
              borderRadius: "4px"
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#603F26" }}>
              Payment Information
            </Typography>
            <Typography>
              <strong>Payment Method:</strong> {order.userInfo?.paymentMethod}
            </Typography>
            <Typography>
              <strong>Payment Status:</strong> {order.paymentStatus}
            </Typography>
            {order.transactionId && (
              <Typography>
                <strong>Transaction ID:</strong> {order.transactionId}
              </Typography>
            )}
          </Box>
          
          {/* Footer */}
          <Box 
            sx={{ 
              mt: 4, 
              pt: 2, 
              borderTop: "1px dashed #ccc",
              textAlign: "center" 
            }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              Thank you for shopping with Diverse Den!
            </Typography>
            <Typography variant="body2" color="textSecondary">
              For any inquiries, please contact our customer service team.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className="print-hidden">
        <Button
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
        >
          Print Receipt
        </Button>
        <Button variant="outlined" color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Order Details Dialog Component
const OrderDetailsDialog = ({ open, onClose, order }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-[#603F26] text-white">
        Order Details - #{order._id?.slice(-6)}
      </DialogTitle>
      <DialogContent className="mt-4">
        <Grid container spacing={3}>
          {/* Customer Information */}
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

          {/* Shipping Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className="font-bold mb-2">
              Shipping Address
            </Typography>
            <Typography>{order.userInfo?.address}</Typography>
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
                  {order.items?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell align="right">{item?.totalQuantity}</TableCell>
                      <TableCell align="right">${item.price}</TableCell>
                      <TableCell align="right">
                        ${item.totalQuantity * item.price}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right" className="font-bold">
                      Subtotal:
                    </TableCell>
                    <TableCell align="right">${order.subtotal}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right" className="font-bold">
                      Shipping:
                    </TableCell>
                    <TableCell align="right">${order.shippingCost}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right" className="font-bold">
                      Total:
                    </TableCell>
                    <TableCell align="right" className="font-bold">
                      ${order.totalAmount}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Payment Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className="font-bold mb-2">
              Payment Information
            </Typography>
            <Typography>Method: {order.userInfo?.paymentMethod}</Typography>
            <Typography>Status: {order.paymentStatus}</Typography>
            {order.transactionId && (
              <Typography>Transaction ID: {order.transactionId}</Typography>
            )}
          </Grid>

          {/* Order Status */}
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
            {order.rider && (
              <Typography>Assigned Rider: {order.rider.name}</Typography>
            )}
          </Grid>

          {/* Assign Rider Section (if order is ready for delivery) */}
          {(order.status === "Processing" || order.status === "Shipped") && (
            <Grid item xs={12}>
              <Divider className="my-4" />
              <Typography variant="h6" className="font-bold mb-2">
                Delivery Management
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TextField
                  select
                  label="Assign Rider"
                  fullWidth
                  variant="outlined"
                  defaultValue=""
                >
                  <MenuItem value="">Select a rider</MenuItem>
                  <MenuItem value="rider1">John Doe</MenuItem>
                  <MenuItem value="rider2">Jane Smith</MenuItem>
                  <MenuItem value="rider3">Alex Johnson</MenuItem>
                </TextField>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<LocalShippingIcon />}
                >
                  Assign
                </Button>
              </Box>
            </Grid>
          )}
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

// Delete Confirmation Dialog Component
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

// In-Store Order Dialog Component
const InStoreOrderDialog = ({ open, onClose, onSubmit }) => {
  const [customerInfo, setCustomerInfo] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "Cash",
  });

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errors, setErrors] = useState({});

  // Mock products data - in a real app, this would come from an API
  useEffect(() => {
    // Simulating API call to get products
    setProducts([
      { id: "p1", title: "Product 1", price: 29.99, stock: 15 },
      { id: "p2", title: "Product 2", price: 39.99, stock: 8 },
      { id: "p3", title: "Product 3", price: 19.99, stock: 20 },
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleAddProduct = (product) => {
    if (product) {
      setSelectedProducts((prev) => [
        ...prev,
        { ...product, totalQuantity: 1 },
      ]);
    }
  };

  const handleQuantityChange = (index, value) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].totalQuantity = parseInt(value);
    setSelectedProducts(updatedProducts);
  };

  const handleRemoveProduct = (index) => {
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate customer info
    if (!customerInfo.firstname.trim())
      newErrors.firstname = "First name is required";
    if (!customerInfo.lastname.trim())
      newErrors.lastname = "Last name is required";
    if (!customerInfo.phone.trim())
      newErrors.phone = "Phone number is required";
    if (!customerInfo.address.trim()) newErrors.address = "Address is required";

    // Validate products
    if (selectedProducts.length === 0)
      newErrors.products = "At least one product is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    return selectedProducts.reduce(
      (total, item) => total + item.price * item.totalQuantity,
      0
    );
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Create order object
      const orderData = {
        userInfo: customerInfo,
        items: selectedProducts,
        subtotal: calculateTotal(),
        shippingCost: 0, // No shipping cost for in-store orders
        totalAmount: calculateTotal(),
        status: "Delivered", // In-store orders are delivered immediately
        orderType: "In-Store",
      };

      onSubmit(orderData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-[#603F26] text-white">
        Place In-Store Order
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 3 }}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Customer Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="firstname"
                    label="First Name"
                    value={customerInfo.firstname}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!!errors.firstname}
                    helperText={errors.firstname}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="lastname"
                    label="Last Name"
                    value={customerInfo.lastname}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!!errors.lastname}
                    helperText={errors.lastname}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="phone"
                    label="Phone Number"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="address"
                    label="Address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!!errors.address}
                    helperText={errors.address}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      name="paymentMethod"
                      value={customerInfo.paymentMethod}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Card">Card</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                <StoreIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Products
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box mb={2}>
                <Autocomplete
                  options={products}
                  getOptionLabel={(option) => option.title}
                  renderInput={(params) => (
                    <TextField {...params} label="Search Products" />
                  )}
                  onChange={(_, value) => handleAddProduct(value)}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                />
                {errors.products && (
                  <FormHelperText error>{errors.products}</FormHelperText>
                )}
              </Box>

              {selectedProducts.length > 0 ? (
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedProducts.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.title}</TableCell>
                          <TableCell>${product.price}</TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={product.totalQuantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  index,
                                  Math.max(
                                    1,
                                    Math.min(
                                      product.stock,
                                      parseInt(e.target.value) || 1
                                    )
                                  )
                                )
                              }
                              InputProps={{
                                inputProps: { min: 1, max: product.stock },
                              }}
                              size="small"
                              sx={{ width: 80 }}
                            />
                          </TableCell>
                          <TableCell>
                            $
                            {(product.price * product.totalQuantity).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveProduct(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          <Typography variant="h6">Total:</Typography>
                        </TableCell>
                        <TableCell colSpan={2}>
                          <Typography variant="h6">
                            ${calculateTotal().toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ py: 2 }}
                >
                  No products added yet. Search and add products above.
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={selectedProducts.length === 0}
        >
          Place Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Order Management Component
const SalespersonOrderManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders, isloading, meta } = useSelector((state) => state.orders);

  const [viewOrderDetails, setViewOrderDetails] = useState(null);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderTypeFilter, setOrderTypeFilter] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [showInStoreOrderDialog, setShowInStoreOrderDialog] = useState(false);
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState(null);

  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);

  const totalOrders = meta?.totalOrders || 0;
  const totalOnlineOrders =
    orders?.filter((o) => o.orderType === "Online").length || 0;
  const totalInStoreOrders =
    orders?.filter((o) => o.orderType === "In-Store").length || 0;

  useEffect(() => {
    const business = user?.business;
    dispatch(listOrders({ business }));
  }, [dispatch, user]);

  useEffect(() => {
    if (orders) {
      setFilteredOrders(orders);
    }
  }, [orders]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    if (newValue === 0) {
      setFilteredOrders(orders);
      setOrderTypeFilter("");
    } else if (newValue === 1) {
      setFilteredOrders(orders.filter((o) => o.orderType === "Online"));
      setOrderTypeFilter("Online");
    } else if (newValue === 2) {
      setFilteredOrders(orders.filter((o) => o.orderType === "In-Store"));
      setOrderTypeFilter("In-Store");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus }))
        .unwrap()
        .then((response) => {
          showToast("SUCCESS", "Status Updated Successfully!!");
        })
        .catch((error) => {
          showToast("ERROR", "Failed to update status");
        });

      const business = user?.business;
      dispatch(listOrders({ business }));
    } catch (error) {
      console.error("Failed to update order status:", error);
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
      await dispatch(deleteOrder(deleteOrderId))
        .unwrap()
        .then((response) => {
          showToast("SUCCESS", "Order deleted Successfully!!");
        })
        .catch((error) => {
          showToast("ERROR", "Failed to delete order");
        });

      const business = user?.business;
      dispatch(listOrders({ business }));
    } catch (error) {
      console.error("Failed to delete order:", error);
    } finally {
      setDeleteOrderId(null);
    }
  };

  const handlePlaceInStoreOrder = async (orderData) => {
    try {
      await dispatch(placeInStoreOrder(orderData))
        .unwrap()
        .then((response) => {
          showToast("SUCCESS", "In-store order placed successfully!!");
        })
        .catch((error) => {
          showToast("ERROR", "Failed to place in-store order");
        });

      const business = user?.business;
      dispatch(listOrders({ business }));
    } catch (error) {
      console.error("Failed to place in-store order:", error);
    }
  };

  const handleGenerateReceipt = (order) => {
    setSelectedOrderForReceipt(order);
    setReceiptDialogOpen(true);
  };

  const handleCloseReceipt = () => {
    setReceiptDialogOpen(false);
    setSelectedOrderForReceipt(null);
  };

  const applyFilters = () => {
    let filtered = [...orders];

    if (orderTypeFilter) {
      filtered = filtered.filter(
        (order) => order.orderType === orderTypeFilter
      );
    }

    if (orderNumber) {
      filtered = filtered.filter((order) =>
        order._id.slice(-6).toLowerCase().includes(orderNumber.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

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
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isloading) {
    return <Loader />;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5">
        {/* Header */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
          <Typography
            variant="h4"
            sx={{ color: "#603F26", fontWeight: "bold" }}
          >
            Order Management
          </Typography>
        </Box>

        {/* Stats and Actions */}
        <Box
          sx={{
            px: { xs: 2, md: 4, lg: 6 },
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: { xs: "center", md: "space-between" },
            alignItems: "center",
            mb: 3,
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
                minWidth: 140,
              }}
            >
              <Typography variant="h4" component="div">
                {String(totalOrders).padStart(2, "0")}
              </Typography>
              <Typography variant="body2">Total Orders</Typography>
            </Paper>

            <Paper
              sx={{
                bgcolor: "#00796b",
                color: "white",
                px: 3,
                py: 2,
                borderRadius: 2,
                minWidth: 140,
              }}
            >
              <Typography variant="h4" component="div">
                {String(totalOnlineOrders).padStart(2, "0")}
              </Typography>
              <Typography variant="body2">Online Orders</Typography>
            </Paper>

            <Paper
              sx={{
                bgcolor: "#d84315",
                color: "white",
                px: 3,
                py: 2,
                borderRadius: 2,
                minWidth: 140,
              }}
            >
              <Typography variant="h4" component="div">
                {String(totalInStoreOrders).padStart(2, "0")}
              </Typography>
              <Typography variant="body2">In-Store Orders</Typography>
            </Paper>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setShowInStoreOrderDialog(true)}
            >
              New In-Store Order
            </Button>

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

        {/* Tabs */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              "& .MuiTab-root": {
                fontWeight: "bold",
              },
              "& .Mui-selected": {
                color: "#603F26 !important",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#603F26",
              },
            }}
          >
            <Tab label="All Orders" />
            <Tab label="Online Orders" />
            <Tab label="In-Store Orders" />
          </Tabs>
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
                    setStatusFilter("");
                    setFilteredOrders(
                      orderTypeFilter
                        ? orders.filter((o) => o.orderType === orderTypeFilter)
                        : orders
                    );
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Orders Content */}
        <div className="w-full px-4 md:px-8 lg:px-12 mt-4 flex-grow">
          {!filteredOrders || filteredOrders.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <Typography variant="h5" sx={{ mb: 2, color: "#603F26" }}>
                No Orders Found
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 3, color: "text.secondary" }}
              >
                {tabValue === 0
                  ? "No orders have been placed yet."
                  : tabValue === 1
                  ? "No online orders have been placed yet."
                  : "No in-store orders have been placed yet."}
              </Typography>
              {tabValue === 2 && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setShowInStoreOrderDialog(true)}
                >
                  Create In-Store Order
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop View */}
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
                          <TableCell>${order?.totalAmount}</TableCell>
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
                              <Tooltip title="Generate Receipt">
                                <IconButton
                                  onClick={() => handleGenerateReceipt(order)}
                                  color="primary"
                                >
                                  <PrintIcon />
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
                      <p>Total: ${order?.totalAmount}</p>
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
                          color="primary"
                          onClick={() => handleGenerateReceipt(order)}
                          fullWidth
                        >
                          Generate Receipt
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
                  <li className="px-4 py-2 border rounded-l hover:bg-gray-100 cursor-pointer">
                    Previous
                  </li>
                  <li className="px-4 py-2 border hover:bg-gray-100 cursor-pointer">
                    {meta?.previousPage}
                  </li>
                </>
              )}
              <li className="px-4 py-2 bg-[#603F26] text-white border">
                {meta?.currentPage}
              </li>
              {meta?.nextPage && (
                <>
                  <li className="px-4 py-2 border hover:bg-gray-100 cursor-pointer">
                    {meta?.nextPage}
                  </li>
                  <li className="px-4 py-2 border rounded-r hover:bg-gray-100 cursor-pointer">
                    Next
                  </li>
                </>
              )}
            </ul>
          </nav>
        ) : null}

        {/* Order Details Dialog */}
        <OrderDetailsDialog
          open={!!viewOrderDetails}
          onClose={() => setViewOrderDetails(null)}
          order={viewOrderDetails}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={!!deleteOrderId}
          onClose={() => setDeleteOrderId(null)}
          onConfirm={handleDeleteConfirm}
          orderNumber={deleteOrderId?.slice(-6)}
        />

        {/* In-Store Order Dialog */}
        <InStoreOrderDialog
          open={showInStoreOrderDialog}
          onClose={() => setShowInStoreOrderDialog(false)}
          onSubmit={handlePlaceInStoreOrder}
        />

        {/* Receipt Dialog */}
        {/* Receipt Dialog */}
        <ReceiptDialog
          open={receiptDialogOpen}
          onClose={handleCloseReceipt}
          order={selectedOrderForReceipt}
        />
      </div>
    </ThemeProvider>
  );
};

export default SalespersonOrderManagement;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { showToast } from "../../../../tools";
// import { Link } from "react-router-dom";
// import {
//   listOrders,
// //   updateOrderStatus,
// //   assignRider,
// //   deleteOrder,
// //   placeInStoreOrder,
// } from "../../../../store/actions/orders";
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Select,
//   MenuItem,
//   Typography,
//   Grid,
//   Chip,
//   Divider,
//   IconButton,
//   Tooltip,
//   Box,
//   TextField,
//   FormControl,
//   InputLabel,
//   FormHelperText,
//   Tabs,
//   Tab,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Autocomplete,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Loader } from "../../../../tools";
// import { format } from "date-fns";
// import DeleteIcon from "@mui/icons-material/Delete";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import AddIcon from "@mui/icons-material/Add";
// import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
// import LocalShippingIcon from "@mui/icons-material/LocalShipping";
// import StoreIcon from "@mui/icons-material/Store";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import PersonIcon from "@mui/icons-material/Person";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#603F26",
//     },
//   },
// });

// // Order Details Dialog Component
// const OrderDetailsDialog = ({ open, onClose, order }) => {
//   if (!order) return null;

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle className="bg-[#603F26] text-white">
//         Order Details - #{order._id?.slice(-6)}
//       </DialogTitle>
//       <DialogContent className="mt-4">
//         <Grid container spacing={3}>
//           {/* Customer Information */}
//           <Grid item xs={12} md={6}>
//             <Typography variant="h6" className="font-bold mb-2">
//               Customer Information
//             </Typography>
//             <Typography>
//               Name: {order.userInfo?.firstname} {order.userInfo?.lastname}
//             </Typography>
//             <Typography>Email: {order.userInfo?.email}</Typography>
//             <Typography>Phone: {order.userInfo?.phone}</Typography>
//           </Grid>

//           {/* Shipping Information */}
//           <Grid item xs={12} md={6}>
//             <Typography variant="h6" className="font-bold mb-2">
//               Shipping Address
//             </Typography>
//             <Typography>{order.userInfo?.address}</Typography>
//           </Grid>

//           {/* Order Summary */}
//           <Grid item xs={12}>
//             <Divider className="my-4" />
//             <Typography variant="h6" className="font-bold mb-2">
//               Order Summary
//             </Typography>
//             <TableContainer>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Product</TableCell>
//                     <TableCell align="right">Quantity</TableCell>
//                     <TableCell align="right">Price</TableCell>
//                     <TableCell align="right">Total</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {order.items?.map((item, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{item.title}</TableCell>
//                       <TableCell align="right">{item?.totalQuantity}</TableCell>
//                       <TableCell align="right">${item.price}</TableCell>
//                       <TableCell align="right">
//                         ${item.totalQuantity * item.price}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                   <TableRow>
//                     <TableCell colSpan={3} align="right" className="font-bold">
//                       Subtotal:
//                     </TableCell>
//                     <TableCell align="right">${order.subtotal}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell colSpan={3} align="right" className="font-bold">
//                       Shipping:
//                     </TableCell>
//                     <TableCell align="right">${order.shippingCost}</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell colSpan={3} align="right" className="font-bold">
//                       Total:
//                     </TableCell>
//                     <TableCell align="right" className="font-bold">
//                       ${order.totalAmount}
//                     </TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Grid>

//           {/* Payment Information */}
//           <Grid item xs={12} md={6}>
//             <Typography variant="h6" className="font-bold mb-2">
//               Payment Information
//             </Typography>
//             <Typography>Method: {order.userInfo?.paymentMethod}</Typography>
//             <Typography>Status: {order.paymentStatus}</Typography>
//             {order.transactionId && (
//               <Typography>Transaction ID: {order.transactionId}</Typography>
//             )}
//           </Grid>

//           {/* Order Status */}
//           <Grid item xs={12} md={6}>
//             <Typography variant="h6" className="font-bold mb-2">
//               Order Status
//             </Typography>
//             <Typography>
//               Current Status:
//               <Chip
//                 label={order.status}
//                 color={
//                   order.status === "Delivered"
//                     ? "success"
//                     : order.status === "Cancelled"
//                     ? "error"
//                     : "primary"
//                 }
//                 className="ml-2"
//               />
//             </Typography>
//             <Typography>
//               Order Date: {format(new Date(order.createdAt), "PPP")}
//             </Typography>
//             {order.rider && (
//               <Typography>Assigned Rider: {order.rider.name}</Typography>
//             )}
//           </Grid>

//           {/* Assign Rider Section (if order is ready for delivery) */}
//           {(order.status === "Processing" || order.status === "Shipped") && (
//             <Grid item xs={12}>
//               <Divider className="my-4" />
//               <Typography variant="h6" className="font-bold mb-2">
//                 Delivery Management
//               </Typography>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                 <TextField
//                   select
//                   label="Assign Rider"
//                   fullWidth
//                   variant="outlined"
//                   defaultValue=""
//                 >
//                   <MenuItem value="">Select a rider</MenuItem>
//                   <MenuItem value="rider1">John Doe</MenuItem>
//                   <MenuItem value="rider2">Jane Smith</MenuItem>
//                   <MenuItem value="rider3">Alex Johnson</MenuItem>
//                 </TextField>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   startIcon={<LocalShippingIcon />}
//                 >
//                   Assign
//                 </Button>
//               </Box>
//             </Grid>
//           )}
//         </Grid>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="primary">
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// // Delete Confirmation Dialog Component
// const DeleteConfirmationDialog = ({
//   open,
//   onClose,
//   onConfirm,
//   orderNumber,
// }) => {
//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle className="text-red-600">Delete Order</DialogTitle>
//       <DialogContent>
//         <DialogContentText>
//           Are you sure you want to delete order #{orderNumber}? This action
//           cannot be undone.
//         </DialogContentText>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="primary">
//           Cancel
//         </Button>
//         <Button onClick={onConfirm} color="error" variant="contained">
//           Delete
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// // In-Store Order Dialog Component
// const InStoreOrderDialog = ({ open, onClose, onSubmit }) => {
//   const [customerInfo, setCustomerInfo] = useState({
//     firstname: "",
//     lastname: "",
//     email: "",
//     phone: "",
//     address: "",
//     paymentMethod: "Cash",
//   });

//   const [products, setProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [errors, setErrors] = useState({});

//   // Mock products data - in a real app, this would come from an API
//   useEffect(() => {
//     // Simulating API call to get products
//     setProducts([
//       { id: "p1", title: "Product 1", price: 29.99, stock: 15 },
//       { id: "p2", title: "Product 2", price: 39.99, stock: 8 },
//       { id: "p3", title: "Product 3", price: 19.99, stock: 20 },
//     ]);
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCustomerInfo((prev) => ({ ...prev, [name]: value }));

//     // Clear error for this field
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: null }));
//     }
//   };

//   const handleAddProduct = (product) => {
//     if (product) {
//       setSelectedProducts((prev) => [
//         ...prev,
//         { ...product, totalQuantity: 1 },
//       ]);
//     }
//   };

//   const handleQuantityChange = (index, value) => {
//     const updatedProducts = [...selectedProducts];
//     updatedProducts[index].totalQuantity = parseInt(value);
//     setSelectedProducts(updatedProducts);
//   };

//   const handleRemoveProduct = (index) => {
//     setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     // Validate customer info
//     if (!customerInfo.firstname.trim()) newErrors.firstname = "First name is required";
//     if (!customerInfo.lastname.trim()) newErrors.lastname = "Last name is required";
//     if (!customerInfo.phone.trim()) newErrors.phone = "Phone number is required";
//     if (!customerInfo.address.trim()) newErrors.address = "Address is required";

//     // Validate products
//     if (selectedProducts.length === 0) newErrors.products = "At least one product is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const calculateTotal = () => {
//     return selectedProducts.reduce(
//       (total, item) => total + item.price * item.totalQuantity,
//       0
//     );
//   };

//   const handleSubmit = () => {
//     if (validateForm()) {
//       // Create order object
//       const orderData = {
//         userInfo: customerInfo,
//         items: selectedProducts,
//         subtotal: calculateTotal(),
//         shippingCost: 0, // No shipping cost for in-store orders
//         totalAmount: calculateTotal(),
//         status: "Delivered", // In-store orders are delivered immediately
//         orderType: "In-Store",
//       };

//       onSubmit(orderData);
//       onClose();
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle className="bg-[#603F26] text-white">
//         Place In-Store Order
//       </DialogTitle>
//       <DialogContent>
//         <Box sx={{ mt: 3 }}>
//           <Accordion defaultExpanded>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//                 <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
//                 Customer Information
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     name="firstname"
//                     label="First Name"
//                     value={customerInfo.firstname}
//                     onChange={handleInputChange}
//                     fullWidth
//                     required
//                     error={!!errors.firstname}
//                     helperText={errors.firstname}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     name="lastname"
//                     label="Last Name"
//                     value={customerInfo.lastname}
//                     onChange={handleInputChange}
//                     fullWidth
//                     required
//                     error={!!errors.lastname}
//                     helperText={errors.lastname}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     name="email"
//                     label="Email"
//                     type="email"
//                     value={customerInfo.email}
//                     onChange={handleInputChange}
//                     fullWidth
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     name="phone"
//                     label="Phone Number"
//                     value={customerInfo.phone}
//                     onChange={handleInputChange}
//                     fullWidth
//                     required
//                     error={!!errors.phone}
//                     helperText={errors.phone}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     name="address"
//                     label="Address"
//                     value={customerInfo.address}
//                     onChange={handleInputChange}
//                     fullWidth
//                     required
//                     error={!!errors.address}
//                     helperText={errors.address}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <FormControl fullWidth>
//                     <InputLabel>Payment Method</InputLabel>
//                     <Select
//                       name="paymentMethod"
//                       value={customerInfo.paymentMethod}
//                       onChange={handleInputChange}
//                     >
//                       <MenuItem value="Cash">Cash</MenuItem>
//                       <MenuItem value="Card">Card</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>
//               </Grid>
//             </AccordionDetails>
//           </Accordion>

//           <Accordion defaultExpanded sx={{ mt: 2 }}>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//                 <StoreIcon sx={{ mr: 1, verticalAlign: "middle" }} />
//                 Products
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <Box mb={2}>
//                 <Autocomplete
//                   options={products}
//                   getOptionLabel={(option) => option.title}
//                   renderInput={(params) => (
//                     <TextField {...params} label="Search Products" />
//                   )}
//                   onChange={(_, value) => handleAddProduct(value)}
//                   isOptionEqualToValue={(option, value) => option.id === value.id}
//                 />
//                 {errors.products && (
//                   <FormHelperText error>{errors.products}</FormHelperText>
//                 )}
//               </Box>

//               {selectedProducts.length > 0 ? (
//                 <TableContainer component={Paper} sx={{ mb: 2 }}>
//                   <Table>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Product</TableCell>
//                         <TableCell>Price</TableCell>
//                         <TableCell>Quantity</TableCell>
//                         <TableCell>Total</TableCell>
//                         <TableCell>Actions</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {selectedProducts.map((product, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{product.title}</TableCell>
//                           <TableCell>${product.price}</TableCell>
//                           <TableCell>
//                             <TextField
//                               type="number"
//                               value={product.totalQuantity}
//                               onChange={(e) =>
//                                 handleQuantityChange(
//                                   index,
//                                   Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1))
//                                 )
//                               }
//                               InputProps={{ inputProps: { min: 1, max: product.stock } }}
//                               size="small"
//                               sx={{ width: 80 }}
//                             />
//                           </TableCell>
//                           <TableCell>
//                             ${(product.price * product.totalQuantity).toFixed(2)}
//                           </TableCell>
//                           <TableCell>
//                             <IconButton
//                               color="error"
//                               onClick={() => handleRemoveProduct(index)}
//                             >
//                               <DeleteIcon />
//                             </IconButton>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                       <TableRow>
//                         <TableCell colSpan={3} align="right">
//                           <Typography variant="h6">Total:</Typography>
//                         </TableCell>
//                         <TableCell colSpan={2}>
//                           <Typography variant="h6">
//                             ${calculateTotal().toFixed(2)}
//                           </Typography>
//                         </TableCell>
//                       </TableRow>
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               ) : (
//                 <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
//                   No products added yet. Search and add products above.
//                 </Typography>
//               )}
//             </AccordionDetails>
//           </Accordion>
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           color="primary"
//           disabled={selectedProducts.length === 0}
//         >
//           Place Order
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// // Main Order Management Component
// const SalespersonOrderManagement = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const { orders, isloading, meta } = useSelector((state) => state.orders);

//   const [viewOrderDetails, setViewOrderDetails] = useState(null);
//   const [deleteOrderId, setDeleteOrderId] = useState(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const [orderNumber, setOrderNumber] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [orderTypeFilter, setOrderTypeFilter] = useState("");
//   const [tabValue, setTabValue] = useState(0);
//   const [showInStoreOrderDialog, setShowInStoreOrderDialog] = useState(false);

//   const totalOrders = meta?.totalOrders || 0;
//   const totalOnlineOrders = orders?.filter(o => o.orderType === "Online").length || 0;
//   const totalInStoreOrders = orders?.filter(o => o.orderType === "In-Store").length || 0;

//   useEffect(() => {
//     const business = user?.business;
//     dispatch(listOrders({ business }));
//   }, [dispatch, user]);

//   useEffect(() => {
//     if (orders) {
//       setFilteredOrders(orders);
//     }
//   }, [orders]);

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);

//     if (newValue === 0) {
//       setFilteredOrders(orders);
//       setOrderTypeFilter("");
//     } else if (newValue === 1) {
//       setFilteredOrders(orders.filter(o => o.orderType === "Online"));
//       setOrderTypeFilter("Online");
//     } else if (newValue === 2) {
//       setFilteredOrders(orders.filter(o => o.orderType === "In-Store"));
//       setOrderTypeFilter("In-Store");
//     }
//   };

//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       await dispatch(updateOrderStatus({ orderId, status: newStatus }))
//         .unwrap()
//         .then((response) => {
//           showToast("SUCCESS", "Status Updated Successfully!!");
//         })
//         .catch((error) => {
//           showToast("ERROR", "Failed to update status");
//         });

//       const business = user?.business;
//       dispatch(listOrders({ business }));
//     } catch (error) {
//       console.error("Failed to update order status:", error);
//     }
//   };

//   const handleViewDetails = (order) => {
//     setViewOrderDetails(order);
//   };

//   const handleDeleteClick = (orderId) => {
//     setDeleteOrderId(orderId);
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       await dispatch(deleteOrder(deleteOrderId))
//         .unwrap()
//         .then((response) => {
//           showToast("SUCCESS", "Order deleted Successfully!!");
//         })
//         .catch((error) => {
//           showToast("ERROR", "Failed to delete order");
//         });

//       const business = user?.business;
//       dispatch(listOrders({ business }));
//     } catch (error) {
//       console.error("Failed to delete order:", error);
//     } finally {
//       setDeleteOrderId(null);
//     }
//   };

//   const handlePlaceInStoreOrder = async (orderData) => {
//     try {
//       await dispatch(placeInStoreOrder(orderData))
//         .unwrap()
//         .then((response) => {
//           showToast("SUCCESS", "In-store order placed successfully!!");
//         })
//         .catch((error) => {
//           showToast("ERROR", "Failed to place in-store order");
//         });

//       const business = user?.business;
//       dispatch(listOrders({ business }));
//     } catch (error) {
//       console.error("Failed to place in-store order:", error);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...orders];

//     if (orderTypeFilter) {
//       filtered = filtered.filter((order) => order.orderType === orderTypeFilter);
//     }

//     if (orderNumber) {
//       filtered = filtered.filter((order) =>
//         order._id.slice(-6).toLowerCase().includes(orderNumber.toLowerCase())
//       );
//     }

//     if (statusFilter) {
//       filtered = filtered.filter((order) => order.status === statusFilter);
//     }

//     setFilteredOrders(filtered);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Delivered":
//         return "bg-green-100 text-green-800";
//       case "Cancelled":
//         return "bg-red-100 text-red-800";
//       case "Processing":
//         return "bg-blue-100 text-blue-800";
//       case "Shipped":
//         return "bg-purple-100 text-purple-800";
//       case "Pending":
//         return "bg-yellow-100 text-yellow-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   if (isloading) {
//     return <Loader />;
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <div className="relative bg-gray-50 flex flex-col pt-5">
//         {/* Header */}
//         <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
//           <Typography
//             variant="h4"
//             sx={{ color: "#603F26", fontWeight: "bold" }}
//           >
//             Order Management
//           </Typography>
//         </Box>

//         {/* Stats and Actions */}
//         <Box
//           sx={{
//             px: { xs: 2, md: 4, lg: 6 },
//             display: "flex",
//             flexWrap: "wrap",
//             gap: 2,
//             justifyContent: { xs: "center", md: "space-between" },
//             alignItems: "center",
//             mb: 3,
//           }}
//         >
//           <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
//             <Paper
//               sx={{
//                 bgcolor: "#603F26",
//                 color: "white",
//                 px: 3,
//                 py: 2,
//                 borderRadius: 2,
//                 minWidth: 140,
//               }}
//             >
//               <Typography variant="h4" component="div">
//                 {String(totalOrders).padStart(2, "0")}
//               </Typography>
//               <Typography variant="body2">Total Orders</Typography>
//             </Paper>

//             <Paper
//               sx={{
//                 bgcolor: "#00796b",
//                 color: "white",
//                 px: 3,
//                 py: 2,
//                 borderRadius: 2,
//                 minWidth: 140,
//               }}
//             >
//               <Typography variant="h4" component="div">
//                 {String(totalOnlineOrders).padStart(2, "0")}
//               </Typography>
//               <Typography variant="body2">Online Orders</Typography>
//             </Paper>

//             <Paper
//               sx={{
//                 bgcolor: "#d84315",
//                 color: "white",
//                 px: 3,
//                 py: 2,
//                 borderRadius: 2,
//                 minWidth: 140,
//               }}
//             >
//               <Typography variant="h4" component="div">
//                 {String(totalInStoreOrders).padStart(2, "0")}
//               </Typography>
//               <Typography variant="body2">In-Store Orders</Typography>
//             </Paper>
//           </Box>

//           <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<AddIcon />}
//               onClick={() => setShowInStoreOrderDialog(true)}
//             >
//               New In-Store Order
//             </Button>

//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<ReceiptLongIcon />}
//               component={Link}
//               to="../OrdersPaymentHistory"
//             >
//               Payment History
//             </Button>

//             <Button
//               variant="outlined"
//               color="primary"
//               startIcon={<FilterListIcon />}
//               onClick={() => setShowFilters(!showFilters)}
//             >
//               {showFilters ? "Hide Filters" : "Show Filters"}
//             </Button>
//           </Box>
//         </Box>

//         {/* Tabs */}
//         <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 2 }}>
//           <Tabs
//             value={tabValue}
//             onChange={handleTabChange}
//             variant="fullWidth"
//             sx={{
//               "& .MuiTab-root": {
//                 fontWeight: "bold",
//               },
//               "& .Mui-selected": {
//                 color: "#603F26 !important",
//               },
//               "& .MuiTabs-indicator": {
//                 backgroundColor: "#603F26",
//               },
//             }}
//           >
//             <Tab label="All Orders" />
//             <Tab label="Online Orders" />
//             <Tab label="In-Store Orders" />
//           </Tabs>
//         </Box>

//         {/* Filters */}
//         {showFilters && (
//           <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
//             <Paper sx={{ p: 3 }}>
//               <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
//                 <TextField
//                   label="Order Number"
//                   placeholder="Search by order number"
//                   value={orderNumber}
//                   onChange={(e) => setOrderNumber(e.target.value)}
//                 />
//                 <Select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   displayEmpty
//                   sx={{ minWidth: 200 }}
//                 >
//                   <MenuItem value="">All Statuses</MenuItem>
//                   <MenuItem value="Pending">Pending</MenuItem>
//                   <MenuItem value="Processing">Processing</MenuItem>
//                   <MenuItem value="Shipped">Shipped</MenuItem>
//                   <MenuItem value="Delivered">Delivered</MenuItem>
//                   <MenuItem value="Cancelled">Cancelled</MenuItem>
//                 </Select>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={applyFilters}
//                 >
//                   Apply Filters
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   onClick={() => {
//                     setOrderNumber("");
//                     setStatusFilter("");
//                     setFilteredOrders(
//                       orderTypeFilter
//                         ? orders.filter(o => o.orderType === orderTypeFilter)
//                         : orders
//                     );
//                   }}
//                 >
//                   Clear Filters
//                 </Button>
//               </Box>
//             </Paper>
//           </Box>
//         )}

//         {/* Orders Content */}
//         <div className="w-full px-4 md:px-8 lg:px-12 mt-4 flex-grow">
//           {!filteredOrders || filteredOrders.length === 0 ? (
//             <div className="bg-white p-8 rounded-lg shadow text-center">
//               <Typography variant="h5" sx={{ mb: 2, color: "#603F26" }}>
//                 No Orders Found
//               </Typography>
//               <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
//                 {tabValue === 0
//                   ? "No orders have been placed yet."
//                   : tabValue === 1
//                   ? "No online orders have been placed yet."
//                   : "No in-store orders have been placed yet."}
//               </Typography>
//               {tabValue === 2 && (
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   startIcon={<AddIcon />}
//                   onClick={() => setShowInStoreOrderDialog(true)}
//                 >
//                   Create In-Store Order
//                 </Button>
//               )}
//             </div>
//           ) : (
//             <>
//               {/* Desktop View */}
//               <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden xl:block">
//                 <TableContainer component={Paper}>
//                   <Table sx={{ minWidth: 650 }} aria-label="orders table">
//                     <TableHead sx={{ backgroundColor: "#603F26" }}>
//                       <TableRow>
//                         <TableCell
//                           sx={{
//                             color: "white",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Order ID
//                         </TableCell>
//                         <TableCell
//                           sx={{
//                             color: "white",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Customer
//                         </TableCell>
//                         <TableCell
//                           sx={{
//                             color: "white",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Date
//                         </TableCell>
//                         <TableCell
//                           sx={{
//                             color: "white",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                           }}
//                           >
//                           Items
//                         </TableCell>
//                         <TableCell
//                           sx={{
//                             color: "white",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Total
//                         </TableCell>
//                         <TableCell
//                           sx={{
//                             color: "white",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Status
//                         </TableCell>
//                         <TableCell
//                           sx={{
//                             color: "white",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Actions
//                         </TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {filteredOrders.map((order) => (
//                         <TableRow key={order._id}>
//                           <TableCell>#{order._id.slice(-6)}</TableCell>
//                           <TableCell>
//                             {order?.userInfo?.firstname}{" "}
//                             {order?.userInfo?.lastname}
//                           </TableCell>
//                           <TableCell>
//                             {format(new Date(order?.createdAt), "PP")}
//                           </TableCell>
//                           <TableCell>{order?.cartItemCount}</TableCell>
//                           <TableCell>${order?.totalAmount}</TableCell>
//                           <TableCell>
//                             <Select
//                               value={order.status}
//                               onChange={(e) =>
//                                 handleStatusChange(order._id, e.target.value)
//                               }
//                               className={getStatusColor(order.status)}
//                             >
//                               <MenuItem value="Pending">Pending</MenuItem>
//                               <MenuItem value="Processing">Processing</MenuItem>
//                               <MenuItem value="Shipped">Shipped</MenuItem>
//                               <MenuItem value="Delivered">Delivered</MenuItem>
//                               <MenuItem value="Cancelled">Cancelled</MenuItem>
//                             </Select>
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex gap-2">
//                               <Tooltip title="View Details">
//                                 <IconButton
//                                   onClick={() => handleViewDetails(order)}
//                                   color="primary"
//                                 >
//                                   <VisibilityIcon />
//                                 </IconButton>
//                               </Tooltip>
//                               <Tooltip title="Delete Order">
//                                 <IconButton
//                                   onClick={() => handleDeleteClick(order._id)}
//                                   color="error"
//                                   disabled={
//                                     order.status === "Shipped" ||
//                                     order.status === "Delivered"
//                                   }
//                                 >
//                                   <DeleteIcon />
//                                 </IconButton>
//                               </Tooltip>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </div>

//               {/* Mobile View */}
//               <div className="block xl:hidden space-y-4">
//                 {filteredOrders.map((order) => (
//                   <div
//                     key={order._id}
//                     className="bg-white p-4 rounded-lg shadow"
//                   >
//                     <div className="flex justify-between items-start mb-3">
//                       <div>
//                         <p className="font-bold">#{order._id.slice(-6)}</p>
//                         <p>
//                           {order?.userInfo?.firstname}{" "}
//                           {order?.userInfo?.lastname}
//                         </p>
//                       </div>
//                       <Chip
//                         label={order.status}
//                         className={getStatusColor(order.status)}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <p>Date: {format(new Date(order?.createdAt), "PP")}</p>
//                       <p>Items: {order?.cartItemCount}</p>
//                       <p>Total: ${order?.totalAmount}</p>
//                     </div>

//                     <div className="mt-4 space-y-2">
//                       <Select
//                         fullWidth
//                         value={order.status}
//                         onChange={(e) =>
//                           handleStatusChange(order._id, e.target.value)
//                         }
//                       >
//                         <MenuItem value="Pending">Pending</MenuItem>
//                         <MenuItem value="Processing">Processing</MenuItem>
//                         <MenuItem value="Shipped">Shipped</MenuItem>
//                         <MenuItem value="Delivered">Delivered</MenuItem>
//                         <MenuItem value="Cancelled">Cancelled</MenuItem>
//                       </Select>

//                       <div className="flex gap-2">
//                         <Button
//                           variant="contained"
//                           onClick={() => handleViewDetails(order)}
//                           fullWidth
//                         >
//                           View Details
//                         </Button>
//                         <Button
//                           variant="contained"
//                           color="error"
//                           onClick={() => handleDeleteClick(order._id)}
//                           disabled={
//                             order.status === "Shipped" ||
//                             order.status === "Delivered"
//                           }
//                           fullWidth
//                         >
//                           Delete
//                         </Button>
//                       </div>
//                     </div>
//                   </div>

//                 ))}
//               </div>
//             </>
//           )}
//         </div>

//         {/* Pagination */}
//         {meta?.nextPage || meta?.previousPage ? (
//           <nav className="w-full flex justify-center items-center my-16">
//             <ul className="inline-flex items-center -space-x-px text-sm">
//               {meta?.previousPage && (
//                 <>
//                   <li className="px-4 py-2 border rounded-l hover:bg-gray-100 cursor-pointer">
//                     Previous
//                   </li>
//                   <li className="px-4 py-2 border hover:bg-gray-100 cursor-pointer">
//                     {meta?.previousPage}
//                   </li>
//                 </>
//               )}
//               <li className="px-4 py-2 bg-[#603F26] text-white border">
//                 {meta?.currentPage}
//               </li>
//               {meta?.nextPage && (
//                 <>
//                   <li className="px-4 py-2 border hover:bg-gray-100 cursor-pointer">
//                     {meta?.nextPage}
//                   </li>
//                   <li className="px-4 py-2 border rounded-r hover:bg-gray-100 cursor-pointer">
//                     Next
//                   </li>
//                 </>
//               )}
//             </ul>
//           </nav>
//         ) : null}

//         {/* Order Details Dialog */}
//         <OrderDetailsDialog
//           open={!!viewOrderDetails}
//           onClose={() => setViewOrderDetails(null)}
//           order={viewOrderDetails}
//         />

//         {/* Delete Confirmation Dialog */}
//         <DeleteConfirmationDialog
//           open={!!deleteOrderId}
//           onClose={() => setDeleteOrderId(null)}
//           onConfirm={handleDeleteConfirm}
//           orderNumber={deleteOrderId?.slice(-6)}
//         />

//         {/* In-Store Order Dialog */}
//         <InStoreOrderDialog
//           open={showInStoreOrderDialog}
//           onClose={() => setShowInStoreOrderDialog(false)}
//           onSubmit={handlePlaceInStoreOrder}
//         />
//       </div>
//     </ThemeProvider>
//   );
// };

// export default SalespersonOrderManagement;
