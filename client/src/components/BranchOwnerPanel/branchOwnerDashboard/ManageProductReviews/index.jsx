import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Paper,
  Typography,
  Box,
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#603F26',
    },
  },
});

// Review Details Dialog Component
const ReviewDetailsDialog = ({ open, onClose, productData, onDeleteReview }) => {
  if (!productData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-[#603F26] text-white flex justify-between items-center">
        <div>Product Reviews - {productData.productName}</div>
        <div className="flex items-center gap-2">
          <Rating value={productData.averageRating} readOnly precision={0.5} size="small" />
          <span>({productData.averageRating})</span>
        </div>
      </DialogTitle>
      <DialogContent className="mt-4">
        <div className="space-y-6">
          {/* Product Information */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={productData.productImage || "/api/placeholder/120/120"}
              alt={productData.productName}
              className="w-24 h-24 object-cover rounded"
            />
            <div>
              <Typography variant="h6" className="font-bold">{productData.productName}</Typography>
              <Typography variant="body2" color="textSecondary">
                Total Reviews: {productData.reviews.length}
              </Typography>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <Typography variant="h6" className="font-bold mb-3">Rating Distribution</Typography>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = productData.reviews.filter(review => Math.floor(review.rating) === rating).length;
                const percentage = (count / productData.reviews.length) * 100 || 0;
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
            <Typography variant="h6" className="font-bold">Customer Reviews</Typography>
            {productData.reviews.map((review) => (
              <Paper key={review.id} className="p-4 space-y-3">
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>{review.customerName[0]}</Avatar>
                    <div>
                      <Typography variant="subtitle1" className="font-semibold">
                        {review.customerName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {format(new Date(review.date), 'PPP')}
                      </Typography>
                    </div>
                  </div>
                  <IconButton
                    color="error"
                    onClick={() => onDeleteReview(review.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>

                <div>
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography variant="body1" className="mt-2">
                    {review.comment}
                  </Typography>
                </div>

                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Review image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}

                {review.verifiedPurchase && (
                  <div className="mt-2">
                    <Chip label="Verified Purchase" color="success" size="small" />
                  </div>
                )}
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

// Enhanced Delete Confirmation Dialog to handle both review and product deletion
const DeleteConfirmationDialog = ({ open, onClose, onConfirm, itemId, itemType }) => {
  const isProduct = itemType === 'product';
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="text-red-600">
        Delete {isProduct ? 'Product' : 'Review'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this {isProduct ? 'product and all its reviews' : 'review'}? 
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onConfirm(itemId)} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ProductReviews = () => {
  const [products, setProducts] = useState([]);
  const [deleteReviewId, setDeleteReviewId] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulated API call to fetch products with reviews
    const fetchProducts = async () => {
      try {
        const mockProducts = [
          {
            id: 1,
            productName: 'Leo Gray Sneaker',
            productImage: '/api/placeholder/80/80',
            averageRating: 4.5,
            reviews: [
              {
                id: 1,
                customerName: 'John Doe',
                rating: 5,
                comment: 'Great shoes! Very comfortable and stylish.',
                date: '2024-02-20',
                verifiedPurchase: true,
                images: ['/api/placeholder/80/80']
              },
              {
                id: 2,
                customerName: 'Jane Smith',
                rating: 4,
                comment: 'Good quality but runs a bit small.',
                date: '2024-02-19',
                verifiedPurchase: true
              },
              {
                id: 3,
                customerName: 'Mike Johnson',
                rating: 4.5,
                comment: 'Perfect for daily wear. Would buy again!',
                date: '2024-02-18',
                verifiedPurchase: false
              }
            ]
          },
          {
            id: 1,
            productName: 'Leo Gray Sneaker',
            productImage: '/api/placeholder/80/80',
            averageRating: 4.5,
            reviews: [
              {
                id: 1,
                customerName: 'John Doe',
                rating: 5,
                comment: 'Great shoes! Very comfortable and stylish.',
                date: '2024-02-20',
                verifiedPurchase: true,
                images: ['/api/placeholder/80/80']
              },
              {
                id: 2,
                customerName: 'Jane Smith',
                rating: 4,
                comment: 'Good quality but runs a bit small.',
                date: '2024-02-19',
                verifiedPurchase: true
              },
              {
                id: 3,
                customerName: 'Mike Johnson',
                rating: 4.5,
                comment: 'Perfect for daily wear. Would buy again!',
                date: '2024-02-18',
                verifiedPurchase: false
              }
            ]
          },
          {
            id: 1,
            productName: 'Leo Gray Sneaker',
            productImage: '/api/placeholder/80/80',
            averageRating: 4.5,
            reviews: [
              {
                id: 1,
                customerName: 'John Doe',
                rating: 5,
                comment: 'Great shoes! Very comfortable and stylish.',
                date: '2024-02-20',
                verifiedPurchase: true,
                images: ['/api/placeholder/80/80']
              },
              {
                id: 2,
                customerName: 'Jane Smith',
                rating: 4,
                comment: 'Good quality but runs a bit small.',
                date: '2024-02-19',
                verifiedPurchase: true
              },
              {
                id: 3,
                customerName: 'Mike Johnson',
                rating: 4.5,
                comment: 'Perfect for daily wear. Would buy again!',
                date: '2024-02-18',
                verifiedPurchase: false
              }
            ]
          },
          // Add more mock products as needed
        ];
        setProducts(mockProducts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteClick = (reviewId) => {
    setDeleteReviewId(reviewId);
  };

  const handleDeleteProductClick = (productId) => {
    setDeleteProductId(productId);
  };

  const handleDeleteConfirm = async (itemId) => {
    try {
      if (deleteReviewId) {
        // Handle review deletion
        await new Promise(resolve => setTimeout(resolve, 500));
        setProducts(products.map(product => ({
          ...product,
          reviews: product.reviews.filter(review => review.id !== itemId),
          averageRating: calculateAverageRating(product.reviews.filter(review => review.id !== itemId))
        })));
        
        if (selectedProduct) {
          const updatedReviews = selectedProduct.reviews.filter(review => review.id !== itemId);
          setSelectedProduct({
            ...selectedProduct,
            reviews: updatedReviews,
            averageRating: calculateAverageRating(updatedReviews)
          });
        }
      } else if (deleteProductId) {
        // Handle product deletion
        await new Promise(resolve => setTimeout(resolve, 500));
        setProducts(products.filter(product => product.id !== itemId));
        if (selectedProduct?.id === itemId) {
          setSelectedProduct(null);
        }
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setDeleteReviewId(null);
      setDeleteProductId(null);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="relative bg-gray-50 flex flex-col pt-5">
        {/* Header */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, mb: 3 }}>
          <Typography variant="h4" sx={{ color: "#603F26", fontWeight: "bold" }}>
            Product Reviews
          </Typography>
        </Box>

        {/* Content */}
        <div className="w-full px-4 md:px-8 lg:px-12 mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#603F26]"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Typography variant="h5" className="text-gray-600">
                No products found
              </Typography>
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden xl:block">
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="reviews table">
                    <TableHead sx={{ backgroundColor: "#603F26" }}>
                      <TableRow>
                        <TableCell sx={{ color: "white", fontSize: "16px", fontWeight: "bold" }}>
                          Product
                        </TableCell>
                        <TableCell sx={{ color: "white", fontSize: "16px", fontWeight: "bold" }}>
                          Review Summary
                        </TableCell>
                        <TableCell sx={{ color: "white", fontSize: "16px", fontWeight: "bold" }}>
                          Average Ratings
                        </TableCell>
                        <TableCell sx={{ color: "white", fontSize: "16px", fontWeight: "bold" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={product.productImage}
                                alt={product.productName}
                                className="w-12 h-12 object-cover"
                              />
                              <span>{product.productName}</span>
                            </div>
                          </TableCell>
                          <TableCell>{product.reviews.length} Reviews available</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Rating value={product.averageRating} readOnly precision={0.5} />
                              <span>{product.averageRating}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Tooltip title="View Details">
                                <IconButton onClick={() => handleViewDetails(product)} color="primary">
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Product">
                                <IconButton
                                  onClick={() => handleDeleteProductClick(product.id)}
                                  color="error"
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
                {products.map((product) => (
                  <Paper key={product.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          className="w-16 h-16 object-cover"
                        />
                        <div>
                          <Typography variant="subtitle1" className="font-bold">
                            {product.productName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {product.reviews.length} Reviews available
                          </Typography>
                        </div>
                      </div>
                      <IconButton
                        onClick={() => handleDeleteProductClick(product.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Rating value={product.averageRating} readOnly precision={0.5} />
                      <Typography variant="body1">{product.averageRating}</Typography>
                    </div>

                    <Button
                      variant="contained"
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

        {/* Dialogs */}
        <ReviewDetailsDialog
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          productData={selectedProduct}
          onDeleteReview={handleDeleteClick}
        />

        <DeleteConfirmationDialog
          open={!!deleteReviewId || !!deleteProductId}
          onClose={() => {
            setDeleteReviewId(null);
            setDeleteProductId(null);
          }}
          onConfirm={handleDeleteConfirm}
          itemId={deleteReviewId || deleteProductId}
          itemType={deleteProductId ? 'product' : 'review'}
        />
      </div>
    </ThemeProvider>
  );
};

export default ProductReviews;