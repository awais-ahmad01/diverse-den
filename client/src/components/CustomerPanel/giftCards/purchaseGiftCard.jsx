// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// // Mock gift card data - in a real app this would come from API
// const MOCK_GIFT_CARDS = [
//   {
//     _id: "gc1",
//     code: "GIFT100",
//     minPrice: 80,
//     maxPrice: 100,
//     status: "active",
//     description: "Holiday special gift card",
//     imageUrl: "/api/placeholder/300/200",
//     createdAt: "2023-11-15"
//   },
//   {
//     _id: "gc2",
//     code: "BDAY50",
//     minPrice: 40,
//     maxPrice: 50,
//     status: "active",
//     description: "Birthday celebration gift card",
//     imageUrl: "/api/placeholder/300/200",
//     createdAt: "2023-10-20"
//   },
//   {
//     _id: "gc3",
//     code: "WELCOME25",
//     minPrice: 20,
//     maxPrice: 25,
//     status: "active",
//     description: "Welcome bonus for new customers",
//     imageUrl: "/api/placeholder/300/200",
//     createdAt: "2023-09-05"
//   },
//   {
//     _id: "gc4",
//     code: "LOYAL200",
//     minPrice: 150,
//     maxPrice: 200,
//     status: "active",
//     description: "Loyalty reward for premium customers",
//     imageUrl: "/api/placeholder/300/200",
//     createdAt: "2023-08-10"
//   },
//   {
//     _id: "gc5",
//     code: "PROMO75",
//     minPrice: 50,
//     maxPrice: 75,
//     status: "active",
//     description: "Promotional gift card for special events",
//     imageUrl: "/api/placeholder/300/200",
//     createdAt: "2023-11-01"
//   }
// ];

// const GiftCardPurchase = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
  
//   const [loading, setLoading] = useState(true);
//   const [giftCard, setGiftCard] = useState(null);
  
//   // Form state
//   const [formData, setFormData] = useState({
//     amount: "",
//     recipientEmail: "",
//     recipientName: "",
//     senderName: "",
//     message: "",
//   });
  
//   // Validation state
//   const [errors, setErrors] = useState({});
//   const [processingPayment, setProcessingPayment] = useState(false);
//   const [purchaseSuccess, setPurchaseSuccess] = useState(false);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   useEffect(() => {
//     // Simulate API call to fetch gift card details
//     setLoading(true);
    
//     // Find gift card by id in mock data
//     setTimeout(() => {
//       const foundGiftCard = MOCK_GIFT_CARDS.find(card => card._id === id);
      
//       if (foundGiftCard) {
//         setGiftCard(foundGiftCard);
//         setFormData(prev => ({
//           ...prev,
//           amount: foundGiftCard.minPrice.toString()
//         }));
//       }
      
//       setLoading(false);
//     }, 800);
//   }, [id]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     // Clear error for this field when user starts typing
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: null
//       });
//     }
    
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     // Validate amount
//     if (!formData.amount) {
//       newErrors.amount = "Amount is required";
//     } else {
//       const amount = parseFloat(formData.amount);
//       if (isNaN(amount)) {
//         newErrors.amount = "Please enter a valid number";
//       } else if (amount < giftCard.minPrice) {
//         newErrors.amount = `Amount cannot be less than Rs ${giftCard.minPrice}`;
//       } else if (amount > giftCard.maxPrice) {
//         newErrors.amount = `Amount cannot exceed Rs ${giftCard.maxPrice}`;
//       }
//     }
    
//     // Validate recipient email
//     if (!formData.recipientEmail) {
//       newErrors.recipientEmail = "Recipient email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.recipientEmail)) {
//       newErrors.recipientEmail = "Please enter a valid email address";
//     }
    
//     // Validate recipient name
//     if (!formData.recipientName) {
//       newErrors.recipientName = "Recipient name is required";
//     }
    
//     // Validate sender name
//     if (!formData.senderName) {
//       newErrors.senderName = "Your name is required";
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }
    
