import express from "express";

import {
  createCoupon,
  validateCoupon,
  getAllCoupons,
} from "../controllers/couponController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/validate", protect, validateCoupon);

router.post("/", protect, adminOnly, createCoupon);
router.get("/", protect, adminOnly, getAllCoupons);

export default router;