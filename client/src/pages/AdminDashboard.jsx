import React from "react";

function AdminDashboard() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="rounded-xl border bg-white p-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <p className="mt-3 text-gray-600">
          Admin features will be built here: products, orders, users,
          coupons, and analytics.
        </p>
      </div>
    </section>
  );
}

export default AdminDashboard;