//     // Simulate payment processing
//     setProcessingPayment(true);
    
//     setTimeout(() => {
//       setProcessingPayment(false);
//       setPurchaseSuccess(true);
      
//       // After successful purchase, redirect to confirmation page after 2 seconds
//       setTimeout(() => {
//         navigate("/customer/gift-cards");
//         // In a real app, you might want to navigate to a confirmation or thank you page
//         // navigate("/customer/gift-card-confirmation/" + id);
//       }, 2000);
//     }, 1500);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#603F26]"></div>
//       </div>
//     );
//   }

//   if (!giftCard) {
//     return (
//       <div className="container mx-auto px-4 py-16 text-center">
//         <h2 className="text-2xl font-bold text-gray-800">Gift Card Not Found</h2>
//         <p className="mt-4 text-gray-600">The gift card you're looking for doesn't exist or has been removed.</p>
//         <button 
//           onClick={() => navigate("/customer/gift-cards")}
//           className="mt-6 bg-[#603F26] text-white px-6 py-2 rounded-md hover:bg-[#4A2E1B] transition-colors"
//         >
//           Back to Gift Cards
//         </button>
//       </div>
//     );
//   }

//   if (purchaseSuccess) {
//     return (
//       <div className="container mx-auto px-4 py-16 text-center">
//         <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
//           <div className="w-16 h-16 bg-green-100 mx-auto rounded-full flex items-center justify-center mb-4">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800">Purchase Successful!</h2>
//           <p className="mt-4 text-gray-600">
//             Your gift card has been sent to {formData.recipientEmail}. Thank you for your purchase!
//           </p>
//           <p className="mt-2 text-sm text-gray-500">
//             You will be redirected to the gift cards page shortly.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Back button */}
//         <button 
//           onClick={() => navigate("/customer/gift-cards")}
//           className="flex items-center text-[#603F26] mb-6 hover:underline"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
//           </svg>
//           Back to Gift Cards
//         </button>
        
//         <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
//           {/* Gift Card Preview */}
//           <div className="lg:w-5/12 bg-gray-50 p-6 flex flex-col">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-2xl font-bold text-gray-800">{giftCard.description}</h2>
//               <span className="bg-[#603F26] text-white px-3 py-1 rounded-full text-sm font-semibold">
//                 {giftCard.code}
//               </span>
//             </div>
            
//             <div className="flex-grow relative flex items-center justify-center bg-white rounded-lg shadow-md overflow-hidden mb-6">
//               <img
//                 src={giftCard.imageUrl}
//                 alt={giftCard.description}
//                 className="object-cover w-full h-full"
//               />
              
//               {/* Price overlay */}
//               <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4">
//                 <div className="text-sm">Price Range:</div>
//                 <div className="text-xl font-bold">
//                   Rs {giftCard.minPrice.toFixed(2)} - Rs {giftCard.maxPrice.toFixed(2)}
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-gray-100 rounded-lg p-4">
//               <h3 className="font-semibold text-gray-700 mb-2">Gift Card Details</h3>
//               <ul className="text-sm text-gray-600 space-y-2">
//                 <li>• Valid for all products in our store</li>
//                 <li>• Can be redeemed online or in-store</li>
//                 <li>• Valid for 12 months from purchase</li>
//                 <li>• Non-refundable</li>
//               </ul>
//             </div>
//           </div>
          
//           {/* Purchase Form */}
//           <div className="lg:w-7/12 p-6 lg:p-8">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">Customize Your Gift Card</h2>
            
