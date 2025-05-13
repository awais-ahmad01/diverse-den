import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { showToast } from "../../../tools";
import {
  listBusinesses,
  deleteBusiness,
} from "../../../store/actions/businesses";
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
import InventoryIcon from "@mui/icons-material/Inventory";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import RestoreIcon from "@mui/icons-material/Restore";

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
            <h3 className="text-lg font-bold mb-2">Business Information</h3>
            <p>Name: {business?.name}</p>
            <p>Email: {business?.user?.email}</p>
            <p>Phone: {business?.user?.phone || "Not provided"}</p>
            <p>Business Description: {business?.description}</p>
            <p>
              Business Branches:
              {business?.branches?.length > 0 ? (
                <ul className="list-disc pl-5 mt-2">
                  {business?.branches.map((branch, index) => (
                    <li key={index}>{branch}</li>
                  ))}
                </ul>
              ) : (
                <span className="ml-2 text-gray-500">
                  No branches available
                </span>
              )}
            </p>
          </Grid>

          {/* Subscription Information */}
          <Grid item xs={12}>
            <hr className="my-4" />
            <h3 className="text-lg font-bold mb-2">Subscription Information</h3>
            <p>Plan: {business?.user?.activePlan?.name}</p>
            <p>Start Date: {business?.user?.planActivation}</p>
            <p>Expiry Date: {business?.user?.planExpiry}</p>
            {business?.user?.planExpiry < new Date() && (
              <p className="text-red-600 font-bold mt-2">
                Subscription expired on {business?.user?.planExpiry}
              </p>
            )}
          </Grid>

          {/* Additional Information */}
          <Grid item xs={12}>
            <hr className="my-4" />
            <h3 className="text-lg font-bold mb-2">Additional Information</h3>
            <p>Registration Date: {business?.createdAt}</p>
            <p>
              Owner: {business?.user?.firstname} {business?.user?.lastname}
            </p>
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

const ManageBusinesses = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { businesses, isloading, meta } = useSelector(
    (state) => state.businesses
  );

  const [viewBusinessDetails, setViewBusinessDetails] = useState(null);
  const [deleteBusinessId, setDeleteBusinessId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);

  const totalBusinesses = meta?.totalBusinesses || 0;

  const handleViewDetails = (business) => {
    setViewBusinessDetails(business);
  };

  const handleDeleteClick = (businessId) => {
    setDeleteBusinessId(businessId);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteBusiness(deleteBusinessId))
        .unwrap()
        .then((response) => {
          showToast("SUCCESS", "Business deleted successfully!");
        })
        .catch((error) => {
          showToast("ERROR", "Failed to delete Business");
        });
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setDeleteBusinessId(null);
    }
  };

  const applyFilters = () => {
    let filtered = [...businesses];

    if (searchQuery) {
      filtered = filtered.filter(
        (business) =>
          business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (business.user?.email && 
            business.user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (business) => business.status === statusFilter
      );
    }

    setFilteredBusinesses(filtered);
  };

  useEffect(() => {
    if (businesses) {
      setFilteredBusinesses(businesses);
    }
  }, [businesses]);

  useEffect(() => {
    dispatch(listBusinesses({}));
  }, [dispatch]);

  const handleNextPage = (page) => {
    if (page) {
      dispatch(listBusinesses({ pageNo: page }));
    }
  };

  const handlePrevPage = (page) => {
    if (page) {
      dispatch(listBusinesses({ pageNo: page }));
    }
  };

  if (isloading) {
    return <Loader />;
  }

  return (
    <ThemeProvider theme={theme}>
      <main className="relative bg-gray-50 flex flex-col pt-5 pb-10">
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
                    startAdornment: (
                      <SearchIcon sx={{ color: "gray", mr: 1 }} />
                    ),
                  }}
                />
                <div className="min-w-[200px]">
                  <label
                    htmlFor="status-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                    <option value="inactive">Inactive</option>
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
                          Business Name
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Business Owner
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
                        <TableRow key={business?._id}>
                          <TableCell>{business?.name}</TableCell>
                          <TableCell>
                            {business?.user?.firstname}{" "}
                            {business?.user?.lastname}
                          </TableCell>
                          <TableCell>
                            {business?.user?.activePlan?.name}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={business?.status?.charAt(0).toUpperCase() + business?.status?.slice(1)}
                              color={business?.status === "active" ? "success" : "error"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{business?.user?.planExpiry}</TableCell>
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
                              <Tooltip title="View Products">
                                <IconButton
                                  component={Link}
                                  to={`../businessProducts/${business?._id}`}
                                  onClick={() => {
                                    console.log(
                                      "View products for business:",
                                      business._id
                                    );
                                  }}
                                   color="primary"
                                >
                                  <InventoryIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Business">
                                <IconButton
                                  onClick={() =>
                                    handleDeleteClick(business._id)
                                  }
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
                    key={business?._id}
                    className="bg-white p-4 rounded-lg shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold">{business?.name}</h3>
                      </div>
                      <Chip
                        label={business?.status?.charAt(0).toUpperCase() + business?.status?.slice(1)}
                        color={business?.status === "active" ? "success" : "error"}
                        size="small"
                      />
                    </div>

                    <div className="space-y-2">
                      <p>ID: {business?._id.slice(-6)}</p>
                      <p>
                        Business Owner: {business?.user?.firstname}{" "}
                        {business?.user?.lastname}
                      </p>
                      <p>Plan: {business?.user?.activePlan?.name}</p>
                      <p>Expires: {business?.user?.planExpiry}</p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        className="bg-[#603F26] text-white py-2 px-4 rounded-md flex-1 hover:bg-[#4a3019] transition-colors"
                        onClick={() => handleViewDetails(business)}
                      >
                        View Details
                      </button>
                      <button
                        className="bg-[#603F26] text-white py-2 px-4 rounded-md flex-1 hover:bg-[#4a3019] transition-colors"
                        onClick={() => handleViewDetails(business)}
                      >
                        View Products
                      </button>
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
            businesses.find((business) => business._id === deleteBusinessId)
              ?.name
          }
        />
      </main>
    </ThemeProvider>
  );
};

export default ManageBusinesses;