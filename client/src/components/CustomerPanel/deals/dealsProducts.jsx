import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader } from "../../../tools";
import { useDispatch, useSelector } from "react-redux";
import { getSaleEventByIdWithProductDetails } from "../../../store/actions/saleEvents";

const DealsPage = () => {
  const [filterOption, setFilterOption] = useState("bestMatch");
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { saleEventsWithProductDetails, isloading } = useSelector((state) => state.saleEvents);
  
  const dispatch = useDispatch();
  const { eventId } = useParams();

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
    applySorting(e.target.value);
  };

  // Apply price sorting
  const applySorting = (option) => {
    if (!saleEventsWithProductDetails?.products) return;
    
    let sorted = [...saleEventsWithProductDetails.products];
    
    if (option === 'bestMatch') {
      // Random sorting for best match
      sorted = sorted.sort(() => Math.random() - 0.5);
    } else if (option === 'lowToHigh') {
      sorted = sorted.sort((a, b) => a.discountedPrice - b.discountedPrice);
    } else if (option === 'highToLow') {
      sorted = sorted.sort((a, b) => b.discountedPrice - a.discountedPrice);
    }
    
    setSortedProducts(sorted);
  };

  // Fetch sale event data
  useEffect(() => {
    dispatch(getSaleEventByIdWithProductDetails(eventId));
  }, [eventId, dispatch]);

  // Initialize sorted products when data is loaded
  useEffect(() => {
    if (saleEventsWithProductDetails?.products) {
      // Apply default sorting (best match)
      applySorting('bestMatch');
    }
  }, [saleEventsWithProductDetails]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isloading) {
    return <Loader />;
  }

  return (
    <div className="pt-5 px-4 md:px-10 pb-16">
      <h1 className="text-center font-bold text-3xl my-8">{saleEventsWithProductDetails?.name}</h1>
      
      {/* Filter and Product Count Row */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <p className="text-gray-500">
            Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>
        
        {/* Price filter */}
        {sortedProducts.length > 0 && (
          <div className="w-full md:w-auto">
            <select
              className="bg-white border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-[#603F26] focus:outline-none w-full md:w-auto"
              value={filterOption}
              onChange={handleFilterChange}
            >
              <option value="bestMatch">Best Match</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        )}
      </div>
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <Link to={`/customer/saleProductDetails/${product?.productId}/${eventId}`} key={product?.productId}>
              <div
                className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
              >
                {/* Discount badge */}
                <div className="relative h-64 bg-gray-100">
                  <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 font-semibold z-10 rounded-bl-lg">
                    {saleEventsWithProductDetails?.discountValue}% OFF
                  </div>
                  <img
                    src={product?.images[0]}
                    alt={product?.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {product?.name}
                  </h2>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="text-lg font-bold text-[#603F26]">
                        Rs {product?.discountedPrice?.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 line-through ml-2">
                        Rs {product?.originalPrice?.toFixed(2)}
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