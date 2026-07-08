import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useCartStore from "../store/cartStore.js";

import {
  getSubtotal,
  getShippingFee,
  getGrandTotal,
} from "../utils/cartCalculations.js";

import { getDiscountAmount } from "../utils/couponUtils.js";
import api from "../services/api.js";
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

function Checkout() {
  const navigate = useNavigate();

  const { items, coupon, clearCart, removeCoupon } = useCartStore();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Frontend preview only. Final calculation happens securely in backend.
  const subtotal = getSubtotal(items);
  const shippingFee = getShippingFee(subtotal, coupon);
  const discountAmount = getDiscountAmount(subtotal, coupon);
  const grandTotal = getGrandTotal(subtotal, shippingFee, coupon);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !shippingInfo.fullName ||
      !shippingInfo.phone ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.pincode
    ) {
      return "Please fill all shipping details.";
    }

    if (shippingInfo.phone.trim().length < 10) {
      return "Please enter a valid phone number.";
    }

    if (shippingInfo.pincode.trim().length < 6) {
      return "Please enter a valid pincode.";
    }

    return "";
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const orderData = {
        orderItems: items.map((item) => ({
          productId: String(item._id || item.id),
          quantity: item.quantity,
        })),

        shippingAddress: {
          fullName: shippingInfo.fullName.trim(),
          phone: shippingInfo.phone.trim(),
          address: shippingInfo.address.trim(),
          city: shippingInfo.city.trim(),
          state: shippingInfo.state.trim(),
          pincode: shippingInfo.pincode.trim(),
        },

        paymentMethod,
        couponCode: coupon?.code || null,
      };

      const { data } = await api.post("/orders", orderData);
      const appOrder = data.order;
      if(paymentMethod === "COD"){
        clearCart();
        navigate(`/order-success/${appOrder._id}`);
        return;
      }

      const isScriptLoaded = await loadRazorpayScript();
      if(!isScriptLoaded){
        setError("Razorpay SDK failed to load. Please check your internet");
        return;
      }
      const {data: razorpayData} = await api.post(
        "/payments/create-razorpay-order",
        {
          orderId: appOrder._id,
        }
      );

      const options = {
        key: razorpayData.key,
        amount: razorpayData.razorpayOrder.amount,
        currency: razorpayData.razorpayOrder.currency,
        name: "Smart Commerce Pro",
        description:`Order #${appOrder._id}`,
        order_id: razorpayData.razorpayOrder.id,

        prefill:{
          name: shippingInfo.fullName,
          contact: shippingInfo.phone,
        },

        notes: {
          appOrderId: appOrder._id,
        },
        handler: async function (response) {
          try{
              console.log("Razorpay success response:", response);

            const {data: verifyData } = await api.post("/payments/verify",{
              appOrderId: appOrder._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
              console.log("Payment verify response:", verifyData);
              if(verifyData.success){
              clearCart();
              navigate(`/order-success/${verifyData.order._id}`);
              }else{
                setError("Payment verification failed.");
              }
          }catch(error){
            setError(
              error.response?.data?.message ||
              "Payment verification failed. Please contact support."
            );
          }
        },

        modal: {
          ondismiss: function () {
            setError("Payment popup closed. Your order is still pending.");
          },
        },
        theme: {
          color: "#000000",
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Order failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="rounded-xl border bg-white p-10">
          <h1 className="text-3xl font-bold">Your cart is empty</h1>

          <p className="mt-3 text-gray-600">
            Add products before going to checkout.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Go To Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>

        <p className="mt-2 text-gray-600">
          Complete your shipping details and review your order.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold">Shipping Details</h2>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-4 grid gap-4">
            <input
              name="fullName"
              value={shippingInfo.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
            />

            <input
              name="phone"
              value={shippingInfo.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
            />

            <input
              name="address"
              value={shippingInfo.address}
              onChange={handleChange}
              placeholder="Full Address"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
            />

            <input
              name="city"
              value={shippingInfo.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
            />

            <input
              name="state"
              value={shippingInfo.state}
              onChange={handleChange}
              placeholder="State"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
            />

            <input
              name="pincode"
              value={shippingInfo.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">Payment Method</h2>

            <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border p-4">
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />

              <span>Cash On Delivery</span>
            </label>

            <label className="mt-4 flex cursor-pointer items-center gap-3 rouded-lg bourder p-4">
              <input
              type="radio"
              value="ONLINE"
              checked={paymentMethod === "ONLINE"}
              onChange={(e)=>setPaymentMethod(e.target.value)}
              />
              <span>Online Payment - Razorpay Test Mode</span>
            </label>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-semibold">Order Review</h2>

          <div className="mt-4 space-y-4">
            {items.map((item) => (
              <div
                key={item._id || item.id}
                className="flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-medium">{item.title}</h3>

                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <span className="font-medium">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <hr className="my-5" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Discount</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? "Free" : `₹${shippingFee}`}</span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total Preview</span>
              <span>₹{grandTotal}</span>
            </div>

            <p className="text-xs text-gray-500">
              Final total will be securely calculated by backend.
            </p>
          </div>

          {coupon?.code && (
            <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              <div className="flex items-center justify-between gap-4">
                <span>Coupon applied: {coupon.code}</span>

                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-black px-4 py-3 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-500"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Checkout;