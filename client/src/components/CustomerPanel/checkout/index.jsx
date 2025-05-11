import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Loader } from "../../../tools";
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
import { emptyCart, getDiscountData } from "../../../store/actions/cart";

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
  const { discountedData } = useSelector((state) => state.cart);
  console.log("discountedData:", discountedData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isPayment, setIsPayment] = useState(false);

  useEffect(() => {
    if (isauthenticated) {
      const userId = user._id;
      // Fetch cart items
      dispatch(getCartItems(userId))
        .unwrap()
        .catch((error) => {
          showToast("ERROR", "Failed to fetch cart items");
        });
      
      // Fetch discount data if available
      dispatch(getDiscountData(userId))
        .unwrap()
        .catch((error) => {
          console.log("No discount data available or error fetching discount data");
        });
    }
  }, []);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
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
    mode: "onChange",
  });

  const paymentMethod = watch("paymentMethod");

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item?.productId?.price * item.quantity,
      0
    );
  };

  // Use the total from discount data if available, otherwise calculate it
  const calculateTotal = () => {
    // If discount data exists, use the pre-calculated orderTotal
    if (discountedData && discountedData.orderTotal) {
      console.log("discountedData.orderTotal: ", discountedData.orderTotal);
      return discountedData.orderTotal;
    }
    
    // Otherwise calculate total normally
    const subtotal = calculateSubtotal();
    const shippingCost = 200;
    return subtotal + shippingCost;
  };

  const makePayment = (token) => {
    const tokenId = localStorage.getItem("token");

    if (!tokenId) {
      console.error("No token found!");
      return;
    }

    const body = {
      token,
      totalAmount: calculateTotal(),
      userId: user._id,
      // Include discountData if available
      ...(discountedData && { discountData: discountedData })
    };

    return axios
      .post("http://localhost:3000/orderPayment", body, {
        headers: {
          Authorization: `Bearer ${tokenId}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        showToast("SUCCESS", "Payment Successful!!");
        setIsPayment(true);
      })
      .catch((error) => {
        showToast("ERROR", "Payment Failed!");
        throw error;
      });
  };

  const onSubmit = (data) => {
    // Create order data object
    const orderData = {
      data,
      cartItems,
      totalAmount: calculateTotal(),
      shippingCost: discountedData?.shippingCost || 200,
      orderType: "Online",
    };

    // If discount data exists, include it in the order
    if (discountedData) {
      orderData.discountData = discountedData;
    }

    console.log('order data:', orderData)

    dispatch(placeOrder(orderData))
      .unwrap()
      .then(() => {
        showToast("SUCCESS", "Order Placed Successfully!");
        const userId = user?._id;
        dispatch(emptyCart(userId))
          .unwrap()
          .then(() => {
            navigate("/customer");
            window.location.reload();
          })
          .catch(() => {
            showToast("ERROR", "Failed to empty cart");
          });
      })
      .catch(() => {
        showToast("ERROR", "Failed to place Order");
      });
  };

  if (isloading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <Paper
            elevation={3}
            className="md:col-span-2 p-6 bg-white rounded-lg shadow-md"
          >
            <Typography variant="h4" className="font-bold pb-6 text-gray-800">
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

              {paymentMethod === "stripe" && !isPayment && (
                <StripeCheckout
                  stripeKey="pk_test_51QOJ4oDZzPFomXhEJc2PFEnX4MqUEEzMkA8gwhbgA7I7GzXobg0QAwn06yuHn2Gb1ofTkwLHiGPI7N8XrxVMi0xt00zvcbJDcy"
                  token={(token) => {
                    makePayment(token);
                  }}
                  name="payment"
                  disabled={!isValid}
                >
                  <button
                    type="button"
                    className={`w-full font-semibold text-white py-3 rounded-lg transition duration-300 ease-in-out ${
                      isValid
                        ? "bg-[#603f26] transform hover:scale-[1.02]"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    onClick={(e) => e.preventDefault()}
                    disabled={!isValid}
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
            className="p-6 bg-white rounded-lg shadow-md h-fit w-full max-w-md mx-auto"
            sx={{
              minWidth: '300px',
              width: '100%',
              maxWidth: '420px', 
              '@media (min-width: 768px)': {
                width: 'auto', 
                minWidth: '350px' 
              }
            }}
          >
            <Typography variant="h5" className="font-bold pb-6 text-gray-900">
              Order Summary
            </Typography>
            {cartItems?.length > 0 && (
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
                        <Typography
                          variant="body2"
                          className="text-gray-600 flex flex-col"
                        >
                          <div>
                            {item?.selectedVariant.color &&
                              `Color: ${item?.selectedVariant?.color}`}
                          </div>
                          <div>
                            {item?.selectedVariant?.size &&
                              `Size: ${item?.selectedVariant?.size} `}
                          </div>
                          <div>
                            {item?.selectedVariant?.material &&
                              `Material: ${item?.selectedVariant?.material}`}
                          </div>
                        </Typography>
                      </div>
                    </div>
                    <div className="text-right">
                      <Typography variant="body1">
                        {item?.quantity} x{" "}
                        <span className="font-semibold">
                          Rs {item?.productId?.price.toFixed(2)}
                        </span>
                      </Typography>
                    </div>
                  </div>
                ))}
                <Divider />
                
                {/* Order Calculation Details */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Typography variant="body1">Subtotal</Typography>
                    <Typography variant="body1">
                      Rs {discountedData?.orderSubtotal?.toFixed(2) || calculateSubtotal().toFixed(2)}
                    </Typography>
                  </div>
                  
                  <div className="flex justify-between">
                    <Typography variant="body1">Shipping</Typography>
                    <Typography variant="body1">
                      Rs {discountedData?.shippingCost?.toFixed(2) || "200.00"}
                    </Typography>
                  </div>
                  
                  {/* Display points discount if available */}
                  {discountedData && discountedData.discountAmount > 0 && (
                    <div className="flex justify-between text-[#603f26] font-medium">
                      <Typography variant="body1">
                        Points Discount ({discountedData.pointsRedeemed} points)
                      </Typography>
                      <Typography variant="body1">
                        - Rs {discountedData.discountAmount.toFixed(2)}
                      </Typography>
                    </div>
                  )}
                  
                  {/* Display gift card discount if available */}
                  {discountedData && discountedData.giftCardAmount > 0 && (
                    <div className="flex justify-between text-blue-600 font-medium">
                      <Typography variant="body1">
                        Gift Card Discount
                      </Typography>
                      <Typography variant="body1">
                        - Rs {discountedData.giftCardAmount.toFixed(2)}
                      </Typography>
                    </div>
                  )}
                </div>
                
                <Divider />
                
                <div className="flex justify-between font-bold">
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">
                    Rs {calculateTotal().toFixed(2)}
                  </Typography>
                </div>
                
                {/* Show savings message if applicable */}
                {(discountedData?.discountAmount > 0 || discountedData?.giftCardAmount > 0) && (
                  <div className="text-xs text-[#603f26] font-medium text-right">
                    You saved Rs {(
                      (discountedData?.discountAmount || 0) + 
                      (discountedData?.giftCardAmount || 0)
                    ).toFixed(2)} with your rewards!
                  </div>
                )}
              </div>
            )}
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default Checkout;