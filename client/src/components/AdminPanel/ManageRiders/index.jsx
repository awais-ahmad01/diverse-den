// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { showToast } from "../../../tools";
// import { getAllRiders, approveRider, rejectRider, deleteRider } from "../../../store/actions/rider";
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
//   Typography,
//   Grid,
//   Chip,
//   Divider,
//   IconButton,
//   Tooltip,
//   TextField,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Loader } from "../../../tools";
// import { format, set } from "date-fns";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CancelIcon from "@mui/icons-material/Cancel";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import SearchIcon from "@mui/icons-material/Search";
// import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
// import ImageIcon from "@mui/icons-material/Image";
// import DeleteIcon from "@mui/icons-material/Delete";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#603F26",
//     },
//   },
// });

// // Helper function to format date
// const formatDate = (dateString) => {
//   try {
//     return format(new Date(dateString), "PPP");
//   } catch (error) {
//     return dateString;
//   }
// };

// // Dialog for showing rider details
// const RiderDetailsDialog = ({ open, onClose, rider }) => {
//   if (!rider) return null;

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle className="bg-[#603F26] text-white">
//         Rider Details - {rider.riderId.slice(-6)}
//       </DialogTitle>
//       <DialogContent className="mt-4">
//         <Grid container spacing={3}>
//           {/* Personal Information */}
//           <Grid item xs={12}>
//             <h3 className="text-lg font-bold mb-2">
//               Personal Information
//             </h3>
//             <p>Name: {rider.name}</p>
//             <p>Contact: {rider.contactNo}</p>
//             <p>City: {rider.city}</p>
//             <p>Bike Number: {rider.bikeNo}</p>
//             <p>CNIC: {rider.CNIC}</p>
//           </Grid>

//           {/* Account Information */}
//           <Grid item xs={12}>
//             <hr className="my-4" />
//             <h3 className="text-lg font-bold mb-2">
//               Account Information
//             </h3>
//             <p>
//               Status: 
//               <Chip
//                 label={rider.status}
//                 color={
//                   rider.status === "Approved" 
//                     ? "success" 
//                     : rider.status === "Rejected" 
//                     ? "error" 
//                     : "warning"
//                 }
//                 className="ml-2"
//               />
//             </p>
//             <p>
//               Is Approved: 
//               <Chip
//                 label={rider.isApproved ? "Yes" : "No"}
//                 color={rider.isApproved ? "success" : "error"}
//                 className="ml-2"
//               />
//             </p>
//             <p>
//               Registration Date: {formatDate(rider.createdAt)}
//             </p>
//             <p>
//               Last Updated: {formatDate(rider.updatedAt)}
//             </p>
//           </Grid>

//           {/* Document Preview Links */}
//           <Grid item xs={12}>
//             <hr className="my-4" />
//             <h3 className="text-lg font-bold mb-2">
//               Documents
//             </h3>
//             <div className="flex flex-wrap gap-4">
//               <Button 
//                 variant="outlined" 
//                 color="primary"
//                 startIcon={<ImageIcon />}
//                 href={rider.CNICFrontPath}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 CNIC Front
//               </Button>
//               <Button 
//                 variant="outlined" 
//                 color="primary"
//                 startIcon={<ImageIcon />}
//                 href={rider.CNICBackPath}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 CNIC Back
//               </Button>
//               <Button 
//                 variant="outlined" 
//                 color="primary"
//                 startIcon={<DocumentScannerIcon />}
//                 href={rider.motorcycleDocPath}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 Motorcycle Document
//               </Button>
//             </div>
//           </Grid>
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

// // Dialog for status confirmation
// const StatusConfirmationDialog = ({
//   open,
//   onClose,
//   onConfirm,
//   riderName,
//   actionType,
// }) => {
//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle className={actionType === "approve" ? "text-green-600" : "text-red-600"}>
//         {actionType === "approve" ? "Approve" : "Reject"} Rider
//       </DialogTitle>
//       <DialogContent>
//         <DialogContentText>
//           Are you sure you want to {actionType} rider {riderName}? This action
//           will change their status.
//         </DialogContentText>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="primary">
//           Cancel
//         </Button>
//         <Button 
//           onClick={onConfirm} 
//           color={actionType === "approve" ? "success" : "error"} 
//           variant="contained"
//         >
//           {actionType === "approve" ? "Approve" : "Reject"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };



