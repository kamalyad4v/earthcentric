import Razorpay from "razorpay";
import crypto from "crypto";

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "";
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "";

export const isRazorpayConfigured = !!(razorpayKeyId && razorpayKeySecret);

// Initialize Razorpay client. If not configured, we'll use null and execute mock branches
const razorpay = isRazorpayConfigured
  ? new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    })
  : null;

export interface RazorpayOrderParams {
  amount: number; // in paise (e.g. 500 Rs = 50000 paise)
  currency?: string;
  receipt: string;
}

export interface RazorpayOrderResult {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  isMock: boolean;
}

export async function createRazorpayOrder(params: RazorpayOrderParams): Promise<RazorpayOrderResult> {
  const currency = params.currency || "INR";
  
  if (!razorpay) {
    // Simulated order creation
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id: `order_mock_${Math.random().toString(36).substring(2, 15)}`,
      amount: params.amount,
      currency: currency,
      receipt: params.receipt,
      status: "created",
      isMock: true,
    };
  }

  try {
    const order = await razorpay.orders.create({
      amount: params.amount,
      currency: currency,
      receipt: params.receipt,
    });
    
    return {
      id: order.id,
      amount: Number(order.amount),
      currency: typeof order.currency === "string" ? order.currency : "INR",
      receipt: typeof order.receipt === "string" ? order.receipt : params.receipt,
      status: typeof order.status === "string" ? order.status : "created",
      isMock: false,
    };
  } catch (error) {
    console.error("Razorpay order creation failed, falling back to mock:", error);
    return {
      id: `order_mock_${Math.random().toString(36).substring(2, 15)}`,
      amount: params.amount,
      currency: currency,
      receipt: params.receipt,
      status: "created",
      isMock: true,
    };
  }
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (orderId.startsWith("order_mock_")) {
    // If it's a mock order, verify if the payment ID and signature are present
    return !!(paymentId && signature);
  }

  if (!isRazorpayConfigured) return false;

  try {
    const shasum = crypto.createHmac("sha256", razorpayKeySecret);
    shasum.update(`${orderId}|${paymentId}`);
    const digest = shasum.digest("hex");
    return digest === signature;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}
