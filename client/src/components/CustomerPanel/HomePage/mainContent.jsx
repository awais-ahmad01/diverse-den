import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Chip } from "@mui/material";
import axios from "axios"; 
import { Loader } from "../../../tools";

import { showToast } from "../../../tools";


const Section = ({ title, categorySlug }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('Prod:', products)

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);

        const response = await axios.get('http://localhost:3000/customer/getProductsByCategory',{
          params:{
            category:categorySlug
          }
        }

        );

        setProducts(response.data.products);
        
        setLoading(false);
      } catch (err) {
        console.log(err?.response?.data?.message)
        // showToast("ERROR", error?.response?.data?.message || "Failed to fetch products")
        setError(err);
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [categorySlug]); 

  if (loading) {
    return (
      // <div className="text-center my-10">
      //   <p>Loading products...</p>
      // </div>
      <Loader />
    );
  }

  if (error) {
    return (
      <div className="text-center my-10 text-red-500">
        <p>Error loading products: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center font-bold text-3xl my-10">{title}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {products && products.length > 0 &&
          products.slice(0,8).map((product) => (
          <Link to={`/customer/productDetails/${product._id}`} key={product._id}>
            <div
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <div className="relative h-80 bg-gray-100">
                <img
                  src={product.imagePath[0]}
                  alt={product.title}
                  className="object-cover w-full h-full"
                />
                
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {product.title}
                </h2>
                <div className="flex items-center justify-between mt-4">
                  <Chip 
                    label={`Rs ${product.price.toFixed(2)}`}
                    size="large"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#603F26",
                      color: "white",
                    }}
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center mb-10">
        <Link
           to={`/customer/${categorySlug}`}
          className="bg-[#603F26] text-white text-2xl px-8 py-3 rounded shadow hover:bg-opacity-90"
        >
          View All
        </Link>
      </div>
    </div>
  );
};
const MainContent = () => {

  return (
    <div className="mt-16 px-10 pb-16 space-y-20">
      <Section title="CLOTHING"  categorySlug='Clothing'/>
      <Section title="SHOES"  categorySlug='Shoes'/>
      <Section title="FURNITURE"  categorySlug='Furniture'/>
      <Section title="DECORATION"  categorySlug='DecorationPieces'/>
      {/* <Section title="TRENDING PRODUCTS" products={products} /> */}
    </div>
  );
};

export default MainContent;












































// import React from "react";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { getProducts } from "../../../store/actions/products";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";

// const products = [
//   {
//     id: 1,
//     title: "Elegant Minimalist Watch",
//     description: "Sleek design for modern professionals",
//     price: 129.99,
//     imageUrl: "https://via.placeholder.com/300x280?text=Watch",
//   },
//   {
//     id: 2,
//     title: "Leather Messenger Bag",
//     description: "Premium leather with smart compartments",
//     price: 249.99,
//     imageUrl: "https://via.placeholder.com/300x280?text=Bag",
//   },
//   {
//     id: 3,
//     title: "Wireless Noise Cancelling Headphones",
//     description: "Immersive sound, ultimate comfort",
//     price: 199.99,
//     imageUrl: "https://via.placeholder.com/300x280?text=Headphones",
//   },
//   {
//     id: 4,
//     title: "Wireless Noise Cancelling Headphones",
//     description: "Immersive sound, ultimate comfort",
//     price: 199.99,
//     imageUrl: "https://via.placeholder.com/300x280?text=Headphones",
//   },
//   {
//     id: 5,
//     title: "Wireless Noise Cancelling Headphones",
//     description: "Immersive sound, ultimate comfort",
//     price: 199.99,
//     imageUrl: "https://via.placeholder.com/300x280?text=Headphones",
//   },
//   {
//     id: 6,
//     title: "Wireless Noise Cancelling Headphones",
//     description: "Immersive sound, ultimate comfort",
//     price: 199.99,
//     imageUrl: "https://via.placeholder.com/300x280?text=Headphones",
//   },
// ];

// const MainContent = () => {
//   // const dispatch = useDispatch();

//   //   const { user } = useSelector((state) => state.auth);

//   //   const { products, meta, isloading } = useSelector((state) => state.products);

//   // useEffect(() => {
//   //   console.log("getting products.....");
//   //   const business = user?.business;
//   //   dispatch(getProducts({ business }));

//   // }, []);

//   return (
//     <div className="mt-16 px-8 pb-16">

//       <div className="pb-16">
//         <div>
//           <h1 className="text-center font-bold text-3xl my-10">
//             CLOTHING
//           </h1>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
//           {products.map((product) => (
//             <div
//               key={product.id}
//               className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
//             >
//               {/* Product Image */}
//               <div className="relative h-80 bg-gray-100">
//                 <img
//                   src={product.imageUrl}
//                   alt={product.title}
//                   className="object-cover w-full h-full"
//                 />
//               </div>

