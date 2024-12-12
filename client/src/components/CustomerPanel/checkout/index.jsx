import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TextField, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  Snackbar, 
  Alert, 
  CircularProgress 
} from '@mui/material';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    paymentMethod: 'credit',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('/api/cart');
        setCartItems(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load cart items');
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/orders', {
        ...formData,
        items: cartItems,
        total: calculateSubtotal()
      });

      // Clear cart after successful order
      await axios.delete('/api/cart');

      setOrderSuccess(true);
      
      // Redirect to order confirmation page
      setTimeout(() => {
        window.location.href = `/order-confirmation/${response.data.orderId}`;
      }, 2000);
    } catch (err) {
      setError('Order submission failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error || cartItems.length === 0) {
    return (
      <div className="text-center text-red-500 p-8">
        {error || 'Your cart is empty'}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <TextField
                name="firstName"
                label="First Name"
                variant="outlined"
                fullWidth
                required
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <TextField
                name="lastName"
                label="Last Name"
                variant="outlined"
                fullWidth
                required
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
            
            <TextField
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={formData.email}
              onChange={handleInputChange}
            />
            
            <TextField
              name="phone"
              label="Phone Number"
              type="tel"
              variant="outlined"
              fullWidth
              required
              value={formData.phone}
              onChange={handleInputChange}
            />
            
            <div className="grid md:grid-cols-2 gap-4">
              <TextField
                name="address.street"
                label="Street Address"
                variant="outlined"
                fullWidth
                required
                value={formData.address.street}
                onChange={handleInputChange}
              />
              <TextField
                name="address.city"
                label="City"
                variant="outlined"
                fullWidth
                required
                value={formData.address.city}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <TextField
                name="address.state"
                label="State/Province"
                variant="outlined"
                fullWidth
                required
                value={formData.address.state}
                onChange={handleInputChange}
              />
              <TextField
                name="address.zipCode"
                label="Zip/Postal Code"
                variant="outlined"
                fullWidth
                required
                value={formData.address.zipCode}
                onChange={handleInputChange}
              />
              <TextField
                name="address.country"
                label="Country"
                variant="outlined"
                fullWidth
                required
                value={formData.address.country}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <RadioGroup
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="flex flex-row"
              >
                <FormControlLabel 
                  value="credit" 
                  control={<Radio />} 
                  label="Credit Card" 
                />
                <FormControlLabel 
                  value="paypal" 
                  control={<Radio />} 
                  label="PayPal" 
                />
                <FormControlLabel 
                  value="applepay" 
                  control={<Radio />} 
                  label="Apple Pay" 
                />
              </RadioGroup>
            </div>
            
            {formData.paymentMethod === 'credit' && (
              <div className="grid md:grid-cols-3 gap-4">
                <TextField
                  name="cardNumber"
                  label="Card Number"
                  variant="outlined"
                  fullWidth
                  required
                  inputProps={{ 
                    maxLength: 16,
                    pattern: "\\d{16}"
                  }}
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                />
                <TextField
                  name="expiryDate"
                  label="Expiry Date"
                  variant="outlined"
                  fullWidth
                  required
                  placeholder="MM/YY"
                  inputProps={{ 
                    maxLength: 5,
                    pattern: "\\d{2}/\\d{2}"
                  }}
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                />
                <TextField
                  name="cvv"
                  label="CVV"
                  variant="outlined"
                  fullWidth
                  required
                  type="password"
                  inputProps={{ 
                    maxLength: 3,
                    pattern: "\\d{3}"
                  }}
                  value={formData.cvv}
                  onChange={handleInputChange}
                />
              </div>
            )}
            
            <button 
              type="submit"
              className="w-full bg-primary text-white py-3 rounded hover:bg-primary-dark"
            >
              Place Order
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="border p-6 rounded-lg h-fit">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          {cartItems.map((item) => (
            <div 
              key={item.id} 
              className="flex justify-between items-center border-b pb-2 mb-2"
            >
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-gray-600 text-sm">
                  {item.variant.color ? `Color: ${item.variant.color}` : ''}{' '}
                  {item.variant.size ? `| Size: ${item.variant.size}` : ''}
                </p>
              </div>
              <div>
                <span>{item.quantity} x </span>
                <span className="font-semibold">${item.price.toFixed(2)}</span>
              </div>
            </div>
          ))}
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      <Snackbar 
        open={orderSuccess} 
        autoHideDuration={2000}
      >
        <Alert severity="success">
          Order placed successfully! Redirecting...
        </Alert>
      </Snackbar>

      {/* Error Notification */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error"
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Checkout;