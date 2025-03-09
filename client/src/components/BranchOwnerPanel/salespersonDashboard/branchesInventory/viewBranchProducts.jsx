import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getBranchProducts } from "../../../../store/actions/branches";
import { removeBranchProduct } from "../../../../store/actions/products";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Loader } from "../../../../tools";

// Material UI Components
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

const ViewBranchProducts = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { branchProducts, branchMeta, isloading } = useSelector((state) => state.branches);
  
  const totalProducts = branchMeta?.totalItems || 0;

 const { id, name, code } = useParams();

  const handleNextPage = (page) => {
    const business = user?.business;
    if (business && page) {
      console.log("Next Page:", page);
      dispatch(getBranchProducts({ branchId: id, pageNo: page }));
    }
  };

  const handlePrevPage = (page) => {
    const business = user?.business;
    if (business && page) {
      console.log("Previous Page:", page);
      dispatch(getBranchProducts({ branchId: id, pageNo: page }));
    }
  };

  

  useEffect(() => {
    dispatch(getBranchProducts({ branchId: id }));
  }, [dispatch, id]);


  if(isloading){
    return <Loader />
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5">
        {/* Header */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton component={Link} to="../branchesInventory" color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ color: "#603F26", fontWeight: "bold" }}>
            {name}
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

          
        </Box>

        {/* Products Content */}
        <div className="w-full px-4 md:px-8 lg:px-12 mt-4 flex-grow">
          {!branchProducts || branchProducts.length === 0 ? (
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
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Branch
                        </TableCell>
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
                      {branchProducts.map((product, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>{product.title}</TableCell>
                          <TableCell>{product.branch}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.price}</TableCell>
                          <TableCell>{product.totalBranchQuantity}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Tooltip title="View Product">
                                <IconButton
                                  component={Link}
                                  to={`../viewBranchProduct/${product._id}/${product.title}/${code}`} 
                                  color="primary"
                                >
                                  <VisibilityIcon />
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
                {branchProducts.map((product, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow"
                  >
                    <div className="space-y-2">
                      <p className="font-bold">{product.title}</p>
                      <p>Branch: {product.branch}</p>
                      <p>Category: {product.category}</p>
                      <p>Price: {product.price}</p>
                      <p>Quantity: {product.totalBranchQuantity}</p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="contained"
                        component={Link}
                        to={`../viewBranchProduct/${product._id}/${product.title}`}
                        fullWidth
                      >
                        View
                      </Button>
                     
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {branchMeta?.nextPage || branchMeta?.previousPage ? (
          <nav className="w-full flex justify-center items-center my-16">
            <ul className="inline-flex items-center -space-x-px text-sm">
              {branchMeta?.previousPage && (
                <>
                  <li 
                    onClick={() => handlePrevPage(branchMeta?.previousPage)}
                    className="px-4 py-2 border rounded-l hover:bg-gray-100 cursor-pointer"
                  >
                    Previous
                  </li>
                  <li 
                    onClick={() => handlePrevPage(branchMeta?.previousPage)}
                    className="px-4 py-2 border hover:bg-gray-100 cursor-pointer"
                  >
                    {branchMeta?.previousPage}
                  </li>
                </>
              )}
              <li className="px-4 py-2 bg-[#603F26] text-white border">
                {branchMeta?.currentPage}
              </li>
              {branchMeta?.nextPage && (
                <>
                  <li 
                    onClick={() => handleNextPage(branchMeta?.nextPage)}
                    className="px-4 py-2 border hover:bg-gray-100 cursor-pointer"
                  >
                    {branchMeta?.nextPage}
                  </li>
                  <li 
                    onClick={() => handleNextPage(branchMeta?.nextPage)}
                    className="px-4 py-2 border rounded-r hover:bg-gray-100 cursor-pointer"
                  >
                    Next
                  </li>
                </>
              )}
            </ul>
          </nav>
        ) : null}

      </div>
    </ThemeProvider>
  );
};

export default ViewBranchProducts;




