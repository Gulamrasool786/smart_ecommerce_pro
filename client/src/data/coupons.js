export const coupons = [
  {
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minOrder: 999,
    maxDiscount: 300,
    description: "Get 10% off up to ₹300",
  },
  {
    code: "SAVE200",
    type: "fixed",
    value: 200,
    minOrder: 2000,
    description: "Get ₹200 off",
  },
  {
    code: "FREESHIP",
    type: "freeShipping",
    value: 0,
    minOrder: 1500,
    description: "Get free shipping",
  },
];