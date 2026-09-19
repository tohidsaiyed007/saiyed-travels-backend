// // // // const express = require("express");
// // // // const router = express.Router();

// // // // const multer = require("multer");
// // // // const path = require("path");
// // // // const fs = require("fs");

// // // // const {
// // // //   createPaymentRequest,
// // // //   getAllPaymentRequests,
// // // //   getPaymentRequestById,
// // // //   getPendingPaymentCount,
// // // //   rejectPaymentRequest,
// // // // } = require("../controllers/paymentRequestController");

// // // // // ==========================================
// // // // // UPLOAD DIRECTORY
// // // // // ==========================================

// // // // const uploadDir = path.join(
// // // //   __dirname,
// // // //   "../uploads/payment-screenshots"
// // // // );

// // // // if (!fs.existsSync(uploadDir)) {
// // // //   fs.mkdirSync(uploadDir, {
// // // //     recursive: true,
// // // //   });
// // // // }

// // // // // ==========================================
// // // // // MULTER STORAGE
// // // // // ==========================================

// // // // const storage = multer.diskStorage({
// // // //   destination: (req, file, cb) => {
// // // //     cb(null, uploadDir);
// // // //   },

// // // //   filename: (req, file, cb) => {
// // // //     const ext = path.extname(file.originalname);

// // // //     const fileName =
// // // //       "payment-" +
// // // //       Date.now() +
// // // //       "-" +
// // // //       Math.round(Math.random() * 100000) +
// // // //       ext;

// // // //     cb(null, fileName);
// // // //   },
// // // // });

// // // // // ==========================================
// // // // // FILE FILTER
// // // // // ==========================================

// // // // const fileFilter = (req, file, cb) => {
// // // //   const allowedTypes = [
// // // //     "image/jpeg",
// // // //     "image/jpg",
// // // //     "image/png",
// // // //     "image/webp",
// // // //   ];

// // // //   if (allowedTypes.includes(file.mimetype)) {
// // // //     cb(null, true);
// // // //   } else {
// // // //     cb(
// // // //       new Error(
// // // //         "Only JPG, JPEG, PNG and WEBP images are allowed."
// // // //       ),
// // // //       false
// // // //     );
// // // //   }
// // // // };

// // // // // ==========================================
// // // // // MULTER
// // // // // ==========================================

// // // // const upload = multer({
// // // //   storage,
// // // //   fileFilter,
// // // //   limits: {
// // // //     fileSize: 5 * 1024 * 1024,
// // // //   },
// // // // });

// // // // // ==========================================
// // // // // CUSTOMER — CREATE PAYMENT REQUEST
// // // // // ==========================================

// // // // router.post(
// // // //   "/",
// // // //   upload.single("screenshot"),
// // // //   createPaymentRequest
// // // // );

// // // // // ==========================================
// // // // // ADMIN — GET ALL PAYMENT REQUESTS
// // // // // ==========================================

// // // // router.get(
// // // //   "/",
// // // //   getAllPaymentRequests
// // // // );

// // // // // ==========================================
// // // // // ADMIN — PENDING COUNT
// // // // // ==========================================

// // // // router.get(
// // // //   "/pending-count",
// // // //   getPendingPaymentCount
// // // // );

// // // // // ==========================================
// // // // // ADMIN — GET SINGLE REQUEST
// // // // // ==========================================

// // // // router.get(
// // // //   "/:id",
// // // //   getPaymentRequestById
// // // // );

// // // // // ==========================================
// // // // // ADMIN — REJECT REQUEST
// // // // // ==========================================

// // // // router.put(
// // // //   "/:id/reject",
// // // //   rejectPaymentRequest
// // // // );

// // // // module.exports = router;


// // // const express = require("express");
// // // const router = express.Router();

// // // const multer = require("multer");
// // // const path = require("path");
// // // const fs = require("fs");

