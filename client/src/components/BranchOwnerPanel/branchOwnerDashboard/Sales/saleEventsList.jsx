
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showToast, Loader } from "../../../../tools";

import {
  listSaleEvents,
  getSaleEventById,
  deleteSaleEvent,
} from "../../../../store/actions/saleEvents";
import { resetSaleEventData } from "../../../../store/reducers/saleEvents";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
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

const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
  },
});

const EventDetailsDialog = ({ open, onClose, event }) => {
  const { saleEventById, isloading } = useSelector((state) => state.saleEvents);
  const dispatch = useDispatch();

  useEffect(() => {
    if (open && event?.eventId) {
      console.log("Dispatching getSaleEventById with ID:", event.eventId);
      dispatch(getSaleEventById(event.eventId));
    }

    return () => {
      dispatch(resetSaleEventData());
    };
  }, [open, event?.eventId, dispatch]);

  if (isloading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle className="bg-[#603F26] text-white">
          Loading Sale Event Details...
        </DialogTitle>
        <DialogContent className="mt-4 flex justify-center py-8">
          <Loader />
        </DialogContent>
      </Dialog>
    );
  }

  console.log("Current saleEventById:", saleEventById);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-[#603F26] text-white">
        Sale Event Details - {saleEventById?.name || "Event"}
      </DialogTitle>
      <DialogContent className="mt-4">
        {!saleEventById || Object.keys(saleEventById).length === 0 ? (
          <p className="text-center py-4">Event details could not be loaded.</p>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <h3 className="text-base font-bold mb-2">Event Information</h3>
              <p>Name: {saleEventById.name}</p>
              <p>Description: {saleEventById.description}</p>
              <p>
                Status:{" "}
                <Chip
                  label={saleEventById.status}
                  color={
                    saleEventById.status === "Ongoing"
                      ? "success"
                      : saleEventById.status === "Upcoming"
                      ? "info"
                      : "default"
                  }
                  size="small"
                />
              </p>
            </Grid>

            <Grid item xs={12} md={6}>
              <h3 className="text-base font-bold mb-2">Discount Details</h3>
              <p>Type: {saleEventById.discountType}</p>
              <p>Value: {saleEventById.discountValue}</p>
              <p>Duration: {saleEventById.duration}</p>
            </Grid>

            <Grid item xs={12}>
              <Divider className="my-4" />
              <h3 className="text-base font-bold mb-2">
                Products Included ({saleEventById.products?.length || 0})
              </h3>
              {!saleEventById.products ||
              saleEventById.products.length === 0 ? (
                <p>No products included in this event.</p>
              ) : (
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
                      {saleEventById.products.map((product, index) => (
                        <TableRow key={index}>
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
              )}
            </Grid>
          </Grid>
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

const SaleEventsList = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { saleEvents, meta, isloading } = useSelector(
    (state) => state.saleEvents
  );

  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchName, setSearchName] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [viewEventDetails, setViewEventDetails] = useState(null);

  useEffect(() => {
    const business = user?.business;
    dispatch(listSaleEvents({ business }));
  }, [dispatch, user]);

  useEffect(() => {
    if (saleEvents) {
      setFilteredEvents(saleEvents);
    }
  }, [saleEvents]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "ongoing":
        return { color: "success", label: "Active" };
      case "upcoming":
        return { color: "info", label: "Scheduled" };
      case "expired":
        return { color: "default", label: "Ended" };
      default:
        return { color: "default", label: status || "Unknown" };
    }
  };

  const applyFilters = () => {
    //
    let filtered = [...saleEvents];

   
    const extractDatesFromDuration = (duration) => {
      if (!duration) return { start: null, end: null };

      try {
        const dateParts = duration.split("-");
        if (dateParts.length === 2) {
          const startDate = new Date(dateParts[0].trim());
          const endDate = new Date(dateParts[1].trim());

          // Check if valid dates were parsed
          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            return { start: startDate, end: endDate };
          }
        }
      } catch (error) {
        console.error("Error parsing duration format:", error);
      }

      return { start: null, end: null };
    };

    // Filter by start date
    if (startDate) {
      const filterStartDate = new Date(startDate);
      filterStartDate.setHours(0, 0, 0, 0); // Set to beginning of day

      filtered = filtered.filter((event) => {
        // Try event.startDate, event.start, event.beginDate properties
        let eventStartDate = event.startDate || event.start || event.beginDate;

        // If no direct date property, try extracting from duration
        if (!eventStartDate && event.duration) {
          const { start } = extractDatesFromDuration(event.duration);
          eventStartDate = start;
        }

        // If we have a valid date to compare
        if (eventStartDate) {
          if (eventStartDate instanceof Date) {
            return eventStartDate >= filterStartDate;
          } else {
            try {
              return new Date(eventStartDate) >= filterStartDate;
            } catch (error) {
              console.error("Error comparing start dates:", error);
              return true; // Keep events with invalid dates
            }
          }
        }

        return true; 
      });
    }

    if (endDate) {
      const filterEndDate = new Date(endDate);
      
      filterEndDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter((event) => {
        
        let eventEndDate = event.endDate || event.end || event.expiryDate;

       
        if (!eventEndDate && event.duration) {
          const { end } = extractDatesFromDuration(event.duration);
          eventEndDate = end;
        }

        
        if (eventEndDate) {
          if (eventEndDate instanceof Date) {
            return eventEndDate <= filterEndDate;
          } else {
            try {
              return new Date(eventEndDate) <= filterEndDate;
            } catch (error) {
              console.error("Error comparing end dates:", error);
              return true; 
            }
          }
        }

        return true; 
      });
    }

 
    if (searchName) {
      filtered = filtered.filter((event) =>
        event.name?.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    setFilteredEvents(filtered);

   
    console.log("Applied filters:", {
      startDate: startDate || "none",
      endDate: endDate || "none",
      nameSearch: searchName || "none",
      filteredCount: filtered.length,
      totalCount: saleEvents.length,
    });
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchName("");
    setFilteredEvents(saleEvents);
  };

  const handleNextPage = (page) => {
    const business = user?.business;
    if (business && page) {
      console.log("Next Page:", page);
      dispatch(listSaleEvents({ business, pageNo: page }));
    }
  };

  const handlePrevPage = (page) => {
    const business = user?.business;
    if (business && page) {
      console.log("Previous Page:", page);
      dispatch(listSaleEvents({ business, pageNo: page }));
    }
  };

  // const handleViewDetails = (event) => {
  //   console.log("Opening dialog for event:", event);
  //   setViewEventDetails(event);
  // };

  const handleDeleteClick = (eventId) => {
    setSelectedEventId(eventId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    const business = user?.business;
    dispatch(deleteSaleEvent({ eventId: selectedEventId, business }))
      .unwrap()
      .then(() => {
        showToast("SUCCESS", "Sale event deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedEventId(null);
      })
      .catch((error) => {
        showToast("ERROR", "Failed to delete sale event");
      });
  };

  const totalEvents = saleEvents?.length || 0;

  if (isloading) {
    return <Loader />;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5">

        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
                  <Typography
                    variant="h4"
                    sx={{ color: "#603F26", fontWeight: "bold" }}
                  >
                     Sale Events
                  </Typography>
                </Box>
        {/* <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
          <h1 className="text-2xl md:text-3xl font-bold text-[#603F26]">
            Sale Events
          </h1>
        </Box> */}

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
              {String(totalEvents).padStart(2, "0")}
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

        {showFilters && (
          <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
            <Paper sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <TextField
                  label="Event Name"
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Search by name..."
                  fullWidth={false}
                  sx={{ minWidth: "200px" }}
                />
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
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </Box>
            </Paper>
          </Box>
        )}

        <div className="w-full px-4 md:px-8 lg:px-12 mt-4 flex-grow">
          {!filteredEvents || filteredEvents.length === 0 ? (
            <div className="text-3xl font-bold flex justify-center">
              No Events found
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="w-full px-4 md:px-8 lg:px-12 mt-4 flex-grow">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden xl:block">
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead sx={{ bgcolor: "#603F26" }}>
                        <TableRow>
                          <TableCell
                            sx={{
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "16px",
                            }}
                          >
                            Event Name
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "16px",
                            }}
                          >
                            Duration
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "16px",
                            }}
                          >
                            Discount
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "16px",
                            }}
                            align="center"
                          >
                            Products
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "16px",
                            }}
                            align="center"
                          >
                            Status
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "16px",
                            }}
                            align="center"
                          >
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredEvents.map((event) => (
                          <TableRow key={event.eventId}>
                            <TableCell>
                              <div className="font-medium">{event?.name}</div>
                              <div className="text-gray-500 text-sm">
                                {event?.description}
                              </div>
                            </TableCell>
                            <TableCell>{event?.duration}</TableCell>
                            <TableCell>{event?.discount}</TableCell>
                            <TableCell align="center">
                              {event?.products}
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={getStatusColor(event.status).label}
                                color={getStatusColor(event.status).color}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <div className="flex justify-center gap-2">
                                {/* <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewDetails(event)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip> */}
                                <Tooltip title="Edit Event">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    component={Link}
                                    to={`../updateSaleEvent/${event?.eventId}`}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Event">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleDeleteClick(event?.eventId)
                                    }
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                                {/* <Tooltip title={event.isActive ? "Disable Event" : "Enable Event"}>
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
                          </Tooltip> */}
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
                  {filteredEvents.map((event) => (
                    <div
                      key={event?.eventId}
                      className="bg-white p-4 rounded-lg shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-base">{event?.name}</h3>
                          <p className="text-sm text-gray-600">
                            {event?.description}
                          </p>
                        </div>
                        <Chip
                          label={getStatusColor(event?.status).label}
                          color={getStatusColor(event?.status).color}
                        />
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm">Duration: {event?.duration}</p>
                        <p className="text-sm">Discount: {event?.discount}</p>
                        <p className="text-sm">Products: {event?.products}</p>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewDetails(event)}
                    fullWidth
                  >
                    View Details
                  </Button> */}
                        <Button
                          variant="outlined"
                          color="primary"
                          component={Link}
                          to={`../updateSaleEvent/${event?.eventId}`}
                          fullWidth
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteClick(event?.eventId)}
                          fullWidth
                        >
                          Delete
                        </Button>
                        {/* <Button
                    variant={event.isActive ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleToggleActive(event.id)}
                    fullWidth
                  >
                    {event.isActive ? "Active" : "Inactive"}
                  </Button> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

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

        {/* <EventDetailsDialog
          open={viewEventDetails !== null}
          onClose={() => setViewEventDetails(null)}
          event={viewEventDetails}
        /> */}
      </div>
    </ThemeProvider>
  );
};

export default SaleEventsList;
