import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { showToast } from "../../../tools";
import StripeCheckout from "react-stripe-checkout";
import {
  TextField,
  Paper,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { getGiftCardById, placeGiftCardOrder } from "../../../store/actions/giftCards";

const giftCardSchema = yup.object().shape({
  amount: yup
    .number()
    .required("Amount is required")
    .typeError("Please enter a valid number"),
  
  recipientEmail: yup
    .string()
    .required("Recipient Email is required")
    .email("Invalid email address"),
  
  recipientName: yup
    .string()
    .required("Recipient Name is required")
    .min(2, "Recipient Name must be at least 2 characters"),
  
  senderName: yup
    .string()
    .required("Your Name is required")
    .min(2, "Your Name must be at least 2 characters"),
  
  personalMessage: yup
    .string()
    .max(200, "Message cannot exceed 200 characters"),
});

const GiftCardPurchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isauthenticated } = useSelector((state) => state.auth);
  const { giftCardById, isloading } = useSelector((state) => state.giftCards);
  
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!isauthenticated) {
      showToast("ERROR", "Please login to purchase gift cards");
      navigate("/login");
      return;
    }
    
    dispatch(getGiftCardById(id));
  }, [id, isauthenticated, navigate, dispatch]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(giftCardSchema),
    defaultValues: {
      amount: "",
      recipientEmail: "",
      recipientName: "",
      senderName: "",
      personalMessage: "",
    },
    mode: "onChange"
  });

  // Set initial amount when gift card data is loaded
  useEffect(() => {
    if (giftCardById?.data) {
      setValue("amount", parseInt(giftCardById.data.minPrice));
    }
  }, [giftCardById, setValue]);

  const amount = watch("amount");

  console.log("amount:", amount);

  const makePayment = (token) => {
    const tokenId = localStorage.getItem("token");

    if (!tokenId) {
      console.error("No token found!");
      return;
    }

    setProcessingPayment(true);

    const body = {
      token,
      totalAmount: parseFloat(amount),
      userId: user._id,
    };

    console.log("booooddddy:", body);

    return axios
      .post("http://localhost:3000/OrderPayment", body, {
        headers: {
          Authorization: `Bearer ${tokenId}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        showToast("SUCCESS", "Payment Successful!");
        setProcessingPayment(false);
        setPaymentSuccess(true);
      })
      .catch((error) => {
        showToast("ERROR", "Payment Failed!");
        setProcessingPayment(false);
        throw error;
      });
  };

  const onSubmit = (data) => {
    setPlacingOrder(true);
    
    const orderData = {
      ...data,
      giftCardId: id,
      userId: user._id,
      price: parseFloat(amount),
    };

    console.log("orderData:", orderData);


    dispatch(placeGiftCardOrder(orderData))
    .unwrap()
      .then((response) => {
        showToast("SUCCESS", "Gift Card Order Placed Successfully!");
        setPlacingOrder(false);
         
        setTimeout(() => {
          navigate("/customer/giftCards");
        }, 2000);
      })
      .catch((error) => {
        showToast("ERROR", "Failed to place gift card order");
        setPlacingOrder(false);
      });
  };

  if (isloading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress sx={{ color: "#603f26" }} />
      </div>
    );
  }

  if (!giftCardById?.data) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Gift Card Not Found</h2>
        <p className="mt-4 text-gray-600">The gift card you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate("/customer/gift-cards")}
          className="mt-6 bg-[#603F26] text-white px-6 py-2 rounded-md hover:bg-[#4A2E1B] transition-colors"
        >
          Back to Gift Cards
        </button>
      </div>
    );
  }

  const giftCard = giftCardById.data;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Gift Card Preview */}
          <Paper
            elevation={3}
            className="p-6 bg-white rounded-lg shadow-md h-fit w-full max-w-md mx-auto md:col-span-1"
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
            <Typography variant="h5" className="font-bold pb-4 text-gray-900">
              Gift Card Preview
            </Typography>
            
            <div className="flex justify-between items-center mb-4">
              <Typography variant="subtitle1" className="font-semibold text-gray-800">
                {giftCard.description}
              </Typography>
              <span className="bg-[#603F26] text-white px-3 py-1 rounded-full text-sm font-semibold">
                {giftCard.code}
              </span>
            </div>
            
            <div className="relative rounded-lg overflow-hidden mb-6 border border-gray-200">
              <img
                src={giftCard.imagePath}
                alt={giftCard.description}
                className="object-cover w-full h-48"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/300x200?text=Gift+Card";
                }}
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4">
                <div className="text-sm">Price Range:</div>
                <div className="text-xl font-bold">
                  Rs {parseInt(giftCard.minPrice).toFixed(2)} - Rs {parseInt(giftCard.maxPrice).toFixed(2)}
                </div>
              </div>
            </div>
            
            <Divider className="my-4" />
            
            <Typography variant="h6" className="font-semibold mb-4">
              Order Summary
            </Typography>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Typography variant="body1">Gift Card Amount</Typography>
                <Typography variant="body1">
                  Rs {parseFloat(amount || 0).toFixed(2)}
                </Typography>
              </div>
              
              <Divider className="my-2" />
              
              <div className="flex justify-between font-bold">
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">
                  Rs {parseFloat(amount || 0).toFixed(2)}
                </Typography>
              </div>
            </div>
          </Paper>

          {/* Purchase Form */}
          <Paper
            elevation={3}
            className="md:col-span-2 p-6 bg-white rounded-lg shadow-md"
          >
            <Typography variant="h4" className="font-bold pb-6 text-gray-800">
              Customize Your Gift Card
            </Typography>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Amount */}
              <Controller
                name="amount"
                control={control}
                rules={{
                  validate: (value) => {
                    const numValue = parseFloat(value);
                    if (numValue < parseInt(giftCard.minPrice)) {
                      return `Amount cannot be less than Rs ${parseInt(giftCard.minPrice)}`;
                    }
                    if (numValue > parseInt(giftCard.maxPrice)) {
                      return `Amount cannot exceed Rs ${parseInt(giftCard.maxPrice)}`;
                    }
                    return true;
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Gift Card Amount"
                    type="number"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <span className="text-gray-500 mr-1">Rs</span>,
                    }}
                    error={!!errors.amount}
                    helperText={errors.amount?.message || `Amount must be between Rs ${parseInt(giftCard.minPrice).toFixed(2)} and Rs ${parseInt(giftCard.maxPrice).toFixed(2)}`}
                    className="mb-4"
                  />
                )}
              />

              {/* Recipient Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <Controller
                  name="recipientName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Recipient's Name"
                      variant="outlined"
                      fullWidth
                      error={!!errors.recipientName}
                      helperText={errors.recipientName?.message}
                      className="mb-4"
                    />
                  )}
                />
                
                <Controller
                  name="recipientEmail"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Recipient's Email"
                      type="email"
                      variant="outlined"
                      fullWidth
                      error={!!errors.recipientEmail}
                      helperText={errors.recipientEmail?.message}
                      className="mb-4"
                    />
                  )}
                />
              </div>

              {/* Sender Name */}
              <Controller
                name="senderName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Your Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.senderName}
                    helperText={errors.senderName?.message}
                    className="mb-4"
                  />
                )}
              />

              {/* Personal Message */}
              <Controller
                name="personalMessage"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Personal Message (Optional)"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.personalMessage}
                    helperText={errors.personalMessage?.message || "Maximum 200 characters"}
                    className="mb-4"
                  />
                )}
              />

              {/* Payment and Order Buttons */}
              {!paymentSuccess ? (
                <StripeCheckout
                  stripeKey="pk_test_51QOJ4oDZzPFomXhEJc2PFEnX4MqUEEzMkA8gwhbgA7I7GzXobg0QAwn06yuHn2Gb1ofTkwLHiGPI7N8XrxVMi0xt00zvcbJDcy"
                  token={makePayment}
                  name="Gift Card Payment"
                  // amount={parseFloat(amount || 0) * 100}
                 
                  // currency="PKR"  
                  // label={`Pay ${parseFloat(amount || 0).toFixed(2)}`} 
                 
                  disabled={!isValid || processingPayment}
                  // locale="auto"
                >
                  <button
                    type="button"
                    className={`w-full font-semibold text-white py-3 rounded-lg transition duration-300 ease-in-out ${
                      isValid && !processingPayment
                        ? "bg-[#603f26] transform hover:scale-[1.02]"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!isValid || processingPayment}
                  >
                    {processingPayment ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      `Pay - Rs ${parseFloat(amount || 0).toFixed(2)}`
                    )}
                  </button>
                </StripeCheckout>
              ) : (
                <button
                  type="submit"
                  className={`w-full bg-[#603f26] font-semibold text-white py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02] ${
                    placingOrder ? "opacity-75" : ""
                  }`}
                  disabled={placingOrder}
                >
                  {placingOrder ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Placing Order...
                    </div>
                  ) : (
                    "Place Order"
                  )}
                </button>
              )}
            </form>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default GiftCardPurchase;