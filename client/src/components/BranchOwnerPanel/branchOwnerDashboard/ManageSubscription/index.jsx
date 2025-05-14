// import React, { useEffect, useState } from "react";
// import axios from 'axios';
// import { showToast, Loader } from "../../../../tools";
// import {
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
//   Typography,
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
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// import { viewActiveSubscriptionPlan, getSubscriptionPlans, cancelSubscriptionPlan } from "../../../../store/actions/subscriptionPlans";


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



// const ManageSubscriptions = () => {

//   const navigate = useNavigate()

//   const dispatch = useDispatch();

//   const { user } = useSelector(state => state.auth);

//   console.log("user:", user);
  

//   const userId = user?._id;

//   const {activeSubscriptionPlan, subscriptionPlans, isloading} = useSelector(state => state.subscriptionPlans);



 

//   const [showCancelDialog, setShowCancelDialog] = useState(false);
//   const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  
//   const [selectedInterval, setSelectedInterval] = useState("monthly");
//   const [paymentError, setPaymentError] = useState(null);



//   useEffect(() => {
//     const businessId = user?.business;
//     dispatch(viewActiveSubscriptionPlan(businessId));

//     dispatch(getSubscriptionPlans());

   

//   }, [dispatch, user?.business]);

//   // const getDaysRemaining = () => {
//   //   if (!activeSubscription?.nextBillingDate) return 0;
//   //   const nextBilling = new Date(activeSubscription.nextBillingDate);
//   //   const today = new Date();
//   //   return Math.ceil((nextBilling - today) / (1000 * 60 * 60 * 24));
//   // };

  



//   const makePayment = (token, selectedPlan) => {

//     const tokenId = localStorage.getItem("token"); 

//     if (!tokenId) {
//       console.error("No token found!");
//       return; 
//     }

//     const body = {
//       token,
//       planName:selectedPlan,
//       userId
//     };

//     console.log("Plan: ", selectedPlan )
//     console.log('UserId: ', userId )

//     return axios
//       .post("http://localhost:3000/planPayment", body,
//         {
//           headers: {
//             Authorization: `Bearer ${tokenId}`, 
//             "Content-Type": "application/json",
//           },
//         }
//       )
//       .then((response) => {
//         console.log(response.data)
//         showToast("SUCCESS", 'Plan added successfully.')
//         setShowUpgradeDialog(false)
//         const businessId = user?.business;
//     dispatch(viewActiveSubscriptionPlan(businessId));
        
        
//       })
//       .catch((error) => {
//         throw error;
//       });
//   };



//   const handleCancel =  () => {

//     const userId = user?._id;
   
//     dispatch(cancelSubscriptionPlan(userId))
//     .unwrap()
//     .then(() => {
//       showToast("SUCCESS", "Subscription cancelled successfully");
//       setShowCancelDialog(false);
//       navigate('../../subscription')
//     })
//     .catch(() => {
//       showToast("ERROR", "Failed to cancel subscription");
//     })

   
//   };




//   const renderPlanCard = (plan) => (
//     <Grid item xs={12} md={4} key={plan.id}>
//       <Card 
//         variant="outlined"
//         sx={{
//           height: '100%',
//           position: 'relative',
//           border: (activeSubscriptionPlan && plan?.name === activeSubscriptionPlan?.activePlan?.name) ? `2px solid ${theme.palette.primary.main}` : undefined
//         }}
//       >
//         {/* {plan.popular && (
//           <Chip
//             label="Popular"
//             color="primary"
//             sx={{
//               position: 'absolute',
//               top: 16,
//               right: 16,
//             }}
//           />
//         )} */}
//         <CardContent>
//           <h3 className="text-base font-semibold">{plan.name}</h3>
//           <div className="my-4">
//             <span className="text-2xl font-bold">${plan.price}</span>
//             <span className="text-sm text-gray-500 ml-1">/{selectedInterval}</span>
//           </div>
//           <div className="space-y-2">
//             {plan.features.map((feature, index) => (
//               <div key={index} className="flex items-center gap-2">
//                 <CheckCircleIcon color="success" fontSize="small" />
//                 <span className="text-sm">{feature}</span>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//         <CardActions>
//           {(!activeSubscriptionPlan || plan.name !== activeSubscriptionPlan?.activePlan?.name) && (
//             <StripeCheckout
//               stripeKey="pk_test_51QOJ4oDZzPFomXhEJc2PFEnX4MqUEEzMkA8gwhbgA7I7GzXobg0QAwn06yuHn2Gb1ofTkwLHiGPI7N8XrxVMi0xt00zvcbJDcy"
//               token={(token) => makePayment(token, plan?.name)}
//               name={`Upgrade to ${plan.name}`}
//               amount={plan.price * 100}
//               // disabled={loading}
//             >
//               <Button
//                 fullWidth
//                 variant="contained"
//                 // disabled={loading}
//               >
//                Select Plan 
//                 {/* {loading ? (
//                   <CircularProgress size={24} color="inherit" />
//                 ) : (
//                   "Select Plan"
//                 )} */}
//               </Button>
            
