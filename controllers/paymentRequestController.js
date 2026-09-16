// // // // // const PaymentRequest = require("../models/PaymentRequest");

// // // // // // ==========================================
// // // // // // CUSTOMER — CREATE PAYMENT REQUEST
// // // // // // ==========================================

// // // // // const createPaymentRequest = async (req, res) => {
// // // // //   try {
// // // // //     const {
// // // // //       bookingData,
// // // // //       amount,
// // // // //       bankName,
// // // // //       paymentId,
// // // // //       paymentDateTime,
// // // // //       customerEmail,
// // // // //     } = req.body;

// // // // //     if (
// // // // //       !bookingData ||
// // // // //       !amount ||
// // // // //       !bankName ||
// // // // //       !paymentId ||
// // // // //       !paymentDateTime ||
// // // // //       !customerEmail
// // // // //     ) {
// // // // //       return res.status(400).json({
// // // // //         success: false,
// // // // //         message: "All payment details are required.",
// // // // //       });
// // // // //     }

// // // // //     if (
// // // // //       !["ICICI Bank", "Bank of Baroda"].includes(bankName)
// // // // //     ) {
// // // // //       return res.status(400).json({
// // // // //         success: false,
// // // // //         message: "Invalid bank selected.",
// // // // //       });
// // // // //     }

// // // // //     if (!req.file) {
// // // // //       return res.status(400).json({
// // // // //         success: false,
// // // // //         message: "Payment screenshot is required.",
// // // // //       });
// // // // //     }

// // // // //     const paymentRequest = await PaymentRequest.create({
// // // // //       bookingData: JSON.parse(bookingData),

// // // // //       amount: Number(amount),

// // // // //       bankName,

// // // // //       paymentId: paymentId.trim(),

// // // // //       screenshot: `/uploads/payment-screenshots/${req.file.filename}`,

// // // // //       paymentDateTime: new Date(paymentDateTime),

// // // // //       customerEmail: customerEmail
// // // // //         .trim()
// // // // //         .toLowerCase(),

// // // // //       status: "Pending",
// // // // //     });

// // // // //     return res.status(201).json({
// // // // //       success: true,
// // // // //       message: "Payment request submitted successfully.",
// // // // //       paymentRequest,
// // // // //     });
// // // // //   } catch (error) {
// // // // //     console.error(
// // // // //       "CREATE PAYMENT REQUEST ERROR:",
// // // // //       error
// // // // //     );

// // // // //     return res.status(500).json({
// // // // //       success: false,
// // // // //       message:
// // // // //         error.message ||
// // // // //         "Failed to create payment request.",
// // // // //     });
// // // // //   }
// // // // // };

// // // // // // ==========================================
// // // // // // ADMIN — GET ALL PAYMENT REQUESTS
// // // // // // ==========================================

// // // // // const getAllPaymentRequests = async (req, res) => {
// // // // //   try {
// // // // //     const requests = await PaymentRequest.find()
// // // // //       .populate("approvedBookingId")
// // // // //       .sort({ createdAt: -1 });

// // // // //     return res.status(200).json({
// // // // //       success: true,
// // // // //       count: requests.length,
// // // // //       requests,
// // // // //     });
// // // // //   } catch (error) {
// // // // //     console.error(
// // // // //       "GET PAYMENT REQUESTS ERROR:",
// // // // //       error
// // // // //     );

// // // // //     return res.status(500).json({
// // // // //       success: false,
// // // // //       message:
// // // // //         error.message ||
// // // // //         "Failed to get payment requests.",
// // // // //     });
// // // // //   }
// // // // // };

// // // // // // ==========================================
// // // // // // ADMIN — GET SINGLE PAYMENT REQUEST
// // // // // // ==========================================

// // // // // const getPaymentRequestById = async (req, res) => {
// // // // //   try {
// // // // //     const request = await PaymentRequest.findById(
// // // // //       req.params.id
// // // // //     ).populate("approvedBookingId");

// // // // //     if (!request) {
// // // // //       return res.status(404).json({
// // // // //         success: false,
// // // // //         message: "Payment request not found.",
// // // // //       });
// // // // //     }

// // // // //     return res.status(200).json({
// // // // //       success: true,
// // // // //       request,
// // // // //     });
// // // // //   } catch (error) {
// // // // //     console.error(
// // // // //       "GET PAYMENT REQUEST ERROR:",
// // // // //       error
// // // // //     );

// // // // //     return res.status(500).json({
// // // // //       success: false,
// // // // //       message:
// // // // //         error.message ||
// // // // //         "Failed to get payment request.",
// // // // //     });
// // // // //   }
// // // // // };

// // // // // // ==========================================
// // // // // // ADMIN — PENDING PAYMENT COUNT
// // // // // // ==========================================

// // // // // const getPendingPaymentCount = async (req, res) => {
// // // // //   try {
// // // // //     const count =
// // // // //       await PaymentRequest.countDocuments({
// // // // //         status: "Pending",
// // // // //       });

// // // // //     return res.status(200).json({
// // // // //       success: true,
// // // // //       count,
// // // // //     });
// // // // //   } catch (error) {
// // // // //     console.error(
// // // // //       "PENDING PAYMENT COUNT ERROR:",
// // // // //       error
// // // // //     );

// // // // //     return res.status(500).json({
// // // // //       success: false,
// // // // //       message:
// // // // //         error.message ||
// // // // //         "Failed to get pending payment count.",
// // // // //     });
// // // // //   }
// // // // // };

// // // // // // ==========================================
// // // // // // ADMIN — REJECT PAYMENT REQUEST
// // // // // // ==========================================

// // // // // const rejectPaymentRequest = async (req, res) => {
// // // // //   try {
// // // // //     const { adminNote } = req.body;

// // // // //     const request = await PaymentRequest.findById(
// // // // //       req.params.id
// // // // //     );

// // // // //     if (!request) {
// // // // //       return res.status(404).json({
// // // // //         success: false,
// // // // //         message: "Payment request not found.",
// // // // //       });
// // // // //     }

// // // // //     if (request.status !== "Pending") {
// // // // //       return res.status(400).json({
// // // // //         success: false,
// // // // //         message:
// // // // //           `Payment request is already ${request.status}.`,
// // // // //       });
// // // // //     }

// // // // //     request.status = "Rejected";

// // // // //     request.adminNote =
// // // // //       adminNote ||
// // // // //       "Payment rejected by admin.";

// // // // //     request.processedAt = new Date();

// // // // //     await request.save();

// // // // //     return res.status(200).json({
// // // // //       success: true,
// // // // //       message:
// // // // //         "Payment request rejected successfully.",
// // // // //       request,
// // // // //     });
// // // // //   } catch (error) {
// // // // //     console.error(
// // // // //       "REJECT PAYMENT REQUEST ERROR:",
// // // // //       error
// // // // //     );

// // // // //     return res.status(500).json({
// // // // //       success: false,
// // // // //       message:
// // // // //         error.message ||
// // // // //         "Failed to reject payment request.",
// // // // //     });
// // // // //   }
// // // // // };

// // // // // // ==========================================
// // // // // // EXPORTS
// // // // // // ==========================================

// // // // // module.exports = {
// // // // //   createPaymentRequest,
// // // // //   getAllPaymentRequests,
// // // // //   getPaymentRequestById,
// // // // //   getPendingPaymentCount,
// // // // //   rejectPaymentRequest,
// // // // // };


// // // // const PaymentRequest = require("../models/PaymentRequest");
// // // // const bookingController = require("./bookingController");

// // // // // =====================================================
// // // // // CREATE PAYMENT REQUEST
// // // // // POST /api/payment-requests
// // // // // =====================================================

// // // // const createPaymentRequest = async (req, res) => {
// // // //   try {
// // // //     const {
// // // //       bookingData,
// // // //       amount,
// // // //       bankName,
// // // //       paymentId,
// // // //       paymentDateTime,
// // // //       customerEmail,
// // // //     } = req.body;

// // // //     // -----------------------------------------
// // // //     // REQUIRED FIELDS
// // // //     // -----------------------------------------

// // // //     if (
// // // //       !bookingData ||
// // // //       amount === undefined ||
// // // //       amount === null ||
// // // //       !bankName ||
// // // //       !paymentId ||
// // // //       !paymentDateTime ||
// // // //       !customerEmail
// // // //     ) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: "All payment details are required.",
// // // //       });
// // // //     }

// // // //     // -----------------------------------------
// // // //     // BANK VALIDATION
// // // //     // -----------------------------------------

// // // //     if (
// // // //       !["ICICI Bank", "Bank of Baroda"].includes(
// // // //         bankName
// // // //       )
// // // //     ) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: "Invalid bank selected.",
// // // //       });
// // // //     }

// // // //     // -----------------------------------------
// // // //     // SCREENSHOT VALIDATION
// // // //     // -----------------------------------------

// // // //     if (!req.file) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: "Payment screenshot is required.",
// // // //       });
// // // //     }

// // // //     // -----------------------------------------
// // // //     // PARSE BOOKING DATA
// // // //     // -----------------------------------------

// // // //     let parsedBookingData;

// // // //     try {
// // // //       parsedBookingData =
// // // //         typeof bookingData === "string"
// // // //           ? JSON.parse(bookingData)
// // // //           : bookingData;
// // // //     } catch (error) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: "Invalid booking data.",
// // // //       });
// // // //     }

// // // //     // -----------------------------------------
// // // //     // PAYMENT DATE VALIDATION
// // // //     // -----------------------------------------

// // // //     const paymentDate = new Date(
// // // //       paymentDateTime
// // // //     );

// // // //     if (Number.isNaN(paymentDate.getTime())) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: "Invalid payment date/time.",
// // // //       });
// // // //     }

// // // //     // -----------------------------------------
// // // //     // CREATE REQUEST
// // // //     // -----------------------------------------

// // // //     const paymentRequest =
// // // //       await PaymentRequest.create({
// // // //         bookingData: parsedBookingData,

// // // //         amount: Number(amount),

// // // //         bankName,

// // // //         paymentId:
// // // //           String(paymentId).trim(),

// // // //         screenshot:
// // // //           `/uploads/payment-screenshots/${req.file.filename}`,

// // // //         paymentDateTime: paymentDate,

