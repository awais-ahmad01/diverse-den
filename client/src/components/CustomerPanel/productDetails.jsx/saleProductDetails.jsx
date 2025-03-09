// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Rating,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Tabs,
//   Tab,
// } from "@mui/material";

// import { AddShoppingCart, Add, Remove } from "@mui/icons-material";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   getSaleProductById,
//   SubmitProductReviews,
//   getProductReviews
// } from "../../../store/actions/products";
// import { useDispatch, useSelector } from "react-redux";
// import { showToast } from "../../../tools";



// const SaleProductDetails = () => {
//   const { user, isauthenticated } = useSelector((state) => state.auth);

//   const business = user?.business;

//   const { productId, eventId } = useParams();



//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { saleProduct, productReviews } = useSelector((state) => state.products);

//   console.log("saleProduct:", saleProduct);

//   useEffect(() => {
//     dispatch(getSaleProductById({productId, eventId}));
//     dispatch(getProductReviews(productId));
//   }, [productId]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [selectedImage, setSelectedImage] = useState(0);
//   const [selectedVariant, setSelectedVariant] = useState({
//     size: null,
//     color: null,
//     material: null,
//   });
//   const [quantity, setQuantity] = useState(1);
//   const [tabValue, setTabValue] = useState("reviews");
//   const [availableQuantity, setAvailableQuantity] = useState(0);

//   const [newReview, setNewReview] = useState({
//     rating: 5,
//     comment: "",
//   });

//   const [viewImage, setViewImage] = useState(null);

//   const [uniqueColorsData, setUniqueColorsData] = useState([]);
//   const [checkVariants, setCheckVariants] = useState(null);

//   // Helper function to get the available quantity based on selected variant
//   const getAvailableQuantityForVariant = () => {
//     if (!saleProduct?.variants || saleProduct.variants.length === 0) {
//       return 0;
//     }

//     // Find the variant that matches our selected criteria
//     const matchingVariants = saleProduct.variants.filter(variant => {
//       // If we have size selected and it doesn't match, skip this variant
//       if (selectedVariant.size && variant.size !== selectedVariant.size) {
//         return false;
//       }
      
//       // If we have material selected and it doesn't match, skip this variant
//       if (selectedVariant.material && variant.material !== selectedVariant.material) {
//         return false;
//       }

//       return true;
//     });

//     if (matchingVariants.length === 0) {
//       return 0;
//     }

//     const matchingVariant = matchingVariants[0];
    
//     // Check if this variant has colors
//     if (matchingVariant.colors && matchingVariant.colors.length > 0) {
//       // If a color is selected, find that color's quantity
//       if (selectedVariant.color) {
//         const colorObj = matchingVariant.colors.find(c => c.color === selectedVariant.color);
//         return colorObj?.quantity || 0;
//       }
//       // If no color is selected but the variant has colors, return 0 (user must select a color)
//       return 0;
//     } 
//     else {
//       // If no colors, return the variantTotal (for material/size-only variants)
//       return matchingVariant.variantTotal || 0;
//     }
//   };

//   const getColorsBySelectedSize = (selectedSize) => {
//     const variantsWithSelectedSize = saleProduct?.variants.filter(
//       (variant) => variant.size === selectedSize
//     );

//     const colorSet = new Set();
//     variantsWithSelectedSize?.forEach((variant) => {
//       if (variant.colors && variant.colors.length > 0) {
//         variant.colors.forEach((colorObj) => {
//           if (colorObj.color) {
//             colorSet.add(colorObj.color);
//           }
//         });
//       }
//     });

//     return Array.from(colorSet);
//   };

//   useEffect(() => {
//     const variantAvailability = {
//       hasSize: saleProduct?.variants.some(
//         (variant) => variant.size && variant.size.length > 0
//       ),
//       hasColors: saleProduct?.variants.some(
//         (variant) => variant.colors && variant.colors.length > 0
//       ),
//       hasMaterial: saleProduct?.variants.some(
//         (variant) => variant.material && variant.material.length > 0
//       ),
//     };

//     setCheckVariants(variantAvailability);

