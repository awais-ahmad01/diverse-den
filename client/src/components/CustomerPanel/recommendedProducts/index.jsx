import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Chip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getRecomendedProducts } from "../../../store/actions/products";
import { Loader } from "../../../tools";

const RecommendedProducts = () => {
  const { user } = useSelector((state) => state.auth);
  const { recommendedProducts, isloading } = useSelector((state) => state.products);

  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      const userId = user._id;
      dispatch(getRecomendedProducts(userId));
    }
  }, [dispatch, user]);

  if (isloading) {
    return <Loader />;
  }

  // If there are no recommended products, don't render the component
  if (!recommendedProducts || recommendedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 sm:mt-16 px-4 sm:px-6 pb-12 sm:pb-16">
      <h1 className="text-center font-bold text-2xl sm:text-3xl my-8 sm:my-10">RECOMMENDED FOR YOU</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6 sm:gap-6 mb-12 sm:mb-16 mx-auto">
        {recommendedProducts?.slice(0, 4)?.map((product) => (
          <div key={product.productId} className="px-1 sm:px-2">
            <Link to={`/customer/productDetails/${product.productId}`} className="block h-full">
              <div className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-[1.02] hover:shadow-lg h-full">
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h2 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 h-[2.8em]">
                    {product.name}
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
      <div className="text-center mb-8 sm:mb-10">
        <Link
          to={'/customer/recommendedProductsPage'}
          className="bg-[#603F26] text-white text-lg sm:text-xl px-6 py-2 sm:px-8 sm:py-3 rounded shadow hover:bg-opacity-90 transition-colors"
        >
          View All
        </Link>
      </div>
    </div>
  );
};

export default RecommendedProducts;