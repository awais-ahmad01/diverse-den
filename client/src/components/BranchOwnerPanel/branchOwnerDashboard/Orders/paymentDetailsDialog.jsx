import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  Typography,
  Grid,
  Divider,
  Box,
  Chip,
  createTheme,
  ThemeProvider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const PaymentDetailsDialog = ({ open, handleClose, payment }) => {
  // Custom theme to match the brown color scheme
  const theme = createTheme({
    palette: {
      primary: {
        main: "#603F26",
      },
    },
  });

  if (!payment) return null;

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Mock additional payment details that would come from your API
  const detailedPayment = {
    ...payment,
    customerEmail: "customer@example.com",
    customerPhone: "+1 (555) 123-4567",
    orderItems: [
      { name: "Coffee Beans - French Roast", quantity: 2, price: 15.99 },
      { name: "Ceramic Mug - Brown", quantity: 1, price: 24.99 },
    ],
    subtotal: payment.amount - 12.00,
    tax: 7.00,
    shipping: 5.00,
    transactionId: "TXN" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
    paymentStatus: "Completed",
    billingAddress: "123 Main St, Anytown, CA 90210",
    shippingAddress: "123 Main St, Anytown, CA 90210",
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        aria-labelledby="payment-details-dialog"
      >
        <DialogTitle 
          sx={{ 
            bgcolor: '#603F26', 
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6">
            Payment Details - {detailedPayment.orderNumber}
          </Typography>
          <Button color="inherit" onClick={handleClose}>
            <CloseIcon />
          </Button>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <Box mb={3}>
            <Chip 
              label={detailedPayment.paymentStatus} 
              color="primary" 
              sx={{ fontSize: '0.9rem', fontWeight: 'bold' }} 
            />
          </Box>
          
          <Grid container spacing={3}>
            {/* Customer Information */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom>
                Customer Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Name</Typography>
                  <Typography variant="body1">{detailedPayment.customerName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Email</Typography>
                  <Typography variant="body1">{detailedPayment.customerEmail}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Phone</Typography>
                  <Typography variant="body1">{detailedPayment.customerPhone}</Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* Transaction Information */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <ReceiptLongIcon sx={{ mr: 1 }} /> Transaction Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Transaction ID</Typography>
                  <Typography variant="body1">{detailedPayment.transactionId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Transaction Date</Typography>
                  <Typography variant="body1">{formatDate(detailedPayment.paymentDate)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Payment Method</Typography>
                  <Typography variant="body1">{detailedPayment.paymentMethod}</Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* Order Items */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom>
                Items Purchased
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: 1 }}>
                {detailedPayment.orderItems.map((item, index) => (
                  <Grid container key={index} spacing={2} sx={{ mb: 1 }}>
                    <Grid item xs={6}>
                      <Typography variant="body1">{item.name}</Typography>
                    </Grid>
                    <Grid item xs={2} textAlign="center">
                      <Typography variant="body2">Qty: {item.quantity}</Typography>
                    </Grid>
                    <Grid item xs={4} textAlign="right">
                      <Typography variant="body1">${(item.price * item.quantity).toFixed(2)}</Typography>
                    </Grid>
                  </Grid>
                ))}
              </Box>
            </Grid>

            {/* Payment Summary */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBalanceWalletIcon sx={{ mr: 1 }} /> Payment Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: 1 }}>
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <Typography variant="body1">Subtotal</Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="right">
                    <Typography variant="body1">${detailedPayment.subtotal.toFixed(2)}</Typography>
                  </Grid>
                  
                  <Grid item xs={8}>
                    <Typography variant="body1">Tax</Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="right">
                    <Typography variant="body1">${detailedPayment.tax.toFixed(2)}</Typography>
                  </Grid>
                  
                  <Grid item xs={8}>
                    <Typography variant="body1">Shipping</Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="right">
                    <Typography variant="body1">${detailedPayment.shipping.toFixed(2)}</Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  
                  <Grid item xs={8}>
                    <Typography variant="h6">Total</Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="right">
                    <Typography variant="h6" color="primary">${detailedPayment.amount.toFixed(2)}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Addresses */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="primary" gutterBottom>Billing Address</Typography>
              <Typography variant="body2">{detailedPayment.billingAddress}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="primary" gutterBottom>Shipping Address</Typography>
              <Typography variant="body2">{detailedPayment.shippingAddress}</Typography>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={handleClose}>Close</Button>
          <Button variant="contained" color="primary">
            Print Receipt
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default PaymentDetailsDialog;