//             <form onSubmit={handleSubmit}>
//               <div className="space-y-6">
//                 {/* Amount */}
//                 <div>
//                   <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
//                     Gift Card Amount *
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <span className="text-gray-500">Rs</span>
//                     </div>
//                     <input
//                       type="number"
//                       id="amount"
//                       name="amount"
//                       step="0.01"
//                       min={giftCard.minPrice}
//                       max={giftCard.maxPrice}
//                       value={formData.amount}
//                       onChange={handleInputChange}
//                       className={`pl-10 block w-full rounded-md border ${errors.amount ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-[#603F26] focus:border-[#603F26]`}
//                       placeholder={`${giftCard.minPrice} - ${giftCard.maxPrice}`}
//                     />
//                   </div>
//                   {errors.amount && (
//                     <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
//                   )}
//                   <p className="mt-1 text-xs text-gray-500">
//                     Amount must be between Rs {giftCard.minPrice.toFixed(2)} and Rs {giftCard.maxPrice.toFixed(2)}
//                   </p>
//                 </div>
                
//                 {/* Recipient Details */}
//                 <div className="space-y-4">
//                   <h3 className="font-medium text-gray-800">Recipient Details</h3>
                  
//                   <div>
//                     <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">
//                       Recipient's Name *
//                     </label>
//                     <input
//                       type="text"
//                       id="recipientName"
//                       name="recipientName"
//                       value={formData.recipientName}
//                       onChange={handleInputChange}
//                       className={`block w-full rounded-md border ${errors.recipientName ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-[#603F26] focus:border-[#603F26]`}
//                       placeholder="Enter recipient's name"
//                     />
//                     {errors.recipientName && (
//                       <p className="mt-1 text-sm text-red-600">{errors.recipientName}</p>
//                     )}
//                   </div>
                  
//                   <div>
//                     <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mb-1">
//                       Recipient's Email *
//                     </label>
//                     <input
//                       type="email"
//                       id="recipientEmail"
//                       name="recipientEmail"
//                       value={formData.recipientEmail}
//                       onChange={handleInputChange}
//                       className={`block w-full rounded-md border ${errors.recipientEmail ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-[#603F26] focus:border-[#603F26]`}
//                       placeholder="email@example.com"
//                     />
//                     {errors.recipientEmail && (
//                       <p className="mt-1 text-sm text-red-600">{errors.recipientEmail}</p>
//                     )}
//                   </div>
//                 </div>
                
//                 {/* Sender Details */}
//                 <div>
//                   <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-1">
//                     Your Name *
//                   </label>
//                   <input
//                     type="text"
//                     id="senderName"
//                     name="senderName"
//                     value={formData.senderName}
//                     onChange={handleInputChange}
//                     className={`block w-full rounded-md border ${errors.senderName ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-[#603F26] focus:border-[#603F26]`}
//                     placeholder="Enter your name"
//                   />
//                   {errors.senderName && (
//                     <p className="mt-1 text-sm text-red-600">{errors.senderName}</p>
//                   )}
//                 </div>
                
//                 {/* Personal Message */}
//                 <div>
//                   <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
//                     Personal Message (Optional)
//                   </label>
//                   <textarea
//                     id="message"
//                     name="message"
//                     rows="3"
//                     value={formData.message}
//                     onChange={handleInputChange}
//                     className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-[#603F26] focus:border-[#603F26]"
//                     placeholder="Add a personal message to the recipient..."
//                   ></textarea>
//                   <p className="mt-1 text-xs text-gray-500">
//                     Maximum 200 characters
//                   </p>
//                 </div>
                
//                 {/* Submit Button */}
//                 <div className="pt-4">
//                   <button
//                     type="submit"
//                     disabled={processingPayment}
//                     className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#603F26] hover:bg-[#4A2E1B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#603F26] ${processingPayment ? 'opacity-75 cursor-not-allowed' : ''}`}
//                   >
//                     {processingPayment ? (
//                       <>
//                         <span className="mr-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
//                         Processing...
//                       </>
//                     ) : (
//                       `Purchase Gift Card - Rs ${parseFloat(formData.amount || 0).toFixed(2)}`
//                     )}
//                   </button>
                  
//                   <p className="mt-3 text-center text-xs text-gray-500">
//                     By purchasing this gift card, you agree to our Terms and Conditions
//                   </p>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GiftCardPurchase;












import React, { useState, useEffect } from "react";
import {
  CreditCard as CreditCardIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  ShoppingCart as ShoppingCartIcon,
  CardGiftcard as GiftIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  Divider,
  Chip,
  TextareaAutosize,
  Alert
} from "@mui/material";