//             </StripeCheckout>
//           )}
//           {activeSubscriptionPlan && plan.name === activeSubscriptionPlan?.activePlan?.name && (
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


  
//   if(isloading){
//     return <Loader/>
//   }



//   return (
//     <ThemeProvider theme={theme}>
//       <div className="relative bg-gray-50 flex flex-col pt-5">


     
//         <div className="px-4 md:px-8 lg:px-12 mb-3">
//           <Typography
//                       variant="h4"
//                       sx={{ color: "#603F26", fontWeight: "bold" }}
//                     >
//                        Subscription Management
//                     </Typography>
//           {/* <h1 className="text-2xl md:text-3xl font-bold text-[#603F26]">
//             Subscription Management
//           </h1> */}
//           <p className="text-sm text-gray-500">
//             Manage your subscription, billing and plan details
//           </p>
//         </div>

       
//         {activeSubscriptionPlan && (
//           <div className="px-4 md:px-8 lg:px-12 mb-3">
//             <Card 
//               sx={{
//                 bgcolor: "#603F26",
//                 color: "white",
//                 px: 3,
//                 py: 2,
//                 borderRadius: 2,
//                 display: "inline-block"
//               }}
//             >
//               <h2 className="text-2xl font-bold">
//                 Rs {activeSubscriptionPlan?.activePlan?.price}
//               </h2>
//               <p className="text-sm">Monthly Subscription</p>
//             </Card>
//           </div>
//         )}

     
//         <div className="w-full px-4 md:px-8 lg:px-12 mt-4">
//           {/* Active Subscription Card */}
//           {activeSubscriptionPlan && (
//             <Card elevation={2} className="mb-6">
//               <CardContent>
//                 <div className="flex justify-between items-center mb-6">
//                   <div>
//                     <h2 className="text-xl font-bold">{activeSubscriptionPlan?.activePlan?.name}</h2>
//                     <p className="text-sm text-gray-500">
//                       Active Plan
//                     </p>
//                   </div>
//                   <Chip
//                     label={"Active"}
//                     color={"success"}
//                     // label={activeSubscription.status === "active" ? "Active" : "Inactive"}
//                     // color={activeSubscription.status === "active" ? "success" : "default"}
//                   />
//                 </div>

               
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

//                 <div className="space-y-2">
//                     <p className="text-sm text-gray-500 font-medium">
//                       Expiry Date
//                     </p>
//                     <div className="flex items-center gap-2">
//                       <ClockIcon fontSize="small" />
//                       <span>{activeSubscriptionPlan?.planExpiry}</span>
//                     </div>
//                   </div>
//                   {/* <div className="space-y-2">
//                     <p className="text-sm text-gray-500 font-medium">
//                       Current Period
//                     </p>
//                     <div className="flex items-center gap-2">
//                       <CalendarIcon fontSize="small" />
//                       <span>{getDaysRemaining()} days remaining</span>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <p className="text-sm text-gray-500 font-medium">
//                       Next Billing
//                     </p>
//                     <div className="flex items-center gap-2">
//                       <ClockIcon fontSize="small" />
//                       <span>{activeSubscription.nextBillingDate}</span>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <p className="text-sm text-gray-500 font-medium">
//                       Payment Method
//                     </p>
//                     <div className="flex items-center gap-2">
//                       <CreditCardIcon fontSize="small" />
//                       <span>•••• {activeSubscription.paymentMethod.last4}</span>
//                     </div>
//                   </div> */}
//                 </div>

               
//                 <div>
//                   <h3 className="text-lg font-bold mb-4">
//                     Features
//                   </h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     {activeSubscriptionPlan?.activePlan?.features.map((feature, index) => (
//                       <div key={index} className="flex items-center gap-2">
//                         <CheckCircleIcon color="success" fontSize="small" />
//                         <span>{feature}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>

