import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Chip,
  Box,
  Alert,
  AlertTitle,
  Stack,
  CircularProgress
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  AccessTime as ClockIcon,
  CalendarToday as CalendarIcon,
  CreditCard as CreditCardIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Star as StarIcon,
  ArrowUpward as UpgradeIcon,
  Cancel as CancelIcon
} from "@mui/icons-material";
import StripeCheckout from "react-stripe-checkout";

// Define theme - updated to match ProductReviews
const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
    secondary: {
      main: "#2E7D32",
    },
  },
});

// Mock data for active subscription
const mockActiveSubscription = {
  id: 1,
  name: "Business Pro",
  price: 59.99,
  interval: "monthly",
  startDate: "2024-01-15",
  nextBillingDate: "2024-02-15",
  status: "active",
  features: [
    "Unlimited Products",
    "Priority Support",
    "Advanced Analytics",
    "Custom Domain",
    "API Access"
  ],
  paymentMethod: {
    type: "credit_card",
    last4: "4242",
    expiryDate: "12/25",
    brand: "Visa"
  }
};

// Mock data for subscription plans
const mockSubscriptionPlans = [
  {
    id: 1,
    name: "Starter",
    price: 29.99,
    interval: "monthly",
    features: [
      "10 Products",
      "Basic Support",
      "Basic Analytics",
      "2 Team Members",
      "5GB Storage"
    ],
    popular: false,
    recommended: false,
    priceId: 'price_starter_monthly'
  },
  {
    id: 2,
    name: "Business Pro",
    price: 59.99,
    interval: "monthly",
    features: [
      "Unlimited Products",
      "Priority Support",
      "Advanced Analytics",
      "Custom Domain",
      "API Access"
    ],
    popular: true,
    recommended: true,
    priceId: 'price_business_monthly'
  },
  {
    id: 3,
    name: "Enterprise",
    price: 99.99,
    interval: "monthly",
    features: [
      "Everything in Business Pro",
      "24/7 Phone Support",
      "Custom Integration",
      "Dedicated Account Manager",
      "SLA Guarantee"
    ],
    popular: false,
    recommended: false,
    priceId: 'price_enterprise_monthly'
  }
];

