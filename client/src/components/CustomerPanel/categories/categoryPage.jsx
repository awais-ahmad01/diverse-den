import React from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const products = [
  {
    id: 1,
    title: "Elegant Minimalist Watch",
    description: "Sleek design for modern professionals",
    price: 129.99,
    imageUrl: "https://via.placeholder.com/300x280?text=Watch",
  },
  {
    id: 2,
    title: "Leather Messenger Bag",
    description: "Premium leather with smart compartments",
    price: 249.99,
    imageUrl: "https://via.placeholder.com/300x280?text=Bag",
  },
  {
    id: 3,
    title: "Wireless Noise Cancelling Headphones",
    description: "Immersive sound, ultimate comfort",
    price: 199.99,
    imageUrl: "https://via.placeholder.com/300x280?text=Headphones",
  },
  {
    id: 4,
    title: "Premium Leather Wallet",
    description: "Compact and stylish leather wallet",
    price: 49.99,
    imageUrl: "https://via.placeholder.com/300x280?text=Wallet",
  },
  {
    id: 5,
    title: "Classic Sunglasses",
    description: "UV protection with timeless style",
    price: 89.99,
    imageUrl: "https://via.placeholder.com/300x280?text=Sunglasses",
  },
  {
    id: 6,
    title: "Smartphone Stand",
    description: "Adjustable stand for all devices",
    price: 19.99,
    imageUrl: "https://via.placeholder.com/300x280?text=Stand",
  },
  {
    id: 7,
    title: "Elegant Minimalist Watch",
    description: "Sleek design for modern professionals",
    price: 129.99,
    imageUrl: "https://via.placeholder.com/300x280?text=Watch",
  },
  {
    id: 8,
    title: "Leather Messenger Bag",
    description: "Premium leather with smart compartments",
    price: 249.99,
    imageUrl: "https://via.placeholder.com/300x280?text=Bag",
  },
  {
    id: 9,
    title: "Wireless Noise Cancelling Headphones",
    description: "Immersive sound, ultimate comfort",
    price: 199.99,
    imageUrl: "https://via.placeholder.com/300x280?text=Headphones",
  },
  {
    id: 10,
    title: "Premium Leather Wallet",
    description: "Compact and stylish leather wallet",
    price: 49.99,
    imageUrl: "https://via.placeholder.com/300x280?text=Wallet",
  },
  {
    id: 11,
    title: "Classic Sunglasses",
    description: "UV protection with timeless style",
    price: 89.99,
    imageUrl: "https://via.placeholder.com/300x280?text=Sunglasses",
  },
  {
    id: 12,
    title: "Smartphone Stand",
    description: "Adjustable stand for all devices",
    price: 19.99,
    imageUrl: "https://via.placeholder.com/300x280?text=Stand",
  },
];





const CategoryPage = () => {
  const { slug } = useParams();



  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-5 px-10 pb-16">
      <h1 className="text-center font-bold text-3xl my-10">{slug.toUpperCase()}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <div className="relative h-80 bg-gray-100">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {product.title}
              </h2>

              <div className="flex items-center justify-between mt-4">
                <span className="text-lg font-bold text-[#603F26]">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;