import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllGiftCards } from "../../../store/actions/giftCards";
import { Chip } from "@mui/material";
import { Loader } from "../../../tools";

const GiftCardDisplay = () => {
  const dispatch = useDispatch();
  const { giftCardsData, isloading } = useSelector((state) => state.giftCards);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getAllGiftCards());
  }, [dispatch]);

  if (isloading) {
    return <Loader />;
  }

  return (
    <div className="pt-5 px-4 sm:px-6 pb-12 sm:pb-16">
      <h1 className="text-center font-bold text-2xl sm:text-3xl my-8 sm:my-10">GIFT CARDS</h1>
      
      {/* Gift Card Count & Description Row */}
      <div className="flex flex-wrap items-center justify-center mb-8 sm:mb-10">
        <div className="w-full text-center">
          <p className="text-gray-700 text-sm sm:text-base max-w-2xl mx-auto">
            Surprise your loved ones with our beautiful gift cards. Perfect for any occasion!
            Choose from a variety of designs and customize the amount.
          </p>
        </div>
      </div>
      
      {/* Gift Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-x-4 gap-y-6 sm:gap-6 mb-12 sm:mb-16 mx-auto">
        {giftCardsData?.length > 0 ? (
          giftCardsData.map((giftCard) => (
            <div key={giftCard._id} className="px-1 sm:px-2">
              <Link to={`/customer/giftCardPurchase/${giftCard._id}`} className="block h-full">
                <div className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-[1.02] hover:shadow-lg h-full">
                  <div className="relative aspect-[4/3] bg-gray-100">
                    <img
                      src={giftCard.imagePath}
                      alt={giftCard.code}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://via.placeholder.com/300x200?text=Gift+Card";
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-[#603F26] text-white px-2 py-1 rounded-full text-xs sm:text-sm font-semibold">
                      {giftCard.code}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h2 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 h-[2.8em]">
                      {giftCard.description}
                    </h2>
                    <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
                      <span>Price Range:</span>
                    </div>
                    <div className="flex items-center justify-between mt-1 sm:mt-2">
                      <Chip 
                        label={`Rs ${parseInt(giftCard.minPrice).toFixed(2)} - Rs ${parseInt(giftCard.maxPrice).toFixed(2)}`}
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
            No gift cards available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftCardDisplay;