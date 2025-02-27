import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../tools";
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
import { format } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import RestoreIcon from "@mui/icons-material/Restore";

// Assuming these actions would be created in the Redux store
// import { listBusinesses, deleteBusiness, enableBusiness } from "../../../../store/actions/businesses";

const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
  },
});

const BusinessDetailsDialog = ({ open, onClose, business }) => {
  if (!business) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-[#603F26] text-white">
        Business Details - {business._id}
      </DialogTitle>
      <DialogContent className="mt-4">
        <Grid container spacing={3}>
          {/* Business Information */}
          <Grid item xs={12}>
            <h3 className="text-lg font-bold mb-2">
              Business Information
            </h3>
            <p>
              Name: {business.name}
            </p>
            <p>Email: {business.email}</p>
            <p>Phone: {business.phone || "Not provided"}</p>
            <p>Business Type: {business.type}</p>
          </Grid>

          {/* Address Information */}
          <Grid item xs={12}>
            <hr className="my-4" />
            <h3 className="text-lg font-bold mb-2">
              Address
            </h3>
            <p>{business.address || "No address provided"}</p>
            <p>{business.city}, {business.state} {business.zipCode}</p>
            <p>{business.country}</p>
          </Grid>

          {/* Subscription Information */}
          <Grid item xs={12}>
            <hr className="my-4" />
            <h3 className="text-lg font-bold mb-2">
              Subscription Information
            </h3>
            <p>Plan: {business.subscriptionPlan}</p>
            <p>
              Status: 
              <Chip
                label={business.isActive ? "Active" : "Disabled"}
                color={business.isActive ? "success" : "error"}
                className="ml-2"
              />
            </p>
            <p>
              Start Date: {format(new Date(business.subscriptionStartDate), "PPP")}
            </p>
            <p>
              Expiry Date: {format(new Date(business.subscriptionEndDate), "PPP")}
            </p>
            {business.subscriptionEndDate < new Date() && (
              <p className="text-red-600 font-bold mt-2">
                Subscription expired on {format(new Date(business.subscriptionEndDate), "PPP")}
              </p>
            )}
          </Grid>

          {/* Additional Information */}
          <Grid item xs={12}>
            <hr className="my-4" />
            <h3 className="text-lg font-bold mb-2">
              Additional Information
            </h3>
            <p>
              Registration Date: {format(new Date(business.createdAt), "PPP")}
            </p>
            <p>
              Owner: {business.ownerFirstName} {business.ownerLastName}
            </p>
            {business.website && (
              <p>Website: {business.website}</p>
            )}
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

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  businessName,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="text-red-600">Delete Business</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete business "{businessName}"? This action
          cannot be undone and will remove all associated data.
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

const EnableBusinessDialog = ({
  open,
  onClose,
  onConfirm,
  businessName,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="text-green-600">Enable Business</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to manually enable "{businessName}"? This will override the automatic
          disabling due to subscription expiry. The business will still need to renew their subscription.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="success" variant="contained">
          Enable
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ManageBusinesses = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  // Assuming these would be provided by Redux state
  // Mock data for demonstration
  const mockBusinesses = [
    {
      _id: "b123456",
      name: "Coffee House Delights",
      email: "info@coffeehousedelights.com",
      phone: "555-123-4567",
      type: "Food & Beverage",
      address: "123 Main Street",
      city: "Portland",
      state: "OR",
      zipCode: "97201",
      country: "USA",
      subscriptionPlan: "Premium",
      isActive: true,
      subscriptionStartDate: "2024-01-15T00:00:00.000Z",
      subscriptionEndDate: "2025-01-15T00:00:00.000Z",
      createdAt: "2023-12-10T00:00:00.000Z",
      ownerFirstName: "Sarah",
      ownerLastName: "Johnson",
      website: "www.coffeehousedelights.com"
    },
    {
      _id: "b234567",
      name: "Tech Solutions Inc",
      email: "contact@techsolutions.com",
      phone: "555-987-6543",
      type: "Technology",
      address: "456 Innovation Drive",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      country: "USA",
      subscriptionPlan: "Basic",
      isActive: false,
      subscriptionStartDate: "2024-01-01T00:00:00.000Z",
      subscriptionEndDate: "2024-02-01T00:00:00.000Z",
      createdAt: "2023-11-15T00:00:00.000Z",
      ownerFirstName: "Michael",
      ownerLastName: "Chen",
      website: "www.techsolutions.com"
    },
    {
      _id: "b345678",
      name: "Fitness First Gym",
      email: "info@fitnessfirst.com",
      phone: "555-222-3333",
      type: "Health & Fitness",
      address: "789 Wellness Blvd",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "USA",
      subscriptionPlan: "Premium",
      isActive: true,
      subscriptionStartDate: "2023-11-01T00:00:00.000Z",
      subscriptionEndDate: "2024-11-01T00:00:00.000Z",
      createdAt: "2023-10-22T00:00:00.000Z",
      ownerFirstName: "Jessica",
      ownerLastName: "Martinez",
      website: "www.fitnessfirstgym.com"
    },
  ];

  const [businesses, setBusinesses] = useState(mockBusinesses);
  const [isLoading, setIsLoading] = useState(false);
  const [meta] = useState({ totalBusinesses: 3, currentPage: 1, nextPage: null, previousPage: null });

  const [viewBusinessDetails, setViewBusinessDetails] = useState(null);
  const [deleteBusinessId, setDeleteBusinessId] = useState(null);
  const [enableBusinessId, setEnableBusinessId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [filteredBusinesses, setFilteredBusinesses] = useState(mockBusinesses);

  const totalBusinesses = meta?.totalBusinesses || 0;

  const handleViewDetails = (business) => {
    setViewBusinessDetails(business);
  };

  const handleDeleteClick = (businessId) => {
    setDeleteBusinessId(businessId);
  };

  const handleEnableClick = (businessId) => {
    setEnableBusinessId(businessId);
  };

  const handleDeleteConfirm = async () => {
    try {
      // In a real implementation, this would dispatch an action
      // await dispatch(deleteBusiness(deleteBusinessId))
      //   .unwrap()
      //   .then((response) => {
      //     showToast("SUCCESS", "Business deleted successfully!");
      //   })
      //   .catch((error) => {
      //     showToast("ERROR", "Failed to delete business");
      //   });

      // For demo, we'll just remove from local state
      setBusinesses(businesses.filter(b => b._id !== deleteBusinessId));
      setFilteredBusinesses(filteredBusinesses.filter(b => b._id !== deleteBusinessId));
      showToast("SUCCESS", "Business deleted successfully!");
    } catch (error) {
      console.error("Failed to delete business:", error);
      showToast("ERROR", "Failed to delete business");
    } finally {
      setDeleteBusinessId(null);
    }
  };

  const handleEnableConfirm = async () => {
    try {
      // In a real implementation, this would dispatch an action
      // await dispatch(enableBusiness(enableBusinessId))
      //   .unwrap()
      //   .then((response) => {
      //     showToast("SUCCESS", "Business enabled successfully!");
      //   })
      //   .catch((error) => {
      //     showToast("ERROR", "Failed to enable business");
      //   });

      // For demo, we'll just update local state
      const updatedBusinesses = businesses.map(b => 
        b._id === enableBusinessId ? { ...b, isActive: true } : b
      );
      setBusinesses(updatedBusinesses);
      setFilteredBusinesses(
        filteredBusinesses.map(b => 
          b._id === enableBusinessId ? { ...b, isActive: true } : b
        )
      );
      showToast("SUCCESS", "Business enabled successfully!");
    } catch (error) {
      console.error("Failed to enable business:", error);
      showToast("ERROR", "Failed to enable business");
    } finally {
      setEnableBusinessId(null);
    }
  };

  const applyFilters = () => {
    let filtered = [...businesses];

    if (searchQuery) {
      filtered = filtered.filter(
        (business) =>
          business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      const isActive = statusFilter === "active";
      filtered = filtered.filter((business) => business.isActive === isActive);
    }

    if (typeFilter) {
      filtered = filtered.filter((business) => business.type === typeFilter);
    }

    setFilteredBusinesses(filtered);
  };

  useEffect(() => {
    if (businesses) {
      setFilteredBusinesses(businesses);
    }
  }, [businesses]);

  useEffect(() => {
    // In a real implementation, this would dispatch an action to fetch businesses
    // dispatch(listBusinesses());
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // Get unique business types for filter dropdown
  const businessTypes = [...new Set(businesses.map(business => business.type))];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ThemeProvider theme={theme}>
      <main className="relative bg-gray-50 flex flex-col pt-5">
        {/* Header */}
        <header className="px-4 md:px-6 lg:px-12 mb-6">
          <h1 className="text-3xl font-bold text-[#603F26]">
            Manage Businesses
          </h1>
        </header>

        {/* Stats and Actions */}
        <section className="px-4 md:px-6 lg:px-12 flex justify-between items-center mb-6">
          <div>
            <div className="bg-[#603F26] text-white px-6 py-4 rounded-lg">
              <h2 className="text-3xl font-bold">
                {String(totalBusinesses).padStart(2, "0")}
              </h2>
              <p className="text-sm">Total Businesses</p>
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
                  placeholder="Search by name or email"
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
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
                <div className="min-w-[200px]">
                  <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Type
                  </label>
                  <select
                    id="type-filter"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#603F26]"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="">All Types</option>
                    {businessTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
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
                      setTypeFilter("");
                      setFilteredBusinesses(businesses);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Businesses Content */}
        <section className="w-full px-4 md:px-8 lg:px-12 mt-4 flex-grow">
          {!filteredBusinesses || filteredBusinesses.length === 0 ? (
            <div className="text-3xl font-bold flex justify-center">
              No Businesses found
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden md:block">
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="businesses table">
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
                          Business Name
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
                          Subscription
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
                          Subscription Ends
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
                      {filteredBusinesses.map((business) => (
                        <TableRow key={business._id}>
                          <TableCell>{business._id.slice(-6)}</TableCell>
                          <TableCell>{business.name}</TableCell>
                          <TableCell>{business.type}</TableCell>
                          <TableCell>{business.subscriptionPlan}</TableCell>
                          <TableCell>
                            <Chip
                              label={business.isActive ? "Active" : "Disabled"}
                              color={business.isActive ? "success" : "error"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {format(new Date(business.subscriptionEndDate), "PP")}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Tooltip title="View Details">
                                <IconButton
                                  onClick={() => handleViewDetails(business)}
                                  color="primary"
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              {!business.isActive && (
                                <Tooltip title="Enable Business">
                                  <IconButton
                                    onClick={() => handleEnableClick(business._id)}
                                    color="success"
                                  >
                                    <RestoreIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Delete Business">
                                <IconButton
                                  onClick={() => handleDeleteClick(business._id)}
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
              <div className="block md:hidden space-y-4">
                {filteredBusinesses.map((business) => (
                  <article
                    key={business._id}
                    className="bg-white p-4 rounded-lg shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold">
                          {business.name}
                        </h3>
                        <p className="text-gray-600">{business.email}</p>
                      </div>
                      <Chip
                        label={business.isActive ? "Active" : "Disabled"}
                        color={business.isActive ? "success" : "error"}
                        size="small"
                      />
                    </div>

                    <div className="space-y-2">
                      <p>ID: {business._id.slice(-6)}</p>
                      <p>Type: {business.type}</p>
                      <p>Plan: {business.subscriptionPlan}</p>
                      <p>Expires: {format(new Date(business.subscriptionEndDate), "PP")}</p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        className="bg-[#603F26] text-white py-2 px-4 rounded-md flex-1 hover:bg-[#4a3019] transition-colors"
                        onClick={() => handleViewDetails(business)}
                      >
                        View Details
                      </button>
                      {!business.isActive && (
                        <button
                          className="bg-green-600 text-white py-2 px-4 rounded-md flex-1 hover:bg-green-700 transition-colors"
                          onClick={() => handleEnableClick(business._id)}
                        >
                          Enable
                        </button>
                      )}
                      <button
                        className="bg-red-600 text-white py-2 px-4 rounded-md flex-1 hover:bg-red-700 transition-colors"
                        onClick={() => handleDeleteClick(business._id)}
                      >
                        Delete
                      </button>
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
                  <li className="px-4 py-2 border rounded-l hover:bg-gray-100 cursor-pointer">
                    Previous
                  </li>
                  <li className="px-4 py-2 border hover:bg-gray-100 cursor-pointer">
                    {meta?.previousPage}
                  </li>
                </>
              )}
              <li className="px-4 py-2 bg-[#603F26] text-white border">
                {meta?.currentPage}
              </li>
              {meta?.nextPage && (
                <>
                  <li className="px-4 py-2 border hover:bg-gray-100 cursor-pointer">
                    {meta?.nextPage}
                  </li>
                  <li className="px-4 py-2 border rounded-r hover:bg-gray-100 cursor-pointer">
                    Next
                  </li>
                </>
              )}
            </ul>
          </nav>
        ) : null}

        {/* Business Details Dialog */}
        <BusinessDetailsDialog
          open={!!viewBusinessDetails}
          onClose={() => setViewBusinessDetails(null)}
          business={viewBusinessDetails}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={!!deleteBusinessId}
          onClose={() => setDeleteBusinessId(null)}
          onConfirm={handleDeleteConfirm}
          businessName={
            businesses.find(business => business._id === deleteBusinessId)?.name
          }
        />

        {/* Enable Business Dialog */}
        <EnableBusinessDialog
          open={!!enableBusinessId}
          onClose={() => setEnableBusinessId(null)}
          onConfirm={handleEnableConfirm}
          businessName={
            businesses.find(business => business._id === enableBusinessId)?.name
          }
        />
      </main>
    </ThemeProvider>
  );
};

export default ManageBusinesses;