import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getBranches, removeBranch } from "../../../../store/actions/branches";
import { Loader, showToast } from "../../../../tools";

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
  Chip,
  IconButton,
  Tooltip,
  Grid
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Icons
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

const ListBranches = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { branches, meta, isloading } = useSelector((state) => state.branches);

  const totalBranches = meta?.totalItems || 0;

  const handleNextPage = (page) => {
    const business = user?.business;
    if (business && page) {
      dispatch(getBranches({ business, pageNo: page }));
    }
  };

  const handlePrevPage = (page) => {
    const business = user?.business;
    if (business && page) {
      dispatch(getBranches({ business, pageNo: page }));
    }
  };

  const [open, setOpen] = useState(false);
  const [toRemove, setToRemove] = useState(null);

  const handleClickOpen = (branchCode) => {
    setToRemove(branchCode);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    const business = user?.business;
    dispatch(removeBranch({ toRemove, business }))
      .unwrap()
      .then(() => {
        showToast("SUCCESS", "Branch deleted successfully!");
      })
      .catch(() => {
        showToast("ERROR", "Failed to delete branch!");
      })
      .finally(() => {
        setOpen(false);
        setToRemove(null);
      });
  };

  useEffect(() => {
    const business = user?.business;
    dispatch(getBranches({ business }));
  }, [dispatch, user]);

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
            Branches
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
                {String(totalBranches).padStart(2, "0")}
              </Typography>
              <Typography variant="body2">Total Branches</Typography>
            </Paper>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              component={Link}
              to="../addBranch"
            >
              Add Branch
            </Button>
          </Box>
        </Box>

        {/* Branches Content */}
        <div className="w-full px-4 md:px-8 lg:px-12 mt-4 flex-grow">
          {!branches || branches.length === 0 ? (
            <div className="text-3xl font-bold flex justify-center">
              No Branches found
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden xl:block">
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="branches table">
                    <TableHead sx={{ backgroundColor: "#603F26" }}>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Code
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Name
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          City
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Address
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Contact
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Email
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Salesperson
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
                      {branches.map((branch, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>{branch.branchCode}</TableCell>
                          <TableCell>{branch.name}</TableCell>
                          <TableCell>{branch.city}</TableCell>
                          <TableCell>{branch.address}</TableCell>
                          <TableCell>{branch.contactNo}</TableCell>
                          <TableCell>{branch.emailAddress}</TableCell>
                          <TableCell>
                            {branch?.salesperson?.name || "Not Assigned"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Tooltip title="View Branch">
                                <IconButton
                                  component={Link}
                                  to={`../viewbranch/${branch._id}/${branch.name}/${branch.branchCode}`}
                                  color="primary"
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Branch">
                                <IconButton
                                  component={Link}
                                  to={`../updatebranch/${branch._id}`}
                                  color="primary"
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Branch">
                                <IconButton
                                  onClick={() => handleClickOpen(branch.branchCode)}
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
                {branches.map((branch, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold">{branch.branchCode}</p>
                        <p>{branch.name}</p>
                      </div>
                      <Chip
                        label={branch.city}
                        color="primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <p>Address: {branch.address}</p>
                      <p>Contact: {branch.contactNo}</p>
                      <p>Email: {branch.emailAddress}</p>
                      <p>Salesperson: {branch?.salesperson?.name || "Not Assigned"}</p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="contained"
                        component={Link}
                        to={`../viewbranch/${branch._id}/${branch.name}/${branch.branchCode}`}
                        fullWidth
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        component={Link}
                        to={`../updatebranch/${branch._id}`}
                        fullWidth
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleClickOpen(branch.branchCode)}
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

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={open} 
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle className="text-red-600">Delete Branch</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this branch? This action cannot be undone.
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

export default ListBranches;






// import axios from "axios";
// import React, { useEffect, useState } from "react";
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

// import { getAllBranches } from "../../../../store/actions/branches";
// import { Loader } from "../../../../tools";




// const ListBranches = () => {
//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => state.auth);

//   const { branches, meta, isloading } = useSelector((state) => state.branches);

//   const totalBranches = meta?.totalItems || 0;

//   console.log("id:", user.business);

//   const handleNextPage = (page) => {
//     const business = user?.business;
    
//     if (business && page) {
//       console.log("Next Page:", page);
//       dispatch(getBranches({ business, pageNo: page }));
//     }
//   };

//   const handlePrevPage = (page) => {
//     const business = user?.business;
//     if (business && page) {
//       console.log("Previous Page:", page);
//       dispatch(getBranches({ business, pageNo: page }));
//     }
//   };

//   const [open, setOpen] = useState(false);
//   const [toRemove, setToRemove] = useState(null);

//   const handleClickOpen = (branchCode) => {
//     console.log("Open:code:", branchCode);
//     setToRemove(branchCode);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleDelete = () => {
//     const business = user?.business;
//     console.log("dlete:code:", toRemove);
//     dispatch(removeBranch({ toRemove, business }))
//       .unwrap()
//       .finally(() => {
//         setOpen(false);
//         setToRemove(null);
//       });
//   };

//   useEffect(() => {
//     console.log("getting.....");
//     const business = user?.business;
//     dispatch(getBranches({ business }));

//   }, []);



//   if(isloading){

//     return <Loader/>

//     // return (
//     //   <div className="text-center mt-28">
//     //     <CircularProgress />
//     //   </div>
//     // );
//   }


//   return (
//     <div className="relative bg-gray-50 flex flex-col pt-5">
//       <div className="mb-4 pl-4 md:pl-8 lg:pl-12">
//         <h1 className="text-[#603F26] font-bold text-2xl">Branches</h1>
//       </div>

//       <div className="w-full flex justify-between items-center px-4 md:px-8 lg:px-12">
//         <div className="border border-[#603F26] bg-[#603F26] p-2 w-32 rounded-lg text-white">
//           <span className="font-semibold text-2xl">
//             {totalBranches < 10 ? 0 : null}
//             {totalBranches}
//           </span>
//           <h3 className="text-[14px] font-medium">Total Branches</h3>
//         </div>
//         <div className="">
//           <Button
//             variant="contained"
//             color="primary"
//             size="small"
//             component={Link}
//             to="../addBranch"
//             sx={{
//               textTransform: "none",
//               width: "120px",
//               fontSize: "16px",
//               fontWeight: "semi-bold",
//               backgroundColor: "#603F26",
//             }}
//           >
//             Add Branch
//           </Button>
//         </div>
//       </div>

//       <div className="w-full px-4 md:px-8 lg:px-12 mt-10 flex-grow">
//         {!branches || branches.length === 0 ?
//           <div className="text-3xl font-bold flex justify-center">No Branches found</div>
//         : 
//           <>
//             <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden xl:block">
//           <TableContainer component={Paper}>
//             <Table sx={{ minWidth: 650 }} aria-label="simple table">
//               <TableHead sx={{ backgroundColor: "#603F26" }}>
//                 <TableRow>
//                   <TableCell sx={{ color: "white", fontSize: '16px', fontWeight: 'bold' }}>Code</TableCell>
//                   <TableCell align="left" sx={{ color: "white" , fontSize: '16px', fontWeight: 'bold'}}>
//                     Name
//                   </TableCell>
//                   <TableCell align="left" sx={{ color: "white" , fontSize: '16px', fontWeight: 'bold'}}>
//                     City
//                   </TableCell>
//                   <TableCell align="left" sx={{ color: "white" , fontSize: '16px', fontWeight: 'bold'}}>
//                     Address
//                   </TableCell>
//                   <TableCell align="left" sx={{ color: "white" , fontSize: '16px', fontWeight: 'bold'}}>
//                     Contact
//                   </TableCell>
//                   <TableCell align="left" sx={{ color: "white" , fontSize: '16px', fontWeight: 'bold'}}>
//                     Email
//                   </TableCell>
//                   <TableCell align="left" sx={{ color: "white" , fontSize: '16px', fontWeight: 'bold'}}>
//                     Salesperson
//                   </TableCell>
//                   <TableCell align="left" sx={{ color: "white" , fontSize: '16px', fontWeight: 'bold'}}>
//                     Action
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {branches.map((branch, index) => (
//                   <TableRow
//                     key={index}
//                     sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//                   >
//                     <TableCell component="th" scope="row">
//                       {branch.branchCode}
//                     </TableCell>
//                     <TableCell align="left">{branch.name}</TableCell>
//                     <TableCell align="left">{branch.city}</TableCell>
//                     <TableCell align="left">{branch.address}</TableCell>
//                     <TableCell align="left">{branch.contactNo}</TableCell>
//                     <TableCell align="left">{branch.emailAddress}</TableCell>
//                     <TableCell align="left">
//                       {branch?.salesperson?.name || "Not Assigned"}
//                     </TableCell>
//                     <TableCell align="left">
//                       <div className="flex items-center justify-center gap-3">
//                         <Link to={`../viewbranch/${branch._id}/${branch.name}/${branch.branchCode}`}>
//                           <GrFormView
//                             className="text-[18px]"
//                             style={{ color: "green" }}
//                           />
//                         </Link>
//                         <Link to={`../updatebranch/${branch._id}`}>
//                           <MdEdit
//                             className="text-[16px]"
//                             style={{ color: "blue" }}
//                           />
//                         </Link>
//                         <Link
//                           onClick={() => handleClickOpen(branch.branchCode)}
//                         >
//                           <FaTrash
//                             className="text-[13px]"
//                             style={{ color: "red" }}
//                           />
//                         </Link>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </div>

      

//         {/* Card View for Small Screens */}
//         <div className="block xl:hidden">
//           {branches.map((branch, index) => (
//             <div
//               key={index}
//               className="mb-4 bg-white p-4 rounded-lg shadow-md border border-gray-300"
//             >
//               <p className="text-sm font-medium text-gray-900">
//                 <span className="font-bold">Code:</span> {branch.branchCode}
//               </p>
//               <p className="text-sm font-medium text-gray-900">
//                 <span className="font-bold">Name:</span> {branch.name}
//               </p>
//               <p className="text-sm font-medium text-gray-900">
//                 <span className="font-bold">City:</span> {branch.city}
//               </p>
//               <p className="text-sm font-medium text-gray-900">
//                 <span className="font-bold">Address:</span> {branch.address}
//               </p>
//               <p className="text-sm font-medium text-gray-900">
//                 <span className="font-bold">Contact:</span> {branch.contactNo}
//               </p>
//               <p className="text-sm font-medium text-gray-900">
//                 <span className="font-bold">Email:</span> {branch.emailAddress}
//               </p>
//               <p className="text-sm font-medium text-gray-900">
//                 <span className="font-bold">Salesperson:</span>{" "}
//                 {branch?.salesperson?.name || "Not Assigned"}
//               </p>
//               <div className="mt-3 flex items-center gap-5">
//                 <Link className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition duration-200">
//                   View
//                 </Link>
//                 <Link to='../updatebranch'
//                 className="text-green-600 font-semibold hover:underline hover:text-green-800 transition duration-200">
//                   Update
//                 </Link>
//                 <Link
//                   onClick={() => handleClickOpen(branch.branchCode)}
//                   className="text-red-600 font-semibold hover:underline hover:text-red-800 transition duration-200"
//                 >
//                   Delete
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
          
//           </>
        

//         }

//       </div>

//       {meta?.nextPage || meta?.previousPage ? 
//         <nav
//           aria-label="Page navigation example"
//           className="w-full flex justify-center items-center my-16"
//         >
//           <ul className="inline-flex items-center -space-x-px text-sm">
//             {meta?.previousPage && (
//               <>
//                 <li
//                   onClick={() => handlePrevPage(meta?.previousPage)}
//                   className="flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-l-md shadow-sm hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
//                 >
//                   Previous
//                 </li>
//                 <li
//                   onClick={() => handlePrevPage(meta?.previousPage)}
//                   className="flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
//                 >
//                   {meta?.previousPage}
//                 </li>
//               </>
//             )}

//             <li className="flex items-center justify-center px-4 py-2 text-white bg-[#603F26] border border-[#603F26] shadow-md font-bold cursor-default rounded-md">
//               {meta?.currentPage}
//             </li>

//             {meta?.nextPage && (
//               <>
//                 <li
//                   onClick={() => handleNextPage(meta?.nextPage)}
//                   className="flex items-center justify-center px-4 py-2 text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
//                 >
//                   {meta?.nextPage}
//                 </li>
//                 <li
//                   onClick={() => handleNextPage(meta?.nextPage)}
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

// export default ListBranches;
