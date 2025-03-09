import React, { useEffect, useState } from "react";
import { showToast, Loader } from "../../../../tools";
import {
  Button,
  Card,
  CardContent,
  CardActions,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CardGiftcard as GiftCardIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from "@mui/icons-material";
import { useSelector } from "react-redux";

// Mock data
const MOCK_GIFT_CARDS = [
  {
    _id: "gc1",
    code: "GIFT100",
    value: 100,
    expiryDate: "2025-12-31",
    status: "active",
    description: "Holiday special gift card",
    createdAt: "2023-11-15"
  },
  {
    _id: "gc2",
    code: "BDAY50",
    value: 50,
    expiryDate: "2025-06-30",
    status: "active",
    description: "Birthday celebration gift card",
    createdAt: "2023-10-20"
  },
  {
    _id: "gc3",
    code: "WELCOME25",
    value: 25,
    expiryDate: "2025-04-15",
    status: "redeemed",
    description: "Welcome bonus for new customers",
    createdAt: "2023-09-05"
  },
  {
    _id: "gc4",
    code: "LOYAL200",
    value: 200,
    expiryDate: "2024-12-31",
    status: "expired",
    description: "Loyalty reward for premium customers",
    createdAt: "2023-08-10"
  },
  {
    _id: "gc5",
    code: "PROMO75",
    value: 75,
    expiryDate: "2025-09-30",
    status: "active",
    description: "Promotional gift card for special events",
    createdAt: "2023-11-01"
  }
];

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
  
  // State for mock data
  const [giftCards, setGiftCards] = useState(MOCK_GIFT_CARDS);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGiftCards, setFilteredGiftCards] = useState(MOCK_GIFT_CARDS);
  
  // States for dialog management
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Form states
  const [currentGiftCard, setCurrentGiftCard] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    value: "",
    expiryDate: "",
    status: "active",
    description: ""
  });
  
  // Error state
  const [formErrors, setFormErrors] = useState({});
  
  // Filter gift cards when search term changes
  useEffect(() => {
    const filtered = giftCards.filter(card => 
      card.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGiftCards(filtered);
  }, [searchTerm, giftCards]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.code) errors.code = "Gift card code is required";
    if (!formData.value) errors.value = "Value is required";
    else if (isNaN(formData.value) || parseFloat(formData.value) <= 0) 
      errors.value = "Value must be a positive number";
    
    if (!formData.expiryDate) errors.expiryDate = "Expiry date is required";
    else {
      const today = new Date();
      const expiryDate = new Date(formData.expiryDate);
      if (expiryDate < today) errors.expiryDate = "Expiry date cannot be in the past";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleAddGiftCard = () => {
    if (!validateForm()) return;
    
    // Simulate API delay
    setIsLoading(true);
    
    setTimeout(() => {
      const newGiftCard = {
        _id: `gc${Date.now()}`,
        ...formData,
        value: parseFloat(formData.value),
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setGiftCards([...giftCards, newGiftCard]);
      showToast("SUCCESS", "Gift card added successfully");
      setShowAddDialog(false);
      resetForm();
      setIsLoading(false);
    }, 500);
  };
  
  const handleEditGiftCard = () => {
    if (!validateForm()) return;
    
    // Simulate API delay
    setIsLoading(true);
    
    setTimeout(() => {
      const updatedGiftCards = giftCards.map(card => 
        card._id === currentGiftCard._id 
          ? { 
              ...card, 
              code: formData.code,
              value: parseFloat(formData.value),
              expiryDate: formData.expiryDate,
              status: formData.status,
              description: formData.description
            } 
          : card
      );
      
      setGiftCards(updatedGiftCards);
      showToast("SUCCESS", "Gift card updated successfully");
      setShowEditDialog(false);
      resetForm();
      setIsLoading(false);
    }, 500);
  };
  
  const handleDeleteGiftCard = () => {
    // Simulate API delay
    setIsLoading(true);
    
    setTimeout(() => {
      const updatedGiftCards = giftCards.filter(card => card._id !== currentGiftCard._id);
      setGiftCards(updatedGiftCards);
      showToast("SUCCESS", "Gift card deleted successfully");
      setShowDeleteDialog(false);
      setIsLoading(false);
    }, 500);
  };
  
  const openEditDialog = (giftCard) => {
    setCurrentGiftCard(giftCard);
    setFormData({
      code: giftCard.code,
      value: giftCard.value.toString(),
      expiryDate: giftCard.expiryDate,
      status: giftCard.status,
      description: giftCard.description || ""
    });
    setShowEditDialog(true);
  };
  
  const openDeleteDialog = (giftCard) => {
    setCurrentGiftCard(giftCard);
    setShowDeleteDialog(true);
  };
  
  const resetForm = () => {
    setFormData({
      code: "",
      value: "",
      expiryDate: "",
      status: "active",
      description: ""
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
  
  const formatCurrency = (amount) => {
    return `Rs ${parseFloat(amount).toFixed(2)}`;
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (isLoading) {
    return <Loader />;
  }
  
  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5">
        <div className="px-4 md:px-8 lg:px-12 mb-3">
          <h1 className="text-2xl md:text-3xl font-bold text-[#603F26]">
            Gift Card Management
          </h1>
          <p className="text-sm text-gray-500">
            Create, view, update, and manage gift cards for your customers
          </p>
        </div>
        
        <div className="w-full px-4 md:px-8 lg:px-12 mt-4">
          <Card elevation={2} className="mb-6">
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <TextField
                  placeholder="Search gift cards..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: { xs: '100%', md: '300px' } }}
                />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowAddDialog(true)}
                >
                  Add New Gift Card
                </Button>
              </div>
              
              {filteredGiftCards.length === 0 ? (
                <div className="text-center py-8">
                  <GiftCardIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    No gift cards found
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {searchTerm ? "Try a different search term" : "Create your first gift card to get started"}
                  </Typography>
                </div>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                        <TableCell><strong>Code</strong></TableCell>
                        <TableCell><strong>Value</strong></TableCell>
                        <TableCell><strong>Expiry Date</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                        <TableCell><strong>Description</strong></TableCell>
                        <TableCell align="right"><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredGiftCards.map((giftCard) => (
                        <TableRow key={giftCard._id}>
                          <TableCell className="font-medium">{giftCard.code}</TableCell>
                          <TableCell>{formatCurrency(giftCard.value)}</TableCell>
                          <TableCell>{formatDate(giftCard.expiryDate)}</TableCell>
                          <TableCell>
                            <Chip
                              label={giftCard.status.charAt(0).toUpperCase() + giftCard.status.slice(1)}
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
                          <TableCell align="right">
                            <IconButton
                              color="primary"
                              onClick={() => openEditDialog(giftCard)}
                              disabled={giftCard.status !== "active"}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => openDeleteDialog(giftCard)}
                              disabled={giftCard.status !== "active"}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </div>
        
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
              <Grid item xs={12} sm={6}>
                <TextField
                  name="value"
                  label="Value"
                  type="number"
                  variant="outlined"
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                  }}
                  value={formData.value}
                  onChange={handleInputChange}
                  error={!!formErrors.value}
                  helperText={formErrors.value}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="expiryDate"
                  label="Expiry Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  error={!!formErrors.expiryDate}
                  helperText={formErrors.expiryDate}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="redeemed">Redeemed</MenuItem>
                    <MenuItem value="expired">Expired</MenuItem>
                  </Select>
                </FormControl>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  name="value"
                  label="Value"
                  type="number"
                  variant="outlined"
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                  }}
                  value={formData.value}
                  onChange={handleInputChange}
                  error={!!formErrors.value}
                  helperText={formErrors.value}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="expiryDate"
                  label="Expiry Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  error={!!formErrors.expiryDate}
                  helperText={formErrors.expiryDate}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="redeemed">Redeemed</MenuItem>
                    <MenuItem value="expired">Expired</MenuItem>
                  </Select>
                </FormControl>
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