const ManageSubscriptions = () => {
  const [activeSubscription, setActiveSubscription] = useState(mockActiveSubscription);
  const [subscriptionPlans] = useState(mockSubscriptionPlans);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState("monthly");
  const [paymentError, setPaymentError] = useState(null);

  const getDaysRemaining = () => {
    if (!activeSubscription?.nextBillingDate) return 0;
    const nextBilling = new Date(activeSubscription.nextBillingDate);
    const today = new Date();
    return Math.ceil((nextBilling - today) / (1000 * 60 * 60 * 24));
  };

  // Mock payment handling
  const makePayment = async (token, selectedPlan) => {
    setLoading(true);
    setPaymentError(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Simulate successful payment
      setActiveSubscription({
        ...activeSubscription,
        name: selectedPlan.name,
        price: selectedPlan.price,
        features: selectedPlan.features
      });
      setShowUpgradeDialog(false);
      alert('Payment successful!'); // You can replace this with your toast notification
    } catch (error) {
      setPaymentError('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setActiveSubscription(null);
    setShowCancelDialog(false);
    setLoading(false);
    alert('Subscription cancelled successfully!'); // You can replace this with your toast notification
  };

  const renderPlanCard = (plan) => (
    <Grid item xs={12} md={4} key={plan.id}>
      <Card 
        variant="outlined"
        sx={{
          height: '100%',
          position: 'relative',
          border: plan.recommended ? `2px solid ${theme.palette.primary.main}` : undefined
        }}
      >
        {plan.popular && (
          <Chip
            label="Popular"
            color="primary"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
            }}
          />
        )}
        <CardContent>
          <h3 className="text-base font-semibold">{plan.name}</h3>
          <div className="my-4">
            <span className="text-2xl font-bold">${plan.price}</span>
            <span className="text-sm text-gray-500 ml-1">/{selectedInterval}</span>
          </div>
          <div className="space-y-2">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircleIcon color="success" fontSize="small" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardActions>
          {(!activeSubscription || plan.name !== activeSubscription?.name) && (
            <StripeCheckout
              stripeKey="pk_test_51QOJ4oDZzPFomXhEJc2PFEnX4MqUEEzMkA8gwhbgA7I7GzXobg0QAwn06yuHn2Gb1ofTkwLHiGPI7N8XrxVMi0xt00zvcbJDcy"
              token={(token) => makePayment(token, plan)}
              name={`Upgrade to ${plan.name}`}
              amount={plan.price * 100}
              disabled={loading}
            >
              <Button
                fullWidth
                variant="contained"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Select Plan"
                )}
              </Button>
            </StripeCheckout>
          )}
          {activeSubscription && plan.name === activeSubscription?.name && (
            <Button
              fullWidth
              variant="contained"
              disabled
            >
              Current Plan
            </Button>
          )}
        </CardActions>
      </Card>
    </Grid>
  );

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5">
        {/* Header Section */}
        <div className="px-4 md:px-8 lg:px-12 mb-3">
          <h1 className="text-2xl md:text-3xl font-bold text-[#603F26]">
            Subscription Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage your subscription, billing and plan details
          </p>
        </div>

        {/* Stats and Actions */}
        {activeSubscription && (
          <div className="px-4 md:px-8 lg:px-12 mb-3">
            <Card 
              sx={{
                bgcolor: "#603F26",
                color: "white",
                px: 3,
                py: 2,
                borderRadius: 2,
                display: "inline-block"
              }}
            >
              <h2 className="text-2xl font-bold">
                ${activeSubscription.price}
              </h2>
              <p className="text-sm">Monthly Subscription</p>
            </Card>
          </div>
        )}

        {/* Content */}
        <div className="w-full px-4 md:px-8 lg:px-12 mt-4">
          {/* Active Subscription Card */}
          {activeSubscription && (
            <Card elevation={2} className="mb-6">
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold">{activeSubscription.name}</h2>
                    <p className="text-sm text-gray-500">
                      Active Plan
                    </p>
                  </div>
                  <Chip
                    label={activeSubscription.status === "active" ? "Active" : "Inactive"}
                    color={activeSubscription.status === "active" ? "success" : "default"}
                  />
                </div>

                {/* Billing Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 font-medium">
                      Current Period
                    </p>
                    <div className="flex items-center gap-2">
                      <CalendarIcon fontSize="small" />
                      <span>{getDaysRemaining()} days remaining</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 font-medium">
                      Next Billing
                    </p>
                    <div className="flex items-center gap-2">
                      <ClockIcon fontSize="small" />
                      <span>{activeSubscription.nextBillingDate}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 font-medium">
                      Payment Method
                    </p>
                    <div className="flex items-center gap-2">
                      <CreditCardIcon fontSize="small" />
                      <span>•••• {activeSubscription.paymentMethod.last4}</span>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div>
                  <h3 className="text-lg font-bold mb-4">
                    Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeSubscription.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircleIcon color="success" fontSize="small" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardActions className="justify-between p-4 border-t">
                <Button
                  variant="contained"
                  startIcon={<UpgradeIcon />}
                  onClick={() => setShowUpgradeDialog(true)}
                >
                  Change Plan
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => setShowCancelDialog(true)}
                >
                  Cancel Subscription
                </Button>
              </CardActions>
            </Card>
          )}

          {/* No Active Subscription View */}
          {!activeSubscription && (
            <Card elevation={2} className="mb-6">
              <CardContent>
                <div className="text-center py-8">
                  <h2 className="text-xl font-bold mb-3">
                    No Active Subscription
                  </h2>
                  <p className="text-gray-500 mb-6">
                    Choose a plan to get started with our premium features
                  </p>
                  <Button
                    variant="contained"
                    startIcon={<StarIcon />}
                    onClick={() => setShowUpgradeDialog(true)}
                  >
                    View Plans
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Plan Selection Dialog */}
        <Dialog
          open={showUpgradeDialog}
          onClose={() => setShowUpgradeDialog(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle className="bg-[#603F26] text-white flex justify-between items-center">
            Choose a Plan
          </DialogTitle>
          <DialogContent className="mt-4">
            <p className="text-gray-600 mb-6">
              Select the plan that best fits your needs
            </p>
            
            {paymentError && (
              <Alert severity="error" className="mb-6">
                {paymentError}
              </Alert>
            )}

            <Grid container spacing={3}>
              {subscriptionPlans.map(renderPlanCard)}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowUpgradeDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Cancel Dialog */}
        <Dialog
          open={showCancelDialog}
          onClose={() => setShowCancelDialog(false)}
        >
          <DialogTitle className="text-red-600">
            Cancel Subscription
          </DialogTitle>
          <DialogContent>
            <DialogContentText className="mb-3">
              Are you sure you want to cancel your subscription? This action cannot be undone.
            </DialogContentText>
            <Alert severity="warning" className="mt-4">
              <AlertTitle>Warning</AlertTitle>
              Canceling your subscription will result in losing access to all premium features at the end of your current billing period.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCancelDialog(false)}>
              Keep Subscription
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleCancel}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Confirm Cancellation"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default ManageSubscriptions;







// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   Button,
//   Card,
//   CardContent,
//   CardActions,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   Grid,
//   Chip,
//   Box,
//   Alert,
//   AlertTitle,
//   Container,
//   Stack,
//   CircularProgress
// } from "@mui/material";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import {
//   AccessTime as ClockIcon,
//   CalendarToday as CalendarIcon,
//   CreditCard as CreditCardIcon,
//   CheckCircle as CheckCircleIcon,
//   Warning as WarningIcon,
//   Star as StarIcon,
//   ArrowUpward as UpgradeIcon,
//   Cancel as CancelIcon
// } from "@mui/icons-material";
// import StripeCheckout from "react-stripe-checkout";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { showToast } from "../../../../tools";

// // Define theme
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#603F26",
//     },
//     secondary: {
//       main: "#2E7D32",
//     },
//   },
// });

// // Mock data for active subscription
// const mockActiveSubscription = {
//   id: 1,
//   name: "Business Pro",
//   price: 59.99,
//   interval: "monthly",
//   startDate: "2024-01-15",
//   nextBillingDate: "2024-02-15",
//   status: "active",
//   features: [
//     "Unlimited Products",
//     "Priority Support",
//     "Advanced Analytics",
//     "Custom Domain",
//     "API Access"
//   ],
//   paymentMethod: {
//     type: "credit_card",
//     last4: "4242",
//     expiryDate: "12/25",
//     brand: "Visa"
//   }
// };

// // Mock data for subscription plans
// const mockSubscriptionPlans = [
//   {
//     id: 1,
//     name: "Starter",
//     price: 29.99,
//     interval: "monthly",
//     features: [
//       "10 Products",
//       "Basic Support",
//       "Basic Analytics",
//       "2 Team Members",
//       "5GB Storage"
//     ],
//     popular: false,
//     recommended: false,
//     priceId: 'price_starter_monthly'
//   },
//   {
//     id: 2,
//     name: "Business Pro",
//     price: 59.99,
//     interval: "monthly",
//     features: [
//       "Unlimited Products",
//       "Priority Support",
//       "Advanced Analytics",
//       "Custom Domain",
//       "API Access"
//     ],
//     popular: true,
//     recommended: true,
//     priceId: 'price_business_monthly'
//   },
//   {
//     id: 3,
//     name: "Enterprise",
//     price: 99.99,
//     interval: "monthly",
//     features: [
//       "Everything in Business Pro",
//       "24/7 Phone Support",
//       "Custom Integration",
//       "Dedicated Account Manager",
//       "SLA Guarantee"
//     ],
//     popular: false,
//     recommended: false,
//     priceId: 'price_enterprise_monthly'
//   }
// ];

// const ManageSubscriptions = () => {
//   const navigate = useNavigate();
//   const [activeSubscription, setActiveSubscription] = useState(null);
//   const [subscriptionPlans, setSubscriptionPlans] = useState([]);
//   const [showCancelDialog, setShowCancelDialog] = useState(false);
//   const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [selectedInterval, setSelectedInterval] = useState("monthly");
//   const [paymentError, setPaymentError] = useState(null);

//   // Get user data from Redux store
//   const userData = useSelector(state => state.auth);
//   const userId = userData.user._id;

//   // Fetch subscription plans and active subscription on component mount
//   useEffect(() => {
//     const fetchSubscriptionData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           throw new Error("No authentication token found");
//         }

//         // Fetch subscription plans
//         const plansResponse = await axios.get(
//           "http://localhost:3000/subscriptionPlans",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setSubscriptionPlans(plansResponse.data.allplans);

//         // Fetch active subscription
//         const subscriptionResponse = await axios.get(
//           `http://localhost:3000/activeSubscription/${userId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setActiveSubscription(subscriptionResponse.data.subscription);
//       } catch (error) {
//         console.error("Error fetching subscription data:", error);
//         showToast("ERROR", "Failed to load subscription information");
//       }
//     };

//     fetchSubscriptionData();
//   }, [userId]);

//   const getDaysRemaining = () => {
//     if (!activeSubscription?.nextBillingDate) return 0;
//     const nextBilling = new Date(activeSubscription.nextBillingDate);
//     const today = new Date();
//     return Math.ceil((nextBilling - today) / (1000 * 60 * 60 * 24));
//   };

//   const makePayment = async (token, selectedPlan) => {
//     setLoading(true);
//     setPaymentError(null);

//     try {
//       const tokenId = localStorage.getItem("token");
//       if (!tokenId) {
//         throw new Error("No authentication token found");
//       }

//       const body = {
//         token,
//         planName: selectedPlan.name,
//         userId: userId
//       };

//       const response = await axios.post(
//         "http://localhost:3000/planPayment",
//         body,
//         {
//           headers: {
//             Authorization: `Bearer ${tokenId}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       showToast("SUCCESS", "Plan updated successfully");
//       setActiveSubscription({
//         ...activeSubscription,
//         name: selectedPlan.name,
//         price: selectedPlan.price,
//         features: selectedPlan.features
//       });
//       setShowUpgradeDialog(false);
//       navigate('../business_setup');
//     } catch (error) {
//       setPaymentError(error.message || 'Failed to process payment. Please try again.');
//       showToast("ERROR", "Failed to update plan");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = async () => {
//     setLoading(true);
//     try {
//       const tokenId = localStorage.getItem("token");
//       if (!tokenId) {
//         throw new Error("No authentication token found");
//       }

//       await axios.post(
//         "http://localhost:3000/cancelSubscription",
//         { userId },
//         {
//           headers: {
//             Authorization: `Bearer ${tokenId}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       showToast("SUCCESS", "Subscription cancelled successfully");
//       setActiveSubscription(null);
//       setShowCancelDialog(false);
//     } catch (error) {
//       console.error("Cancellation failed:", error);
//       showToast("ERROR", "Failed to cancel subscription");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderPlanCard = (plan) => (
//     <Grid item xs={12} md={4} key={plan.id}>
//       <Card 
//         variant="outlined"
//         sx={{
//           height: '100%',
//           position: 'relative',
//           border: plan.recommended ? `2px solid ${theme.palette.primary.main}` : undefined
//         }}
//       >
//         {plan.popular && (
//           <Chip
//             label="Popular"
//             color="primary"
//             sx={{
//               position: 'absolute',
//               top: 16,
//               right: 16,
//             }}
//           />
//         )}
//         <CardContent>
//           <Typography variant="h6" component="div">
//             {plan.name}
//           </Typography>
//           <Typography variant="h4" component="div" sx={{ my: 2 }}>
//             ${plan.price}
//             <Typography variant="caption" component="span" sx={{ ml: 1 }}>
//               /{selectedInterval}
//             </Typography>
//           </Typography>
//           <Stack spacing={2}>
//             {plan.features.map((feature, index) => (
//               <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <CheckCircleIcon color="success" fontSize="small" />
//                 <Typography variant="body2">{feature}</Typography>
//               </Box>
//             ))}
//           </Stack>
//         </CardContent>
//         <CardActions>
//           {(!activeSubscription || plan.name !== activeSubscription?.name) && (
//             <StripeCheckout
//               stripeKey="pk_test_51QOJ4oDZzPFomXhEJc2PFEnX4MqUEEzMkA8gwhbgA7I7GzXobg0QAwn06yuHn2Gb1ofTkwLHiGPI7N8XrxVMi0xt00zvcbJDcy"
//               token={(token) => makePayment(token, plan)}
//               name={`Upgrade to ${plan.name}`}
//               amount={plan.price * 100}
//               disabled={loading}
//             >
//               <Button
//                 fullWidth
//                 variant="contained"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <CircularProgress size={24} color="inherit" />
//                 ) : (
//                   "Select Plan"
//                 )}
//               </Button>
//             </StripeCheckout>
//           )}
//           {activeSubscription && plan.name === activeSubscription?.name && (
//             <Button
//               fullWidth
//               variant="contained"
//               disabled
//             >
//               Current Plan
//             </Button>
//           )}
//         </CardActions>
//       </Card>
//     </Grid>
//   );

//   return (
//     <ThemeProvider theme={theme}>
//       <Container maxWidth="xl" sx={{ py: 4 }}>
//         <Stack spacing={4}>
//           {/* Header Section */}
//           <Box>
//             <Typography variant="h4" component="h1" gutterBottom>
//               Subscription Management
//             </Typography>
//             <Typography variant="subtitle1" color="text.secondary">
//               Manage your subscription, billing and plan details
//             </Typography>
//           </Box>

//           {/* Active Subscription Card */}
//           {activeSubscription && (
//             <Card elevation={2}>
//               <CardContent>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                   <Box>
//                     <Typography variant="h5">{activeSubscription.name}</Typography>
//                     <Typography variant="subtitle2" color="text.secondary">
//                       Active Plan
//                     </Typography>
//                   </Box>
//                   <Chip
//                     label={activeSubscription.status === "active" ? "Active" : "Inactive"}
//                     color={activeSubscription.status === "active" ? "success" : "default"}
//                   />
//                 </Box>

//                 {/* Billing Info */}
//                 <Grid container spacing={4} sx={{ mb: 4 }}>
//                   <Grid item xs={12} md={4}>
//                     <Stack spacing={1}>
//                       <Typography variant="subtitle2" color="text.secondary">
//                         Current Period
//                       </Typography>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <CalendarIcon fontSize="small" />
//                         <Typography>{getDaysRemaining()} days remaining</Typography>
//                       </Box>
//                     </Stack>
//                   </Grid>
//                   <Grid item xs={12} md={4}>
//                     <Stack spacing={1}>
//                       <Typography variant="subtitle2" color="text.secondary">
//                         Next Billing
//                       </Typography>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <ClockIcon fontSize="small" />
//                         <Typography>{activeSubscription.nextBillingDate}</Typography>
//                       </Box>
//                     </Stack>
//                   </Grid>
//                   <Grid item xs={12} md={4}>
//                     <Stack spacing={1}>
//                       <Typography variant="subtitle2" color="text.secondary">
//                         Payment Method
//                       </Typography>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <CreditCardIcon fontSize="small" />
//                         <Typography>•••• {activeSubscription.paymentMethod.last4}</Typography>
//                       </Box>
//                     </Stack>
//                   </Grid>
//                 </Grid>

//                 {/* Features List */}
//                 <Box>
//                   <Typography variant="h6" gutterBottom>
//                     Features
//                   </Typography>
//                   <Grid container spacing={2}>
//                     {activeSubscription.features.map((feature, index) => (
//                       <Grid item xs={12} sm={6} key={index}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <CheckCircleIcon color="success" fontSize="small" />
//                           <Typography>{feature}</Typography>
//                         </Box>
//                       </Grid>
//                     ))}
//                   </Grid>
//                 </Box>
//               </CardContent>

//               <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
//                 <Button
//                   variant="contained"
//                   startIcon={<UpgradeIcon />}
//                   onClick={() => setShowUpgradeDialog(true)}
//                 >
//                   Change Plan
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="error"
//                   startIcon={<CancelIcon />}
//                   onClick={() => setShowCancelDialog(true)}
//                 >
//                   Cancel Subscription
//                 </Button>
//               </CardActions>
//             </Card>
//           )}

//           {/* Plan Selection Dialog */}
//           <Dialog
//             open={showUpgradeDialog}
//             onClose={() => setShowUpgradeDialog(false)}
//             maxWidth="lg"
//             fullWidth
//           >
//             <DialogTitle>Choose a Plan</DialogTitle>
//             <DialogContent>
//               <DialogContentText sx={{ mb: 4 }}>
//                 Select the plan that best fits your needs
//               </DialogContentText>
              
//               {paymentError && (
//                 <Alert severity="error" sx={{ mb: 3 }}>
//                   {paymentError}
//                 </Alert>
//               )}

//               <Grid container spacing={3}>
//                 {subscriptionPlans.map(renderPlanCard)}
//               </Grid>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setShowUpgradeDialog(false)}>Close</Button>
//             </DialogActions>
//           </Dialog>

//           {/* Cancel Dialog */}
//           <Dialog
//             open={showCancelDialog}
//             onClose={() => setShowCancelDialog(false)}
//           >
//             <DialogTitle>Cancel Subscription</DialogTitle>
//             <DialogContent>
//               <DialogContentText gutterBottom>
//                 Are you sure you want to cancel your subscription? This action cannot be undone.
//               </DialogContentText>
//               <Alert severity="warning" sx={{ mt: 2 }}>
//               <AlertTitle>Warning</AlertTitle>
//                 Canceling your subscription will result in losing access to all premium features at the end of your current billing period.
//               </Alert>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setShowCancelDialog(false)}>
//                 Keep Subscription
//               </Button>
//               <Button
//                 color="error"
//                 variant="contained"
//                 onClick={handleCancel}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <CircularProgress size={24} color="inherit" />
//                 ) : (
//                   "Confirm Cancellation"
//                 )}
//               </Button>
//             </DialogActions>
//           </Dialog>

//           {/* No Active Subscription View */}
//           {!activeSubscription && (
//             <Card elevation={2}>
//               <CardContent>
//                 <Box sx={{ textAlign: 'center', py: 4 }}>
//                   <Typography variant="h5" gutterBottom>
//                     No Active Subscription
//                   </Typography>
//                   <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
//                     Choose a plan to get started with our premium features
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     startIcon={<StarIcon />}
//                     onClick={() => setShowUpgradeDialog(true)}
//                   >
//                     View Plans
//                   </Button>
//                 </Box>
//               </CardContent>
//             </Card>
//           )}
//         </Stack>
//       </Container>
//     </ThemeProvider>
//   );
// };

// export default ManageSubscriptions;