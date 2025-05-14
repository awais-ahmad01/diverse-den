import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

import { getUserDetails, updateUserDetails } from "../../../../store/actions/users";
import { showToast, Loader } from "../../../../tools";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { userDetails, isLoading } = useSelector((state) => state.users);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const theme = createTheme({
    palette: {
      primary: {
        main: "#603F26",
      },
    },
  });

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    // Business Information
    name: "",
    description: "",
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
  });

  const bankList = [
    "Allied Bank Limited (ABL)",
    "Bank of America",
    "Chase",
    "Wells Fargo",
    "Citibank",
    "Capital One",
  ];

  useEffect(() => {
    const userId = currentUser._id;
    dispatch(getUserDetails(userId));
  }, [currentUser._id, dispatch]);

  useEffect(() => {
    if (userDetails) {
      setFormData({
        firstname: userDetails.basicInfo?.firstname || "",
        lastname: userDetails.basicInfo?.lastname || "",
        email: userDetails.basicInfo?.email || "",
        phone: userDetails.basicInfo?.phone || "",
        // Business Information
        name: userDetails.businessDetails?.name || "",
        description: userDetails.businessDetails?.description || "",
        bankName: userDetails.businessDetails?.bankName || "",
        accountHolderName: userDetails.businessDetails?.accountHolderName || "",
        accountNumber: userDetails.businessDetails?.accountNumber || "",
      });
      setLoading(false);
    }
  }, [userDetails]);

  const handleBusinessUpdate = async (e) => {
    e.preventDefault();
    try {
      const businessData = {
        businessDetails: {
          name: formData.name,
          description: formData.description,
          bankName: formData.bankName,
          accountHolderName: formData.accountHolderName,
          accountNumber: formData.accountNumber,
        }
      };
      
      await dispatch(updateUserDetails({
        userId: currentUser._id,
        formData: businessData
      }));

      setIsEditingBusiness(false);
      showToast("SUCCESS", "Business information updated successfully");
    } catch (error) {
     showToast("ERROR", "Failed to update business information");
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    console.log("formData", formData);

    try {
      // Using the same updateUserDetails API for image upload
      await dispatch(updateUserDetails({
        userId: currentUser._id,
        formData: formData,
        // isImageUpload: true
      }));

      showToast("SUCCESS", "Image uploaded successfully");
      // Refresh user details to show the new image
      dispatch(getUserDetails(currentUser._id));
    } catch (error) {
      showToast("ERROR", "Failed to upload image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const basicInfoData = {
        basicInfo: {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          phone: formData.phone,
        }
      };

      console.log("basicInfoData",basicInfoData);
      
      await dispatch(updateUserDetails({
        userId: currentUser._id,
        formData: basicInfoData
      }));

      setIsEditing(false);
      showToast("SUCCESS", "Profile updated successfully");
    } catch (error) {
      showToast("ERROR", "Failed to update profile");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      showToast("ERROR", "Passwords do not match");
      return;
    }

    try {
      const passwordData = {
       
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
      
      };

      console.log("passwordData",passwordData);
      
      await dispatch(updateUserDetails({
        userId: currentUser._id,
        formData: passwordData
      }));

      setShowPasswordForm(false);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      showToast("SUCCESS", "Password updated successfully");
    } catch (error) {
      showToast("ERROR", "Failed to update password");
    }
  };

  if (isLoading || loading) {
    return (
      <Loader />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert severity="error">
          {error}
          <Button
            color="inherit"
            size="small"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Typography variant="h4" className="mb-8">
          Profile Settings
        </Typography>

        <Card>
          <CardContent>
            {/* Profile Picture Section */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative">
                <Avatar
                  src={userDetails?.profileImage}
                  alt={`${userDetails?.basicInfo?.firstname} ${userDetails?.basicInfo?.lastname}`}
                  sx={{ width: 96, height: 96 }}
                />
                <input
                  accept="image/*"
                  type="file"
                  id="profile-upload"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <label htmlFor="profile-upload">
                  <ThemeProvider theme={theme}>
                    <IconButton
                      color="primary"
                      component="span"
                      className="absolute bottom-0 right-0 bg-white shadow-lg"
                      size="small"
                    >
                      <PhotoCamera />
                    </IconButton>
                  </ThemeProvider>
                </label>
              </div>
              <div>
                <Typography variant="h6">
                  {userDetails?.basicInfo?.firstname} {userDetails?.basicInfo?.lastname}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {userDetails?.basicInfo?.role}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Click the camera icon to update your profile picture
                </Typography>
              </div>
            </div>

            {/* User Information Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <ThemeProvider theme={theme}>
                <div className="flex space-x-4">
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstname}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({ ...formData, firstname: e.target.value })
                    }
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastname}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({ ...formData, lastname: e.target.value })
                    }
                    margin="normal"
                  />
                </div>

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phone}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Role"
                  value={userDetails?.basicInfo?.role}
                  disabled
                  margin="normal"
                />

                <div className="flex space-x-4 pt-4">
                  {!isEditing ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button type="submit" variant="contained" color="primary">
                        Save Changes
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            ...formData,
                            firstname: userDetails.basicInfo.firstname,
                            lastname: userDetails.basicInfo.lastname,
                            email: userDetails.basicInfo.email,
                            phone: userDetails.basicInfo.phone,
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outlined"
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                  >
                    Change Password
                  </Button>
                </div>
              </ThemeProvider>
            </form>

            {/* Password Change Form */}
            {showPasswordForm && (
              <form
                onSubmit={handlePasswordUpdate}
                className="mt-6 pt-6 border-t"
              >
                <ThemeProvider theme={theme}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Current Password"
                    value={formData.currentPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentPassword: e.target.value,
                      })
                    }
                    margin="normal"
                    required
                  />

                  <TextField
                    fullWidth
                    type="password"
                    label="New Password"
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                    margin="normal"
                    required
                  />

                  <TextField
                    fullWidth
                    type="password"
                    label="Confirm New Password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    margin="normal"
                    required
                  />

                  <div className="flex space-x-4 pt-4">
                    <Button type="submit" variant="contained" color="primary">
                      Update Password
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setFormData((prev) => ({
                          ...prev,
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        }));
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </ThemeProvider>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Business Information Card */}
        <Card className="mt-6">
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <Typography variant="h6">Business Information</Typography>
              <ThemeProvider theme={theme}>
                {!isEditingBusiness ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsEditingBusiness(true)}
                  >
                    Edit Business Info
                  </Button>
                ) : null}
              </ThemeProvider>
            </div>

            <form onSubmit={handleBusinessUpdate} className="space-y-4">
              <ThemeProvider theme={theme}>
                <TextField
                  fullWidth
                  label="Business Name"
                  value={formData.name}
                  disabled={!isEditingBusiness}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Business Description"
                  value={formData.description}
                  disabled={!isEditingBusiness}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  margin="normal"
                  multiline
                  rows={3}
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel>Select Bank</InputLabel>
                  <Select
                    value={formData.bankName}
                    label="Select Bank"
                    disabled={!isEditingBusiness}
                    onChange={(e) =>
                      setFormData({ ...formData, bankName: e.target.value })
                    }
                  >
                    {bankList.map((bank) => (
                      <MenuItem key={bank} value={bank}>
                        {bank}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Account Holder Name"
                  value={formData.accountHolderName}
                  disabled={!isEditingBusiness}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      accountHolderName: e.target.value,
                    })
                  }
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Account Number"
                  value={formData.accountNumber}
                  disabled={!isEditingBusiness}
                  onChange={(e) =>
                    setFormData({ ...formData, accountNumber: e.target.value })
                  }
                  margin="normal"
                  type="number"
                />

                {isEditingBusiness && (
                  <div className="flex space-x-4 pt-4">
                    <Button type="submit" variant="contained" color="primary">
                      Save Business Info
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsEditingBusiness(false);
                        setFormData((prev) => ({
                          ...prev,
                          name: userDetails.businessDetails?.name || "",
                          description: userDetails.businessDetails?.description || "",
                          bankName: userDetails.businessDetails?.bankName || "",
                          accountHolderName: userDetails.businessDetails?.accountHolderName || "",
                          accountNumber: userDetails.businessDetails?.accountNumber || "",
                        }));
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </ThemeProvider>
            </form>
          </CardContent>
        </Card>

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          <Alert
            onClose={() => setNotification({ ...notification, open: false })}
            severity={notification.type}
            variant="filled"
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default ProfilePage;