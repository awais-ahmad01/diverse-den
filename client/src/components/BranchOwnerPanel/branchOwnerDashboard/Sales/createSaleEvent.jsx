import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import EventIcon from '@mui/icons-material/Event';

// Create theme to match the brown color scheme
const theme = createTheme({
  palette: {
    primary: {
      main: '#603F26',
    },
  },
});

// CreateSaleEvent Component
const CreateSaleEvent = () => {
  const [saleEvent, setSaleEvent] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    discountType: 'percentage',
    discountValue: '',
    products: [],
  });

  const [showFilters, setShowFilters] = useState(true);

  const [availableProducts] = useState([
    { id: 1, name: 'Product 1', price: 99.99, category: 'Electronics' },
    { id: 2, name: 'Product 2', price: 149.99, category: 'Fashion' },
    { id: 3, name: 'Product 3', price: 199.99, category: 'Home' },
    { id: 4, name: 'Product 1', price: 99.99, category: 'Electronics' },
    { id: 5, name: 'Product 2', price: 149.99, category: 'Fashion' },
    { id: 6, name: 'Product 3', price: 199.99, category: 'Home' },
    { id: 7, name: 'Product 1', price: 99.99, category: 'Electronics' },
    { id: 8, name: 'Product 2', price: 149.99, category: 'Fashion' },
    { id: 9, name: 'Product 3', price: 199.99, category: 'Home' },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSaleEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductToggle = (productId) => {
    setSaleEvent(prev => {
      const isSelected = prev.products.includes(productId);
      return {
        ...prev,
        products: isSelected 
          ? prev.products.filter(id => id !== productId)
          : [...prev.products, productId]
      };
    });
  };

  const handlePublish = () => {
    console.log('Publishing new sale event:', saleEvent);
    // Add API call here to publish the event
  };

  const handleSave = () => {
    console.log('Saving draft sale event:', saleEvent);
    // Add API call here to save draft
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', pt: 3 }}>
        {/* Header */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
          <Typography variant="h4" sx={{ color: '#603F26', fontWeight: 'bold' }}>
            Create Sale Event
          </Typography>
        </Box>

        {/* Stats and Filter Toggle */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Card sx={{ bgcolor: '#603F26', color: 'white', width: 200 }}>
            <CardContent>
              <Typography variant="h4" component="div">
                {String(saleEvent.products.length).padStart(2, '0')}
              </Typography>
              <Typography variant="body2">
                Selected Products
              </Typography>
            </CardContent>
          </Card>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Details' : 'Show Details'}
          </Button>
        </Box>

        {/* Event Details Form */}
        {showFilters && (
          <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mt: 3 }}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <TextField
                  label="Event Name"
                  name="name"
                  value={saleEvent.name}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />

                <TextField
                  label="Description"
                  name="description"
                  value={saleEvent.description}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                />

                <TextField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={saleEvent.startDate}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: <EventIcon color="action" />
                  }}
                />

                <TextField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={saleEvent.endDate}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: <EventIcon color="action" />
                  }}
                />

                <Select
                  value={saleEvent.discountType}
                  onChange={handleInputChange}
                  name="discountType"
                  fullWidth
                  displayEmpty
                  variant="outlined"
                  label="Discount Type"
                >
                  <MenuItem value="percentage">Percentage Off</MenuItem>
                  <MenuItem value="fixed">Fixed Amount Off</MenuItem>
                </Select>

                <TextField
                  label={saleEvent.discountType === 'percentage' ? 'Percentage Off' : 'Amount Off'}
                  name="discountValue"
                  type="number"
                  value={saleEvent.discountValue}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Box>
            </Paper>
          </Box>
        )}

        {/* Products Table */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mt: 3 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: '#603F26' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Product Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>Category</TableCell>
                  <TableCell sx={{ color: 'white' }} align="right">Price</TableCell>
                  <TableCell sx={{ color: 'white' }} align="center">Include in Sale</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {availableProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    sx={{
                      bgcolor: saleEvent.products.includes(product.id) ? 'rgba(96, 63, 38, 0.1)' : 'inherit',
                      '&:hover': { bgcolor: 'rgba(96, 63, 38, 0.05)' },
                      cursor: 'pointer'
                    }}
                    onClick={() => handleProductToggle(product.id)}
                  >
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <input
                        type="checkbox"
                        checked={saleEvent.products.includes(product.id)}
                        onChange={() => {}}
                        style={{ 
                          width: '18px', 
                          height: '18px',
                          accentColor: '#603F26'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mt: 3, mb: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save Draft
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            onClick={handlePublish}
            disabled={!saleEvent.name || !saleEvent.startDate || !saleEvent.endDate || saleEvent.products.length === 0}
          >
            Publish Event
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};



export default CreateSaleEvent;