//     const defaultVariant = saleProduct?.variants[0];
//     const initialSize = variantAvailability.hasSize
//       ? defaultVariant.size
//       : null;
//     const initialColors = getColorsBySelectedSize(initialSize);

//     setSelectedVariant({
//       size: initialSize,
//       color: initialColors.length > 0 ? initialColors[0] : null,
//       material: variantAvailability.hasMaterial
//         ? defaultVariant.material
//         : null,
//     });

//     setViewImage(saleProduct?.imagePath[0]);
//     setUniqueColorsData(initialColors);
//     setLoading(false);
//   }, [saleProduct]);

//   useEffect(() => {
//     if (selectedVariant.size) {
//       const filteredColors = getColorsBySelectedSize(selectedVariant.size);
//       setUniqueColorsData(filteredColors);

//       if (filteredColors.length > 0) {
//         setSelectedVariant((prev) => ({
//           ...prev,
//           color: filteredColors[0],
//         }));
//       }
//     }
//   }, [selectedVariant.size]);

//   // Update available quantity whenever selected variant changes
//   useEffect(() => {
//     if (saleProduct) {
//       const availableQty = getAvailableQuantityForVariant();
//       setAvailableQuantity(availableQty);
      
//       // Reset quantity to 1 or available quantity if less than 1
//       setQuantity(availableQty > 0 ? 1 : 0);
//     }
//   }, [selectedVariant, saleProduct]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const handleAddToCart = async () => {
//     if (!isauthenticated) {
//       navigate("/signin");
//       return;
//     }

//     // Validate quantity against available stock
//     if (quantity <= 0) {
//       showToast("ERROR", "Product is out of stock!");
//       return;
//     }

//     if (quantity > availableQuantity) {
//       showToast("ERROR", `Only ${availableQuantity} items available in stock!`);
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
      
//       if (!token) {
//         showToast("ERROR", "Please Login first");
//         return;
//       }

