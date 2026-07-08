import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["percentage", "fixed", "freeShipping"],
      required: true,
    },

    value: {
      type: Number,
      default: 0,
    },

    minOrder: {
      type: Number,
      default: 0,
    },

    maxDiscount: {
      type: Number,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;