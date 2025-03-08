import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../tools";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  TextField,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Loader } from "../../../tools";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PeopleIcon from "@mui/icons-material/People";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getSubscriptionPlans, addSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan,
  getPlanSubscribers
 } from "../../../store/actions/subscriptionPlans";


// Mock Redux actions - to be replaced with actual implementations
// import { 
//   fetchSubscriptionPlans, 
//   updateSubscriptionPlan,
//   addSubscriptionPlan,
//   deleteSubscriptionPlan,
//   fetchSubscribersList
// } from "../../../../store/actions/subscriptions";

const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
  },
});

// Dialog for viewing subscribers
const SubscribersListDialog = ({ open, onClose, plan }) => {
 

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-[#603F26] text-white">
        Subscribers - {plan?.name}
      </DialogTitle>
      <DialogContent>
        {plan?.subscribers.length === 0 ? (
          <Typography className="text-center pt-8">No subscribers found for this plan</Typography>
        ) : (
          <TableContainer component={Paper} className="mt-4">
            <Table>
              <TableHead sx={{ backgroundColor: "#603F26" }}>
                <TableRow>
                  {/* <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell> */}
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Subscription Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plan?.subscribers.map((subscriber) => (
                  <TableRow key={subscriber?._id}>
                    {/* <TableCell>{subscriber.id}</TableCell> */}
                    <TableCell>{subscriber?.firstname} {subscriber?.lastname}</TableCell>
                    <TableCell>{subscriber?.email}</TableCell>
                    <TableCell>{new Date(subscriber?.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Dialog for adding or editing subscription plans
// Dialog for adding or editing subscription plans
const SubscriptionPlanDialog = ({ open, onClose, onSave, plan, mode }) => {
  const [formData, setFormData] = useState({
    name: "",
    features: "",
    price: "",
    branches: ""
    // duration: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (plan && mode === "edit") {
      setFormData({
        name: plan.name || "",
        features: Array.isArray(plan.features) ? plan.features.join("\n") : plan.features || "",
        price: plan.price || "",
        branches: plan.noOfBranches || "",
        // duration: plan.duration || ""
      });
    } else {
      setFormData({
        name: "",
        features: "",
        price: "",
        branches: "",
        // duration: ""
      });
    }
    setErrors({});
  }, [plan, mode, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!String(formData.name).trim()) newErrors.name = "Name is required";
    if (!String(formData.features).trim()) newErrors.features = "Features are required";
    if (!String(formData.price).trim()) newErrors.price = "Price is required";
    else if (isNaN(formData.price) || Number(formData.price) <= 0) newErrors.price = "Price must be a positive number";
    if (!String(formData.branches).trim()) newErrors.branches = "Number of branches is required";
    else if (isNaN(formData.branches) || !Number.isInteger(Number(formData.branches)) || Number(formData.branches) <= 0) 
      newErrors.branches = "Branches must be a positive integer";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Convert features from string to array for backend
      const processedData = {
        ...formData,
        features: formData.features.split("\n").filter(feature => feature.trim() !== ""),
        price: Number(formData.price),
        noOfBranches: Number(formData.branches),
        // duration: Number(formData.duration)
      };

      console.log(processedData);
      
      onSave(processedData, mode, plan?._id);

      onClose();
    }
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-[#603F26] text-white">
        {mode === "add" ? "Add New Subscription Plan" : "Edit Subscription Plan"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} className="pt-6">
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Plan Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Features (one per line)"
              name="features"
              value={formData.features}
              onChange={handleChange}
              multiline
              rows={4}
              error={!!errors.features}
              helperText={errors.features}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
              InputProps={{
                startAdornment: <span className="mr-2">Rs</span>
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Number of Branches"
              name="branches"
              type="number"
              value={formData.branches}
              onChange={handleChange}
              error={!!errors.branches}
              helperText={errors.branches}
            />
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Duration (days)"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              error={!!errors.duration}
              helperText={errors.duration}
            />
          </Grid> */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {mode === "add" ? "Add Plan" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

  
// Dialog for confirming plan deletion
const DeletePlanDialog = ({ open, onClose, onConfirm, planName }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="text-red-600">Delete Subscription Plan</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the "{planName}" subscription plan? This action cannot be undone and may affect users currently subscribed to this plan.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main component
const ManageSubscriptionPlans = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const {subscriptionPlans, planSubscribers, isloading} = useSelector((state) => state.subscriptionPlans);



  useEffect(() => {
    dispatch(getSubscriptionPlans());

    dispatch(getPlanSubscribers());

  }, [dispatch])
  
  // Mock subscription plans data
  // const mockSubscriptionPlans = [
  //   {
  //     id: "plan1",
  //     name: "Basic",
  //     features: ["Limited access to dashboard", "5 projects", "Basic support"],
  //     price: 9.99,
  //     duration: 30,
  //     subscriberCount: 145
  //   },
  //   {
  //     id: "plan2",
  //     name: "Premium",
  //     features: ["Full access to dashboard", "Unlimited projects", "Priority support", "Advanced analytics"],
  //     price: 19.99,
  //     duration: 30,
  //     subscriberCount: 87
  //   },
  //   {
  //     id: "plan3",
  //     name: "Enterprise",
  //     features: ["Custom solutions", "Dedicated support manager", "API access", "White-labeling options", "Team management"],
  //     price: 49.99,
  //     duration: 30,
  //     subscriberCount: 23
  //   }
  // ];

  // const [subscriptionPlans, setSubscriptionPlans] = useState(mockSubscriptionPlans);
  // const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [dialogMode, setDialogMode] = useState(null); // "add", "edit", "delete", "subscribers", null
  
  // useEffect(() => {
  //   // In a real implementation, this would dispatch an action to fetch subscription plans
  //   // dispatch(fetchSubscriptionPlans());
  //   setIsLoading(true);
  //   // Simulate API call
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 500);
  // }, []);

  // Handler for opening add dialog
  const handleAddPlan = () => {
    setCurrentPlan(null);
    setDialogMode("add");
  };

  // Handler for opening edit dialog
  const handleEditPlan = (plan) => {
    setCurrentPlan(plan);
    setDialogMode("edit");
  };

  // Handler for opening delete dialog
  const handleDeletePlan = (plan) => {
    setCurrentPlan(plan);
    setDialogMode("delete");
  };

  // Handler for opening subscribers dialog
  const handleViewSubscribers = (plan) => {
    setCurrentPlan(plan);
    setDialogMode("subscribers");
  };

  // Handler for saving plan (add or edit)
  const handleSavePlan = (formData, mode) => {
    try {
      if (mode === "add") {
        // In a real implementation, this would dispatch an action
        dispatch(addSubscriptionPlan(formData))
          .unwrap()
          .then(() => {
            showToast("SUCCESS", "Subscription plan added successfully!");
            dispatch(getSubscriptionPlans());
          })
          .catch(() => {
            showToast("ERROR", "Failed to add subscription plan");
          })
     
    
      } else if (mode === "edit") {
       
        dispatch(updateSubscriptionPlan({planId: currentPlan?._id, formData}))
          .unwrap()
          .then(() => {
            showToast("SUCCESS", "Subscription plan updated successfully!");
            dispatch(getSubscriptionPlans());
          })
          .catch(() => {
            showToast("ERROR", "Failed to update subscription plan");
          })
        
  
      }
    } catch (error) {
      console.error("Failed to save plan:", error);
      showToast("ERROR", "Failed to save subscription plan");
    }
  };

  // Handler for confirming plan deletion
  const handleDeleteConfirm = () => {
    try {
      // In a real implementation, this would dispatch an action
      const planId = currentPlan?._id;
      dispatch(deleteSubscriptionPlan(planId))
        .unwrap()
        .then(() => {
          showToast("SUCCESS", "Subscription plan deleted successfully!");
          dispatch(getSubscriptionPlans());
        })
        .catch(() => {
          showToast("ERROR", "Failed to delete subscription plan");
        })
      
    } catch (error) {
      console.error("Failed to delete plan:", error);
      showToast("ERROR", "Failed to delete subscription plan");
    } finally {
      setDialogMode(null);
    }
  };

  // Close any open dialog
  const handleCloseDialog = () => {
    setDialogMode(null);
  };

  if (isloading) {
    return <Loader />;
  }

  return (
    <ThemeProvider theme={theme}>
      <main className="relative bg-gray-50 flex flex-col pt-5 pb-10">
        {/* Header */}
        <header className="px-4 md:px-6 lg:px-12 mb-6">
          <h1 className="text-3xl font-bold text-[#603F26]">
            Manage Subscriptions
          </h1>
        </header>

        {/* Stats and Add Button */}
        <section className="px-4 md:px-6 lg:px-12 flex justify-between items-center mb-6">
          <div>
            <div className="bg-[#603F26] text-white px-6 py-4 rounded-lg">
              <h2 className="text-3xl font-bold">
                {String(subscriptionPlans?.length).padStart(2, "0")}
              </h2>
              <p className="text-sm">Active Plans</p>
            </div>
          </div>

          <div>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddPlan}
            >
              Add New Plan
            </Button>
          </div>
        </section>

        {/* Subscription Plans */}
        <section className="w-full px-4 md:px-8 lg:px-12 mt-4 flex-grow">
          {!subscriptionPlans || subscriptionPlans?.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">No Subscription Plans Found</h2>
              <p className="text-gray-600 mb-8">Start by adding your first subscription plan.</p>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={handleAddPlan}
              >
                Add New Plan
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <Card key={plan.id} className="shadow-md">
                    <CardContent>
                      <div className="flex justify-between items-start mb-4">
                        <Typography variant="h5" component="h2" className="font-bold">
                          {plan?.name}
                        </Typography>
                        <Chip 
                          label={`Rs ${plan?.price?.toFixed(2)}`} 
                          color="primary" 
                          className="font-bold"
                        />
                      </div>
                      
                      <Typography color="textSecondary" className="mb-4">
                        Duration: 30 days
                      </Typography>
                      
                      <Divider className="mb-4" />
                      
                      <Typography variant="h6" component="h3" className="font-bold mb-2">
                        Features:
                      </Typography>
                      <ul className="list-disc pl-5 mb-4">
                        {plan?.features?.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                      
                      <div className="flex items-center mt-4">
                        <PeopleIcon color="primary" />
                        <Typography variant="body2" className="pl-1">
                          {plan?.subscriberCount} Subscribers
                        </Typography>
                      </div>
                    </CardContent>
                    <CardActions className="bg-gray-100 justify-between">
                      <div>
                        <Tooltip title="View Subscribers">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleViewSubscribers(plan)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Plan">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleEditPlan(plan)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                      <Tooltip title="Delete Plan">
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeletePlan(plan)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                ))}
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {subscriptionPlans.map((plan) => (
                  <article
                    key={plan?._id}
                    className="bg-white p-4 rounded-lg shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg">
                          {plan?.name}
                        </h3>
                        <p className="text-gray-600">Rs {plan?.price?.toFixed(2)} - 30 days</p>
                      </div>
                      <div className="text-sm flex items-center">
                        <PeopleIcon fontSize="small" className="mr-1" />
                        {plan?.subscriberCount}
                      </div>
                    </div>

                    <Divider className="my-3" />
                    
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <ul className="list-disc pl-5 mb-4 text-sm">
                      {plan?.features?.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>

                    <div className="mt-4 flex gap-2">
                      <button
                        className="bg-[#603F26] text-white py-2 px-4 rounded-md flex-1 hover:bg-[#4a3019] transition-colors flex items-center justify-center"
                        onClick={() => handleViewSubscribers(plan)}
                      >
                        <VisibilityIcon fontSize="small" className="mr-1" /> Subscribers
                      </button>
                      <button
                        className="bg-[#603F26] text-white py-2 px-4 rounded-md flex-1 hover:bg-[#4a3019] transition-colors flex items-center justify-center"
                        onClick={() => handleEditPlan(plan)}
                      >
                        <EditIcon fontSize="small" className="mr-1" /> Edit
                      </button>
                      <button
                        className="bg-red-600 text-white py-2 px-4 rounded-md flex-1 hover:bg-red-700 transition-colors flex items-center justify-center"
                        onClick={() => handleDeletePlan(plan)}
                      >
                        <DeleteIcon fontSize="small" className="mr-1" /> Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Dialogs */}
        <SubscriptionPlanDialog
          open={dialogMode === "add" || dialogMode === "edit"}
          onClose={handleCloseDialog}
          onSave={handleSavePlan}
          plan={currentPlan}
          mode={dialogMode}
        />

        <DeletePlanDialog
          open={dialogMode === "delete"}
          onClose={handleCloseDialog}
          onConfirm={handleDeleteConfirm}
          planName={currentPlan?.name}
        />

        <SubscribersListDialog
          open={dialogMode === "subscribers"}
          onClose={handleCloseDialog}
          // planId={currentPlan?.id}
          plan={currentPlan}
        />
      </main>
    </ThemeProvider>
  );
};

export default ManageSubscriptionPlans;