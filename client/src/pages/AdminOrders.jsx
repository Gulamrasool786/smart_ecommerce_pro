import React, { useEffect, useState } from "react";
import api from "../services/api.js";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getPaymentStatusClass = (status) => {
    if (status === "paid") {
      return "bg-green-100 text-green-700";
    }

    if (status === "failed") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  const getOrderStatusClass = (status) => {
    if (status === "delivered") {
      return "bg-green-100 text-green-700";
    }

    if (status === "cancelled") {
      return "bg-red-100 text-red-700";
    }

    if (status === "shipped") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/orders");

      console.log("ADMIN ORDERS:", data);

      setOrders(data.orders);
    } catch (error) {
      console.log("ADMIN ORDERS ERROR:", error.response?.data);

      setError(
        error.response?.data?.message || "Failed to load admin orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await api.patch(`/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: data.order.orderStatus,
              }
            : order
        )
      );
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to update order status."
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Loading admin orders...</h1>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-red-600">
          Admin Orders Error
        </h1>
        <p className="mt-3 text-gray-600">{error}</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Orders</h1>

        <p className="mt-2 text-gray-600">
          View all customer orders, payment details, and update delivery status.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <h2 className="text-2xl font-bold">No orders found</h2>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div>
                  <h2 className="font-bold">Order #{order._id}</h2>

                  <p className="mt-2 text-sm text-gray-600">
                    Customer: {order.user?.name} ({order.user?.email})
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Date:{" "}
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                      {order.paymentMethod}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentStatusClass(
                        order.paymentStatus
                      )}`}
                    >
                      Payment: {order.paymentStatus}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getOrderStatusClass(
                        order.orderStatus
                      )}`}
                    >
                      Order: {order.orderStatus}
                    </span>
                  </div>

                  {order.razorpayPaymentId && (
                    <p className="mt-3 text-sm text-gray-600">
                      Razorpay Payment ID:{" "}
                      <span className="font-medium text-black">
                        {order.razorpayPaymentId}
                      </span>
                    </p>
                  )}

                  {order.razorpayOrderId && (
                    <p className="mt-1 text-sm text-gray-600">
                      Razorpay Order ID:{" "}
                      <span className="font-medium text-black">
                        {order.razorpayOrderId}
                      </span>
                    </p>
                  )}

                  {order.paidAt && (
                    <p className="mt-1 text-sm text-gray-600">
                      Paid At:{" "}
                      {new Date(order.paidAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  )}
                </div>

                <div className="lg:text-right">
                  <p className="text-xl font-bold">₹{order.grandTotal}</p>

                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="mt-3 rounded-lg border px-4 py-2 capitalize"
                  >
                    <option value="placed">Placed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 border-t pt-4">
                <h3 className="font-semibold">Items</h3>

                <div className="mt-2 space-y-2">
                  {order.orderItems.map((item) => (
                    <div
                      key={`${order._id}-${item.productId}`}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.title} × {item.quantity}
                      </span>

                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 border-t pt-4">
                <h3 className="font-semibold">Payment Summary</h3>

                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal}</span>
                  </div>

                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>
                        Discount{" "}
                        {order.couponCode ? `(${order.couponCode})` : ""}
                      </span>
                      <span>-₹{order.discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {order.shippingFee === 0 ? "Free" : `₹${order.shippingFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between border-t pt-2 font-bold text-black">
                    <span>Grand Total</span>
                    <span>₹{order.grandTotal}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t pt-4 text-sm text-gray-600">
                <p className="font-semibold text-black">Shipping Address</p>
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.pincode}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminOrders;