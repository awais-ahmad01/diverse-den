import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSubCategoryProducts} from "../../../store/actions/products";
import { clearSubCategoryProducts } from "../../../store/reducers/products";


const SubCategory = () => {
  const dispatch = useDispatch();


  const { category, subcategory, productType } = useParams();

  const { subCategoryProducts } = useSelector((state) => state.products);

  // const [products, setProducts] = useState([]);

  console.log('sub:', subCategoryProducts)

  // console.log("params:", category, subcategory, productType);

  // console.log('sub',subcategory)
  // console.log('pr:', productType)


  useEffect(() => {

    dispatch(clearSubCategoryProducts());
    
    dispatch(getSubCategoryProducts({ subcategory, productType }));
    
  }, [category, subcategory, productType]);

  return (
    <div>
      <div className="pt-5 px-10 pb-16">
        <h1 className="text-center font-bold text-3xl my-2 md:my-6">
          {productType ? productType.toUpperCase() : subcategory.toUpperCase()}
        </h1>
        
          {subCategoryProducts && subCategoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {subCategoryProducts.map((product) => (
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
            ))}
          </div>
          ) : (
            <div className="h-screen">
                <h1 className="text-center font-semibold text-2xl text-gray-500"> No related products found</h1>    
            </div>
          )}
        
      </div>
    </div>
  );
};

export default SubCategory;