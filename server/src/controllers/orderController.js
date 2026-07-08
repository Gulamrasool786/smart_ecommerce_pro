import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

const calculateCouponDiscount = (subtotal, coupon) => {
  if (!coupon) return 0;

  if (coupon.type === "percentage") {
    const discount = (subtotal * coupon.value) / 100;

    if (coupon.maxDiscount) {
      return Math.min(discount, coupon.maxDiscount);
    }

    return discount;
  }

  if (coupon.type === "fixed") {
    return Math.min(coupon.value, subtotal);
  }

  return 0;
};

const calculateShippingFee = (subtotal, coupon) => {
  if (subtotal === 0) return 0;

  if (coupon?.type === "freeShipping") {
    return 0;
  }

  if (subtotal >= 3000) {
    return 0;
  }

  return 99;
};

// @desc Create new order
// @route POST /api/orders
// @access Private
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items found",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required",
      });
    }

    if (!["COD", "ONLINE"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    const verifiedOrderItems = [];
    let calculatedSubtotal = 0;

    // 1. Verify products and calculate subtotal
    for (const item of orderItems) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid order item data",
        });
      }

      const product = await Product.findById(item.productId);

      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `${item.title || "Product"} is not available.`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} item(s) left for ${product.title}.`,
        });
      }

      verifiedOrderItems.push({
        productId: product._id.toString(),
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: item.quantity,
      });

      calculatedSubtotal += product.price * item.quantity;
    }

    // 2. Validate coupon
    let coupon = null;
    let finalDiscountAmount = 0;

    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
      });

      if (!coupon || !coupon.isActive) {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon code",
        });
      }

      if (calculatedSubtotal < coupon.minOrder) {
        return res.status(400).json({
          success: false,
          message: `Minimum order should be ₹${coupon.minOrder}`,
        });
      }

      const alreadyUsed = coupon.usedBy.some(
        (userId) => userId.toString() === req.user._id.toString()
      );

      if (alreadyUsed) {
        return res.status(400).json({
          success: false,
          message: "You have already used this coupon",
        });
      }

      finalDiscountAmount = calculateCouponDiscount(calculatedSubtotal, coupon);
    }

    // 3. Calculate final totals securely on backend
    const finalShippingFee = calculateShippingFee(calculatedSubtotal, coupon);

    const finalGrandTotal = Math.max(
      calculatedSubtotal + finalShippingFee - finalDiscountAmount,
      0
    );

    // 4. Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems: verifiedOrderItems,
      shippingAddress,
      paymentMethod,
      subtotal: calculatedSubtotal,
      shippingFee: finalShippingFee,
      discountAmount: finalDiscountAmount,
      couponCode: coupon ? coupon.code : null,
      grandTotal: finalGrandTotal,
      paymentStatus: paymentMethod === "COD" ? "pending" : "pending",
    });

    // 5. COD: reduce stock and mark coupon used immediately
    // ONLINE: stock and coupon will be updated only after payment verification
    if (paymentMethod === "COD") {
      for (const item of verifiedOrderItems) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }

      if (coupon) {
        coupon.usedBy.push(req.user._id);
        await coupon.save();
      }
    }

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating order",
      error: error.message,
    });
  }
};

// @desc Get logged-in user's orders
// @route GET /api/orders/my-orders
// @access Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
      error: error.message,
    });
  }
};

// @desc Admin get all orders
// @route GET /api/orders
// @access Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching all orders",
      error: error.message,
    });
  }
};

// @desc Get single order
// @route GET /api/orders/:id
// @access Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email role"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching order",
      error: error.message,
    });
  }
};

// @desc Admin update order status
// @route PATCH /api/orders/:id/status
// @access Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "placed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;

    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating order status",
      error: error.message,
    });
  }
};