//               {/* Product Info */}
//               <div className="p-4">
//                 <h2 className="text-lg font-semibold text-gray-800 truncate">
//                   {product.title}
//                 </h2>
//                 <p className="text-sm text-gray-500 mt-1 truncate">
//                   {product.description}
//                 </p>
//                 <div className="flex items-center justify-between mt-4">
//                   <span className="text-lg font-bold text-[#603F26]">
//                     ${product.price.toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="text-center">
//           <Link
//             to="/furniture"
//             className="bg-[#603F26] text-white text-2xl px-8 py-3 rounded shadow hover:bg-opacity-90"
//           >
//             View All
//           </Link>
//         </div>
//       </div>

//       <div>
//         <div>
//           <h1 className="text-center font-bold text-3xl mb-10">
//             SHOES
//           </h1>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
//           {products.map((product) => (
//             <div
//               key={product.id}
//               className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
//             >
//               {/* Product Image */}
//               <div className="relative h-80 bg-gray-100">
//                 <img
//                   src={product.imageUrl}
//                   alt={product.title}
//                   className="object-cover w-full h-full"
//                 />
//               </div>

//               {/* Product Info */}
//               <div className="p-4">
//                 <h2 className="text-lg font-semibold text-gray-800 truncate">
//                   {product.title}
//                 </h2>
//                 <p className="text-sm text-gray-500 mt-1 truncate">
//                   {product.description}
//                 </p>
//                 <div className="flex items-center justify-between mt-4">
//                   <span className="text-lg font-bold text-[#603F26]">
//                     ${product.price.toFixed(2)}
//                   </span>
//                   <button className="bg-[#603F26] text-white text-sm px-4 py-2 rounded shadow hover:bg-opacity-90">
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="text-center">
//           <Link
//             to="/furniture"
//             className="bg-[#603F26] text-white text-2xl px-8 py-3 rounded shadow hover:bg-opacity-90"
//           >
//             View All
//           </Link>
//         </div>
//       </div>

//       <div>
//         <div>
//           <h1 className="text-center font-bold text-3xl my-5">
//             FURNITURE
//           </h1>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
//           {products.map((product) => (
//             <div
//               key={product.id}
//               className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
//             >
//               {/* Product Image */}
//               <div className="relative h-80 bg-gray-100">
//                 <img
//                   src={product.imageUrl}
//                   alt={product.title}
//                   className="object-cover w-full h-full"
//                 />
//               </div>

//               {/* Product Info */}
//               <div className="p-4">
//                 <h2 className="text-lg font-semibold text-gray-800 truncate">
//                   {product.title}
//                 </h2>
//                 <p className="text-sm text-gray-500 mt-1 truncate">
//                   {product.description}
//                 </p>
//                 <div className="flex items-center justify-between mt-4">
//                   <span className="text-lg font-bold text-[#603F26]">
//                     ${product.price.toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="text-center">
//           <Link
//             to="/furniture"
//             className="bg-[#603F26] text-white text-2xl px-8 py-3 rounded shadow hover:bg-opacity-90"
//           >
//             View All
//           </Link>
//         </div>
//       </div>

//       <div>
//         <div>
//           <h1 className="text-center font-bold text-3xl my-5">
//             DESCORATION
//           </h1>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
//           {products.map((product) => (
//             <div
//               key={product.id}
//               className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
//             >
//               {/* Product Image */}
//               <div className="relative h-80 bg-gray-100">
//                 <img
//                   src={product.imageUrl}
//                   alt={product.title}
//                   className="object-cover w-full h-full"
//                 />
//               </div>

//               {/* Product Info */}
//               <div className="p-4">
//                 <h2 className="text-lg font-semibold text-gray-800 truncate">
//                   {product.title}
//                 </h2>
//                 <p className="text-sm text-gray-500 mt-1 truncate">
//                   {product.description}
//                 </p>
//                 <div className="flex items-center justify-between mt-4">
//                   <span className="text-lg font-bold text-[#603F26]">
//                     ${product.price.toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div>
//         <div>
//           <h1 className="text-center font-bold text-3xl my-5">
//             Trending Products
//           </h1>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
//           {products.map((product) => (
//             <div
//               key={product.id}
//               className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
//             >
//               {/* Product Image */}
//               <div className="relative h-80 bg-gray-100">
//                 <img
//                   src={product.imageUrl}
//                   alt={product.title}
//                   className="object-cover w-full h-full"
//                 />
//               </div>

//               {/* Product Info */}
//               <div className="p-4">
//                 <h2 className="text-lg font-semibold text-gray-800 truncate">
//                   {product.title}
//                 </h2>
//                 <p className="text-sm text-gray-500 mt-1 truncate">
//                   {product.description}
//                 </p>
//                 <div className="flex items-center justify-between mt-4">
//                   <span className="text-lg font-bold text-[#603F26]">
//                     ${product.price.toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainContent;
