// const Razorpay = require("razorpay");
// const crypto = require("crypto");

// // =====================================================
// // RAZORPAY INSTANCE
// // =====================================================

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // =====================================================
// // CREATE ORDER
// // POST /api/bookings/payment/create-order
// // =====================================================

// const createOrder = async (req, res) => {
//   try {
//     const {
//       amount,
//       currency = "INR",
//       receipt,
//       notes = {},
//     } = req.body;

//     // ---------------------------------------------
//     // VALIDATE AMOUNT
//     // ---------------------------------------------

//     const numericAmount = Number(amount);

//     if (
//       !Number.isFinite(numericAmount) ||
//       numericAmount <= 0
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Valid payment amount is required.",
//       });
//     }

//     // ---------------------------------------------
//     // RAZORPAY AMOUNT
//     // INR 1 = 100 paise
//     // ---------------------------------------------

//     const amountInPaise =
//       Math.round(numericAmount * 100);

//     // ---------------------------------------------
//     // RECEIPT
//     // ---------------------------------------------

//     const finalReceipt =
//       receipt ||
//       `ST_${Date.now()}`;

//     // ---------------------------------------------
//     // CREATE RAZORPAY ORDER
//     // ---------------------------------------------

//     const order =
//       await razorpay.orders.create({
//         amount:
//           amountInPaise,

//         currency:
//           currency.toUpperCase(),

//         receipt:
//           finalReceipt,

//         notes,
//       });

//     console.log(
//       "========================================"
//     );

//     console.log(
//       "RAZORPAY ORDER CREATED"
//     );

//     console.log(
//       "Order ID:",
//       order.id
//     );

//     console.log(
//       "Amount:",
//       order.amount
//     );

//     console.log(
//       "Currency:",
//       order.currency
//     );

//     console.log(
//       "========================================"
//     );

//     // ---------------------------------------------
//     // RESPONSE
//     // ---------------------------------------------

//     return res.status(201).json({
//       success: true,

//       message:
//         "Payment order created successfully.",

//       order,
//     });

//   } catch (error) {

//     console.error(
//       "CREATE RAZORPAY ORDER ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,

//       message:
//         error?.error?.description ||
//         error.message ||
//         "Unable to create payment order.",
//     });
//   }
// };

// // =====================================================
// // VERIFY PAYMENT
// // POST /api/bookings/payment/verify
// // =====================================================

// const verifyPayment = async (
//   req,
//   res
// ) => {
//   try {

//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     } = req.body;

//     // ---------------------------------------------
//     // VALIDATION
//     // ---------------------------------------------

//     if (
//       !razorpay_order_id ||
//       !razorpay_payment_id ||
//       !razorpay_signature
//     ) {
//       return res.status(400).json({
//         success: false,

//         paymentVerified: false,

//         message:
//           "Razorpay payment details are required.",
//       });
//     }

//     // ---------------------------------------------
//     // GENERATE SERVER SIGNATURE
//     // ---------------------------------------------

//     const generatedSignature =
//       crypto
//         .createHmac(
//           "sha256",
//           process.env.RAZORPAY_KEY_SECRET
//         )
//         .update(
//           `${razorpay_order_id}|${razorpay_payment_id}`
//         )
//         .digest("hex");

//     // ---------------------------------------------
//     // COMPARE SIGNATURE
//     // ---------------------------------------------

//     const isValid =
//       generatedSignature ===
//       razorpay_signature;

//     if (!isValid) {

//       console.error(
//         "RAZORPAY SIGNATURE INVALID"
//       );

//       return res.status(400).json({
//         success: false,

//         paymentVerified: false,

//         message:
//           "Payment verification failed.",
//       });
//     }

//     // ---------------------------------------------
//     // SIGNATURE VERIFIED
//     // ---------------------------------------------

//     console.log(
//       "========================================"
//     );

//     console.log(
//       "RAZORPAY PAYMENT VERIFIED"
//     );

//     console.log(
//       "Order ID:",
//       razorpay_order_id
//     );

//     console.log(
//       "Payment ID:",
//       razorpay_payment_id
//     );

//     console.log(
//       "========================================"
//     );

//     // ---------------------------------------------
//     // OPTIONAL: FETCH PAYMENT FROM RAZORPAY
//     // ---------------------------------------------

//     let payment = null;

//     try {

//       payment =
//         await razorpay.payments.fetch(
//           razorpay_payment_id
//         );

//     } catch (fetchError) {

//       console.error(
//         "RAZORPAY PAYMENT FETCH ERROR:",
//         fetchError
//       );
//     }

//     // ---------------------------------------------
//     // CHECK PAYMENT STATUS
//     // ---------------------------------------------

//     if (
//       payment &&
//       payment.status &&
//       ![
//         "captured",
//         "authorized",
//       ].includes(
//         payment.status
//       )
//     ) {

//       return res.status(400).json({
//         success: false,

//         paymentVerified: false,

