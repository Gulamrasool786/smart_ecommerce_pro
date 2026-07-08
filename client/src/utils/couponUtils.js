import { coupons } from "../data/coupons.js";

export const findCoupon = (couponCode) => {
  return coupons.find(
    (coupon) =>
      coupon.code.toLowerCase() === couponCode.trim().toLowerCase()
  );
};

export const validateCoupon = (couponCode, subtotal) => {
  if (!couponCode.trim()) {
    return {
      isValid: false,
      message: "Please enter a coupon code.",
      coupon: null,
    };
  }

  const coupon = findCoupon(couponCode);

  if (!coupon) {
    return {
      isValid: false,
      message: "Invalid coupon code.",
      coupon: null,
    };
  }

  if (subtotal < coupon.minOrder) {
    return {
      isValid: false,
      message: `Minimum order should be ₹${coupon.minOrder} for this coupon.`,
      coupon: null,
    };
  }

  return {
    isValid: true,
    message: "Coupon applied successfully.",
    coupon,
  };
};

export const getDiscountAmount = (subtotal, coupon) => {
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