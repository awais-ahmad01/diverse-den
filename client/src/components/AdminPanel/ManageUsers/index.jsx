import React, { useEffect, useState } from "react";
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
  Grid,
  Chip,
  IconButton,
  Tooltip,
  TextField,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { format } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";

// Mock data
const MOCK_USERS = [
  {
    _id: "user123456",
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA",
    role: "Admin",
    isActive: true,
    createdAt: "2024-01-15T12:00:00Z",
    lastLogin: "2024-02-20T14:30:00Z"
  },
  {
    _id: "user234567",
    firstname: "Jane",
    lastname: "Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Ave, Somewhere, USA",
    role: "User",
    isActive: true,
    createdAt: "2024-01-20T09:15:00Z",
    lastLogin: "2024-02-21T10:45:00Z"
  },
  {
    _id: "user345678",
    firstname: "Robert",
    lastname: "Johnson",
    email: "robert@example.com",
    phone: "+1 (555) 222-3333",
    address: "789 Pine Rd, Elsewhere, USA",
    role: "Business",
    isActive: false,
    createdAt: "2024-01-25T16:30:00Z",
    lastLogin: "2024-02-10T08:20:00Z"
  },
  {
    _id: "user456789",
    firstname: "Emily",
    lastname: "Wilson",
    email: "emily.wilson@example.com",
    phone: "+1 (555) 444-5555",
    address: "",
    role: "User",
    isActive: true,
    createdAt: "2024-02-01T11:45:00Z",
    lastLogin: "2024-02-22T13:10:00Z"
  },
  {
    _id: "user567890",
    firstname: "Michael",
    lastname: "Brown",
    email: "michael.brown@example.com",
    phone: null,
    address: "222 Maple Dr, Nowheresville, USA",
    role: "Business",
    isActive: true,
    createdAt: "2024-02-05T14:20:00Z",
    lastLogin: "2024-02-23T09:30:00Z"
  },
  {
    _id: "user678901",
    firstname: "Sarah",
    lastname: "Davis",
    email: "sarah.davis@example.com",
    phone: "+1 (555) 777-8888",
    address: "333 Elm St, Anystate, USA",
    role: "Admin",
    isActive: true,
    createdAt: "2024-02-10T10:00:00Z",
    lastLogin: "2024-02-24T11:15:00Z"
  }
];

// Mock auth state
const MOCK_CURRENT_USER = {
  _id: "user123456",
  firstname: "John",
  lastname: "Doe",
  email: "john.doe@example.com",
  role: "Admin"
};

// Mock toast function
const showToast = (type, message) => {
  alert(`${type}: ${message}`);
};

