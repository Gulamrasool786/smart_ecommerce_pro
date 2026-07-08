import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl font-extrabold text-black">
                S
              </div>

              <div>
                <h2 className="text-xl font-extrabold">
                  Smart Commerce Pro
                </h2>
                <p className="text-sm text-gray-400">
                  Premium eCommerce experience
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-md leading-7 text-gray-400">
              A modern full-stack eCommerce project with authentication,
              admin dashboard, products, coupons, orders, stock management,
              and Razorpay online payment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold">Quick Links</h3>

            <div className="mt-4 space-y-3 text-sm text-gray-400">
              <Link to="/" className="block transition hover:text-white">
                Home
              </Link>

              <Link
                to="/products"
                className="block transition hover:text-white"
              >
                Products
              </Link>

              <Link to="/cart" className="block transition hover:text-white">
                Cart
              </Link>

              <Link
                to="/orders"
                className="block transition hover:text-white"
              >
                Orders
              </Link>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-bold">Features</h3>

            <div className="mt-4 space-y-3 text-sm text-gray-400">
              <p>Secure Auth</p>
              <p>Admin Dashboard</p>
              <p>Razorpay Payment</p>
              <p>Smart Coupons</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-sm text-gray-400 sm:flex-row sm:items-center">
          <p>© {year} Smart Commerce Pro. All rights reserved.</p>

          <p>
            Built with MERN Stack + Tailwind CSS + Razorpay
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;