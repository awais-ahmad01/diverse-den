import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader } from "../../../tools";

const DealsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [loading, setLoading] = useState(true);

  
  // Mock deals products data
  const mockDealsProducts = [
    {
      _id: "1",
      title: "Premium Coffee Beans",
      price: 950, // Discounted price
      originalPrice: 1200,
      discountPercentage: 21,
      brand: "Coffee King",
      imagePath: ["/api/placeholder/400/320"],
      category: "coffee"
    },
    {
      _id: "2",
      title: "Espresso Machine",
      price: 12000, // Discounted price
      originalPrice: 15000,
      discountPercentage: 20,
      brand: "CoffeeTech",
      imagePath: ["/api/placeholder/400/320"],
      category: "coffee"
    },
    {
      _id: "3",
      title: "Coffee Grinder",
      price: 2800, // Discounted price
      originalPrice: 3500,
      discountPercentage: 20,
      brand: "CoffeeTech",
      imagePath: ["/api/placeholder/400/320"],
      category: "coffee"
    },
    {
      _id: "4",
      title: "Arabica Coffee Beans",
      price: 760, // Discounted price
      originalPrice: 950,
      discountPercentage: 20,
      brand: "Coffee King",
      imagePath: ["/api/placeholder/400/320"],
      category: "coffee"
    },
    {
      _id: "5",
      title: "Coffee Mug Set",
      price: 600, // Discounted price
      originalPrice: 800,
      discountPercentage: 25,
      brand: "HomeStyle",
      imagePath: ["/api/placeholder/400/320"],
      category: "coffee"
    },
    {
      _id: "6",
      title: "French Press",
      price: 1350, // Discounted price
      originalPrice: 1800,
      discountPercentage: 25,
      brand: "BrewMaster",
      imagePath: ["/api/placeholder/400/320"],
      category: "coffee"
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchDealsProducts = () => {
      try {
        setLoading(true);
        
        // Using mock data instead of API call
        const dealsProducts = mockDealsProducts;
        setProducts(dealsProducts);
        setFilteredProducts(dealsProducts);
        
        // Extract unique brands from products
        const uniqueBrands = [...new Set(dealsProducts.map(product => product.brand))];
        setBrands(uniqueBrands);
        
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchDealsProducts();
  }, []);

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
      <h1 className="text-center font-bold text-3xl my-8">SPECIAL DEALS</h1>
      
      {/* Filter and Product Count Row */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <p className="text-gray-500">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            {selectedBrand && ` for ${selectedBrand}`}
          </p>
        </div>
        
        <div className="w-full md:w-auto flex items-center">
          <label htmlFor="brandSelect" className="mr-3 font-medium text-gray-700">
            Brand:
          </label>
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
                {/* Discount badge */}
                <div className="relative h-64 bg-gray-100">
                  <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 font-semibold z-10 rounded-bl-lg">
                    {product.discountPercentage}% OFF
                  </div>
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
                    <div>
                      <span className="text-lg font-bold text-[#603F26]">
                        Rs {product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 line-through ml-2">
                        Rs {product.originalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No deals available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default DealsPage;