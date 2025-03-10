import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Chip } from "@mui/material";

const SearchedProduct = () => {
  const navigate = useNavigate();

  const { searchedProducts } = useSelector((state) => state.products);

  console.log("sea:", searchedProducts);

  useEffect(() => {
    if (searchedProducts.length === 0) {
      navigate("/");
    }
  }, []);

  return (
    <div className='mt-16 px-10 pb-8 space-y-20"'>
      <h1 className="text-center font-bold text-3xl py-10">
        Searched Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {searchedProducts && searchedProducts.length > 0 ? (
          searchedProducts.map((product) => (
            <Link to={`/customer/productDetails/${product._id}`} key={product._id}>
              <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
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
                      label={`$${product.price.toFixed(2)}`}
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
          ))
        ) : (
          <div className="h-screen">
            <h1 className="text-center font-semibold text-2xl text-gray-500">
              {" "}
              No searched product found
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchedProduct;
