import React, { useState, useEffect } from "react";
import axios from "axios";
import { Delete, Add, Remove } from "@mui/icons-material";
import { CircularProgress, Snackbar, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { getCartItems } from "../../../store/actions/products";
import { showToast } from "../../../tools";
import { Link } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const { user, isauthenticated } = useSelector((state) => state.auth);
  const { cartItems, isloading } = useSelector((state) => state.products);

  console.log("CartItem:", cartItems);
  console.log("length:", cartItems?.length);

  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  // const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (isauthenticated) {
      const userId = user._id;
      dispatch(getCartItems(userId))
        .unwrap()
        .catch((error) => {
          showToast("ERROR", "Failed to fetch cart items");
        });
    }
  }, []);

  // const fetchCartItems = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get('/api/cart');
  //     setCartItems(response.data);
  //     setLoading(false);
  //   } catch (err) {
  //     setError('Failed to load cart items');
  //     setLoading(false);
  //   }
  // };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");

      console.log("Tok:", token);
      console.log("id:", itemId);
      console.log("qua:", newQuantity);

      // if (!token) {

      //   return;
      // }

      const response = await axios.post(
        "http://localhost:3000/customer/updateProductQuantityInCart",
        { quantity: newQuantity, cartId: itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("response:", response.data);

      if (isauthenticated) {
        const userId = user._id;
        dispatch(getCartItems(userId))
          .unwrap()
          .catch((error) => {
            showToast("ERROR", "Failed to fetch cart items");
          });
      }
    } catch (err) {
      showToast("ERROR", "Failed to update cart");
    }
  };

  const removeItem = async (itemId) => {
    try {
      const body = {
        cartId: itemId,
      };

      const token = localStorage.getItem("token");

      console.log("Tok:", token);

      if (!token) {
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/customer/deleteCartProduct",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("re:", response.data);

      if (isauthenticated) {
        const userId = user._id;
        dispatch(getCartItems(userId))
          .unwrap()
          .catch((error) => {
            showToast("ERROR", "Failed to fetch cart items");
          });
      }

      showToast("SUCCESS", "Cart Item Deleted Succesfully!");
    } catch (err) {
      showToast("ERROR", "Failed to delete cart item!");
      console.log("err:", err);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.length > 0
      ? cartItems.reduce(
          (total, item) => total + item?.productId?.price * item.quantity,
          0
        )
      : null;
  };

  const handleCheckout = async () => {
    try {
      const response = await axios.post("/api/checkout", {
        items: cartItems,
        total: calculateSubtotal(),
      });

      window.location.href = response.data.redirectUrl;
    } catch (err) {
      setError("Checkout failed. Please try again.");
    }
  };

  if (isloading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="text-center text-red-500 p-8">
  //       {error}
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto px-4 py-14">
      {!cartItems || cartItems?.length === 0 ? (
        <div className="font-semibold text-3xl text-gray-500 h-screen flex justify-center">
          Your cart is empty
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {cartItems?.length > 0 &&
                cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center border-b pb-4 mb-4"
                  >
                    <img
                      src={item?.productId?.imagePath[0]}
                      alt={item?.title}
                      className="w-24 h-24 object-cover mr-4 rounded"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold">
                        {item?.productId?.title}
                      </h3>
                      <p className="text-gray-600">
                        {item?.selectedVariant?.color
                          ? `Color: ${item?.selectedVariant?.color}`
                          : ""}
                        {item?.selectedVariant?.size
                          ? ` | Size: ${item?.selectedVariant?.size}`
                          : ""}
                        {item?.selectedVariant?.material
                          ? ` | Material: ${item?.selectedVariant?.material}`
                          : ""}
                      </p>
                      <p className="text-primary">
                        ${item?.productId?.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 mr-4">
                      <button
                        className="p-1 hover:bg-gray-100"
                        onClick={() =>
                          updateQuantity(
                            item?._id,
                            Math.max(1, item?.quantity - 1)
                          )
                        }
                      >
                        <Remove />
                      </button>
                      <span>{item?.quantity}</span>
                      <button
                        className="p-1 hover:bg-gray-100"
                        onClick={() =>
                          updateQuantity(item?._id, item?.quantity + 1)
                        }
                      >
                        <Add />
                      </button>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeItem(item?._id)}
                    >
                      <Delete />
                    </button>
                  </div>
                ))}
            </div>

            <div className="border p-6 rounded-lg h-fit">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    ${cartItems?.length > 0 && calculateSubtotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total</span>
                  <span>
                    ${cartItems?.length > 0 && calculateSubtotal().toFixed(2)}
                  </span>
                </div>
              </div>
              <Link 
                to='/checkout'
              >
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#603f26] text-white py-2 rounded hover:bg-opacity-85"
                  disabled={cartItems?.length === 0}
                >
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* <Snackbar 
        open={!!successMessage} 
        autoHideDuration={6000} 
        onClose={() => setSuccessMessage(null)}
      >
        <Alert 
          onClose={() => setSuccessMessage(null)} 
          severity="success"
        >
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error"
        >
          {error}
        </Alert>
      </Snackbar> */}
    </div>
  );
};

export default Cart;
