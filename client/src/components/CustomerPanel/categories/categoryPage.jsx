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
        
        // Extract unique brands from products immediately after receiving them
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
            <Link to={`/customer/productDetails/${product?._id}`} key={product?._id}>
              <div
                className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
              >
                <div className="relative h-64 bg-gray-100">
                  <img
                    src={product?.imagePath[0]}
                    alt={product?.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {product?.title}
                  </h2>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-[#603F26]">
                      Rs {product?.price?.toFixed(2)}
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