//         paymentStatus:
//           payment.status,

//         message:
//           `Payment is not successful. Current status: ${payment.status}`,
//       });
//     }

//     // ---------------------------------------------
//     // PAYMENT SUCCESS
//     // ---------------------------------------------

//     return res.status(200).json({

//       success: true,

//       paymentVerified: true,

//       paymentStatus:
//         payment?.status ||
//         "captured",

//       razorpay_order_id,

//       razorpay_payment_id,

//       razorpay_signature,

//       payment,

//       message:
//         "Payment verified successfully.",
//     });

//   } catch (error) {

//     console.error(
//       "VERIFY RAZORPAY PAYMENT ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,

//       paymentVerified: false,

//       message:
//         error.message ||
//         "Unable to verify payment.",
//     });
//   }
// };

// // =====================================================
// // WEBHOOK
// // POST /api/bookings/payment/webhook
// // =====================================================

// const webhook = async (
//   req,
//   res
// ) => {
//   try {

//     const webhookSecret =
//       process.env.RAZORPAY_WEBHOOK_SECRET;

//     const receivedSignature =
//       req.headers[
//         "x-razorpay-signature"
//       ];

//     if (!webhookSecret) {

//       console.error(
//         "RAZORPAY_WEBHOOK_SECRET is not configured."
//       );

//       return res.status(500).json({
//         success: false,
//         message:
//           "Webhook secret is not configured.",
//       });
//     }

//     if (!receivedSignature) {

//       return res.status(400).json({
//         success: false,
//         message:
//           "Webhook signature is missing.",
//       });
//     }

//     // IMPORTANT:
//     // Webhook signature must be calculated from
//     // the RAW request body.
//     const rawBody =
//       Buffer.isBuffer(req.body)
//         ? req.body
//         : Buffer.from(
//             JSON.stringify(req.body)
//           );

//     const expectedSignature =
//       crypto
//         .createHmac(
//           "sha256",
//           webhookSecret
//         )
//         .update(rawBody)
//         .digest("hex");

//     const validSignature =
//       crypto.timingSafeEqual(
//         Buffer.from(
//           expectedSignature
//         ),
//         Buffer.from(
//           receivedSignature
//         )
//       );

//     if (!validSignature) {

//       console.error(
//         "INVALID RAZORPAY WEBHOOK SIGNATURE"
//       );

//       return res.status(400).json({
//         success: false,
//         message:
//           "Invalid webhook signature.",
//       });
//     }

//     // ---------------------------------------------
//     // PARSE EVENT
//     // ---------------------------------------------

//     const payload =
//       JSON.parse(
//         rawBody.toString()
//       );

//     const event =
//       payload?.event;

//     console.log(
//       "========================================"
//     );

//     console.log(
//       "RAZORPAY WEBHOOK:"
//     );

//     console.log(
//       "Event:",
//       event
//     );

//     console.log(
//       "========================================"
//     );

//     // ---------------------------------------------
//     // PAYMENT CAPTURED
//     // ---------------------------------------------

//     if (
//       event ===
//       "payment.captured"
//     ) {

//       const payment =
//         payload?.payload
//           ?.payment
//           ?.entity;

//       console.log(
//         "PAYMENT CAPTURED:",
//         payment?.id
//       );

//       /*
//         IMPORTANT

//         Yahan future me hum order_id ke basis par
//         booking ko automatically Confirm kar sakte hain.

//         Example:

//         const orderId = payment?.order_id;

//         await Booking.findOneAndUpdate(
//           {
//             razorpayOrderId: orderId
//           },
//           {
//             paymentStatus: "Paid",
//             paymentVerified: true,
//             bookingStatus: "Confirmed"
//           }
//         );
//       */
//     }

//     // ---------------------------------------------
//     // ORDER PAID
//     // ---------------------------------------------

//     if (
//       event ===
//       "order.paid"
//     ) {

//       const order =
//         payload?.payload
//           ?.order
//           ?.entity;

//       console.log(
//         "ORDER PAID:",
//         order?.id
//       );

//       /*
//         Booking confirmation logic can be placed here
//         after we store razorpayOrderId with the booking.
//       */
//     }

//     // ---------------------------------------------
//     // PAYMENT FAILED
//     // ---------------------------------------------

//     if (
//       event ===
//       "payment.failed"
//     ) {

//       const payment =
//         payload?.payload
//           ?.payment
//           ?.entity;

//       console.log(
//         "PAYMENT FAILED:",
//         payment?.id
//       );
//     }

//     // ---------------------------------------------
//     // RESPONSE
//     // ---------------------------------------------

//     return res.status(200).json({
//       success: true,
//       received: true,
//     });

//   } catch (error) {

//     console.error(
//       "RAZORPAY WEBHOOK ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "Webhook processing failed.",
//     });
//   }
// };

// // =====================================================
// // EXPORT
// // =====================================================

// module.exports = {
//   createOrder,
//   verifyPayment,
//   webhook,
// };











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