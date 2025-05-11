import React from "react";
import { Link } from "react-router-dom";
import { Chip } from "@mui/material";

const RecommendedProducts = () => {
  // Dummy recommended products data
  const recommendedProducts = [
    {
      _id: "1",
      title: "Premium Denim Jacket",
      imagePath: ["https://via.placeholder.com/300"],
      price: 5999,
    },
    {
      _id: "2",
      title: "Classic Leather Loafers",
      imagePath: ["https://via.placeholder.com/300"],
      price: 7999,
    },
    {
      _id: "3",
      title: "Modern Coffee Table",
      imagePath: ["https://via.placeholder.com/300"],
      price: 12999,
    },
    {
      _id: "4",
      title: "Ceramic Vase Set",
      imagePath: ["https://via.placeholder.com/300"],
      price: 4599,
    },
    {
      _id: "5",
      title: "Wool Blend Sweater",
      imagePath: ["https://via.placeholder.com/300"],
      price: 3499,
    },
    {
      _id: "6",
      title: "Handcrafted Wooden Shelf",
      imagePath: ["https://via.placeholder.com/300"],
      price: 8999,
    },
    {
      _id: "7",
      title: "Silk Scarf Collection",
      imagePath: ["https://via.placeholder.com/300"],
      price: 2499,
    },
    {
      _id: "8",
      title: "Minimalist Wall Art",
      imagePath: ["https://via.placeholder.com/300"],
      price: 3299,
    },
  ];

  return (
    <div className="mt-16 px-10 pb-16">
      <h1 className="text-center font-bold text-3xl my-10">RECOMMENDED FOR YOU</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {recommendedProducts.map((product) => (
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
    </div>
  );
};

export default RecommendedProducts;