//       const response = await axios.post(
//         "http://localhost:3000/customer/addToCart",
//         {
//           userId: user._id,
//           productId: saleProduct._id,
//           quantity: quantity,
//           selectedVariant: selectedVariant,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       showToast("SUCCESS", "Product added to cart successfully!");
//       window.location.reload();
//     } catch (err) {
//       console.log("err:", err);
//       showToast("ERROR", "Failed to Add Product!!");
//       setError("Failed to add to cart");
//     }
//   };

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   const handleReviewSubmit = (e) => {
//     e.preventDefault();

//     const body = {
//       userData: user,
//       businessId: business,
//       productId,
//       rating: newReview.rating,
//       comment: newReview.comment,
//     };

//     dispatch(SubmitProductReviews(body))
//       .unwrap()
//       .then((response) => {
//         showToast("SUCCESS", "Review Submitted Successfully!!");
//         dispatch(getProductReviews(productId));
//       })
//       .catch((error) => {
//         showToast("ERROR", "Failed! to Submit Review");
//       });
//   };

//   const variantRender = () => {
//     return (
//       <div>
//         {checkVariants?.hasSize && (
//           <div className="mb-4">
//             <span className="block mb-2 font-semibold">Size</span>
//             <div className="flex space-x-2">
//               {saleProduct.variants.map(
//                 (variant, index) =>
//                   variant?.size?.length > 0 && (
//                     <button
//                       key={index}
//                       onClick={() => {
//                         const filteredColors = getColorsBySelectedSize(
//                           variant.size
//                         );
//                         setSelectedVariant((prev) => ({
//                           ...prev,
//                           size: variant.size,
//                           color:
//                             filteredColors.length > 0
//                               ? filteredColors[0]
//                               : null,
//                         }));
//                       }}
//                       className={`flex items-center space-x-2 px-3 py-1 rounded ${
//                         selectedVariant.size === variant.size
//                           ? "ring-2 ring-[#603f26] bg-gray-100"
//                           : "ring-1 ring-gray-300"
//                       }`}
//                     >
//                       {variant.size}
//                     </button>
//                   )
//               )}
//             </div>
//           </div>
//         )}

//         {checkVariants?.hasMaterial && (
//           <div className="mb-4">
//             <span className="block mb-2 font-semibold">Material</span>
//             <div className="flex space-x-2">
//               {saleProduct.variants.map(
//                 (variant, index) =>
//                   variant?.material?.length > 0 && (
//                     <button
//                       key={index}
//                       onClick={() =>
//                         setSelectedVariant((prev) => ({
//                           ...prev,
//                           material: variant.material,
//                         }))
//                       }
//                       className={`px-3 py-1 border rounded ${
//                         selectedVariant.material === variant.material
//                           ? "ring-2 ring-[#603f26] bg-gray-100"
//                           : "ring-1 ring-gray-300"
//                       }`}
//                     >
//                       {variant.material}
//                     </button>
//                   )
//               )}
//             </div>
//           </div>
//         )}

//         {checkVariants?.hasColors && (
//           <div className="mb-4">
//             <span className="block mb-2 font-semibold">Color</span>
//             <div className="flex space-x-2">
//               {uniqueColorsData.map((color, index) => (
//                 <button
//                   key={index}
//                   onClick={() =>
//                     setSelectedVariant((prev) => ({
//                       ...prev,
//                       color: color,
//                     }))
//                   }
//                   className={`flex items-center space-x-2 px-3 py-1 rounded ${
//                     selectedVariant.color === color
//                       ? "ring-2 ring-[#603f26] bg-gray-100"
//                       : "ring-1 ring-gray-300"
//                   }`}
//                 >
//                   {color}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
        
//         {/* Display available quantity */}
//         <div className="mb-4 text-sm">
//           <span className={availableQuantity > 0 ? "text-green-600" : "text-red-600"}>
//             {availableQuantity > 0 
//               ? `${availableQuantity} items in stock` 
//               : "Out of stock"}
//           </span>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <CircularProgress />
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid md:grid-cols-2 gap-8">
//         <div>
//           <div className="mb-4">
//             <img
//               src={viewImage}
//               alt={saleProduct?.title}
//               className="w-full h-[500px] object-cover rounded-lg"
//             />
//           </div>
//           <div className="flex justify-center space-x-2">
//             {saleProduct?.imagePath?.map((image, index) => (
//               <button
//                 key={index}
//                 onClick={() => {
//                   setSelectedImage(index);
//                   setViewImage(image);
//                 }}
//                 className={`p-1 rounded-lg ${
//                   selectedImage === index
//                     ? "border-2 border-primary"
//                     : "border-2 border-transparent"
//                 }`}
//               >
//                 <img
//                   src={image}
//                   alt={`Thumbnail ${index + 1}`}
//                   className="w-20 h-20 object-cover rounded-md"
//                 />
//               </button>
//             ))}
//           </div>
//         </div>

//         <div>
//           <h1 className="text-3xl font-bold mb-4">{saleProduct?.title}</h1>
//           <div className="flex items-center mb-4">
//             <span className="text-lg text-[#603f26] mr-4">
//               SKU: {saleProduct?.sku}
//             </span>
//             <div className="flex items-center">
//               <Rating
//                 value={productReviews.averageRating}
//                 precision={0.1}
//                 readOnly
//               />
//               <span className="ml-2 text-sm">
//                 (
//                 {productReviews?.productReviews ? productReviews?.productReviews.length : 0}{" "}
//                 reviews)
//               </span>
//             </div>
//           </div>
//           <p className="text-2xl text-primary font-semibold mb-4">
//             Rs {saleProduct?.price.toFixed(2)}
//           </p>
//           <p className="text-gray-700 mb-4">{saleProduct?.description}</p>

//           {variantRender()}

//           <div className="flex items-center space-x-4 mb-6">
//             <div className="flex items-center border rounded">
//               <button
//                 className="p-2 hover:bg-gray-100"
//                 onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                 disabled={availableQuantity <= 0}
//               >
//                 <Remove />
//               </button>
//               <span className="px-4">{quantity}</span>
//               <button
//                 className="p-2 hover:bg-gray-100"
//                 onClick={() => setQuantity(Math.min(availableQuantity, quantity + 1))}
//                 disabled={quantity >= availableQuantity || availableQuantity <= 0}
//               >
//                 <Add />
//               </button>
//             </div>
//             <button
//               onClick={handleAddToCart}
//               disabled={availableQuantity <= 0}
//               className={`flex-1 flex items-center justify-center py-2 px-4 rounded 
//                   ${availableQuantity > 0 
//                     ? "bg-[#603f26] text-white hover:bg-opacity-90" 
//                     : "bg-gray-400 text-white cursor-not-allowed"}
//               `}
//             >
//               <AddShoppingCart className="mr-2" /> Add to Cart
//             </button>
//           </div>

//           <div>
//             <Tabs
//               value={tabValue}
//               onChange={handleTabChange}
//               variant="fullWidth"
//               className="border-b"
//             >
//               <Tab label="Reviews" value="reviews" />
//               <Tab label="Write a Review" value="write-review" />
//             </Tabs>

//             {tabValue === "reviews" && (
//               <div className="p-4">
//                 {productReviews?.productReviews &&
//                 productReviews?.productReviews.length > 0 ? (
//                   productReviews?.productReviews.map((review, index) => (
//                     <div key={index} className="border-b pb-4 mb-4">
//                       <Rating value={review.rating} readOnly />
//                       <p className="mt-2">{review.comment}</p>
//                       <p className="text-sm text-gray-500 mt-1">
//                         {review.customerName} -{" "}
//                         {(review.reviewDate)}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-center text-gray-500">No reviews yet</p>
//                 )}
//               </div>
//             )}

//             {tabValue === "write-review" && (
//               <form onSubmit={handleReviewSubmit} className="p-4 space-y-4">
//                 <div>
//                   <span className="block mb-2">Your Rating</span>
//                   <Rating
//                     value={newReview.rating}
//                     onChange={(event, newValue) => {
//                       setNewReview((prev) => ({ ...prev, rating: newValue }));
//                     }}
//                   />
//                 </div>
//                 <textarea
//                   className="w-full border rounded p-2"
//                   rows={4}
//                   placeholder="Write your review here..."
//                   value={newReview.comment}
//                   onChange={(e) =>
//                     setNewReview((prev) => ({
//                       ...prev,
//                       comment: e.target.value,
//                     }))
//                   }
//                   required
//                 />
//                 <button
//                   type="submit"
//                   className="w-full bg-[#603f26] text-white py-2 rounded hover:bg-opacity-90"
//                 >
//                   Submit Review
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SaleProductDetails;






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

import { AddShoppingCart, Add, Remove } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSaleProductById,
  SubmitProductReviews,
  getProductReviews
} from "../../../store/actions/products";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../tools";



