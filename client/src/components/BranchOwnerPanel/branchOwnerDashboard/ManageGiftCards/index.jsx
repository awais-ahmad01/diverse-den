import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { showToast, Loader } from "../../../../tools";
import { getGiftCards, addGiftCard, updateGiftCard, deleteGiftCard } from "../../../../store/actions/giftCards";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Chip,
  TextField,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Box,
  Select,
  MenuItem,
  Tooltip
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CardGiftcard as GiftCardIcon,
  FilterList as FilterListIcon,
  CloudUpload as CloudUploadIcon
} from "@mui/icons-material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
    secondary: {
      main: "#2E7D32",
    },
  },
});

const ManageGiftCards = () => {
  const { user } = useSelector(state => state.auth);
  const { giftCardsList, meta, isloading } = useSelector(state => state.giftCards);
  console.log("giftCardsList:", giftCardsList);
  console.log("meta:", meta);
  const dispatch = useDispatch();
  
  // State for gift cards data
  const [giftCards, setGiftCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // States for filter functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGiftCards, setFilteredGiftCards] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [codeFilter, setCodeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  
  // States for dialog management
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Form states
  const [currentGiftCard, setCurrentGiftCard] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    minPrice: "",
    maxPrice: "",
    description: "",
    imageFile: null,
    imagePreview: null
  });
  
  // Error state
  const [formErrors, setFormErrors] = useState({});
  
  // Initialize gift cards data from API response
  useEffect(() => {
    if (giftCardsList && giftCardsList.giftCards) {
      setGiftCards(giftCardsList.giftCards);
      setFilteredGiftCards(giftCardsList.giftCards);
    }
  }, [giftCardsList]);

  // Filter gift cards when filters change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, giftCards]);

  useEffect(() => {
    const businessId = user?.business;
    dispatch(getGiftCards({ businessId }));
  }, [user, dispatch]);
  
  const applyFilters = () => {
    let filtered = [...giftCards];
    
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(card => 
        card.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.description && card.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (codeFilter.trim() !== "") {
      filtered = filtered.filter(card =>
        card.code.toLowerCase().includes(codeFilter.toLowerCase())
      );
    }
    
    if (statusFilter !== "") {
      filtered = filtered.filter(card => card.status === statusFilter);
    }
    
    if (priceFilter !== "") {
      const price = parseFloat(priceFilter);
      if (!isNaN(price)) {
        filtered = filtered.filter(card => 
          parseFloat(card.minPrice) <= price && parseFloat(card.maxPrice) >= price
        );
      }
    }
    
    setFilteredGiftCards(filtered);
  };



  const handleNextPage = (page) => {
      const businessId = user?.business;
      if (businessId && page) {
        console.log("Next Page:", page);
        dispatch(getGiftCards({ businessId, pageNo: page }));
      }
    };
  
    const handlePrevPage = (page) => {
      const businessId = user?.business;
      if (businessId && page) {
        console.log("Previous Page:", page);
        dispatch(getGiftCards({ businessId, pageNo: page }));
      }
    };
  



  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageFile: file,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.code) errors.code = "Gift card code is required";
    if (!formData.minPrice) errors.minPrice = "Minimum price is required";
    else if (isNaN(formData.minPrice) || parseFloat(formData.minPrice) <= 0) 
      errors.minPrice = "Minimum price must be a positive number";
    
    if (!formData.maxPrice) errors.maxPrice = "Maximum price is required";
    else if (isNaN(formData.maxPrice) || parseFloat(formData.maxPrice) <= 0) 
      errors.maxPrice = "Maximum price must be a positive number";
    
    if (parseFloat(formData.minPrice) >= parseFloat(formData.maxPrice))
      errors.maxPrice = "Maximum price must be greater than minimum price";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleAddGiftCard = () => {
    if (!validateForm()) return;
    

    
    const businessId = user?.business;
  
    const formDataToSend = new FormData();
    formDataToSend.append("code", formData.code);
    formDataToSend.append("minPrice", formData.minPrice);
    formDataToSend.append("maxPrice", formData.maxPrice);
    formDataToSend.append("description", formData.description || "");
    
    if (formData.imageFile) {
      formDataToSend.append("imageUrl", formData.imageFile);
    }

    dispatch(addGiftCard({ businessId, formdata: formDataToSend }))
      .unwrap()
      .then((response) => {
        showToast("SUCCESS", "Gift card added successfully");
        setShowAddDialog(false);
        resetForm();
        
        // Refresh gift cards list
        dispatch(getGiftCards({ businessId }));
      })
      .catch((error) => {
        showToast("ERROR", "Failed to add gift card");
        console.error("Error adding gift card:", error);
      })
      
  };
  