// // // const {
// // //   createPaymentRequest,
// // //   getAllPaymentRequests,
// // //   getPaymentRequestById,
// // //   getPendingPaymentCount,
// // //   acceptPaymentRequest,
// // //   rejectPaymentRequest,
// // // } = require("../controllers/paymentRequestController");


// // // // =====================================================
// // // // UPLOAD DIRECTORY
// // // // =====================================================

// // // const uploadDir = path.join(
// // //   __dirname,
// // //   "../uploads/payment-screenshots"
// // // );

// // // if (!fs.existsSync(uploadDir)) {
// // //   fs.mkdirSync(uploadDir, {
// // //     recursive: true,
// // //   });
// // // }


// // // // =====================================================
// // // // MULTER STORAGE
// // // // =====================================================

// // // const storage = multer.diskStorage({
// // //   destination: (req, file, cb) => {
// // //     cb(null, uploadDir);
// // //   },

// // //   filename: (req, file, cb) => {
// // //     const ext =
// // //       path.extname(file.originalname);

// // //     const fileName =
// // //       "payment-" +
// // //       Date.now() +
// // //       "-" +
// // //       Math.round(
// // //         Math.random() * 100000
// // //       ) +
// // //       ext;

// // //     cb(null, fileName);
// // //   },
// // // });


// // // // =====================================================
// // // // FILE FILTER
// // // // =====================================================

// // // const fileFilter = (
// // //   req,
// // //   file,
// // //   cb
// // // ) => {
// // //   const allowedTypes = [
// // //     "image/jpeg",
// // //     "image/jpg",
// // //     "image/png",
// // //     "image/webp",
// // //   ];

// // //   if (
// // //     allowedTypes.includes(
// // //       file.mimetype
// // //     )
// // //   ) {
// // //     cb(null, true);
// // //   } else {
// // //     cb(
// // //       new Error(
// // //         "Only JPG, JPEG, PNG and WEBP images are allowed."
// // //       ),
// // //       false
// // //     );
// // //   }
// // // };


// // // // =====================================================
// // // // MULTER CONFIG
// // // // =====================================================

// // // const upload = multer({
// // //   storage,

// // //   fileFilter,

// // //   limits: {
// // //     fileSize:
// // //       5 * 1024 * 1024,
// // //   },
// // // });


// // // // =====================================================
// // // // CREATE PAYMENT REQUEST
// // // // POST /api/payment-requests
// // // // =====================================================

// // // router.post(
// // //   "/",
// // //   upload.single("screenshot"),
// // //   createPaymentRequest
// // // );


// // // // =====================================================
// // // // GET ALL PAYMENT REQUESTS
// // // // GET /api/payment-requests
// // // // =====================================================

// // // router.get(
// // //   "/",
// // //   getAllPaymentRequests
// // // );


// // // // =====================================================
// // // // PENDING PAYMENT COUNT
// // // // GET /api/payment-requests/pending-count
// // // // =====================================================

// // // router.get(
// // //   "/pending-count",
// // //   getPendingPaymentCount
// // // );


// // // // =====================================================
// // // // ACCEPT PAYMENT
// // // // PUT /api/payment-requests/:id/accept
// // // // =====================================================

// // // router.put(
// // //   "/:id/accept",
// // //   acceptPaymentRequest
// // // );


// // // // =====================================================
// // // // REJECT PAYMENT
// // // // PUT /api/payment-requests/:id/reject
// // // // =====================================================

// // // router.put(
// // //   "/:id/reject",
// // //   rejectPaymentRequest
// // // );


// // // // =====================================================
// // // // GET SINGLE PAYMENT REQUEST
// // // // GET /api/payment-requests/:id
// // // // =====================================================

// // // router.get(
// // //   "/:id",
// // //   getPaymentRequestById
// // // );


// // // // =====================================================
// // // // EXPORT
// // // // =====================================================

// // // module.exports = router;


// // const express = require("express");
// // const router = express.Router();

