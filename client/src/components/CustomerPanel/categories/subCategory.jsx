import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getSubCategoryProducts } from "../../../store/actions/products";
import { clearSubCategoryProducts } from "../../../store/reducers/products";

const SubCategory = () => {
  const dispatch = useDispatch();


  console.log("subCategoryPage")
  

  const { category, subcategory, productType } = useParams();

  const { subCategoryProducts } = useSelector((state) => state.products);

  const [filterOption, setFilterOption] = useState("bestMatch");
  const [sortedProducts, setSortedProducts] = useState(null);

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
    if (e.target.value === 'bestMatch') {
      setSortedProducts(null);
    } else if (e.target.value === 'lowToHigh') {
      setSortedProducts(subCategoryProducts.slice().sort((a, b) => a.price - b.price));
    } else if (e.target.value === 'highToLow') {
      setSortedProducts(subCategoryProducts.slice().sort((a, b) => b.price - a.price));
    }
  };

  useEffect(() => {
    dispatch(clearSubCategoryProducts());

    dispatch(getSubCategoryProducts({ subcategory, productType }));
  }, [category, subcategory, productType]);


  useEffect(() => {
    setSortedProducts(null);
  }, [subCategoryProducts]);
  
  useEffect(() => {
    if (!sortedProducts) {
      const shuffledProducts = [...subCategoryProducts].sort(() => Math.random() - 0.5);
      setSortedProducts(shuffledProducts);
    }
  }, [subCategoryProducts, sortedProducts, subcategory, productType]);

  return (
    <div>
      <div className="pt-5 px-10 pb-16">
        <h1 className="text-center font-bold text-3xl my-2 md:my-6">
          {productType ? productType.toUpperCase() : subcategory.toUpperCase()}
        </h1>

        {sortedProducts && sortedProducts.length > 0 ? (
          <div className="flex justify-end mb-4">
          <select
            className="bg-white border border-gray-300 rounded-lg py-2 px-4"
            value={filterOption}
            onChange={handleFilterChange}
          >
            <option value="bestMatch">Best Match</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
        ):
        null}

        

        {sortedProducts && sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {sortedProducts.map((product) => (
              <Link to={`/customer/productDetails/${sortedProducts._id}`}>
                <div
                key={product?._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
              >
                <div className="relative h-80 bg-gray-100">
                  <img
                    src={product?.imagePath[0]}
                    alt={product?.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {product?.title}
                  </h2>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-[#603F26]">
                      Rs {product?.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="h-screen">
            <h1 className="text-center font-semibold text-2xl text-gray-500">
              {" "}
              No related products found
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubCategory;
