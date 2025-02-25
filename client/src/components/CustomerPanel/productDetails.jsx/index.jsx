import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Rating,
  Snackbar,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";

import { AddShoppingCart, Add, Remove, DoNotStep, ConstructionOutlined } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { getCustomerProductById } from "../../../store/actions/products";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../tools";

const ProductDetails = () => {

  const {user, isauthenticated} = useSelector(state => state.auth)

  const {productId} = useParams()

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {customerProduct} = useSelector(state => state.products);

  console.log("pr: ", customerProduct)


  useEffect(()=>{

    dispatch(getCustomerProductById(productId))


  },[productId])




  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState({
    size: null,
    color: null,
    material: null,
  });
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState("reviews");

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  

  const [viewImage, setViewImage] = useState(null);

  const [uniqueColorsData, setUniqueColorsData] = useState([]);
  const [checkVariants, setCheckVariants] = useState(null);

 
  const getColorsBySelectedSize = (selectedSize) => {
    const variantsWithSelectedSize = customerProduct?.variants.filter(
      (variant) => variant.size === selectedSize
    );

    const colorSet = new Set();
    variantsWithSelectedSize?.forEach((variant) => {
      variant.colors.forEach((colorObj) => {
        if (colorObj.color) {
          colorSet.add(colorObj.color);
        }
      });
    });

    return Array.from(colorSet);
  };

  useEffect(() => {
    const variantAvailability = {
      hasSize: customerProduct?.variants.some(
        (variant) => variant.size && variant.size.length > 0
      ),
      hasColors: customerProduct?.variants.some(
        (variant) => variant.colors && variant.colors.length > 0
      ),
      hasMaterial: customerProduct?.variants.some(
        (variant) => variant.material && variant.material.length > 0
      ),
    };

    setCheckVariants(variantAvailability);

    const defaultVariant = customerProduct?.variants[0];
    const initialSize = variantAvailability.hasSize ? defaultVariant.size : null;
    const initialColors = getColorsBySelectedSize(initialSize);
    
    setSelectedVariant({
      size: initialSize,
      color: initialColors.length > 0 ? initialColors[0] : null,
      material: variantAvailability.hasMaterial
        ? defaultVariant.material
        : null,
    });

    setViewImage(customerProduct?.imagePath[0]);
    setUniqueColorsData(initialColors);
    setLoading(false);
  }, [customerProduct]);


  useEffect(() => {

    if (selectedVariant.size) {
      const filteredColors = getColorsBySelectedSize(selectedVariant.size);
      setUniqueColorsData(filteredColors);

      if (filteredColors.length > 0) {
        setSelectedVariant((prev) => ({
          ...prev,
          color: filteredColors[0]
        }));
      }
    }
  }, [selectedVariant.size]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAddToCart = async () => {

    console.log('variant: ', selectedVariant.size)

    console.log(`quantity: ${quantity} variant: ${selectedVariant}`)

    if(!isauthenticated){
      navigate('/signin')
      return
    }



    try {

      const token = localStorage.getItem("token");
      console.log("myToken:", token);

      if (!token) {
        showToast("ERROR", "Please Login first")
        return;
      }

      const response = await axios.post("http://localhost:3000/customer/addToCart", {
        userId: user._id,
        productId: customerProduct._id,
        quantity: quantity,
        selectedVariant: selectedVariant,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
       
      }  
    
    );
      
      console.log('res:', response.data)
      showToast("SUCCESS", 'Product added to cart successfully!')
      window.location.reload();
    } catch (err) {
      console.log('err:', err);
      showToast("ERROR", 'Failed to Add Product!!')
      setError("Failed to add to cart");
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

    const handleReviewSubmit = async (e) => {
    e.preventDefault();
    console.log(`rating: ${newReview.rating} comment: ${newReview.comment}`)
    try {
      await axios.post(`/api/products/${productId}/reviews`, {
        rating: newReview.rating,
        comment: newReview.comment
      });
      setNewReview({ rating: 5, comment: '' });
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  const variantRender = () => {
    return (
      <div>
        {checkVariants?.hasSize && (
          <div className="mb-4">
            <span className="block mb-2 font-semibold">Size</span>
            <div className="flex space-x-2">
              {customerProduct.variants.map((variant, index) => (
                variant?.size?.length > 0 && (
                  <button
                    key={index}
                    onClick={() => {
                      
                      const filteredColors = getColorsBySelectedSize(variant.size);
                      setSelectedVariant((prev) => ({
                        ...prev,
                        size: variant.size,
                        color: filteredColors.length > 0 ? filteredColors[0] : null,
                      }));
                    }}
                    className={`flex items-center space-x-2 px-3 py-1 rounded ${
                      selectedVariant.size === variant.size
                        ? "ring-2 ring-[#603f26] bg-gray-100"
                        : "ring-1 ring-gray-300"
                    }`}
                  >
                    {variant.size}
                  </button>
                )
              ))}
            </div>
          </div>
        )}

        {checkVariants?.hasMaterial && (
          <div className="mb-4">
            <span className="block mb-2 font-semibold">Material</span>
            <div className="flex space-x-2">
              {customerProduct.variants.map((variant, index) => (
                variant?.material?.length > 0 && (
                  <button
                    key={index}
                    onClick={() =>
                      setSelectedVariant((prev) => ({
                        ...prev,
                        material: variant.material,
                      }))
                    }
                    className={`px-3 py-1 border rounded ${
                      selectedVariant.material === variant.material
                        ? "ring-2 ring-[#603f26] bg-gray-100"
                        : "ring-1 ring-gray-300"
                    }`}
                  >
                    {variant.material}
                  </button>
                )
              ))}
            </div>
          </div>
        )}

        {checkVariants?.hasColors && (
          <div className="mb-4">
            <span className="block mb-2 font-semibold">Color</span>
            <div className="flex space-x-2">
              {uniqueColorsData.map((color, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setSelectedVariant((prev) => ({
                      ...prev,
                      color: color,
                    }))
                  }
                  className={`flex items-center space-x-2 px-3 py-1 rounded ${
                    selectedVariant.color === color
                      ? "ring-2 ring-[#603f26] bg-gray-100"
                      : "ring-1 ring-gray-300"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

 
  // const handleCloseSnackbar = () => {
  //   setSubmitSuccess(false);
  //   setError(null);
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
 
      {/* <Snackbar
        open={submitSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Product added to cart successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar> */}

      <div className="grid md:grid-cols-2 gap-8">
     
     
        <div>
          <div className="mb-4">
            <img
              src={viewImage}
              alt={customerProduct?.title}
              className="w-full h-[500px] object-cover rounded-lg"
            />
          </div>
          <div className="flex justify-center space-x-2">
            {customerProduct?.imagePath?.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedImage(index);
                  setViewImage(image);
                }}
                className={`p-1 rounded-lg ${
                  selectedImage === index
                    ? "border-2 border-primary"
                    : "border-2 border-transparent"
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{customerProduct?.title}</h1>
          <div className="flex items-center mb-4">
            <span className="text-lg text-[#603f26] mr-4">
              SKU: {customerProduct?.sku}
            </span>
            <div className="flex items-center">
              <Rating
                value={calculateAverageRating(customerProduct?.reviews)}
                precision={0.1}
                readOnly
              />
              <span className="ml-2 text-sm">
                ({customerProduct?.reviews ? customerProduct?.reviews.length : 0} reviews)
              </span>
            </div>
          </div>
          <p className="text-2xl text-primary font-semibold mb-4">
            ${customerProduct?.price.toFixed(2)}
          </p>
          <p className="text-gray-700 mb-4">{customerProduct?.description}</p>

          {variantRender()}

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center border rounded">
              <button
                className="p-2 hover:bg-gray-100"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Remove />
              </button>
              <span className="px-4">{quantity}</span>
              <button
                className="p-2 hover:bg-gray-100"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Add />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded 
                  bg-[#603f26] text-white pointer hover:bg-opacity-90
                  
              `}
            >
              <AddShoppingCart className="mr-2" /> Add to Cart
            </button>
          </div>

   
          <div>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              className="border-b"
            >
              <Tab label="Reviews" value="reviews" />
              <Tab label="Write a Review" value="write-review" />
            </Tabs>

            {tabValue === "reviews" && (
              <div className="p-4">
                {customerProduct?.reviews && customerProduct?.reviews.length > 0 ? (
                  customerProduct?.reviews.map((review, index) => (
                    <div key={index} className="border-b pb-4 mb-4">
                      <Rating value={review.rating} readOnly />
                      <p className="mt-2">{review.comment}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {review.author} -{" "}
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No reviews yet</p>
                )}
              </div>
            )}

            {tabValue === "write-review" && (
              <form onSubmit={handleReviewSubmit} className="p-4 space-y-4">
                <div>
                  <span className="block mb-2">Your Rating</span>
                  <Rating
                    value={newReview.rating}
                    onChange={(event, newValue) => {
                      setNewReview((prev) => ({ ...prev, rating: newValue }));
                    }}
                  />
                </div>
                <textarea
                  className="w-full border rounded p-2"
                  rows={4}
                  placeholder="Write your review here..."
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-[#603f26] text-white py-2 rounded hover:bg-opacity-90"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return totalRating / reviews.length;
};

export default ProductDetails;