// // Add this component near your other dialog components
// const DeleteConfirmationDialog = ({
//     open,
//     onClose,
//     onConfirm,
//     riderName,
//   }) => {
//     return (
//       <Dialog open={open} onClose={onClose}>
//         <DialogTitle className="text-red-600">Delete Rider</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete rider {riderName}? This action
//             cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={onClose} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={onConfirm} color="error" variant="contained">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     );
//   };

// // Dialog for displaying images
// const ImageViewDialog = ({ open, onClose, imageUrl, title }) => {
//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle className="bg-[#603F26] text-white">
//         {title}
//       </DialogTitle>
//       <DialogContent className="flex justify-center">
//         <img 
//           src={imageUrl} 
//           alt={title} 
//           className="max-w-full max-h-[500px] object-contain my-4" 
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="primary">
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// const ManageRiders = () => {
//   const dispatch = useDispatch();
//   const { allRiders, isloading } = useSelector((state) => state.rider);

//   useEffect(() => {
//     dispatch(getAllRiders());
//   }, [dispatch]);
  

//   const [viewRiderDetails, setViewRiderDetails] = useState(null);
//   const [statusAction, setStatusAction] = useState(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [filteredRiders, setFilteredRiders] = useState([]);
//   const [imageView, setImageView] = useState({ open: false, url: "", title: "" });
//   const [deleteRiderId, setDeleteRiderId] = useState(null);

//   const totalRiders = allRiders?.length || 0;

//   const handleViewDetails = (rider) => {
//     setViewRiderDetails(rider);
//   };

//   const handleViewImage = (url, title) => {
//     setImageView({
//       open: true,
//       url,
//       title
//     });
//   };

//   const handleStatusClick = (riderId, action) => {
//     const rider = allRiders.find(r => r.riderId === riderId);
//     setStatusAction({
//       riderId,
//       riderName: rider?.name,
//       action
//     });
//   };

//   const handleStatusConfirm = async () => {
//     try {
//       if (statusAction.action === "approve") {
//         await dispatch(approveRider({riderId:statusAction.riderId}));
//         showToast("SUCCESS", "Rider approved successfully!");
//       } else {
//         await dispatch(rejectRider({riderId:statusAction.riderId}));
//         showToast("SUCCESS", "Rider rejected successfully!");
//       }
//       // Refresh the riders list after status change
//       dispatch(getAllRiders());
//     } catch (error) {
//       console.error(`Failed to ${statusAction.action} rider:`, error);
//       showToast("ERROR", error.response?.data?.message || `Failed to ${statusAction.action} rider`);
//     } finally {
//       setStatusAction(null);
//     }
//   };



//   // Add this handler
//   const handleDeleteClick = (riderId) => {
//     setDeleteRiderId(riderId);
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       await dispatch(deleteRider({riderId:deleteRiderId}))
//         .unwrap()
//         .then(() => {
//           showToast("SUCCESS", "Rider deleted successfully!");
//           dispatch(getAllRiders()); // Refresh the list
//         })
//         .catch((error) => {
//           showToast("ERROR", error.message || "Failed to delete rider");
//         });
//     } catch (error) {
//       console.error("Failed to delete rider:", error);
//       showToast("ERROR", "Failed to delete rider");
//     } finally {
//       setDeleteRiderId(null);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...allRiders];

//     if (searchQuery) {
//       filtered = filtered.filter(
//         (rider) =>
//           rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           rider.contactNo.includes(searchQuery) ||
//           rider.CNIC.includes(searchQuery) ||
//           rider.bikeNo.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     if (statusFilter) {
//       filtered = filtered.filter((rider) => rider.status === statusFilter);
//     }

//     setFilteredRiders(filtered);
//   };

//   useEffect(() => {
//     if (allRiders) {
//       setFilteredRiders(allRiders);
//     }
//   }, [allRiders]);



//   // Status color mapping
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Approved":
//         return "success";
//       case "Rejected":
//         return "error";
//       case "Pending":
//       default:
//         return "warning";
//     }
//   };

