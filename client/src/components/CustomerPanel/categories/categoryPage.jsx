// import React, { useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import { useEffect } from "react";
// import axios from "axios"; 
// import { Loader } from "../../../tools";

// const CategoryPage = () => {
//   const { slug } = useParams();
//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);


//   console.log("Product: ", products)

//   console.log("Category page:")



//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   useEffect(() => {
//     const fetchProductsByCategory = async () => {
//       try {
//         setLoading(true);

//         console.log("Re.......")
//         const response = await axios.get('http://localhost:3000/customer/getProductsByCategory',{
//           params:{
//             category:slug
//           }
//         }

//         );

//         setProducts(response.data.products);
        
//         setLoading(false);
//       } catch (err) {
//         console.log(err?.response?.data?.message)
//         // showToast("ERROR", error?.response?.data?.message || "Failed to fetch products")
//         setError(err?.response?.data?.message);
//         setLoading(false);
//       }
//     };

//     fetchProductsByCategory();
//   }, [slug]); 


  

// if(loading){
//   return <Loader/>
// }


//   return (
//     <div className="pt-5 px-10 pb-16">
//       <h1 className="text-center font-bold text-3xl my-10">{slug.toUpperCase()}</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
//         {products.map((product) => (
//           <Link to={`/customer/productDetails/${product._id}`} key={product._id}>
//             <div
//             key={product._id}
//             className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
//           >
//             <div className="relative h-80 bg-gray-100">
//               <img
//                 src={product.imagePath[0]}
//                 alt={product.title}
//                 className="object-cover w-full h-full"
//               />
//             </div>
//             <div className="p-4">
//               <h2 className="text-lg font-semibold text-gray-800 truncate">
//                 {product.title}
//               </h2>

//               <div className="flex items-center justify-between mt-4">
//                 <span className="text-lg font-bold text-[#603F26]">
//                   Rs {product.price.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };


// export default CategoryPage;






