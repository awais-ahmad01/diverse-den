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
  Grid,
  TextField
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

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
  const [open, setOpen] = useState(false);
  const [toRemove, setToRemove] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBranches, setFilteredBranches] = useState([]);

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
        window.location.reload();
      })
      .catch(() => {
        showToast("ERROR", "Failed to delete branch!");
      })
      .finally(() => {
        setOpen(false);
        setToRemove(null);
      });
  };

  const applyFilters = () => {
    if (!branches) return;

    let filtered = [...branches];

    if (searchQuery) {
      filtered = filtered.filter(
        (branch) =>
          branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          branch.branchCode.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBranches(filtered);
  };

  useEffect(() => {
    if (branches) {
      setFilteredBranches(branches);
    }
  }, [branches]);

  useEffect(() => {
    const business = user?.business;
    dispatch(getBranches({ business }));
  }, [dispatch, user]);

  if (isloading) {
    return <Loader />;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5 pb-9 ">
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
              startIcon={<AddCircleIcon />}
              component={Link}
              to="../addBranch"
            >
              Add Branch
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        {showFilters && (
          <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Search"
                    placeholder="Search by branch name or code"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <SearchIcon sx={{ color: "gray", mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", gap: 2 }}>
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
                        setFilteredBranches(branches);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}

        {/* Branches Content */}
        <div className="w-full px-4 md:px-8 lg:px-12 mt-4 flex-grow">
          {!filteredBranches || filteredBranches.length === 0 ? (
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
                      {filteredBranches.map((branch, index) => (
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
                                  to={`../viewbranch/${branch?._id}/${branch?.name}/${branch?.branchCode}`}
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
                {filteredBranches.map((branch, index) => (
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
                        to={`../viewbranch/${branch?._id}/${branch?.name}/${branch?.branchCode}`}
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