import React, { useState, useEffect } from "react";
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
  Divider,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

const ProfilePage = () => {
  // Previous states remain...
  const [user, setUser] = useState(null);
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

  // Extended formData with business information
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    // Business Information
    businessName: "",
    businessDescription: "",
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
  });

  // Sample bank list - replace with your actual bank list
  const bankList = [
    "Bank of America",
    "Chase",
    "Wells Fargo",
    "Citibank",
    "Capital One",
  ];

  // Fetch user data including business information
  useEffect(() => {
    console.log("Fetching profile data...");

    const fetchData = async () => {
      await axios
        .get("/api/user/profile")
        .then((response) => {
          if (response.status === 200) {
            // Ensure the request was successful
            console.log("Profile data fetched successfully");
            setUser(response.data);
            setFormData({
              name: response.data.name,
              email: response.data.email,
              phone: response.data.phone || "",
              businessName: response.data.businessName || "",
              businessDescription: response.data.businessDescription || "",
              bankName: response.data.bankName || "",
              accountHolderName: response.data.accountHolderName || "",
              accountNumber: response.data.accountNumber || "",
            });
          } else {
            console.log("Unexpected response status:", response.status);
            setError("Failed to fetch profile data.");
          }
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
          setError("Error fetching profile. Please try again.");
          setNotification({
            open: true,
            message: "Failed to load profile data",
            type: "error",
          });
        })
        .finally(() => {
          setLoading(false);
          console.log("API call finished");
        });
    };

    fetchData();
  }, []);

  // Handle business information update
  const handleBusinessUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("/api/user/business", {
        businessName: formData.businessName,
        businessDescription: formData.businessDescription,
        bankName: formData.bankName,
        accountHolderName: formData.accountHolderName,
        accountNumber: formData.accountNumber,
      });

      setUser((prev) => ({ ...prev, ...response.data }));
      setIsEditingBusiness(false);
      setNotification({
        open: true,
        message: "Business information updated successfully",
        type: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to update business information",
        type: "error",
      });
    }
  };
  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("/api/user/profile/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser((prev) => ({ ...prev, profileImage: response.data.imageUrl }));
      setNotification({
        open: true,
        message: "Profile picture updated successfully",
        type: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to upload image",
        type: "error",
      });
    }
  };

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("/api/user/profile", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
      setUser(response.data);
      setIsEditing(false);
      setNotification({
        open: true,
        message: "Profile updated successfully",
        type: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to update profile",
        type: "error",
      });
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setNotification({
        open: true,
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    try {
      await axios.put("/api/user/password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setShowPasswordForm(false);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setNotification({
        open: true,
        message: "Password updated successfully",
        type: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: "Failed to update password",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
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
                  src={user?.profileImage}
                  alt={user?.name}
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
                <Typography variant="h6">{user?.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Click the camera icon to update your profile picture
                </Typography>
              </div>
            </div>

            {/* User Information Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <ThemeProvider theme={theme}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  margin="normal"
                />

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
                  value={user?.role}
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
                            name: user.name,
                            email: user.email,
                            phone: user.phone || "",
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
                  value={formData.businessName}
                  disabled={!isEditingBusiness}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Business Description"
                  value={formData.businessDescription}
                  disabled={!isEditingBusiness}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      businessDescription: e.target.value,
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
                          businessName: user.businessName || "",
                          businessDescription: user.businessDescription || "",
                          bankName: user.bankName || "",
                          accountHolderName: user.accountHolderName || "",
                          accountNumber: user.accountNumber || "",
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

        {/* Notifications */}
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
