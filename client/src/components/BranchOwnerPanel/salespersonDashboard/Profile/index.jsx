import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { getUserDetails, updateUserDetails, uploadImage, updatePassword } from "../../../../store/actions/users";
import { showToast, Loader } from "../../../../tools";

const SalespersonProfile = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { userDetails, isloading } = useSelector((state) => state.users);

 
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);


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
      setLoading(false);
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
    return (
     <Loader/>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Typography variant="h4" className="mb-8">
          Salesperson Profile Settings
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

      </div>
    </div>
  );
};

export default SalespersonProfile;