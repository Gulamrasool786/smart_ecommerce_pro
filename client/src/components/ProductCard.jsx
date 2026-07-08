import React, { useState } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore.js";
import {
  IndianRupee,
  Star,
} from "lucide-react";

function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [imageError, setImageError] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart({
      ...product,
      id: product._id || product.id,
    });
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-black hover:shadow-2xl">
      <div className="relative overflow-hidden bg-gray-100">
        <Link to={`/products/${product._id || product.id}`}>
          {imageError || !product.image ? (
            <div className="flex h-64 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-6xl">
              🛍️
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.title}
              onError={() => setImageError(true)}
              className="h-64 w-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
            />
          )}
        </Link>

        <div className="absolute left-4 top-4">
          {isOutOfStock ? (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
              Only {product.stock} left
            </span>
          ) : (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
              In Stock
            </span>
          )}
        </div>

        {product.category && (
          <div className="absolute right-4 top-4">
            <span className="rounded-full bg-black px-3 py-1 text-xs font-bold capitalize text-white">
              {product.category}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {product.brand || "Smart Brand"}
          </p>

          <div className="flex items-center gap-1 text-sm font-semibold text-yellow-600">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{product.rating || 4.5}</span>
          </div>
        </div>

        <Link to={`/products/${product._id || product.id}`}>
          <h3 className="line-clamp-2 text-lg font-extrabold text-black transition-colors duration-300 group-hover:text-gray-700">
            {product.title}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
          {product.description || "Premium product with modern design."}
        </p>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-gray-500">Price</p>
            <p className="text-2xl font-extrabold text-black">
              <IndianRupee className="h-5 w-5"/>
              {Number(product.price).toLocaleString("en-IN")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`rounded-full px-5 py-3 text-sm font-bold transition-all duration-300 ${
              isOutOfStock
                ? "cursor-not-allowed bg-gray-200 text-gray-500"
                : "bg-black text-white shadow-md hover:-translate-y-1 hover:bg-gray-800 hover:shadow-xl"
            }`}
          >
            {isOutOfStock ? "Sold Out" : "Add"}
          </button>
        </div>

        <Link
          to={`/products/${product._id || product.id}`}
          className="mt-4 block rounded-full border px-5 py-3 text-center text-sm font-bold text-black transition-all duration-300 hover:border-black hover:bg-gray-50"
        >
          View Full Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;