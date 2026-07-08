import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get("/orders/my-orders");
        console.log("MY ORDERS BACKEND RESPONSE:", data);
        console.log("MY ORDERS STATUS:", data.status);
        console.log("MY ORDERS DATA:", data.data);


        console.log("My Orders Data:", data);

        setOrders(data.orders);
      } catch (error) {
        console.log("My Orders Error:", error);
        console.log("Backend Data:", error.response?.data);

        setError(
          error.response?.data?.message || "Failed to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Loading your orders...</h1>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <div className="rounded-xl border bg-white p-10">
          <h1 className="text-3xl font-bold text-red-600">Order Error</h1>
          <p className="mt-3 text-gray-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-xl border bg-white p-10 text-center">
          <h2 className="text-2xl font-bold">No orders yet</h2>

          <p className="mt-3 text-gray-600">
            Your backend orders will appear here.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="font-bold">Order #{order._id}</h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Items: {order.orderItems.length}
                  </p>

                  <p className="mt-1 capitalize text-sm text-gray-600">
                    Status: {order.orderStatus}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-lg font-bold">₹{order.grandTotal}</p>

                  <p className="mt-1 text-sm text-gray-600">
                    Payment: {order.paymentMethod}
                  </p>

                  <Link
                    to={`/order-success/${order._id}`}
                    className="mt-3 inline-block rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              <div className="mt-5 border-t pt-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between py-2 text-sm"
                  >
                    <span>
                      {item.title} × {item.quantity}
                    </span>

                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Orders;