// // // //         customerEmail:
// // // //           String(customerEmail)
// // // //             .trim()
// // // //             .toLowerCase(),

// // // //         status: "Pending",

// // // //         adminNote: "",

// // // //         approvedBookingId: null,

// // // //         processedAt: null,
// // // //       });

// // // //     // -----------------------------------------
// // // //     // RESPONSE
// // // //     // -----------------------------------------

// // // //     return res.status(201).json({
// // // //       success: true,

// // // //       message:
// // // //         "Payment request submitted successfully. Waiting for admin verification.",

// // // //       paymentRequest,
// // // //     });
// // // //   } catch (error) {
// // // //     console.error(
// // // //       "CREATE PAYMENT REQUEST ERROR:",
// // // //       error
// // // //     );

// // // //     return res.status(500).json({
// // // //       success: false,

// // // //       message:
// // // //         error.message ||
// // // //         "Failed to create payment request.",
// // // //     });
// // // //   }
// // // // };


// // // // // =====================================================
// // // // // GET ALL PAYMENT REQUESTS
// // // // // GET /api/payment-requests
// // // // // =====================================================

// // // // const getAllPaymentRequests = async (
// // // //   req,
// // // //   res
// // // // ) => {
// // // //   try {
// // // //     const requests =
// // // //       await PaymentRequest.find()
// // // //         .populate("approvedBookingId")
// // // //         .sort({
// // // //           createdAt: -1,
// // // //         });

// // // //     return res.status(200).json({
// // // //       success: true,

// // // //       count:
// // // //         requests.length,

// // // //       requests,
// // // //     });
// // // //   } catch (error) {
// // // //     console.error(
// // // //       "GET PAYMENT REQUESTS ERROR:",
// // // //       error
// // // //     );

// // // //     return res.status(500).json({
// // // //       success: false,

// // // //       message:
// // // //         error.message ||
// // // //         "Failed to get payment requests.",
// // // //     });
// // // //   }
// // // // };


// // // // // =====================================================
// // // // // GET SINGLE PAYMENT REQUEST
// // // // // GET /api/payment-requests/:id
// // // // // =====================================================

// // // // const getPaymentRequestById =
// // // //   async (req, res) => {
// // // //     try {
// // // //       const request =
// // // //         await PaymentRequest.findById(
// // // //           req.params.id
// // // //         ).populate(
// // // //           "approvedBookingId"
// // // //         );

// // // //       if (!request) {
// // // //         return res.status(404).json({
// // // //           success: false,
// // // //           message:
// // // //             "Payment request not found.",
// // // //         });
// // // //       }

// // // //       return res.status(200).json({
// // // //         success: true,
// // // //         request,
// // // //       });
// // // //     } catch (error) {
// // // //       console.error(
// // // //         "GET PAYMENT REQUEST ERROR:",
// // // //         error
// // // //       );

// // // //       return res.status(500).json({
// // // //         success: false,

// // // //         message:
// // // //           error.message ||
// // // //           "Failed to get payment request.",
// // // //       });
// // // //     }
// // // //   };


// // // // // =====================================================
// // // // // GET PENDING PAYMENT COUNT
// // // // // GET /api/payment-requests/pending-count
// // // // // =====================================================

// // // // const getPendingPaymentCount =
// // // //   async (req, res) => {
// // // //     try {
// // // //       const count =
// // // //         await PaymentRequest.countDocuments({
// // // //           status: "Pending",
// // // //         });

// // // //       return res.status(200).json({
// // // //         success: true,
// // // //         count,
// // // //       });
// // // //     } catch (error) {
// // // //       console.error(
// // // //         "PENDING PAYMENT COUNT ERROR:",
// // // //         error
// // // //       );

// // // //       return res.status(500).json({
// // // //         success: false,

// // // //         message:
// // // //           error.message ||
// // // //           "Failed to get pending payment count.",
// // // //       });
// // // //     }
// // // //   };


// // // // // =====================================================
// // // // // ACCEPT PAYMENT REQUEST
// // // // // PUT /api/payment-requests/:id/accept
// // // // // =====================================================

// // // // const acceptPaymentRequest =
// // // //   async (req, res) => {
// // // //     try {
// // // //       const {
// // // //         adminNote,
// // // //       } = req.body || {};

// // // //       // -----------------------------------------
// // // //       // FIND REQUEST
// // // //       // -----------------------------------------

// // // //       const request =
// // // //         await PaymentRequest.findById(
// // // //           req.params.id
// // // //         );

// // // //       if (!request) {
// // // //         return res.status(404).json({
// // // //           success: false,

// // // //           message:
// // // //             "Payment request not found.",
// // // //         });
// // // //       }

// // // //       // -----------------------------------------
// // // //       // ONLY PENDING CAN BE ACCEPTED
// // // //       // -----------------------------------------

// // // //       if (
// // // //         request.status !==
// // // //         "Pending"
// // // //       ) {
// // // //         return res.status(400).json({
// // // //           success: false,

// // // //           message:
// // // //             `Payment request is already ${request.status}.`,
// // // //         });
// // // //       }

// // // //       // -----------------------------------------
// // // //       // BOOKING DATA
// // // //       // -----------------------------------------

// // // //       if (
// // // //         !request.bookingData
// // // //       ) {
// // // //         return res.status(400).json({
// // // //           success: false,

// // // //           message:
// // // //             "Booking data is missing from payment request.",
// // // //         });
// // // //       }

// // // //       // -----------------------------------------
// // // //       // COPY BOOKING DATA
// // // //       // -----------------------------------------

// // // //       const bookingData =
// // // //         JSON.parse(
// // // //           JSON.stringify(
// // // //             request.bookingData
// // // //           )
// // // //         );

// // // //       // -----------------------------------------
// // // //       // FORCE VERIFIED PAYMENT
// // // //       // -----------------------------------------

// // // //       bookingData.paymentVerified =
// // // //         true;

// // // //       bookingData.paymentStatus =
// // // //         "Paid";

// // // //       bookingData.bookingStatus =
// // // //         "Confirmed";

// // // //       bookingData.paymentMethod =
// // // //         request.bankName;

// // // //       bookingData.paymentId =
// // // //         request.paymentId;

// // // //       // -----------------------------------------
// // // //       // IMPORTANT
// // // //       // ADMIN ACCEPTED PAYMENT
// // // //       // -----------------------------------------

// // // //       bookingData.role =
// // // //         "admin";

// // // //       bookingData.userRole =
// // // //         "admin";

// // // //       bookingData.accountType =
// // // //         "admin";

// // // //       // -----------------------------------------
// // // //       // FAKE RESPONSE OBJECT
// // // //       //
// // // //       // Existing createBooking controller
// // // //       // will create the actual booking,
// // // //       // assign Booking ID and PNR,
// // // //       // and mark the flight ticket Booked.
// // // //       // -----------------------------------------

// // // //       let bookingResult = null;

// // // //       const fakeResponse = {
// // // //         statusCode: 200,

// // // //         status(code) {
// // // //           this.statusCode =
// // // //             code;

// // // //           return this;
// // // //         },

// // // //         json(data) {
// // // //           bookingResult =
// // // //             data;

// // // //           return this;
// // // //         },

// // // //         send(data) {
// // // //           bookingResult =
// // // //             data;

// // // //           return this;
// // // //         },
// // // //       };

// // // //       // -----------------------------------------
// // // //       // CALL EXISTING BOOKING CONTROLLER
// // // //       // -----------------------------------------

// // // //       await bookingController.createBooking(
// // // //         {
// // // //           body: bookingData,

// // // //           user: {
// // // //             role: "admin",
// // // //           },

// // // //           headers:
// // // //             req.headers || {},
// // // //         },
// // // //         fakeResponse
// // // //       );

// // // //       // -----------------------------------------
// // // //       // CHECK BOOKING RESULT
// // // //       // -----------------------------------------

// // // //       if (
// // // //         !bookingResult ||
// // // //         !bookingResult.success
// // // //       ) {
// // // //         console.error(
// // // //           "ACCEPT PAYMENT BOOKING ERROR:",
// // // //           bookingResult
// // // //         );

// // // //         return res.status(
// // // //           bookingResult?.statusCode ||
// // // //             400
// // // //         ).json({
// // // //           success: false,

// // // //           message:
// // // //             bookingResult?.message ||
// // // //             "Unable to create confirmed booking.",
// // // //         });
// // // //       }

// // // //       // -----------------------------------------
// // // //       // GET CREATED BOOKING
// // // //       // -----------------------------------------

// // // //       const createdBooking =
// // // //         bookingResult.booking;

// // // //       if (
// // // //         !createdBooking ||
// // // //         !createdBooking._id
// // // //       ) {
// // // //         return res.status(500).json({
// // // //           success: false,

// // // //           message:
// // // //             "Booking was created but booking details were not returned.",
// // // //         });
// // // //       }

// // // //       // -----------------------------------------
// // // //       // UPDATE PAYMENT REQUEST
// // // //       // -----------------------------------------

// // // //       request.status =
// // // //         "Accepted";

// // // //       request.approvedBookingId =
// // // //         createdBooking._id;

// // // //       request.adminNote =
// // // //         adminNote ||
// // // //         "Payment verified and booking confirmed by admin.";

// // // //       request.processedAt =
// // // //         new Date();

// // // //       await request.save();

// // // //       // -----------------------------------------
// // // //       // SUCCESS
// // // //       // -----------------------------------------

// // // //       return res.status(200).json({
// // // //         success: true,

// // // //         message:
// // // //           "Payment accepted and booking confirmed successfully.",

// // // //         paymentRequest:
// // // //           request,

// // // //         booking:
// // // //           createdBooking,
// // // //       });
// // // //     } catch (error) {
// // // //       console.error(
// // // //         "ACCEPT PAYMENT REQUEST ERROR:",
// // // //         error
// // // //       );

// // // //       return res.status(500).json({
// // // //         success: false,

// // // //         message:
// // // //           error.message ||
// // // //           "Failed to accept payment request.",
// // // //       });
// // // //     }
// // // //   };


// // // // // =====================================================
// // // // // REJECT PAYMENT REQUEST
// // // // // PUT /api/payment-requests/:id/reject
// // // // // =====================================================

// // // // const rejectPaymentRequest =
// // // //   async (req, res) => {
// // // //     try {
// // // //       const {
// // // //         adminNote,
// // // //       } = req.body || {};

