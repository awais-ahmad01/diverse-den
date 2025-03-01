import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { showToast } from "../../../../tools";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  ThemeProvider,
  createTheme,
  Typography,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { addProductToBranch } from "../../../../store/actions/branches";

const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
  },
});

// Mock data for products
const mockProducts = [
  {
    id: 1,
    title: "Product 1",
    price: 100,
    category: "Clothing",
    totalQuantity: 50,
    variants: [
      {
        id: 1,
        size: "M",
        material: "Cotton",
        colors: [
          { color: "Red", quantity: 10 },
          { color: "Blue", quantity: 15 },
        ],
        variantTotal: 25,
      },
      {
        id: 2,
        size: "L",
        material: "Polyester",
        colors: [
          { color: "Green", quantity: 5 },
          { color: "Yellow", quantity: 10 },
        ],
        variantTotal: 15,
      },
    ],
  },
  {
    id: 2,
    title: "Product 2",
    price: 200,
    category: "Shoes",
    totalQuantity: 30,
    variants: [
      {
        id: 3,
        size: "42",
        material: "Leather",
        colors: [],
        quantity: 15,
        variantTotal: 15,
      },
      {
        id: 4,
        size: "43",
        material: "Synthetic",
        colors: [],
        quantity: 15,
        variantTotal: 15,
      },
    ],
  },
  {
    id: 3,
    title: "Product 3",
    price: 150,
    category: "Furniture",
    totalQuantity: 10,
    variants: [
      {
        id: 5,
        size: "Large",
        material: "Wood",
        colors: [],
        quantity: 5,
        variantTotal: 5,
      },
      {
        id: 6,
        size: "Medium",
        material: "Metal",
        colors: [],
        quantity: 5,
        variantTotal: 5,
      },
    ],
  },
];

