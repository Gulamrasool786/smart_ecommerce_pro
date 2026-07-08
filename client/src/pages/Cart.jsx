import React, { useState } from "react";
import useCartStore from "../store/cartStore.js";
import { 
  getSubtotal,
  getShippingFee,
  getGrandTotal,
} from "../utils/cartCalculations.js";
import { getDiscountAmount } from "../utils/couponUtils.js";
import { Link } from "react-router-dom";

function Cart() {
  const {
    items,
    coupon,
    couponMessage,
    couponError,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState("");

  const subtotal = getSubtotal(items);
  const shippingFee = getShippingFee(subtotal);
  const discountAmount = getDiscountAmount(subtotal, coupon);
  const grandTotal = getGrandTotal(subtotal, shippingFee) - discountAmount;

  const handleApplyCoupon = () => {
    applyCoupon(couponInput, subtotal);
    setCouponInput("");
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="mt-2 text-gray-600">
            Review your selected products.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
          >
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-gray-600">
            Add some products to see them here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-xl border bg-white p-4"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-24 w-24 rounded-lg object-cover"
                />

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h2 className="font-semibold">{item.title}</h2>
                    <p className="text-gray-600">₹{item.price}</p>
                    <p className="text-sm text-gray-500">
                      Stock: {item.stock}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="h-8 w-8 rounded border"
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="h-8 w-8 rounded border"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="mt-4 flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            {discountAmount > 0 && (
              <div className="mt-2 flex justify-between text-green-700">
                <span>Discount</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}

            <div className="mt-2 flex justify-between">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? "Free" : `₹${shippingFee}`}</span>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Coupon Code</label>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter coupon"
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:border-black"
                />

                <button
                  onClick={handleApplyCoupon}
                  className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <p className="mt-2 text-sm text-red-600">{couponError}</p>
              )}

              {couponMessage && coupon && (
                <div className="mt-2 flex items-center justify-between rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                  <span>
                    {typeof coupon === "object" ? coupon.code : coupon} applied
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="font-medium text-green-900"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>

            {subtotal > 0 && subtotal < 3000 && (
              <p className="mt-3 text-sm text-gray-600">
                Add ₹{3000 - subtotal} more for free shipping.
              </p>
            )}
            <Link 
            to="/checkout"
            className="mt-6 block w-full rounded-lg bg-black px-4 py-3 text-center text-white hover:bg-gray-800"
            >
              Proceed To Checkout
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

export default Cart;