// Mock gift card data from parent component
const MOCK_GIFT_CARDS = [
  {
    _id: "gc1",
    code: "GIFT100",
    minPrice: 80,
    maxPrice: 100,
    status: "active",
    description: "Holiday special gift card",
    imageUrl: "/api/placeholder/300/200",
    createdAt: "2023-11-15"
  },
  {
    _id: "gc2",
    code: "BDAY50",
    minPrice: 40,
    maxPrice: 50,
    status: "active",
    description: "Birthday celebration gift card",
    imageUrl: "/api/placeholder/300/200",
    createdAt: "2023-10-20"
  },
  {
    _id: "gc3",
    code: "WELCOME25",
    minPrice: 20,
    maxPrice: 25,
    status: "active",
    description: "Welcome bonus for new customers",
    imageUrl: "/api/placeholder/300/200",
    createdAt: "2023-09-05"
  },
  {
    _id: "gc4",
    code: "LOYAL200",
    minPrice: 150,
    maxPrice: 200,
    status: "active",
    description: "Loyalty reward for premium customers",
    imageUrl: "/api/placeholder/300/200",
    createdAt: "2023-08-10"
  },
  {
    _id: "gc5",
    code: "PROMO75",
    minPrice: 50,
    maxPrice: 75,
    status: "active",
    description: "Promotional gift card for special events",
    imageUrl: "/api/placeholder/300/200",
    createdAt: "2023-11-01"
  }
];

