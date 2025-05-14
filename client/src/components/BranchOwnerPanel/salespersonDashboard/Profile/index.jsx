import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  Avatar,
  createTheme,
  ThemeProvider,
  Box,
  Paper,
  Chip,
  Grid,
  Modal
} from "@mui/material";
import { PhotoCamera, Close } from "@mui/icons-material";
import { getUserDetails, updateUserDetails, uploadImage, updatePassword } from "../../../../store/actions/users";
import { showToast, Loader } from "../../../../tools";

const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
  },
});

const SalespersonProfile = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { userDetails, isloading } = useSelector((state) => state.users);

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
      });
    }
  }, [userDetails]);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await dispatch(uploadImage({
        userId: currentUser._id,
        formData: formData,
      }));

      showToast("SUCCESS", "Profile picture updated successfully");
      dispatch(getUserDetails(currentUser._id));
    } catch (error) {
      showToast("ERROR", "Failed to upload image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const basicInfoData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.phone,
      };
      
      await dispatch(updateUserDetails({
        userId: currentUser._id,
        formData: basicInfoData
      }));

      setIsEditing(false);
      showToast("SUCCESS", "Profile updated successfully");
      dispatch(getUserDetails(currentUser._id));
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
      
      await dispatch(updatePassword({
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

  if (isloading) {
    return <Loader />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", py: 4 }}>
        {/* Image Zoom Modal */}
        <Modal
          open={openImageModal}
          onClose={() => setOpenImageModal(false)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              position: "relative",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 2,
              maxWidth: "90%",
              maxHeight: "90%",
            }}
          >
            <IconButton
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "text.primary",
              }}
              onClick={() => setOpenImageModal(false)}
            >
              <Close />
            </IconButton>
            <img
              src={userDetails?.basicInfo?.profilePicture}
              alt="Profile Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "calc(100vh - 100px)",
                display: "block",
              }}
            />
          </Box>
        </Modal>

        {/* Header */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
          <Typography variant="h4" sx={{ color: "#603F26", fontWeight: "bold" }}>
            Salesperson Profile Settings
          </Typography>
        </Box>

        <Box sx={{ px: { xs: 2, md: 4, lg: 6 } }}>
          {/* Profile Card */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            {/* Profile Picture Section */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Box sx={{ position: "relative", mr: 3 }}>
                <Avatar
                  src={userDetails?.basicInfo?.profilePicture}
                  alt={`${userDetails?.basicInfo?.firstname} ${userDetails?.basicInfo?.lastname}`}
                  sx={{ 
                    width: 96, 
                    height: 96,
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.8,
                    }
                  }}
                  onClick={() => setOpenImageModal(true)}
                />
                <input
                  accept="image/*"
                  type="file"
                  id="profile-upload"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                <label htmlFor="profile-upload">
                  <IconButton
                    color="primary"
                    component="span"
                    sx={{ 
                      position: "absolute", 
                      bottom: 0, 
                      right: 0, 
                      bgcolor: "background.paper", 
                      boxShadow: 1 
                    }}
                    size="small"
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {userDetails?.basicInfo?.firstname} {userDetails?.basicInfo?.lastname}
                </Typography>
                <Chip 
                  label={userDetails?.basicInfo?.role} 
                  color="primary" 
                  size="small" 
                  sx={{ color: "white", mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Click the camera icon to update your profile picture
                </Typography>
              </Box>
            </Box>

            {/* User Information Form */}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
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
                </Grid>
                <Grid item xs={12} sm={6}>
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
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Role"
                    value={userDetails?.basicInfo?.role}
                    disabled
                    margin="normal"
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
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
                      color="primary"
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
                  variant={showPasswordForm ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                >
                  Change Password
                </Button>
              </Box>
            </form>

            {/* Password Change Form */}
            {showPasswordForm && (
              <Box component="form" onSubmit={handlePasswordUpdate} sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
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
                  </Grid>
                  <Grid item xs={12}>
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
                  </Grid>
                  <Grid item xs={12}>
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
                  </Grid>
                </Grid>

                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                  <Button type="submit" variant="contained" color="primary">
                    Update Password
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
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
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SalespersonProfile;