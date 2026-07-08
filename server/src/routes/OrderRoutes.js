import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/orderController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, adminOnly, getAllOrders);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;