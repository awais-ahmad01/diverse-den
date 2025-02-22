import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Typography,
  Chip,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

const theme = createTheme({
  palette: {
    primary: {
      main: '#603F26',
    },
  },
});

const SaleEventsList = () => {
  const [events, setEvents] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Mock data
  useEffect(() => {
    setTimeout(() => {
      const mockEvents = [
        {
          id: 1,
          name: 'Summer Sale 2025',
          description: 'Annual summer clearance sale',
          startDate: '2025-06-01',
          endDate: '2025-06-30',
          discountType: 'percentage',
          discountValue: 25,
          productsCount: 45,
          status: 'Active',
          isActive: true,
        },
        {
          id: 2,
          name: 'Flash Sale',
          description: '24-hour flash sale on electronics',
          startDate: '2025-03-15',
          endDate: '2025-03-16',
          discountType: 'fixed',
          discountValue: 50,
          productsCount: 20,
          status: 'Scheduled',
          isActive: true,
        },
        {
          id: 3,
          name: 'Winter Clearance',
          description: 'End of winter season sale',
          startDate: '2025-02-01',
          endDate: '2025-02-28',
          discountType: 'percentage',
          discountValue: 30,
          productsCount: 60,
          status: 'Ended',
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
      case 'active':
        return { color: 'success', label: 'Active' };
      case 'scheduled':
        return { color: 'info', label: 'Scheduled' };
      case 'ended':
        return { color: 'default', label: 'Ended' };
      default:
        return { color: 'default', label: status };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const applyFilters = () => {
    let filtered = [...events];
    if (startDate) {
      filtered = filtered.filter(event => event.startDate >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(event => event.endDate <= endDate);
    }
    setFilteredEvents(filtered);
  };

  const handleDeleteClick = (eventId) => {
    setSelectedEventId(eventId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    const updatedEvents = events.filter(event => event.id !== selectedEventId);
    setEvents(updatedEvents);
    setFilteredEvents(updatedEvents);
    setDeleteDialogOpen(false);
    setSelectedEventId(null);
  };

  const handleToggleActive = (eventId) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          isActive: !event.isActive,
          status: !event.isActive ? 'Active' : 'Inactive'
        };
      }
      return event;
    });
    setEvents(updatedEvents);
    setFilteredEvents(updatedEvents);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5">
        {/* Header */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
          <Typography variant="h4" sx={{ color: '#603F26', fontWeight: 'bold' }}>
            Sale Events
          </Typography>
        </Box>

        {/* Stats and Actions */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Paper sx={{ bgcolor: '#603F26', color: 'white', px: 3, py: 2, borderRadius: 2 }}>
            <Typography variant="h4" component="div">
              {String(events.length).padStart(2, '0')}
            </Typography>
            <Typography variant="body2">
              Total Events
            </Typography>
          </Paper>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
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
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
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
              </Box>
            </Paper>
          </Box>
        )}

        {/* Events Table */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 4 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: '#603F26' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Event Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Duration</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Discount</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Products</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {event.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {event.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {formatDate(event.startDate)} - {formatDate(event.endDate)}
                    </TableCell>
                    <TableCell>
                      {event.discountType === 'percentage' ? 
                        `${event.discountValue}% Off` : 
                        `$${event.discountValue} Off`}
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
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          component={Link}
                          to={`../updateSaleEvent/${event.id}`}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteClick(event.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleToggleActive(event.id)}
                        >
                          {event.isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Sale Event</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this sale event? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default SaleEventsList;