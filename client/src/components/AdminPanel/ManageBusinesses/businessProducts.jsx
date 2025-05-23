
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getBusinessProducts, deleteBusinessProduct } from "../../../store/actions/businesses";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Loader, showToast } from "../../../tools";



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
  Typography,
  Box,
  IconButton,
  Tooltip
} from "@mui/material";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
  },
});

const BusinessProducts = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { businessProducts, productsMeta, isloading } = useSelector((state) => state.businesses);

  const { businessId } = useParams();
  
  const totalProducts = productsMeta?.totalItems || 0;

  const handleNextPage = (page) => {
    
    if (businessId && page) {
      console.log("Next Page:", page);
      dispatch(getBusinessProducts({ businessId, pageNo: page }));
    }
  };

  const handlePrevPage = (page) => {
    if (businessId && page) {
        console.log("Next Page:", page);
        dispatch(getBusinessProducts({ businessId, pageNo: page }));
      }
  };

  const [open, setOpen] = useState(false);
  const [toRemove, setToRemove] = useState(null);

  const handleClickOpen = (productId) => {
    console.log("Open:code:", productId);
    setToRemove(productId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
   
    console.log("dlete:code:", toRemove);
    dispatch(deleteBusinessProduct({toRemove, business:businessId}))
      .unwrap()
      .then(() => {
          showToast("SUCCESS", "Product deleted successfully!");
      })
      .catch(() => {
          showToast("ERROR", "Failed to delete product!");
      })
      .finally(() => {
        setOpen(false);
        setToRemove(null);
      }); 
  };



  useEffect(() => {
    console.log("getting products.....");
   
    dispatch(getBusinessProducts({ businessId }));
  }, [dispatch]);

  if(isloading){
    return <Loader/>
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5">
    
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          {/* <IconButton component={Link} to="../dashboard" color="primary">
            <ArrowBackIcon />
          </IconButton> */}
          <Typography variant="h4" sx={{ color: "#603F26", fontWeight: "bold" }}>
            Products
          </Typography>
        </Box>

        {/* Stats and Actions */}
        <Box
          sx={{
            px: { xs: 2, md: 4, lg: 6 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
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
                {String(totalProducts).padStart(2, "0")}
              </Typography>
              <Typography variant="body2">Total Products</Typography>
            </Paper>
          </Box>

          {/* <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              component={Link}
              to="../addProduct"
            >
              Add Product
            </Button>
          </Box> */}
        </Box>

       
        <div className="w-full px-4 md:px-8 lg:px-12 mt-4 flex-grow">
          {!businessProducts || businessProducts .length === 0 ? (
            <div className="text-3xl font-bold flex justify-center">
              No Products found
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden xl:block">
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="products table">
                    <TableHead sx={{ backgroundColor: "#603F26" }}>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Product
                        </TableCell>
                        {/* <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Branch
                        </TableCell> */}
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Category
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Price
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Quantity
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                          align="center"
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {businessProducts .map((product, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>{product.title}</TableCell>
                          {/* <TableCell>{product?.branch ? product?.branch : 'Not Assigned'}</TableCell> */}
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.price}</TableCell>
                          <TableCell>{product.totalQuantity}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Tooltip title="View Product">
                                <IconButton
                                  component={Link}
                                  to={`../viewProduct/${product._id}/${product.title}`}
                                  color="primary"
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              {/* <Tooltip title="Edit Product">
                                <IconButton
                                  component={Link}
                                  to={`../updateProduct/${product._id}`}
                                  color="primary"
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip> */}
                              <Tooltip title="Delete Product">
                                <IconButton
                                  onClick={() => handleClickOpen(product._id)}
                                  color="error"
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
                {businessProducts .map((product, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow"
                  >
                    <div className="space-y-2">
                      <p className="font-bold">{product.title}</p>
                      {/* <p>Branch: {product?.branch ? product?.branch : 'Not Assigned'}</p> */}
                      <p>Category: {product.category}</p>
                      <p>Price: {product.price}</p>
                      <p>Quantity: {product.totalQuantity}</p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="contained"
                        component={Link}
                        to={`../viewProduct/${product._id}/${product.title}`}
                        fullWidth
                      >
                        View
                      </Button>
                      {/* <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={`../updateProduct/${product._id}`}
                        fullWidth
                      >
                        Edit
                      </Button> */}
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleClickOpen(product._id)}
                        fullWidth
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {productsMeta?.nextPage || productsMeta?.previousPage ? (
          <nav className="w-full flex justify-center items-center my-16">
            <ul className="inline-flex items-center -space-x-px text-sm">
              {productsMeta?.previousPage && (
                <>
                  <li 
                    onClick={() => handlePrevPage(productsMeta?.previousPage)}
                    className="px-4 py-2 border rounded-l hover:bg-gray-100 cursor-pointer"
                  >
                    Previous
                  </li>
                  <li 
                    onClick={() => handlePrevPage(productsMeta?.previousPage)}
                    className="px-4 py-2 border hover:bg-gray-100 cursor-pointer"
                  >
                    {productsMeta?.previousPage}
                  </li>
                </>
              )}
              <li className="px-4 py-2 bg-[#603F26] text-white border">
                {productsMeta?.currentPage}
              </li>
              {productsMeta?.nextPage && (
                <>
                  <li 
                    onClick={() => handleNextPage(productsMeta?.nextPage)}
                    className="px-4 py-2 border hover:bg-gray-100 cursor-pointer"
                  >
                    {productsMeta?.nextPage}
                  </li>
                  <li 
                    onClick={() => handleNextPage(productsMeta?.nextPage)}
                    className="px-4 py-2 border rounded-r hover:bg-gray-100 cursor-pointer"
                  >
                    Next
                  </li>
                </>
              )}
            </ul>
          </nav>
        ) : null}

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={open} 
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle className="text-red-600">Delete Product</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default BusinessProducts;