//               <CardActions className="justify-between p-4 border-t">
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

//           {/* No Active Subscription View */}
//           {/* {!activeSubscription && (
//             <Card elevation={2} className="mb-6">
//               <CardContent>
//                 <div className="text-center py-8">
//                   <h2 className="text-xl font-bold mb-3">
//                     No Active Subscription
//                   </h2>
//                   <p className="text-gray-500 mb-6">
//                     Choose a plan to get started with our premium features
//                   </p>
//                   <Button
//                     variant="contained"
//                     startIcon={<StarIcon />}
//                     onClick={() => setShowUpgradeDialog(true)}
//                   >
//                     View Plans
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )} */}
//         </div>

        

//         <Dialog
//           open={showUpgradeDialog}
//           onClose={() => setShowUpgradeDialog(false)}
//           maxWidth="lg"
//           fullWidth
//         >
//           <DialogTitle className="bg-[#603F26] text-white flex justify-between items-center">
//             Choose a Plan
//           </DialogTitle>
//           <DialogContent className="mt-4">
//             <p className="text-gray-600 mb-6">
//               Select the plan that best fits your needs
//             </p>
            
//             {paymentError && (
//               <Alert severity="error" className="mb-6">
//                 {paymentError}
//               </Alert>
//             )}

//             <Grid container spacing={3}>
//               {subscriptionPlans.map(renderPlanCard)}
//             </Grid>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setShowUpgradeDialog(false)}>Close</Button>
//           </DialogActions>
//         </Dialog>



//         <Dialog
//           open={showCancelDialog}
//           onClose={() => setShowCancelDialog(false)}
//         >
//           <DialogTitle className="text-red-600">
//             Cancel Subscription
//           </DialogTitle>
//           <DialogContent>
//             <DialogContentText className="mb-3">
//               Are you sure you want to cancel your subscription? This action cannot be undone.
//             </DialogContentText>
//             <Alert severity="warning" className="mt-4">
//               <AlertTitle>Warning</AlertTitle>
//               Canceling your subscription will result in losing access to all premium features at the end of your current billing period.
//             </Alert>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setShowCancelDialog(false)}>
//               Keep Subscription
//             </Button>
//             <Button
//               color="error"
//               variant="contained"
//               onClick={handleCancel}
//               // disabled={loading}
//             >
//               Confirm Cancellation
//               {/* {loading ? (
//                 <CircularProgress size={24} color="inherit" />
//               ) : (
//                 "Confirm Cancellation"
//               )} */}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </div>
//     </ThemeProvider>
//   );
// };

// export default ManageSubscriptions;







import React, { useEffect, useState } from "react";
import axios from 'axios';
import { showToast, Loader } from "../../../../tools";
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
  Typography,
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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { viewActiveSubscriptionPlan, getSubscriptionPlans, cancelSubscriptionPlan } from "../../../../store/actions/subscriptionPlans";

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

