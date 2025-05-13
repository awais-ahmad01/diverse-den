import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRecomendedProducts } from "../../../store/actions/products";
import { Loader } from "../../../tools";

const RecommendedProducts = () => {
  const { user } = useSelector((state) => state.auth);
  const { recommendedProducts, isloading: productsLoading } = useSelector((state) => state.products);
  const dispatch = useDispatch();


   useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  useEffect(() => {
    if (user) {
      const userId = user._id;
      dispatch(getRecomendedProducts(userId));
    }
  }, [dispatch, user]);

  
  if (productsLoading) {
    return <div className="my-20"><Loader /></div>;
  }

  // Don't render if no recommended products
  if (!recommendedProducts || recommendedProducts.length === 0) {
    return null;
  }

  return (
    <div className="pt-5 px-4 md:px-10 pb-16">
      <h1 className="text-center font-bold text-3xl my-8">RECOMMENDED FOR YOU</h1>
      
      {/* Product Count Row */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <p className="text-gray-500">
            Showing {recommendedProducts.length} {recommendedProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>
      </div>
      
      {/* Product Grid - Matching CategoryPage styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {recommendedProducts.map((product) => (
          <Link to={`/customer/productDetails/${product.productId}`} key={product.productId}>
            <div className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
              <div className="relative h-64 bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {product.name}
                </h2>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold text-[#603F26]">
                    Rs {product.price?.toFixed(2)}
                  </span>
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