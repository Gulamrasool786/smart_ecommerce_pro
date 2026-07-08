import React from "react";
import { Link } from "react-router-dom";
import {Truck, Star, Lock} from "lucide-react";

function Home() {
  const features = [
    {
      title: "Fast Delivery",
      desc: "Quick and reliable delivery experience.",
    },
    {
      title: "Secure Payment",
      desc: "Razorpay powered online payment."
    },
    {
      title: "Premium Products",
      desc: "Curated products with quality focus.",
    },
  ];

  const categories = [
    "Electronics",
    "Fashion",
    "Accessories",
    "Lifestyle",
  ];

  return (
    <main className="overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative">
        {/* Background decoration */}
        <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-gray-200 blur-3xl"></div>
        <div className="absolute right-[-120px] top-20 h-80 w-80 rounded-full bg-black/10 blur-3xl"></div>

        <div className="mx-auto grid min-h-[85vh] max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2">
          {/* Left Content */}
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
              New Collection Live Now
            </div>

            <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight text-black md:text-6xl lg:text-7xl">
              Build Your Style With{" "}
              <span className="relative inline-block">
                Smart Commerce
                <span className="absolute -bottom-2 left-0 h-2 w-full rounded-full bg-black/20"></span>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Discover premium products, smooth checkout, secure online payment,
              smart coupons, and a professional shopping experience.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/products"
                className="rounded-full bg-black px-8 py-4 text-center text-sm font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-gray-800 hover:shadow-2xl"
              >
                Shop Products
              </Link>

              <Link
                to="/cart"
                className="rounded-full border border-gray-300 bg-white px-8 py-4 text-center text-sm font-bold text-black shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-lg"
              >
                View Cart
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid max-w-xl grid-cols-3 gap-4">
              <div className="rounded-2xl border bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <h3 className="text-2xl font-extrabold">50+</h3>
                <p className="text-sm text-gray-500">Products</p>
              </div>

              <div className="rounded-2xl border bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <h3 className="text-2xl font-extrabold">100%</h3>
                <p className="text-sm text-gray-500">Secure</p>
              </div>

              <div className="rounded-2xl border bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <h3 className="text-2xl font-extrabold">24/7</h3>
                <p className="text-sm text-gray-500">Support</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative z-10">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -left-8 top-8 h-28 w-28 animate-pulse rounded-3xl bg-black"></div>
              <div className="absolute -right-8 bottom-8 h-28 w-28 animate-pulse rounded-full bg-gray-300"></div>

              <div className="relative rounded-[2rem] border bg-white p-5 shadow-2xl">
                <div className="rounded-[1.5rem] bg-gradient-to-br from-gray-100 to-white p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-500">
                        Featured Product
                      </p>
                      <h2 className="mt-1 text-2xl font-extrabold">
                        Wireless Headphones
                      </h2>
                    </div>

                    <span className="rounded-full bg-black px-4 py-2 text-sm font-bold text-white">
                      New
                    </span>
                  </div>

                  <div className="my-8 flex h-56 items-center justify-center rounded-3xl bg-white shadow-inner">
                    <div className="flex h-40 w-40 animate-bounce items-center justify-center rounded-full bg-black text-6xl shadow-xl">
                      🎧
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-3xl font-extrabold">₹1,999</p>
                    </div>

                    <Link
                      to="/products"
                      className="rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-gray-800"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-8 left-4 rounded-2xl border bg-white p-4 shadow-xl transition-all duration-300 hover:-translate-y-1">
                <p className="text-sm font-semibold text-gray-500">
                  Payment
                </p>
                <p className="font-bold text-green-600">Razorpay Ready</p>
              </div>

              <div className="absolute -top-8 right-4 rounded-2xl border bg-white p-4 shadow-xl transition-all duration-300 hover:-translate-y-1">
                <p className="text-sm font-semibold text-gray-500">Orders</p>
                <p className="font-bold text-black">Live Tracking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-extrabold">Shop By Category</h2>
            <p className="mt-2 text-gray-600">
              Explore products from popular shopping categories.
            </p>
          </div>

          <Link
            to="/products"
            className="font-semibold text-black hover:underline"
          >
            View all products →
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={category}
              to="/products"
              className="group rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-black hover:shadow-xl"
            >
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-xl font-bold text-white transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
                {index + 1}
              </div>

              <h3 className="text-xl font-bold">{category}</h3>

              <p className="mt-2 text-sm text-gray-500">
                Discover latest {category.toLowerCase()} products.
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold">
              Why Smart Commerce Pro?
            </h2>

            <p className="mt-3 text-gray-600">
              Built with real eCommerce features and professional user flow.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-3xl shadow-md">
                  {feature.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>

                <p className="mt-3 text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-black px-6 py-16 text-center text-white shadow-2xl">
          <div className="absolute left-10 top-10 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-white/10 blur-xl"></div>

          <h2 className="relative text-4xl font-extrabold">
            Ready to Start Shopping?
          </h2>

          <p className="relative mx-auto mt-4 max-w-2xl text-gray-300">
            Experience smooth cart, checkout, coupons, Razorpay payment, and
            order tracking in one professional app.
          </p>

          <Link
            to="/products"
            className="relative mt-8 inline-block rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-all duration-300 hover:-translate-y-1 hover:bg-gray-200"
          >
            Explore Store
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;