const GiftCardPurchase = () => {
  // For demo purposes, we'll show the first gift card
  const [giftCard, setGiftCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Effect to scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Effect to fetch gift card details - simulating API call
  useEffect(() => {
    setLoading(true);
    // In a real application, you would fetch by ID from URL params
    // For now, let's just use the first gift card from the mock data
    setTimeout(() => {
      setGiftCard(MOCK_GIFT_CARDS[0]);
      // Set default selected amount to the minimum price
      setSelectedAmount(MOCK_GIFT_CARDS[0].minPrice);
      setLoading(false);
    }, 800);
  }, []);

  // Predefined amount options based on the gift card range
  const getAmountOptions = () => {
    if (!giftCard) return [];
    
    const { minPrice, maxPrice } = giftCard;
    const step = (maxPrice - minPrice) / 3;
    
    return [
      minPrice,
      Math.round(minPrice + step),
      Math.round(minPrice + 2 * step),
      maxPrice
    ];
  };

  // Handle custom amount change
  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    
    // If valid, set as selected amount
    if (value && !isNaN(value)) {
      const numValue = Number(value);
      if (giftCard && numValue >= giftCard.minPrice && numValue <= giftCard.maxPrice) {
        setSelectedAmount(numValue);
        setError("");
      } else {
        setSelectedAmount(null);
        setError(`Please enter an amount between Rs ${giftCard.minPrice} and Rs ${giftCard.maxPrice}`);
      }
    } else {
      setSelectedAmount(null);
      setError("");
    }
  };

  // Check if the form is valid
  const isFormValid = () => {
    return (
      selectedAmount !== null && 
      recipientEmail.trim() !== "" && 
      recipientName.trim() !== "" && 
      senderName.trim() !== ""
    );
  };

  // Handle form submission
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isFormValid()) {
      alert(`Gift card purchase successful!\nAmount: Rs ${selectedAmount}\nRecipient: ${recipientName} (${recipientEmail})`);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!giftCard) {
    return (
      <Box textAlign="center" p={4}>
        <Typography variant="h4" gutterBottom>
          Gift Card Not Found
        </Typography>
        <Typography variant="body1" paragraph>
          The requested gift card could not be found.
        </Typography>
        <Button 
          onClick={() => window.history.back()} 
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Gift Cards
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 5, px: { xs: 2, md: 4 }, pb: 8, maxWidth: 'xl', mx: 'auto' }}>
      {/* Navigation/Breadcrumb */}
      <Box mb={4}>
        <Button 
          onClick={() => window.history.back()} 
          startIcon={<ArrowBackIcon />}
          color="primary"
          sx={{ textTransform: 'none' }}
        >
          Back to Gift Cards
        </Button>
      </Box>
      
      <Grid container spacing={4}>
        {/* Left: Gift Card Image and Details */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={3} sx={{ overflow: 'hidden' }}>
            {/* Gift Card Image */}
            <Box position="relative" height={320}>
              <img
                src={giftCard.imageUrl}
                alt={giftCard.description}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
              <Chip
                label={giftCard.code}
                color="primary"
                sx={{ 
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  px: 2,
                  py: 1
                }}
              />
            </Box>
            
            {/* Gift Card Details */}
            <Box p={3}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                {giftCard.description}
              </Typography>
              
              <Box sx={{ '& > *:not(:last-child)': { mb: 2 } }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <CreditCardIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Price Range</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      Rs {giftCard.minPrice.toFixed(2)} - Rs {giftCard.maxPrice.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
                
                <Box display="flex" alignItems="center" gap={2}>
                  <CalendarIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Created On</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {new Date(giftCard.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                
                <Box display="flex" alignItems="flex-start" gap={2}>
                  <DescriptionIcon color="primary" sx={{ mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Description</Typography>
                    <Typography variant="body1">
                      Perfect for any occasion! This gift card can be used for any purchase in our store.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Right: Purchase Form */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <GiftIcon color="primary" />
              Purchase Gift Card
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit}>
              {/* Select Amount */}
              <Box mb={4}>
                <Typography variant="subtitle1" component="label" fontWeight="medium" gutterBottom display="block">
                  Select Amount
                </Typography>
                <Grid container spacing={1} mb={2}>
                  {getAmountOptions().map((amount) => (
                    <Grid item xs={6} sm={3} key={amount}>
                      <Button
                        fullWidth
                        variant={selectedAmount === amount ? "contained" : "outlined"}
                        color={selectedAmount === amount ? "primary" : "inherit"}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount("");
                          setError("");
                        }}
                        sx={{ py: 1.5 }}
                      >
                        Rs {amount.toFixed(2)}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
                
                {/* Custom Amount */}
                <Box mt={2}>
                  <Typography variant="body2" component="label" gutterBottom display="block">
                    Custom Amount (Rs {giftCard.minPrice} - Rs {giftCard.maxPrice})
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder={`Enter amount between Rs ${giftCard.minPrice} - Rs ${giftCard.maxPrice}`}
                    variant="outlined"
                    error={!!error}
                    helperText={error}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>Rs</Typography>,
                    }}
                    inputProps={{
                      min: giftCard.minPrice,
                      max: giftCard.maxPrice,
                      step: "0.01"
                    }}
                  />
                </Box>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Recipient Information */}
              <Box mb={4}>
                <Typography variant="subtitle1" component="h3" fontWeight="medium" gutterBottom>
                  Recipient Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Recipient's Name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Recipient's Email"
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      required
                    />
                  </Grid>
                </Grid>
              </Box>
              
              {/* Sender Information */}
              <Box mb={4}>
                <Typography variant="subtitle1" component="h3" fontWeight="medium" gutterBottom>
                  From
                </Typography>
                <TextField
                  fullWidth
                  label="Your Name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  required
                />
              </Box>
              
              {/* Gift Message */}
              <Box mb={4}>
                <Typography variant="subtitle1" component="label" gutterBottom display="block">
                  Message (Optional)
                </Typography>
                <TextareaAutosize
                  minRows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal message to the recipient"
                  style={{
                    width: '100%',
                    padding: '16.5px 14px',
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </Box>
              
              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={!isFormValid()}
                startIcon={<ShoppingCartIcon />}
                sx={{ py: 1.5, fontWeight: 'bold' }}
              >
                Purchase Gift Card {selectedAmount && `(Rs ${selectedAmount.toFixed(2)})`}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GiftCardPurchase;