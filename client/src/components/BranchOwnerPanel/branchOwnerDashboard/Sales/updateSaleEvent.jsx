import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {
  TextField,
  Select,
  MenuItem,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Checkbox,
  ThemeProvider,
  createTheme,
  Button,
  IconButton,
  FormHelperText,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Loader, showToast } from "../../../../tools";
import {
  getSalesProducts,
  getSaleEventById,
  updateSaleEvent,
} from "../../../../store/actions/saleEvents";

// Define the theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
  },
});

const UpdateSaleEvent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // Get the sale event ID from URL params
  const { user } = useSelector((state) => state.auth);
  const { salesProducts, isloading, saleEventById } = useSelector(
    (state) => state.saleEvents
  );

  // Form state
  const [saleEvent, setSaleEvent] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    discountType: "percentage",
    discountValue: "",
    products: [],
    image: null,
    imagePreview: null,
    currentImage: null,
  });

  // Form error state
  const [formErrors, setFormErrors] = useState({
    name: false,
    description: false,
    startDate: false,
    endDate: false,
    discountValue: false,
    products: false,
  });

  const [showFilters, setShowFilters] = useState(true);
  const [formTouched, setFormTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch available products and the current sale event when component mounts
  useEffect(() => {
    const business = user?.business;
    dispatch(getSalesProducts(business));

    // Fetch the sale event data by ID
    if (id) {
      dispatch(getSaleEventById(id));
    }
  }, [dispatch, user, id]);

  // Helper function to properly format dates
  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Handle different date formats that might come from the API
    let date;
    try {
      if (typeof dateString === "string" && dateString.includes("-")) {
        // If date is already in YYYY-MM-DD format, return it
        const parts = dateString.split("-");
        if (parts.length === 3 && parts[0].length === 4) {
          return dateString.split("T")[0];
        }
      }

      // Try to parse as date
      date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If dateString is in format like "3/9/2025 - 3/14/2025", extract first date
        if (dateString.includes(" - ")) {
          const firstPart = dateString.split(" - ")[0];
          date = new Date(firstPart);
        }
      }

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateString);
        return "";
      }

      // Format to YYYY-MM-DD for HTML date input
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (e) {
      console.error("Error parsing date:", e, dateString);
      return "";
    }
  };

  // Populate the form with existing sale event data when it's loaded
  // In the useEffect that populates the form with existing sale event data
  // In the useEffect that populates the form with existing sale event data
  // Populate the form with existing sale event data when it's loaded
  useEffect(() => {
    if (saleEventById && !isloading) {
      console.log("Sale event loaded:", saleEventById);

      // Parse dates if they're in a format like "3/9/2025 - 3/14/2025"
      let startDate = "";
      let endDate = "";

      if (saleEventById.duration && saleEventById.duration.includes(" - ")) {
        const [start, end] = saleEventById.duration.split(" - ");
        startDate = formatDate(start.trim());
        endDate = formatDate(end.trim());
      } else {
        startDate = formatDate(saleEventById.startDate);
        endDate = formatDate(saleEventById.endDate);
      }

      // Process products and their prices
      const processedProducts = Array.isArray(saleEventById?.products)
        ? saleEventById.products.map((product) => {
            // Remove currency symbols ($) before parsing prices
            const originalPriceStr = String(
              product.originalPrice || product.price || 0
            ).replace(/[^\d.-]/g, "");
            const discountedPriceStr = String(
              product.discountedPrice || 0
            ).replace(/[^\d.-]/g, "");

            // Parse the cleaned strings to numbers
            const originalPrice = parseFloat(originalPriceStr) || 0;
            const discountedPrice = parseFloat(discountedPriceStr) || 0;

            return {
              ...product,
              _id: product._id || product.productId,
              productId: product.productId || product._id,
              originalPrice: originalPrice,
              price: originalPrice,
              discountedPrice: discountedPrice,
              title: product.title || product.name,
              category: product.category,
            };
          })
        : [];

      setSaleEvent({
        name: saleEventById?.name || "",
        description: saleEventById?.description || "",
        startDate: startDate,
        endDate: endDate,
        discountType: saleEventById?.discountType || "percentage",
        discountValue: saleEventById?.discountValue || "",
        products: processedProducts,
        image: null,
        imagePreview: null,
        currentImage: saleEventById?.imagePath || null,
      });

      console.log("Form populated with dates:", startDate, endDate);
    }
  }, [saleEventById, isloading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSaleEvent((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Mark form as touched
    setFormTouched(true);

    // Clear error for this field
    setFormErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        showToast("ERROR", "Image size should be less than 5MB");
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        showToast(
          "ERROR",
          "Only JPEG, PNG, GIF, and WEBP formats are supported"
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setSaleEvent((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
          currentImage: null, // Clear current image when new one is uploaded
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSaleEvent((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
    }));
  };

  const isProductSelected = (product) => {
    return saleEvent.products.some(
      (p) =>
        p._id === product._id ||
        p.productId === product._id ||
        p._id === product.productId ||
        p.productId === product.productId
    );
  };

  const handleProductToggle = (product) => {
    setSaleEvent((prev) => {
      // Check if the product is already selected by ID
      const isSelected = isProductSelected(product);

      if (isSelected) {
        // Remove the product, but make sure we still have some products left
        const updatedProducts = prev.products.filter(
          (p) =>
            p._id !== product._id &&
            p.productId !== product._id &&
            p._id !== product.productId &&
            p.productId !== product.productId
        );

        // Clear product error if we still have products after removing this one
        if (updatedProducts.length > 0) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            products: false,
          }));
        } else {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            products: true,
          }));
        }

        return {
          ...prev,
          products: updatedProducts,
        };
      } else {
        // Clear products error as soon as at least one product is selected
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          products: false,
        }));

        // Calculate the discounted price
        const originalPrice = parseFloat(product.price);
        const discountValue = parseFloat(prev.discountValue) || 0;

        const calculatedPrice =
          prev.discountType === "percentage"
            ? originalPrice * (1 - discountValue / 100)
            : originalPrice - discountValue;

        const productWithDiscount = {
          ...product,
          _id: product._id,
          productId: product.productId || product._id,
          originalPrice: originalPrice,
          price: originalPrice,
          discountedPrice: Math.max(0, calculatedPrice),
        };

        return {
          ...prev,
          products: [...prev.products, productWithDiscount],
        };
      }
    });

    // Mark form as touched
    setFormTouched(true);
  };

  // Update product prices when discount changes
  useEffect(() => {
    if (
      saleEvent.products.length > 0 &&
      (saleEvent.discountType || saleEvent.discountValue)
    ) {
      setSaleEvent((prev) => ({
        ...prev,
        products: prev.products.map((product) => {
          const originalPrice = parseFloat(
            product.originalPrice || product.price
          );
          const discountValue = parseFloat(prev.discountValue) || 0;

          const calculatedPrice =
            prev.discountType === "percentage"
              ? originalPrice * (1 - discountValue / 100)
              : originalPrice - discountValue;

          return {
            ...product,
            originalPrice: originalPrice,
            price: originalPrice,
            discountedPrice: Math.max(0, calculatedPrice),
          };
        }),
      }));
    }
  }, [saleEvent.discountType, saleEvent.discountValue]);

  const validateForm = () => {
    const errors = {
      name: !saleEvent.name.trim(),
      description: !saleEvent.description.trim(),
      startDate: !saleEvent.startDate,
      endDate: !saleEvent.endDate,
      discountValue:
        !saleEvent.discountValue ||
        isNaN(Number(saleEvent.discountValue)) ||
        Number(saleEvent.discountValue) <= 0,
      products: saleEvent.products.length === 0,
    };

    setFormErrors(errors);

    // Check if dates are valid and end date is after start date
    if (!errors.startDate && !errors.endDate) {
      const start = new Date(saleEvent.startDate);
      const end = new Date(saleEvent.endDate);

      if (end <= start) {
        showToast("ERROR", "End date must be after start date");
        setFormErrors((prev) => ({ ...prev, endDate: true }));
        return false;
      }
    }

    // Check if the form has any errors
    return !Object.values(errors).some((error) => error);
  };

  const handleUpdate = () => {
    if (!validateForm()) {
      showToast("ERROR", "Please fill all the fields correctly");
      return;
    }

    setLoading(true);
    const business = user?.business;
    const formData = new FormData();
    formData.append("name", saleEvent.name);
    formData.append("description", saleEvent.description);
    formData.append("startDate", saleEvent.startDate);
    formData.append("endDate", saleEvent.endDate);
    formData.append("discountType", saleEvent.discountType);
    formData.append("discountValue", saleEvent.discountValue);
    formData.append("businessId", business);

    // Only append image if a new one was selected
    if (saleEvent.image) {
      formData.append("image", saleEvent.image);
    }

    // Prepare products data
    const productsToSend = saleEvent.products.map((product) => ({
      _id: product._id,
      productId: product.productId || product._id,
      originalPrice: parseFloat(product.originalPrice || product.price),
      discountedPrice: parseFloat(product.discountedPrice),
      title: product.title || product.name,
      price: parseFloat(product.originalPrice || product.price),
      category: product.category,
    }));

    console.log("Products to send:", productsToSend);

    // Make sure we're sending a non-empty array
    if (productsToSend.length === 0) {
      showToast("ERROR", "At least one product must be selected");
      setLoading(false);
      return;
    }

    formData.append("products", JSON.stringify(productsToSend));

    dispatch(updateSaleEvent({ eventId: id, formData }))
      .unwrap()
      .then(() => {
        showToast("SUCCESS", "Sale event updated successfully");
        navigate("../saleEventsList");
      })
      .catch((error) => {
        showToast(
          "ERROR",
          error.response?.data?.message || "Failed to update sale event"
        );
        console.error("Failed to update sale event:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Check if the form is valid
  const isFormValid = () => {
    return (
      saleEvent.name &&
      saleEvent.description &&
      saleEvent.startDate &&
      saleEvent.endDate &&
      saleEvent.discountValue &&
      saleEvent.products.length > 0
    );
  };

  if (isloading || loading) {
    return <Loader />;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5">
        {/* Header */}
        <div className="px-4 md:px-8 lg:px-12 mb-6">
          <h1 className="text-[#603F26] text-2xl md:text-3xl font-bold">
            Update Sale Event
          </h1>
        </div>

        {/* Stats and Filter Toggle */}
        <div className="px-4 md:px-8 lg:px-12 flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="w-full sm:w-auto bg-[#603F26] text-white p-4 rounded-lg">
            <h2 className="text-3xl font-bold">
              {String(saleEvent.products.length).padStart(2, "0")}
            </h2>
            <p className="text-sm">Selected Products</p>
            {formTouched && formErrors.products && (
              <p className="text-sm text-yellow-300 mt-1">
                At least one product must be selected
              </p>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full sm:w-auto px-4 py-2 border-2 border-[#603F26] text-[#603F26] rounded-lg flex items-center justify-center gap-2 hover:bg-[#603F26] hover:text-white transition-colors"
          >
            <FilterListIcon />
            {showFilters ? "Hide Details" : "Show Details"}
          </button>
        </div>

        {/* Event Details Form */}
        {showFilters && (
          <div className="px-4 md:px-8 lg:px-12 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Event Name"
                  name="name"
                  value={saleEvent.name}
                  onChange={handleInputChange}
                  fullWidth
                  color="primary"
                  required
                  error={formTouched && formErrors.name}
                  helperText={
                    formTouched && formErrors.name
                      ? "Event name is required"
                      : ""
                  }
                />
                <TextField
                  label="Description"
                  name="description"
                  value={saleEvent.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  fullWidth
                  color="primary"
                  required
                  error={formTouched && formErrors.description}
                  helperText={
                    formTouched && formErrors.description
                      ? "Description is required"
                      : ""
                  }
                />
                <TextField
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={saleEvent.startDate}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  color="primary"
                  required
                  error={formTouched && formErrors.startDate}
                  helperText={
                    formTouched && formErrors.startDate
                      ? "Start date is required"
                      : ""
                  }
                />
                <TextField
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={saleEvent.endDate}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  color="primary"
                  required
                  error={formTouched && formErrors.endDate}
                  helperText={
                    formTouched && formErrors.endDate
                      ? "End date is required"
                      : ""
                  }
                />
                <FormControl
                  fullWidth
                  error={formTouched && formErrors.discountType}
                >
                  <InputLabel id="discount-type-label">
                    Discount Type
                  </InputLabel>
                  <Select
                    labelId="discount-type-label"
                    label="Discount Type"
                    name="discountType"
                    value={saleEvent.discountType}
                    onChange={handleInputChange}
                    fullWidth
                    color="primary"
                  >
                    <MenuItem value="percentage">Percentage Off</MenuItem>
                    <MenuItem value="fixed">Fixed Amount Off</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label={
                    saleEvent.discountType === "percentage"
                      ? "Percentage Off"
                      : "Amount Off"
                  }
                  type="number"
                  name="discountValue"
                  value={saleEvent.discountValue}
                  onChange={handleInputChange}
                  fullWidth
                  color="primary"
                  required
                  error={formTouched && formErrors.discountValue}
                  helperText={
                    formTouched && formErrors.discountValue
                      ? "Valid discount value is required"
                      : ""
                  }
                  InputProps={{ inputProps: { min: 0 } }}
                />

                {/* Image Upload Section */}
                <div className="md:col-span-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-[#603F26] mb-2">
                      Sale Event Image
                    </h3>

                    {/* Image Preview */}
                    {saleEvent.imagePreview ? (
                      <div className="relative mb-4 mx-auto max-w-xs">
                        <img
                          src={saleEvent.imagePreview}
                          alt="Event preview"
                          className="rounded-lg max-h-48 mx-auto object-contain"
                        />
                        <button
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          title="Remove image"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : saleEvent.currentImage ? (
                      <div className="relative mb-4 mx-auto max-w-xs">
                        <img
                          src={saleEvent.currentImage}
                          alt="Current event image"
                          className="rounded-lg max-h-48 mx-auto object-contain"
                        />
                        <button
                          onClick={() =>
                            setSaleEvent((prev) => ({
                              ...prev,
                              currentImage: null,
                            }))
                          }
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          title="Remove image"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <AddPhotoAlternateIcon
                          style={{ fontSize: 48, color: "#603F26" }}
                        />
                        <p className="text-sm text-gray-500">
                          Upload an image for your sale event (Max: 5MB, Format:
                          JPEG, PNG, GIF, WEBP)
                        </p>
                        <Button
                          variant="contained"
                          component="label"
                          color="primary"
                          startIcon={<AddPhotoAlternateIcon />}
                        >
                          Upload Image
                          <input
                            type="file"
                            accept="image/jpeg, image/png, image/gif, image/webp"
                            hidden
                            onChange={handleImageUpload}
                          />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Error Message */}
        {formTouched && formErrors.products && (
          <div className="px-4 md:px-8 lg:px-12 mb-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              Please select at least one product for the sale event.
            </div>
          </div>
        )}

        {/* Products Table - Desktop View */}
        <div className="px-4 md:px-8 lg:px-12 hidden xl:block">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="products table">
                <TableHead sx={{ backgroundColor: "#603F26" }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Product Name
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      Category
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                      align="right"
                    >
                      Price
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                      align="right"
                    >
                      Discounted Price
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                      align="center"
                    >
                      Include in Sale
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesProducts &&
                    salesProducts.map((product) => {
                      const isSelected = isProductSelected(product);
                      const selectedProduct = saleEvent.products.find(
                        (p) =>
                          p._id === product._id ||
                          p.productId === product._id ||
                          p._id === product.productId ||
                          p.productId === product.productId
                      );

                      return (
                        <TableRow
                          key={product?._id}
                          className={`hover:bg-gray-50 cursor-pointer ${
                            isSelected ? "bg-[#603F26]/10" : ""
                          }`}
                          onClick={() => handleProductToggle(product)}
                        >
                          <TableCell>{product?.title}</TableCell>
                          <TableCell>{product?.category}</TableCell>
                          <TableCell align="right">
                            Rs {parseFloat(product?.price).toFixed(2)}
                          </TableCell>

                          <TableCell align="right">
                            {isSelected
                              ? `$${
                                  Number.isFinite(
                                    parseFloat(selectedProduct.discountedPrice)
                                  )
                                    ? parseFloat(
                                        selectedProduct.discountedPrice
                                      ).toFixed(2)
                                    : "0.00"
                                }`
                              : "-"}
                          </TableCell>
                          <TableCell align="center">
                            <Checkbox
                              checked={isSelected}
                              onChange={() => {}}
                              color="primary"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>

        {/* Products Cards - Mobile View */}
        <div className="px-4 md:px-8 lg:px-12 xl:hidden space-y-4">
          {salesProducts &&
            salesProducts.map((product) => {
              const isSelected = isProductSelected(product);
              const selectedProduct = saleEvent.products.find(
                (p) =>
                  p._id === product._id ||
                  p.productId === product._id ||
                  p._id === product.productId ||
                  p.productId === product.productId
              );

              return (
                <div
                  key={product?._id}
                  className={`bg-white p-4 rounded-lg shadow cursor-pointer ${
                    isSelected ? "bg-[#603F26]/10" : ""
                  }`}
                  onClick={() => handleProductToggle(product)}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{product?.title}</h3>
                        <span className="inline-block px-2 py-1 bg-gray-100 text-sm rounded mt-1">
                          {product?.category}
                        </span>
                      </div>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => {}}
                        color="primary"
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span>
                        Original Price: Rs
                        {parseFloat(product?.price).toFixed(2)}
                      </span>
                      <span>
                        Discounted:{" "}
                        {isSelected
                          ? `$${
                              Number.isFinite(
                                parseFloat(selectedProduct.discountedPrice)
                              )
                                ? parseFloat(
                                    selectedProduct.discountedPrice
                                  ).toFixed(2)
                                : "0.00"
                            }`
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Action Buttons */}
        <div className="px-4 md:px-8 lg:px-12 mt-6 mb-8 flex flex-col sm:flex-row gap-4 justify-end">
          <Link to="../saleEventsList">
            <button className="w-full sm:w-auto px-6 py-2 border-2 border-[#603F26] text-[#603F26] rounded-lg flex items-center justify-center gap-2 hover:bg-[#603F26] hover:text-white transition-colors">
              Cancel
            </button>
          </Link>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`w-full sm:w-auto px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              isFormValid() && !loading
                ? "bg-[#603F26] text-white hover:bg-[#4a3019]"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            <SaveIcon />
            {loading ? "Updating..." : "Update Event"}
          </button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default UpdateSaleEvent;
