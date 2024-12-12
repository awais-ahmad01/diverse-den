import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Rating, 
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  AddShoppingCart, 
  Add, 
  Remove 
} from '@mui/icons-material';

const ProductDetails = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState({
    size: null,
    color: null,
    material: null
  });
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState('reviews');

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${productId}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product details');
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      await axios.post('/api/cart', {
        productId: product.id,
        quantity: quantity,
        variant: selectedVariant
      });
      setSubmitSuccess(true);
    } catch (err) {
      setError('Failed to add to cart');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center text-red-500 p-8">
        {error || 'Product not found'}
      </div>
    );
  }

  const renderVariants = () => {
    const variantType = getVariantType();
    
    if (!variantType) return null;

    return (
      <div className="mb-4">
        <span className="block mb-2 font-semibold">
          {variantType.type.charAt(0).toUpperCase() + variantType.type.slice(1)}:
        </span>
        <div className="flex space-x-2">
          {variantType.options.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedVariant(prev => ({
                ...prev,
                [variantType.type]: option
              }))}
              className={`px-4 py-2 border rounded ${
                selectedVariant[variantType.type] === option 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const getVariantType = () => {
    switch(product.category) {
      case 'Clothing':
        return { type: 'size', options: product.sizes };
      case 'Shoes':
        return { type: 'size', options: product.sizes };
      case 'Furniture':
        return { type: 'material', options: product.materials };
      case 'Decoration':
        return { type: 'material', options: product.materials };
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="mb-4">
            <img
              src={product.imagePath[0]}
              alt={product.title}
              className="w-full h-[500px] object-cover rounded-lg"
            />
          </div>
          <div className="flex justify-center space-x-2">
            {product.imagePath.map((image, index) => (
              <button 
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`p-1 rounded-lg ${
                  selectedImage === index 
                    ? 'border-2 border-primary' 
                    : 'border-2 border-transparent'
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

        {/* Product Information */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <div className="flex items-center mb-4">
            <span className="text-sm text-gray-600 mr-4">SKU: {product.sku}</span>
            <div className="flex items-center">
              <Rating 
                value={calculateAverageRating(product.reviews)}
                precision={0.1}
                readOnly
              />
              <span className="ml-2 text-sm">
                ({product.reviews ? product.reviews.length : 0} reviews)
              </span>
            </div>
          </div>
          <p className="text-2xl text-primary font-semibold mb-4">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-700 mb-4">{product.description}</p>

          {renderVariants()}

          {product.colors && (
            <div className="flex items-center space-x-2 mb-4">
              <span className="font-semibold">Color:</span>
              {product.colors.map((colorInfo) => (
                <button
                  key={colorInfo.id}
                  onClick={() => setSelectedVariant(prev => ({
                    ...prev,
                    color: colorInfo.name
                  }))}
                  className={`flex items-center space-x-2 px-3 py-1 rounded ${
                    selectedVariant.color === colorInfo.name 
                      ? 'ring-2 ring-primary bg-gray-100' 
                      : 'ring-1 ring-gray-300'
                  }`}
                >
                  <div 
                    className="w-6 h-6 rounded-full mr-2" 
                    style={{ backgroundColor: colorInfo.hex }}
                  />
                  {colorInfo.name}
                </button>
              ))}
            </div>
          )}

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
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded ${
                !getVariantType() || !selectedVariant[getVariantType()?.type]
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
              disabled={!getVariantType() || !selectedVariant[getVariantType()?.type]}
            >
              <AddShoppingCart className="mr-2" /> Add to Cart
            </button>
          </div>

          {/* Reviews Section */}
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

            {tabValue === 'reviews' && (
              <div className="p-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review, index) => (
                    <div key={index} className="border-b pb-4 mb-4">
                      <Rating 
                        value={review.rating} 
                        readOnly 
                      />
                      <p className="mt-2">{review.comment}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {review.author} - {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No reviews yet</p>
                )}
              </div>
            )}

            {tabValue === 'write-review' && (
              <form onSubmit={handleReviewSubmit} className="p-4 space-y-4">
                <div>
                  <span className="block mb-2">Your Rating</span>
                  <Rating
                    value={newReview.rating}
                    onChange={(event, newValue) => {
                      setNewReview(prev => ({ ...prev, rating: newValue }));
                    }}
                  />
                </div>
                <textarea
                  className="w-full border rounded p-2"
                  rows={4}
                  placeholder="Write your review here..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  required
                />
                <button 
                  type="submit" 
                  className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Success and Error Handling */}
      <Snackbar 
        open={submitSuccess} 
        autoHideDuration={6000} 
        onClose={() => setSubmitSuccess(false)}
      >
        <Alert 
          onClose={() => setSubmitSuccess(false)} 
          severity="success"
        >
          Product added to cart successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

// Helper function to calculate average rating
const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return totalRating / reviews.length;
};

export default ProductDetails;



















































// import React, { useState } from 'react';
// import { 
//   Rating, 
//   Select, 
//   MenuItem, 
//   FormControl, 
//   InputLabel,
//   Tabs,
//   Tab
// } from '@mui/material';
// import { 
//   AddShoppingCart, 
//   Add, 
//   Remove 
// } from '@mui/icons-material';

// const ProductDetails = () => {


//   const product = {
//     id: 'prod-001',
//     title: 'Classic Leather Jacket',
//     sku: 'LJ-001-BLK',
//     price: 249.99,
//     description: 'Timeless leather jacket crafted from premium genuine leather. Perfect for any occasion.',
//     images: [
//       '/images/me.jpeg',
//       '/images/me.jpeg',
//       '/images/me.jpeg'
//     ],
//     sizes: ['XS', 'S', 'M', 'L', 'XL'],
//     colors: ['#000000', '#8B4513', '#A52A2A'],
//     reviews: [
//       {
//         rating: 5,
//         comment: 'Amazing quality! Fits perfectly.',
//         author: 'John D.',
//         date: '2024-01-15'
//       },
//       {
//         rating: 4,
//         comment: 'Great jacket, slightly tight in shoulders.',
//         author: 'Sarah M.',
//         date: '2024-02-20'
//       }
//     ]
//   };



//   const [selectedImage, setSelectedImage] = useState(0);
//   const [selectedSize, setSelectedSize] = useState('');
//   const [selectedColor, setSelectedColor] = useState('');
//   const [quantity, setQuantity] = useState(1);
//   const [tabValue, setTabValue] = useState('reviews');
//   const [newReview, setNewReview] = useState({
//     rating: 5,
//     comment: ''
//   });

//   // Calculate average rating
//   const calculateAverageRating = () => {
//     if (!product.reviews || product.reviews.length === 0) return 0;
//     const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
//     return totalRating / product.reviews.length;
//   };

//   const handleReviewSubmit = (e) => {
//     e.preventDefault();
//     // TODO: Implement actual review submission logic
//     console.log('Submitting review:', newReview);
//     // Reset form or show confirmation
//     setNewReview({ rating: 5, comment: '' });
//   };

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid md:grid-cols-2 gap-8">
//         {/* Image Gallery */}
//         <div>
//           <div className="mb-4">
//             <img
//               src={product.images[selectedImage]}
//               alt={product.title}
//               className="w-full h-[500px] object-cover rounded-lg"
//             />
//           </div>
          
//           {/* Thumbnail Images */}
//           <div className="flex justify-center space-x-2">
//             {product.images.map((image, index) => (
//               <button 
//                 key={index}
//                 onClick={() => setSelectedImage(index)}
//                 className={`p-1 rounded-lg ${
//                   selectedImage === index 
//                     ? 'border-2 border-primary' 
//                     : 'border-2 border-transparent'
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

//           {/* Product Details */}
//           <div className="flex items-center mb-4">
//             <span className="text-sm text-gray-600 mr-4">SKU: {product.sku}</span>
//             <div className="flex items-center">
//               <Rating 
//                 value={calculateAverageRating()}
//                 precision={0.1}
//                 readOnly
//               />
//               <span className="ml-2 text-sm">
//                 ({product.reviews ? product.reviews.length : 0} reviews)
//               </span>
//             </div>
//           </div>

//           {/* Price */}
//           <p className="text-2xl text-primary font-semibold mb-4">
//             ${product.price.toFixed(2)}
//           </p>

//           {/* Description */}
//           <p className="text-gray-700 mb-4">{product.description}</p>

//           {/* Size Selection */}
//           {product.sizes && (
//             <div className="mb-4">
//               <FormControl fullWidth variant="outlined" size="small">
//                 <InputLabel>Size</InputLabel>
//                 <Select
//                   value={selectedSize}
//                   label="Size"
//                   onChange={(e) => setSelectedSize(e.target.value)}
//                 >
//                   {product.sizes.map((size) => (
//                     <MenuItem key={size} value={size}>
//                       {size}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </div>
//           )}

//           {/* Color Selection */}
//           {product.colors && (
//             <div className="flex items-center space-x-2 mb-4">
//               <span>Color:</span>
//               {product.colors.map((color) => (
//                 <button
//                   key={color}
//                   onClick={() => setSelectedColor(color)}
//                   className={`w-10 h-10 rounded-full ${
//                     selectedColor === color 
//                       ? 'ring-2 ring-primary' 
//                       : 'ring-1 ring-gray-300'
//                   }`}
//                   style={{ backgroundColor: color }}
//                 />
//               ))}
//             </div>
//           )}

//           {/* Quantity and Add to Cart */}
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
//               className={`flex-1 flex items-center justify-center py-2 px-4 rounded ${
//                 product.sizes && !selectedSize
//                   ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                   : 'bg-primary text-white hover:bg-primary-dark'
//               }`}
//               disabled={product.sizes && !selectedSize}
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

//             {tabValue === 'reviews' && (
//               <div className="p-4">
//                 {product.reviews && product.reviews.length > 0 ? (
//                   product.reviews.map((review, index) => (
//                     <div key={index} className="border-b pb-4 mb-4">
//                       <Rating 
//                         value={review.rating} 
//                         readOnly 
//                       />
//                       <p className="mt-2">{review.comment}</p>
//                       <p className="text-sm text-gray-500 mt-1">
//                         {review.author} - {new Date(review.date).toLocaleDateString()}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-center text-gray-500">No reviews yet</p>
//                 )}
//               </div>
//             )}

//             {tabValue === 'write-review' && (
//               <form onSubmit={handleReviewSubmit} className="p-4 space-y-4">
//                 <div>
//                   <span className="block mb-2">Your Rating</span>
//                   <Rating
//                     value={newReview.rating}
//                     onChange={(event, newValue) => {
//                       setNewReview(prev => ({ ...prev, rating: newValue }));
//                     }}
//                   />
//                 </div>
//                 <textarea
//                   className="w-full border rounded p-2"
//                   rows={4}
//                   placeholder="Write your review here..."
//                   value={newReview.comment}
//                   onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
//                   required
//                 />
//                 <button 
//                   type="submit" 
//                   className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark"
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



// export default ProductDetails;













// import React, { useState } from 'react';

// const ProductDetails = () => {
//   const [selectedSize, setSelectedSize] = useState('M');
//   const [selectedColor, setSelectedColor] = useState('Black');
//   const [reviewText, setReviewText] = useState('');
//   const [userName, setUserName] = useState('');
//   const [rating, setRating] = useState(0);

//   const [reviews, setReviews] = useState([
//     { id: 1, rating: 4, comment: 'Great quality, very stylish!' },
//     { id: 2, rating: 5, comment: 'Love it! Matches everything I wear.' },
//     { id: 3, rating: 3, comment: 'It’s nice, but the strap is a bit stiff.' },
//   ]);

//   const product = {
//     id: 1,
//     title: 'Elegant Minimalist Watch',
//     description:
//       'A sleek and sophisticated watch with a minimalist design, perfect for any occasion.',
//     sku: 'WCH12345',
//     price: 129.99,
//     sizes: ['S', 'M', 'L', 'XL'],
//     colors: ['Black', 'Silver', 'Gold'],
//     imageUrls: [
//       '/images/me.jpeg',
//       '/images/me.jpeg',
//       '/images/me.jpeg',
//     ],
//   };

//   const handleSizeChange = (size) => {
//     setSelectedSize(size);
//   };

//   const handleColorChange = (color) => {
//     setSelectedColor(color);
//   };

//   const handleAddToCart = () => {
//     alert('Product added to cart');
//   };

//   const handleSubmitReview = (e) => {
//     e.preventDefault();
//     if (userName && reviewText && rating > 0) {
//       setReviews([
//         ...reviews,
//         { id: reviews.length + 1, rating: rating, comment: reviewText },
//       ]);
//       setReviewText('');
//       setUserName('');
//       setRating(0);
//       alert('Review submitted successfully!');
//     } else {
//       alert('Please fill in all fields!');
//     }
//   };

//   return (
//     <div className="container mx-auto mt-16">
//       <div className="flex flex-col lg:flex-row">
//         {/* Product Images */}
//         <div className="flex-1 flex justify-center">
//         <div className="w-full max-w-md">
//   {product.imageUrls.map((img, index) => (
//     <img
//       key={index}
//       src={img}
//       alt={product.title}
//       className="object-cover w-full h-64 rounded-lg" // Adjust the height here
//     />
//   ))}
// </div>
//         </div>

//         {/* Product Details */}
//         <div className="flex-1 mt-8 lg:mt-0 lg:pl-12">
//           <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
//           <p className="mt-2 text-gray-600">{product.description}</p>

//           {/* SKU */}
//           <p className="mt-2 text-gray-500">SKU: {product.sku}</p>

//           {/* Price */}
//           <p className="mt-2 text-xl font-semibold text-[#603F26]">${product.price.toFixed(2)}</p>

//           {/* Size Selector */}
//           <div className="mt-4">
//             <h3 className="font-semibold text-gray-700">Select Size</h3>
//             <div className="flex space-x-4 mt-2">
//               {product.sizes.map((size) => (
//                 <button
//                   key={size}
//                   onClick={() => handleSizeChange(size)}
//                   className={`px-4 py-2 border rounded-full ${
//                     selectedSize === size ? 'bg-[#603F26] text-white' : 'bg-white text-gray-700'
//                   }`}
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Color Selector */}
//           <div className="mt-4">
//             <h3 className="font-semibold text-gray-700">Select Color</h3>
//             <div className="flex space-x-4 mt-2">
//               {product.colors.map((color) => (
//                 <button
//                   key={color}
//                   onClick={() => handleColorChange(color)}
//                   className={`w-8 h-8 rounded-full border-2 ${
//                     selectedColor === color ? 'border-[#603F26]' : 'border-gray-300'
//                   }`}
//                   style={{ backgroundColor: color.toLowerCase() }}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Reviews */}
//           <div className="mt-6">
//             <h3 className="font-semibold text-gray-700">Reviews</h3>
//             <div className="mt-4 space-y-4">
//               {reviews.map((review) => (
//                 <div key={review.id} className="bg-gray-100 p-4 rounded-lg">
//                   <p className="text-gray-700">{review.comment}</p>
//                   <div className="flex items-center mt-2">
//                     <span className="text-yellow-500">{"★".repeat(review.rating)}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Write a Review */}
//           <div className="mt-8">
//             <h3 className="font-semibold text-gray-700">Write a Review</h3>
//             <form onSubmit={handleSubmitReview} className="space-y-4 mt-4">
//               <div>
//                 <label className="block text-gray-700">Your Name</label>
//                 <input
//                   type="text"
//                   value={userName}
//                   onChange={(e) => setUserName(e.target.value)}
//                   className="w-full p-2 border rounded-lg mt-2"
//                   placeholder="Enter your name"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700">Rating</label>
//                 <div className="flex space-x-2 mt-2">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <button
//                       key={star}
//                       type="button"
//                       onClick={() => setRating(star)}
//                       className={`w-8 h-8 rounded-full border-2 ${
//                         rating >= star ? 'bg-yellow-500' : 'bg-gray-200'
//                       }`}
//                     >
//                       ★
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-gray-700">Review</label>
//                 <textarea
//                   value={reviewText}
//                   onChange={(e) => setReviewText(e.target.value)}
//                   className="w-full p-2 border rounded-lg mt-2"
//                   rows="4"
//                   placeholder="Write your review here"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="bg-[#603F26] text-white py-2 px-6 rounded-lg shadow-lg hover:bg-opacity-90"
//               >
//                 Submit Review
//               </button>
//             </form>
//           </div>

//           {/* Add to Cart Button */}
//           <div className="mt-8">
//             <button
//               onClick={handleAddToCart}
//               className="bg-[#603F26] text-white py-2 px-6 rounded-lg shadow-lg hover:bg-opacity-90"
//             >
//               Add to Cart
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;
