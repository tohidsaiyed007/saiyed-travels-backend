
const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const {
  createPaymentRequest,
  getAllPaymentRequests,
  getPaymentRequestById,
  getCustomerPaymentStatus,
  getPendingPaymentCount,
  acceptPaymentRequest,
  rejectPaymentRequest,
  emailAcceptPaymentRequest,
  emailRejectPaymentRequest,
} = require("../controllers/paymentRequestController");

// =========================================================
// UPLOAD DIRECTORY
// =========================================================

const uploadDir = path.join(
  __dirname,
  "../uploads/payment-screenshots"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// =========================================================
// MULTER STORAGE
// =========================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(
      file.originalname
    );

    const fileName =
      "payment-" +
      Date.now() +
      "-" +
      Math.round(
        Math.random() * 100000
      ) +
      ext;

    cb(null, fileName);
  },
});

// =========================================================
// FILE FILTER
// =========================================================

const fileFilter = (
  req,
  file,
  cb
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      ),
      false
    );
  }
};

// =========================================================
// MULTER
// =========================================================

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize:
      5 * 1024 * 1024,
  },
});

// =========================================================
// CREATE PAYMENT REQUEST
// CUSTOMER
// =========================================================

router.post(
  "/",
  upload.single("screenshot"),
  createPaymentRequest
);

// =========================================================
// ADMIN - GET ALL PAYMENT REQUESTS
// =========================================================

router.get(
  "/",
  protect,
  adminOnly,
  getAllPaymentRequests
);

// =========================================================
// ADMIN - PENDING COUNT
// =========================================================

router.get(
  "/pending-count",
  protect,
  adminOnly,
  getPendingPaymentCount
);

// =========================================================
// CUSTOMER - CHECK PAYMENT STATUS
//
// IMPORTANT:
// Is route par protect/adminOnly nahi hai.
//
// Customer ka phone isi route ko call karega.
// Admin kisi bhi dusre device se payment accept
// karega aur customer device status dekh lega.
// =========================================================

router.get(
  "/:id/status",
  getCustomerPaymentStatus
);

// =========================================================
// EMAIL ACCEPT
// =========================================================

router.get(
  "/:id/email-action/accept",
  emailAcceptPaymentRequest
);

// =========================================================
// EMAIL REJECT
// =========================================================

router.get(
  "/:id/email-action/reject",
  emailRejectPaymentRequest
);

// =========================================================
// ADMIN - ACCEPT PAYMENT
// =========================================================

router.put(
  "/:id/accept",
  protect,
  adminOnly,
  acceptPaymentRequest
);

// =========================================================
// ADMIN - REJECT PAYMENT
// =========================================================

router.put(
  "/:id/reject",
  protect,
  adminOnly,
  rejectPaymentRequest
);

// =========================================================
// ADMIN - GET SINGLE PAYMENT REQUEST
// =========================================================

router.get(
  "/:id",
  protect,
  adminOnly,
  getPaymentRequestById
);

// =========================================================
// EXPORT
// =========================================================

module.exports = router;