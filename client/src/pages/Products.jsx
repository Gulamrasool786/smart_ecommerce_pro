import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import api from "../services/api.js";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category") || "all";
  const searchFromUrl = searchParams.get("search") || "";
  const sortFromUrl = searchParams.get("sort") || "latest";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/products");

      const normalizedProducts = data.products.map((product) => ({
        ...product,
        id: product._id,
      }));

      setProducts(normalizedProducts);
    } catch (error) {
      console.log("PRODUCTS ERROR:", error.response?.data || error.message);

      setError(
        error.response?.data?.message || "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (categoryFromUrl !== "all") {
      result = result.filter(
        (product) =>
          product.category?.toLowerCase() === categoryFromUrl.toLowerCase()
      );
    }

    if (searchFromUrl.trim()) {
      const search = searchFromUrl.toLowerCase();

      result = result.filter(
        (product) =>
          product.title?.toLowerCase().includes(search) ||
          product.brand?.toLowerCase().includes(search) ||
          product.category?.toLowerCase().includes(search)
      );
    }

    if (sortFromUrl === "priceLow") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortFromUrl === "priceHigh") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortFromUrl === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    if (sortFromUrl === "latest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [products, categoryFromUrl, searchFromUrl, sortFromUrl]);

  const handleClearFilters = () => {
    setSearchParams({});
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-10">
          <div className="h-10 w-64 animate-pulse rounded-xl bg-gray-200"></div>
          <div className="mt-4 h-5 w-96 animate-pulse rounded-xl bg-gray-200"></div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border bg-white shadow-sm"
            >
              <div className="h-64 animate-pulse bg-gray-100"></div>

              <div className="space-y-3 p-5">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                <div className="h-6 w-full animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="rounded-3xl border bg-white p-10 shadow-sm">
          <h1 className="text-3xl font-extrabold text-red-600">
            Products Error
          </h1>

          <p className="mt-3 text-gray-600">{error}</p>

          <button
            type="button"
            onClick={fetchProducts}
            className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-black/5 blur-3xl"></div>
        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-gray-300/40 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              Premium Store Collection
            </span>

            <h1 className="mt-5 text-5xl font-extrabold tracking-tight text-black md:text-6xl">
              Explore Products
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Discover premium products with smooth cart, secure checkout,
              smart coupons, and Razorpay online payment.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-extrabold">
              {filteredProducts.length} Products Found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Use navbar search, category, and sort options to filter products.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {searchFromUrl && (
                <span className="rounded-full bg-gray-100 px-4 py-1 text-xs font-bold text-gray-700">
                  Search: {searchFromUrl}
                </span>
              )}

              {categoryFromUrl !== "all" && (
                <span className="rounded-full bg-black px-4 py-1 text-xs font-bold text-white">
                  Category: {categoryFromUrl}
                </span>
              )}

              {sortFromUrl !== "latest" && (
                <span className="rounded-full bg-gray-100 px-4 py-1 text-xs font-bold text-gray-700">
                  Sort: {sortFromUrl}
                </span>
              )}
            </div>
          </div>

          {(searchFromUrl ||
            categoryFromUrl !== "all" ||
            sortFromUrl !== "latest") && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="rounded-full border px-5 py-2 text-sm font-bold transition-all duration-300 hover:border-black hover:bg-gray-50"
            >
              Clear Filters
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-10 rounded-3xl border bg-white p-12 text-center shadow-sm">
            <div className="text-6xl">🔍</div>

            <h2 className="mt-5 text-2xl font-extrabold">
              No products found
            </h2>

            <p className="mt-2 text-gray-600">
              Try changing search, category, or sort from the navbar.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Products;