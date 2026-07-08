import { getDiscountAmount } from "./couponUtils.js";

export const getTotalItems = (items) => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

export const getSubtotal = (items) => {
  return items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};

export const getShippingFee = (subtotal, coupon) => {
  if (subtotal === 0) return 0;

  if (coupon?.type === "freeShipping") return 0;

  if (subtotal >= 3000) return 0;

  return 99;
};

export const getGrandTotal = (subtotal, shippingFee, coupon) => {
  const discountAmount = getDiscountAmount(subtotal, coupon);

  return Math.max(subtotal + shippingFee - discountAmount, 0);
};