import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  getBusinessProductReviews,
  deleteAllSpecificProductReview,
  deleteSpecificCustomerReview,
} from "../../../../store/actions/businesses";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Paper,
  IconButton,
  Tooltip,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Divider,
  Chip,
  Select,
  MenuItem,
  Typography,
  Box,
  TextField,
  Grid
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Loader } from "../../../../tools";
import { showToast } from "../../../../tools";
import { format } from "date-fns";

const theme = createTheme({
  palette: {
    primary: {
      main: "#603F26",
    },
  },
});

const ReviewDetailsDialog = ({
  open,
  onClose,
  productData,
  onDeleteReview,
  deleteReviewId,
  setDeleteReviewId,
}) => {
  if (!productData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-[#603F26] text-white flex justify-between items-center">
        <div>Product Reviews - {productData.productName}</div>
        <div className="flex items-center gap-2">
          <Rating
            value={productData.averageRating}
            readOnly
            precision={0.5}
            size="small"
          />
          <span>({productData.averageRating})</span>
        </div>
      </DialogTitle>
      <DialogContent className="mt-4">
        <div className="space-y-6">
          {/* Product Information */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={productData.images[0] || "/api/placeholder/120/120"}
              alt={productData.productName}
              className="w-24 h-24 object-cover rounded"
            />

            <div>
              <h3 className="text-lg font-bold">{productData.productName}</h3>
              <p className="text-gray-500 text-sm">
                Total Reviews: {productData.reviewCount}
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-base font-bold mb-3">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = productData.reviews.filter(
                  (review) => Math.floor(review.rating) === rating
                ).length;
                const percentage =
                  (count / productData.reviews.length) * 100 || 0;
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <div className="w-12">{rating} Stars</div>
                    <div className="flex-grow bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-[#603F26] h-2.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-right">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-4">
            <h3 className="text-base font-bold">Customer Reviews</h3>
            {productData.reviews.map((review, index) => (
              <Paper key={index} className="p-4 space-y-3">
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>{review.customerName[0]}</Avatar>
                    <div>
                      <p className="font-semibold">{review.customerName}</p>
                      <p className="text-xs text-gray-500">
                        {review?.reviewDate}
                      </p>
                    </div>
                  </div>
                  <IconButton
                    color="error"
                    onClick={() => setDeleteReviewId(review?._id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>

                <div>
                  <Rating value={review.rating} readOnly size="small" />
                  <p className="mt-2">{review.comment}</p>
                </div>
              </Paper>
            ))}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  itemId,
  itemType,
}) => {
  const isProduct = itemType === "product";

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="text-red-600">
        Delete {isProduct ? "Product" : "Review"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this{" "}
          {isProduct ? "product and all its reviews" : "review"}? This action
          cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => onConfirm(itemId)}
          color="error"
          variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ProductReviews = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { businessProductReviews, reviewsMeta, isloading } = useSelector(
    (state) => state.businesses
  );

  const [deleteReviewId, setDeleteReviewId] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const totalProducts = reviewsMeta?.totalReviews || 0;

  useEffect(() => {
    const businessId = user?.business;
    dispatch(getBusinessProductReviews({ businessId }));
  }, [dispatch, user]);

  useEffect(() => {
    if (businessProductReviews) {
      setFilteredProducts(businessProductReviews);
    }
  }, [businessProductReviews]);

  const applyFilters = () => {
    if (!businessProductReviews) return;

    let filtered = [...businessProductReviews];

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleDeleteReview = (productId, reviewId) => {
    dispatch(
      deleteSpecificCustomerReview({
        reviewId,
      })
    )
      .unwrap()
      .then(() => {
        showToast("SUCCESS", "Review deleted successfully!");
        setDeleteReviewId(null);
        setSelectedProduct(null);
        const businessId = user?.business;
        dispatch(getBusinessProductReviews({ businessId }));
      })
      .catch((error) => {
        showToast("ERROR", "Failed to delete review");
      });
  };

  const handleDeleteProduct = (productId) => {
    const body = { productId, businessId: user?.business };
    dispatch(deleteAllSpecificProductReview(body))
      .unwrap()
      .then(() => {
        showToast("SUCCESS", "Product reviews deleted successfully!");
        setDeleteProductId(null);
        const businessId = user?.business;
        dispatch(getBusinessProductReviews({ businessId }));
      })
      .catch((error) => {
        showToast("ERROR", "Failed to delete product reviews");
      });
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  if (isloading) {
    return <Loader />;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5">
        {/* Header */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
          <Typography
            variant="h4"
            sx={{ color: "#603F26", fontWeight: "bold" }}
          >
            Product Reviews
          </Typography>
        </Box>

        {/* Stats and Filters */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  bgcolor: "#603F26",
                  color: "white",
                  px: 3,
                  py: 2,
                  borderRadius: 2,
                  width: 'fit-content'
                }}
              >
                <Typography variant="h4" component="div">
                  {String(totalProducts || 0).padStart(2, "0")}
                </Typography>
                <Typography variant="body2">Total Product Reviews</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<FilterListIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Filters */}
        {showFilters && (
          <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Search by Product Name"
                    placeholder="Enter product name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <SearchIcon sx={{ color: "gray", mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={applyFilters}
                    >
                      Apply Filters
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        setSearchQuery("");
                        setFilteredProducts(businessProductReviews);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}

        <div className="w-full px-4 md:px-8 lg:px-12 mt-4">
          {!filteredProducts || filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl text-gray-600">
                No product Reviews found
              </h2>
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden xl:block">
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="reviews table">
                    <TableHead sx={{ backgroundColor: "#603F26" }}>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Product
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Review Summary
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Average Ratings
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredProducts.map((product, index) => (
                        <TableRow key={product?.productId}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images[0]}
                                alt={product.productName}
                                className="w-12 h-12 object-cover"
                              />
                              <span className="font-medium">
                                {product.productName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {product.reviewCount} Reviews available
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Rating
                                value={product.averageRating}
                                readOnly
                                precision={0.5}
                              />
                              <span>{product.averageRating}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Tooltip title="View Details">
                                <IconButton
                                  onClick={() => handleViewDetails(product)}
                                  color="primary"
                                  size="small"
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Product">
                                <IconButton
                                  onClick={() =>
                                    setDeleteProductId(product?.productId)
                                  }
                                  color="error"
                                  size="small"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              {/* Mobile View */}
              <div className="block xl:hidden space-y-4">
                {filteredProducts.map((product) => (
                  <Paper key={product?.productId} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.productName}
                          className="w-16 h-16 object-cover"
                        />
                        <div>
                          <h3 className="text-base font-bold">
                            {product.productName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {product.reviewCount} Reviews available
                          </p>
                        </div>
                      </div>
                      <IconButton
                        onClick={() => setDeleteProductId(product?.productId)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Rating
                        value={product.averageRating}
                        readOnly
                        precision={0.5}
                      />
                      <p>{product.averageRating}</p>
                    </div>

                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewDetails(product)}
                      fullWidth
                    >
                      View Details
                    </Button>
                  </Paper>
                ))}
              </div>
            </>
          )}
        </div>

        <ReviewDetailsDialog
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          productData={selectedProduct}
          deleteReviewId={deleteReviewId}
          setDeleteReviewId={setDeleteReviewId}
          onDeleteReview={(reviewId) =>
            handleDeleteReview(selectedProduct.productId, reviewId)
          }
        />

        <DeleteConfirmationDialog
          open={!!deleteReviewId || !!deleteProductId}
          onClose={() => {
            setDeleteReviewId(null);
            setDeleteProductId(null);
          }}
          onConfirm={
            deleteProductId
              ? () => handleDeleteProduct(deleteProductId)
              : () =>
                  handleDeleteReview(selectedProduct.productId, deleteReviewId)
          }
          itemId={deleteReviewId || deleteProductId}
          itemType={deleteProductId ? "product" : "review"}
        />
      </div>
    </ThemeProvider>
  );
};

export default ProductReviews;