// // // //       // -----------------------------------------
// // // //       // FIND REQUEST
// // // //       // -----------------------------------------

// // // //       const request =
// // // //         await PaymentRequest.findById(
// // // //           req.params.id
// // // //         );

// // // //       if (!request) {
// // // //         return res.status(404).json({
// // // //           success: false,

// // // //           message:
// // // //             "Payment request not found.",
// // // //         });
// // // //       }

// // // //       // -----------------------------------------
// // // //       // ONLY PENDING CAN BE REJECTED
// // // //       // -----------------------------------------

// // // //       if (
// // // //         request.status !==
// // // //         "Pending"
// // // //       ) {
// // // //         return res.status(400).json({
// // // //           success: false,

// // // //           message:
// // // //             `Payment request is already ${request.status}.`,
// // // //         });
// // // //       }

// // // //       // -----------------------------------------
// // // //       // REJECT
// // // //       // -----------------------------------------

// // // //       request.status =
// // // //         "Rejected";

// // // //       request.adminNote =
// // // //         adminNote ||
// // // //         "Payment rejected by admin.";

// // // //       request.processedAt =
// // // //         new Date();

// // // //       request.approvedBookingId =
// // // //         null;

// // // //       await request.save();

// // // //       // -----------------------------------------
// // // //       // RESPONSE
// // // //       // -----------------------------------------

// // // //       return res.status(200).json({
// // // //         success: true,

// // // //         message:
// // // //           "Payment request rejected successfully.",

// // // //         request,
// // // //       });
// // // //     } catch (error) {
// // // //       console.error(
// // // //         "REJECT PAYMENT REQUEST ERROR:",
// // // //         error
// // // //       );

// // // //       return res.status(500).json({
// // // //         success: false,

// // // //         message:
// // // //           error.message ||
// // // //           "Failed to reject payment request.",
// // // //       });
// // // //     }
// // // //   };


// // // // // =====================================================
// // // // // EXPORT
// // // // // =====================================================

// // // // module.exports = {
// // // //   createPaymentRequest,

// // // //   getAllPaymentRequests,

// // // //   getPaymentRequestById,

// // // //   getPendingPaymentCount,

// // // //   acceptPaymentRequest,

// // // //   rejectPaymentRequest,
// // // // };


// // // const PaymentRequest = require("../models/PaymentRequest");
// // // const bookingController = require("./bookingController");

// // // // =====================================================
// // // // EMAIL SERVICE
// // // // =====================================================

// // // const {
// // //   sendAdminPaymentNotification,
// // // } = require("../services/emailService");


// // // // =====================================================
// // // // CREATE PAYMENT REQUEST
// // // // POST /api/payment-requests
// // // // =====================================================

// // // const createPaymentRequest = async (req, res) => {
// // //   try {

// // //     const {
// // //       bookingData,
// // //       amount,
// // //       bankName,
// // //       paymentId,
// // //       paymentDateTime,
// // //       customerEmail,
// // //     } = req.body;


// // //     // -----------------------------------------
// // //     // REQUIRED FIELDS
// // //     // -----------------------------------------

// // //     if (
// // //       !bookingData ||
// // //       amount === undefined ||
// // //       amount === null ||
// // //       !bankName ||
// // //       !paymentId ||
// // //       !paymentDateTime ||
// // //       !customerEmail
// // //     ) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "All payment details are required.",
// // //       });
// // //     }


// // //     // -----------------------------------------
// // //     // BANK VALIDATION
// // //     // -----------------------------------------

// // //     if (
// // //       !["ICICI Bank", "Bank of Baroda"].includes(
// // //         bankName
// // //       )
// // //     ) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "Invalid bank selected.",
// // //       });
// // //     }


// // //     // -----------------------------------------
// // //     // SCREENSHOT VALIDATION
// // //     // -----------------------------------------

// // //     if (!req.file) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "Payment screenshot is required.",
// // //       });
// // //     }


// // //     // -----------------------------------------
// // //     // PARSE BOOKING DATA
// // //     // -----------------------------------------

// // //     let parsedBookingData;

// // //     try {

// // //       parsedBookingData =
// // //         typeof bookingData === "string"
// // //           ? JSON.parse(bookingData)
// // //           : bookingData;

// // //     } catch (error) {

// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "Invalid booking data.",
// // //       });

// // //     }


// // //     // -----------------------------------------
// // //     // PAYMENT DATE VALIDATION
// // //     // -----------------------------------------

// // //     const paymentDate =
// // //       new Date(paymentDateTime);


// // //     if (Number.isNaN(paymentDate.getTime())) {

// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "Invalid payment date/time.",
// // //       });

// // //     }


// // //     // -----------------------------------------
// // //     // CREATE PAYMENT REQUEST
// // //     // -----------------------------------------

// // //     const paymentRequest =
// // //       await PaymentRequest.create({

// // //         bookingData:
// // //           parsedBookingData,

// // //         amount:
// // //           Number(amount),

// // //         bankName,

// // //         paymentId:
// // //           String(paymentId).trim(),

// // //         screenshot:
// // //           `/uploads/payment-screenshots/${req.file.filename}`,

// // //         paymentDateTime:
// // //           paymentDate,

// // //         customerEmail:
// // //           String(customerEmail)
// // //             .trim()
// // //             .toLowerCase(),

// // //         status:
// // //           "Pending",

// // //         adminNote:
// // //           "",

// // //         approvedBookingId:
// // //           null,

// // //         processedAt:
// // //           null,

// // //       });


// // //     // =================================================
// // //     // SEND EMAIL TO ADMIN
// // //     // =================================================

// // //     try {

// // //       await sendAdminPaymentNotification({
// // //         paymentRequest,
// // //       });

// // //       console.log(
// // //         "ADMIN PAYMENT EMAIL: SENT"
// // //       );

// // //     } catch (emailError) {

// // //       // Email fail hone par payment request
// // //       // fail nahi hogi.

// // //       console.error(
// // //         "ADMIN PAYMENT EMAIL FAILED:",
// // //         emailError.message
// // //       );

// // //     }


// // //     // -----------------------------------------
// // //     // RESPONSE
// // //     // -----------------------------------------

// // //     return res.status(201).json({

// // //       success: true,

// // //       message:
// // //         "Payment request submitted successfully. Waiting for admin verification.",

// // //       paymentRequest,

// // //     });


// // //   } catch (error) {

// // //     console.error(
// // //       "CREATE PAYMENT REQUEST ERROR:",
// // //       error
// // //     );


// // //     return res.status(500).json({

// // //       success: false,

// // //       message:
// // //         error.message ||
// // //         "Failed to create payment request.",

// // //     });

// // //   }
// // // };


// // // // =====================================================
// // // // GET ALL PAYMENT REQUESTS
// // // // GET /api/payment-requests
// // // // =====================================================

// // // const getAllPaymentRequests = async (
// // //   req,
// // //   res
// // // ) => {

// // //   try {

// // //     const requests =
// // //       await PaymentRequest.find()
// // //         .populate("approvedBookingId")
// // //         .sort({
// // //           createdAt: -1,
// // //         });


// // //     return res.status(200).json({

// // //       success: true,

// // //       count:
// // //         requests.length,

// // //       requests,

// // //     });

// // //   } catch (error) {

// // //     console.error(
// // //       "GET PAYMENT REQUESTS ERROR:",
// // //       error
// // //     );


// // //     return res.status(500).json({

// // //       success: false,

// // //       message:
// // //         error.message ||
// // //         "Failed to get payment requests.",

// // //     });

// // //   }
// // // };


// // // // =====================================================
// // // // GET SINGLE PAYMENT REQUEST
// // // // GET /api/payment-requests/:id
// // // // =====================================================

// // // const getPaymentRequestById =
// // //   async (req, res) => {

// // //     try {

// // //       const request =
// // //         await PaymentRequest.findById(
// // //           req.params.id
// // //         ).populate(
// // //           "approvedBookingId"
// // //         );


// // //       if (!request) {

// // //         return res.status(404).json({

// // //           success: false,

// // //           message:
// // //             "Payment request not found.",

// // //         });

// // //       }


// // //       return res.status(200).json({

// // //         success: true,

// // //         request,

// // //       });

// // //     } catch (error) {

// // //       console.error(
// // //         "GET PAYMENT REQUEST ERROR:",
// // //         error
// // //       );


// // //       return res.status(500).json({

// // //         success: false,

// // //         message:
// // //           error.message ||
// // //           "Failed to get payment request.",

// // //       });

// // //     }

// // //   };


// // // // =====================================================
// // // // GET PENDING PAYMENT COUNT
// // // // GET /api/payment-requests/pending-count
// // // // =====================================================

// // // const getPendingPaymentCount =
// // //   async (req, res) => {

// // //     try {

// // //       const count =
// // //         await PaymentRequest.countDocuments({
// // //           status: "Pending",
// // //         });


// // //       return res.status(200).json({

// // //         success: true,

// // //         count,

// // //       });

// // //     } catch (error) {

// // //       console.error(
// // //         "PENDING PAYMENT COUNT ERROR:",
// // //         error
// // //       );


// // //       return res.status(500).json({

// // //         success: false,

// // //         message:
// // //           error.message ||
// // //           "Failed to get pending payment count.",

// // //       });

// // //     }

// // //   };


// // // // =====================================================
// // // // ACCEPT PAYMENT REQUEST
// // // // PUT /api/payment-requests/:id/accept
// // // // =====================================================

// // // const acceptPaymentRequest =
// // //   async (req, res) => {

// // //     try {

// // //       const {
// // //         adminNote,
// // //       } = req.body || {};


// // //       // -----------------------------------------
// // //       // FIND REQUEST
// // //       // -----------------------------------------

// // //       const request =
// // //         await PaymentRequest.findById(
// // //           req.params.id
// // //         );


// // //       if (!request) {

// // //         return res.status(404).json({

// // //           success: false,

// // //           message:
// // //             "Payment request not found.",

// // //         });

// // //       }


// // //       // -----------------------------------------
// // //       // ONLY PENDING CAN BE ACCEPTED
// // //       // -----------------------------------------

// // //       if (
// // //         request.status !==
// // //         "Pending"
// // //       ) {

