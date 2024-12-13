import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  const [orderSuccess, setOrderSuccess] = useState(false);

  const { 
    control, 
    handleSubmit, 
    watch, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
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
    }
  });

  const paymentMethod = watch('paymentMethod');

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

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/api/orders', {
        ...data,
        items: cartItems,
        total: calculateSubtotal()
      });
      
      await axios.delete('/api/cart');

      setOrderSuccess(true);
      
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Controller
                name="firstName"
                control={control}
                rules={{ 
                  required: 'First Name is required',
                  minLength: {
                    value: 2,
                    message: 'First Name must be at least 2 characters'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
              <Controller
                name="lastName"
                control={control}
                rules={{ 
                  required: 'Last Name is required',
                  minLength: {
                    value: 2,
                    message: 'Last Name must be at least 2 characters'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </div>
            
            <Controller
              name="email"
              control={control}
              rules={{ 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
            
            <Controller
              name="phone"
              control={control}
              rules={{ 
                required: 'Phone Number is required',
                pattern: {
                  value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                  message: 'Invalid phone number'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone Number"
                  type="tel"
                  variant="outlined"
                  fullWidth
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />
            
            <div className="grid md:grid-cols-2 gap-4">
              <Controller
                name="address.street"
                control={control}
                rules={{ required: 'Street Address is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Street Address"
                    variant="outlined"
                    fullWidth
                    error={!!errors.address?.street}
                    helperText={errors.address?.street?.message}
                  />
                )}
              />
              <Controller
                name="address.city"
                control={control}
                rules={{ required: 'City is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="City"
                    variant="outlined"
                    fullWidth
                    error={!!errors.address?.city}
                    helperText={errors.address?.city?.message}
                  />
                )}
              />
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <Controller
                name="address.state"
                control={control}
                rules={{ required: 'State/Province is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="State/Province"
                    variant="outlined"
                    fullWidth
                    error={!!errors.address?.state}
                    helperText={errors.address?.state?.message}
                  />
                )}
              />
              <Controller
                name="address.zipCode"
                control={control}
                rules={{ 
                  required: 'Zip/Postal Code is required',
                  pattern: {
                    value: /^\d{5}(-\d{4})?$/,
                    message: 'Invalid ZIP code'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Zip/Postal Code"
                    variant="outlined"
                    fullWidth
                    error={!!errors.address?.zipCode}
                    helperText={errors.address?.zipCode?.message}
                  />
                )}
              />
              <Controller
                name="address.country"
                control={control}
                rules={{ required: 'Country is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Country"
                    variant="outlined"
                    fullWidth
                    error={!!errors.address?.country}
                    helperText={errors.address?.country?.message}
                  />
                )}
              />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
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
                )}
              />
            </div>
            
            {paymentMethod === 'credit' && (
              <div className="grid md:grid-cols-3 gap-4">
                <Controller
                  name="cardNumber"
                  control={control}
                  rules={{ 
                    required: 'Card Number is required',
                    pattern: {
                      value: /^\d{16}$/,
                      message: 'Card Number must be 16 digits'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Card Number"
                      variant="outlined"
                      fullWidth
                      inputProps={{ 
                        maxLength: 16
                      }}
                      error={!!errors.cardNumber}
                      helperText={errors.cardNumber?.message}
                    />
                  )}
                />
                <Controller
                  name="expiryDate"
                  control={control}
                  rules={{ 
                    required: 'Expiry Date is required',
                    pattern: {
                      value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                      message: 'Invalid expiry date. Use MM/YY format'
                    },
                    validate: (value) => {
                      const [month, year] = value.split('/');
                      const expiry = new Date(`20${year}`, month - 1);
                      return expiry > new Date() || 'Card has expired';
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Expiry Date"
                      variant="outlined"
                      fullWidth
                      placeholder="MM/YY"
                      inputProps={{ 
                        maxLength: 5
                      }}
                      error={!!errors.expiryDate}
                      helperText={errors.expiryDate?.message}
                    />
                  )}
                />
                <Controller
                  name="cvv"
                  control={control}
                  rules={{ 
                    required: 'CVV is required',
                    pattern: {
                      value: /^\d{3}$/,
                      message: 'CVV must be 3 digits'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="CVV"
                      variant="outlined"
                      fullWidth
                      type="password"
                      inputProps={{ 
                        maxLength: 3
                      }}
                      error={!!errors.cvv}
                      helperText={errors.cvv?.message}
                    />
                  )}
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































// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   TextField, 
//   Radio, 
//   RadioGroup, 
//   FormControlLabel, 
//   Snackbar, 
//   Alert, 
//   CircularProgress 
// } from '@mui/material';

// const Checkout = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     address: {
//       street: '',
//       city: '',
//       state: '',
//       zipCode: '',
//       country: ''
//     },
//     paymentMethod: 'credit',
//     cardNumber: '',
//     expiryDate: '',
//     cvv: ''
//   });
//   const [orderSuccess, setOrderSuccess] = useState(false);

//   useEffect(() => {
//     const fetchCartItems = async () => {
//       try {
//         const response = await axios.get('/api/cart');
//         setCartItems(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to load cart items');
//         setLoading(false);
//       }
//     };

//     fetchCartItems();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     // Handle nested address fields
//     if (name.startsWith('address.')) {
//       const addressField = name.split('.')[1];
//       setFormData(prev => ({
//         ...prev,
//         address: {
//           ...prev.address,
//           [addressField]: value
//         }
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const calculateSubtotal = () => {
//     return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('/api/orders', {
//         ...formData,
//         items: cartItems,
//         total: calculateSubtotal()
//       });

      
//       await axios.delete('/api/cart');

//       setOrderSuccess(true);
      
    
//       setTimeout(() => {
//         window.location.href = `/order-confirmation/${response.data.orderId}`;
//       }, 2000);
//     } catch (err) {
//       setError('Order submission failed. Please try again.');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <CircularProgress />
//       </div>
//     );
//   }

//   if (error || cartItems.length === 0) {
//     return (
//       <div className="text-center text-red-500 p-8">
//         {error || 'Your cart is empty'}
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid md:grid-cols-3 gap-8">
//         {/* Checkout Form */}
//         <div className="md:col-span-2">
//           <h1 className="text-3xl font-bold mb-6">Checkout</h1>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid md:grid-cols-2 gap-4">
//               <TextField
//                 name="firstName"
//                 label="First Name"
//                 variant="outlined"
//                 fullWidth
//                 required
//                 value={formData.firstName}
//                 onChange={handleInputChange}
//               />
//               <TextField
//                 name="lastName"
//                 label="Last Name"
//                 variant="outlined"
//                 fullWidth
//                 required
//                 value={formData.lastName}
//                 onChange={handleInputChange}
//               />
//             </div>
            
//             <TextField
//               name="email"
//               label="Email"
//               type="email"
//               variant="outlined"
//               fullWidth
//               required
//               value={formData.email}
//               onChange={handleInputChange}
//             />
            
//             <TextField
//               name="phone"
//               label="Phone Number"
//               type="tel"
//               variant="outlined"
//               fullWidth
//               required
//               value={formData.phone}
//               onChange={handleInputChange}
//             />
            
//             <div className="grid md:grid-cols-2 gap-4">
//               <TextField
//                 name="address.street"
//                 label="Street Address"
//                 variant="outlined"
//                 fullWidth
//                 required
//                 value={formData.address.street}
//                 onChange={handleInputChange}
//               />
//               <TextField
//                 name="address.city"
//                 label="City"
//                 variant="outlined"
//                 fullWidth
//                 required
//                 value={formData.address.city}
//                 onChange={handleInputChange}
//               />
//             </div>
            
//             <div className="grid md:grid-cols-3 gap-4">
//               <TextField
//                 name="address.state"
//                 label="State/Province"
//                 variant="outlined"
//                 fullWidth
//                 required
//                 value={formData.address.state}
//                 onChange={handleInputChange}
//               />
//               <TextField
//                 name="address.zipCode"
//                 label="Zip/Postal Code"
//                 variant="outlined"
//                 fullWidth
//                 required
//                 value={formData.address.zipCode}
//                 onChange={handleInputChange}
//               />
//               <TextField
//                 name="address.country"
//                 label="Country"
//                 variant="outlined"
//                 fullWidth
//                 required
//                 value={formData.address.country}
//                 onChange={handleInputChange}
//               />
//             </div>
            
//             <div>
//               <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
//               <RadioGroup
//                 name="paymentMethod"
//                 value={formData.paymentMethod}
//                 onChange={handleInputChange}
//                 className="flex flex-row"
//               >
//                 <FormControlLabel 
//                   value="credit" 
//                   control={<Radio />} 
//                   label="Credit Card" 
//                 />
//                 <FormControlLabel 
//                   value="paypal" 
//                   control={<Radio />} 
//                   label="PayPal" 
//                 />
//                 <FormControlLabel 
//                   value="applepay" 
//                   control={<Radio />} 
//                   label="Apple Pay" 
//                 />
//               </RadioGroup>
//             </div>
            
//             {formData.paymentMethod === 'credit' && (
//               <div className="grid md:grid-cols-3 gap-4">
//                 <TextField
//                   name="cardNumber"
//                   label="Card Number"
//                   variant="outlined"
//                   fullWidth
//                   required
//                   inputProps={{ 
//                     maxLength: 16,
//                     pattern: "\\d{16}"
//                   }}
//                   value={formData.cardNumber}
//                   onChange={handleInputChange}
//                 />
//                 <TextField
//                   name="expiryDate"
//                   label="Expiry Date"
//                   variant="outlined"
//                   fullWidth
//                   required
//                   placeholder="MM/YY"
//                   inputProps={{ 
//                     maxLength: 5,
//                     pattern: "\\d{2}/\\d{2}"
//                   }}
//                   value={formData.expiryDate}
//                   onChange={handleInputChange}
//                 />
//                 <TextField
//                   name="cvv"
//                   label="CVV"
//                   variant="outlined"
//                   fullWidth
//                   required
//                   type="password"
//                   inputProps={{ 
//                     maxLength: 3,
//                     pattern: "\\d{3}"
//                   }}
//                   value={formData.cvv}
//                   onChange={handleInputChange}
//                 />
//               </div>
//             )}
            
//             <button 
//               type="submit"
//               className="w-full bg-primary text-white py-3 rounded hover:bg-primary-dark"
//             >
//               Place Order
//             </button>
//           </form>
//         </div>

//         {/* Order Summary */}
//         <div className="border p-6 rounded-lg h-fit">
//           <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
//           {cartItems.map((item) => (
//             <div 
//               key={item.id} 
//               className="flex justify-between items-center border-b pb-2 mb-2"
//             >
//               <div>
//                 <p className="font-semibold">{item.title}</p>
//                 <p className="text-gray-600 text-sm">
//                   {item.variant.color ? `Color: ${item.variant.color}` : ''}{' '}
//                   {item.variant.size ? `| Size: ${item.variant.size}` : ''}
//                 </p>
//               </div>
//               <div>
//                 <span>{item.quantity} x </span>
//                 <span className="font-semibold">${item.price.toFixed(2)}</span>
//               </div>
//             </div>
//           ))}
//           <div className="flex justify-between font-bold border-t pt-2">
//             <span>Total</span>
//             <span>${calculateSubtotal().toFixed(2)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Success Notification */}
//       <Snackbar 
//         open={orderSuccess} 
//         autoHideDuration={2000}
//       >
//         <Alert severity="success">
//           Order placed successfully! Redirecting...
//         </Alert>
//       </Snackbar>

//       {/* Error Notification */}
//       <Snackbar 
//         open={!!error} 
//         autoHideDuration={6000} 
//         onClose={() => setError(null)}
//       >
//         <Alert 
//           onClose={() => setError(null)} 
//           severity="error"
//         >
//           {error}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default Checkout;