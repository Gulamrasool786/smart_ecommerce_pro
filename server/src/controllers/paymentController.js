import crypto from "crypto";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import razorpay from "../config/razorpay.js";

// @desc Create Razorpay order
// @route POST /api/payments/create-razorpay-order
// @access Private
export const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    console.log("Create Razorpay Order Body:", req.body);

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findById(orderId);

    console.log("Order found for Razorpay:", order);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (order.paymentMethod !== "ONLINE") {
      return res.status(400).json({
        success: false,
        message: "This order is not an online payment order",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    if (!order.grandTotal || order.grandTotal <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount. grandTotal is missing or zero.",
      });
    }

    const amountInPaise = Math.round(Number(order.grandTotal) * 100);

    console.log("Grand Total:", order.grandTotal);
    console.log("Amount in paise:", amountInPaise);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${order._id.toString().slice(-20)}`,
      notes: {
        mongoOrderId: order._id.toString(),
      },
    });

    console.log("Razorpay order created:", razorpayOrder);

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.status(201).json({
      success: true,
      message: "Razorpay order created successfully",
      key: process.env.RAZORPAY_KEY_ID,
      razorpayOrder,
      order,
    });
  } catch (error) {
    console.error("Create Razorpay Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating Razorpay order",
      error: error?.error?.description || error.message,
    });
  }
};

// @desc Verify Razorpay payment
// @route POST /api/payments/verify
// @access Private
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      appOrderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    console.log("Verify payment body:", req.body);

    if (
      !appOrderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification data is missing",
      });
    }

    const order = await Order.findById(appOrderId);

    console.log("Order before payment verify:", order);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order ID mismatch",
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    console.log("Expected Signature:", expectedSignature);
    console.log("Received Signature:", razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      const failedOrder = await Order.findByIdAndUpdate(
        appOrderId,
        {
          $set: {
            paymentStatus: "failed",
          },
        },
        {
          returnDocument: "after",
          runValidators: true,
        }
      );

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
        order: failedOrder,
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        order,
      });
    }

    // ONLINE: reduce stock only after successful payment verification
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // ONLINE: mark coupon used only after successful payment verification
    if (order.couponCode) {
      const coupon = await Coupon.findOne({
        code: order.couponCode,
      });

      if (coupon) {
        const alreadyUsed = coupon.usedBy.some(
          (userId) => userId.toString() === order.user.toString()
        );

        if (!alreadyUsed) {
          coupon.usedBy.push(order.user);
          await coupon.save();
        }
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      appOrderId,
      {
        $set: {
          paymentStatus: "paid",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paidAt: new Date(),
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    console.log("Order after payment verify:", updatedOrder);

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Verify Razorpay Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while verifying payment",
      error: error.message,
    });
  }
};