// // //         return res.status(400).json({

// // //           success: false,

// // //           message:
// // //             `Payment request is already ${request.status}.`,

// // //         });

// // //       }


// // //       // -----------------------------------------
// // //       // BOOKING DATA
// // //       // -----------------------------------------

// // //       if (
// // //         !request.bookingData
// // //       ) {

// // //         return res.status(400).json({

// // //           success: false,

// // //           message:
// // //             "Booking data is missing from payment request.",

// // //         });

// // //       }


// // //       // -----------------------------------------
// // //       // COPY BOOKING DATA
// // //       // -----------------------------------------

// // //       const bookingData =
// // //         JSON.parse(
// // //           JSON.stringify(
// // //             request.bookingData
// // //           )
// // //         );


// // //       // -----------------------------------------
// // //       // FORCE VERIFIED PAYMENT
// // //       // -----------------------------------------

// // //       bookingData.paymentVerified =
// // //         true;

// // //       bookingData.paymentStatus =
// // //         "Paid";

// // //       bookingData.bookingStatus =
// // //         "Confirmed";

// // //       bookingData.paymentMethod =
// // //         request.bankName;

// // //       bookingData.paymentId =
// // //         request.paymentId;


// // //       // -----------------------------------------
// // //       // ADMIN ACCEPTED PAYMENT
// // //       // -----------------------------------------

// // //       bookingData.role =
// // //         "admin";

// // //       bookingData.userRole =
// // //         "admin";

// // //       bookingData.accountType =
// // //         "admin";


// // //       // -----------------------------------------
// // //       // FAKE RESPONSE OBJECT
// // //       // -----------------------------------------

// // //       let bookingResult = null;


// // //       const fakeResponse = {

// // //         statusCode: 200,


// // //         status(code) {

// // //           this.statusCode =
// // //             code;

// // //           return this;

// // //         },


// // //         json(data) {

// // //           bookingResult =
// // //             data;

// // //           return this;

// // //         },


// // //         send(data) {

// // //           bookingResult =
// // //             data;

// // //           return this;

// // //         },

// // //       };


// // //       // -----------------------------------------
// // //       // CREATE ACTUAL BOOKING
// // //       // -----------------------------------------

// // //       await bookingController.createBooking(
// // //         {

// // //           body:
// // //             bookingData,

// // //           user: {
// // //             role: "admin",
// // //           },

// // //           headers:
// // //             req.headers || {},

// // //         },

// // //         fakeResponse

// // //       );


// // //       // -----------------------------------------
// // //       // CHECK BOOKING RESULT
// // //       // -----------------------------------------

// // //       if (
// // //         !bookingResult ||
// // //         !bookingResult.success
// // //       ) {

// // //         console.error(
// // //           "ACCEPT PAYMENT BOOKING ERROR:",
// // //           bookingResult
// // //         );


// // //         return res.status(
// // //           bookingResult?.statusCode ||
// // //           400
// // //         ).json({

// // //           success: false,

// // //           message:
// // //             bookingResult?.message ||
// // //             "Unable to create confirmed booking.",

// // //         });

// // //       }


// // //       // -----------------------------------------
// // //       // GET CREATED BOOKING
// // //       // -----------------------------------------

// // //       const createdBooking =
// // //         bookingResult.booking;


// // //       if (
// // //         !createdBooking ||
// // //         !createdBooking._id
// // //       ) {

// // //         return res.status(500).json({

// // //           success: false,

// // //           message:
// // //             "Booking was created but booking details were not returned.",

// // //         });

// // //       }


// // //       // -----------------------------------------
// // //       // UPDATE PAYMENT REQUEST
// // //       // -----------------------------------------

// // //       request.status =
// // //         "Accepted";

// // //       request.approvedBookingId =
// // //         createdBooking._id;

// // //       request.adminNote =
// // //         adminNote ||
// // //         "Payment verified and booking confirmed by admin.";

// // //       request.processedAt =
// // //         new Date();


// // //       await request.save();


// // //       // -----------------------------------------
// // //       // SUCCESS
// // //       // -----------------------------------------

// // //       return res.status(200).json({

// // //         success: true,

// // //         message:
// // //           "Payment accepted and booking confirmed successfully.",

// // //         paymentRequest:
// // //           request,

// // //         booking:
// // //           createdBooking,

// // //       });

// // //     } catch (error) {

// // //       console.error(
// // //         "ACCEPT PAYMENT REQUEST ERROR:",
// // //         error
// // //       );


// // //       return res.status(500).json({

// // //         success: false,

// // //         message:
// // //           error.message ||
// // //           "Failed to accept payment request.",

// // //       });

// // //     }

// // //   };


// // // // =====================================================
// // // // REJECT PAYMENT REQUEST
// // // // PUT /api/payment-requests/:id/reject
// // // // =====================================================

// // // const rejectPaymentRequest =
// // //   async (req, res) => {

// // //     try {

// // //       const {
// // //         adminNote,
// // //       } = req.body || {};


// // //       // -----------------------------------------
// // //       // FIND REQUEST
// // //       // -----------------------------------------

// // //       const request =
// // //         await PaymentRequest.findById(
// // //           req.params.id
// // //         );


// // //       if (!request) {

// // //         return res.status(404).json({

// // //           success: false,

// // //           message:
// // //             "Payment request not found.",

// // //         });

// // //       }


// // //       // -----------------------------------------
// // //       // ONLY PENDING CAN BE REJECTED
// // //       // -----------------------------------------

// // //       if (
// // //         request.status !==
// // //         "Pending"
// // //       ) {

// // //         return res.status(400).json({

// // //           success: false,

// // //           message:
// // //             `Payment request is already ${request.status}.`,

// // //         });

// // //       }


// // //       // -----------------------------------------
// // //       // REJECT
// // //       // -----------------------------------------

// // //       request.status =
// // //         "Rejected";

// // //       request.adminNote =
// // //         adminNote ||
// // //         "Payment rejected by admin.";

// // //       request.processedAt =
// // //         new Date();

// // //       request.approvedBookingId =
// // //         null;


// // //       await request.save();


// // //       // -----------------------------------------
// // //       // RESPONSE
// // //       // -----------------------------------------

// // //       return res.status(200).json({

// // //         success: true,

// // //         message:
// // //           "Payment request rejected successfully.",

// // //         request,

// // //       });

// // //     } catch (error) {

// // //       console.error(
// // //         "REJECT PAYMENT REQUEST ERROR:",
// // //         error
// // //       );


// // //       return res.status(500).json({

// // //         success: false,

// // //         message:
// // //           error.message ||
// // //           "Failed to reject payment request.",

// // //       });

// // //     }

// // //   };


// // // // =====================================================
// // // // EXPORT
// // // // =====================================================

// // // module.exports = {

// // //   createPaymentRequest,

// // //   getAllPaymentRequests,

// // //   getPaymentRequestById,

// // //   getPendingPaymentCount,

// // //   acceptPaymentRequest,

// // //   rejectPaymentRequest,

// // // };









// // const PaymentRequest = require("../models/PaymentRequest");
// // const bookingController = require("./bookingController");

// // const {
// //   sendTicketEmail,
// // } = require("../services/emailService");

// // const {
// //   sendAdminPaymentNotification,
// // } = require("../services/emailService");


// // // =====================================================
// // // CREATE PAYMENT REQUEST
// // // POST /api/payment-requests
// // // =====================================================

// // const createPaymentRequest = async (req, res) => {
// //   try {
// //     const {
// //       bookingData,
// //       amount,
// //       bankName,
// //       paymentId,
// //       paymentDateTime,
// //       customerEmail,
// //     } = req.body;

// //     // -----------------------------------------
// //     // REQUIRED FIELDS
// //     // -----------------------------------------

// //     if (
// //       !bookingData ||
// //       amount === undefined ||
// //       amount === null ||
// //       !bankName ||
// //       !paymentId ||
// //       !paymentDateTime ||
// //       !customerEmail
// //     ) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "All payment details are required.",
// //       });
// //     }

// //     // -----------------------------------------
// //     // BANK VALIDATION
// //     // -----------------------------------------

// //     if (
// //       !["ICICI Bank", "Bank of Baroda"].includes(
// //         bankName
// //       )
// //     ) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid bank selected.",
// //       });
// //     }

// //     // -----------------------------------------
// //     // SCREENSHOT VALIDATION
// //     // -----------------------------------------

// //     if (!req.file) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Payment screenshot is required.",
// //       });
// //     }

// //     // -----------------------------------------
// //     // PARSE BOOKING DATA
// //     // -----------------------------------------

// //     let parsedBookingData;

// //     try {
// //       parsedBookingData =
// //         typeof bookingData === "string"
// //           ? JSON.parse(bookingData)
// //           : bookingData;
// //     } catch (error) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid booking data.",
// //       });
// //     }

// //     // -----------------------------------------
// //     // PAYMENT DATE VALIDATION
// //     // -----------------------------------------

// //     const paymentDate = new Date(
// //       paymentDateTime
// //     );

// //     if (Number.isNaN(paymentDate.getTime())) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid payment date/time.",
// //       });
// //     }

// //     // -----------------------------------------
// //     // CREATE PAYMENT REQUEST
// //     // -----------------------------------------

// //     const paymentRequest =
// //       await PaymentRequest.create({
// //         bookingData: parsedBookingData,

// //         amount: Number(amount),

// //         bankName,

// //         paymentId:
// //           String(paymentId).trim(),

// //         screenshot:
// //           `/uploads/payment-screenshots/${req.file.filename}`,

// //         paymentDateTime: paymentDate,

// //         customerEmail:
// //           String(customerEmail)
// //             .trim()
// //             .toLowerCase(),

// //         status: "Pending",

// //         adminNote: "",

// //         approvedBookingId: null,

// //         processedAt: null,
// //       });

// //     // -----------------------------------------
// //     // SEND ADMIN EMAIL
// //     // -----------------------------------------

// //     try {
// //       await sendAdminPaymentNotification({
// //         paymentRequest,
// //       });

// //       console.log(
// //         "ADMIN PAYMENT NOTIFICATION SENT"
// //       );
// //     } catch (emailError) {
// //       console.error(
// //         "ADMIN PAYMENT NOTIFICATION FAILED:",
// //         emailError.message
// //       );
// //     }