//   if (isloading) {
//     return <Loader />;
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <main className="relative bg-gray-50 flex flex-col pt-5 pb-9">
//         {/* Header */}
//         <header className="px-4 md:px-6 lg:px-12 mb-6">
//           <h1 className="text-3xl font-bold text-[#603F26]">
//             Manage Riders
//           </h1>
//         </header>

//         {/* Stats */}
//         <section className="px-4 md:px-6 lg:px-12 flex justify-between items-center mb-6">
//           <div>
//             <div className="bg-[#603F26] text-white px-6 py-4 rounded-lg">
//               <h2 className="text-3xl font-bold">
//                 {String(totalRiders).padStart(2, "0")}
//               </h2>
//               <p className="text-sm">Total Riders</p>
//             </div>
//           </div>

//           <div className="flex gap-4">
//             <Button
//               variant="outlined"
//               color="primary"
//               startIcon={<FilterListIcon />}
//               onClick={() => setShowFilters(!showFilters)}
//             >
//               {showFilters ? "Hide Filters" : "Show Filters"}
//             </Button>
//           </div>
//         </section>

//         {/* Filters */}
//         {showFilters && (
//           <section className="px-4 md:px-6 lg:px-12 mb-6">
//             <div className="bg-white p-6 rounded-lg shadow">
//               <div className="flex gap-6 flex-wrap">
//                 <TextField
//                   label="Search"
//                   placeholder="Search by name"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   InputProps={{
//                     startAdornment: <SearchIcon sx={{ color: "gray", mr: 1 }} />,
//                   }}
//                 />
//                 <div className="min-w-[200px]">
//                   <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
//                     Status
//                   </label>
//                   <select
//                     id="status-filter"
//                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#603F26]"
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                   >
//                     <option value="">All Statuses</option>
//                     <option value="Pending">Pending</option>
//                     <option value="Approved">Approved</option>
//                     <option value="Rejected">Rejected</option>
//                   </select>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={applyFilters}
//                   >
//                     Apply Filters
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     color="primary"
//                     onClick={() => {
//                       setSearchQuery("");
//                       setStatusFilter("");
//                       setFilteredRiders(allRiders);
//                     }}
//                   >
//                     Clear Filters
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Data Table */}
//         <section className="w-full px-4 md:px-8 lg:px-12 mt-4 flex-grow">
//           {!filteredRiders || filteredRiders.length === 0 ? (
//             <div className="text-3xl font-bold flex justify-center">
//               No Riders found
//             </div>
//           ) : (
//             <>
//               {/* Desktop View */}
//               <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden md:block">
//                 <TableContainer component={Paper}>
//                   <Table sx={{ minWidth: 650 }} aria-label="riders table">
//                     <TableHead sx={{ backgroundColor: "#603F26" }}>
//                       <TableRow>
//                         <TableCell
//                           sx={{
//                             color: "white",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           ID
//                         </TableCell>
//                         <TableCell
//                           sx={{
//                             color: "white",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Name
//                         </TableCell>
//                         <TableCell
//                           sx={{
//                             color: "white",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Contact
//                         </TableCell>
//                         <TableCell
//                           sx={{
//                             color: "white",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Bike No.
//                         </TableCell>
//                         <TableCell
//                           sx={{
//                             color: "white",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           City
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
//                           Registration Date
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
//                       {filteredRiders.map((rider) => (
//                         <TableRow key={rider.riderId}>
//                           <TableCell>{rider.riderId.slice(-6)}</TableCell>
//                           <TableCell>{rider.name}</TableCell>
//                           <TableCell>{rider.contactNo}</TableCell>
//                           <TableCell>{rider.bikeNo}</TableCell>
//                           <TableCell>{rider.city}</TableCell>
//                           <TableCell>
//                             <Chip
//                               label={rider.status}
//                               color={getStatusColor(rider.status)}
//                               size="small"
//                             />
//                           </TableCell>
//                           <TableCell>{formatDate(rider.createdAt)}</TableCell>
//                           <TableCell>
//   <div className="flex gap-2">
//     <Tooltip title="View Details">
//       <IconButton
//         onClick={() => handleViewDetails(rider)}
//         color="primary"
//       >
//         <VisibilityIcon />
//       </IconButton>
//     </Tooltip>

