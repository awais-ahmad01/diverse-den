import React, { useEffect, useState } from "react";
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
import { addProductToBranch, getBranchProducts, getVariantRemainings } from "../../../../store/actions/branches";
import { getProducts } from "../../../../store/actions/products";


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

const ProductDetailsDialog = ({ open, onClose, product, branchCode }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [assignedQuantities, setAssignedQuantities] = useState({});
  
  // This contains the remainingVariants array
  const { variants } = useSelector((state) => state.branches);

  useEffect(() => {
    if (open && product?._id) {
      dispatch(getVariantRemainings(product._id));
    }
  }, [open, product?._id, dispatch]);

  useEffect(() => {
    // Reset assigned quantities when dialog opens or product changes
    if (open) {
      setAssignedQuantities({});
    }
  }, [open, product?._id]);

  if (!product) return null;

  const handleQuantityChange = (variantIndex, colorName, quantity) => {
    if (!variants || !variants.remainingVariants || !variants.remainingVariants[variantIndex]) return;
    
    const variant = variants.remainingVariants[variantIndex];
    let remainingQuantity = 0;
    
    // If we're dealing with a color variant
    if (colorName) {
      // Find the color in the variant's colors array
      const colorVariant = variant.colors && variant.colors.find(c => c.color === colorName);
      if (colorVariant) {
        remainingQuantity = colorVariant.remainingQuantity || 0;
      }
    } else {
      // If no color specified, use the variant's total quantity
      remainingQuantity = variant.totalRemaining || 0;
    }

    if (quantity <= remainingQuantity) {
      setAssignedQuantities(prev => ({
        ...prev,
        [variantIndex]: {
          ...prev[variantIndex],
          [colorName || "default"]: quantity,
        },
      }));
    } else {
      alert(`Quantity cannot exceed ${remainingQuantity}`);
    }
  };

  const handleAssignQuantities = () => {
    // Check if variants and remainingVariants exist
    if (!variants || !variants.remainingVariants) {
      showToast("ERROR", "No variant data available");
      return;
    }
    
    let totalAssignedQuantity = 0;

    const assignedQuantitiesArray = variants.remainingVariants.map((variant, index) => {
      const variantQuantities = assignedQuantities[index] || {};
      
      // If the variant has colors
      if (variant.colors && variant.colors.length > 0) {
        // Map each color with its assigned quantity
        const colorsWithQuantities = variant.colors.map(colorObj => {
          const colorName = colorObj.color;
          const assignedQty = variantQuantities[colorName] || 0;
          totalAssignedQuantity += assignedQty;
          
          return {
            color: colorName,
            assignedQuantity: assignedQty,
          };
        });
        
        return {
          variantIndex: index,
          size: variant.size || "",
          material: variant.material || "",
          colors: colorsWithQuantities,
        };
      } else {
        // If no colors, just use the default quantity
        const assignedQty = variantQuantities.default || 0;
        totalAssignedQuantity += assignedQty;
        
        return {
          variantIndex: index,
          size: variant.size || "",
          material: variant.material || "",
          assignedQuantity: assignedQty,
        };
      }
    });
    
    // Filter out variants with no assigned quantities
    const filteredAssignedQuantities = assignedQuantitiesArray.filter(variantData => {
      if (variantData.colors) {
        // Check if any color has a quantity assigned
        return variantData.colors.some(color => color.assignedQuantity > 0);
      }
      // Check if the variant has a quantity assigned
      return variantData.assignedQuantity > 0;
    });
    
    // If no quantities were assigned, show a message
    if (filteredAssignedQuantities.length === 0) {
      showToast("ERROR", "Please assign at least one quantity");
      return;
    }

    const selectedProductWithQuantities = {
      product: {
        id: product._id,
        title: product.title,
        price: product.price,
        category: product.category,
        totalQuantity: product.totalQuantity,
        productId: variants.productId,
        productTitle: variants.productTitle,
      },
      assignedQuantities: filteredAssignedQuantities,
      totalAssignedQuantity: totalAssignedQuantity,
    };

    console.log("Selected Product with Assigned Quantities:", selectedProductWithQuantities);

    // const business = user?.business;
    dispatch(addProductToBranch({ branchCode, product: selectedProductWithQuantities }))
      .unwrap()
      .then(() => {
          showToast("SUCCESS", "Product added successfully");
          setAssignedQuantities({});
          onClose();
      })
      .catch(error => {
          showToast("ERROR", "Failed to add Product");
          console.error("Failed to add product:", error);
      });
  };
  
  // Helper function to check if any quantities have been assigned
  const hasAssignedQuantities = () => {
    for (const variantIndex in assignedQuantities) {
      const variantQtys = assignedQuantities[variantIndex];
      for (const colorKey in variantQtys) {
        if (variantQtys[colorKey] > 0) {
          return true;
        }
      }
    }
    return false;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-[#603F26] text-white">
        Product Details - {variants?.productTitle || product.title}
      </DialogTitle>
      <DialogContent className="mt-4" style={{ overflow: "auto" }}>
        <Grid container spacing={3}>
          {/* Product Information */}
          <Grid item xs={12}>
            <Typography variant="h6" className="font-bold mb-2">
              Product Information
            </Typography>
            <Typography>Title: {variants?.productTitle || product.title}</Typography>
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
                    <TableCell>Color</TableCell>
                    <TableCell align="right">Available Quantity</TableCell>
                    <TableCell align="right">Assign Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {variants && variants.remainingVariants && variants.remainingVariants.map((variant, index) => (
                    <React.Fragment key={index}>
                      {/* If variant has colors, render each color as a separate row */}
                      {variant.colors && variant.colors.length > 0 ? (
                        variant.colors.map((colorObj, colorIndex) => (
                          <TableRow key={`${index}-${colorIndex}`}>
                            {colorIndex === 0 ? (
                              <>
                                <TableCell rowSpan={variant.colors.length}>{variant.size || "N/A"}</TableCell>
                                <TableCell rowSpan={variant.colors.length}>{variant.material || "N/A"}</TableCell>
                              </>
                            ) : null}
                            <TableCell>{colorObj.color}</TableCell>
                            <TableCell align="right">{colorObj.remainingQuantity|| 0}</TableCell>
                            <TableCell align="right">
                              <TextField
                                type="number"
                                value={assignedQuantities[index]?.[colorObj.color] || ""}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    index,
                                    colorObj.color,
                                    Number(e.target.value)
                                  )
                                }
                                inputProps={{
                                  max: colorObj.quantity || 0,
                                  min: 0,
                                }}
                                size="small"
                                sx={{ width: "100px" }}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        // If variant has no colors, render a single row
                        <TableRow key={index}>
                          <TableCell>{variant.size || "N/A"}</TableCell>
                          <TableCell>{variant.material || "N/A"}</TableCell>
                          <TableCell>N/A</TableCell>
                          <TableCell align="right">{variant.totalRemaining || 0}</TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={assignedQuantities[index]?.default || ""}
                              onChange={(e) =>
                                handleQuantityChange(
                                  index,
                                  null,
                                  Number(e.target.value)
                                )
                              }
                              inputProps={{
                                max: variant.totalQuantity || 0,
                                min: 0,
                              }}
                              size="small"
                              sx={{ width: "100px" }}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                  {(!variants || !variants.remainingVariants || variants.remainingVariants.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No variant data available
                      </TableCell>
                    </TableRow>
                  )}
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
          disabled={
            !variants || 
            !variants.remainingVariants || 
            variants.remainingVariants.length === 0 ||
            !hasAssignedQuantities()
          }
        >
          Assign Quantities
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const ProductList = () => {

  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  // const {branchProducts, branchMeta} = useSelector((state) => state.branches);

  const {products, meta} = useSelector((state) => state.products);

  const { branchCode } = useParams();

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };



  const handleNextPage = (page) => {
          const business = user?.business;
          if (business && page) {
            console.log("Next Page:", page);
            dispatch(getProducts({ business, pageNo: page }));
          }
        };
    
        const handlePrevPage = (page) => {
          const business = user?.business;
          if (business && page) {
            console.log("Previous Page:", page);
            dispatch(getProducts({ business, pageNo: page }));
          }
        };
    

  useEffect(() => {
    const business = user?.business;
    dispatch(getProducts({business}));
    
  }, [dispatch]);


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
                    {products.map((product) => (
                      <TableRow
                        key={product._id}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        <TableCell>{product.title}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.remainingQuantity}</TableCell>
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
          {products.map((product) => (
            <Paper key={product._id} className="p-4 rounded-lg shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Typography variant="h6" className="font-bold">
                    {product.title}
                  </Typography>
                  <Typography>${product.price}</Typography>
                  <Typography>{product.category}</Typography>
                </div>
                <Chip
                  label={`Quantity: ${product.remainingQuantity}`}
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


        {meta?.nextPage || meta?.previousPage ? 
        <nav
          aria-label="Page navigation example"
          className="w-full flex justify-center items-center my-16"
        >
          <ul className="inline-flex items-center -space-x-px text-sm">
            {meta?.previousPage && (
              <>
                <li
                  onClick={() => handlePrevPage(meta?.previousPage)}
                  className="flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-l-md shadow-sm hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
                >
                  Previous
                </li>
                <li
                  onClick={() => handlePrevPage(meta?.previousPage)}
                  className="flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
                >
                  {meta?.previousPage}
                </li>
              </>
            )}

            <li className="flex items-center justify-center px-4 py-2 text-white bg-[#603F26] border border-[#603F26] shadow-md font-bold cursor-default rounded-md">
              {meta?.currentPage}
            </li>

            {meta?.nextPage && (
              <>
                <li
                  onClick={() => handleNextPage(meta?.nextPage)}
                  className="flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
                >
                  {meta?.nextPage}
                </li>
                <li
                  onClick={() => handleNextPage(meta?.nextPage)}
                  className="flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-r-md shadow-sm hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
                >
                  Next
                </li>
              </>
            )}
          </ul>
        </nav>
        : null
      }

        {/* Product Details Dialog */}
        <ProductDetailsDialog
          open={openDialog}
          onClose={handleCloseDialog}
          product={selectedProduct}
          branchCode={branchCode}
        />
      </div>
    </ThemeProvider>
  );
};

export default ProductList;