// //     // -----------------------------------------
// //     // RESPONSE
// //     // -----------------------------------------

// //     return res.status(201).json({
// //       success: true,

// //       message:
// //         "Payment request submitted successfully. Waiting for admin verification.",

// //       paymentRequest,
// //     });

// //   } catch (error) {

// //     console.error(
// //       "CREATE PAYMENT REQUEST ERROR:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,

// //       message:
// //         error.message ||
// //         "Failed to create payment request.",
// //     });
// //   }
// // };


// // // =====================================================
// // // GET ALL PAYMENT REQUESTS
// // // GET /api/payment-requests
// // // =====================================================

// // const getAllPaymentRequests = async (
// //   req,
// //   res
// // ) => {
// //   try {

// //     const requests =
// //       await PaymentRequest.find()
// //         .populate("approvedBookingId")
// //         .sort({
// //           createdAt: -1,
// //         });

// //     return res.status(200).json({
// //       success: true,

// //       count:
// //         requests.length,

// //       requests,
// //     });

// //   } catch (error) {

// //     console.error(
// //       "GET PAYMENT REQUESTS ERROR:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,

// //       message:
// //         error.message ||
// //         "Failed to get payment requests.",
// //     });
// //   }
// // };


// // // =====================================================
// // // GET SINGLE PAYMENT REQUEST
// // // GET /api/payment-requests/:id
// // // =====================================================

// // const getPaymentRequestById =
// //   async (req, res) => {

// //     try {

// //       const request =
// //         await PaymentRequest.findById(
// //           req.params.id
// //         ).populate(
// //           "approvedBookingId"
// //         );

// //       if (!request) {
// //         return res.status(404).json({
// //           success: false,

// //           message:
// //             "Payment request not found.",
// //         });
// //       }

// //       return res.status(200).json({
// //         success: true,
// //         request,
// //       });

// //     } catch (error) {

// //       console.error(
// //         "GET PAYMENT REQUEST ERROR:",
// //         error
// //       );

// //       return res.status(500).json({
// //         success: false,

// //         message:
// //           error.message ||
// //           "Failed to get payment request.",
// //       });
// //     }
// //   };


// // // =====================================================
// // // GET PENDING PAYMENT COUNT
// // // GET /api/payment-requests/pending-count
// // // =====================================================

// // const getPendingPaymentCount =
// //   async (req, res) => {

// //     try {

// //       const count =
// //         await PaymentRequest.countDocuments({
// //           status: "Pending",
// //         });

// //       return res.status(200).json({
// //         success: true,
// //         count,
// //       });

// //     } catch (error) {

// //       console.error(
// //         "PENDING PAYMENT COUNT ERROR:",
// //         error
// //       );

// //       return res.status(500).json({
// //         success: false,

// //         message:
// //           error.message ||
// //           "Failed to get pending payment count.",
// //       });
// //     }
// //   };


// // // =====================================================
// // // ACCEPT PAYMENT REQUEST
// // // PUT /api/payment-requests/:id/accept
// // // =====================================================

// // const acceptPaymentRequest =
// //   async (req, res) => {

// //     try {

// //       const {
// //         adminNote,
// //       } = req.body || {};

// //       // -----------------------------------------
// //       // FIND REQUEST
// //       // -----------------------------------------

// //       const request =
// //         await PaymentRequest.findById(
// //           req.params.id
// //         );

// //       if (!request) {

// //         return res.status(404).json({
// //           success: false,

// //           message:
// //             "Payment request not found.",
// //         });
// //       }

// //       // -----------------------------------------
// //       // ONLY PENDING CAN BE ACCEPTED
// //       // -----------------------------------------

// //       if (
// //         request.status !==
// //         "Pending"
// //       ) {

// //         return res.status(400).json({
// //           success: false,

// //           message:
// //             `Payment request is already ${request.status}.`,
// //         });
// //       }

// //       // -----------------------------------------
// //       // BOOKING DATA
// //       // -----------------------------------------

// //       if (
// //         !request.bookingData
// //       ) {

// //         return res.status(400).json({
// //           success: false,

// //           message:
// //             "Booking data is missing from payment request.",
// //         });
// //       }

// //       // -----------------------------------------
// //       // COPY BOOKING DATA
// //       // -----------------------------------------

// //       const bookingData =
// //         JSON.parse(
// //           JSON.stringify(
// //             request.bookingData
// //           )
// //         );

// //       // -----------------------------------------
// //       // FORCE VERIFIED PAYMENT
// //       // -----------------------------------------

// //       bookingData.paymentVerified =
// //         true;

// //       bookingData.paymentStatus =
// //         "Paid";

// //       bookingData.bookingStatus =
// //         "Confirmed";

// //       bookingData.paymentMethod =
// //         request.bankName;

// //       bookingData.paymentId =
// //         request.paymentId;

// //       // -----------------------------------------
// //       // ADMIN ACCEPTED PAYMENT
// //       // -----------------------------------------

// //       bookingData.role =
// //         "admin";

// //       bookingData.userRole =
// //         "admin";

// //       bookingData.accountType =
// //         "admin";

// //       // -----------------------------------------
// //       // FAKE RESPONSE OBJECT
// //       // -----------------------------------------

// //       let bookingResult = null;

// //       const fakeResponse = {

// //         statusCode: 200,

// //         status(code) {
// //           this.statusCode =
// //             code;

// //           return this;
// //         },

// //         json(data) {
// //           bookingResult =
// //             data;

// //           return this;
// //         },

// //         send(data) {
// //           bookingResult =
// //             data;

// //           return this;
// //         },
// //       };

// //       // -----------------------------------------
// //       // CREATE ACTUAL BOOKING
// //       // -----------------------------------------

// //       await bookingController.createBooking(
// //         {
// //           body: bookingData,

// //           user: {
// //             role: "admin",
// //           },

// //           headers:
// //             req.headers || {},
// //         },

// //         fakeResponse
// //       );

// //       // -----------------------------------------
// //       // CHECK BOOKING RESULT
// //       // -----------------------------------------

// //       if (
// //         !bookingResult ||
// //         !bookingResult.success
// //       ) {

// //         console.error(
// //           "ACCEPT PAYMENT BOOKING ERROR:",
// //           bookingResult
// //         );

// //         return res.status(
// //           bookingResult?.statusCode ||
// //             400
// //         ).json({

// //           success: false,

// //           message:
// //             bookingResult?.message ||
// //             "Unable to create confirmed booking.",
// //         });
// //       }

// //       // -----------------------------------------
// //       // GET CREATED BOOKING
// //       // -----------------------------------------

// //       const createdBooking =
// //         bookingResult.booking;

// //       if (
// //         !createdBooking ||
// //         !createdBooking._id
// //       ) {

// //         return res.status(500).json({
// //           success: false,

// //           message:
// //             "Booking was created but booking details were not returned.",
// //         });
// //       }

// //       // -----------------------------------------
// //       // UPDATE PAYMENT REQUEST
// //       // -----------------------------------------

// //       request.status =
// //         "Accepted";

// //       request.approvedBookingId =
// //         createdBooking._id;

// //       request.adminNote =
// //         adminNote ||
// //         "Payment verified and booking confirmed by admin.";

// //       request.processedAt =
// //         new Date();

// //       await request.save();

// //       // =====================================================
// //       // SEND TICKET EMAIL TO CUSTOMER
// //       // =====================================================

// //       try {

// //         await sendTicketEmail({

// //           // IMPORTANT:
// //           // Customer payment form me jo email
// //           // bhari thi wahi use hogi.

// //           to:
// //             request.customerEmail,

// //           booking:
// //             createdBooking,
// //         });

// //         console.log(
// //           "CUSTOMER TICKET EMAIL SENT:",
// //           request.customerEmail
// //         );

// //       } catch (emailError) {

// //         console.error(
// //           "CUSTOMER TICKET EMAIL FAILED:",
// //           emailError.message
// //         );

// //       }

// //       // -----------------------------------------
// //       // SUCCESS
// //       // -----------------------------------------

// //       return res.status(200).json({

// //         success: true,

// //         message:
// //           "Payment accepted, booking confirmed and ticket email sent successfully.",

// //         paymentRequest:
// //           request,

// //         booking:
// //           createdBooking,

// //         email:
// //           request.customerEmail,
// //       });

// //     } catch (error) {

// //       console.error(
// //         "ACCEPT PAYMENT REQUEST ERROR:",
// //         error
// //       );

// //       return res.status(500).json({

// //         success: false,

// //         message:
// //           error.message ||
// //           "Failed to accept payment request.",
// //       });
// //     }
// //   };


// // // =====================================================
// // // REJECT PAYMENT REQUEST
// // // PUT /api/payment-requests/:id/reject
// // // =====================================================

// // const rejectPaymentRequest =
// //   async (req, res) => {

// //     try {

// //       const {
// //         adminNote,
// //       } = req.body || {};

// //       // -----------------------------------------
// //       // FIND REQUEST
// //       // -----------------------------------------

// //       const request =
// //         await PaymentRequest.findById(
// //           req.params.id
// //         );

// //       if (!request) {

// //         return res.status(404).json({
// //           success: false,

// //           message:
// //             "Payment request not found.",
// //         });
// //       }

// //       // -----------------------------------------
// //       // ONLY PENDING CAN BE REJECTED
// //       // -----------------------------------------

// //       if (
// //         request.status !==
// //         "Pending"
// //       ) {

// //         return res.status(400).json({
// //           success: false,

// //           message:
// //             `Payment request is already ${request.status}.`,
// //         });
// //       }

// //       // -----------------------------------------
// //       // REJECT
// //       // -----------------------------------------

// //       request.status =
// //         "Rejected";

// //       request.adminNote =
// //         adminNote ||
// //         "Payment rejected by admin.";

// //       request.processedAt =
// //         new Date();

// //       request.approvedBookingId =
// //         null;

// //       await request.save();

// //       // -----------------------------------------
// //       // RESPONSE
// //       // -----------------------------------------

// //       return res.status(200).json({

// //         success: true,

// //         message:
// //           "Payment request rejected successfully.",

// //         request,
// //       });

// //     } catch (error) {

// //       console.error(
// //         "REJECT PAYMENT REQUEST ERROR:",
// //         error
// //       );