//     {/* Add delete button */}
//     <Tooltip title="Delete Rider">
//       <IconButton
//         onClick={() => handleDeleteClick(rider.riderId)}
//         color="error"
//       >
//         <DeleteIcon />
//       </IconButton>
//     </Tooltip>

//     {rider.status === "Pending" && (
//       <>
//         <Tooltip title="Approve Rider">
//           <IconButton
//             onClick={() => handleStatusClick(rider.riderId, "approve")}
//             color="success"
//           >
//             <CheckCircleIcon />
//           </IconButton>
//         </Tooltip>
//         <Tooltip title="Reject Rider">
//           <IconButton
//             onClick={() => handleStatusClick(rider.riderId, "reject")}
//             color="error"
//           >
//             <CancelIcon />
//           </IconButton>
//         </Tooltip>
//       </>
//     )}
//   </div>
// </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </div>

//               {/* Mobile View */}
//               <div className="block md:hidden space-y-4">
//                 {filteredRiders.map((rider) => (
//                   <article
//                     key={rider.riderId}
//                     className="bg-white p-4 rounded-lg shadow"
//                   >
//                     <div className="flex justify-between items-start mb-3">
//                       <div>
//                         <h3 className="font-bold">{rider.name}</h3>
//                         <p className="text-gray-600">{rider.contactNo}</p>
//                       </div>
//                       <Chip
//                         label={rider.status}
//                         color={getStatusColor(rider.status)}
//                         size="small"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <p>ID: {rider.riderId.slice(-6)}</p>
//                       <p>Bike No: {rider.bikeNo}</p>
//                       <p>City: {rider.city}</p>
//                       <p>Registered: {formatDate(rider.createdAt)}</p>
//                     </div>

//                     <div className="mt-4 flex gap-2">
//   <button
//     className="bg-[#603F26] text-white py-2 px-4 rounded-md flex-1 hover:bg-[#4a3019] transition-colors"
//     onClick={() => handleViewDetails(rider)}
//   >
//     View Details
//   </button>
  
//   <button
//     className="bg-red-600 text-white py-2 px-4 rounded-md flex-1 hover:bg-red-700 transition-colors"
//     onClick={() => handleDeleteClick(rider.riderId)}
//   >
//     Delete
//   </button>

//   {rider.status === "Pending" && (
//     <>
//       <button
//         className="bg-green-600 text-white py-2 px-4 rounded-md flex-1 hover:bg-green-700 transition-colors"
//         onClick={() => handleStatusClick(rider.riderId, "approve")}
//       >
//         Approve
//       </button>
//       <button
//         className="bg-red-600 text-white py-2 px-4 rounded-md flex-1 hover:bg-red-700 transition-colors"
//         onClick={() => handleStatusClick(rider.riderId, "reject")}
//       >
//         Reject
//       </button>
//     </>
//   )}
// </div>
//                   </article>
//                 ))}
//               </div>
//             </>
//           )}
//         </section>

//         {/* Rider Details Dialog */}
//         <RiderDetailsDialog
//           open={!!viewRiderDetails}
//           onClose={() => setViewRiderDetails(null)}
//           rider={viewRiderDetails}
//         />

//         {/* Status Confirmation Dialog */}
//         <StatusConfirmationDialog
//           open={!!statusAction}
//           onClose={() => setStatusAction(null)}
//           onConfirm={handleStatusConfirm}
//           riderName={statusAction?.riderName}
//           actionType={statusAction?.action}
//         />

// <DeleteConfirmationDialog
//   open={!!deleteRiderId}
//   onClose={() => setDeleteRiderId(null)}
//   onConfirm={handleDeleteConfirm}
//   riderName={
//     allRiders.find(rider => rider.riderId === deleteRiderId)?.name
//   }
// />

//         {/* Image View Dialog */}
//         <ImageViewDialog
//           open={imageView.open}
//           onClose={() => setImageView({ open: false, url: "", title: "" })}
//           imageUrl={imageView.url}
//           title={imageView.title}
//         />
//       </main>
//     </ThemeProvider>
//   );
// };

