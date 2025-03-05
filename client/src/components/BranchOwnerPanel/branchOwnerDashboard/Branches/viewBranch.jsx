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

const ViewBranch = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { branchProducts, branchMeta } = useSelector((state) => state.branches);
  
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
    console.log("delete:code:", toRemove);
    dispatch(removeBranchProduct({ toRemove, branchId: id }))
      .unwrap()
      .finally(() => {
        setOpen(false);
        setToRemove(null);
      });
  };

  useEffect(() => {
    dispatch(getBranchProducts({ branchId: id }));
  }, [dispatch, id]);

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5">
        {/* Header */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton component={Link} to="../branchesList" color="primary">
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

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              component={Link}
              to={`../assignProduct/${code}`}
            >
              Add Product
            </Button>
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
                                  to={`../viewBranchProduct/${product._id}/${product.title}`}
                                  color="primary"
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
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

export default ViewBranch;



// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { FaArrowLeft } from "react-icons/fa";

// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";

// import { getBranches, removeBranch } from "../../../../store/actions/branches";

// import Button from "@mui/material/Button";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";

// import { GrFormView } from "react-icons/gr";
// import { MdEdit } from "react-icons/md";
// import { FaTrash } from "react-icons/fa";

// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import CircularProgress from "@mui/material/CircularProgress";

// import {removeBranchProduct } from "../../../../store/actions/products";
// import { getBranchProducts } from "../../../../store/actions/branches";
// import { Loader } from "../../../../tools";

// const ViewBranch = () => {
//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => state.auth);

//   const { branchProducts, branchMeta } = useSelector((state) => state.branches);

//   const totalProducts = branchMeta?.totalItems || 0;

//   const { id, name, code } = useParams();

//   const handleNextPage = (page) => {
//         const business = user?.business;
//         if (business && page) {
//           console.log("Next Page:", page);
//           dispatch(getBranchProducts({ branchId: id, pageNo: page }));
//         }
//       };
  
//       const handlePrevPage = (page) => {
//         const business = user?.business;
//         if (business && page) {
//           console.log("Previous Page:", page);
//           dispatch(getBranchProducts({ branchId: id, pageNo: page }));
//         }
//       };
  
//       const [open, setOpen] = useState(false);
//       const [toRemove, setToRemove] = useState(null);
  
//       const handleClickOpen = (productId) => {
//         console.log("Open:code:", productId);
//         setToRemove(productId);
//         setOpen(true);
//       };
  
//       const handleClose = () => {
//         setOpen(false);
//       };
  
//       const handleDelete = () => {
        
//       console.log("dlete:code:", toRemove);
//        dispatch(removeBranchProduct({toRemove, branchId: id  }))
//           .unwrap()
//           .finally(() => {
//             setOpen(false);
//             setToRemove(null);
//           }); 
//       };




//   console.log("ID:", id);
//   console.log("name:", name);


//   useEffect(() => {
//     dispatch(getBranchProducts({ branchId: id }));
//   }, []);

//   return (
//     <div className="relative bg-gray-50 flex flex-col pt-5">
//       <div className="mb-6 flex items-center space-x-3 ml-2 md:ml-8 lg:ml-12">
//         <Link to="../branchesList">
//           <FaArrowLeft className="text-[#603F26] text-xl cursor-pointer" />
//         </Link>
//         <h1 className="font-bold text-2xl text-[#603F26]">{name}</h1>
//       </div>

//       <div className="w-full flex justify-between items-center px-4 md:px-8 lg:px-12">
//         <div className="border border-[#603F26] bg-[#603F26] p-2 w-32 rounded-lg text-white">
//           <span className="font-semibold text-2xl">
//             {totalProducts < 10 ? 0 : null}
//             {totalProducts}
//           </span>
//           <h3 className="text-[14px] font-medium">Total Products</h3>
//         </div>

//         <div className="">
//           <Button
//             variant="contained"
//             color="primary"
//             size="small"
//             component={Link}
//             to={`../assignProduct/${code}`}
//             sx={{
//               textTransform: "none",
//               width: "120px",
//               fontSize: "16px",
//               fontWeight: "semi-bold",
//               backgroundColor: "#603F26",
//             }}
//           >
//             Add Product
//           </Button>
//         </div>

//       </div>

//       <div className="w-full px-4 md:px-8 lg:px-12 mt-10 flex-grow">
//         {!branchProducts || branchProducts.length === 0 ? (
//           <div className="text-3xl font-bold flex justify-center">
           
//           </div>
//         ) : (
//           <>
//             <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden xl:block">
//               <TableContainer component={Paper}>
//                 <Table sx={{ minWidth: 650 }} aria-label="simple table">
//                   <TableHead sx={{ backgroundColor: "#603F26" }}>
//                     <TableRow>
//                       <TableCell
//                         sx={{
//                           color: "white",
//                           fontSize: "16px",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         Product
//                       </TableCell>
//                       <TableCell
//                         align="left"
//                         sx={{
//                           color: "white",
//                           fontSize: "16px",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         Branch
//                       </TableCell>
//                       <TableCell
//                         align="left"
//                         sx={{
//                           color: "white",
//                           fontSize: "16px",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         Category
//                       </TableCell>
//                       <TableCell
//                         align="left"
//                         sx={{
//                           color: "white",
//                           fontSize: "16px",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         Price
//                       </TableCell>
//                       <TableCell
//                         align="left"
//                         sx={{
//                           color: "white",
//                           fontSize: "16px",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         Quantity
//                       </TableCell>

//                       <TableCell
//                         align="center"
//                         sx={{
//                           color: "white",
//                           fontSize: "16px",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         Action
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {branchProducts.map((product, index) => (
//                       <TableRow
//                         key={index}
//                         sx={{
//                           "&:last-child td, &:last-child th": { border: 0 },
//                         }}
//                       >
//                         <TableCell component="th" scope="row">
//                           {product.title}
//                         </TableCell>
//                         <TableCell align="left">{product.branch}</TableCell>
//                         <TableCell align="left">{product.category}</TableCell>
//                         <TableCell align="left">{product.price}</TableCell>
//                         <TableCell align="left">{product.remainingQuantity}</TableCell>

//                         <TableCell align="left">
//                           <div className="flex items-center justify-center gap-3">
//                             <Link to={`../viewBranchProduct/${product._id}/${product.title}`}>
//                               <GrFormView
//                                 className="text-[18px]"
//                                 style={{ color: "green" }}
//                               />
//                             </Link>
//                             {/* <Link to={``}>
//                               <MdEdit
//                                 className="text-[16px]"
//                                 style={{ color: "blue" }}
//                               />
//                             </Link> */}
//                             <Link onClick={() => handleClickOpen(product?._id)}>
//                               <FaTrash
//                                 className="text-[13px]"
//                                 style={{ color: "red" }}
//                               />
//                             </Link>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </div>

            
//             <div className="block xl:hidden">
//               {branchProducts.map((product, index) => (
//                 <div
//                   key={index}
//                   className="mb-4 bg-white p-4 rounded-lg shadow-md border border-gray-300"
//                 >
//                   <p className="text-sm font-medium text-gray-900">
//                     <span className="font-bold">Product:</span> {product.title}
//                   </p>
//                   <p className="text-sm font-medium text-gray-900">
//                     <span className="font-bold">Branch:</span> {product.branch}
//                   </p>
//                   <p className="text-sm font-medium text-gray-900">
//                     <span className="font-bold">Category:</span> {product.category}
//                   </p>
//                   <p className="text-sm font-medium text-gray-900">
//                     <span className="font-bold">Price:</span> {product.price}
//                   </p>
//                   <p className="text-sm font-medium text-gray-900">
//                     <span className="font-bold">Quantity:</span>{product.remainingQuantity}
                   
//                   </p>

//                   <div className="mt-3 flex items-center gap-5">
//                     <Link to={`../viewBranchProduct/${product._id}/${product.title}`} 
//                       className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition duration-200">
//                       View
//                     </Link>

//                     {/* <Link
//                       to="../updateProduct"
//                       className="text-green-600 font-semibold hover:underline hover:text-green-800 transition duration-200"
//                     >
//                       Update
//                     </Link> */}
//                     <Link
//                       onClick={() => handleClickOpen(product._id)}
//                       className="text-red-600 font-semibold hover:underline hover:text-red-800 transition duration-200"
//                     >
//                       Delete
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>

//       {branchMeta?.nextPage || branchMeta?.previousPage ? 
//         <nav
//           aria-label="Page navigation example"
//           className="w-full flex justify-center items-center my-16"
//         >
//           <ul className="inline-flex items-center -space-x-px text-sm">
//             {branchMeta?.previousPage && (
//               <>
//                 <li
//                   onClick={() => handlePrevPage(branchMeta?.previousPage)}
//                   className="flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-l-md shadow-sm hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
//                 >
//                   Previous
//                 </li>
//                 <li
//                   onClick={() => handlePrevPage(branchMeta?.previousPage)}
//                   className="flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
//                 >
//                   {branchMeta?.previousPage}
//                 </li>
//               </>
//             )}

//             <li className="flex items-center justify-center px-4 py-2 text-white bg-[#603F26] border border-[#603F26] shadow-md font-bold cursor-default rounded-md">
//               {branchMeta?.currentPage}
//             </li>

//             {branchMeta?.nextPage && (
//               <>
//                 <li
//                   onClick={() => handleNextPage(branchMeta?.nextPage)}
//                   className="flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
//                 >
//                   {branchMeta?.nextPage}
//                 </li>
//                 <li
//                   onClick={() => handleNextPage(branchMeta?.nextPage)}
//                   className="flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-r-md shadow-sm hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
//                 >
//                   Next
//                 </li>
//               </>
//             )}
//           </ul>
//         </nav>
//         : null
//       }

//       <div>
//         <Dialog
//           open={open}
//           onClose={handleClose}
//           aria-labelledby="alert-dialog-title"
//           aria-describedby="alert-dialog-description"
//         >
//           <DialogTitle id="alert-dialog-title">
//             {" Are you really sure ?"}
//           </DialogTitle>
//           <DialogContent>
//             <DialogContentText id="alert-dialog-description">
//               There is no going back.
//             </DialogContentText>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleClose}>Oops, close this.</Button>
//             <Button onClick={handleDelete} autoFocus>
//               Delete
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </div>
 
//     </div>
//   );
// };

// export default ViewBranch;