// //       return res.status(500).json({

// //         success: false,

// //         message:
// //           error.message ||
// //           "Failed to reject payment request.",
// //       });
// //     }
// //   };


// // // =====================================================
// // // EXPORT
// // // =====================================================

// // module.exports = {

// //   createPaymentRequest,

// //   getAllPaymentRequests,

// //   getPaymentRequestById,

// //   getPendingPaymentCount,

// //   acceptPaymentRequest,

// //   rejectPaymentRequest,
// // };




// const PaymentRequest = require("../models/PaymentRequest");
// const bookingController = require("./bookingController");

// const {
//   sendAdminPaymentNotification,
//   sendTicketEmail,
// } = require("../services/emailService");

// // =====================================================
// // CREATE PAYMENT REQUEST
// // POST /api/payment-requests
// // =====================================================

// const createPaymentRequest = async (req, res) => {
//   try {
//     const {
//       bookingData,
//       amount,
//       bankName,
//       paymentId,
//       paymentDateTime,
//       customerEmail,
//     } = req.body;

//     // -----------------------------------------
//     // REQUIRED FIELDS
//     // -----------------------------------------

//     if (
//       !bookingData ||
//       amount === undefined ||
//       amount === null ||
//       !bankName ||
//       !paymentId ||
//       !paymentDateTime ||
//       !customerEmail
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All payment details are required.",
//       });
//     }

//     // -----------------------------------------
//     // BANK VALIDATION
//     // -----------------------------------------

//     if (
//       !["ICICI Bank", "Bank of Baroda"].includes(
//         bankName
//       )
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid bank selected.",
//       });
//     }

//     // -----------------------------------------
//     // SCREENSHOT VALIDATION
//     // -----------------------------------------

//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment screenshot is required.",
//       });
//     }

//     // -----------------------------------------
//     // PARSE BOOKING DATA
//     // -----------------------------------------

//     let parsedBookingData;

//     try {
//       parsedBookingData =
//         typeof bookingData === "string"
//           ? JSON.parse(bookingData)
//           : bookingData;
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid booking data.",
//       });
//     }

//     // -----------------------------------------
//     // PAYMENT DATE VALIDATION
//     // -----------------------------------------

//     const paymentDate = new Date(
//       paymentDateTime
//     );

//     if (Number.isNaN(paymentDate.getTime())) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid payment date/time.",
//       });
//     }

//     // -----------------------------------------
//     // CREATE PAYMENT REQUEST
//     // -----------------------------------------

//     const paymentRequest =
//       await PaymentRequest.create({
//         bookingData: parsedBookingData,

//         amount: Number(amount),

//         bankName,

//         paymentId:
//           String(paymentId).trim(),

//         screenshot:
//           `/uploads/payment-screenshots/${req.file.filename}`,

//         paymentDateTime: paymentDate,

//         customerEmail:
//           String(customerEmail)
//             .trim()
//             .toLowerCase(),

//         status: "Pending",

//         adminNote: "",

//         approvedBookingId: null,

//         processedAt: null,
//       });

//     // =================================================
//     // SEND ADMIN EMAIL NOTIFICATION
//     // =================================================

//     try {
//       await sendAdminPaymentNotification({
//         paymentRequest,
//       });

//       console.log(
//         "ADMIN PAYMENT NOTIFICATION SENT SUCCESSFULLY"
//       );
//     } catch (emailError) {
//       // Email fail hone par payment request fail nahi hogi
//       console.error(
//         "ADMIN PAYMENT EMAIL ERROR:",
//         emailError.message
//       );
//     }

//     // -----------------------------------------
//     // RESPONSE
//     // -----------------------------------------

//     return res.status(201).json({
//       success: true,

//       message:
//         "Payment request submitted successfully. Waiting for admin verification.",

//       paymentRequest,
//     });

//   } catch (error) {
//     console.error(
//       "CREATE PAYMENT REQUEST ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,

//       message:
//         error.message ||
//         "Failed to create payment request.",
//     });
//   }
// };


// // =====================================================
// // GET ALL PAYMENT REQUESTS
// // GET /api/payment-requests
// // =====================================================

// const getAllPaymentRequests = async (
//   req,
//   res
// ) => {
//   try {
//     const requests =
//       await PaymentRequest.find()
//         .populate("approvedBookingId")
//         .sort({
//           createdAt: -1,
//         });

//     return res.status(200).json({
//       success: true,

//       count:
//         requests.length,

//       requests,
//     });

//   } catch (error) {
//     console.error(
//       "GET PAYMENT REQUESTS ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,

//       message:
//         error.message ||
//         "Failed to get payment requests.",
//     });
//   }
// };


// // =====================================================
// // GET SINGLE PAYMENT REQUEST
// // GET /api/payment-requests/:id
// // =====================================================

// const getPaymentRequestById =
//   async (req, res) => {
//     try {
//       const request =
//         await PaymentRequest.findById(
//           req.params.id
//         ).populate(
//           "approvedBookingId"
//         );

//       if (!request) {
//         return res.status(404).json({
//           success: false,

//           message:
//             "Payment request not found.",
//         });
//       }

//       return res.status(200).json({
//         success: true,

//         request,
//       });

//     } catch (error) {
//       console.error(
//         "GET PAYMENT REQUEST ERROR:",
//         error
//       );

//       return res.status(500).json({
//         success: false,

//         message:
//           error.message ||
//           "Failed to get payment request.",
//       });
//     }
//   };


// // =====================================================
// // GET PENDING PAYMENT COUNT
// // GET /api/payment-requests/pending-count
// // =====================================================

// const getPendingPaymentCount =
//   async (req, res) => {
//     try {
//       const count =
//         await PaymentRequest.countDocuments({
//           status: "Pending",
//         });

//       return res.status(200).json({
//         success: true,
//         count,
//       });

//     } catch (error) {
//       console.error(
//         "PENDING PAYMENT COUNT ERROR:",
//         error
//       );

//       return res.status(500).json({
//         success: false,

//         message:
//           error.message ||
//           "Failed to get pending payment count.",
//       });
//     }
//   };


// // =====================================================
// // ACCEPT PAYMENT REQUEST
// // PUT /api/payment-requests/:id/accept
// // =====================================================

// const acceptPaymentRequest =
//   async (req, res) => {
//     try {
//       const {
//         adminNote,
//       } = req.body || {};

//       // -----------------------------------------
//       // FIND REQUEST
//       // -----------------------------------------

//       const request =
//         await PaymentRequest.findById(
//           req.params.id
//         );

//       if (!request) {
//         return res.status(404).json({
//           success: false,

//           message:
//             "Payment request not found.",
//         });
//       }

//       // -----------------------------------------
//       // ONLY PENDING CAN BE ACCEPTED
//       // -----------------------------------------

//       if (
//         request.status !==
//         "Pending"
//       ) {
//         return res.status(400).json({
//           success: false,

//           message:
//             `Payment request is already ${request.status}.`,
//         });
//       }

//       // -----------------------------------------
//       // BOOKING DATA CHECK
//       // -----------------------------------------

//       if (
//         !request.bookingData
//       ) {
//         return res.status(400).json({
//           success: false,

//           message:
//             "Booking data is missing from payment request.",
//         });
//       }

//       // -----------------------------------------
//       // COPY BOOKING DATA
//       // -----------------------------------------

//       const bookingData =
//         JSON.parse(
//           JSON.stringify(
//             request.bookingData
//           )
//         );

//       // -----------------------------------------
//       // FORCE VERIFIED PAYMENT
//       // -----------------------------------------

//       bookingData.paymentVerified =
//         true;

//       bookingData.paymentStatus =
//         "Paid";

//       bookingData.bookingStatus =
//         "Confirmed";

//       bookingData.paymentMethod =
//         request.bankName;

//       bookingData.paymentId =
//         request.paymentId;

//       // -----------------------------------------
//       // ADMIN ACCEPTED PAYMENT
//       // -----------------------------------------

//       bookingData.role =
//         "admin";

//       bookingData.userRole =
//         "admin";

//       bookingData.accountType =
//         "admin";

//       // -----------------------------------------
//       // FAKE RESPONSE
//       // -----------------------------------------

//       let bookingResult = null;

//       const fakeResponse = {
//         statusCode: 200,

//         status(code) {
//           this.statusCode =
//             code;

//           return this;
//         },

//         json(data) {
//           bookingResult =
//             data;

//           return this;
//         },

//         send(data) {
//           bookingResult =
//             data;

//           return this;
//         },
//       };

//       // -----------------------------------------
//       // CREATE CONFIRMED BOOKING
//       // -----------------------------------------

//       await bookingController.createBooking(
//         {
//           body: bookingData,

//           user: {
//             role: "admin",
//           },

//           headers:
//             req.headers || {},
//         },

//         fakeResponse
//       );

//       // -----------------------------------------
//       // CHECK BOOKING RESULT
//       // -----------------------------------------

//       if (
//         !bookingResult ||
//         !bookingResult.success
//       ) {
//         console.error(
//           "ACCEPT PAYMENT BOOKING ERROR:",
//           bookingResult
//         );

//         return res.status(
//           bookingResult?.statusCode ||
//             400
//         ).json({
//           success: false,

//           message:
//             bookingResult?.message ||
//             "Unable to create confirmed booking.",
//         });
//       }

//       // -----------------------------------------
//       // GET CREATED BOOKING
//       // -----------------------------------------

//       const createdBooking =
//         bookingResult.booking;

//       if (
//         !createdBooking ||
//         !createdBooking._id
//       ) {
//         return res.status(500).json({
//           success: false,

//           message:
//             "Booking was created but booking details were not returned.",
//         });
//       }

//       // =================================================
//       // UPDATE PAYMENT REQUEST
//       // =================================================

//       request.status =
//         "Accepted";

//       request.approvedBookingId =
//         createdBooking._id;

//       request.adminNote =
//         adminNote ||
//         "Payment verified and booking confirmed by admin.";

//       request.processedAt =
//         new Date();

//       await request.save();

//       // =================================================
//       // SEND TICKET PDF TO CUSTOMER
//       // =================================================

//       let customerEmailSent = false;

//       try {
//         await sendTicketEmail({
//           to:
//             request.customerEmail,

//           booking:
//             createdBooking,
//         });

