import Coupon from "../models/Coupon.js";

const calculateDiscount = (subtotal, coupon) => {
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

// @desc Admin create coupon
// @route POST /api/coupons
// @access Admin
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      type,
      value,
      minOrder,
      maxDiscount,
    } = req.body;

    if (!code || !description || !type) {
      return res.status(400).json({
        success: false,
        message: "Please provide coupon code, description and type",
      });
    }

    const existingCoupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon already exists",
      });
    }

    const coupon = await Coupon.create({
      code,
      description,
      type,
      value,
      minOrder,
      maxDiscount,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while creating coupon",
      error: error.message,
    });
  }
};

// @desc Validate coupon
// @route POST /api/coupons/validate
// @access Private
export const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (!coupon || !coupon.isActive) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    if (subtotal < coupon.minOrder) {
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

    const discountAmount = calculateDiscount(subtotal, coupon);

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      coupon: {
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        minOrder: coupon.minOrder,
        maxDiscount: coupon.maxDiscount,
      },
      discountAmount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while validating coupon",
      error: error.message,
    });
  }
};

// @desc Admin get all coupons
// @route GET /api/coupons
// @access Admin
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching coupons",
      error: error.message,
    });
  }
};

export { calculateDiscount };