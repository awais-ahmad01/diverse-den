import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Loader } from "../../../tools";
import { Chip } from "@mui/material";

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get('http://localhost:3000/customer/getProductsByCategory', {
          params: {
            category: slug
          }
        });
        
        const receivedProducts = response.data.products;
        const uniqueBrands = [...new Set(receivedProducts.map(product => product.brand))];
        
        setProducts(receivedProducts);
        setFilteredProducts(receivedProducts);
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
    <div className="pt-5 px-4 sm:px-6 pb-12 sm:pb-16">
      <h1 className="text-center font-bold text-2xl sm:text-3xl my-8 sm:my-10">
        {slug.toUpperCase()}
      </h1>
      
      {/* Filter and Product Count Row */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="w-full md:w-auto">
          <p className="text-gray-500 text-sm sm:text-base">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            {selectedBrand && ` for ${selectedBrand}`}
          </p>
        </div>
        
        <div className="w-full md:w-auto">
          <select
            id="brandSelect"
            value={selectedBrand}
            onChange={handleBrandChange}
            className="border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:ring-2 focus:ring-[#603F26] focus:outline-none w-full md:w-auto"
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6 sm:gap-6 mb-12 sm:mb-16 mx-auto">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="px-1 sm:px-2">
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
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500 text-sm sm:text-base">
            No products found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;