import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Loader } from "../../../tools";

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock product data
  const mockProducts = [
    {
      _id: "1",
      title: "Premium Coffee Beans",
      price: 1200,
      brand: "Coffee King",
      imagePath: ["/api/placeholder/400/320"],
      category: "coffee"
    },
    {
      _id: "2",
      title: "Espresso Machine",
      price: 15000,
      brand: "CoffeeTech",
      imagePath: ["/api/placeholder/400/320"],
      category: "Shoes"
    },
    {
      _id: "3",
      title: "Coffee Grinder",
      price: 3500,
      brand: "CoffeeTech",
      imagePath: ["/api/placeholder/400/320"],
      category: "coffee"
    },
    {
      _id: "4",
      title: "Arabica Coffee Beans",
      price: 950,
      brand: "Coffee King",
      imagePath: ["/api/placeholder/400/320"],
      category: "Shoes"
    },
    {
      _id: "4",
      title: "Arabica Coffee Beans",
      price: 950,
      brand: "Coffee King",
      imagePath: ["/api/placeholder/400/320"],
      category: "Shoes"
    },
    {
      _id: "4",
      title: "Arabica Coffee Beans",
      price: 950,
      brand: "Coffee King",
      imagePath: ["/api/placeholder/400/320"],
      category: "Shoes"
    },
    {
      _id: "4",
      title: "Arabica Coffee Beans",
      price: 950,
      brand: "Coffee King",
      imagePath: ["/api/placeholder/400/320"],
      category: "Shoes"
    },
    {
      _id: "5",
      title: "Coffee Mug Set",
      price: 800,
      brand: "HomeStyle",
      imagePath: ["/api/placeholder/400/320"],
      category: "coffee"
    },
    {
      _id: "6",
      title: "French Press",
      price: 1800,
      brand: "BrewMaster",
      imagePath: ["/api/placeholder/400/320"],
      category: "Shoes"
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        
        // When you have the API ready, uncomment this code
        /*
        const response = await axios.get('http://localhost:3000/customer/getProductsByCategory', {
          params: {
            category: slug
          }
        });
        setProducts(response.data.products);
        */
        
        // Using mock data for now
        // Filter mock products by category (slug)
        const categoryProducts = mockProducts.filter(
          product => product.category.toLowerCase() === slug.toLowerCase()
        );
        
        setProducts(categoryProducts);
        setFilteredProducts(categoryProducts);
        
        // Extract unique brands from products
        const uniqueBrands = [...new Set(categoryProducts.map(product => product.brand))];
        setBrands(uniqueBrands);
        
        setLoading(false);
      } catch (err) {
        console.log(err?.response?.data?.message);
        setError(err?.response?.data?.message);
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [slug]);

  // Filter products by selected brand
  useEffect(() => {
    if (selectedBrand === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.brand === selectedBrand);
      setFilteredProducts(filtered);
    }
  }, [selectedBrand, products]);

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="pt-5 px-4 md:px-10 pb-16">
      <h1 className="text-center font-bold text-3xl my-8">{slug.toUpperCase()}</h1>
      
      {/* Filter and Product Count Row */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <p className="text-gray-500">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            {selectedBrand && ` for ${selectedBrand}`}
          </p>
        </div>
        
        <div className="w-full md:w-auto flex items-center">
          {/* <label htmlFor="brandSelect" className="mr-3 font-medium text-gray-700">
            Brand:
          </label> */}
          <select
            id="brandSelect"
            value={selectedBrand}
            onChange={handleBrandChange}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#603F26] focus:outline-none w-full md:w-auto"
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Link to={`/customer/productDetails/${product._id}`} key={product._id}>
              <div
                className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
              >
                <div className="relative h-64 bg-gray-100">
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
                  <p className="text-sm text-gray-500 mt-1">
                    {product.brand}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-[#603F26]">
                      Rs {product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No products found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;






// import React, { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import { Loader } from "../../../tools";

// const CategoryPage = () => {
//   const { slug } = useParams();
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [selectedBrand, setSelectedBrand] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   useEffect(() => {
//     const fetchProductsByCategory = async () => {
//       try {
//         setLoading(true);
        
//         const response = await axios.get('http://localhost:3000/customer/getProductsByCategory', {
//           params: {
//             category: slug
//           }
//         });
        
//         const categoryProducts = response.data.products;
//         setProducts(categoryProducts);
//         setFilteredProducts(categoryProducts);
        
//         // Extract unique brands from products
//         const uniqueBrands = [...new Set(categoryProducts.map(product => product.brand))];
//         setBrands(uniqueBrands);
        
//         setLoading(false);
//       } catch (err) {
//         console.log(err?.response?.data?.message);
//         setError(err?.response?.data?.message);
//         setLoading(false);
//       }
//     };

//     fetchProductsByCategory();
//   }, [slug]);

//   // Filter products by selected brand
//   useEffect(() => {
//     if (selectedBrand === "") {
//       setFilteredProducts(products);
//     } else {
//       const filtered = products.filter(product => product.brand === selectedBrand);
//       setFilteredProducts(filtered);
//     }
//   }, [selectedBrand, products]);

//   const handleBrandChange = (e) => {
//     setSelectedBrand(e.target.value);
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <div className="pt-5 px-4 md:px-10 pb-16">
//       <h1 className="text-center font-bold text-3xl my-8">{slug.toUpperCase()}</h1>
      
//       {/* Filter and Product Count Row */}
//       <div className="flex flex-wrap items-center justify-between mb-6">
//         <div className="w-full md:w-auto mb-4 md:mb-0">
//           <p className="text-gray-500">
//             Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
//             {selectedBrand && ` for ${selectedBrand}`}
//           </p>
//         </div>
        
//         <div className="w-full md:w-auto flex items-center">
//           <label htmlFor="brandSelect" className="mr-3 font-medium text-gray-700">
//             Brand:
//           </label>
//           <select
//             id="brandSelect"
//             value={selectedBrand}
//             onChange={handleBrandChange}
//             className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#603F26] focus:outline-none w-full md:w-auto"
//           >
//             <option value="">All Brands</option>
//             {brands.map(brand => (
//               <option key={brand} value={brand}>
//                 {brand}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
      
//       {/* Product Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
//         {filteredProducts.length > 0 ? (
//           filteredProducts.map((product) => (
//             <Link to={`/customer/productDetails/${product._id}`} key={product._id}>
//               <div
//                 className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
//               >
//                 <div className="relative h-64 bg-gray-100">
//                   <img
//                     src={product.imagePath[0]}
//                     alt={product.title}
//                     className="object-cover w-full h-full"
//                   />
//                 </div>
//                 <div className="p-4">
//                   <h2 className="text-lg font-semibold text-gray-800 truncate">
//                     {product.title}
//                   </h2>
//                   <p className="text-sm text-gray-500 mt-1">
//                     {product.brand}
//                   </p>
//                   <div className="flex items-center justify-between mt-4">
//                     <span className="text-lg font-bold text-[#603F26]">
//                       Rs {product.price.toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           ))
//         ) : (
//           <div className="col-span-full text-center py-12 text-gray-500">
//             No products found for the selected filters.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CategoryPage;