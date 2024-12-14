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

import { AddShoppingCart, Add, Remove, DoNotStep } from "@mui/icons-material";
import { useParams } from "react-router-dom";

import { getProductByID } from "../../../store/actions/products";
import { useDispatch, useSelector } from "react-redux";

const ProductDetails = () => {

  const {productId} = useParams()

  const dispatch = useDispatch()

  const {productbyId} = useSelector(state => state.products);

  console.log("pr: ", productbyId)


  useEffect(()=>{

    dispatch(getProductByID(productId))


  },[productId])


  // const product = {
  //   branch: "BR#10",
  //   business: "674a9e15282f25a295c41840",
  //   category: "Clothing",
  //   description: "jhDAMBN QWJHFSABN",
  //   imagePath: ["/images/t1.jpeg", "/images/s1.jpeg", "/images/d1.jpeg", "/images/f1.jpeg"],
  //   price: 2000,
  //   productType: "Shirts",
  //   sku: "sd23",
  //   subCategory: "Men",
  //   title: "shirt",
  //   variants: [
  //     {
  //       colors: [
  //         { color: "white", quantity: 4, _id: "6755d153cb8421c4b2a123ba" },
  //         { color: "blue", quantity: 4, _id: "6755d153cb8421c4b2a123bb" },
  //       ],
  //       material: "Leather",
  //       size: "small",
  //       variantTotal: 8,
  //       _id: "6755d153cb8421c4b2a123bc",
  //     },
  //     {
  //       colors: [
  //         { color: "black", quantity: 6, _id: "6755d153cb8421c4b2a123bd" },
  //         { color: "blue", quantity: 7, _id: "6755d153cb8421c4b2a123be" },
  //       ],
  //       material: "",
  //       size: "large",
  //       variantTotal: 13,
  //       _id: "6755d153cb8421c4b2a123bf",
  //     },
  //   ],
  //   reviews: [
  //     {
  //       rating: 4,
  //       comment: "Great product!",
  //       author: "John Doe",
  //       date: new Date().toISOString()
  //     }
  //   ],
  //   __v: 0,
  //   _id: "6755d153cb8421c4b2a123b9",
  // };

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
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [viewImage, setViewImage] = useState(null);

  const [uniqueColorsData, setUniqueColorsData] = useState([]);
  const [checkVariants, setCheckVariants] = useState(null);

 
  const getColorsBySelectedSize = (selectedSize) => {
    const variantsWithSelectedSize = productbyId.variants.filter(
      (variant) => variant.size === selectedSize
    );

    const colorSet = new Set();
    variantsWithSelectedSize.forEach((variant) => {
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
      hasSize: productbyId?.variants.some(
        (variant) => variant.size && variant.size.length > 0
      ),
      hasColors: productbyId?.variants.some(
        (variant) => variant.colors && variant.colors.length > 0
      ),
      hasMaterial: productbyId?.variants.some(
        (variant) => variant.material && variant.material.length > 0
      ),
    };

    setCheckVariants(variantAvailability);

    const defaultVariant = productbyId.variants[0];
    const initialSize = variantAvailability.hasSize ? defaultVariant.size : null;
    const initialColors = getColorsBySelectedSize(initialSize);
    
    setSelectedVariant({
      size: initialSize,
      color: initialColors.length > 0 ? initialColors[0] : null,
      material: variantAvailability.hasMaterial
        ? defaultVariant.material
        : null,
    });

    setViewImage(productbyId.imagePath[0]);
    setUniqueColorsData(initialColors);
    setLoading(false);
  }, []);


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
    try {
      await axios.post("/api/cart", {
        productId: productbyId._id,
        quantity: quantity,
        variant: selectedVariant,
      });
      setSubmitSuccess(true);
    } catch (err) {
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
              {productbyId.variants.map((variant, index) => (
                variant?.size?.length > 0 && (
                  <button
                    key={index}
                    onClick={() => {
                      // Directly update the size and reset color
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
              {productbyId.variants.map((variant, index) => (
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

 
  const handleCloseSnackbar = () => {
    setSubmitSuccess(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
 
      <Snackbar
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
      </Snackbar>

      <div className="grid md:grid-cols-2 gap-8">
     
     
        <div>
          <div className="mb-4">
            <img
              src={viewImage}
              alt={product.title}
              className="w-full h-[500px] object-cover rounded-lg"
            />
          </div>
          <div className="flex justify-center space-x-2">
            {productbyId.imagePath.map((image, index) => (
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
          <h1 className="text-3xl font-bold mb-4">{productbyId.title}</h1>
          <div className="flex items-center mb-4">
            <span className="text-lg text-[#603f26] mr-4">
              SKU: {productbyId.sku}
            </span>
            <div className="flex items-center">
              <Rating
                value={calculateAverageRating(product?.reviews)}
                precision={0.1}
                readOnly
              />
              <span className="ml-2 text-sm">
                ({productbyId?.reviews ? productbyId?.reviews.length : 0} reviews)
              </span>
            </div>
          </div>
          <p className="text-2xl text-primary font-semibold mb-4">
            ${productbyId.price.toFixed(2)}
          </p>
          <p className="text-gray-700 mb-4">{productbyId.description}</p>

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
                {productbyId.reviews && productbyId.reviews.length > 0 ? (
                  product.reviews.map((review, index) => (
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

// const ProductDetails = () => {
//   const product = {
//     branch: "BR#10",
//     business: "674a9e15282f25a295c41840",
//     category: "Clothing",
//     description: "jhDAMBN QWJHFSABN",
//     imagePath: ["/images/t1.jpeg", "/images/s1.jpeg", "/images/d1.jpeg", "/images/f1.jpeg"],
//     price: 2000,
//     productType: "Shirts",
//     sku: "sd23",
//     subCategory: "Men",
//     title: "shirt",
//     variants: [
//       {
//         colors: [
//           { color: "white", quantity: 4, _id: "6755d153cb8421c4b2a123ba" },
//           { color: "blue", quantity: 4, _id: "6755d153cb8421c4b2a123bb" },
//         ],
//         material: "Leather",
//         size: "small",
//         variantTotal: 8,
//         _id: "6755d153cb8421c4b2a123bc",
//       },
//       {
//         colors: [
//           { color: "black", quantity: 6, _id: "6755d153cb8421c4b2a123bd" },
//           { color: "blue", quantity: 7, _id: "6755d153cb8421c4b2a123be" },
//         ],
//         material: "",
//         size: "large",
//         variantTotal: 13,
//         _id: "6755d153cb8421c4b2a123bf",
//       },
//     ],
//     __v: 0,
//     _id: "6755d153cb8421c4b2a123b9",
//   };

//   // const [product, setProduct] = useState(null);
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

//   const [newReview, setNewReview] = useState({
//     rating: 5,
//     comment: "",
//   });
//   const [submitSuccess, setSubmitSuccess] = useState(false);

//   const [viewImage, setViewImage] = useState(null);

//   const [uniqueColorsData, setUniqueColorsData] = useState([]);

//   // useEffect(() => {
//   //   const fetchProductDetails = async () => {
//   //     try {
//   //       setLoading(true);
//   //       const response = await axios.get(`/api/products/${productId}`);
//   //       setProduct(response.data);
//   //       setLoading(false);
//   //     } catch (err) {
//   //       setError('Failed to load product details');
//   //       setLoading(false);
//   //     }
//   //   };

//   //   if (productId) {
//   //     fetchProductDetails();
//   //   }
//   // }, [productId]);

//   const handleAddToCart = async () => {
//     try {
//       await axios.post("/api/cart", {
//         productId: product.id,
//         quantity: quantity,
//         variant: selectedVariant,
//       });
//       setSubmitSuccess(true);
//     } catch (err) {
//       setError("Failed to add to cart");
//     }
//   };

//   // const handleReviewSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     await axios.post(`/api/products/${productId}/reviews`, {
//   //       rating: newReview.rating,
//   //       comment: newReview.comment
//   //     });
//   //     setNewReview({ rating: 5, comment: '' });
//   //   } catch (err) {
//   //     setError('Failed to submit review');
//   //   }
//   // };

//   // if (loading) {
//   //   return (
//   //     <div className="flex justify-center items-center h-screen">
//   //       <CircularProgress />
//   //     </div>
//   //   );
//   // }

//   // if (error || !product) {
//   //   return (
//   //     <div className="text-center text-red-500 p-8">
//   //       {error || 'Product not found'}
//   //     </div>
//   //   );
//   // }

//   const [checkVariants, setCheckVariants] = useState(null);

//   useEffect(() => {
//     const variantAvailability = {
//       hasSize: product.variants.some(
//         (variant) => variant.size && variant.size.length > 0
//       ),
//       hasColors: product.variants.some(
//         (variant) => variant.colors && variant.colors.length > 0
//       ),
//       hasMaterial: product.variants.some(
//         (variant) => variant.material && variant.material.length > 0
//       ),
//     };

//     setCheckVariants(variantAvailability);

//     const defaultVariant = product.variants[0];
//     setSelectedVariant({
//       size: variantAvailability.hasSize ? defaultVariant.size : null,
//       color: variantAvailability.hasColors
//         ? defaultVariant.colors[0]?.color
//         : null,
//       material: variantAvailability.hasMaterial
//         ? defaultVariant.material
//         : null,
//     });

//     setViewImage(product.imagePath[0]);


//     if (product?.variants) {
//         const allColors = product.variants.reduce((colors, variant) => {
//           if (variant.colors) {
//             variant.colors.forEach((colorObj) => {
//               if (colorObj.color) {
//                 colors.add(colorObj.color);
//               }
//             });
//           }
//           return colors;
//         }, new Set());
  
//         setUniqueColorsData(Array.from(allColors));
      
//       }
//   }, []);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);


//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   const handleReviewSubmit = (e) => {
//     e.preventDefault();
//     // TODO: Implement actual review submission logic
//     console.log("Submitting review:", newReview);
//     // Reset form or show confirmation
//     setNewReview({ rating: 5, comment: "" });
//   };

//   const variantRender = () => {
//     return (
//       <div>
//         {checkVariants?.hasSize && (
//           <div className="mb-4">
//             <span className="block mb-2 font-semibold">Size</span>
//             <div className="flex space-x-2">
//               {product.variants.map((variant, index) => (
//                 variant?.size?.length > 0 && (
//                   <button
//                   key={index}
//                   onClick={() =>
//                     setSelectedVariant((prev) => ({
//                       ...prev,
//                       size: variant.size,
//                     }))
//                   }
//                   className={`flex items-center space-x-2 px-3 py-1 rounded ${
//                     selectedVariant.size === variant.size
//                       ? "ring-2 ring-[#603f26] bg-gray-100"
//                       : "ring-1 ring-gray-300"
//                   }`}
//                 >
//                   {variant.size}
//                 </button>
//                 )
//               ))}
//             </div>
//           </div>
//         )}

//         {checkVariants?.hasMaterial && (
//           <div className="mb-4">
//             <span className="block mb-2 font-semibold">Material</span>
//             <div className="flex space-x-2">
//               {product.variants.map((variant, index) => (
//                 variant?.material?.length > 0 && (
//                   <button
//                   key={index}
//                   onClick={() =>
//                     setSelectedVariant((prev) => ({
//                       ...prev,
//                       material: variant.material,
//                     }))
//                   }
//                   className={`px-4 py-2 border rounded ${
//                     selectedVariant.material === variant.material
//                        ? "ring-2 ring-[#603f26] bg-gray-100"
//                       : "ring-1 ring-gray-300"
//                   }`}
//                 >
//                   {variant.material}
//                 </button>
//                 )
//               ))}
//             </div>
//           </div>
//         )}

//         {checkVariants?.hasColors && (
//           <div className="mb-4">
//             <span className="block mb-2 font-semibold">Color</span>
//             <div className="flex space-x-2">
//               {uniqueColorsData.map((color, index) => (
//                   <button
//                     key={index}
//                     onClick={() =>
//                       setSelectedVariant((prev) => ({
//                         ...prev,
//                         color: color,
//                       }))
//                     }
//                     className={`flex items-center space-x-2 px-3 py-1 rounded ${
//                       selectedVariant.color === color
//                         ? "ring-2 ring-[#603f26] bg-gray-100"
//                         : "ring-1 ring-gray-300"
//                     }`}
//                   >
//                     {color}
//                   </button>
//                 )
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid md:grid-cols-2 gap-8">
//         {/* Image Gallery */}
//         <div>
//           <div className="mb-4">
//             <img
//               src={viewImage}
//               alt={product.title}
//               className="w-full h-[500px] object-cover rounded-lg"
//             />
//           </div>
//           <div className="flex justify-center space-x-2">
//             {product.imagePath.map((image, index) => (
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

//         {/* Product Information */}
//         <div>
//           <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
//           <div className="flex items-center mb-4">
//             <span className="text-lg text-[#603f26] mr-4">
//               SKU: {product.sku}
//             </span>
//             <div className="flex items-center">
//               <Rating
//                 value={calculateAverageRating(product?.reviews)}
//                 precision={0.1}
//                 readOnly
//               />
//               <span className="ml-2 text-sm">
//                 ({product?.reviews ? product?.reviews.length : 0} reviews)
//               </span>
//             </div>
//           </div>
//           <p className="text-2xl text-primary font-semibold mb-4">
//             ${product.price.toFixed(2)}
//           </p>
//           <p className="text-gray-700 mb-4">{product.description}</p>

//           {variantRender()}

//           <div className="flex items-center space-x-4 mb-6">
//             <div className="flex items-center border rounded">
//               <button
//                 className="p-2 hover:bg-gray-100"
//                 onClick={() => setQuantity(Math.max(1, quantity - 1))}
//               >
//                 <Remove />
//               </button>
//               <span className="px-4">{quantity}</span>
//               <button
//                 className="p-2 hover:bg-gray-100"
//                 onClick={() => setQuantity(quantity + 1)}
//               >
//                 <Add />
//               </button>
//             </div>
//             <button
//               onClick={handleAddToCart}
//               className={`flex-1 flex items-center justify-center py-2 px-4 rounded 
//                   bg-[#603f26] text-white pointer hover:bg-opacity-90
                  
//               `}
//             >
//               <AddShoppingCart className="mr-2" /> Add to Cart
//             </button>
//           </div>

//           {/* Reviews Section */}
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
//                 {product.reviews && product.reviews.length > 0 ? (
//                   product.reviews.map((review, index) => (
//                     <div key={index} className="border-b pb-4 mb-4">
//                       <Rating value={review.rating} readOnly />
//                       <p className="mt-2">{review.comment}</p>
//                       <p className="text-sm text-gray-500 mt-1">
//                         {review.author} -{" "}
//                         {new Date(review.date).toLocaleDateString()}
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

//       {/* Success and Error Handling */}
//       {/* <Snackbar
//         open={submitSuccess}
//         autoHideDuration={6000}
//         onClose={() => setSubmitSuccess(false)}
//       >
//         <Alert onClose={() => setSubmitSuccess(false)} severity="success">
//           Product added to cart successfully!
//         </Alert>
//       </Snackbar> */}
//     </div>
//   );
// };

// // Helper function to calculate average rating
// const calculateAverageRating = (reviews) => {
//   if (!reviews || reviews.length === 0) return 0;
//   const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//   return totalRating / reviews.length;
// };

// export default ProductDetails;












// // import React, { useState } from 'react';
// // import {
// //   Rating,
// //   Select,
// //   MenuItem,
// //   FormControl,
// //   InputLabel,
// //   Tabs,
// //   Tab
// // } from '@mui/material';
// // import {
// //   AddShoppingCart,
// //   Add,
// //   Remove
// // } from '@mui/icons-material';

// // const ProductDetails = () => {

// //   const product = {
// //     id: 'prod-001',
// //     title: 'Classic Leather Jacket',
// //     sku: 'LJ-001-BLK',
// //     price: 249.99,
// //     description: 'Timeless leather jacket crafted from premium genuine leather. Perfect for any occasion.',
// //     images: [
// //       '/images/me.jpeg',
// //       '/images/me.jpeg',
// //       '/images/me.jpeg'
// //     ],
// //     sizes: ['XS', 'S', 'M', 'L', 'XL'],
// //     colors: ['#000000', '#8B4513', '#A52A2A'],
// //     reviews: [
// //       {
// //         rating: 5,
// //         comment: 'Amazing quality! Fits perfectly.',
// //         author: 'John D.',
// //         date: '2024-01-15'
// //       },
// //       {
// //         rating: 4,
// //         comment: 'Great jacket, slightly tight in shoulders.',
// //         author: 'Sarah M.',
// //         date: '2024-02-20'
// //       }
// //     ]
// //   };

// //   const [selectedImage, setSelectedImage] = useState(0);
// //   const [selectedSize, setSelectedSize] = useState('');
// //   const [selectedColor, setSelectedColor] = useState('');
// //   const [quantity, setQuantity] = useState(1);
// //   const [tabValue, setTabValue] = useState('reviews');
// //   const [newReview, setNewReview] = useState({
// //     rating: 5,
// //     comment: ''
// //   });

// //   // Calculate average rating
// //   const calculateAverageRating = () => {
// //     if (!product.reviews || product.reviews.length === 0) return 0;
// //     const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
// //     return totalRating / product.reviews.length;
// //   };

// //   const handleReviewSubmit = (e) => {
// //     e.preventDefault();
// //     // TODO: Implement actual review submission logic
// //     console.log('Submitting review:', newReview);
// //     // Reset form or show confirmation
// //     setNewReview({ rating: 5, comment: '' });
// //   };

// //   const handleTabChange = (event, newValue) => {
// //     setTabValue(newValue);
// //   };

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       <div className="grid md:grid-cols-2 gap-8">
// //         {/* Image Gallery */}
// //         <div>
// //           <div className="mb-4">
// //             <img
// //               src={product.images[selectedImage]}
// //               alt={product.title}
// //               className="w-full h-[500px] object-cover rounded-lg"
// //             />
// //           </div>

// //           {/* Thumbnail Images */}
// //           <div className="flex justify-center space-x-2">
// //             {product.images.map((image, index) => (
// //               <button
// //                 key={index}
// //                 onClick={() => setSelectedImage(index)}
// //                 className={`p-1 rounded-lg ${
// //                   selectedImage === index
// //                     ? 'border-2 border-primary'
// //                     : 'border-2 border-transparent'
// //                 }`}
// //               >
// //                 <img
// //                   src={image}
// //                   alt={`Thumbnail ${index + 1}`}
// //                   className="w-20 h-20 object-cover rounded-md"
// //                 />
// //               </button>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Product Information */}
// //         <div>
// //           <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

// //           {/* Product Details */}
// //           <div className="flex items-center mb-4">
// //             <span className="text-sm text-gray-600 mr-4">SKU: {product.sku}</span>
// //             <div className="flex items-center">
// //               <Rating
// //                 value={calculateAverageRating()}
// //                 precision={0.1}
// //                 readOnly
// //               />
// //               <span className="ml-2 text-sm">
// //                 ({product.reviews ? product.reviews.length : 0} reviews)
// //               </span>
// //             </div>
// //           </div>

// //           {/* Price */}
// //           <p className="text-2xl text-primary font-semibold mb-4">
// //             ${product.price.toFixed(2)}
// //           </p>

// //           {/* Description */}
// //           <p className="text-gray-700 mb-4">{product.description}</p>

// //           {/* Size Selection */}
// //           {product.sizes && (
// //             <div className="mb-4">
// //               <FormControl fullWidth variant="outlined" size="small">
// //                 <InputLabel>Size</InputLabel>
// //                 <Select
// //                   value={selectedSize}
// //                   label="Size"
// //                   onChange={(e) => setSelectedSize(e.target.value)}
// //                 >
// //                   {product.sizes.map((size) => (
// //                     <MenuItem key={size} value={size}>
// //                       {size}
// //                     </MenuItem>
// //                   ))}
// //                 </Select>
// //               </FormControl>
// //             </div>
// //           )}

// //           {/* Color Selection */}
// //           {product.colors && (
// //             <div className="flex items-center space-x-2 mb-4">
// //               <span>Color:</span>
// //               {product.colors.map((color) => (
// //                 <button
// //                   key={color}
// //                   onClick={() => setSelectedColor(color)}
// //                   className={`w-10 h-10 rounded-full ${
// //                     selectedColor === color
// //                       ? 'ring-2 ring-primary'
// //                       : 'ring-1 ring-gray-300'
// //                   }`}
// //                   style={{ backgroundColor: color }}
// //                 />
// //               ))}
// //             </div>
// //           )}

// //           {/* Quantity and Add to Cart */}
// //           <div className="flex items-center space-x-4 mb-6">
// //             <div className="flex items-center border rounded">
// //               <button
// //                 className="p-2 hover:bg-gray-100"
// //                 onClick={() => setQuantity(Math.max(1, quantity - 1))}
// //               >
// //                 <Remove />
// //               </button>
// //               <span className="px-4">{quantity}</span>
// //               <button
// //                 className="p-2 hover:bg-gray-100"
// //                 onClick={() => setQuantity(quantity + 1)}
// //               >
// //                 <Add />
// //               </button>
// //             </div>
// //             <button
// //               className={`flex-1 flex items-center justify-center py-2 px-4 rounded ${
// //                 product.sizes && !selectedSize
// //                   ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
// //                   : 'bg-primary text-white hover:bg-primary-dark'
// //               }`}
// //               disabled={product.sizes && !selectedSize}
// //             >
// //               <AddShoppingCart className="mr-2" /> Add to Cart
// //             </button>
// //           </div>

// //           {/* Reviews Section */}
// //           <div>
// //             <Tabs
// //               value={tabValue}
// //               onChange={handleTabChange}
// //               variant="fullWidth"
// //               className="border-b"
// //             >
// //               <Tab label="Reviews" value="reviews" />
// //               <Tab label="Write a Review" value="write-review" />
// //             </Tabs>

// //             {tabValue === 'reviews' && (
// //               <div className="p-4">
// //                 {product.reviews && product.reviews.length > 0 ? (
// //                   product.reviews.map((review, index) => (
// //                     <div key={index} className="border-b pb-4 mb-4">
// //                       <Rating
// //                         value={review.rating}
// //                         readOnly
// //                       />
// //                       <p className="mt-2">{review.comment}</p>
// //                       <p className="text-sm text-gray-500 mt-1">
// //                         {review.author} - {new Date(review.date).toLocaleDateString()}
// //                       </p>
// //                     </div>
// //                   ))
// //                 ) : (
// //                   <p className="text-center text-gray-500">No reviews yet</p>
// //                 )}
// //               </div>
// //             )}

// //             {tabValue === 'write-review' && (
// //               <form onSubmit={handleReviewSubmit} className="p-4 space-y-4">
// //                 <div>
// //                   <span className="block mb-2">Your Rating</span>
// //                   <Rating
// //                     value={newReview.rating}
// //                     onChange={(event, newValue) => {
// //                       setNewReview(prev => ({ ...prev, rating: newValue }));
// //                     }}
// //                   />
// //                 </div>
// //                 <textarea
// //                   className="w-full border rounded p-2"
// //                   rows={4}
// //                   placeholder="Write your review here..."
// //                   value={newReview.comment}
// //                   onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
// //                   required
// //                 />
// //                 <button
// //                   type="submit"
// //                   className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark"
// //                 >
// //                   Submit Review
// //                 </button>
// //               </form>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductDetails;



































// // import React, { useState } from 'react';

// // const ProductDetails = () => {
// //   const [selectedSize, setSelectedSize] = useState('M');
// //   const [selectedColor, setSelectedColor] = useState('Black');
// //   const [reviewText, setReviewText] = useState('');
// //   const [userName, setUserName] = useState('');
// //   const [rating, setRating] = useState(0);

// //   const [reviews, setReviews] = useState([
// //     { id: 1, rating: 4, comment: 'Great quality, very stylish!' },
// //     { id: 2, rating: 5, comment: 'Love it! Matches everything I wear.' },
// //     { id: 3, rating: 3, comment: 'It’s nice, but the strap is a bit stiff.' },
// //   ]);

// //   const product = {
// //     id: 1,
// //     title: 'Elegant Minimalist Watch',
// //     description:
// //       'A sleek and sophisticated watch with a minimalist design, perfect for any occasion.',
// //     sku: 'WCH12345',
// //     price: 129.99,
// //     sizes: ['S', 'M', 'L', 'XL'],
// //     colors: ['Black', 'Silver', 'Gold'],
// //     imageUrls: [
// //       '/images/me.jpeg',
// //       '/images/me.jpeg',
// //       '/images/me.jpeg',
// //     ],
// //   };

// //   const handleSizeChange = (size) => {
// //     setSelectedSize(size);
// //   };

// //   const handleColorChange = (color) => {
// //     setSelectedColor(color);
// //   };

// //   const handleAddToCart = () => {
// //     alert('Product added to cart');
// //   };

// //   const handleSubmitReview = (e) => {
// //     e.preventDefault();
// //     if (userName && reviewText && rating > 0) {
// //       setReviews([
// //         ...reviews,
// //         { id: reviews.length + 1, rating: rating, comment: reviewText },
// //       ]);
// //       setReviewText('');
// //       setUserName('');
// //       setRating(0);
// //       alert('Review submitted successfully!');
// //     } else {
// //       alert('Please fill in all fields!');
// //     }
// //   };

// //   return (
// //     <div className="container mx-auto mt-16">
// //       <div className="flex flex-col lg:flex-row">
// //         {/* Product Images */}
// //         <div className="flex-1 flex justify-center">
// //         <div className="w-full max-w-md">
// //   {product.imageUrls.map((img, index) => (
// //     <img
// //       key={index}
// //       src={img}
// //       alt={product.title}
// //       className="object-cover w-full h-64 rounded-lg" // Adjust the height here
// //     />
// //   ))}
// // </div>
// //         </div>

// //         {/* Product Details */}
// //         <div className="flex-1 mt-8 lg:mt-0 lg:pl-12">
// //           <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
// //           <p className="mt-2 text-gray-600">{product.description}</p>

// //           {/* SKU */}
// //           <p className="mt-2 text-gray-500">SKU: {product.sku}</p>

// //           {/* Price */}
// //           <p className="mt-2 text-xl font-semibold text-[#603F26]">${product.price.toFixed(2)}</p>

// //           {/* Size Selector */}
// //           <div className="mt-4">
// //             <h3 className="font-semibold text-gray-700">Select Size</h3>
// //             <div className="flex space-x-4 mt-2">
// //               {product.sizes.map((size) => (
// //                 <button
// //                   key={size}
// //                   onClick={() => handleSizeChange(size)}
// //                   className={`px-4 py-2 border rounded-full ${
// //                     selectedSize === size ? 'bg-[#603F26] text-white' : 'bg-white text-gray-700'
// //                   }`}
// //                 >
// //                   {size}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Color Selector */}
// //           <div className="mt-4">
// //             <h3 className="font-semibold text-gray-700">Select Color</h3>
// //             <div className="flex space-x-4 mt-2">
// //               {product.colors.map((color) => (
// //                 <button
// //                   key={color}
// //                   onClick={() => handleColorChange(color)}
// //                   className={`w-8 h-8 rounded-full border-2 ${
// //                     selectedColor === color ? 'border-[#603F26]' : 'border-gray-300'
// //                   }`}
// //                   style={{ backgroundColor: color.toLowerCase() }}
// //                 />
// //               ))}
// //             </div>
// //           </div>

// //           {/* Reviews */}
// //           <div className="mt-6">
// //             <h3 className="font-semibold text-gray-700">Reviews</h3>
// //             <div className="mt-4 space-y-4">
// //               {reviews.map((review) => (
// //                 <div key={review.id} className="bg-gray-100 p-4 rounded-lg">
// //                   <p className="text-gray-700">{review.comment}</p>
// //                   <div className="flex items-center mt-2">
// //                     <span className="text-yellow-500">{"★".repeat(review.rating)}</span>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Write a Review */}
// //           <div className="mt-8">
// //             <h3 className="font-semibold text-gray-700">Write a Review</h3>
// //             <form onSubmit={handleSubmitReview} className="space-y-4 mt-4">
// //               <div>
// //                 <label className="block text-gray-700">Your Name</label>
// //                 <input
// //                   type="text"
// //                   value={userName}
// //                   onChange={(e) => setUserName(e.target.value)}
// //                   className="w-full p-2 border rounded-lg mt-2"
// //                   placeholder="Enter your name"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-gray-700">Rating</label>
// //                 <div className="flex space-x-2 mt-2">
// //                   {[1, 2, 3, 4, 5].map((star) => (
// //                     <button
// //                       key={star}
// //                       type="button"
// //                       onClick={() => setRating(star)}
// //                       className={`w-8 h-8 rounded-full border-2 ${
// //                         rating >= star ? 'bg-yellow-500' : 'bg-gray-200'
// //                       }`}
// //                     >
// //                       ★
// //                     </button>
// //                   ))}
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className="block text-gray-700">Review</label>
// //                 <textarea
// //                   value={reviewText}
// //                   onChange={(e) => setReviewText(e.target.value)}
// //                   className="w-full p-2 border rounded-lg mt-2"
// //                   rows="4"
// //                   placeholder="Write your review here"
// //                 />
// //               </div>

// //               <button
// //                 type="submit"
// //                 className="bg-[#603F26] text-white py-2 px-6 rounded-lg shadow-lg hover:bg-opacity-90"
// //               >
// //                 Submit Review
// //               </button>
// //             </form>
// //           </div>

// //           {/* Add to Cart Button */}
// //           <div className="mt-8">
// //             <button
// //               onClick={handleAddToCart}
// //               className="bg-[#603F26] text-white py-2 px-6 rounded-lg shadow-lg hover:bg-opacity-90"
// //             >
// //               Add to Cart
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductDetails;