const SaleProductDetails = () => {
  const { user, isauthenticated } = useSelector((state) => state.auth);

  const business = user?.business;

  const { productId, eventId } = useParams();



  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { saleProduct, productReviews } = useSelector((state) => state.products);

  console.log("saleProduct:", saleProduct);

  useEffect(() => {
    dispatch(getSaleProductById({productId, eventId}));
    dispatch(getProductReviews(productId));
  }, [productId]);

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
  const [availableQuantity, setAvailableQuantity] = useState(0);

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });

  const [viewImage, setViewImage] = useState(null);

  const [uniqueColorsData, setUniqueColorsData] = useState([]);
  const [checkVariants, setCheckVariants] = useState(null);

  // Helper function to get the available quantity based on selected variant
  const getAvailableQuantityForVariant = () => {
    if (!saleProduct?.variants || saleProduct.variants.length === 0) {
      return 0;
    }

    // Find the variant that matches our selected criteria
    const matchingVariants = saleProduct.variants.filter(variant => {
      // If we have size selected and it doesn't match, skip this variant
      if (selectedVariant.size && variant.size !== selectedVariant.size) {
        return false;
      }
      
      // If we have material selected and it doesn't match, skip this variant
      if (selectedVariant.material && variant.material !== selectedVariant.material) {
        return false;
      }

      return true;
    });

    if (matchingVariants.length === 0) {
      return 0;
    }

    const matchingVariant = matchingVariants[0];
    
    // Check if this variant has colors
    if (matchingVariant.colors && matchingVariant.colors.length > 0) {
      // If a color is selected, find that color's quantity
      if (selectedVariant.color) {
        const colorObj = matchingVariant.colors.find(c => c.color === selectedVariant.color);
        return colorObj?.quantity || 0;
      }
      // If no color is selected but the variant has colors, return 0 (user must select a color)
      return 0;
    } 
    else {
      // If no colors, return the variantTotal (for material/size-only variants)
      return matchingVariant.variantTotal || 0;
    }
  };

  const getColorsBySelectedSize = (selectedSize) => {
    const variantsWithSelectedSize = saleProduct?.variants.filter(
      (variant) => variant.size === selectedSize
    );

    const colorSet = new Set();
    variantsWithSelectedSize?.forEach((variant) => {
      if (variant.colors && variant.colors.length > 0) {
        variant.colors.forEach((colorObj) => {
          if (colorObj.color) {
            colorSet.add(colorObj.color);
          }
        });
      }
    });

    return Array.from(colorSet);
  };

  useEffect(() => {
    if (!saleProduct || !saleProduct.variants || saleProduct.variants.length === 0) {
      return; 
    }
  
    const variantAvailability = {
      hasSize: saleProduct.variants.some(
        (variant) => variant?.size && variant.size.length > 0
      ),
      hasColors: saleProduct.variants.some(
        (variant) => variant?.colors && variant.colors.length > 0
      ),
      hasMaterial: saleProduct.variants.some(
        (variant) => variant?.material && variant.material.length > 0
      ),
    };
  
    setCheckVariants(variantAvailability);
  
    const defaultVariant = saleProduct.variants[0]; // Safe to access now
    const initialSize = variantAvailability.hasSize
      ? defaultVariant.size
      : null;
    const initialColors = getColorsBySelectedSize(initialSize);
  
    setSelectedVariant({
      size: initialSize,
      color: initialColors.length > 0 ? initialColors[0] : null,
      material: variantAvailability.hasMaterial
        ? defaultVariant.material
        : null,
    });
  
    setViewImage(saleProduct.imagePath[0]);
    setUniqueColorsData(initialColors);
    setLoading(false);
  }, [saleProduct]);


  useEffect(() => {
    if (selectedVariant.size) {
      const filteredColors = getColorsBySelectedSize(selectedVariant.size);
      setUniqueColorsData(filteredColors);

      if (filteredColors.length > 0) {
        setSelectedVariant((prev) => ({
          ...prev,
          color: filteredColors[0],
        }));
      }
    }
  }, [selectedVariant.size]);

  // Update available quantity whenever selected variant changes
  useEffect(() => {
    if (saleProduct) {
      const availableQty = getAvailableQuantityForVariant();
      setAvailableQuantity(availableQty);
      
      // Reset quantity to 1 or available quantity if less than 1
      setQuantity(availableQty > 0 ? 1 : 0);
    }
  }, [selectedVariant, saleProduct]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (!saleProduct?.originalPrice || saleProduct.originalPrice <= saleProduct.price) {
      return 0;
    }
    
    const discountAmount = saleProduct.originalPrice - saleProduct.price;
    return Math.round((discountAmount / saleProduct.originalPrice) * 100);
  };

  const handleAddToCart = async () => {
    if (!isauthenticated) {
      navigate("/signin");
      return;
    }

    // Validate quantity against available stock
    if (quantity <= 0) {
      showToast("ERROR", "Product is out of stock!");
      return;
    }

    if (quantity > availableQuantity) {
      showToast("ERROR", `Only ${availableQuantity} items available in stock!`);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        showToast("ERROR", "Please Login first");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/customer/addToCart",
        {
          userId: user._id,
          productId: saleProduct._id,
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

      showToast("SUCCESS", "Product added to cart successfully!");
      window.location.reload();
    } catch (err) {
      console.log("err:", err);
      showToast("ERROR", "Failed to Add Product!!");
      setError("Failed to add to cart");
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    const body = {
      userData: user,
      businessId: business,
      productId,
      rating: newReview.rating,
      comment: newReview.comment,
    };

    dispatch(SubmitProductReviews(body))
      .unwrap()
      .then((response) => {
        showToast("SUCCESS", "Review Submitted Successfully!!");
        dispatch(getProductReviews(productId));
      })
      .catch((error) => {
        showToast("ERROR", "Failed! to Submit Review");
      });
  };

  const variantRender = () => {
    return (
      <div>
        {checkVariants?.hasSize && (
          <div className="mb-4">
            <span className="block mb-2 font-semibold">Size</span>
            <div className="flex space-x-2">
              {saleProduct.variants.map(
                (variant, index) =>
                  variant?.size?.length > 0 && (
                    <button
                      key={index}
                      onClick={() => {
                        const filteredColors = getColorsBySelectedSize(
                          variant.size
                        );
                        setSelectedVariant((prev) => ({
                          ...prev,
                          size: variant.size,
                          color:
                            filteredColors.length > 0
                              ? filteredColors[0]
                              : null,
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
              )}
            </div>
          </div>
        )}

        {checkVariants?.hasMaterial && (
          <div className="mb-4">
            <span className="block mb-2 font-semibold">Material</span>
            <div className="flex space-x-2">
              {saleProduct.variants.map(
                (variant, index) =>
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
              )}
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
        
        {/* Display available quantity */}
        <div className="mb-4 text-sm">
          <span className={availableQuantity > 0 ? "text-green-600" : "text-red-600"}>
            {availableQuantity > 0 
              ? `${availableQuantity} items in stock` 
              : "Out of stock"}
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  // Calculate discount percentage
  const discountPercentage = calculateDiscount();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <img
              src={viewImage}
              alt={saleProduct?.title}
              className="w-full h-[500px] object-cover rounded-lg"
            />
          </div>
          <div className="flex justify-center space-x-2">
            {saleProduct?.imagePath?.map((image, index) => (
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
          <h1 className="text-3xl font-bold mb-4">{saleProduct?.title}</h1>
          <div className="flex items-center mb-4">
            <span className="text-lg text-[#603f26] mr-4">
              SKU: {saleProduct?.sku}
            </span>
            <div className="flex items-center">
              <Rating
                value={productReviews.averageRating}
                precision={0.1}
                readOnly
              />
              <span className="ml-2 text-sm">
                (
                {productReviews?.productReviews ? productReviews?.productReviews.length : 0}{" "}
                reviews)
              </span>
            </div>
          </div>

          {/* Updated Price Display with Original Price and Discount */}
          <div className="flex items-center mb-4">
          
                <div className="flex items-baseline">
                  <span className="line-through text-gray-500 mr-2">
                    Rs {saleProduct?.price.toFixed(2)}
                  </span>
                  <span className="text-2xl text-primary font-semibold">
                    Rs {saleProduct?.discountedPrice.toFixed(2)}
                  </span>
                </div>
                <span className="ml-4 px-2 py-1 bg-red-500 text-white text-sm rounded-md">
                  {saleProduct?.discountValue}% OFF
                </span>
              
          </div>

          <p className="text-gray-700 mb-4">{saleProduct?.description}</p>

          {variantRender()}

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center border rounded">
              <button
                className="p-2 hover:bg-gray-100"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={availableQuantity <= 0}
              >
                <Remove />
              </button>
              <span className="px-4">{quantity}</span>
              <button
                className="p-2 hover:bg-gray-100"
                onClick={() => setQuantity(Math.min(availableQuantity, quantity + 1))}
                disabled={quantity >= availableQuantity || availableQuantity <= 0}
              >
                <Add />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={availableQuantity <= 0}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded 
                  ${availableQuantity > 0 
                    ? "bg-[#603f26] text-white hover:bg-opacity-90" 
                    : "bg-gray-400 text-white cursor-not-allowed"}
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
                {productReviews?.productReviews &&
                productReviews?.productReviews.length > 0 ? (
                  productReviews?.productReviews.map((review, index) => (
                    <div key={index} className="border-b pb-4 mb-4">
                      <Rating value={review.rating} readOnly />
                      <p className="mt-2">{review.comment}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {review.customerName} -{" "}
                        {(review.reviewDate)}
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

export default SaleProductDetails;