// Update the handleEditGiftCard function
const handleEditGiftCard = () => {
  if (!validateForm()) return;
  
  
  const businessId = user?.business;

  const formDataToSend = new FormData();
  formDataToSend.append("giftCardId", currentGiftCard._id);
  formDataToSend.append("code", formData.code);
  formDataToSend.append("minPrice", formData.minPrice);
  formDataToSend.append("maxPrice", formData.maxPrice);
  formDataToSend.append("description", formData.description || "");
  
  // Only append image if it exists
  if (formData.imageFile) {
    formDataToSend.append("imageUrl", formData.imageFile);
  }

  dispatch(updateGiftCard({ businessId, formdata: formDataToSend }))
    .unwrap()
    .then((response) => {
      showToast("SUCCESS", "Gift card updated successfully");
      setShowEditDialog(false);
      resetForm();
      
      // Refresh the gift cards list
      dispatch(getGiftCards({ businessId }));
    })
    .catch((error) => {
      showToast("ERROR", "Failed to update gift card");
      console.error("Error updating gift card:", error);
    })
   
};
  

const handleDeleteGiftCard = () => {

  const giftCardId = currentGiftCard._id
  
  dispatch(deleteGiftCard(giftCardId))
    .unwrap()
    .then((response) => {
      showToast("SUCCESS", "Gift card deleted successfully");
      setShowDeleteDialog(false);
      
      // // Refresh the gift cards list
      // const businessId = user?.business;
      // dispatch(getGiftCards({ businessId }));
    })
    .catch((error) => {
      showToast("ERROR", "Failed to delete gift card");
      console.error("Error deleting gift card:", error);
    })
   
};
  
  const openDeleteDialog = (giftCard) => {
    setCurrentGiftCard(giftCard);
    setShowDeleteDialog(true);
  };
  
  const resetForm = () => {
    setFormData({
      code: "",
      minPrice: "",
      maxPrice: "",
      description: "",
      imageFile: null,
      imagePreview: null
    });
    setFormErrors({});
    setCurrentGiftCard(null);
  };
  
  const getStatusChipColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "redeemed":
        return "primary";
      case "expired":
        return "error";
      default:
        return "default";
    }
  };
  
  const getStatusColorClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "redeemed":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const formatCurrency = (amount) => {
    return `Rs ${parseFloat(amount).toFixed(2)}`;
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
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
            Gift Cards
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Create, view, update, and manage gift cards for your customers
          </Typography>
        </Box>

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
                {String(filteredGiftCards.length).padStart(2, "0")}
              </Typography>
              <Typography variant="body2">Total Gift Cards</Typography>
            </Paper>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setShowAddDialog(true)}
            >
              Add New Gift Card
            </Button>

            <Button
              variant="outlined"
              color="primary"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </Box>
        </Box>

        {showFilters && (
          <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <TextField
                  label="Gift Card Code"
                  placeholder="Search by code"
                  value={codeFilter}
                  onChange={(e) => setCodeFilter(e.target.value)}
                />
                <TextField
                  label="Price Range"
                  placeholder="Search by price"
                  type="number"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                  }}
                />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  displayEmpty
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="redeemed">Redeemed</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
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
                    setCodeFilter("");
                    setStatusFilter("");
                    setPriceFilter("");
                    setFilteredGiftCards(giftCards);
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            </Paper>
          </Box>
        )}
        
        <div className="w-full px-4 md:px-8 lg:px-12 mt-4 flex-grow">
          {filteredGiftCards.length === 0 ? (
            <div className="text-center py-8">
              <GiftCardIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                No gift cards found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {searchTerm || codeFilter || statusFilter || priceFilter ? 
                  "Try different filter options" : 
                  "Create your first gift card to get started"}
              </Typography>
            </div>
          ) : (
            <>
              {/* Desktop view */}
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden xl:block">
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="gift cards table">
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
                          Price Range
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
                          Description
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Created On
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Image
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
                      {filteredGiftCards.map((giftCard) => (
                        <TableRow key={giftCard._id}>
                          <TableCell className="font-medium">{giftCard.code}</TableCell>
                          <TableCell>{formatCurrency(giftCard.minPrice)} - {formatCurrency(giftCard.maxPrice)}</TableCell>
                          <TableCell>
                            <Chip
                              label={giftCard?.status?.charAt(0).toUpperCase() + giftCard.status.slice(1)}
                              color={getStatusChipColor(giftCard.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {giftCard.description ? (
                              giftCard.description.length > 30 
                                ? `${giftCard.description.substring(0, 30)}...` 
                                : giftCard.description
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </TableCell>
                          <TableCell>{formatDate(giftCard.createdAt)}</TableCell>
                          <TableCell>
                            {giftCard.imagePath ? (
                              <img 
                                src={giftCard.imagePath} 
                                alt={giftCard.code}
                                style={{ width: '60px', height: '40px', objectFit: 'cover' }}
                              />
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Tooltip title="Edit Gift Card">
                                <IconButton
                                  color="primary"
                                  onClick={() => openEditDialog(giftCard)}
                                  disabled={giftCard.status !== "active"}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Gift Card">
                                <IconButton
                                  color="error"
                                  onClick={() => openDeleteDialog(giftCard)}
                                  disabled={giftCard.status !== "active"}
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
                {filteredGiftCards.map((giftCard) => (
                  <div
                    key={giftCard._id}
                    className="bg-white p-4 rounded-lg shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold">{giftCard.code}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(giftCard.createdAt)}
                        </p>
                      </div>
                      <Chip
                        label={giftCard.status?.charAt(0).toUpperCase() + giftCard.status.slice(1)}
                        className={getStatusColorClass(giftCard.status)}
                      />
                    </div>

                    <div className="space-y-2">
                      <p>Price Range: {formatCurrency(giftCard.minPrice)} - {formatCurrency(giftCard.maxPrice)}</p>
                      <p>Description: {giftCard.description || "—"}</p>
                      {giftCard.imagePath && (
                        <div className="mt-2">
                          <img 
                            src={giftCard.imagePath} 
                            alt={giftCard.code}
                            className="h-20 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => openEditDialog(giftCard)}
                        disabled={giftCard.status !== "active"}
                        fullWidth
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => openDeleteDialog(giftCard)}
                        disabled={giftCard.status !== "active"}
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
        
        {/* Add Gift Card Dialog */}
        <Dialog
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle className="bg-[#603F26] text-white flex justify-between items-center">
            Add New Gift Card
          </DialogTitle>
          <DialogContent className="mt-4">
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="code"
                  label="Gift Card Code"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.code}
                  onChange={handleInputChange}
                  error={!!formErrors.code}
                  helperText={formErrors.code}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="minPrice"
                  label="Min Price"
                  type="number"
                  variant="outlined"
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                  }}
                  value={formData.minPrice}
                  onChange={handleInputChange}
                  error={!!formErrors.minPrice}
                  helperText={formErrors.minPrice}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="maxPrice"
                  label="Max Price"
                  type="number"
                  variant="outlined"
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                  }}
                  value={formData.maxPrice}
                  onChange={handleInputChange}
                  error={!!formErrors.maxPrice}
                  helperText={formErrors.maxPrice}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ 
                  border: '1px dashed #ccc', 
                  p: 2, 
                  borderRadius: 1,
                  textAlign: 'center',
                  mb: 2
                }}>
                  {formData.imagePreview ? (
                    <Box>
                      <img 
                        src={formData.imagePreview} 
                        alt="Gift card preview" 
                        style={{ maxHeight: '150px', maxWidth: '100%', marginBottom: '16px' }}
                      />
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        onClick={() => setFormData({...formData, imageFile: null, imagePreview: null})}
                      >
                        Remove Image
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="contained-button-file"
                        type="file"
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="contained-button-file">
                        <Button 
                          variant="outlined" 
                          component="span" 
                          startIcon={<CloudUploadIcon />}
                        >
                          Upload Gift Card Image
                        </Button>
                      </label>
                      <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 1 }}>
                        Recommended size: 300x200 pixels
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description (Optional)"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className="px-4 pb-4">
            <Button 
              onClick={() => {
                setShowAddDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddGiftCard}
            >
              Create Gift Card
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Edit Gift Card Dialog */}
        <Dialog
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle className="bg-[#603F26] text-white flex justify-between items-center">
            Edit Gift Card
          </DialogTitle>
          <DialogContent className="mt-4">
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="code"
                  label="Gift Card Code"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.code}
                  onChange={handleInputChange}
                  error={!!formErrors.code}
                  helperText={formErrors.code}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="minPrice"
                  label="Min Price"
                  type="number"
                  variant="outlined"
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                  }}
                  value={formData.minPrice}
                  onChange={handleInputChange}
                  error={!!formErrors.minPrice}
                  helperText={formErrors.minPrice}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="maxPrice"
                  label="Max Price"
                  type="number"
                  variant="outlined"
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                  }}
                  value={formData.maxPrice}
                  onChange={handleInputChange}
                  error={!!formErrors.maxPrice}
                  helperText={formErrors.maxPrice}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ 
                  border: '1px dashed #ccc', 
                  p: 2, 
                  borderRadius: 1,
                  textAlign: 'center',
                  mb: 2
                }}>
                  {formData.imagePreview ? (
                    <Box>
                      <img 
                        src={formData.imagePreview} 
                        alt="Gift card preview" 
                        style={{ maxHeight: '150px', maxWidth: '100%', marginBottom: '16px' }}
                      />
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        onClick={() => setFormData({...formData, imageFile: null, imagePreview: null})}
                      >
                        Remove Image
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="edit-contained-button-file"
                        type="file"
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="edit-contained-button-file">
                        <Button 
                          variant="outlined" 
                          component="span" 
                          startIcon={<CloudUploadIcon />}
                        >
                          Upload Gift Card Image
                        </Button>
                      </label>
                      <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 1 }}>
                        Recommended size: 300x200 pixels
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description (Optional)"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className="px-4 pb-4">
            <Button 
              onClick={() => {
                setShowEditDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditGiftCard}
            >
              Update Gift Card
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        >
          <DialogTitle className="text-red-600">
            Delete Gift Card
          </DialogTitle>
          <DialogContent>
            <DialogContentText className="mb-3">
              Are you sure you want to delete the gift card <strong>{currentGiftCard?.code}</strong>? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleDeleteGiftCard}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default ManageGiftCards;