const ProductDetailsDialog = ({ open, onClose, product, branchId }) => {

    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const [assignedQuantities, setAssignedQuantities] = useState({});
  
    if (!product) return null;
  
    const handleQuantityChange = (variantId, color, quantity) => {
      const variant = product.variants.find((v) => v.id === variantId);
      const remainingQuantity = color
        ? variant.colors.find((c) => c.color === color).quantity
        : variant.variantTotal;
  
      if (quantity <= remainingQuantity) {
        setAssignedQuantities((prev) => ({
          ...prev,
          [variantId]: {
            ...prev[variantId],
            [color || "default"]: quantity,
          },
        }));
      } else {
        alert(`Quantity cannot exceed ${remainingQuantity}`);
      }
    };
  
    const handleAssignQuantities = () => {
      // Calculate the total assigned quantity
      let totalAssignedQuantity = 0;
  
      const assignedQuantitiesArray = product.variants.map((variant) => {
        const variantQuantities = assignedQuantities[variant.id] || {};
  
        // If the variant has colors, include color-specific quantities
        if (variant.colors.length > 0) {
          const colorsWithQuantities = variant.colors.map((color) => {
            const assignedQty = variantQuantities[color.color] || 0;
            totalAssignedQuantity += assignedQty; // Add to total assigned quantity
            return {
              color: color.color,
              assignedQuantity: assignedQty,
            };
          });
  
          return {
            variantId: variant.id,
            size: variant.size,
            material: variant.material,
            colors: colorsWithQuantities,
          };
        } else {
          // If the variant has no colors, include the variant's default quantity
          const assignedQty = variantQuantities.default || 0;
          totalAssignedQuantity += assignedQty; // Add to total assigned quantity
          return {
            variantId: variant.id,
            size: variant.size,
            material: variant.material,
            assignedQuantity: assignedQty,
          };
        }
      });
  
      // Create an object to store the selected product and its assigned quantities
      const selectedProductWithQuantities = {
        product: {
          id: product.id,
          title: product.title,
          price: product.price,
          category: product.category,
          totalQuantity: product.totalQuantity,
          variants: product.variants,
        },
        assignedQuantities: assignedQuantitiesArray,
        totalAssignedQuantity: totalAssignedQuantity, // Include total assigned quantity
      };
  
      // Log the selected product and its assigned quantities
      console.log("Selected Product with Assigned Quantities:", selectedProductWithQuantities);



      const business = user?.business;
        dispatch(addProductToBranch({ branchId, product: selectedProductWithQuantities, business }))
        .unwrap()
        .then(() => {
            showToast("SUCCESS", "product added successfully");
            setAssignedQuantities({});
            
        })
        .catch(error => {
            showToast("ERROR", "Failed to add Product");
            console.error("Failed to delete sale event:", error);
        });
  
      onClose();
    };
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle className="bg-[#603F26] text-white">
          Product Details - {product.title}
        </DialogTitle>
        <DialogContent className="mt-4" style={{ overflow: "auto" }}>
          <Grid container spacing={3}>
            {/* Product Information */}
            <Grid item xs={12}>
              <Typography variant="h6" className="font-bold mb-2">
                Product Information
              </Typography>
              <Typography>Title: {product.title}</Typography>
              <Typography>Price: ${product.price}</Typography>
              <Typography>Category: {product.category}</Typography>
              <Typography>
                Total Quantity: {product.totalQuantity}
              </Typography>
            </Grid>
  
            {/* Variants */}
            <Grid item xs={12}>
              <Divider className="my-4" />
              <Typography variant="h6" className="font-bold mb-2">
                Variants
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Size</TableCell>
                      <TableCell>Material</TableCell>
                      <TableCell>Colors</TableCell>
                      <TableCell align="right">Remaining Quantity</TableCell>
                      <TableCell align="right">Assign Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {product.variants.map((variant, index) => (
                      <React.Fragment key={index}>
                        {/* Variant Row */}
                        <TableRow>
                          <TableCell>{variant.size}</TableCell>
                          <TableCell>{variant.material}</TableCell>
                          <TableCell>
                            {variant.colors.length > 0
                              ? variant.colors
                                  .map((color) => `${color.color} (${color.quantity})`)
                                  .join(", ")
                              : "N/A"}
                          </TableCell>
                          <TableCell align="right">
                            {variant.variantTotal}
                          </TableCell>
                          <TableCell align="right">
                            {variant.colors.length === 0 && (
                              <TextField
                                type="number"
                                value={
                                  assignedQuantities[variant.id]?.default || ""
                                }
                                onChange={(e) =>
                                  handleQuantityChange(
                                    variant.id,
                                    null,
                                    Number(e.target.value)
                                  )
                                }
                                inputProps={{
                                  max: variant.variantTotal,
                                  min: 0,
                                }}
                                size="small"
                                sx={{ width: "100px" }}
                              />
                            )}
                          </TableCell>
                        </TableRow>
  
                        {/* Color Rows (if colors exist) */}
                        {variant.colors.length > 0 &&
                          variant.colors.map((color, colorIndex) => (
                            <TableRow key={colorIndex}>
                              <TableCell colSpan={3} align="right">
                                {color.color}
                              </TableCell>
                              <TableCell align="right">
                                {color.quantity}
                              </TableCell>
                              <TableCell align="right">
                                <TextField
                                  type="number"
                                  value={
                                    assignedQuantities[variant.id]?.[color.color] || ""
                                  }
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      variant.id,
                                      color.color,
                                      Number(e.target.value)
                          )}
                                  inputProps={{
                                    max: color.quantity,
                                    min: 0,
                                  }}
                                  size="small"
                                  sx={{ width: "100px" }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleAssignQuantities}
            color="primary"
            variant="contained"
          >
            Assign Quantities
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
const ProductList = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { branchId } = useParams();

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="bg-gray-50 flex flex-col p-5">
        {/* Header */}
        <div className="mb-6 flex items-center space-x-3 ml-2 md:ml-8 lg:ml-12">
          {/* <Link to="../">
            <FaArrowLeft className="text-[#603F26] text-xl cursor-pointer" />
          </Link> */}
          <h1 className="font-bold text-2xl text-[#603F26]">Product List</h1>
        </div>

        {/* Product Table (Desktop) */}
        <div className="hidden xl:block">
          <Grid container justifyContent="center">
            <Grid item xs={12} md={10} lg={8}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#603F26" }}>
                    <TableRow>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Name
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Price
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Category
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Remaining Quantity
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockProducts.map((product) => (
                      <TableRow
                        key={product.id}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        <TableCell>{product.title}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.totalQuantity}</TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton
                              onClick={() => handleProductClick(product)}
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
            </Grid>
          </Grid>
        </div>

        {/* Product Cards (Mobile) */}
        <div className="block xl:hidden space-y-4">
          {mockProducts.map((product) => (
            <Paper key={product.id} className="p-4 rounded-lg shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Typography variant="h6" className="font-bold">
                    {product.title}
                  </Typography>
                  <Typography>${product.price}</Typography>
                  <Typography>{product.category}</Typography>
                </div>
                <Chip
                  label={`Quantity: ${product.totalQuantity}`}
                  className="bg-[#603F26] text-white"
                />
              </div>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => handleProductClick(product)}
              >
                View Details
              </Button>
            </Paper>
          ))}
        </div>

        {/* Product Details Dialog */}
        <ProductDetailsDialog
          open={openDialog}
          onClose={handleCloseDialog}
          product={selectedProduct}
          branchId={branchId}
        />
      </div>
    </ThemeProvider>
  );
};

export default ProductList;