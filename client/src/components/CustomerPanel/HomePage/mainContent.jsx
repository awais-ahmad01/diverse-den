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

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/customer/getProductsByCategory', {
          params: {
            category: categorySlug
          }
        });
        setProducts(response.data.products);
        setLoading(false);
      } catch (err) {
        console.log(err?.response?.data?.message)
        setError(err);
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [categorySlug]); 

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center my-10 text-red-500">
        <p>Error loading products: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6">
      <h1 className="text-center font-bold text-2xl sm:text-3xl my-8 sm:my-10">{title}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 mx-auto">
        {products && products.length > 0 &&
          products.slice(0,8).map((product) => (
            <div key={product._id} className="px-2"> {/* Equal padding on both sides */}
              <Link to={`/customer/productDetails/${product._id}`} className="block h-full">
                <div className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-[1.02] hover:shadow-lg h-full">
                  <div className="relative aspect-square bg-gray-100">
                    <img
                      src={product.imagePath[0]}
                      alt={product.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h2 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 h-[2.8em]">
                      {product.title}
                    </h2>
                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                      <Chip 
                        label={`Rs ${product.price.toFixed(2)}`}
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          backgroundColor: "#603F26",
                          color: "white",
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
      <div className="text-center mb-8 sm:mb-10">
        <Link
          to={`/customer/${categorySlug}`}
          className="bg-[#603F26] text-white text-lg sm:text-xl px-6 py-2 sm:px-8 sm:py-3 rounded shadow hover:bg-opacity-90 transition-colors"
        >
          View All
        </Link>
      </div>
    </div>
  );
};

const MainContent = () => {
  return (
    <div className="mt-12 sm:mt-16 pb-12 sm:pb-16 space-y-12 sm:space-y-20">
      <Section title="CLOTHING" categorySlug='Clothing'/>
      <Section title="SHOES" categorySlug='Shoes'/>
      <Section title="FURNITURE" categorySlug='Furniture'/>
      <Section title="DECORATION" categorySlug='DecorationPieces'/>
    </div>
  );
};

export default MainContent;