// Loader component
const Loader = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#603F26]"></div>
  </div>
);

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
            <p>
              Account Status: 
              <Chip
                label={user.isActive ? "Active" : "Inactive"}
                color={user.isActive ? "success" : "error"}
                className="ml-2"
              />
            </p>
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
  // State
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({
    totalUsers: 0,
    currentPage: 1,
    nextPage: 2,
    previousPage: null
  });
  const [viewUserDetails, setViewUserDetails] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Mock current user from auth state
  const currentUser = MOCK_CURRENT_USER;

  const handleViewDetails = (user) => {
    setViewUserDetails(user);
  };

  const handleDeleteClick = (userId) => {
    setDeleteUserId(userId);
  };

  const handleDeleteConfirm = async () => {
    // Simulate API call
    try {
      setIsLoading(true);
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove user from list
      setUsers(prevUsers => prevUsers.filter(user => user._id !== deleteUserId));
      setFilteredUsers(prevUsers => prevUsers.filter(user => user._id !== deleteUserId));
      
      // Update meta
      setMeta(prevMeta => ({
        ...prevMeta,
        totalUsers: prevMeta.totalUsers - 1
      }));
      
      showToast("SUCCESS", "User deleted successfully!");
    } catch (error) {
      console.error("Failed to delete user:", error);
      showToast("ERROR", "Failed to delete user");
    } finally {
      setIsLoading(false);
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

  // Load mock data
  useEffect(() => {
    const loadMockData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUsers(MOCK_USERS);
        setFilteredUsers(MOCK_USERS);
        setMeta({
          totalUsers: MOCK_USERS.length,
          currentPage: 1,
          nextPage: 2,
          previousPage: null,
        });
      } catch (error) {
        console.error("Error loading mock data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMockData();
  }, []);

  if (isLoading) {
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
                {String(meta.totalUsers).padStart(2, "0")}
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
                    <option value="User">User</option>
                    <option value="Business">Business</option>
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
                      {filteredUsers.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>{user._id.slice(-6)}</TableCell>
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
                                  : user.role === "Business"
                                  ? "secondary"
                                  : "default"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={user.isActive ? "Active" : "Inactive"}
                              color={user.isActive ? "success" : "error"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {format(new Date(user.createdAt), "PP")}
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
                                  onClick={() => handleDeleteClick(user._id)}
                                  color="error"
                                  disabled={user._id === currentUser._id}
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
                    key={user._id}
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
                            : user.role === "Business"
                            ? "secondary"
                            : "default"
                        }
                        size="small"
                      />
                    </div>

                    <div className="space-y-2">
                      <p>ID: {user._id.slice(-6)}</p>
                      <p>Status: 
                        <Chip
                          label={user.isActive ? "Active" : "Inactive"}
                          color={user.isActive ? "success" : "error"}
                          size="small"
                          className="ml-2"
                        />
                      </p>
                      <p>Registered: {format(new Date(user.createdAt), "PP")}</p>
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
                        onClick={() => handleDeleteClick(user._id)}
                        disabled={user._id === currentUser._id}
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
            users.find(user => user._id === deleteUserId)?.firstname + " " + 
            users.find(user => user._id === deleteUserId)?.lastname
          }
        />
      </main>
    </ThemeProvider>
  );
};

export default ManageUsers;



// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { showToast } from "../../../tools";
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
// import { format } from "date-fns";
// import DeleteIcon from "@mui/icons-material/Delete";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import SearchIcon from "@mui/icons-material/Search";

// // Assuming these actions would be created in the Redux store
// // import { listUsers, deleteUser } from "../../../../store/actions/users";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#603F26",
//     },
//   },
// });

// const UserDetailsDialog = ({ open, onClose, user }) => {
//   if (!user) return null;

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle className="bg-[#603F26] text-white">
//         User Details - {user._id}
//       </DialogTitle>
//       <DialogContent className="mt-4">
//         <Grid container spacing={3}>
//           {/* User Information */}
//           <Grid item xs={12}>
//             <h3 className="text-lg font-bold mb-2">
//               Personal Information
//             </h3>
//             <p>
//               Name: {user.firstname} {user.lastname}
//             </p>
//             <p>Email: {user.email}</p>
//             <p>Phone: {user.phone || "Not provided"}</p>
//           </Grid>

//           {/* Address Information */}
//           <Grid item xs={12}>
//             <hr className="my-4" />
//             <h3 className="text-lg font-bold mb-2">
//               Address
//             </h3>
//             <p>{user.address || "No address provided"}</p>
//           </Grid>

//           {/* Account Information */}
//           <Grid item xs={12}>
//             <hr className="my-4" />
//             <h3 className="text-lg font-bold mb-2">
//               Account Information
//             </h3>
//             <p>Role: {user.role}</p>
//             <p>
//               Account Status: 
//               <Chip
//                 label={user.isActive ? "Active" : "Inactive"}
//                 color={user.isActive ? "success" : "error"}
//                 className="ml-2"
//               />
//             </p>
//             <p>
//               Registration Date: {format(new Date(user.createdAt), "PPP")}
//             </p>
//             {user.lastLogin && (
//               <p>
//                 Last Login: {format(new Date(user.lastLogin), "PPP")}
//               </p>
//             )}
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

// const DeleteConfirmationDialog = ({
//   open,
//   onClose,
//   onConfirm,
//   userName,
// }) => {
//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle className="text-red-600">Delete User</DialogTitle>
//       <DialogContent>
//         <DialogContentText>
//           Are you sure you want to delete user {userName}? This action
//           cannot be undone.
//         </DialogContentText>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="primary">
//           Cancel
//         </Button>
//         <Button onClick={onConfirm} color="error" variant="contained">
//           Delete
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// const ManageUsers = () => {
//   const dispatch = useDispatch();
//   const { user: currentUser } = useSelector((state) => state.auth);
//   const { users, isLoading, meta } = useSelector((state) => state.users);

//   const [viewUserDetails, setViewUserDetails] = useState(null);
//   const [deleteUserId, setDeleteUserId] = useState(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [roleFilter, setRoleFilter] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState([]);

//   const totalUsers = meta?.totalUsers || 0;

//   const handleViewDetails = (user) => {
//     setViewUserDetails(user);
//   };

//   const handleDeleteClick = (userId) => {
//     setDeleteUserId(userId);
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       await dispatch(deleteUser(deleteUserId))
//         .unwrap()
//         .then((response) => {
//           showToast("SUCCESS", "User deleted successfully!");
//         })
//         .catch((error) => {
//           showToast("ERROR", "Failed to delete user");
//         });

//       dispatch(listUsers());
//     } catch (error) {
//       console.error("Failed to delete user:", error);
//     } finally {
//       setDeleteUserId(null);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...users];

//     if (searchQuery) {
//       filtered = filtered.filter(
//         (user) =>
//           user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           user.email.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     if (roleFilter) {
//       filtered = filtered.filter((user) => user.role === roleFilter);
//     }

//     setFilteredUsers(filtered);
//   };

//   useEffect(() => {
//     if (users) {
//       setFilteredUsers(users);
//     }
//   }, [users]);

//   useEffect(() => {
//     dispatch(listUsers());
//   }, [dispatch]);

//   if (isLoading) {
//     return <Loader />;
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <main className="relative bg-gray-50 flex flex-col pt-5">
//         {/* Header */}
//         <header className="px-4 md:px-6 lg:px-12 mb-6">
//           <h1 className="text-3xl font-bold text-[#603F26]">
//             Manage Users
//           </h1>
//         </header>

//         {/* Stats and Actions */}
//         <section className="px-4 md:px-6 lg:px-12 flex justify-between items-center mb-6">
//           <div>
//             <div className="bg-[#603F26] text-white px-6 py-4 rounded-lg">
//               <h2 className="text-3xl font-bold">
//                 {String(totalUsers).padStart(2, "0")}
//               </h2>
//               <p className="text-sm">Total Users</p>
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
//                   placeholder="Search by name or email"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   InputProps={{
//                     startAdornment: <SearchIcon sx={{ color: "gray", mr: 1 }} />,
//                   }}
//                 />
//                 <div className="min-w-[200px]">
//                   <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">
//                     Role
//                   </label>
//                   <select
//                     id="role-filter"
//                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#603F26]"
//                     value={roleFilter}
//                     onChange={(e) => setRoleFilter(e.target.value)}
//                   >
//                     <option value="">All Roles</option>
//                     <option value="Admin">Admin</option>
//                     <option value="User">User</option>
//                     <option value="Business">Business</option>
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
//                       setRoleFilter("");
//                       setFilteredUsers(users);
//                     }}
//                   >
//                     Clear Filters
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Users Content */}
//         <section className="w-full px-4 md:px-8 lg:px-12 mt-4 flex-grow">
//           {!filteredUsers || filteredUsers.length === 0 ? (
//             <div className="text-3xl font-bold flex justify-center">
//               No Users found
//             </div>
//           ) : (
//             <>
//               {/* Desktop View */}
//               <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden md:block">
//                 <TableContainer component={Paper}>
//                   <Table sx={{ minWidth: 650 }} aria-label="users table">
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
//                           Email
//                         </TableCell>
//                         <TableCell
//                           sx={{
//                             color: "white",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Role
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
//                       {filteredUsers.map((user) => (
//                         <TableRow key={user._id}>
//                           <TableCell>{user._id.slice(-6)}</TableCell>
//                           <TableCell>
//                             {user.firstname} {user.lastname}
//                           </TableCell>
//                           <TableCell>{user.email}</TableCell>
//                           <TableCell>
//                             <Chip
//                               label={user.role}
//                               color={
//                                 user.role === "Admin"
//                                   ? "primary"
//                                   : user.role === "Business"
//                                   ? "secondary"
//                                   : "default"
//                               }
//                               size="small"
//                             />
//                           </TableCell>
//                           <TableCell>
//                             <Chip
//                               label={user.isActive ? "Active" : "Inactive"}
//                               color={user.isActive ? "success" : "error"}
//                               size="small"
//                             />
//                           </TableCell>
//                           <TableCell>
//                             {format(new Date(user.createdAt), "PP")}
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex gap-2">
//                               <Tooltip title="View Details">
//                                 <IconButton
//                                   onClick={() => handleViewDetails(user)}
//                                   color="primary"
//                                 >
//                                   <VisibilityIcon />
//                                 </IconButton>
//                               </Tooltip>
//                               <Tooltip title="Delete User">
//                                 <IconButton
//                                   onClick={() => handleDeleteClick(user._id)}
//                                   color="error"
//                                   disabled={user._id === currentUser._id}
//                                 >
//                                   <DeleteIcon />
//                                 </IconButton>
//                               </Tooltip>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </div>

//               {/* Mobile View */}
//               <div className="block md:hidden space-y-4">
//                 {filteredUsers.map((user) => (
//                   <article
//                     key={user._id}
//                     className="bg-white p-4 rounded-lg shadow"
//                   >
//                     <div className="flex justify-between items-start mb-3">
//                       <div>
//                         <h3 className="font-bold">
//                           {user.firstname} {user.lastname}
//                         </h3>
//                         <p className="text-gray-600">{user.email}</p>
//                       </div>
//                       <Chip
//                         label={user.role}
//                         color={
//                           user.role === "Admin"
//                             ? "primary"
//                             : user.role === "Business"
//                             ? "secondary"
//                             : "default"
//                         }
//                         size="small"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <p>ID: {user._id.slice(-6)}</p>
//                       <p>Status: 
//                         <Chip
//                           label={user.isActive ? "Active" : "Inactive"}
//                           color={user.isActive ? "success" : "error"}
//                           size="small"
//                           className="ml-2"
//                         />
//                       </p>
//                       <p>Registered: {format(new Date(user.createdAt), "PP")}</p>
//                     </div>

//                     <div className="mt-4 flex gap-2">
//                       <button
//                         className="bg-[#603F26] text-white py-2 px-4 rounded-md flex-1 hover:bg-[#4a3019] transition-colors"
//                         onClick={() => handleViewDetails(user)}
//                       >
//                         View Details
//                       </button>
//                       <button
//                         className={`bg-red-600 text-white py-2 px-4 rounded-md flex-1 hover:bg-red-700 transition-colors ${
//                           user._id === currentUser._id ? "opacity-50 cursor-not-allowed" : ""
//                         }`}
//                         onClick={() => handleDeleteClick(user._id)}
//                         disabled={user._id === currentUser._id}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </article>
//                 ))}
//               </div>
//             </>
//           )}
//         </section>

//         {/* Pagination */}
//         {meta?.nextPage || meta?.previousPage ? (
//           <nav className="w-full flex justify-center items-center my-16">
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
//         ) : null}

//         {/* User Details Dialog */}
//         <UserDetailsDialog
//           open={!!viewUserDetails}
//           onClose={() => setViewUserDetails(null)}
//           user={viewUserDetails}
//         />

//         {/* Delete Confirmation Dialog */}
//         <DeleteConfirmationDialog
//           open={!!deleteUserId}
//           onClose={() => setDeleteUserId(null)}
//           onConfirm={handleDeleteConfirm}
//           userName={
//             users.find(user => user._id === deleteUserId)?.firstname + " " + 
//             users.find(user => user._id === deleteUserId)?.lastname
//           }
//         />
//       </main>
//     </ThemeProvider>
//   );
// };

// export default ManageUsers;