//         customerEmailSent = true;

//         console.log(
//           "CUSTOMER TICKET PDF SENT:",
//           request.customerEmail
//         );

//       } catch (emailError) {
//         console.error(
//           "CUSTOMER TICKET PDF ERROR:",
//           emailError.message
//         );
//       }

//       // =================================================
//       // SEND SAME TICKET PDF TO ADMIN
//       // =================================================

//       let adminEmailSent = false;

//       try {
//         await sendTicketEmail({
//           to:
//             process.env.EMAIL_USER,

//           booking:
//             createdBooking,
//         });

//         adminEmailSent = true;

//         console.log(
//           "ADMIN TICKET PDF SENT:",
//           process.env.EMAIL_USER
//         );

//       } catch (emailError) {
//         console.error(
//           "ADMIN TICKET PDF ERROR:",
//           emailError.message
//         );
//       }

//       // =================================================
//       // SUCCESS
//       // =================================================

//       return res.status(200).json({
//         success: true,

//         message:
//           "Payment accepted, booking confirmed and ticket PDF processed successfully.",

//         paymentRequest:
//           request,

//         booking:
//           createdBooking,

//         emailStatus: {
//           customer:
//             customerEmailSent,

//           admin:
//             adminEmailSent,
//         },
//       });

//     } catch (error) {
//       console.error(
//         "ACCEPT PAYMENT REQUEST ERROR:",
//         error
//       );

//       return res.status(500).json({
//         success: false,

//         message:
//           error.message ||
//           "Failed to accept payment request.",
//       });
//     }
//   };


// // =====================================================
// // REJECT PAYMENT REQUEST
// // PUT /api/payment-requests/:id/reject
// // =====================================================

// const rejectPaymentRequest =
//   async (req, res) => {
//     try {
//       const {
//         adminNote,
//       } = req.body || {};

//       // -----------------------------------------
//       // FIND REQUEST
//       // -----------------------------------------

//       const request =
//         await PaymentRequest.findById(
//           req.params.id
//         );

//       if (!request) {
//         return res.status(404).json({
//           success: false,

//           message:
//             "Payment request not found.",
//         });
//       }

//       // -----------------------------------------
//       // ONLY PENDING CAN BE REJECTED
//       // -----------------------------------------

//       if (
//         request.status !==
//         "Pending"
//       ) {
//         return res.status(400).json({
//           success: false,

//           message:
//             `Payment request is already ${request.status}.`,
//         });
//       }

//       // -----------------------------------------
//       // REJECT PAYMENT
//       // -----------------------------------------

//       request.status =
//         "Rejected";

//       request.adminNote =
//         adminNote ||
//         "Payment rejected by admin.";

//       request.processedAt =
//         new Date();

//       request.approvedBookingId =
//         null;

//       await request.save();

//       // -----------------------------------------
//       // RESPONSE
//       // -----------------------------------------

//       return res.status(200).json({
//         success: true,

//         message:
//           "Payment request rejected successfully.",

//         request,
//       });

//     } catch (error) {
//       console.error(
//         "REJECT PAYMENT REQUEST ERROR:",
//         error
//       );

//       return res.status(500).json({
//         success: false,

//         message:
//           error.message ||
//           "Failed to reject payment request.",
//       });
//     }
//   };


// // =====================================================
// // EXPORT
// // =====================================================

// module.exports = {
//   createPaymentRequest,
//   getAllPaymentRequests,
//   getPaymentRequestById,
//   getPendingPaymentCount,
//   acceptPaymentRequest,
//   rejectPaymentRequest,
// };


const crypto = require("crypto");

const PaymentRequest = require("../models/PaymentRequest");
const bookingController = require("./bookingController");

const {
  sendAdminPaymentNotification,
  sendTicketEmail,
} = require("../services/emailService");


/* =========================================================
   CREATE PAYMENT REQUEST
========================================================= */

const createPaymentRequest = async (req, res) => {
  try {
    const {
      bookingData,
      amount,
      bankName,
      paymentId,
      paymentDateTime,
      customerEmail,
    } = req.body;

    const screenshot = req.file;

    /* ---------- VALIDATION ---------- */

    if (!bookingData) {
      return res.status(400).json({
        success: false,
        message: "Booking data is required.",
      });
    }

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Payment amount is required.",
      });
    }

    if (
      bankName !== "ICICI Bank" &&
      bankName !== "Bank of Baroda"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid bank.",
      });
    }

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID / UTR is required.",
      });
    }

    if (!paymentDateTime) {
      return res.status(400).json({
        success: false,
        message: "Payment date/time is required.",
      });
    }

    if (!customerEmail) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required.",
      });
    }

    if (!screenshot) {
      return res.status(400).json({
        success: false,
        message: "Payment screenshot is required.",
      });
    }


    /* ---------- PARSE BOOKING DATA ---------- */

    let parsedBookingData;

    try {
      parsedBookingData =
        typeof bookingData === "string"
          ? JSON.parse(bookingData)
          : bookingData;
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking data.",
      });
    }


    /* ---------- PAYMENT DATE ---------- */

    const parsedPaymentDate =
      new Date(paymentDateTime);

    if (
      Number.isNaN(
        parsedPaymentDate.getTime()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment date/time.",
      });
    }


    /* ---------- SCREENSHOT URL ---------- */

    const screenshotPath =
      `/uploads/payment-screenshots/${screenshot.filename}`;


    /* ---------- CREATE REQUEST ---------- */

    const request =
      await PaymentRequest.create({
        bookingData: parsedBookingData,

        amount: Number(amount),

        bankName,

        paymentId:
          String(paymentId).trim(),

        screenshot:
          screenshotPath,

        paymentDateTime:
          parsedPaymentDate,

        customerEmail:
          String(customerEmail)
            .trim()
            .toLowerCase(),

        status: "Pending",

        adminActionToken: null,

        adminActionTokenExpiresAt: null,
      });


    /* =====================================================
       CREATE ADMIN EMAIL TOKEN
    ===================================================== */

    const adminActionToken =
      crypto.randomBytes(32).toString("hex");

    const tokenHash =
      crypto
        .createHash("sha256")
        .update(adminActionToken)
        .digest("hex");

    /*
      Token 7 days tak valid rahega.
    */

    const tokenExpiresAt =
      new Date(
        Date.now() +
          7 * 24 * 60 * 60 * 1000
      );


    request.adminActionToken =
      tokenHash;

    request.adminActionTokenExpiresAt =
      tokenExpiresAt;

    await request.save();


    /* =====================================================
       SEND ADMIN EMAIL
    ===================================================== */

    try {
      await sendAdminPaymentNotification({
        paymentRequest: request,

        /*
          IMPORTANT:
          Email service ko raw token dena hai
          taaki email button mein URL ban sake.
        */
        adminActionToken,
      });

      console.log(
        "Admin payment notification email sent."
      );

    } catch (emailError) {
      console.error(
        "ADMIN PAYMENT EMAIL ERROR:",
        emailError.message
      );

      /*
        Email fail hone par payment request
        delete nahi hogi.
      */
    }


    /* ---------- RESPONSE ---------- */

    return res.status(201).json({
      success: true,

      message:
        "Payment request submitted successfully. Waiting for admin verification.",

      paymentRequest: {
        id: request._id,
        status: request.status,
        amount: request.amount,
        bankName: request.bankName,
        customerEmail:
          request.customerEmail,
      },
    });

  } catch (error) {
    console.error(
      "CREATE PAYMENT REQUEST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create payment request.",
    });
  }
};


/* =========================================================
   GET ALL PAYMENT REQUESTS
========================================================= */

const getAllPaymentRequests = async (
  req,
  res
) => {
  try {
    const requests =
      await PaymentRequest.find()
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: requests.length,
      paymentRequests: requests,
    });

  } catch (error) {
    console.error(
      "GET PAYMENT REQUESTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch payment requests.",
    });
  }
};


/* =========================================================
   GET SINGLE PAYMENT REQUEST
========================================================= */

const getPaymentRequestById = async (
  req,
  res
) => {
  try {
    const request =
      await PaymentRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message:
          "Payment request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      paymentRequest: request,
    });

  } catch (error) {
    console.error(
      "GET PAYMENT REQUEST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch payment request.",
    });
  }
};


/* =========================================================
   GET PENDING COUNT
========================================================= */

const getPendingPaymentCount = async (
  req,
  res
) => {
  try {
    const count =
      await PaymentRequest.countDocuments({
        status: "Pending",
      });

    return res.status(200).json({
      success: true,
      count,
    });

  } catch (error) {
    console.error(
      "GET PENDING COUNT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get pending payment count.",
    });
  }
};


/* =========================================================
   CREATE BOOKING FROM PAYMENT REQUEST
========================================================= */

const createConfirmedBooking =
  async (request) => {

    return new Promise(
      (resolve, reject) => {

        let responseSent = false;

        const fakeResponse = {
          status: function (statusCode) {
            return {
              json: function (data) {

                responseSent = true;

                if (
                  statusCode >= 200 &&
                  statusCode < 300
                ) {
                  resolve(data);
                } else {
                  reject(
                    new Error(
                      data?.message ||
                      "Booking creation failed."
                    )
                  );
                }

                return data;
              },
            };
          },

          json: function (data) {

            if (responseSent) {
              return data;
            }

            responseSent = true;

            resolve(data);

            return data;
          },
        };


        const fakeRequest = {
          body: {
            ...request.bookingData,

            paymentVerified: true,

            paymentStatus: "Paid",

            bookingStatus: "Confirmed",

            paymentMethod:
              request.bankName,

            paymentId:
              request.paymentId,
          },

          user: {
            role: "admin",
            userRole: "admin",
            accountType: "admin",
          },

          headers: {},

          get: () => undefined,
        };


        Promise.resolve(
          bookingController.createBooking(
            fakeRequest,
            fakeResponse
          )
        ).catch((error) => {
          reject(error);
        });
      }
    );
  };


/* =========================================================
   ACCEPT PAYMENT REQUEST
========================================================= */

