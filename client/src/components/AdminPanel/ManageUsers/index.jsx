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
import { listUsers, deleteUser } from "../../../store/actions/users";

// Assuming these actions would be created in the Redux store
// import { listUsers, deleteUser } from "../../../../store/actions/users";

const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
  },
});

const UserDetailsDialog = ({ open, onClose, user }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-[#603F26] text-white">
        User Details - {user._id}
      </DialogTitle>
      <DialogContent className="mt-4">
        <Grid container spacing={3}>
          {/* User Information */}
          <Grid item xs={12}>
            <h3 className="text-lg font-bold mb-2">
              Personal Information
            </h3>
            <p>
              Name: {user.firstname} {user.lastname}
            </p>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone || "Not provided"}</p>
          </Grid>

          {/* Address Information */}
          <Grid item xs={12}>
            <hr className="my-4" />
            <h3 className="text-lg font-bold mb-2">
              Address
            </h3>
            <p>{user.address || "No address provided"}</p>
          </Grid>

          {/* Account Information */}
          <Grid item xs={12}>
            <hr className="my-4" />
            <h3 className="text-lg font-bold mb-2">
              Account Information
            </h3>
            <p>Role: {user.role}</p>
            {/* <p>
              Account Status: 
              <Chip
                label={user.isActive ? "Active" : "Inactive"}
                color={user.isActive ? "success" : "error"}
                className="ml-2"
              />
            </p> */}
            <p>
              Registration Date: {format(new Date(user.createdAt), "PPP")}
            </p>
            {user.lastLogin && (
              <p>
                Last Login: {format(new Date(user.lastLogin), "PPP")}
              </p>
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
  userName,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="text-red-600">Delete User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete user {userName}? This action
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

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { users, isloading, meta } = useSelector((state) => state.users);

  const [viewUserDetails, setViewUserDetails] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const totalUsers = meta?.totalUsers || 0;

  const handleViewDetails = (user) => {
    setViewUserDetails(user);
  };

  const handleDeleteClick = (userId) => {
    setDeleteUserId(userId);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteUser(deleteUserId))
        .unwrap()
        .then((response) => {
          showToast("SUCCESS", "User deleted successfully!");
        })
        .catch((error) => {
          showToast("ERROR", "Failed to delete user");
        });

    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setDeleteUserId(null);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    if (users) {
      setFilteredUsers(users);
    }
  }, [users]);

  useEffect(() => {
    console.log("Dispatching listUsers...");
    dispatch(listUsers({})); 
  }, [dispatch]);


  const handleNextPage = (page) => {
     
      if (page) {
        dispatch(listUsers({pageNo: page }));
      }
    };
  
    const handlePrevPage = (page) => {
      if (page) {
        dispatch(listUsers({pageNo: page }));
      }
    };



  if (isloading) {
    return <Loader />;
  }

  return (
    <ThemeProvider theme={theme}>
      <main className="relative bg-gray-50 flex flex-col pt-5">
        {/* Header */}
        <header className="px-4 md:px-6 lg:px-12 mb-6">
          <h1 className="text-3xl font-bold text-[#603F26]">
            Manage Users
          </h1>
        </header>

        {/* Stats and Actions */}
        <section className="px-4 md:px-6 lg:px-12 flex justify-between items-center mb-6">
          <div>
            <div className="bg-[#603F26] text-white px-6 py-4 rounded-lg">
              <h2 className="text-3xl font-bold">
                {String(totalUsers).padStart(2, "0")}
              </h2>
              <p className="text-sm">Total Users</p>
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
                  <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    id="role-filter"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#603F26]"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Branch Owner">Branch Owner</option>
                    <option value="Customer">Customer</option>
                    <option value="Salesperson">Salesperson</option>
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
                      setRoleFilter("");
                      setFilteredUsers(users);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Users Content */}
        <section className="w-full px-4 md:px-8 lg:px-12 mt-4 flex-grow">
          {!filteredUsers || filteredUsers.length === 0 ? (
            <div className="text-3xl font-bold flex justify-center">
              No Users found
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden md:block">
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="users table">
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
                          Email
                        </TableCell>
                      
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Role
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
                      {filteredUsers.map((user) => (
                        <TableRow key={user?.userId}>
                          <TableCell>{user?.userId.slice(-6)}</TableCell>
                          <TableCell>
                            {user.firstname} {user.lastname}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.role}
                              color={
                                user.role === "Admin"
                                  ? "primary"
                                  : user.role === "Branch Owner"
                                  ? "secondary"
                                  : user.role === "Salesperson"
                                  ? "success"
                                  : "default"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                          {user?.createdAt}
                                                    </TableCell>
                          
                          <TableCell>
                            <div className="flex gap-2">
                              <Tooltip title="View Details">
                                <IconButton
                                  onClick={() => handleViewDetails(user)}
                                  color="primary"
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete User">
                                <IconButton
                                  onClick={() => handleDeleteClick(user?.userId)}
                                  color="error"
                                  disabled={user?.userId === currentUser._id}
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
                {filteredUsers.map((user) => (
                  <article
                    key={user?.userId}
                    className="bg-white p-4 rounded-lg shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold">
                          {user.firstname} {user.lastname}
                        </h3>
                        <p className="text-gray-600">{user.email}</p>
                      </div>
                      <Chip
                        label={user.role}
                        color={
                          user.role === "Admin"
                            ? "primary"
                            : user.role === "Branch Owner"
                            ? "secondary"
                            : "default"
                        }
                        size="small"
                      />
                    </div>

                    <div className="space-y-2">
                      <p>ID: {user?.userId.slice(-6)}</p>
                      
                      <p>Registered: {user?.createdAt}</p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        className="bg-[#603F26] text-white py-2 px-4 rounded-md flex-1 hover:bg-[#4a3019] transition-colors"
                        onClick={() => handleViewDetails(user)}
                      >
                        View Details
                      </button>
                      <button
                        className={`bg-red-600 text-white py-2 px-4 rounded-md flex-1 hover:bg-red-700 transition-colors ${
                          user._id === currentUser._id ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => handleDeleteClick(user?.userId)}
                        disabled={user?.userId === currentUser._id}
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

        {/* User Details Dialog */}
        <UserDetailsDialog
          open={!!viewUserDetails}
          onClose={() => setViewUserDetails(null)}
          user={viewUserDetails}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={!!deleteUserId}
          onClose={() => setDeleteUserId(null)}
          onConfirm={handleDeleteConfirm}
          userName={
            users.find(user => user?.userId === deleteUserId)?.firstname + " " + 
            users.find(user => user?.userId === deleteUserId)?.lastname
          }
        />
      </main>
    </ThemeProvider>
  );
};

export default ManageUsers;