// export default ManageRiders;










import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../tools";
import { getAllRiders, approveRider, rejectRider, deleteRider } from "../../../store/actions/rider";
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
  Grid,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  TextField,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Loader } from "../../../tools";
import { format, set } from "date-fns";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";

const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
  },
});

// Helper function to format date
const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), "PPP");
  } catch (error) {
    return dateString;
  }
};

// Dialog for showing rider details
const RiderDetailsDialog = ({ open, onClose, rider, onViewImage }) => {
  if (!rider) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-[#603F26] text-white">
        Rider Details - {rider.riderId.slice(-6)}
      </DialogTitle>
      <DialogContent className="mt-4">
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12}>
            <h3 className="text-lg font-bold mb-2">
              Personal Information
            </h3>
            <p>Name: {rider.name}</p>
            <p>Contact: {rider.contactNo}</p>
            <p>City: {rider.city}</p>
            <p>Bike Number: {rider.bikeNo}</p>
            <p>CNIC: {rider.CNIC}</p>
          </Grid>

          {/* Account Information */}
          <Grid item xs={12}>
            <hr className="my-4" />
            <h3 className="text-lg font-bold mb-2">
              Account Information
            </h3>
            <p>
              Status: 
              <Chip
                label={rider.status}
                color={
                  rider.status === "Approved" 
                    ? "success" 
                    : rider.status === "Rejected" 
                    ? "error" 
                    : "warning"
                }
                className="ml-2"
              />
            </p>
            <p>
              Is Approved: 
              <Chip
                label={rider.isApproved ? "Yes" : "No"}
                color={rider.isApproved ? "success" : "error"}
                className="ml-2"
              />
            </p>
            <p>
              Registration Date: {formatDate(rider.createdAt)}
            </p>
            <p>
              Last Updated: {formatDate(rider.updatedAt)}
            </p>
          </Grid>

          {/* Document Preview Links */}
          <Grid item xs={12}>
            <hr className="my-4" />
            <h3 className="text-lg font-bold mb-2">
              Documents
            </h3>
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<ImageIcon />}
                onClick={() => onViewImage(rider.CNICFrontPath, "CNIC Front")}
              >
                CNIC Front
              </Button>
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<ImageIcon />}
                onClick={() => onViewImage(rider.CNICBackPath, "CNIC Back")}
              >
                CNIC Back
              </Button>
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<DocumentScannerIcon />}
                onClick={() => onViewImage(rider?.motorCycleDocPath, "Motorcycle Document")}
              >
                Motorcycle Document
              </Button>
            </div>
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