const acceptPaymentRequest = async (
  req,
  res
) => {
  try {

    const request =
      await PaymentRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message:
          "Payment request not found.",
      });
    }


    /* ---------- ALREADY PROCESSED ---------- */

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,

        message:
          `Payment request is already ${request.status}.`,
      });
    }


    /* ---------- ADMIN NOTE ---------- */

    const adminNote =
      req.body?.adminNote || "";


    /* ---------- CREATE CONFIRMED BOOKING ---------- */

    let bookingResult;

    try {

      bookingResult =
        await createConfirmedBooking(
          request
        );

    } catch (bookingError) {

      console.error(
        "BOOKING CREATION ERROR:",
        bookingError
      );

      return res.status(500).json({
        success: false,

        message:
          bookingError.message ||
          "Payment accepted but booking creation failed.",
      });
    }


    /* ---------- FIND CREATED BOOKING ---------- */

    const createdBooking =
      bookingResult?.booking ||
      bookingResult?.data ||
      bookingResult;


    const bookingId =
      createdBooking?._id ||
      bookingResult?.booking?._id ||
      bookingResult?.bookingId;


    if (!bookingId) {

      console.error(
        "Booking result:",
        bookingResult
      );

      return res.status(500).json({
        success: false,

        message:
          "Booking was not created correctly.",
      });
    }


    /* ---------- UPDATE PAYMENT REQUEST ---------- */

    request.status =
      "Accepted";

    request.approvedBookingId =
      bookingId;

    request.adminNote =
      adminNote;

    request.processedAt =
      new Date();

    /*
      Token ko clear kar do.
      Isse email Accept/Reject link
      dobara use nahi ho sakega.
    */

    request.adminActionToken =
      null;

    request.adminActionTokenExpiresAt =
      null;

    await request.save();


    /* =====================================================
       SEND CUSTOMER TICKET
    ===================================================== */

    let customerEmailSent =
      false;

    let adminEmailSent =
      false;


    try {

      await sendTicketEmail({
        to:
          request.customerEmail,

        booking:
          createdBooking,
      });

      customerEmailSent =
        true;

      console.log(
        "Customer ticket email sent."
      );

    } catch (emailError) {

      console.error(
        "CUSTOMER TICKET EMAIL ERROR:",
        emailError.message
      );
    }


    /* =====================================================
       SEND ADMIN TICKET
    ===================================================== */

    try {

      if (process.env.EMAIL_USER) {

        await sendTicketEmail({
          to:
            process.env.EMAIL_USER,

          booking:
            createdBooking,
        });

        adminEmailSent =
          true;

        console.log(
          "Admin ticket email sent."
        );
      }

    } catch (emailError) {

      console.error(
        "ADMIN TICKET EMAIL ERROR:",
        emailError.message
      );
    }


    /* ---------- RESPONSE ---------- */

    return res.status(200).json({

      success: true,

      message:
        "Payment accepted and booking confirmed successfully.",

      booking:
        createdBooking,

      paymentRequest:
        request,

      emailStatus: {
        customer:
          customerEmailSent,

        admin:
          adminEmailSent,
      },
    });

  } catch (error) {

    console.error(
      "ACCEPT PAYMENT ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message ||
        "Failed to accept payment request.",
    });
  }
};


/* =========================================================
   REJECT PAYMENT REQUEST
========================================================= */

const rejectPaymentRequest = async (
  req,
  res
) => {
  try {

    const request =
      await PaymentRequest.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message:
          "Payment request not found.",
      });
    }


    /* ---------- ALREADY PROCESSED ---------- */

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,

        message:
          `Payment request is already ${request.status}.`,
      });
    }


    const adminNote =
      req.body?.adminNote || "";


    request.status =
      "Rejected";

    request.adminNote =
      adminNote;

    request.processedAt =
      new Date();

    /*
      Email action token clear.
    */

    request.adminActionToken =
      null;

    request.adminActionTokenExpiresAt =
      null;

    await request.save();


    return res.status(200).json({

      success: true,

      message:
        "Payment request rejected successfully.",

      paymentRequest:
        request,
    });

  } catch (error) {

    console.error(
      "REJECT PAYMENT ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message ||
        "Failed to reject payment request.",
    });
  }
};


/* =========================================================
   EMAIL ACTION TOKEN VALIDATION
========================================================= */

const validateEmailActionToken =
  async (
    requestId,
    token
  ) => {

    if (!token) {
      throw new Error(
        "Action token is missing."
      );
    }

    const request =
      await PaymentRequest.findById(
        requestId
      );

    if (!request) {
      throw new Error(
        "Payment request not found."
      );
    }


    if (request.status !== "Pending") {
      throw new Error(
        `Payment request is already ${request.status}.`
      );
    }


    if (
      !request.adminActionToken
    ) {
      throw new Error(
        "This email action link is no longer valid."
      );
    }


    if (
      request.adminActionTokenExpiresAt &&
      request.adminActionTokenExpiresAt <
        new Date()
    ) {
      throw new Error(
        "This email action link has expired."
      );
    }


    const tokenHash =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");


    const tokenMatches =
      crypto.timingSafeEqual(
        Buffer.from(
          tokenHash
        ),

        Buffer.from(
          request.adminActionToken
        )
      );


    if (!tokenMatches) {
      throw new Error(
        "Invalid email action token."
      );
    }


    return request;
  };


/* =========================================================
   EMAIL ACCEPT ACTION
========================================================= */

const emailAcceptPaymentRequest =
  async (req, res) => {

    try {

      const request =
        await validateEmailActionToken(
          req.params.id,
          req.query.token
        );


      /*
        Same acceptance logic ko reuse
        karne ke liye fake request/response
        create kar rahe hain.
      */

      const fakeRequest = {
        params: {
          id: request._id,
        },

        body: {
          adminNote:
            "Accepted from admin email.",
        },
      };


      let result;

      const fakeResponse = {
        status: function (
          statusCode
        ) {

          return {
            json: function (data) {

              result = {
                statusCode,
                data,
              };

              return data;
            },
          };
        },
      };


      await acceptPaymentRequest(
        fakeRequest,
        fakeResponse
      );


      if (
        !result ||
        result.statusCode >= 400
      ) {

        const message =
          result?.data?.message ||
          "Failed to accept payment.";

        return res
          .status(
            result?.statusCode ||
              500
          )
          .send(`
            <html>
              <head>
                <title>Saiyed Travels</title>
              </head>

              <body style="
                font-family:Arial;
                text-align:center;
                padding:50px;
              ">

                <h1>❌ Payment Acceptance Failed</h1>

                <p>
                  ${message}
                </p>

              </body>
            </html>
          `);
      }


      return res.status(200).send(`
        <html>
          <head>
            <title>Saiyed Travels</title>

            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </head>

          <body style="
            font-family:Arial;
            text-align:center;
            padding:40px 20px;
            background:#f5f7fa;
          ">

            <div style="
              max-width:500px;
              margin:auto;
              background:white;
              padding:30px;
              border-radius:15px;
              box-shadow:0 5px 25px rgba(0,0,0,.1);
            ">

              <div style="
                font-size:55px;
              ">
                ✅
              </div>

              <h1>
                Payment Accepted
              </h1>

              <p>
                Payment has been verified and
                the booking has been confirmed.
              </p>

              <p>
                The customer ticket has been
                sent by email.
              </p>

              <strong>
                Saiyed Travels
              </strong>

            </div>

          </body>
        </html>
      `);

    } catch (error) {

      console.error(
        "EMAIL ACCEPT ERROR:",
        error
      );

      return res.status(400).send(`
        <html>

          <head>
            <title>Saiyed Travels</title>
          </head>

          <body style="
            font-family:Arial;
            text-align:center;
            padding:50px;
          ">

            <h1>
              ❌ Action Failed
            </h1>

            <p>
              ${error.message}
            </p>

          </body>

        </html>
      `);
    }
  };


/* =========================================================
   EMAIL REJECT ACTION
========================================================= */

const emailRejectPaymentRequest =
  async (req, res) => {

    try {

      const request =
        await validateEmailActionToken(
          req.params.id,
          req.query.token
        );


      const fakeRequest = {
        params: {
          id: request._id,
        },

        body: {
          adminNote:
            "Rejected from admin email.",
        },
      };


      let result;

      const fakeResponse = {
        status: function (
          statusCode
        ) {

          return {
            json: function (data) {

              result = {
                statusCode,
                data,
              };

              return data;
            },
          };
        },
      };


      await rejectPaymentRequest(
        fakeRequest,
        fakeResponse
      );


      if (
        !result ||
        result.statusCode >= 400
      ) {

        const message =
          result?.data?.message ||
          "Failed to reject payment.";

        return res
          .status(
            result?.statusCode ||
              500
          )
          .send(`
            <html>

              <head>
                <title>Saiyed Travels</title>
              </head>

              <body style="
                font-family:Arial;
                text-align:center;
                padding:50px;
              ">

                <h1>
                  ❌ Payment Rejection Failed
                </h1>

                <p>
                  ${message}
                </p>

              </body>

            </html>
          `);
      }


      return res.status(200).send(`
        <html>

          <head>

            <title>
              Saiyed Travels
            </title>

            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />

          </head>


          <body style="
            font-family:Arial;
            text-align:center;
            padding:40px 20px;
            background:#f5f7fa;
          ">

            <div style="
              max-width:500px;
              margin:auto;
              background:white;
              padding:30px;
              border-radius:15px;
              box-shadow:0 5px 25px rgba(0,0,0,.1);
            ">

              <div style="
                font-size:55px;
              ">
                ❌
              </div>

              <h1>
                Payment Rejected
              </h1>

              <p>
                The payment request has been
                rejected successfully.
              </p>

              <strong>
                Saiyed Travels
              </strong>

            </div>

          </body>

        </html>
      `);

    } catch (error) {

      console.error(
        "EMAIL REJECT ERROR:",
        error
      );

      return res.status(400).send(`
        <html>

          <head>
            <title>Saiyed Travels</title>
          </head>

          <body style="
            font-family:Arial;
            text-align:center;
            padding:50px;
          ">

            <h1>
              ❌ Action Failed
            </h1>

            <p>
              ${error.message}
            </p>

          </body>

        </html>
      `);
    }
  };


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {

  createPaymentRequest,

  getAllPaymentRequests,

  getPaymentRequestById,

  getPendingPaymentCount,

  acceptPaymentRequest,

  rejectPaymentRequest,

  emailAcceptPaymentRequest,

  emailRejectPaymentRequest,
};