import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../tools";

import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const RiderDetails = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth);
  const { _id: userId } = userData?.user || { _id: "dummyUserId" };

  const [cities, setCities] = useState([
    "Karachi",
    "Lahore",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Peshawar",
    "Quetta",
    "Hyderabad",
    "Sialkot"
  ]);

  // For file uploads
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [bikeDocuments, setBikeDocuments] = useState(null);

  // Preview images
  const [cnicFrontPreview, setCnicFrontPreview] = useState("");
  const [cnicBackPreview, setCnicBackPreview] = useState("");
  const [bikeDocumentsPreview, setBikeDocumentsPreview] = useState("");

  // File validation errors
  const [fileErrors, setFileErrors] = useState({
    cnicFront: "",
    cnicBack: "",
    bikeDocuments: ""
  });

  const theme = createTheme({
    palette: {
      primary: {
        main: "#603F26",
      },
    },
  });

  const schema = yup.object({
    fullName: yup.string().required("Full name is required"),
    contactNumber: yup
      .string()
      .required("Contact number is required")
      .matches(/^03\d{9}$/, "Number must start with 03 and have 11 digits"),
    city: yup.string().required("City selection is required"),
    bikeNumber: yup
      .string()
      .required("Bike number is required")
      .matches(/^[A-Z]{2,3}-\d{1,4}$/, "Format: ABC-1234 or AB-1234"),
    cnicNumber: yup
      .string()
      .required("CNIC number is required")
      .matches(/^\d{5}-\d{7}-\d{1}$/, "Format: 12345-1234567-1"),
  });

  const form = useForm({
    defaultValues: {
      fullName: "",
      contactNumber: "",
      city: "",
      bikeNumber: "",
      cnicNumber: "",
    },
    resolver: yupResolver(schema),
  });

  const { register, formState, handleSubmit } = form;
  const { errors } = formState;

  const handleFileChange = (e, setFile, setPreview, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      // Clear any previous error
      setFileErrors(prev => ({...prev, [fieldName]: ""}));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateFiles = () => {
    let isValid = true;
    const newErrors = { ...fileErrors };
    
    if (!cnicFront) {
      newErrors.cnicFront = "CNIC front image is required";
      isValid = false;
    }
    
    if (!cnicBack) {
      newErrors.cnicBack = "CNIC back image is required";
      isValid = false;
    }
    
    if (!bikeDocuments) {
      newErrors.bikeDocuments = "Motorcycle documents are required";
      isValid = false;
    }
    
    setFileErrors(newErrors);
    return isValid;
  };

  const onSubmit = async (data) => {
    // Validate files
    if (!validateFiles()) {
      return;
    }
    
    // Create form data to include files
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("contactNumber", data.contactNumber);
    formData.append("city", data.city);
    formData.append("bikeNumber", data.bikeNumber);
    formData.append("cnicNumber", data.cnicNumber);
    formData.append("userId", userId);
    
    formData.append("cnicFront", cnicFront);
    formData.append("cnicBack", cnicBack);
    formData.append("bikeDocuments", bikeDocuments);

    console.log("Form data submitted:", {
      ...data,
      cnicFront: cnicFront?.name,
      cnicBack: cnicBack?.name,
      bikeDocuments: bikeDocuments?.name
    });

    // In a real implementation, this would be an API call
    try {
      // Mock API call
      setTimeout(() => {
        showToast("SUCCESS", "Rider information added successfully!");
        navigate('/riderDashboard');
      }, 1000);
    } catch (error) {
      showToast("ERROR", error.message || "Error adding rider information");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center mt-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ width: "70%" }}
          className="border-[0.2px] border-black border-opacity-50 p-8 
                     pt-3 rounded-lg my-8"
        >
          <h1 className="mb-4 font-medium text-2xl">
            Add Rider Information
          </h1>

          <ThemeProvider theme={theme}>
            <div className="mb-8">
              <TextField
                variant="outlined"
                id="fullName"
                label="Full Name *"
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                {...register("fullName")}
                required
                sx={{
                  width: "100%",
                }}
              />
            </div>

            <div className="mb-8">
              <TextField
                variant="outlined"
                id="contactNumber"
                label="Contact Number *"
                error={!!errors.contactNumber}
                helperText={errors.contactNumber?.message}
                {...register("contactNumber")}
                required
                sx={{
                  width: "100%",
                }}
              />
            </div>

            <div className="mb-8">
              <TextField
                variant="outlined"
                id="cnicNumber"
                label="CNIC Number (e.g., 12345-1234567-1) *"
                error={!!errors.cnicNumber}
                helperText={errors.cnicNumber?.message}
                {...register("cnicNumber")}
                required
                sx={{
                  width: "100%",
                }}
              />
            </div>

            <div className="mb-8 w-[100%]">
              <FormControl
                sx={{
                  width: "100%",
                }}
                error={!!errors.city}
                required
              >
                <InputLabel>City</InputLabel>
                <Select
                  name="city"
                  label="City"
                  defaultValue=""
                  {...register("city")}
                  MenuProps={{
                    disableScrollLock: true,
                  }}
                >
                  {cities.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
                {errors.city && (
                  <FormHelperText>{errors.city.message}</FormHelperText>
                )}
              </FormControl>
            </div>

            <div className="mb-8">
              <TextField
                variant="outlined"
                id="bikeNumber"
                label="Bike Number (e.g., ABC-1234) *"
                error={!!errors.bikeNumber}
                helperText={errors.bikeNumber?.message}
                {...register("bikeNumber")}
                required
                sx={{
                  width: "100%",
                }}
              />
            </div>

            <Typography variant="h6" className="mb-4 font-medium">
              Upload Documents (All Required)
            </Typography>

            <Grid container spacing={3} className="mb-6">
              {/* CNIC Front */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" className="mb-2">
                  CNIC Front *
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="cnic-front-button"
                  type="file"
                  onChange={(e) => handleFileChange(e, setCnicFront, setCnicFrontPreview, "cnicFront")}
                  required
                />
                <label htmlFor="cnic-front-button">
                  <Button
                    variant="outlined"
                    component="span"
                    sx={{
                      textTransform: "none",
                      width: "100%",
                      height: "56px",
                      borderColor: fileErrors.cnicFront ? "red" : cnicFront ? "green" : "#603F26",
                      color: fileErrors.cnicFront ? "red" : cnicFront ? "green" : "#603F26",
                    }}
                  >
                    {cnicFront ? cnicFront.name : "Upload CNIC Front *"}
                  </Button>
                </label>
                {fileErrors.cnicFront && (
                  <FormHelperText error>{fileErrors.cnicFront}</FormHelperText>
                )}
                {cnicFrontPreview && (
                  <Box mt={1} className="relative">
                    <img
                      src={cnicFrontPreview}
                      alt="CNIC Front Preview"
                      className="mt-2 w-full h-40 object-cover rounded"
                    />
                  </Box>
                )}
              </Grid>

              {/* CNIC Back */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" className="mb-2">
                  CNIC Back *
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="cnic-back-button"
                  type="file"
                  onChange={(e) => handleFileChange(e, setCnicBack, setCnicBackPreview, "cnicBack")}
                  required
                />
                <label htmlFor="cnic-back-button">
                  <Button
                    variant="outlined"
                    component="span"
                    sx={{
                      textTransform: "none",
                      width: "100%",
                      height: "56px",
                      borderColor: fileErrors.cnicBack ? "red" : cnicBack ? "green" : "#603F26",
                      color: fileErrors.cnicBack ? "red" : cnicBack ? "green" : "#603F26",
                    }}
                  >
                    {cnicBack ? cnicBack.name : "Upload CNIC Back *"}
                  </Button>
                </label>
                {fileErrors.cnicBack && (
                  <FormHelperText error>{fileErrors.cnicBack}</FormHelperText>
                )}
                {cnicBackPreview && (
                  <Box mt={1} className="relative">
                    <img
                      src={cnicBackPreview}
                      alt="CNIC Back Preview"
                      className="mt-2 w-full h-40 object-cover rounded"
                    />
                  </Box>
                )}
              </Grid>
            </Grid>

            <Grid container spacing={3} className="mb-8">
              {/* Motorcycle Documents */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" className="mb-2">
                  Motorcycle Documents *
                </Typography>
                <input
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                  id="bike-docs-button"
                  type="file"
                  onChange={(e) => handleFileChange(e, setBikeDocuments, setBikeDocumentsPreview, "bikeDocuments")}
                  required
                />
                <label htmlFor="bike-docs-button">
                  <Button
                    variant="outlined"
                    component="span"
                    sx={{
                      textTransform: "none",
                      width: "100%",
                      height: "56px",
                      borderColor: fileErrors.bikeDocuments ? "red" : bikeDocuments ? "green" : "#603F26",
                      color: fileErrors.bikeDocuments ? "red" : bikeDocuments ? "green" : "#603F26",
                    }}
                  >
                    {bikeDocuments ? bikeDocuments.name : "Upload Motorcycle Documents *"}
                  </Button>
                </label>
                {fileErrors.bikeDocuments && (
                  <FormHelperText error>{fileErrors.bikeDocuments}</FormHelperText>
                )}
                {bikeDocumentsPreview && !bikeDocumentsPreview.startsWith("data:application/pdf") && (
                  <Box mt={1} className="relative">
                    <img
                      src={bikeDocumentsPreview}
                      alt="Bike Documents Preview"
                      className="mt-2 w-full h-40 object-cover rounded"
                    />
                  </Box>
                )}
                {bikeDocumentsPreview && bikeDocumentsPreview.startsWith("data:application/pdf") && (
                  <Box mt={1} className="relative">
                    <Typography>PDF document uploaded</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>

            <div className="text-center mt-10">
              <Button
                variant="contained"
                color="primary"
                size="medium"
                type="submit"
                sx={{
                  textTransform: "none",
                  width: "150px",
                }}
              >
                Submit
              </Button>
            </div>
          </ThemeProvider>
        </form>
      </div>
    </div>
  );
};

export default RiderDetails;