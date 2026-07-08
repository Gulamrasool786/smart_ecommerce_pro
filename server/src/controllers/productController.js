import Product from "../models/Product.js";

// @desc Public get active products
// @route GET /api/products
// @access Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching products",
      error: error.message,
    });
  }
};

// @desc Admin get all products
// @route GET /api/products/admin/all
// @access Admin
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find({}).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching admin products",
      error: error.message,
    });
  }
};

// @desc Get single product
// @route GET /api/products/:id
// @access Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching product",
      error: error.message,
    });
  }
};

// @desc Admin create product
// @route POST /api/products
// @access Admin
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      image,
      category,
      brand,
      stock,
      rating,
    } = req.body;

    if (!title || !description || !price || !image || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required product fields",
      });
    }

    const product = await Product.create({
      title,
      description,
      price,
      image,
      category,
      brand,
      stock,
      rating,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while creating product",
      error: error.message,
    });
  }
};

// @desc Admin update product
// @route PATCH /api/products/:id
// @access Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const fields = [
      "title",
      "description",
      "price",
      "image",
      "category",
      "brand",
      "stock",
      "rating",
      "isActive",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while updating product",
      error: error.message,
    });
  }
};

// @desc Admin soft delete product
// @route DELETE /api/products/:id
// @access Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while deleting product",
      error: error.message,
    });
  }
};