import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Mock gift card data
const MOCK_GIFT_CARDS = [
  {
    _id: "gc1",
    code: "GIFT100",
    minPrice: 80,
    maxPrice: 100,
    status: "active",
    description: "Holiday special gift card",
    imageUrl: "/api/placeholder/300/200",
    createdAt: "2023-11-15"
  },
  {
    _id: "gc2",
    code: "BDAY50",
    minPrice: 40,
    maxPrice: 50,
    status: "active",
    description: "Birthday celebration gift card",
    imageUrl: "/api/placeholder/300/200",
    createdAt: "2023-10-20"
  },
  {
    _id: "gc3",
    code: "WELCOME25",
    minPrice: 20,
    maxPrice: 25,
    status: "active",
    description: "Welcome bonus for new customers",
    imageUrl: "/api/placeholder/300/200",
    createdAt: "2023-09-05"
  },
  {
    _id: "gc4",
    code: "LOYAL200",
    minPrice: 150,
    maxPrice: 200,
    status: "active",
    description: "Loyalty reward for premium customers",
    imageUrl: "/api/placeholder/300/200",
    createdAt: "2023-08-10"
  },
  {
    _id: "gc5",
    code: "PROMO75",
    minPrice: 50,
    maxPrice: 75,
    status: "active",
    description: "Promotional gift card for special events",
    imageUrl: "/api/placeholder/300/200",
    createdAt: "2023-11-01"
  }
];

const GiftCardDisplay = () => {
  const [giftCards, setGiftCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Simulate API call to fetch gift cards
    setLoading(true);
    
    // Using setTimeout to simulate network delay
    setTimeout(() => {
      setGiftCards(MOCK_GIFT_CARDS);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#603F26]"></div>
      </div>
    );
  }

  return (
    <div className="pt-5 px-4 md:px-10 pb-16">
      <h1 className="text-center font-bold text-3xl my-8">GIFT CARDS</h1>
      
      {/* Gift Card Count & Description Row */}
      <div className="flex flex-wrap items-center justify-center mb-10">
        <div className="w-full text-center">
          <p className="text-gray-700 max-w-2xl mx-auto">
            Surprise your loved ones with our beautiful gift cards. Perfect for any occasion!
            Choose from a variety of designs and customize the amount.
          </p>
        </div>
      </div>
      
      {/* Gift Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {giftCards.length > 0 ? (
          giftCards.map((giftCard) => (
            <Link to={`/customer/gift-card/${giftCard._id}`} key={giftCard._id}>
              <div
                className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
              >
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={giftCard.imageUrl}
                    alt={giftCard.code}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-3 right-3 bg-[#603F26] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {giftCard.code}
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {giftCard.description}
                  </h2>
                  <div className="mt-2 text-sm text-gray-600">
                    <span>Price Range:</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-lg font-bold text-[#603F26]">
                      Rs {giftCard.minPrice.toFixed(2)} - Rs {giftCard.maxPrice.toFixed(2)}
                    </span>
                    <button className="bg-[#603F26] hover:bg-[#4A2E1B] text-white px-3 py-1 rounded-md text-sm transition-colors">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No gift cards available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftCardDisplay;