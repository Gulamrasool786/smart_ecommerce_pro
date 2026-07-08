
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api.js";

function OrderSuccess() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get(`/orders/${orderId}`);

        setOrder(data.order);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Loading order details...</h1>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="rounded-xl border bg-white p-10">
          <h1 className="text-3xl font-bold text-red-600">Order Error</h1>
          <p className="mt-3 text-gray-600">{error}</p>

          <Link
            to="/orders"
            className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Go To My Orders
          </Link>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Order not found</h1>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-green-600">
          Order Placed Successfully!
        </h1>

        <p className="mt-3 text-gray-600">
          Thank you for shopping with Smart Commerce Pro.
        </p>

        <div className="mt-6 rounded-lg bg-gray-50 p-4">
          <p>
            <span className="font-semibold">Order ID:</span> {order._id}
          </p>

          <p className="mt-2">
            <span className="font-semibold">Status:</span>{" "}
            <span className="capitalize">{order.orderStatus}</span>
          </p>

          <p className="mt-2">
            <span className="font-semibold">Payment Method:</span>{" "}
            {order.paymentMethod}
          </p>

          <p className="mt-2">
            <span className="font-semibold">Grand Total:</span> ₹
            {order.grandTotal}
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold">Shipping Address</h2>

          <div className="mt-3 rounded-lg border p-4 text-gray-700">
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
              {order.shippingAddress.pincode}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold">Ordered Items</h2>

          <div className="mt-4 space-y-4">
            {order.orderItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <p className="font-bold">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-gray-50 p-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>

          <div className="mt-2 flex justify-between">
            <span>Shipping Fee</span>
            <span>₹{order.shippingFee}</span>
          </div>

          <div className="mt-2 flex justify-between">
            <span>Discount</span>
            <span>- ₹{order.discountAmount}</span>
          </div>

          <div className="mt-3 flex justify-between border-t pt-3 text-lg font-bold">
            <span>Grand Total</span>
            <span>₹{order.grandTotal}</span>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            to="/orders"
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            View My Orders
          </Link>

          <Link
            to="/products"
            className="rounded-lg border px-6 py-3 hover:bg-gray-100"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}

export default OrderSuccess;