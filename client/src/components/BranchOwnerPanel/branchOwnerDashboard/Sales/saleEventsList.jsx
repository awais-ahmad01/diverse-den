import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  createTheme,
  ThemeProvider,
  Dialog,
  IconButton,
  Chip,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Grid,
  Divider,
  Tooltip,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

// Same theme as ListOrders
const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
  },
});

// Event Details Dialog Component
const EventDetailsDialog = ({ open, onClose, event }) => {
  if (!event) return null;

  // Mock products data (in real app, this would come from your backend)
  const mockProducts = [
    {
      id: 1,
      name: "Product 1",
      originalPrice: 99.99,
      discountedPrice: 74.99,
      category: "Electronics",
    },
    {
      id: 2,
      name: "Product 2",
      originalPrice: 49.99,
      discountedPrice: 37.49,
      category: "Clothing",
    },
    {
      id: 3,
      name: "Product 3",
      originalPrice: 29.99,
      discountedPrice: 22.49,
      category: "Accessories",
    },
    {
      id: 4,
      name: "Product 1",
      originalPrice: 99.99,
      discountedPrice: 74.99,
      category: "Electronics",
    },
    {
      id: 5,
      name: "Product 2",
      originalPrice: 49.99,
      discountedPrice: 37.49,
      category: "Clothing",
    },
    {
      id: 6,
      name: "Product 3",
      originalPrice: 29.99,
      discountedPrice: 22.49,
      category: "Accessories",
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-[#603F26] text-white">
        Sale Event Details - {event.name}
      </DialogTitle>
      <DialogContent className="mt-4">
        <Grid container spacing={3}>
          {/* Event Information */}
          <Grid item xs={12} md={6}>
            <h3 className="text-base font-bold mb-2">Event Information</h3>
            <p>Name: {event.name}</p>
            <p>Description: {event.description}</p>
            <p>
              Status:{" "}
              <Chip
                label={event.status}
                color={
                  event.status === "Active"
                    ? "success"
                    : event.status === "Scheduled"
                    ? "info"
                    : "default"
                }
                size="small"
              />
            </p>
          </Grid>

          {/* Discount Information */}
          <Grid item xs={12} md={6}>
            <h3 className="text-base font-bold mb-2">Discount Details</h3>
            <p>
              Type:{" "}
              {event.discountType === "percentage"
                ? "Percentage"
                : "Fixed Amount"}
            </p>
            <p>
              Value:{" "}
              {event.discountType === "percentage"
                ? `${event.discountValue}%`
                : `$${event.discountValue}`}
            </p>
            <p>
              Duration: {new Date(event.startDate).toLocaleDateString()} -{" "}
              {new Date(event.endDate).toLocaleDateString()}
            </p>
          </Grid>

          {/* Products Table */}
          <Grid item xs={12}>
            <Divider className="my-4" />
            <h3 className="text-base font-bold mb-2">
              Products Included ({event.productsCount})
            </h3>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Original Price</TableCell>
                    <TableCell align="right">Discounted Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell align="right">
                        ${product.originalPrice}
                      </TableCell>
                      <TableCell align="right">
                        ${product.discountedPrice}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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

const SaleEventsList = () => {
  const [events, setEvents] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [viewEventDetails, setViewEventDetails] = useState(null);

  // Mock data
  useEffect(() => {
    setTimeout(() => {
      const mockEvents = [
        {
          id: 1,
          name: "Summer Sale 2025",
          description: "Annual summer clearance sale",
          startDate: "2025-06-01",
          endDate: "2025-06-30",
          discountType: "percentage",
          discountValue: 25,
          productsCount: 45,
          status: "Active",
          isActive: true,
        },
        {
          id: 2,
          name: "Flash Sale",
          description: "24-hour flash sale on electronics",
          startDate: "2025-03-15",
          endDate: "2025-03-16",
          discountType: "fixed",
          discountValue: 50,
          productsCount: 20,
          status: "Scheduled",
          isActive: true,
        },
        {
          id: 3,
          name: "Winter Clearance",
          description: "End of winter season sale",
          startDate: "2025-02-01",
          endDate: "2025-02-28",
          discountType: "percentage",
          discountValue: 30,
          productsCount: 60,
          status: "Ended",
          isActive: false,
        },
      ];
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setIsLoading(false);
    }, 800);
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return { color: "success", label: "Active" };
      case "scheduled":
        return { color: "info", label: "Scheduled" };
      case "ended":
        return { color: "default", label: "Ended" };
      default:
        return { color: "default", label: status };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const applyFilters = () => {
    let filtered = [...events];
    if (startDate) {
      filtered = filtered.filter((event) => event.startDate >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((event) => event.endDate <= endDate);
    }
    setFilteredEvents(filtered);
  };

  const handleDeleteClick = (eventId) => {
    setSelectedEventId(eventId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    const updatedEvents = events.filter(
      (event) => event.id !== selectedEventId
    );
    setEvents(updatedEvents);
    setFilteredEvents(updatedEvents);
    setDeleteDialogOpen(false);
    setSelectedEventId(null);
  };

  const handleToggleActive = (eventId) => {
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        return {
          ...event,
          isActive: !event.isActive,
          status: !event.isActive ? "Active" : "Inactive",
        };
      }
      return event;
    });
    setEvents(updatedEvents);
    setFilteredEvents(updatedEvents);
  };

  const handleViewDetails = (event) => {
    setViewEventDetails(event);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5">
        {/* Header */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
          <h1 className="text-2xl md:text-3xl font-bold text-[#603F26]">
            Sale Events
          </h1>
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
          <Paper
            sx={{
              bgcolor: "#603F26",
              color: "white",
              px: 3,
              py: 2,
              borderRadius: 2,
            }}
          >
            <h2 className="text-2xl font-bold">
              {String(events.length).padStart(2, "0")}
            </h2>
            <p className="text-sm">Total Events</p>
          </Paper>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={Link}
              to="../createSaleEvent"
            >
              Create Event
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        {showFilters && (
          <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
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
                    setStartDate("");
                    setEndDate("");
                    setFilteredEvents(events);
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Events Table - Desktop View */}
        <div className="w-full px-4 md:px-8 lg:px-12 mt-4 flex-grow">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden xl:block">
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: "#603F26" }}>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>
                      Event Name
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>
                      Duration
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>
                      Discount
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", fontWeight: "bold", fontSize: "16px" }}
                      align="center"
                    >
                      Products
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", fontWeight: "bold", fontSize: "16px" }}
                      align="center"
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", fontWeight: "bold", fontSize: "16px" }}
                      align="center"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="font-medium">{event.name}</div>
                        <div className="text-gray-500 text-sm">
                          {event.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(event.startDate)} -{" "}
                        {formatDate(event.endDate)}
                      </TableCell>
                      <TableCell>
                        {event.discountType === "percentage"
                          ? `${event.discountValue}% Off`
                          : `$${event.discountValue} Off`}
                      </TableCell>
                      <TableCell align="center">{event.productsCount}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={getStatusColor(event.status).label}
                          color={getStatusColor(event.status).color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <div className="flex justify-center gap-2">
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewDetails(event)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Event">
                            <IconButton
                              size="small"
                              color="primary"
                              component={Link}
                              to={`../updateSaleEvent/${event.id}`}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Event">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(event.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={event.isActive ? "Disable Event" : "Enable Event"}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleToggleActive(event.id)}
                            >
                              {event.isActive ? (
                                <ToggleOnIcon />
                              ) : (
                                <ToggleOffIcon />
                              )}
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

          {/* Events List - Mobile View */}
          <div className="block xl:hidden space-y-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white p-4 rounded-lg shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-base">{event.name}</h3>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                  <Chip
                    label={getStatusColor(event.status).label}
                    color={getStatusColor(event.status).color}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm">
                    Duration: {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </p>
                  <p className="text-sm">
                    Discount: {event.discountType === "percentage"
                      ? `${event.discountValue}% Off`
                      : `$${event.discountValue} Off`}
                  </p>
                  <p className="text-sm">Products: {event.productsCount}</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewDetails(event)}
                    fullWidth
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={Link}
                    to={`../updateSaleEvent/${event.id}`}
                    fullWidth
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteClick(event.id)}
                    fullWidth
                  >
                    Delete
                  </Button>
                  <Button
                    variant={event.isActive ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleToggleActive(event.id)}
                    fullWidth
                  >
                    {event.isActive ? "Active" : "Inactive"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Details Dialog */}
        <EventDetailsDialog
          open={!!viewEventDetails}
          onClose={() => setViewEventDetails(null)}
          event={viewEventDetails}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle className="text-red-600">Delete Sale Event</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this sale event? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default SaleEventsList;





// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux"; // Added useDispatch and useSelector
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Box,
//   createTheme,
//   ThemeProvider,
//   Dialog,
//   IconButton,
//   Typography,
//   Chip,
//   TextField,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   DialogContentText,
//   Grid,
//   Divider,
// } from "@mui/material";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import EditIcon from "@mui/icons-material/Edit";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ToggleOnIcon from "@mui/icons-material/ToggleOn";
// import ToggleOffIcon from "@mui/icons-material/ToggleOff";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import { Loader, showToast } from "../../../../tools"; // Added Loader and showToast
// // Import the necessary actions (similar to OrderPaymentHistory)
// import { 
//   listSaleEvents, 
//   deleteSaleEvent, 
//   toggleSaleEventStatus 
// } from "../../../../store/actions/saleEvents"; // You'll need to create these actions

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#603F26",
//     },
//   },
// });

// // Event Details Dialog Component
// const EventDetailsDialog = ({ open, onClose, event }) => {
//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (event && open) {
//       // Fetch products included in this sale event
//       setIsLoading(true);
//       // This would be a separate action to get products for a specific sale event
//       dispatch({ type: 'GET_SALE_EVENT_PRODUCTS', payload: event.id })
//         .unwrap()
//         .then(response => {
//           setProducts(response.products || []);
//           setIsLoading(false);
//         })
//         .catch(error => {
//           showToast("ERROR", "Failed to load event products");
//           console.error("Failed to load event products:", error);
//           setIsLoading(false);
//         });
//     }
//   }, [event, open, dispatch]);

//   if (!event) return null;

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle className="bg-[#603F26] text-white">
//         Sale Event Details - {event.name}
//       </DialogTitle>
//       <DialogContent className="mt-4">
//         {isLoading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
//             <Loader />
//           </Box>
//         ) : (
//           <Grid container spacing={3}>
//             {/* Event Information */}
//             <Grid item xs={12} md={6}>
//               <Typography variant="h6" className="font-bold mb-2">
//                 Event Information
//               </Typography>
//               <Typography>Name: {event.name}</Typography>
//               <Typography>Description: {event.description}</Typography>
//               <Typography>
//                 Status:{" "}
//                 <Chip
//                   label={event.status}
//                   color={
//                     event.status === "Active"
//                       ? "success"
//                       : event.status === "Scheduled"
//                       ? "info"
//                       : "default"
//                   }
//                   size="small"
//                 />
//               </Typography>
//             </Grid>

//             {/* Discount Information */}
//             <Grid item xs={12} md={6}>
//               <Typography variant="h6" className="font-bold mb-2">
//                 Discount Details
//               </Typography>
//               <Typography>
//                 Type:{" "}
//                 {event.discountType === "percentage"
//                   ? "Percentage"
//                   : "Fixed Amount"}
//               </Typography>
//               <Typography>
//                 Value:{" "}
//                 {event.discountType === "percentage"
//                   ? `${event.discountValue}%`
//                   : `$${event.discountValue}`}
//               </Typography>
//               <Typography>
//                 Duration: {new Date(event.startDate).toLocaleDateString()} -{" "}
//                 {new Date(event.endDate).toLocaleDateString()}
//               </Typography>
//             </Grid>

//             {/* Products Table */}
//             <Grid item xs={12}>
//               <Divider className="my-4" />
//               <Typography variant="h6" className="font-bold mb-2">
//                 Products Included ({event.productsCount})
//               </Typography>
//               <TableContainer>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Product Name</TableCell>
//                       <TableCell>Category</TableCell>
//                       <TableCell align="right">Original Price</TableCell>
//                       <TableCell align="right">Discounted Price</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {products.map((product) => (
//                       <TableRow key={product.id}>
//                         <TableCell>{product.name}</TableCell>
//                         <TableCell>{product.category}</TableCell>
//                         <TableCell align="right">
//                           ${product.originalPrice}
//                         </TableCell>
//                         <TableCell align="right">
//                           ${product.discountedPrice}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Grid>
//           </Grid>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="primary">
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// const SaleEventsList = () => {
//   const dispatch = useDispatch(); // Added dispatch
//   const { user } = useSelector((state) => state.auth); // Getting user from auth state
//   // Get events from redux state (similar to how paymentHistory is retrieved)
//   const { saleEvents, isloading, meta } = useSelector((state) => state.saleEvents);

//   const [showFilters, setShowFilters] = useState(false);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [filteredEvents, setFilteredEvents] = useState([]);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedEventId, setSelectedEventId] = useState(null);
//   const [viewEventDetails, setViewEventDetails] = useState(null);

//   // Fetch sale events when component mounts - similar to OrderPaymentHistory
//   useEffect(() => {
//     const business = user?.business;
//     dispatch(listSaleEvents({ business }))
//       .unwrap()
//       .then(response => {
//         console.log("Sale events loaded successfully");
//       })
//       .catch(error => {
//         showToast("ERROR", "Failed to load sale events");
//         console.error("Failed to load sale events:", error);
//       });
//   }, [dispatch, user]);

//   // Update filtered events when sale events change
//   useEffect(() => {
//     if (saleEvents) {
//       setFilteredEvents(saleEvents);
//     }
//   }, [saleEvents]);

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case "active":
//         return { color: "success", label: "Active" };
//       case "scheduled":
//         return { color: "info", label: "Scheduled" };
//       case "ended":
//         return { color: "default", label: "Ended" };
//       default:
//         return { color: "default", label: status };
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const applyFilters = () => {
//     if (!startDate && !endDate) {
//       setFilteredEvents(saleEvents);
//       return;
//     }

//     let filtered = [...saleEvents];
//     if (startDate) {
//       filtered = filtered.filter((event) => event.startDate >= startDate);
//     }
//     if (endDate) {
//       filtered = filtered.filter((event) => event.endDate <= endDate);
//     }
//     setFilteredEvents(filtered);
//   };

//   // Apply filters when date range changes (similar to OrderPaymentHistory)
//   useEffect(() => {
//     if (saleEvents) {
//       applyFilters();
//     }
//   }, [startDate, endDate, saleEvents]);

//   const handleDeleteClick = (eventId) => {
//     setSelectedEventId(eventId);
//     setDeleteDialogOpen(true);
//   };

//   const handleDeleteConfirm = () => {
//     const business = user?.business;
//     dispatch(deleteSaleEvent({ eventId: selectedEventId, business }))
//       .unwrap()
//       .then(() => {
//         showToast("SUCCESS", "Sale event deleted successfully");
//         setDeleteDialogOpen(false);
//         setSelectedEventId(null);
//       })
//       .catch(error => {
//         showToast("ERROR", "Failed to delete sale event");
//         console.error("Failed to delete sale event:", error);
//       });
//   };

//   const handleToggleActive = (eventId) => {
//     const business = user?.business;
//     dispatch(toggleSaleEventStatus({ eventId, business }))
//       .unwrap()
//       .then(() => {
//         showToast("SUCCESS", "Sale event status updated successfully");
//       })
//       .catch(error => {
//         showToast("ERROR", "Failed to update sale event status");
//         console.error("Failed to update sale event status:", error);
//       });
//   };

//   const handleViewDetails = (event) => {
//     setViewEventDetails(event);
//   };

//   if (isloading) {
//     return <Loader />;
//   }

//   const totalEvents = meta?.totalEvents || (saleEvents ? saleEvents.length : 0);

//   return (
//     <ThemeProvider theme={theme}>
//       <div className="relative bg-gray-50 flex flex-col pt-5">
//         {/* Header */}
//         <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
//           <Typography
//             variant="h4"
//             sx={{ color: "#603F26", fontWeight: "bold" }}
//           >
//             Sale Events
//           </Typography>
//         </Box>

//         {/* Stats and Actions */}
//         <Box
//           sx={{
//             px: { xs: 2, md: 4, lg: 6 },
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             mb: 3,
//           }}
//         >
//           <Paper
//             sx={{
//               bgcolor: "#603F26",
//               color: "white",
//               px: 3,
//               py: 2,
//               borderRadius: 2,
//             }}
//           >
//             <Typography variant="h4" component="div">
//               {String(totalEvents).padStart(2, "0")}
//             </Typography>
//             <Typography variant="body2">Total Events</Typography>
//           </Paper>

//           <Box sx={{ display: "flex", gap: 2 }}>
//             <Button
//               variant="outlined"
//               color="primary"
//               startIcon={<FilterListIcon />}
//               onClick={() => setShowFilters(!showFilters)}
//             >
//               {showFilters ? "Hide Filters" : "Show Filters"}
//             </Button>
//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<AddIcon />}
//               component={Link}
//               to="../createSaleEvent"
//             >
//               Create Event
//             </Button>
//           </Box>
//         </Box>

//         {/* Filters */}
//         {showFilters && (
//           <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
//             <Paper sx={{ p: 3 }}>
//               <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
//                 <TextField
//                   label="Start Date"
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   InputLabelProps={{ shrink: true }}
//                 />
//                 <TextField
//                   label="End Date"
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   InputLabelProps={{ shrink: true }}
//                 />
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={applyFilters}
//                 >
//                   Apply Filters
//                 </Button>
//               </Box>
//             </Paper>
//           </Box>
//         )}

//         {/* Events Table */}
//         {!filteredEvents || filteredEvents.length === 0 ? (
//           <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 4, textAlign: 'center', py: 6 }}>
//             <Typography variant="h5" fontWeight="bold">No sale events found</Typography>
//           </Box>
//         ) : (
//           <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 4 }}>
//             <TableContainer component={Paper}>
//               <Table>
//                 <TableHead sx={{ bgcolor: "#603F26" }}>
//                   <TableRow>
//                     <TableCell sx={{ color: "white", fontWeight: "bold" }}>
//                       Event Name
//                     </TableCell>
//                     <TableCell sx={{ color: "white", fontWeight: "bold" }}>
//                       Duration
//                     </TableCell>
//                     <TableCell sx={{ color: "white", fontWeight: "bold" }}>
//                       Discount
//                     </TableCell>
//                     <TableCell
//                       sx={{ color: "white", fontWeight: "bold" }}
//                       align="center"
//                     >
//                       Products
//                     </TableCell>
//                     <TableCell
//                       sx={{ color: "white", fontWeight: "bold" }}
//                       align="center"
//                     >
//                       Status
//                     </TableCell>
//                     <TableCell
//                       sx={{ color: "white", fontWeight: "bold" }}
//                       align="center"
//                     >
//                       Actions
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {filteredEvents.map((event) => (
//                     <TableRow key={event.id}>
//                       <TableCell>
//                         <Typography
//                           variant="subtitle2"
//                           sx={{ fontWeight: "bold" }}
//                         >
//                           {event.name}
//                         </Typography>
//                         <Typography variant="body2" color="textSecondary">
//                           {event.description}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         {formatDate(event.startDate)} -{" "}
//                         {formatDate(event.endDate)}
//                       </TableCell>
//                       <TableCell>
//                         {event.discountType === "percentage"
//                           ? `${event.discountValue}% Off`
//                           : `$${event.discountValue} Off`}
//                       </TableCell>
//                       <TableCell align="center">{event.productsCount}</TableCell>
//                       <TableCell align="center">
//                         <Chip
//                           label={getStatusColor(event.status).label}
//                           color={getStatusColor(event.status).color}
//                           size="small"
//                         />
//                       </TableCell>
//                       <TableCell align="center">
//                         <Box
//                           sx={{
//                             display: "flex",
//                             justifyContent: "center",
//                             gap: 1,
//                           }}
//                         >
//                           <IconButton
//                             size="small"
//                             color="primary"
//                             onClick={() => handleViewDetails(event)}
//                           >
//                             <VisibilityIcon />
//                           </IconButton>
//                           <IconButton
//                             size="small"
//                             color="primary"
//                             component={Link}
//                             to={`../updateSaleEvent/${event.id}`}
//                           >
//                             <EditIcon />
//                           </IconButton>
//                           <IconButton
//                             size="small"
//                             color="error"
//                             onClick={() => handleDeleteClick(event.id)}
//                           >
//                             <DeleteIcon />
//                           </IconButton>
//                           <IconButton
//                             size="small"
//                             color="primary"
//                             onClick={() => handleToggleActive(event.id)}
//                           >
//                             {event.isActive ? (
//                               <ToggleOnIcon />
//                             ) : (
//                               <ToggleOffIcon />
//                             )}
//                           </IconButton>
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Box>
//         )}

//         {/* Pagination - similar to OrderPaymentHistory */}
//         {meta?.nextPage || meta?.previousPage ? (
//           <nav className="w-full flex justify-center items-center my-8">
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
//         ) : (
//           <nav
//             aria-label="Page navigation example"
//             className="w-full flex justify-center items-center my-8"
//           >
//             <ul className="inline-flex items-center -space-x-px text-sm">
//               <li className="flex items-center justify-center px-4 py-2 text-white bg-[#603F26] border border-[#603F26] shadow-md font-bold cursor-default rounded-md">
//                 1
//               </li>
//             </ul>
//           </nav>
//         )}

//         {/* Event Details Dialog */}
//         <EventDetailsDialog
//           open={!!viewEventDetails}
//           onClose={() => setViewEventDetails(null)}
//           event={viewEventDetails}
//         />

//         {/* Delete Confirmation Dialog */}
//         <Dialog
//           open={deleteDialogOpen}
//           onClose={() => setDeleteDialogOpen(false)}
//         >
//           <DialogTitle>Delete Sale Event</DialogTitle>
//           <DialogContent>
//             <DialogContentText>
//               Are you sure you want to delete this sale event? This action
//               cannot be undone.
//             </DialogContentText>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
//             <Button
//               onClick={handleDeleteConfirm}
//               color="error"
//               variant="contained"
//             >
//               Delete
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </div>
//     </ThemeProvider>
//   );
// };

// export default SaleEventsList;
