import dotenv from "dotenv";
import Razorpay from "razorpay";

dotenv.config();

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

console.log("Razorpay Key ID:", keyId);
console.log("Razorpay Secret Loaded:", keySecret ? "YES" : "NO");

if (!keyId || !keySecret) {
  throw new Error(
    "Razorpay keys are missing. Please check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env"
  );
}

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

export default razorpay;