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
// //   rejectPaymentRequest,
// // } = require("../controllers/paymentRequestController");

// // // ==========================================
// // // UPLOAD DIRECTORY
// // // ==========================================

// // const uploadDir = path.join(
// //   __dirname,
// //   "../uploads/payment-screenshots"
// // );

// // if (!fs.existsSync(uploadDir)) {
// //   fs.mkdirSync(uploadDir, {
// //     recursive: true,
// //   });
// // }

// // // ==========================================
// // // MULTER STORAGE
// // // ==========================================

// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, uploadDir);
// //   },

// //   filename: (req, file, cb) => {
// //     const ext = path.extname(file.originalname);

// //     const fileName =
// //       "payment-" +
// //       Date.now() +
// //       "-" +
// //       Math.round(Math.random() * 100000) +
// //       ext;

// //     cb(null, fileName);
// //   },
// // });

// // // ==========================================
// // // FILE FILTER
// // // ==========================================

// // const fileFilter = (req, file, cb) => {
// //   const allowedTypes = [
// //     "image/jpeg",
// //     "image/jpg",
// //     "image/png",
// //     "image/webp",
// //   ];

// //   if (allowedTypes.includes(file.mimetype)) {
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

// // // ==========================================
// // // MULTER
// // // ==========================================

// // const upload = multer({
// //   storage,
// //   fileFilter,
// //   limits: {
// //     fileSize: 5 * 1024 * 1024,
// //   },
// // });

// // // ==========================================
// // // CUSTOMER — CREATE PAYMENT REQUEST
// // // ==========================================

// // router.post(
// //   "/",
// //   upload.single("screenshot"),
// //   createPaymentRequest
// // );

// // // ==========================================
// // // ADMIN — GET ALL PAYMENT REQUESTS
// // // ==========================================

// // router.get(
// //   "/",
// //   getAllPaymentRequests
// // );

// // // ==========================================
// // // ADMIN — PENDING COUNT
// // // ==========================================

// // router.get(
// //   "/pending-count",
// //   getPendingPaymentCount
// // );

// // // ==========================================
// // // ADMIN — GET SINGLE REQUEST
// // // ==========================================

// // router.get(
// //   "/:id",
// //   getPaymentRequestById
// // );

// // // ==========================================
// // // ADMIN — REJECT REQUEST
// // // ==========================================

// // router.put(
// //   "/:id/reject",
// //   rejectPaymentRequest
// // );

// // module.exports = router;


// const express = require("express");
// const router = express.Router();

// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const {
//   createPaymentRequest,
//   getAllPaymentRequests,
//   getPaymentRequestById,
//   getPendingPaymentCount,
//   acceptPaymentRequest,
//   rejectPaymentRequest,
// } = require("../controllers/paymentRequestController");


// // =====================================================
// // UPLOAD DIRECTORY
// // =====================================================

// const uploadDir = path.join(
//   __dirname,
//   "../uploads/payment-screenshots"
// );

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, {
//     recursive: true,
//   });
// }


// // =====================================================
// // MULTER STORAGE
// // =====================================================

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


// // =====================================================
// // FILE FILTER
// // =====================================================

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


// // =====================================================
// // MULTER CONFIG
// // =====================================================

// const upload = multer({
//   storage,

//   fileFilter,

//   limits: {
//     fileSize:
//       5 * 1024 * 1024,
//   },
// });


// // =====================================================
// // CREATE PAYMENT REQUEST
// // POST /api/payment-requests
// // =====================================================

// router.post(
//   "/",
//   upload.single("screenshot"),
//   createPaymentRequest
// );


// // =====================================================
// // GET ALL PAYMENT REQUESTS
// // GET /api/payment-requests
// // =====================================================

// router.get(
//   "/",
//   getAllPaymentRequests
// );


// // =====================================================
// // PENDING PAYMENT COUNT
// // GET /api/payment-requests/pending-count
// // =====================================================

// router.get(
//   "/pending-count",
//   getPendingPaymentCount
// );


// // =====================================================
// // ACCEPT PAYMENT
// // PUT /api/payment-requests/:id/accept
// // =====================================================

// router.put(
//   "/:id/accept",
//   acceptPaymentRequest
// );


// // =====================================================
// // REJECT PAYMENT
// // PUT /api/payment-requests/:id/reject
// // =====================================================

// router.put(
//   "/:id/reject",
//   rejectPaymentRequest
// );


// // =====================================================
// // GET SINGLE PAYMENT REQUEST
// // GET /api/payment-requests/:id
// // =====================================================

// router.get(
//   "/:id",
//   getPaymentRequestById
// );


// // =====================================================
// // EXPORT
// // =====================================================

// module.exports = router;


const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  createPaymentRequest,
  getAllPaymentRequests,
  getPaymentRequestById,
  getPendingPaymentCount,
  acceptPaymentRequest,
  rejectPaymentRequest,
  emailAcceptPaymentRequest,
  emailRejectPaymentRequest,
} = require("../controllers/paymentRequestController");


/* =========================================================
   UPLOAD DIRECTORY
========================================================= */

const uploadDir = path.join(
  __dirname,
  "../uploads/payment-screenshots"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}


/* =========================================================
   MULTER STORAGE
========================================================= */

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {

    const ext =
      path.extname(file.originalname);

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


/* =========================================================
   FILE FILTER
========================================================= */

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


/* =========================================================
   MULTER
========================================================= */

const upload = multer({

  storage,

  fileFilter,

  limits: {
    fileSize:
      5 * 1024 * 1024,
  },

});


/* =========================================================
   CUSTOMER PAYMENT REQUEST
========================================================= */

router.post(
  "/",
  upload.single("screenshot"),
  createPaymentRequest
);


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

router.get(
  "/",
  getAllPaymentRequests
);


/* =========================================================
   PENDING COUNT
========================================================= */

router.get(
  "/pending-count",
  getPendingPaymentCount
);


/* =========================================================
   EMAIL ACCEPT
   IMPORTANT:
   Keep these BEFORE /:id
========================================================= */

router.get(
  "/:id/email-action/accept",
  emailAcceptPaymentRequest
);


/* =========================================================
   EMAIL REJECT
========================================================= */

router.get(
  "/:id/email-action/reject",
  emailRejectPaymentRequest
);


/* =========================================================
   DASHBOARD ACCEPT
========================================================= */

router.put(
  "/:id/accept",
  acceptPaymentRequest
);


/* =========================================================
   DASHBOARD REJECT
========================================================= */

router.put(
  "/:id/reject",
  rejectPaymentRequest
);


/* =========================================================
   SINGLE PAYMENT REQUEST
========================================================= */

router.get(
  "/:id",
  getPaymentRequestById
);


module.exports = router;