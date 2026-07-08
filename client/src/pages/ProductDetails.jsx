import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api.js";
import useCartStore from "../store/cartStore.js";

function ProductDetails() {
  const { productId } = useParams();

  const addToCart = useCartStore((state) => state.addToCart);

  const [product, setProduct] = useState(null);
  const [selectedImageError, setSelectedImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get(`/products/${productId}`);

      setProduct(data.product);
    } catch (error) {
      console.log("PRODUCT DETAILS ERROR:", error.response?.data || error.message);

      setError(
        error.response?.data?.message || "Failed to load product details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;

    addToCart({
      ...product,
      id: product._id || product.id,
    });
  };

  if (loading) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="h-[500px] animate-pulse rounded-3xl bg-gray-100"></div>

        <div className="space-y-5">
          <div className="h-8 w-40 animate-pulse rounded bg-gray-200"></div>
          <div className="h-14 w-full animate-pulse rounded bg-gray-200"></div>
          <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200"></div>
          <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200"></div>
          <div className="h-14 w-48 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </section>
  );
}
  if (error || !product) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16 text-center">
        <div className="rounded-3xl border bg-white p-10 shadow-sm">
          <h1 className="text-3xl font-extrabold text-red-600">
            Product Not Found
          </h1>

          <p className="mt-3 text-gray-600">
            {error || "This product is not available."}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-gray-800"
          >
            Back To Products
          </Link>
        </div>
      </section>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-black/5 blur-3xl"></div>
        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-gray-300/40 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-10">
          <Link
            to="/products"
            className="inline-flex rounded-full border bg-white px-5 py-2 text-sm font-bold text-gray-700 shadow-sm transition-all duration-300 hover:border-black hover:text-black"
          >
            ← Back to Products
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Product Image */}
          <div className="rounded-[2rem] border bg-white p-5 shadow-xl">
            <div className="flex min-h-[480px] items-center justify-center rounded-[1.5rem] bg-gray-50">
              {selectedImageError || !product.image ? (
                <div className="text-8xl">🛍️</div>
              ) : (
                <img
                  src={product.image}
                  alt={product.title}
                  onError={() => setSelectedImageError(true)}
                  className="max-h-[430px] w-full object-contain p-6 transition-transform duration-500 hover:scale-105"
                />
              )}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="flex flex-wrap gap-2">
              {product.category && (
                <span className="rounded-full bg-black px-4 py-1 text-xs font-bold capitalize text-white">
                  {product.category}
                </span>
              )}

              {isOutOfStock ? (
                <span className="rounded-full bg-red-100 px-4 py-1 text-xs font-bold text-red-700">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="rounded-full bg-yellow-100 px-4 py-1 text-xs font-bold text-yellow-700">
                  Only {product.stock} left
                </span>
              ) : (
                <span className="rounded-full bg-green-100 px-4 py-1 text-xs font-bold text-green-700">
                  In Stock
                </span>
              )}
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-wide text-gray-500">
              {product.brand || "Smart Brand"}
            </p>

            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-black md:text-5xl">
              {product.title}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-yellow-500">★★★★★</span>
              <span className="text-sm font-semibold text-gray-600">
                {product.rating || 4.5} Rating
              </span>
            </div>

            <p className="mt-6 text-4xl font-extrabold text-black">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>

            <p className="mt-6 leading-8 text-gray-600">
              {product.description ||
                "This is a premium quality product with modern design, smooth shopping experience, secure checkout, and reliable delivery support."}
            </p>

            {/* Delivery Details */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-gray-500">
                  Estimated Delivery
                </p>
                <h3 className="mt-2 text-xl font-extrabold text-black">
                  3 - 5 Days
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Fast delivery available in selected cities.
                </p>
              </div>

              <div className="rounded-3xl border bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-gray-500">
                  Payment Options
                </p>
                <h3 className="mt-2 text-xl font-extrabold text-black">
                  COD / Online
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Razorpay secure online payment supported.
                </p>
              </div>

              <div className="rounded-3xl border bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-gray-500">
                  Return Policy
                </p>
                <h3 className="mt-2 text-xl font-extrabold text-black">
                  7 Days
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Easy replacement for eligible products.
                </p>
              </div>

              <div className="rounded-3xl border bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-gray-500">
                  Stock Available
                </p>
                <h3 className="mt-2 text-xl font-extrabold text-black">
                  {product.stock}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Live stock from backend inventory.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`rounded-full px-8 py-4 text-sm font-bold transition-all duration-300 ${
                  isOutOfStock
                    ? "cursor-not-allowed bg-gray-200 text-gray-500"
                    : "bg-black text-white shadow-xl hover:-translate-y-1 hover:bg-gray-800 hover:shadow-2xl"
                }`}
              >
                {isOutOfStock ? "Out of Stock" : "Add To Cart"}
              </button>

              <Link
                to="/cart"
                className="rounded-full border px-8 py-4 text-center text-sm font-bold text-black transition-all duration-300 hover:-translate-y-1 hover:border-black hover:bg-gray-50"
              >
                Go To Cart
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Extra Product Information */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="rounded-[2rem] border bg-gray-50 p-8">
          <h2 className="text-2xl font-extrabold">Product Information</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-gray-500">Category</p>
              <p className="mt-2 font-bold capitalize">
                {product.category || "General"}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-gray-500">Brand</p>
              <p className="mt-2 font-bold">
                {product.brand || "Smart Brand"}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-gray-500">Product ID</p>
              <p className="mt-2 break-all text-sm font-bold">
                {product._id}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;