const ManageSubscriptions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const userId = user?._id;
  const { activeSubscriptionPlan, subscriptionPlans, isloading } = useSelector(state => state.subscriptionPlans);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState("monthly");
  const [paymentError, setPaymentError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [cancellingSubscription, setCancellingSubscription] = useState(false);

  useEffect(() => {
    const businessId = user?.business;
    dispatch(viewActiveSubscriptionPlan(businessId));
    dispatch(getSubscriptionPlans());
  }, [dispatch, user?.business]);

  const makePayment = (token, planName) => {
    setProcessingPayment(true);
    setSelectedPlan(planName);
    setPaymentError(null);

    const tokenId = localStorage.getItem("token");
    if (!tokenId) {
      console.error("No token found!");
      setProcessingPayment(false);
      setPaymentError("Authentication error. Please login again.");
      return;
    }

    const body = {
      token,
      planName,
      userId
    };

    axios.post("http://localhost:3000/planPayment", body, {
      headers: {
        Authorization: `Bearer ${tokenId}`,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log(response.data);
      showToast("SUCCESS", 'Plan added successfully.');
      setShowUpgradeDialog(false);
      const businessId = user?.business;
      dispatch(viewActiveSubscriptionPlan(businessId));
    })
    .catch((error) => {
      console.error("Payment failed:", error);
      setPaymentError("Payment failed. Please try again.");
      showToast("ERROR", "Payment failed. Please try again.");
    })
    .finally(() => {
      setProcessingPayment(false);
    });
  };

  const handleCancel = () => {
    setCancellingSubscription(true);
    const userId = user?._id;
    
    dispatch(cancelSubscriptionPlan(userId))
    .unwrap()
    .then(() => {
      showToast("SUCCESS", "Subscription cancelled successfully");
      setShowCancelDialog(false);
      navigate('../../subscription');
    })
    .catch(() => {
      showToast("ERROR", "Failed to cancel subscription");
    })
    .finally(() => {
      setCancellingSubscription(false);
    });
  };

  const renderPlanCard = (plan) => (
    <Grid item xs={12} md={4} key={plan.id}>
      <Card 
        variant="outlined"
        sx={{
          height: '100%',
          position: 'relative',
          border: (activeSubscriptionPlan && plan?.name === activeSubscriptionPlan?.activePlan?.name) ? 
            `2px solid ${theme.palette.primary.main}` : undefined
        }}
      >
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
          {(!activeSubscriptionPlan || plan.name !== activeSubscriptionPlan?.activePlan?.name) && (
            <StripeCheckout
              stripeKey="pk_test_51QOJ4oDZzPFomXhEJc2PFEnX4MqUEEzMkA8gwhbgA7I7GzXobg0QAwn06yuHn2Gb1ofTkwLHiGPI7N8XrxVMi0xt00zvcbJDcy"
              token={(token) => makePayment(token, plan?.name)}
              name={`Upgrade to ${plan.name}`}
              amount={plan.price * 100}
              currency="USD"
              disabled={processingPayment}
            >
              <Button
                fullWidth
                variant="contained"
                disabled={processingPayment}
                sx={{
                  '&:disabled': {
                    backgroundColor: "#603F26",
                    opacity: 0.7
                  }
                }}
              >
                {processingPayment && selectedPlan === plan.name ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Select Plan"
                )}
              </Button>
            </StripeCheckout>
          )}
          {activeSubscriptionPlan && plan.name === activeSubscriptionPlan?.activePlan?.name && (
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

  if(isloading) {
    return <Loader/>;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5">
        <div className="px-4 md:px-8 lg:px-12 mb-3">
          <Typography variant="h4" sx={{ color: "#603F26", fontWeight: "bold" }}>
            Subscription Management
          </Typography>
          <p className="text-sm text-gray-500">
            Manage your subscription, billing and plan details
          </p>
        </div>

        {activeSubscriptionPlan && (
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
                $ {activeSubscriptionPlan?.activePlan?.price}
              </h2>
              <p className="text-sm">Monthly Subscription</p>
            </Card>
          </div>
        )}

        <div className="w-full px-4 md:px-8 lg:px-12 mt-4">
          {activeSubscriptionPlan && (
            <Card elevation={2} className="mb-6">
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold">{activeSubscriptionPlan?.activePlan?.name}</h2>
                    <p className="text-sm text-gray-500">Active Plan</p>
                  </div>
                  <Chip label={"Active"} color={"success"} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 font-medium">Expiry Date</p>
                    <div className="flex items-center gap-2">
                      <ClockIcon fontSize="small" />
                      <span>{activeSubscriptionPlan?.planExpiry}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4">Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeSubscriptionPlan?.activePlan?.features.map((feature, index) => (
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
        </div>

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
              disabled={cancellingSubscription}
            >
              {cancellingSubscription ? (
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