// // const multer = require("multer");
// // const path = require("path");
// // const fs = require("fs");

// // const {
// //   createPaymentRequest,
// //   getAllPaymentRequests,
// //   getPaymentRequestById,
// //   getPendingPaymentCount,
// //   acceptPaymentRequest,
// //   rejectPaymentRequest,
// //   emailAcceptPaymentRequest,
// //   emailRejectPaymentRequest,
// // } = require("../controllers/paymentRequestController");


// // /* =========================================================
// //    UPLOAD DIRECTORY
// // ========================================================= */

// // const uploadDir = path.join(
// //   __dirname,
// //   "../uploads/payment-screenshots"
// // );

// // if (!fs.existsSync(uploadDir)) {
// //   fs.mkdirSync(uploadDir, {
// //     recursive: true,
// //   });
// // }


// // /* =========================================================
// //    MULTER STORAGE
// // ========================================================= */

// // const storage = multer.diskStorage({

// //   destination: (req, file, cb) => {
// //     cb(null, uploadDir);
// //   },

// //   filename: (req, file, cb) => {

// //     const ext =
// //       path.extname(file.originalname);

// //     const fileName =
// //       "payment-" +
// //       Date.now() +
// //       "-" +
// //       Math.round(
// //         Math.random() * 100000
// //       ) +
// //       ext;

// //     cb(null, fileName);
// //   },
// // });


// // /* =========================================================
// //    FILE FILTER
// // ========================================================= */

// // const fileFilter = (
// //   req,
// //   file,
// //   cb
// // ) => {

// //   const allowedTypes = [
// //     "image/jpeg",
// //     "image/jpg",
// //     "image/png",
// //     "image/webp",
// //   ];

// //   if (
// //     allowedTypes.includes(
// //       file.mimetype
// //     )
// //   ) {

// //     cb(null, true);

// //   } else {

// //     cb(
// //       new Error(
// //         "Only JPG, JPEG, PNG and WEBP images are allowed."
// //       ),
// //       false
// //     );
// //   }
// // };


// // /* =========================================================
// //    MULTER
// // ========================================================= */

// // const upload = multer({

// //   storage,

// //   fileFilter,

// //   limits: {
// //     fileSize:
// //       5 * 1024 * 1024,
// //   },

// // });


// // /* =========================================================
// //    CUSTOMER PAYMENT REQUEST
// // ========================================================= */

// // router.post(
// //   "/",
// //   upload.single("screenshot"),
// //   createPaymentRequest
// // );


// // /* =========================================================
// //    ADMIN DASHBOARD
// // ========================================================= */

// // router.get(
// //   "/",
// //   getAllPaymentRequests
// // );


// // /* =========================================================
// //    PENDING COUNT
// // ========================================================= */

// // router.get(
// //   "/pending-count",
// //   getPendingPaymentCount
// // );


// // /* =========================================================
// //    EMAIL ACCEPT
// //    IMPORTANT:
// //    Keep these BEFORE /:id
// // ========================================================= */

// // router.get(
// //   "/:id/email-action/accept",
// //   emailAcceptPaymentRequest
// // );


// // /* =========================================================
// //    EMAIL REJECT
// // ========================================================= */

// // router.get(
// //   "/:id/email-action/reject",
// //   emailRejectPaymentRequest
// // );


// // /* =========================================================
// //    DASHBOARD ACCEPT
// // ========================================================= */

// // router.put(
// //   "/:id/accept",
// //   acceptPaymentRequest
// // );


// // /* =========================================================
// //    DASHBOARD REJECT
// // ========================================================= */

// // router.put(
// //   "/:id/reject",
// //   rejectPaymentRequest
// // );


// // /* =========================================================
// //    SINGLE PAYMENT REQUEST
// // ========================================================= */

// // router.get(
// //   "/:id",
// //   getPaymentRequestById
// // );


// // module.exports = router;









