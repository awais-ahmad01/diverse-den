import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import StripeCheckout from "react-stripe-checkout";
import {
  TextField,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import { useSelector } from "react-redux";
import { getCartItems } from "../../../store/actions/products";
import { showToast } from "../../../tools";
import { placeOrder } from "../../../store/actions/products";


const checkoutSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First Name is required")
    .min(2, "First Name must be at least 2 characters"),

  lastName: yup
    .string()
    .required("Last Name is required")
    .min(2, "Last Name must be at least 2 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),

  phone: yup
    .string()
    .required("Phone Number is required")
    .matches(
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      "Invalid phone number"
    ),

  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  postalCode: yup.string(),

  paymentMethod: yup
    .string()
    .oneOf(["cashOnDelivery", "stripe"], "Invalid payment method")
    .required("Payment method is required"),
});

const Checkout = () => {
  const { user, isauthenticated } = useSelector((state) => state.auth);
  const { cartItems, isloading } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isPayment, setIsPayment] = useState(false);

  console.log("items:", cartItems);

  useEffect(() => {
    if (isauthenticated) {
      const userId = user._id;
      dispatch(getCartItems(userId))
        .unwrap()
        .catch((error) => {
          showToast("ERROR", "Failed to fetch cart items");
        });
    }
  }, []);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      paymentMethod: "cashOnDelivery",
    },
  });

  const paymentMethod = watch("paymentMethod");

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item?.productId?.price * item.quantity,
      0
    );
  };

  const makePayment = (token, selectedPlan) => {
    const tokenId = localStorage.getItem("token");

    if (!tokenId) {
      console.error("No token found!");
      return;
    }

    const body = {
      token,
      totalAmount: calculateSubtotal(),
      userId: user._id,
    };

    console.log("body: ", body);

    return axios
      .post("http://localhost:3000/planPayment", body, {
        headers: {
          Authorization: `Bearer ${tokenId}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        showToast("SUCCESS", "Payment Successfull!!");
        setIsPayment(true)
      })
      .catch((error) => {
        showToast("ERROR", 'Payment Failed!')
        throw error;
      });
  };

  const onSubmit = (data) => {
    const body = {
      data,
      cartItems,
      totalAmount: calculateSubtotal(),
    };

    console.log("order:", body);


    dispatch(placeOrder(body))
    .unwrap()
    .then(()=>{
      showToast("SUCCESS", "Order Placed Successfully!")
    })
    .catch(()=>{
      showToast("ERROR", "Failed to place Order")
    })
  };

  if (isloading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <CircularProgress size={60} thickness={4} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          
          <Paper
            elevation={3}
            className="md:col-span-2 p-6 bg-white rounded-lg shadow-md"
          >
            <Typography variant="h4" className="font-bold mb-6 text-gray-800">
              Checkout
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      variant="outlined"
                      fullWidth
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      className="mb-4"
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      variant="outlined"
                      fullWidth
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      className="mb-4"
                    />
                  )}
                />
              </div>

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    className="mb-4"
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    type="tel"
                    variant="outlined"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    className="mb-4"
                  />
                )}
              />

              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    variant="outlined"
                    fullWidth
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    className="mb-4"
                  />
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="City"
                      variant="outlined"
                      fullWidth
                      error={!!errors.city}
                      helperText={errors.city?.message}
                      className="mb-4"
                    />
                  )}
                />
                <Controller
                  name="postalCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Postal Code (Optional)"
                      variant="outlined"
                      fullWidth
                      error={!!errors.postalCode}
                      helperText={errors.postalCode?.message}
                      className="mb-4"
                    />
                  )}
                />
              </div>

              <div className="my-6">
                <FormControl component="fieldset" fullWidth>
                  <FormLabel
                    component="legend"
                    className="mb-2 text-gray-700 font-semibold"
                  >
                    Payment Method
                  </FormLabel>
                  <Controller
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        className="flex flex-row items-stretch w-full"
                      >
                        <div className="flex-1 mr-4">
                          <FormControlLabel
                            value="cashOnDelivery"
                            control={<Radio color="primary" />}
                            label="Cash on Delivery"
                            className="w-full"
                            componentsProps={{
                              typography: {
                                className: "w-full",
                              },
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <FormControlLabel
                            value="stripe"
                            control={<Radio color="primary" />}
                            label="Pay via Stripe"
                            className="w-full"
                            componentsProps={{
                              typography: {
                                className: "w-full",
                              },
                            }}
                          />
                        </div>
                      </RadioGroup>
                    )}
                  />
                </FormControl>
              </div>

              {paymentMethod === "cashOnDelivery" && (
                <button
                  type="submit"
                  className="w-full bg-[#603f26] font-semibold text-white py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02]"
                >
                  Place Order
                </button>
              )}

              {paymentMethod === "stripe" && (
                <StripeCheckout
                  stripeKey="pk_test_51QOJ4oDZzPFomXhEJc2PFEnX4MqUEEzMkA8gwhbgA7I7GzXobg0QAwn06yuHn2Gb1ofTkwLHiGPI7N8XrxVMi0xt00zvcbJDcy"
                  token={(token) => {
                    makePayment(token);
                  }}
                  name="payment"
                  // amount={plan.price * 100}
                  // currency="PKR"
                >
                  <button
                    // type="submit"
                    className="w-full bg-[#603f26] font-semibold text-white py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02]"
                  >
                    Pay Now
                  </button>
                </StripeCheckout>

              )}

              {isPayment && (
                <button
                type="submit"
                className="w-full bg-[#603f26] font-semibold text-white py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02]"
              >
                Place order
              </button>
              )}
            </form>
          </Paper>

     



          <Paper
            elevation={3}
            className="p-6 bg-white rounded-lg shadow-md h-fit"
          >
            <Typography variant="h5" className="font-bold mb-4 text-gray-800">
              Order Summary
            </Typography>
            {cartItems.length > 0 && (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item?._id}
                    className="flex justify-between items-center pb-4 border-b last:border-b-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 flex-shrink-0">
                        <img
                          src={item?.productId?.imagePath[0]}
                          alt={item?.productId?.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-grow">
                        <Typography
                          variant="subtitle1"
                          className="font-semibold text-gray-800 truncate"
                        >
                          {item?.productId?.title}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          {item?.selectedVariant.color &&
                            `Color: ${item?.selectedVariant?.color} | `}
                          {item?.selectedVariant?.size &&
                            `Size: ${item?.selectedVariant?.size} | `}
                          {item?.selectedVariant?.material &&
                            `Material: ${item?.selectedVariant?.material}`}
                        </Typography>
                      </div>
                    </div>
                    <div className="text-right">
                      <Typography variant="body1">
                        {item?.quantity} x{" "}
                        <span className="font-semibold">
                          ${item?.productId?.price.toFixed(2)}
                        </span>
                      </Typography>
                    </div>
                  </div>
                ))}
                <Divider />
                <div className="flex justify-between font-bold">
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">
                    ${cartItems.length > 0 && calculateSubtotal().toFixed(2)}
                  </Typography>
                </div>
              </div>
            )}
          </Paper>
        </div>




        {/* <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={orderSuccess}
          autoHideDuration={2000}
        >
          <Alert severity="success" variant="filled">
            Order placed successfully! Redirecting...
          </Alert>
        </Snackbar>

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert
            onClose={() => setError(null)}
            severity="error"
            variant="filled"
          >
            {error}
          </Alert>
        </Snackbar> */}
      </div>
    </div>
  );
};

export default Checkout;
















// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
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
// import { useSelector } from 'react-redux';
// import { getCartItems } from '../../../store/actions/products';
// import { showToast } from '../../../tools';

// // Validation Schema
// const checkoutSchema = yup.object().shape({
//   firstName: yup
//     .string()
//     .required('First Name is required')
//     .min(2, 'First Name must be at least 2 characters'),

//   lastName: yup
//     .string()
//     .required('Last Name is required')
//     .min(2, 'Last Name must be at least 2 characters'),

//   email: yup
//     .string()
//     .required('Email is required')
//     .email('Invalid email address'),

//   phone: yup
//     .string()
//     .required('Phone Number is required')
//     .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number'),

//   address: yup.string().required('Address is required'),
//   city: yup.string().required('City is required'),
//   postalCode: yup.string(),

//   paymentMethod: yup
//     .string()
//     .oneOf(['cashOnDelivery', 'stripe'], 'Invalid payment method')
//     .required('Payment method is required')
// });

// const Checkout = () => {

//   const {user, isauthenticated} = useSelector(state => state.auth);
//   const {cartItems, isloading} = useSelector(state => state.products)
//   const dispatch = useDispatch();
//   // const [cartItems, setCartItems] = useState([]);
//   // const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [orderSuccess, setOrderSuccess] = useState(false);

//   useEffect(() => {

//     if(isauthenticated){
//       const userId = user._id;
//       dispatch(getCartItems(userId))
//       .unwrap()
//       .catch((error)=>{
//         showToast("ERROR", 'Failed to fetch cart items');
//       })
//     }

//   }, []);

//   const {
//     control,
//     handleSubmit,
//     watch,
//     formState: { errors }
//   } = useForm({
//     resolver: yupResolver(checkoutSchema),
//     defaultValues: {
//       firstName: '',
//       lastName: '',
//       email: '',
//       phone: '',
//       address: '',
//       city: '',
//       postalCode: '',
//       paymentMethod: 'cashOnDelivery'
//     }
//   });

//   const paymentMethod = watch('paymentMethod');

//   // useEffect(() => {
//   //   const fetchCartItems = async () => {
//   //     try {
//   //       const response = await axios.get('/api/cart');
//   //       setCartItems(response.data);
//   //       setLoading(false);
//   //     } catch (err) {
//   //       setError('Failed to load cart items');
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchCartItems();
//   // }, []);

//   const calculateSubtotal = () => {
//     return cartItems.reduce((total, item) => total + (item?.productId?.price * item.quantity), 0);
//   };

//   const onSubmit = async (data) => {
//     try {
//       const orderData = {
//         ...data,
//         items: cartItems,
//         total: calculateSubtotal()
//       };

//       if (data.paymentMethod === 'cashOnDelivery') {
//         const response = await axios.post('/api/orders/cash-on-delivery', orderData);
//         setOrderSuccess(true);

//         setTimeout(() => {
//           window.location.href = `/order-confirmation/${response.data.orderId}`;
//         }, 2000);
//       } else {
//         // Stripe payment logic would go here
//         const response = await axios.post('/api/orders/stripe', orderData);
//         window.location.href = response.data.checkoutUrl; // Redirect to Stripe checkout
//       }
//     } catch (err) {
//       setError('Order submission failed. Please try again.');
//     }
//   };

//   if (isloading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <CircularProgress />
//       </div>
//     );
//   }

//   // if (error || cartItems.length === 0) {
//   //   return (
//   //     <div className="text-center text-red-500 p-8">
//   //       {error || 'Your cart is empty'}
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid md:grid-cols-3 gap-8">
//         {/* Checkout Form */}
//         <div className="md:col-span-2">
//           <h1 className="text-3xl font-bold mb-6">Checkout</h1>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             <div className="grid md:grid-cols-2 gap-4">
//               <Controller
//                 name="firstName"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     label="First Name"
//                     variant="outlined"
//                     fullWidth
//                     error={!!errors.firstName}
//                     helperText={errors.firstName?.message}
//                   />
//                 )}
//               />
//               <Controller
//                 name="lastName"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     label="Last Name"
//                     variant="outlined"
//                     fullWidth
//                     error={!!errors.lastName}
//                     helperText={errors.lastName?.message}
//                   />
//                 )}
//               />
//             </div>

//             <Controller
//               name="email"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Email"
//                   type="email"
//                   variant="outlined"
//                   fullWidth
//                   error={!!errors.email}
//                   helperText={errors.email?.message}
//                 />
//               )}
//             />

//             <Controller
//               name="phone"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Phone Number"
//                   type="tel"
//                   variant="outlined"
//                   fullWidth
//                   error={!!errors.phone}
//                   helperText={errors.phone?.message}
//                 />
//               )}
//             />

//             <Controller
//               name="address"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Address"
//                   variant="outlined"
//                   fullWidth
//                   error={!!errors.address}
//                   helperText={errors.address?.message}
//                 />
//               )}
//             />

//             <div className="grid md:grid-cols-2 gap-4">
//               <Controller
//                 name="city"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     label="City"
//                     variant="outlined"
//                     fullWidth
//                     error={!!errors.city}
//                     helperText={errors.city?.message}
//                   />
//                 )}
//               />
//               <Controller
//                 name="postalCode"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     label="Postal Code (Optional)"
//                     variant="outlined"
//                     fullWidth
//                     error={!!errors.postalCode}
//                     helperText={errors.postalCode?.message}
//                   />
//                 )}
//               />
//             </div>

//             <div>
//               <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
//               <Controller
//                 name="paymentMethod"
//                 control={control}
//                 render={({ field }) => (
//                   <RadioGroup
//                     {...field}
//                     className="flex flex-row"
//                   >
//                     <FormControlLabel
//                       value="cashOnDelivery"
//                       control={<Radio />}
//                       label="Cash on Delivery"
//                     />
//                     <FormControlLabel
//                       value="stripe"
//                       control={<Radio />}
//                       label="Pay via Stripe"
//                     />
//                   </RadioGroup>
//                 )}
//               />
//             </div>

//             {paymentMethod === 'cashOnDelivery' && (
//               <button
//                 type="submit"
//                 className="w-full bg-primary text-white py-3 rounded hover:bg-primary-dark"
//               >
//                 Place Order
//               </button>
//             )}

//             {paymentMethod === 'stripe' && (
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
//               >
//                 Pay Now
//               </button>
//             )}
//           </form>
//         </div>

//         {/* Order Summary */}
//         <div className="border p-6 rounded-lg h-fit">
//           <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
//           {cartItems.length > 0 &&
//             cartItems.map((item) => (
//             <div
//               key={item?._id}
//               className="flex justify-between items-center border-b pb-2 mb-2"
//             >
//               <div>
//                 <p className="font-semibold">{item.title}</p>
//                 <p className="text-gray-600 text-sm">
//                   {item?.selectedVariant.color ? `Color: ${item?.selectedVariant?.color}` : ''}{' '}
//                   {item?.selectedVariant?.size ? `| Size: ${item?.selectedVariant?.size}` : ''}{' '}
//                   {item?.selectedVariant?.material ? `| Material: ${item?.selectedVariant?.material}` : ''}
//                 </p>
//               </div>
//               <div>
//                 <span>{item?.quantity} x </span>
//                 <span className="font-semibold">${item?.productId?.price.toFixed(2)}</span>
//               </div>
//             </div>
//           ))}
//           <div className="flex justify-between font-bold border-t pt-2">
//             <span>Total</span>
//             <span>${cartItems.length > 0 && calculateSubtotal().toFixed(2)}</span>
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
