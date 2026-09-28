const crypto = require("crypto");
const Razorpay = require("razorpay");

// ==========================================
// RAZORPAY CLIENT
// ==========================================

const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing in backend .env"
    );
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

// ==========================================
// CREATE ORDER
// POST /api/bookings/payment/create-order
// ==========================================

const createOrder = async (req, res) => {
  try {
    const { amount, receipt } = req.body;

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid payment amount is required.",
      });
    }

    const razorpay = getRazorpay();

    const options = {
      amount: Math.round(numericAmount * 100),
      currency: "INR",
      receipt:
        receipt ||
        `ST_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    console.log("RAZORPAY ORDER CREATED:", {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });

    return res.status(200).json({
      success: true,
      order,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(
      "RAZORPAY CREATE ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.error?.description ||
        error?.message ||
        "Unable to create Razorpay order.",
    });
  }
};

// ==========================================
// VERIFY PAYMENT
// POST /api/bookings/payment/verify
// ==========================================

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        paymentVerified: false,
        message:
          "Razorpay payment details are incomplete.",
      });
    }

    const secret =
      process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      return res.status(500).json({
        success: false,
        paymentVerified: false,
        message:
          "Razorpay secret key is missing.",
      });
    }

    // ========================================
    // CREATE EXPECTED SIGNATURE
    // ========================================

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          secret
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    // ========================================
    // SAFE SIGNATURE COMPARISON
    // ========================================

    const signatureBuffer =
      Buffer.from(generatedSignature, "utf8");

    const receivedBuffer =
      Buffer.from(
        String(razorpay_signature),
        "utf8"
      );

    if (
      signatureBuffer.length !==
      receivedBuffer.length
    ) {
      console.error(
        "RAZORPAY SIGNATURE LENGTH MISMATCH"
      );

      return res.status(400).json({
        success: false,
        paymentVerified: false,
        message:
          "Payment signature verification failed.",
      });
    }

    const signatureValid =
      crypto.timingSafeEqual(
        signatureBuffer,
        receivedBuffer
      );

    if (!signatureValid) {
      console.error(
        "RAZORPAY INVALID SIGNATURE"
      );

      return res.status(400).json({
        success: false,
        paymentVerified: false,
        message:
          "Payment signature verification failed.",
      });
    }

    console.log(
      "RAZORPAY PAYMENT VERIFIED:",
      razorpay_payment_id
    );

    return res.status(200).json({
      success: true,
      paymentVerified: true,
      message:
        "Payment verified successfully.",
      paymentId:
        razorpay_payment_id,
      orderId:
        razorpay_order_id,
    });
  } catch (error) {
    console.error(
      "RAZORPAY VERIFY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      paymentVerified: false,
      message:
        error?.message ||
        "Unable to verify payment.",
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};