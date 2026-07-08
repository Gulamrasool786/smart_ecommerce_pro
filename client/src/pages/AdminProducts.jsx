import React, { useEffect, useState } from "react";
import api from "../services/api.js";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    category: "",
    brand: "",
    stock: "",
    rating: "",
  });

  const fetchAdminProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/products/admin/all");

      setProducts(data.products);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load admin products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      image: "",
      category: "",
      brand: "",
      stock: "",
      rating: "",
    });

    setEditingProductId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateProductForm = () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.image ||
      !formData.category ||
      !formData.stock
    ) {
      return "Please fill all required product fields.";
    }

    if (Number(formData.price) < 0) {
      return "Price cannot be negative.";
    }

    if (Number(formData.stock) < 0) {
      return "Stock cannot be negative.";
    }

    if (formData.rating && (Number(formData.rating) < 0 || Number(formData.rating) > 5)) {
      return "Rating must be between 0 and 5.";
    }

    return "";
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    const validationError = validateProductForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setFormLoading(true);
      setError("");
      setSuccess("");

      const productData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        image: formData.image,
        category: formData.category,
        brand: formData.brand || "Generic",
        stock: Number(formData.stock),
        rating: Number(formData.rating) || 0,
      };

      if (editingProductId) {
        const { data } = await api.patch(
          `/products/${editingProductId}`,
          productData
        );

        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === editingProductId ? data.product : product
          )
        );

        setSuccess("Product updated successfully.");
      } else {
        const { data } = await api.post("/products", productData);

        setProducts((prevProducts) => [data.product, ...prevProducts]);

        setSuccess("Product created successfully.");
      }

      resetForm();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Product save failed."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);

    setFormData({
      title: product.title || "",
      description: product.description || "",
      price: product.price || "",
      image: product.image || "",
      category: product.category || "",
      brand: product.brand || "",
      stock: product.stock || "",
      rating: product.rating || "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeactivateProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to deactivate this product?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(`/products/${productId}`);

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, isActive: false }
            : product
        )
      );

      setSuccess("Product deactivated successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to deactivate product."
      );
    }
  };

  const handleReactivateProduct = async (productId) => {
    try {
      setError("");
      setSuccess("");

      const { data } = await api.patch(`/products/${productId}`, {
        isActive: true,
      });

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? data.product : product
        )
      );

      setSuccess("Product reactivated successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to reactivate product."
      );
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Loading admin products...</h1>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Products</h1>

        <p className="mt-2 text-gray-600">
          Add, edit, activate, and deactivate products from MongoDB.
        </p>
      </div>

      {error && (
        <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-red-600">
          {error}
        </p>
      )}

      {success && (
        <p className="mb-5 rounded-lg bg-green-50 px-4 py-3 text-green-700">
          {success}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <form
          onSubmit={handleSubmitProduct}
          className="rounded-xl border bg-white p-6 shadow-sm lg:col-span-1"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">
              {editingProductId ? "Edit Product" : "Add Product"}
            </h2>

            {editingProductId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="mt-5 grid gap-4">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Product Title"
              className="rounded-lg border px-4 py-3 outline-none focus:border-black"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="min-h-24 rounded-lg border px-4 py-3 outline-none focus:border-black"
            />

            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="rounded-lg border px-4 py-3 outline-none focus:border-black"
            />

            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="rounded-lg border px-4 py-3 outline-none focus:border-black"
            />

            {formData.image && (
              <img
                src={formData.image}
                alt="Product Preview"
                className="h-40 w-full rounded-lg object-cover"
              />
            )}

            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="rounded-lg border px-4 py-3 outline-none focus:border-black"
            />

            <input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Brand"
              className="rounded-lg border px-4 py-3 outline-none focus:border-black"
            />

            <input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="rounded-lg border px-4 py-3 outline-none focus:border-black"
            />

            <input
              name="rating"
              type="number"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
              placeholder="Rating 0-5"
              className="rounded-lg border px-4 py-3 outline-none focus:border-black"
            />

            <button
              type="submit"
              disabled={formLoading}
              className="rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-500"
            >
              {formLoading
                ? "Saving..."
                : editingProductId
                ? "Update Product"
                : "Add Product"}
            </button>
          </div>
        </form>

        <div className="lg:col-span-2">
          <h2 className="mb-5 text-xl font-semibold">
            All Products ({products.length})
          </h2>

          {products.length === 0 ? (
            <div className="rounded-xl border bg-white p-10 text-center">
              <h3 className="text-2xl font-bold">No products found</h3>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="flex flex-col gap-4 rounded-xl border bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex gap-4">
                    <img
                      src={
                        product.image ||
                        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500"
                      }
                      alt={product.title}
                      className="h-24 w-24 rounded-lg object-cover"
                    />

                    <div>
                      <h3 className="font-bold">{product.title}</h3>

                      <p className="mt-1 text-sm text-gray-600">
                        {product.category} / {product.brand}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        Stock: {product.stock} | Rating: {product.rating}
                      </p>

                      <p className="mt-1 font-semibold">₹{product.price}</p>

                      <p
                        className={`mt-1 text-sm font-medium ${
                          product.isActive
                            ? "text-green-700"
                            : "text-red-600"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEditProduct(product)}
                      className="rounded-lg border px-5 py-2 hover:bg-gray-100"
                    >
                      Edit
                    </button>

                    {product.isActive ? (
                      <button
                        type="button"
                        onClick={() => handleDeactivateProduct(product._id)}
                        className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleReactivateProduct(product._id)}
                        className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AdminProducts;