// Dialog for status confirmation
const StatusConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  riderName,
  actionType,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className={actionType === "approve" ? "text-green-600" : "text-red-600"}>
        {actionType === "approve" ? "Approve" : "Reject"} Rider
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to {actionType} rider {riderName}? This action
          will change their status.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          color={actionType === "approve" ? "success" : "error"} 
          variant="contained"
        >
          {actionType === "approve" ? "Approve" : "Reject"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  riderName,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="text-red-600">Delete Rider</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete rider {riderName}? This action
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

// Dialog for displaying images
const ImageViewDialog = ({ open, onClose, imageUrl, title }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-[#603F26] text-white">
        {title}
      </DialogTitle>
      <DialogContent className="flex justify-center">
        {imageUrl ? (
          imageUrl.endsWith('.pdf') ? (
            <iframe 
              src={imageUrl} 
              title={title}
              width="100%" 
              height="500px"
              className="my-4"
            />
          ) : (
            <img 
              src={imageUrl} 
              alt={title} 
              className="max-w-full max-h-[500px] object-contain my-4" 
            />
          )
        ) : (
          <Typography variant="body1" className="my-4">
            Document not available
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ManageRiders = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { allRiders, meta, isloading } = useSelector((state) => state.rider);


  useEffect(() => {
    dispatch(getAllRiders({}));
  }, [user,dispatch]);
  
  const [viewRiderDetails, setViewRiderDetails] = useState(null);
  const [statusAction, setStatusAction] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredRiders, setFilteredRiders] = useState([]);
  const [imageView, setImageView] = useState({ open: false, url: "", title: "" });
  const [deleteRiderId, setDeleteRiderId] = useState(null);

  const totalRiders = meta?.totalItems || 0;


   const handleNextPage = (page) => {
      
      if (page) {
        console.log("Next Page:", page);
        dispatch(getAllRiders({pageNo: page }));
      }
    };
  
    const handlePrevPage = (page) => {
      if (page) {
          console.log("Next Page:", page);
          dispatch(getAllRiders({pageNo: page }));
        }
    };



  const handleViewDetails = (rider) => {
    setViewRiderDetails(rider);
  };

  const handleViewImage = (url, title) => {
    setImageView({
      open: true,
      url,
      title
    });
  };

  const handleStatusClick = (riderId, action) => {
    const rider = allRiders.find(r => r.riderId === riderId);
    setStatusAction({
      riderId,
      riderName: rider?.name,
      action
    });
  };

  const handleStatusConfirm = async () => {
    try {
      if (statusAction.action === "approve") {
        await dispatch(approveRider({riderId:statusAction.riderId}));
        showToast("SUCCESS", "Rider approved successfully!");
      } else {
        await dispatch(rejectRider({riderId:statusAction.riderId}));
        showToast("SUCCESS", "Rider rejected successfully!");
      }
      dispatch(getAllRiders());
    } catch (error) {
      console.error(`Failed to ${statusAction.action} rider:`, error);
      showToast("ERROR", error.response?.data?.message || `Failed to ${statusAction.action} rider`);
    } finally {
      setStatusAction(null);
    }
  };

  const handleDeleteClick = (riderId) => {
    setDeleteRiderId(riderId);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteRider({riderId:deleteRiderId}))
        .unwrap()
        .then(() => {
          showToast("SUCCESS", "Rider deleted successfully!");
          dispatch(getAllRiders({}));
        })
        .catch((error) => {
          showToast("ERROR", error.message || "Failed to delete rider");
        });
    } catch (error) {
      console.error("Failed to delete rider:", error);
      showToast("ERROR", "Failed to delete rider");
    } finally {
      setDeleteRiderId(null);
    }
  };

  const applyFilters = () => {
    let filtered = [...allRiders];

    if (searchQuery) {
      filtered = filtered.filter(
        (rider) =>
          rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rider.contactNo.includes(searchQuery) ||
          rider.CNIC.includes(searchQuery) ||
          rider.bikeNo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((rider) => rider.status === statusFilter);
    }

    setFilteredRiders(filtered);
  };

  useEffect(() => {
    if (allRiders) {
      setFilteredRiders(allRiders);
    }
  }, [allRiders]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      case "Pending":
      default:
        return "warning";
    }
  };

  if (isloading) {
    return <Loader />;
  }

  return (
    <ThemeProvider theme={theme}>
      <main className="relative bg-gray-50 flex flex-col pt-5 pb-9">
        {/* Header */}
        <header className="px-4 md:px-6 lg:px-12 mb-6">
          <h1 className="text-3xl font-bold text-[#603F26]">
            Manage Riders
          </h1>
        </header>

        {/* Stats */}
        <section className="px-4 md:px-6 lg:px-12 flex justify-between items-center mb-6">
          <div>
            <div className="bg-[#603F26] text-white px-6 py-4 rounded-lg">
              <h2 className="text-3xl font-bold">
                {String(totalRiders).padStart(2, "0")}
              </h2>
              <p className="text-sm">Total Riders</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </section>

        {/* Filters */}
        {showFilters && (
          <section className="px-4 md:px-6 lg:px-12 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex gap-6 flex-wrap">
                <TextField
                  label="Search"
                  placeholder="Search by name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: "gray", mr: 1 }} />,
                  }}
                />
                <div className="min-w-[200px]">
                  <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status-filter"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#603F26]"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="flex gap-2">
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
                      setSearchQuery("");
                      setStatusFilter("");
                      setFilteredRiders(allRiders);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Data Table */}
        <section className="w-full px-4 md:px-8 lg:px-12 mt-4 flex-grow">
          {!filteredRiders || filteredRiders.length === 0 ? (
            <div className="text-3xl font-bold flex justify-center">
              No Riders found
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden md:block">
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="riders table">
                    <TableHead sx={{ backgroundColor: "#603F26" }}>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          ID
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
                          Contact
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Bike No.
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
                          Status
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Registration Date
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
                      {filteredRiders.map((rider) => (
                        <TableRow key={rider.riderId}>
                          <TableCell>{rider.riderId.slice(-6)}</TableCell>
                          <TableCell>{rider.name}</TableCell>
                          <TableCell>{rider.contactNo}</TableCell>
                          <TableCell>{rider.bikeNo}</TableCell>
                          <TableCell>{rider.city}</TableCell>
                          <TableCell>
                            <Chip
                              label={rider.status}
                              color={getStatusColor(rider.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{formatDate(rider.createdAt)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Tooltip title="View Details">
                                <IconButton
                                  onClick={() => handleViewDetails(rider)}
                                  color="primary"
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Delete Rider">
                                <IconButton
                                  onClick={() => handleDeleteClick(rider.riderId)}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>

                              {rider.status === "Pending" && (
                                <>
                                  <Tooltip title="Approve Rider">
                                    <IconButton
                                      onClick={() => handleStatusClick(rider.riderId, "approve")}
                                      color="success"
                                    >
                                      <CheckCircleIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Reject Rider">
                                    <IconButton
                                      onClick={() => handleStatusClick(rider.riderId, "reject")}
                                      color="error"
                                    >
                                      <CancelIcon />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              {/* Mobile View */}
              <div className="block md:hidden space-y-4">
                {filteredRiders.map((rider) => (
                  <article
                    key={rider.riderId}
                    className="bg-white p-4 rounded-lg shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold">{rider.name}</h3>
                        <p className="text-gray-600">{rider.contactNo}</p>
                      </div>
                      <Chip
                        label={rider.status}
                        color={getStatusColor(rider.status)}
                        size="small"
                      />
                    </div>

                    <div className="space-y-2">
                      <p>ID: {rider.riderId.slice(-6)}</p>
                      <p>Bike No: {rider.bikeNo}</p>
                      <p>City: {rider.city}</p>
                      <p>Registered: {formatDate(rider.createdAt)}</p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        className="bg-[#603F26] text-white py-2 px-4 rounded-md flex-1 hover:bg-[#4a3019] transition-colors"
                        onClick={() => handleViewDetails(rider)}
                      >
                        View Details
                      </button>
                      
                      <button
                        className="bg-red-600 text-white py-2 px-4 rounded-md flex-1 hover:bg-red-700 transition-colors"
                        onClick={() => handleDeleteClick(rider.riderId)}
                      >
                        Delete
                      </button>

                      {rider.status === "Pending" && (
                        <>
                          <button
                            className="bg-green-600 text-white py-2 px-4 rounded-md flex-1 hover:bg-green-700 transition-colors"
                            onClick={() => handleStatusClick(rider.riderId, "approve")}
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-600 text-white py-2 px-4 rounded-md flex-1 hover:bg-red-700 transition-colors"
                            onClick={() => handleStatusClick(rider.riderId, "reject")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>


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

        {/* Rider Details Dialog */}
        <RiderDetailsDialog
          open={!!viewRiderDetails}
          onClose={() => setViewRiderDetails(null)}
          rider={viewRiderDetails}
          onViewImage={handleViewImage}
        />

        {/* Status Confirmation Dialog */}
        <StatusConfirmationDialog
          open={!!statusAction}
          onClose={() => setStatusAction(null)}
          onConfirm={handleStatusConfirm}
          riderName={statusAction?.riderName}
          actionType={statusAction?.action}
        />

        <DeleteConfirmationDialog
          open={!!deleteRiderId}
          onClose={() => setDeleteRiderId(null)}
          onConfirm={handleDeleteConfirm}
          riderName={
            allRiders.find(rider => rider.riderId === deleteRiderId)?.name
          }
        />

        {/* Image View Dialog */}
        <ImageViewDialog
          open={imageView.open}
          onClose={() => setImageView({ open: false, url: "", title: "" })}
          imageUrl={imageView.url}
          title={imageView.title}
        />
      </main>
    </ThemeProvider>
  );
};

export default ManageRiders;