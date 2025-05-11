import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllGiftCards } from "../../../store/actions/giftCards";

const GiftCardDisplay = () => {
  const dispatch = useDispatch();
  const { giftCardsData, isloading } = useSelector((state) => state.giftCards);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getAllGiftCards());
  }, [dispatch]);

  if (isloading) {
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
        {giftCardsData?.length > 0 ? (
          giftCardsData.map((giftCard) => (
            <Link to={`/customer/giftCardPurchase/${giftCard._id}`} key={giftCard._id}>
              <div
                className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
              >
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={giftCard.imagePath}
                    alt={giftCard.code}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://via.placeholder.com/300x200?text=Gift+Card";
                    }}
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
                      Rs {parseInt(giftCard.minPrice).toFixed(2)} - Rs {parseInt(giftCard.maxPrice).toFixed(2)}
                    </span>
                    
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