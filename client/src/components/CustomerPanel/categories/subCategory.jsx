


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getSubCategoryProducts } from "../../../store/actions/products";
import { clearSubCategoryProducts } from "../../../store/reducers/products";

const SubCategory = () => {
  const dispatch = useDispatch();
  const { category, subcategory, productType } = useParams();
  const { subCategoryProducts } = useSelector((state) => state.products);

  const [filterOption, setFilterOption] = useState("bestMatch");
  const [sortedProducts, setSortedProducts] = useState(null);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);


  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
    applyFilters(e.target.value, selectedBrand);
  };


  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    applyFilters(filterOption, e.target.value);
  };

  
  const applyFilters = (priceFilter, brandFilter) => {
    let filtered = [...subCategoryProducts];
    
   
    if (brandFilter) {
      filtered = filtered.filter(product => product.brand === brandFilter);
    }
    
   
    if (priceFilter === 'bestMatch') {
     
      filtered = filtered.sort(() => Math.random() - 0.5);
    } else if (priceFilter === 'lowToHigh') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (priceFilter === 'highToLow') {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }
    
    setSortedProducts(filtered);
    setFilteredProducts(filtered);
  };

  
  useEffect(() => {
    dispatch(clearSubCategoryProducts());
    dispatch(getSubCategoryProducts({ subcategory, productType }));
  }, [category, subcategory, productType, dispatch]);

  
  useEffect(() => {
    if (subCategoryProducts && subCategoryProducts.length > 0) {
     
      const uniqueBrands = [...new Set(subCategoryProducts.map(product => product.brand))];
      setBrands(uniqueBrands);
      
    
      setSelectedBrand("");
      
     
      const shuffledProducts = [...subCategoryProducts].sort(() => Math.random() - 0.5);
      setSortedProducts(shuffledProducts);
      setFilteredProducts(shuffledProducts);
    } else {
      setSortedProducts([]);
      setFilteredProducts([]);
    }
  }, [subCategoryProducts]);

  return (
    <div>
      <div className="pt-5 px-10 pb-16">
        <h1 className="text-center font-bold text-3xl my-2 md:my-6">
          {productType ? productType.toUpperCase() : subcategory.toUpperCase()}
        </h1>

        {sortedProducts && sortedProducts.length > 0 ? (
          <>
            {/* Product count display */}
            <div className="flex flex-wrap items-center justify-between mb-4">
              <div className="w-full md:w-auto mb-4 md:mb-0">
                <p className="text-gray-500">
                  Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                  {selectedBrand && ` for ${selectedBrand}`}
                </p>
              </div>
              
              {/* Filters container */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Brand Filter */}
                <select
                  className="bg-white border border-gray-300 rounded-lg py-2 px-4"
                  value={selectedBrand}
                  onChange={handleBrandChange}
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
                
                {/* Price Filter */}
                <select
                  className="bg-white border border-gray-300 rounded-lg py-2 px-4"
                  value={filterOption}
                  onChange={handleFilterChange}
                >
                  <option value="bestMatch">Best Match</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                </select>
              </div>
            </div>
          </>
        ) : null}

        {sortedProducts && sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {sortedProducts.map((product) => (
              <Link to={`/customer/productDetails/${product._id}`} key={product._id}>
                <div
                  className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
                >
                  <div className="relative h-80 bg-gray-100">
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
                        Rs {product?.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="h-screen">
            <h1 className="text-center font-semibold text-2xl text-gray-500">
              {" "}
              No related products found
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubCategory;