import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getSubCategoryProducts } from "../../../store/actions/products";
import { clearSubCategoryProducts } from "../../../store/reducers/products";
import { Chip } from "@mui/material";
import { Loader } from "../../../tools";

const SubCategory = () => {
  const dispatch = useDispatch();
  const { category, subcategory, productType } = useParams();
  const { subCategoryProducts, isloading } = useSelector((state) => state.products);

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


  if(isloading) return <div className="my-36"><Loader /></div>



  return (
    <div className="pt-5 px-4 sm:px-6 pb-12 sm:pb-16">
      <h1 className="text-center font-bold text-2xl sm:text-3xl my-8 sm:my-10">
        {productType ? productType.toUpperCase() : subcategory.toUpperCase()}
      </h1>

      {sortedProducts && sortedProducts.length > 0 ? (
        <>
          {/* Filters and product count */}
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <div className="w-full md:w-auto">
              <p className="text-gray-500 text-sm sm:text-base">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                {selectedBrand && ` for ${selectedBrand}`}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full md:w-auto">
              {/* Brand Filter */}
              <select
                className="border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:ring-2 focus:ring-[#603F26] focus:outline-none"
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
                className="border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:ring-2 focus:ring-[#603F26] focus:outline-none"
                value={filterOption}
                onChange={handleFilterChange}
              >
                <option value="bestMatch">Best Match</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6 sm:gap-6 mb-12 sm:mb-16 mx-auto">
            {sortedProducts.map((product) => (
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
            ))}
          </div>
        </>
      ) : (
        <div className="col-span-full text-center py-36 text-gray-500 text-sm sm:text-base">
          No related products found
        </div>
      )}
    </div>
  );
};

export default SubCategory;