// const express = require("express");
// const router = express.Router();

// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const {
//   protect,
//   adminOnly,
// } = require("../middleware/authMiddleware");

// const {
//   createPaymentRequest,
//   getAllPaymentRequests,
//   getPaymentRequestById,
//   getPendingPaymentCount,
//   acceptPaymentRequest,
//   rejectPaymentRequest,
//   emailAcceptPaymentRequest,
//   emailRejectPaymentRequest,
// } = require("../controllers/paymentRequestController");


// /* =========================================================
//    UPLOAD DIRECTORY
// ========================================================= */

// const uploadDir = path.join(
//   __dirname,
//   "../uploads/payment-screenshots"
// );

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, {
//     recursive: true,
//   });
// }


// /* =========================================================
//    MULTER STORAGE
// ========================================================= */

// const storage = multer.diskStorage({

//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },

//   filename: (req, file, cb) => {

//     const ext =
//       path.extname(file.originalname);

//     const fileName =
//       "payment-" +
//       Date.now() +
//       "-" +
//       Math.round(
//         Math.random() * 100000
//       ) +
//       ext;

//     cb(null, fileName);
//   },

// });


// /* =========================================================
//    FILE FILTER
// ========================================================= */

// const fileFilter = (
//   req,
//   file,
//   cb
// ) => {

//   const allowedTypes = [
//     "image/jpeg",
//     "image/jpg",
//     "image/png",
//     "image/webp",
//   ];

//   if (
//     allowedTypes.includes(
//       file.mimetype
//     )
//   ) {

//     cb(null, true);

//   } else {

//     cb(
//       new Error(
//         "Only JPG, JPEG, PNG and WEBP images are allowed."
//       ),
//       false
//     );

//   }

// };


// /* =========================================================
//    MULTER
// ========================================================= */

// const upload = multer({

//   storage,

//   fileFilter,

//   limits: {
//     fileSize:
//       5 * 1024 * 1024,
//   },

// });


// /* =========================================================
//    CUSTOMER PAYMENT REQUEST
//    Customer can submit payment without admin login
// ========================================================= */

// router.post(
//   "/",
//   upload.single("screenshot"),
//   createPaymentRequest
// );


// /* =========================================================
//    ADMIN DASHBOARD
//    Only logged-in admin can see payment requests
// ========================================================= */

// router.get(
//   "/",
//   protect,
//   adminOnly,
//   getAllPaymentRequests
// );


// /* =========================================================
//    PENDING COUNT
//    Only logged-in admin
// ========================================================= */

// router.get(
//   "/pending-count",
//   protect,
//   adminOnly,
//   getPendingPaymentCount
// );


// /* =========================================================
//    EMAIL ACCEPT
//    IMPORTANT:
//    Keep these BEFORE /:id
//    These use their own email action token
// ========================================================= */

// router.get(
//   "/:id/email-action/accept",
//   emailAcceptPaymentRequest
// );


// /* =========================================================
//    EMAIL REJECT
// ========================================================= */

// router.get(
//   "/:id/email-action/reject",
//   emailRejectPaymentRequest
// );


// /* =========================================================
//    DASHBOARD ACCEPT
//    JWT + ADMIN ONLY
// ========================================================= */

// router.put(
//   "/:id/accept",
//   protect,
//   adminOnly,
//   acceptPaymentRequest
// );


// /* =========================================================
//    DASHBOARD REJECT
//    JWT + ADMIN ONLY
// ========================================================= */

// router.put(
//   "/:id/reject",
//   protect,
//   adminOnly,
//   rejectPaymentRequest
// );


// /* =========================================================
//    SINGLE PAYMENT REQUEST
//    Only logged-in admin
// ========================================================= */

// router.get(
//   "/:id",
//   protect,
//   adminOnly,
//   getPaymentRequestById
// );


// /* =========================================================
//    EXPORT
// ========================================================= */

// module.exports = router;



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