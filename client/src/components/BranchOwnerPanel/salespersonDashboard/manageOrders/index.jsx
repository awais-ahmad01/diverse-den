import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListOfRiders } from "../../../../store/actions/rider";
import { assignOrderToRider } from "../../../../store/actions/orders";
import { showToast } from "../../../../tools";
import { Link } from "react-router-dom";
import {
  listOrders,
  getSalespersonOrders,
  assignOrderToBranch,
  updateOrderStatus,
  // assignRider,
  deleteOrder,
  // placeInStoreOrder,
} from "../../../../store/actions/orders";
import { getBranches } from "../../../../store/actions/branches";
import { placeOrder } from "../../../../store/actions/products";
import { getBranchProductsByBranchCode } from "../../../../store/actions/branches";
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
              borderBottom: "1px dashed #ccc",
            }}
            className="receipt-header"
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#603F26",
                mb: 1,
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
              borderBottom: "1px solid #eee",
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Order Receipt
              </Typography>
              <Typography>Order ID: #{order._id?.slice(-6)}</Typography>
              <Typography>
                Date: {new Date(order?.createdAt).toLocaleDateString()}
              </Typography>
              <Typography>
                Time: {new Date(order?.createdAt).toLocaleTimeString()}
              </Typography>
            </Box>
            <Box
              sx={{
                border: "1px solid #603F26",
                borderRadius: "4px",
                p: 1,
                bgcolor: "#fff8e1",
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
              borderRadius: "4px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 1, color: "#603F26" }}
            >
              Customer Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Name:</strong> {order?.userInfo?.firstname}{" "}
                  {order.userInfo?.lastname}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {order?.userInfo?.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>
                  <strong>Phone:</strong> {order?.userInfo?.phone}
                </Typography>
                <Typography>
                  <strong>Address:</strong> {order?.userInfo?.address}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Product Details */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 1, color: "#603F26" }}
            >
              Order Summary
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                "& .MuiTableCell-head": {
                  bgcolor: "#603F26",
                  color: "white",
                  fontWeight: "bold",
                },
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
                  {order.cartItems?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item?.productId?.title}</TableCell>
                      <TableCell align="right">{item?.quantity}</TableCell>
                      <TableCell align="right">
                        Rs {item?.productId?.price?.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        Rs{" "}
                        {(item?.quantity * item?.productId?.price).toFixed(2)}
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
                      Rs {order?.subTotal?.toFixed(2)}
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
                      Rs {order.shippingCost?.toFixed(2)}
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
                    <TableCell
                      align="right"
                      sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    >
                      Rs {order?.totalAmount?.toFixed(2)}
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
              borderRadius: "4px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 1, color: "#603F26" }}
            >
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
              textAlign: "center",
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
const OrderDetailsDialog = ({ open, onClose, order, riders, handleAssignRider }) => {

  console.log("riders", riders);

  const [selectedRider, setSelectedRider] = useState(null);

  console.log("selectedRider", selectedRider);

  const riderAssign = ()=>{
    handleAssignRider(order._id, selectedRider);
  }
 


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
                  {order?.cartItems?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item?.productId?.title}</TableCell>
                      <TableCell align="right">{item?.quantity}</TableCell>
                      <TableCell align="right">
                        Rs {item?.productId?.price}
                      </TableCell>
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
                    <TableCell align="right">
                      Rs {order?.shippingCost}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right" className="font-bold">
                      Total:
                    </TableCell>
                    <TableCell align="right" className="font-bold">
                      Rs {order?.totalAmount}
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
            <Typography>Method: {order?.userInfo?.paymentMethod}</Typography>
            <Typography>Status: {order?.paymentStatus}</Typography>
            {order?.transactionId && (
              <Typography>Transaction ID: {order?.transactionId}</Typography>
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
                label={order?.status}
                color={
                  order?.status === "Delivered"
                    ? "success"
                    : order?.status === "Cancelled"
                    ? "error"
                    : "primary"
                }
                className="ml-2"
              />
            </Typography>
            <Typography>
              Order Date: {format(new Date(order?.createdAt), "PPP")}
            </Typography>
            {order?.rider && (
              <Typography>Assigned Rider: {order?.rider?.name}</Typography>
            )}
          </Grid>

          {/* Assign Rider Section (if order is ready for delivery) */}

          {(order?.status === "Processing" || order?.status === "Shipped") &&
            order?.orderType === "Online" && (
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
                    onChange={(e) => setSelectedRider(e.target.value)}
                    defaultValue={order?.rider || ""}
                  >
                    {/* <MenuItem value="">Select a rider</MenuItem> */}
                    {/* Dummy riders data - replace with API data later */}
                    {riders?.riders?.map((rider) => (
                      <MenuItem key={rider._id} value={rider?.riderId}>
                        {rider.name}
                      </MenuItem>
                    ))

                    }
                    {/* <MenuItem value="rider1">John Doe (Rider 1)</MenuItem>
                    <MenuItem value="rider2">Jane Smith (Rider 2)</MenuItem>
                    <MenuItem value="rider3">Alex Johnson (Rider 3)</MenuItem>
                    <MenuItem value="rider4">Sarah Williams (Rider 4)</MenuItem>
                    <MenuItem value="rider5">Michael Brown (Rider 5)</MenuItem> */}
                  </TextField>

                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<LocalShippingIcon />}
                    onClick={riderAssign}
                  >
                    {order?.rider ? "Reassign" : "Assign"}
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

const InStoreOrderDialog = ({ open, onClose, onSubmit, branchCode }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { branchProductsByBranchCode } = useSelector((state) => state.branches);

  useEffect(() => {
    dispatch(getBranchProductsByBranchCode(branchCode));
  }, [branchCode, open]);

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
  const [selectedVariants, setSelectedVariants] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (branchProductsByBranchCode) {
      setProducts(branchProductsByBranchCode);
    }
  }, [branchProductsByBranchCode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Check if product has variants based on the data structure
  const hasVariants = (product) => {
    return product.variants && product.variants.length > 0;
  };

  const handleAddProduct = (product) => {
    if (product) {
      if (!hasVariants(product)) {
        // Simple product without variants
        setSelectedProducts((prev) => [
          ...prev,
          {
            id: product._id || product.id,
            title: product.title,
            price: product.price,
            totalQuantity: 1,
            stock: product.totalBranchQuantity || 0,
            hasVariants: false,
          },
        ]);
      } else {
        // Product with variants - set up initial state
        setSelectedVariants((prev) => ({
          ...prev,
          [product._id || product.id]: {
            product,
            selectedItems: [],
          },
        }));
      }
    }
  };

  const handleAddVariantItem = (productId) => {
    const product = selectedVariants[productId].product;
    let initialVariant = {};

    // Handle the actual variant structure based on the provided data
    if (product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];

      // Check if variant has size
      if (firstVariant.size) {
        initialVariant.size = firstVariant.size;
      }

      // Check if variant has material
      if (firstVariant.material) {
        initialVariant.material = firstVariant.material;
      }

      // Handle colors if they exist
      if (firstVariant.colors && firstVariant.colors.length > 0) {
        const firstColor = firstVariant.colors[0];
        initialVariant.color = firstColor.color;
        initialVariant.stock = firstColor.quantity || 0;
        initialVariant.price = product.price;
      } else {
        // No colors, use variant quantity directly
        initialVariant.stock = firstVariant.quantity || 0;
        initialVariant.price = product.price;
      }

      // Set variant ID if available
      if (firstVariant._id) {
        initialVariant.variantId = firstVariant._id;
      }
    }

    // Add to selected items with initial quantity of 1
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        selectedItems: [
          ...prev[productId].selectedItems,
          {
            ...initialVariant,
            quantity: Math.min(1, initialVariant.stock || 1),
          },
        ],
      },
    }));
  };

  // Find variant stock based on selected options
  const findVariantStock = (product, variantOptions) => {
    if (!product.variants || product.variants.length === 0) {
      return 0;
    }

    // Find matching variant
    for (const variant of product.variants) {
      let match = true;

      // Check if size matches
      if (variantOptions.size && variant.size !== variantOptions.size) {
        match = false;
      }

      // Check if material matches
      if (
        variantOptions.material &&
        variant.material !== variantOptions.material
      ) {
        match = false;
      }

      // If we have a match on size/material, check for color
      if (
        match &&
        variantOptions.color &&
        variant.colors &&
        variant.colors.length > 0
      ) {
        const colorMatch = variant.colors.find(
          (c) => c.color === variantOptions.color
        );
        if (colorMatch) {
          return colorMatch.quantity || 0;
        }
        match = false;
      } else if (
        match &&
        (!variantOptions.color ||
          !variant.colors ||
          variant.colors.length === 0)
      ) {
        // If we have a match and no color is needed or no colors available
        return variant.quantity || 0;
      }
    }

    return 0;
  };

  // Get all available sizes from product variants
  const getSizeOptions = (product) => {
    if (!product.variants || product.variants.length === 0) {
      return [];
    }

    const sizes = new Set();
    product.variants.forEach((variant) => {
      if (variant.size) {
        sizes.add(variant.size);
      }
    });

    return Array.from(sizes);
  };

  // Get all available materials from product variants
  const getMaterialOptions = (product) => {
    if (!product.variants || product.variants.length === 0) {
      return [];
    }

    const materials = new Set();
    product.variants.forEach((variant) => {
      if (variant.material) {
        materials.add(variant.material);
      }
    });

    return Array.from(materials);
  };

  // Get all available colors for a given size/material
  const getColorOptions = (product, variantOptions) => {
    if (!product.variants || product.variants.length === 0) {
      return [];
    }

    const colors = new Set();

    product.variants.forEach((variant) => {
      let match = true;

      // Check if size matches (if size is specified)
      if (variantOptions.size && variant.size !== variantOptions.size) {
        match = false;
      }

      // Check if material matches (if material is specified)
      if (
        variantOptions.material &&
        variant.material !== variantOptions.material
      ) {
        match = false;
      }

      // If we have a match, add all colors
      if (match && variant.colors && variant.colors.length > 0) {
        variant.colors.forEach((color) => {
          colors.add(color.color);
        });
      }
    });

    return Array.from(colors);
  };

  const handleVariantChange = (productId, itemIndex, field, value) => {
    setSelectedVariants((prev) => {
      const product = prev[productId].product;
      const updatedItems = [...prev[productId].selectedItems];
      const currentItem = { ...updatedItems[itemIndex] };

      // Update the selected field
      currentItem[field] = value;

      // If changing primary variant (size/material), reset secondary variant (color)
      if ((field === "size" || field === "material") && currentItem.color) {
        // Check if the color is still valid with the new size/material
        const validColors = getColorOptions(product, currentItem);
        if (!validColors.includes(currentItem.color)) {
          // Reset color if it's no longer valid
          currentItem.color = validColors.length > 0 ? validColors[0] : "";
        }
      }

      // Update stock based on new selection
      currentItem.stock = findVariantStock(product, currentItem);

      // Keep price as product price (assuming price doesn't change by variant)
      currentItem.price = product.price;

      // Ensure quantity is valid for new stock level
      if (field !== "quantity") {
        currentItem.quantity = Math.min(
          currentItem.quantity || 1,
          Math.max(1, currentItem.stock || 1)
        );
      } else {
        // Direct quantity update
        currentItem.quantity = Math.max(
          1,
          Math.min(currentItem.stock || 1, parseInt(value) || 1)
        );
      }

      updatedItems[itemIndex] = currentItem;

      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          selectedItems: updatedItems,
        },
      };
    });
  };

  const handleRemoveVariantItem = (productId, itemIndex) => {
    setSelectedVariants((prev) => {
      const updatedItems = prev[productId].selectedItems.filter(
        (_, i) => i !== itemIndex
      );

      // If no items left, remove the product entirely
      if (updatedItems.length === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          selectedItems: updatedItems,
        },
      };
    });
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
    const hasSelectedProducts =
      selectedProducts.length > 0 || Object.keys(selectedVariants).length > 0;

    if (!hasSelectedProducts)
      newErrors.products = "At least one product is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    // Calculate total for simple products
    const simpleProductsTotal = selectedProducts.reduce(
      (total, item) => total + item.price * item.totalQuantity,
      0
    );

    // Calculate total for products with variants
    const variantProductsTotal = Object.values(selectedVariants).reduce(
      (total, { product, selectedItems }) => {
        return (
          total +
          selectedItems.reduce(
            (subtotal, item) => subtotal + item.price * item.quantity,
            0
          )
        );
      },
      0
    );

    return simpleProductsTotal + variantProductsTotal;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Format cart items according to the required structure
      const cartItems = [
        // Simple products
        ...selectedProducts.map((product) => ({
          createdAt: new Date().toISOString(),
          productId: product?.product, // Include full product object if available
          quantity: product.totalQuantity,
          selectedVariant: {
            color: "",
            material: "",
            size: "",
          },
          updatedAt: new Date().toISOString(),
          userId: user?._id,
        })),

        // Products with variants
        ...Object.values(selectedVariants).flatMap(
          ({ product, selectedItems }) =>
            selectedItems.map((item) => ({
              createdAt: new Date().toISOString(),
              productId: product?.product, // Include full product object
              quantity: item.quantity,
              selectedVariant: {
                color: item.color || "",
                material: item.material || "",
                size: item.size || "",
              },
              updatedAt: new Date().toISOString(),
              userId: user?._id,
            }))
        ),
      ];

      // Prepare order data structure
      const body = {
        cartItems,
        data: {
          address: customerInfo.address,
          // city: "Islamabad", // You might want to add city field to your form
          email: customerInfo.email,
          firstName: customerInfo.firstname,
          lastName: customerInfo.lastname,
          paymentMethod: customerInfo.paymentMethod,
          // === "Cash" ? "cashOnDelivery" : customerInfo.paymentMethod.toLowerCase(),
          phone: customerInfo.phone,
          // postalCode: "45000", // You might want to add postalCode field to your form
        },
        orderType: "In-Store",
        shippingCost: 0, // For in-store orders
        totalAmount: calculateTotal(),
      };

      console.log("orderData:", body);
      onSubmit(body);
      onClose();
    }
  };

  // Determine if product has size variants
  const hasSizeVariants = (product) => {
    return product.variants && product.variants.some((v) => v.size);
  };

  // Determine if product has material variants
  const hasMaterialVariants = (product) => {
    return product.variants && product.variants.some((v) => v.material);
  };

  // Determine if product has color variants
  const hasColorVariants = (product) => {
    return (
      product.variants &&
      product.variants.some((v) => v.colors && v.colors.length > 0)
    );
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
                {loading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    py={2}
                  >
                    <CircularProgress size={24} sx={{ mr: 2 }} />
                    <Typography>Loading products...</Typography>
                  </Box>
                ) : error ? (
                  <Box
                    sx={{ p: 2, bgcolor: "#fff4e5", borderRadius: 1, mb: 2 }}
                  >
                    <Typography color="error">{error}</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() => {
                        setError(null);
                        setLoading(true);
                        // Retry fetching
                        fetch("/api/products")
                          .then((res) => {
                            if (!res.ok) throw new Error("Failed to fetch");
                            return res.json();
                          })
                          .then((data) => {
                            setProducts(data);
                            setLoading(false);
                          })
                          .catch((err) => {
                            setError(
                              "Failed to load products. Please try again later."
                            );
                            setLoading(false);
                          });
                      }}
                    >
                      Retry
                    </Button>
                  </Box>
                ) : (
                  <Autocomplete
                    options={branchProductsByBranchCode || products}
                    getOptionLabel={(option) => option.title || ""}
                    renderInput={(params) => (
                      <TextField {...params} label="Search Products" />
                    )}
                    onChange={(_, value) => handleAddProduct(value)}
                    isOptionEqualToValue={(option, value) =>
                      (option._id || option.id) === (value._id || value.id)
                    }
                  />
                )}
                {errors.products && (
                  <FormHelperText error>{errors.products}</FormHelperText>
                )}
              </Box>

              {/* Products with variants */}
              {Object.keys(selectedVariants).length > 0 && (
                <Box mb={3}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Products with Variants
                  </Typography>
                  {Object.entries(selectedVariants).map(
                    ([productId, { product, selectedItems }]) => (
                      <Paper key={productId} sx={{ p: 2, mb: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Typography variant="h6">{product.title}</Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleAddVariantItem(productId)}
                          >
                            Add Variant
                          </Button>
                        </Box>

                        {selectedItems.length > 0 ? (
                          <TableContainer component={Paper} sx={{ mb: 1 }}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  {hasSizeVariants(product) && (
                                    <TableCell>Size</TableCell>
                                  )}
                                  {hasMaterialVariants(product) && (
                                    <TableCell>Material</TableCell>
                                  )}
                                  {hasColorVariants(product) && (
                                    <TableCell>Color</TableCell>
                                  )}
                                  <TableCell>Available</TableCell>
                                  <TableCell>Price</TableCell>
                                  <TableCell>Quantity</TableCell>
                                  <TableCell>Total</TableCell>
                                  <TableCell>Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {selectedItems.map((item, idx) => (
                                  <TableRow key={idx}>
                                    {hasSizeVariants(product) && (
                                      <TableCell>
                                        <Select
                                          value={item.size || ""}
                                          size="small"
                                          onChange={(e) =>
                                            handleVariantChange(
                                              productId,
                                              idx,
                                              "size",
                                              e.target.value
                                            )
                                          }
                                        >
                                          {getSizeOptions(product).map(
                                            (size) => (
                                              <MenuItem key={size} value={size}>
                                                {size}
                                              </MenuItem>
                                            )
                                          )}
                                        </Select>
                                      </TableCell>
                                    )}
                                    {hasMaterialVariants(product) && (
                                      <TableCell>
                                        <Select
                                          value={item.material || ""}
                                          size="small"
                                          onChange={(e) =>
                                            handleVariantChange(
                                              productId,
                                              idx,
                                              "material",
                                              e.target.value
                                            )
                                          }
                                        >
                                          {getMaterialOptions(product).map(
                                            (material) => (
                                              <MenuItem
                                                key={material}
                                                value={material}
                                              >
                                                {material}
                                              </MenuItem>
                                            )
                                          )}
                                        </Select>
                                      </TableCell>
                                    )}
                                    {hasColorVariants(product) && (
                                      <TableCell>
                                        <Select
                                          value={item.color || ""}
                                          size="small"
                                          onChange={(e) =>
                                            handleVariantChange(
                                              productId,
                                              idx,
                                              "color",
                                              e.target.value
                                            )
                                          }
                                        >
                                          {getColorOptions(product, item).map(
                                            (color) => (
                                              <MenuItem
                                                key={color}
                                                value={color}
                                              >
                                                {color}
                                              </MenuItem>
                                            )
                                          )}
                                        </Select>
                                      </TableCell>
                                    )}
                                    <TableCell>
                                      {item.stock > 0 ? (
                                        item.stock
                                      ) : (
                                        <Chip
                                          size="small"
                                          label="Out of stock"
                                          color="error"
                                        />
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      Rs {item.price?.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) =>
                                          handleVariantChange(
                                            productId,
                                            idx,
                                            "quantity",
                                            e.target.value
                                          )
                                        }
                                        InputProps={{
                                          inputProps: {
                                            min: 1,
                                            max: item.stock || 1,
                                          },
                                        }}
                                        size="small"
                                        sx={{ width: 80 }}
                                        disabled={item.stock <= 0}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      Rs{" "}
                                      {(item.price * item.quantity).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                      <IconButton
                                        color="error"
                                        size="small"
                                        onClick={() =>
                                          handleRemoveVariantItem(
                                            productId,
                                            idx
                                          )
                                        }
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          <Typography color="text.secondary">
                            No variants added yet. Click "Add Variant" to select
                            options.
                          </Typography>
                        )}
                      </Paper>
                    )
                  )}
                </Box>
              )}

              {/* Simple products without variants */}
              {selectedProducts.length > 0 && (
                <Box mb={2}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Simple Products
                  </Typography>
                  <TableContainer component={Paper}>
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
                            <TableCell>${product.price.toFixed(2)}</TableCell>
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
                              {(product.price * product.totalQuantity).toFixed(
                                2
                              )}
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
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Order summary */}
              {(selectedProducts.length > 0 ||
                Object.keys(selectedVariants).length > 0) && (
                <Paper sx={{ p: 2, mt: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Order Summary
                  </Typography>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h6">Total Amount:</Typography>
                    <Typography variant="h6">
                      Rs {calculateTotal().toFixed(2)}
                    </Typography>
                  </Box>
                </Paper>
              )}

              {!loading &&
                !error &&
                selectedProducts.length === 0 &&
                Object.keys(selectedVariants).length === 0 && (
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
          disabled={
            selectedProducts.length === 0 &&
            Object.keys(selectedVariants).length === 0
          }
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

  const {listOfRiders} = useSelector((state) => state.rider);
    console.log("listOfRiders:", listOfRiders);

  const branchCode = user?.assignedBranch;

  const { salespersonOrders, isloading, meta } = useSelector(
    (state) => state.orders
  );
  const { branches } = useSelector((state) => state.branches);

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

  // Store the original dummy data
  const [allOrders, setAllOrders] = useState([]);

  console.log("salespersonOrders:", salespersonOrders);
  console.log("filteredOrders:", filteredOrders);
  console.log("allOrders:", allOrders);


  useEffect(() => {
    const branchCode = user?.assignedBranch;

    const userId = user?._id;

    dispatch(getSalespersonOrders({ branchCode }));

    const business = user?.business;
    dispatch(getBranches({ business }));

    dispatch(getListOfRiders(userId))

  }, [dispatch, user]);

  useEffect(() => {
    if (salespersonOrders) {
      setAllOrders(salespersonOrders);
      setFilteredOrders(salespersonOrders);
    }
  }, [salespersonOrders]);


  const handleAssignRider = (orderId, riderId) => {
    console.log("handleAssignRider", orderId, riderId);
    dispatch(assignOrderToRider({ orderId, riderId }))
    .unwrap()
    .then(() => {
      showToast("SUCCESS", "Order assigned to rider Successfully!!");
    })
    .catch((error) => {
      showToast("ERROR", "Failed to assigned order to rider");
    });
  }


  const totalOrders = salespersonOrders?.length || 0;
  const totalOnlineOrders =
    allOrders.filter((o) => o.orderType === "Online").length || 0;
  const totalInStoreOrders =
    allOrders.filter((o) => o.orderType === "In-Store").length || 0;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    if (newValue === 0) {
      setFilteredOrders(allOrders);
      setOrderTypeFilter("");
    } else if (newValue === 1) {
      setFilteredOrders(
        allOrders.filter((order) => order.orderType === "Online")
      );
      setOrderTypeFilter("Online");
    } else if (newValue === 2) {
      // In-Store Orders tab
      setFilteredOrders(
        allOrders.filter((order) => order.orderType === "In-Store")
      );
      setOrderTypeFilter("In-Store");
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }))
      .unwrap()
      .then((response) => {
        showToast("SUCCESS", "Status Updated Successfully!!");
        const branchCode = user?.assignedBranch;
        dispatch(getSalespersonOrders({ branchCode }));
      })
      .catch((error) => {
        showToast("ERROR", "Failed to update status");
      });
  };

  const handleViewDetails = (order) => {
    setViewOrderDetails(order);
  };

  const handleDeleteClick = (orderId) => {
    setDeleteOrderId(orderId);
  };

  const handleDeleteConfirm = async () => {
    const business = user?.business;

    dispatch(deleteOrder({ deleteOrderId, business }))
      .unwrap()
      .then((response) => {
        showToast("SUCCESS", "Order deleted Successfully!!");
        const branchCode = user?.assignedBranch;
        dispatch(getSalespersonOrders({ branchCode }));
        setDeleteOrderId(null);
      })
      .catch((error) => {
        showToast("ERROR", "Failed to delete order");
      });
  };

  const handlePlaceInStoreOrder = (body) => {
    console.log("bodyyyy :", body);
    dispatch(placeOrder(body))
      .unwrap()
      .then((response) => {
        showToast("SUCCESS", "Order placed Successfully!!");
        const branchCode = user?.assignedBranch;
        dispatch(getSalespersonOrders({ branchCode }));
      })
      .catch((error) => {
        showToast("ERROR", "Failed to place order");
      });
  };

  const handleGenerateReceipt = (order) => {
    setSelectedOrderForReceipt(order);
    setReceiptDialogOpen(true);
  };

  const handleCloseReceipt = () => {
    setReceiptDialogOpen(false);
    setSelectedOrderForReceipt(null);
  };

  const isMainSalesperson = () => {
    return user?.hasMainBranch === true;
  };

  console.log("isMainSalesperson", isMainSalesperson());

  const handleBranchChange = (orderId, cartItems, branch) => {
    console.log("handleBranchChange", orderId, branch, cartItems);

    console.log("cartItems", cartItems);

    dispatch(assignOrderToBranch({ orderId, cartItems, branch }))
      .unwrap()
      .then(() => {
        showToast("SUCCESS", "Order assigned to branch Successfully!!");
        const branchCode = user?.assignedBranch;
        dispatch(getSalespersonOrders({ branchCode }));
      })
      .catch((error) => {
        showToast("ERROR", "Failed to assigned order to branch");
      });
  };

  const applyFilters = () => {
    // Start with the correct base set of orders based on current tab
    let baseOrders;
    if (tabValue === 0) {
      baseOrders = [...allOrders];
    } else if (tabValue === 1) {
      baseOrders = allOrders.filter((order) => order.orderType === "Online");
    } else if (tabValue === 2) {
      baseOrders = allOrders.filter((order) => order.orderType === "In-Store");
    }

    let filtered = [...baseOrders];

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

  const clearFilters = () => {
    setOrderNumber("");
    setStatusFilter("");

    if (tabValue === 0) {
      setFilteredOrders(allOrders);
    } else if (tabValue === 1) {
      setFilteredOrders(allOrders.filter((o) => o.orderType === "Online"));
    } else if (tabValue === 2) {
      setFilteredOrders(allOrders.filter((o) => o.orderType === "In-Store"));
    }
  };

  const handleNextPage = (page) => {
    const branchCode = user?.assignedBranch;
    if (branchCode && page) {
      dispatch(getSalespersonOrders({ branchCode, pageNo: page }));
    }
  };

  const handlePrevPage = (page) => {
    const branchCode = user?.assignedBranch;
    if (branchCode && page) {
      dispatch(getSalespersonOrders({ branchCode, pageNo: page }));
    }
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
      <div className="relative bg-gray-50 flex flex-col pt-5 pb-9">
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
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </Box>
            </Paper>
          </Box>
        )}

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
                          Type
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
                        {isMainSalesperson() && (
                          <TableCell
                            sx={{
                              color: "white",
                              fontSize: "16px",
                              fontWeight: "bold",
                            }}
                          >
                            Branch
                          </TableCell>
                        )}
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
                        <TableRow key={order?._id}>
                          <TableCell>#{order?._id.slice(-6)}</TableCell>
                          <TableCell>
                            {order?.userInfo?.firstname}{" "}
                            {order?.userInfo?.lastname}
                          </TableCell>
                          <TableCell>
                            {format(new Date(order?.createdAt), "PP")}
                          </TableCell>
                          <TableCell>{order?.cartItemCount}</TableCell>
                          <TableCell>Rs {order?.totalAmount}</TableCell>
                          <TableCell>{order?.orderType}</TableCell>
                          <TableCell>
                            <Select
                              value={order?.status}
                              onChange={(e) =>
                                handleStatusChange(order?._id, e.target.value)
                              }
                              className={getStatusColor(order?.status)}
                            >
                              <MenuItem value="Pending">Pending</MenuItem>
                              <MenuItem value="Processing">Processing</MenuItem>
                              <MenuItem value="Shipped">Shipped</MenuItem>
                              <MenuItem value="Delivered">Delivered</MenuItem>
                              <MenuItem value="Cancelled">Cancelled</MenuItem>
                            </Select>
                          </TableCell>
                          {isMainSalesperson() &&
                            order?.orderType === "Online" && (
                              <TableCell>
                                <Select
                                  value={order?.assignedBranch || ""}
                                  onChange={(e) =>
                                    handleBranchChange(
                                      order?._id,
                                      order?.cartItems,
                                      e.target.value
                                    )
                                  }
                                  displayEmpty
                                  fullWidth
                                >
                                  <MenuItem value="">Select Branch</MenuItem>
                                  {branches.map((branch) => (
                                    <MenuItem key={branch?._id} value={branch}>
                                      {branch?.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </TableCell>
                            )}
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
                    key={order?._id}
                    className="bg-white p-4 rounded-lg shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold">#{order?._id.slice(-6)}</p>
                        <p>
                          {order?.userInfo?.firstname}{" "}
                          {order?.userInfo?.lastname}
                        </p>
                      </div>
                      <Chip
                        label={order?.status}
                        className={getStatusColor(order?.status)}
                      />
                    </div>

                    <div className="space-y-2">
                      <p>Date: {format(new Date(order?.createdAt), "PP")}</p>
                      <p>Items: {order?.cartItemCount}</p>
                      <p>Total: ${order?.totalAmount}</p>
                      <p>Type: {order?.orderType}</p>
                    </div>

                    <div className="mt-4 space-y-2">
                      <Select
                        fullWidth
                        value={order?.status}
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

                      {isMainSalesperson() && order.orderType === "Online" && (
                        <div className="mt-4">
                          <p className="font-bold mb-1">Select Branch:</p>
                          <Select
                            fullWidth
                            value={order?.assignedBranch || ""}
                            onChange={(e) =>
                              handleBranchChange(
                                order?._id,
                                order?.cartItems,
                                e.target.value
                              )
                            }
                            displayEmpty
                          >
                            <MenuItem value="">Select Branch</MenuItem>
                            {branches?.map((branch) => (
                              <MenuItem key={branch.id} value={branch.id}>
                                {branch.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                      )}

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
                          Receipt
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteClick(order?._id)}
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

        {/* Order Details Dialog */}
        <OrderDetailsDialog
          open={!!viewOrderDetails}
          onClose={() => setViewOrderDetails(null)}
          order={viewOrderDetails}
          riders={listOfRiders}
          handleAssignRider={handleAssignRider}
          
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
          branchCode={branchCode}
        />

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
