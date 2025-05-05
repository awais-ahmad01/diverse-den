import React, { useState, useEffect } from "react";
import axios from "axios";
import { Delete, Add, Remove, InfoOutlined } from "@mui/icons-material";
import {
  CircularProgress,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  TextField,
  Tooltip,
  Divider,
  Chip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { getCartItems } from "../../../store/actions/products";
import { customerLoyaltyPoints } from "../../../store/actions/loyaltyPerks";
import { getDiscountData } from "../../../store/actions/cart";
import { showToast } from "../../../tools";
import { Link } from "react-router-dom";

// Points to discount conversion rate
const POINTS_TO_DISCOUNT_RATE = 0.5; // 0.5 rupees per point
const MIN_POINTS_REDEMPTION = 100; // Minimum points needed to redeem

const Cart = () => {
  const dispatch = useDispatch();
  const { user, isauthenticated } = useSelector((state) => state.auth);
  const { cartItems, isloading } = useSelector((state) => state.products);
  const { customerLoyaltyData, isloading: loyaltyLoading } = useSelector(
    (state) => state.loyaltyPerks
  );
  const { discountedData } = useSelector((state) => state.cart);

  console.log("discountedData:", discountedData);

  // Loyalty points states
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [pointsError, setPointsError] = useState("");

  console.log("usePoints:", usePoints);

  console.log("CartItem:", cartItems);
  console.log("length:", cartItems?.length);

  useEffect(() => {
    if (isauthenticated) {
      const userId = user._id;
      // Fetch cart items
      dispatch(getCartItems(userId))
        .unwrap()
        .catch((error) => {
          showToast("ERROR", "Failed to fetch cart items");
        });

      // Fetch loyalty points data
      dispatch(customerLoyaltyPoints(userId))
        .unwrap()
        .catch((error) => {
          showToast("ERROR", "Failed to fetch loyalty points");
        });

      dispatch(getDiscountData(userId))
        .unwrap()
        .catch((error) => {
          console.log(
            "No discount data available or error fetching discount data"
          );
        });
    }
  }, []);

  // Apply discounted data if available
  useEffect(() => {
    console.log("Current discountedData:", discountedData);
    
    // Check if discountedData exists AND has meaningful content
    const hasValidDiscountData = discountedData && 
      (Object.keys(discountedData).length > 0 || 
       (Array.isArray(discountedData) && discountedData.length > 0));
  
    if (hasValidDiscountData) {
      console.log("Valid discount data found, enabling toggle");
      setUsePoints(true);
      setPointsToRedeem(discountedData.pointsRedeemed || MIN_POINTS_REDEMPTION);
    } else {
      console.log("No valid discount data, disabling toggle");
      setUsePoints(false);
      setPointsToRedeem(0);
    }
  }, [discountedData]);

  // Helper function to get available stock for a cart item
  const getAvailableStockForCartItem = (item) => {
    if (!item?.productId?.variants || item.productId.variants.length === 0) {
      return 0;
    }

    const selectedVariant = item.selectedVariant;

    // Find matching variant
    const matchingVariants = item.productId.variants.filter((variant) => {
      if (selectedVariant.size && variant.size !== selectedVariant.size) {
        return false;
      }

      if (
        selectedVariant.material &&
        variant.material !== selectedVariant.material
      ) {
        return false;
      }

      return true;
    });

    if (matchingVariants.length === 0) {
      return 0;
    }

    const matchingVariant = matchingVariants[0];

    // Check if this variant has colors
    if (matchingVariant.colors && matchingVariant.colors.length > 0) {
      if (selectedVariant.color) {
        const colorObj = matchingVariant.colors.find(
          (c) => c.color === selectedVariant.color
        );
        return colorObj?.quantity || 0;
      }
      return 0;
    } else {
      return matchingVariant.variantTotal || 0;
    }
  };

  const updateQuantity = async (itemId, newQuantity, availableStock) => {
    // Validate against available stock
    if (newQuantity > availableStock) {
      showToast("ERROR", `Only ${availableStock} items available in stock!`);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      console.log("Tok:", token);
      console.log("id:", itemId);
      console.log("qua:", newQuantity);

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

      showToast("SUCCESS", "Cart Item Deleted Successfully!");
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
      : 0;
  };

  const handleUsePointsToggle = (event) => {
    const toggleValue = event.target.checked;
    setUsePoints(toggleValue);

    if (!toggleValue) {
      // When turning OFF, clear points
      setPointsToRedeem(0);
      setPointsError("");
    } else {
      // When turning ON, set to existing points or minimum
      setPointsToRedeem(
        discountedData?.pointsRedeemed || MIN_POINTS_REDEMPTION
      );
    }
  };

  const handlePointsChange = (event) => {
    const value = parseInt(event.target.value, 10) || 0;

    // Get available points
    const availablePoints = customerLoyaltyData?.totalPoints || 0;

    if (value < MIN_POINTS_REDEMPTION) {
      setPointsError(
        `Minimum ${MIN_POINTS_REDEMPTION} points required for redemption`
      );
    } else if (value > availablePoints) {
      setPointsError(`You only have ${availablePoints} points available`);
    } else {
      setPointsError("");
    }

    setPointsToRedeem(value);
  };

  // Calculate discount amount based on points
  const calculatePointsDiscount = () => {
    if (!usePoints || pointsError || pointsToRedeem < MIN_POINTS_REDEMPTION) {
      return 0;
    }

    // Calculate based on points
    const discountAmount = pointsToRedeem * POINTS_TO_DISCOUNT_RATE;
    const subtotal = calculateSubtotal();

    // Don't allow discount to be more than 70% of subtotal
    return Math.min(discountAmount, subtotal * 0.7);
  };

  // Calculate final total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shippingCost = 200; // Shipping cost is fixed at 200 Rs
    const discountAmount = calculatePointsDiscount();

    return subtotal + shippingCost - discountAmount;
  };

  // Handle checkout with points redemption
  const handleCheckout = async () => {
    if (usePoints && pointsToRedeem > 0 && !pointsError) {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          showToast("ERROR", "Please login to proceed");
          return;
        }

        const discountAmount = calculatePointsDiscount();

        const body = {
          userId: user._id,
          pointsRedeemed: pointsToRedeem,
          discountAmount: discountAmount,
          orderSubtotal: calculateSubtotal(),
          orderTotal: calculateTotal(),
          shippingCost: 200,
        };

        console.log("body: ", body);

        // Make API call to store points redemption
        const response = await axios.post(
          "http://localhost:3000/customer/createDiscountSummary",
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Points redemption response:", response.data);
        showToast(
          "SUCCESS",
          `Redeemed ${pointsToRedeem} points for a discount of Rs ${discountAmount.toFixed(
            2
          )}`
        );
      } catch (err) {
        console.error("Error redeeming points:", err);
        showToast("ERROR", "Failed to process points redemption");
      }
    }
  };

  if (isloading || loyaltyLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

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
                cartItems.map((item) => {
                  // Get available stock based on the selected variant
                  const availableStock = getAvailableStockForCartItem(item);

                  return (
                    <div
                      key={item._id}
                      className="flex items-center border-b pb-4 mb-4"
                    >
                      <img
                        src={item?.productId?.imagePath[0]}
                        alt={item?.productId?.title}
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
                          Rs {item?.productId?.price.toFixed(2)}
                        </p>
                        {/* Show available stock indicator */}
                        <p
                          className={`text-sm ${
                            availableStock > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {availableStock > 0
                            ? `${availableStock} in stock`
                            : "Out of stock"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 mr-4">
                        <button
                          className="p-1 hover:bg-gray-100"
                          onClick={() =>
                            updateQuantity(
                              item?._id,
                              Math.max(1, item?.quantity - 1),
                              availableStock
                            )
                          }
                        >
                          <Remove />
                        </button>
                        <span>{item?.quantity}</span>
                        <button
                          className={`p-1 hover:bg-gray-100 ${
                            item?.quantity >= availableStock
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() =>
                            updateQuantity(
                              item?._id,
                              item?.quantity + 1,
                              availableStock
                            )
                          }
                          disabled={item?.quantity >= availableStock}
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
                  );
                })}
            </div>

            <div className="border p-6 rounded-lg h-fit">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

              {/* Loyalty Points Section */}
              {customerLoyaltyData?.totalPoints > 0 && (
                <div className="mb-6 bg-[#603f26]/10 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-lg text-[#603f26]">
                      Loyalty Points
                    </h3>
                    <Chip
                      label={`${customerLoyaltyData?.totalPoints} points available`}
                      sx={{
                        color: "#603f26",
                        borderColor: "#603f26",
                        "& .MuiChip-label": { color: "#603f26" },
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </div>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={usePoints}
                        onChange={handleUsePointsToggle}
                        // Toggle is always enabled (user can turn on/off manually)
                        disabled={false}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#603f26",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: "#603f26",
                            },
                        }}
                      />
                    }
                    label="Use points for discount"
                    className="mb-2"
                  />

                  {usePoints && (
                    <div className="mt-3">
                      <div className="flex items-center mb-1">
                        <label className="text-sm mr-2 text-[#603f26]">
                          Points to redeem:
                        </label>
                        <Tooltip
                          title={`${POINTS_TO_DISCOUNT_RATE} Rs discount per point. Minimum ${MIN_POINTS_REDEMPTION} points.`}
                        >
                          <InfoOutlined
                            fontSize="small"
                            className="text-[#603f26]"
                          />
                        </Tooltip>
                      </div>
                      <TextField
                        type="number"
                        value={pointsToRedeem}
                        onChange={handlePointsChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                        error={!!pointsError}
                        helperText={
                          pointsError ||
                          `Discount: Rs ${calculatePointsDiscount().toFixed(2)}`
                        }
                        sx={{
                          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "#603f26",
                            },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#603f26",
                          },
                        }}
                        InputProps={{
                          inputProps: {
                            min: MIN_POINTS_REDEMPTION,
                            max: customerLoyaltyData?.totalPoints || 0,
                          },
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs {calculateSubtotal()?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Rs 200.00</span>
                </div>

                {usePoints && calculatePointsDiscount() > 0 && (
                  <div className="flex justify-between text-[#603f26] font-medium">
                    <span>Points Discount</span>
                    <span>- Rs {calculatePointsDiscount().toFixed(2)}</span>
                  </div>
                )}

                <Divider className="my-2" />

                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>Rs {calculateTotal().toFixed(2)}</span>
                </div>

                {usePoints && calculatePointsDiscount() > 0 && (
                  <div className="text-xs text-[#603f26] font-medium text-right">
                    You save Rs {calculatePointsDiscount().toFixed(2)} with your
                    points!
                  </div>
                )}
              </div>

              <Link to="/customer/checkout" onClick={handleCheckout}>
                <button
                  className="w-full bg-[#603f26] text-white py-2 rounded hover:bg-opacity-85"
                  disabled={
                    cartItems?.length === 0 || (usePoints && !!pointsError)
                  }
                >
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
