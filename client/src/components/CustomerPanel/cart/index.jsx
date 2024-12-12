import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Delete, 
  Add, 
  Remove 
} from '@mui/icons-material';
import { 
  CircularProgress, 
  Snackbar, 
  Alert 
} from '@mui/material';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cart');
      setCartItems(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load cart items');
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      await axios.patch(`/api/cart/${itemId}`, { quantity: newQuantity });
      
      // Optimistic update
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      
      setSuccessMessage('Cart updated successfully');
    } catch (err) {
      setError('Failed to update cart');
      // Revert the change if API call fails
      fetchCartItems();
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`/api/cart/${itemId}`);
      
      // Optimistic update
      setCartItems(prevItems => 
        prevItems.filter(item => item.id !== itemId)
      );
      
      setSuccessMessage('Item removed from cart');
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    try {
      const response = await axios.post('/api/checkout', { 
        items: cartItems,
        total: calculateSubtotal()
      });
      
      // Redirect to payment or confirmation page
      window.location.href = response.data.redirectUrl;
    } catch (err) {
      setError('Checkout failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500">
          Your cart is empty
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center border-b pb-4 mb-4"
              >
                <img 
                  src={item.imagePath[0]} 
                  alt={item.title} 
                  className="w-24 h-24 object-cover mr-4 rounded"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-gray-600">
                    {item.variant.color ? `Color: ${item.variant.color}` : ''}
                    {item.variant.size ? ` | Size: ${item.variant.size}` : ''}
                  </p>
                  <p className="text-primary">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2 mr-4">
                  <button 
                    className="p-1 hover:bg-gray-100"
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    <Remove />
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    className="p-1 hover:bg-gray-100"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Add />
                  </button>
                </div>
                <button 
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeItem(item.id)}
                >
                  <Delete />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border p-6 rounded-lg h-fit">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark"
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {/* Success and Error Handling */}
      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={6000} 
        onClose={() => setSuccessMessage(null)}
      >
        <Alert 
          onClose={() => setSuccessMessage(null)} 
          severity="success"
        >
          {successMessage}
        </Alert>
      </Snackbar>
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

export default Cart;