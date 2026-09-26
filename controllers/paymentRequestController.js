
// // // const crypto = require("crypto");

// // // const mongoose = require("mongoose");

// // // const PaymentRequest = require("../models/PaymentRequest");
// // // const Booking = require("../models/Booking");
// // // const User = require("../models/User");

// // // const bookingController = require("./bookingController");

// // // const {
// // //   sendAdminPaymentNotification,
// // //   sendTicketEmail,
// // // } = require("../services/emailService");

// // // const {
// // //   sendTicketWhatsApp,
// // // } = require("../services/whatsappService");


// // // // =========================================================
// // // // GET ADMIN EMAIL
// // // // =========================================================

// // // const getAdminEmail = async () => {
// // //   try {
// // //     // First priority: Render Environment Variable
// // //     if (process.env.ADMIN_EMAIL) {
// // //       return String(process.env.ADMIN_EMAIL)
// // //         .trim()
// // //         .toLowerCase();
// // //     }

// // //     // Second priority: EMAIL_USER
// // //     if (process.env.EMAIL_USER) {
// // //       return String(process.env.EMAIL_USER)
// // //         .trim()
// // //         .toLowerCase();
// // //     }

// // //     // Third priority: Database admin
// // //     const admin = await User.findOne({
// // //       role: "admin",
// // //       isActive: true,
// // //     }).sort({
// // //       createdAt: -1,
// // //     });

// // //     if (!admin) {
// // //       throw new Error(
// // //         "Active admin account not found."
// // //       );
// // //     }

// // //     if (!admin.email) {
// // //       throw new Error(
// // //         "Admin email is missing."
// // //       );
// // //     }

// // //     return String(admin.email)
// // //       .trim()
// // //       .toLowerCase();

// // //   } catch (error) {
// // //     console.error(
// // //       "GET ADMIN EMAIL ERROR:",
// // //       error
// // //     );

// // //     throw error;
// // //   }
// // // };


// // // // =========================================================
// // // // CREATE PAYMENT REQUEST
// // // // POST /api/payment-requests
// // // // =========================================================

// // // const createPaymentRequest = async (
// // //   req,
// // //   res
// // // ) => {
// // //   try {

// // //     // -----------------------------------------------------
// // //     // FILE CHECK
// // //     // -----------------------------------------------------

// // //     if (!req.file) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message:
// // //           "Payment screenshot is required.",
// // //       });
// // //     }


// // //     // -----------------------------------------------------
// // //     // GET FORM DATA
// // //     // -----------------------------------------------------

// // //     const {
// // //       bookingData,
// // //       amount,
// // //       bankName,
// // //       paymentId,
// // //       paymentDateTime,
// // //       customerEmail,
// // //       whatsappNumber,
// // //     } = req.body;


// // //     // -----------------------------------------------------
// // //     // BASIC VALIDATION
// // //     // -----------------------------------------------------

// // //     if (!bookingData) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message:
// // //           "Booking data is required.",
// // //       });
// // //     }


// // //     if (!amount) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message:
// // //           "Payment amount is required.",
// // //       });
// // //     }


// // //     if (
// // //       bankName !== "ICICI Bank" &&
// // //       bankName !== "Bank of Baroda"
// // //     ) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message:
// // //           "Please select a valid bank.",
// // //       });
// // //     }


// // //     if (!paymentId) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message:
// // //           "Payment ID / UTR is required.",
// // //       });
// // //     }


// // //     if (!paymentDateTime) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message:
// // //           "Payment date/time is required.",
// // //       });
// // //     }


// // //     if (!whatsappNumber) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message:
// // //           "WhatsApp number is required.",
// // //       });
// // //     }


// // //     // -----------------------------------------------------
// // //     // PARSE BOOKING DATA
// // //     // -----------------------------------------------------

// // //     let parsedBookingData;

// // //     try {

// // //       parsedBookingData =
// // //         typeof bookingData === "string"
// // //           ? JSON.parse(bookingData)
// // //           : bookingData;

// // //     } catch (error) {

// // //       return res.status(400).json({
// // //         success: false,
// // //         message:
// // //           "Invalid booking data.",
// // //       });

// // //     }


// // //     // -----------------------------------------------------
// // //     // CUSTOMER EMAIL FALLBACK
// // //     // -----------------------------------------------------

// // //     // const finalCustomerEmail =
// // //     //   String(
// // //     //     customerEmail ||
// // //     //       parsedBookingData?.customerEmail ||
// // //     //       parsedBookingData?.email ||
// // //     //       parsedBookingData?.userEmail ||
// // //     //       ""
// // //     //   )
// // //     //     .trim()
// // //     //     .toLowerCase();


// // //     const finalCustomerEmail =
// // //   String(
// // //     customerEmail ||
// // //       parsedBookingData?.customerEmail ||
// // //       parsedBookingData?.email ||
// // //       parsedBookingData?.userEmail ||
// // //       ""
// // //   )
// // //     .trim()
// // //     .toLowerCase();

// // // // CUSTOMER EMAIL REQUIRED
// // // if (!finalCustomerEmail) {
// // //   return res.status(400).json({
// // //     success: false,
// // //     message:
// // //       "Customer email is required. Please enter customer email before submitting payment.",
// // //   });
// // // }


// // //     // -----------------------------------------------------
// // //     // WHATSAPP FALLBACK
// // //     // -----------------------------------------------------

// // //     const finalWhatsappNumber =
// // //       String(
// // //         whatsappNumber ||
// // //           parsedBookingData?.whatsappNumber ||
// // //           parsedBookingData?.phone ||
// // //           parsedBookingData?.mobile ||
// // //           ""
// // //       ).trim();


// // //     // -----------------------------------------------------
// // //     // ADD CONTACT DATA INSIDE BOOKING DATA
// // //     // -----------------------------------------------------

// // //     parsedBookingData = {
// // //       ...parsedBookingData,

// // //       customerEmail:
// // //         finalCustomerEmail,

// // //       email:
// // //         parsedBookingData?.email ||
// // //         finalCustomerEmail,

// // //       whatsappNumber:
// // //         finalWhatsappNumber,
// // //     };


// // //     // -----------------------------------------------------
// // //     // PAYMENT DATE
// // //     // -----------------------------------------------------

// // //     const parsedPaymentDate =
// // //       new Date(paymentDateTime);


// // //     if (
// // //       Number.isNaN(
// // //         parsedPaymentDate.getTime()
// // //       )
// // //     ) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message:
// // //           "Invalid payment date/time.",
// // //       });
// // //     }


// // //     // -----------------------------------------------------
// // //     // SCREENSHOT URL
// // //     // -----------------------------------------------------

// // //     const screenshotPath =
// // //       `/uploads/payment-screenshots/${req.file.filename}`;


// // //     // =====================================================
// // //     // CREATE PAYMENT REQUEST
// // //     // =====================================================

// // //     const request =
// // //       await PaymentRequest.create({

// // //         bookingData:
// // //           parsedBookingData,

// // //         amount:
// // //           Number(amount),

// // //         bankName,

// // //         paymentId:
// // //           String(paymentId).trim(),

// // //         screenshot:
// // //           screenshotPath,

// // //         paymentDateTime:
// // //           parsedPaymentDate,

// // //         customerEmail:
// // //           finalCustomerEmail,

// // //         whatsappNumber:
// // //           finalWhatsappNumber,

// // //         status:
// // //           "Pending",

// // //         adminActionToken:
// // //           null,

// // //         adminActionTokenExpiresAt:
// // //           null,

// // //       });


// // //     // =====================================================
// // //     // CREATE ADMIN EMAIL ACTION TOKEN
// // //     // =====================================================

// // //     const rawToken =
// // //       crypto
// // //         .randomBytes(32)
// // //         .toString("hex");


// // //     const tokenHash =
// // //       crypto
// // //         .createHash("sha256")
// // //         .update(rawToken)
// // //         .digest("hex");


// // //     const tokenExpiry =
// // //       new Date(
// // //         Date.now() +
// // //           7 *
// // //           24 *
// // //           60 *
// // //           60 *
// // //           1000
// // //       );


// // //     request.adminActionToken =
// // //       tokenHash;

// // //     request.adminActionTokenExpiresAt =
// // //       tokenExpiry;


// // //     await request.save();


// // //     // =====================================================
// // //     // GET ADMIN EMAIL
// // //     // =====================================================

// // //     let adminEmail = null;

// // //     try {

// // //       adminEmail =
// // //         await getAdminEmail();

// // //       console.log(
// // //         "ADMIN PAYMENT EMAIL:",
// // //         adminEmail
// // //       );

// // //     } catch (error) {

// // //       console.error(
// // //         "ADMIN EMAIL LOOKUP ERROR:",
// // //         error
// // //       );

// // //     }


// // //     // =====================================================
// // //     // SEND ADMIN PAYMENT REQUEST EMAIL
// // //     // =====================================================

// // //     if (adminEmail) {

// // //       try {

// // //         await sendAdminPaymentNotification({
// // //           paymentRequest:
// // //             request,

// // //           adminActionToken:
// // //             rawToken,

// // //           adminEmail:
// // //             adminEmail,
// // //         });


// // //         console.log(
// // //           "ADMIN PAYMENT REQUEST EMAIL SENT TO:",
// // //           adminEmail
// // //         );

// // //       } catch (emailError) {

// // //         console.error(
// // //           "ADMIN PAYMENT EMAIL ERROR:",
// // //           emailError
// // //         );

// // //       }

// // //     } else {

// // //       console.error(
// // //         "ADMIN EMAIL NOT FOUND - EMAIL NOT SENT"
// // //       );

// // //     }


// // //     // =====================================================
// // //     // RESPONSE
// // //     // =====================================================

// // //     return res.status(201).json({

// // //       success: true,

// // //       message:
// // //         "Payment request submitted successfully. Waiting for admin verification.",

// // //       paymentRequest: {

// // //         id:
// // //           request._id,

// // //         status:
// // //           request.status,

// // //         amount:
// // //           request.amount,

// // //         bankName:
// // //           request.bankName,

// // //         paymentId:
// // //           request.paymentId,

// // //         customerEmail:
// // //           request.customerEmail,

// // //         whatsappNumber:
// // //           request.whatsappNumber,

// // //       },

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


// // // // =========================================================
// // // // GET ALL PAYMENT REQUESTS
// // // // GET /api/payment-requests
// // // // =========================================================

// // // const getAllPaymentRequests =
// // //   async (req, res) => {

// // //     try {

// // //       const requests =
// // //         await PaymentRequest.find()
// // //           .populate(
// // //             "approvedBookingId"
// // //           )
// // //           .sort({
// // //             createdAt: -1,
// // //           });


// // //       return res.status(200).json({

// // //         success: true,

// // //         count:
// // //           requests.length,

// // //         requests:
// // //           requests,

// // //       });

// // //     } catch (error) {

// // //       console.error(
// // //         "GET PAYMENT REQUESTS ERROR:",
// // //         error
// // //       );

// // //       return res.status(500).json({

// // //         success: false,

// // //         message:
// // //           error.message ||
// // //           "Failed to get payment requests.",

// // //       });

// // //     }

// // //   };


// // // // =========================================================
// // // // GET SINGLE PAYMENT REQUEST
// // // // GET /api/payment-requests/:id
// // // // =========================================================

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

// // //         request:
// // //           request,

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


// // // // =========================================================
// // // // CUSTOMER PAYMENT STATUS
// // // // GET /api/payment-requests/:id/status
// // // // =========================================================

// // // const getCustomerPaymentStatus =
// // //   async (req, res) => {

// // //     try {

// // //       const requestId =
// // //         req.params.id;


// // //       if (!requestId) {

// // //         return res.status(400).json({

// // //           success: false,

// // //           message:
// // //             "Payment request ID is required.",

// // //         });

// // //       }


// // //       if (
// // //         !mongoose.Types.ObjectId.isValid(
// // //           requestId
// // //         )
// // //       ) {

// // //         return res.status(400).json({

// // //           success: false,

// // //           message:
// // //             "Invalid payment request ID.",

// // //         });

// // //       }


// // //       const request =
// // //         await PaymentRequest.findById(
// // //           requestId
// // //         );


// // //       if (!request) {

// // //         return res.status(404).json({

// // //           success: false,

// // //           message:
// // //             "Payment request not found.",

// // //         });

// // //       }


// // //       // ===================================================
// // //       // PENDING
// // //       // ===================================================

// // //       if (
// // //         request.status ===
// // //         "Pending"
// // //       ) {

// // //         return res.status(200).json({

// // //           success: true,

// // //           status:
// // //             "Pending",

// // //           approvedBookingId:
// // //             null,

// // //           booking:
// // //             null,

// // //           message:
// // //             "Payment is waiting for admin verification.",

// // //         });

// // //       }


// // //       // ===================================================
// // //       // REJECTED
// // //       // ===================================================

// // //       if (
// // //         request.status ===
// // //         "Rejected"
// // //       ) {

// // //         return res.status(200).json({

// // //           success: true,

// // //           status:
// // //             "Rejected",

// // //           approvedBookingId:
// // //             null,

// // //           booking:
// // //             null,

// // //           adminNote:
// // //             request.adminNote ||
// // //             "",

// // //           message:
// // //             "Payment request was rejected.",

// // //         });

// // //       }





























// // // //       // =========================================================
// // // // // DELETE PAYMENT REQUEST
// // // // // DELETE /api/payment-requests/:id
// // // // //
// // // // // Pending request cannot be deleted.
// // // // // Accepted / Rejected request can be deleted.
// // // // // IMPORTANT:
// // // // // This only deletes PaymentRequest.
// // // // // Confirmed Booking will NOT be deleted.
// // // // // =========================================================

// // // // const deletePaymentRequest = async (req, res) => {
// // // //   try {
// // // //     const request = await PaymentRequest.findById(
// // // //       req.params.id
// // // //     );

// // // //     // -------------------------------------------------------
// // // //     // REQUEST NOT FOUND
// // // //     // -------------------------------------------------------

// // // //     if (!request) {
// // // //       return res.status(404).json({
// // // //         success: false,
// // // //         message: "Payment request not found.",
// // // //       });
// // // //     }

// // // //     // -------------------------------------------------------
// // // //     // PENDING CANNOT BE DELETED
// // // //     // -------------------------------------------------------

// // // //     if (
// // // //       String(request.status).toLowerCase() ===
// // // //       "pending"
// // // //     ) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message:
// // // //           "Pending payment request cannot be deleted. Accept or reject it first.",
// // // //       });
// // // //     }

// // // //     // -------------------------------------------------------
// // // //     // DELETE PAYMENT REQUEST
// // // //     // -------------------------------------------------------

// // // //     await PaymentRequest.findByIdAndDelete(
// // // //       req.params.id
// // // //     );

// // // //     return res.status(200).json({
// // // //       success: true,
// // // //       message:
// // // //         "Payment request deleted successfully.",
// // // //     });
// // // //   } catch (error) {
// // // //     console.error(
// // // //       "DELETE PAYMENT REQUEST ERROR:",
// // // //       error
// // // //     );

// // // //     return res.status(500).json({
// // // //       success: false,
// // // //       message:
// // // //         error.message ||
// // // //         "Failed to delete payment request.",
// // // //     });
// // // //   }
// // // // };
























// // //       // ===================================================
// // //       // ACCEPTED
// // //       // ===================================================

// // //       if (
// // //         request.status ===
// // //           "Accepted" &&
// // //         request.approvedBookingId
// // //       ) {

// // //         const booking =
// // //           await Booking.findById(
// // //             request.approvedBookingId
// // //           ).lean();


// // //         if (!booking) {

// // //           return res.status(200).json({

// // //             success: true,

// // //             status:
// // //               "Accepted",

// // //             approvedBookingId:
// // //               String(
// // //                 request.approvedBookingId
// // //               ),

// // //             booking:
// // //               null,

// // //             message:
// // //               "Payment accepted. Booking is loading.",

// // //           });

// // //         }


// // //         return res.status(200).json({

// // //           success: true,

// // //           status:
// // //             "Accepted",

// // //           approvedBookingId:
// // //             String(
// // //               request.approvedBookingId
// // //             ),

// // //           booking:
// // //             booking,

// // //           message:
// // //             "Payment accepted and booking confirmed.",

// // //         });

// // //       }


// // //       // ===================================================
// // //       // OTHER STATUS
// // //       // ===================================================

// // //       return res.status(200).json({

// // //         success: true,

// // //         status:
// // //           request.status,

// // //         approvedBookingId:
// // //           request.approvedBookingId
// // //             ? String(
// // //                 request.approvedBookingId
// // //               )
// // //             : null,

// // //         booking:
// // //           null,

// // //       });

// // //     } catch (error) {

// // //       console.error(
// // //         "CUSTOMER PAYMENT STATUS ERROR:",
// // //         error
// // //       );

// // //       return res.status(500).json({

// // //         success: false,

// // //         message:
// // //           error.message ||
// // //           "Failed to check payment status.",

// // //       });

// // //     }

// // //   };


// // // // =========================================================
// // // // GET PENDING PAYMENT COUNT
// // // // GET /api/payment-requests/pending-count
// // // // =========================================================

// // // const getPendingPaymentCount =
// // //   async (req, res) => {

// // //     try {

// // //       const count =
// // //         await PaymentRequest.countDocuments({
// // //           status:
// // //             "Pending",
// // //         });


// // //       return res.status(200).json({

// // //         success: true,

// // //         count:
// // //           count,

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


// // // // =========================================================
// // // // ACCEPT PAYMENT REQUEST
// // // // PUT /api/payment-requests/:id/accept
// // // // =========================================================















// // // // const acceptPaymentRequest =
// // // //   async (req, res) => {

// // // //     try {

// // // //       const {
// // // //         adminNote,
// // // //       } = req.body || {};


// // // //       // ---------------------------------------------------
// // // //       // FIND PAYMENT REQUEST
// // // //       // ---------------------------------------------------

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


// // // //       // ---------------------------------------------------
// // // //       // ONLY PENDING CAN BE ACCEPTED
// // // //       // ---------------------------------------------------

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


// // // //       // ---------------------------------------------------
// // // //       // BOOKING DATA CHECK
// // // //       // ---------------------------------------------------

// // // //       if (!request.bookingData) {

// // // //         return res.status(400).json({

// // // //           success: false,

// // // //           message:
// // // //             "Booking data is missing from payment request.",

// // // //         });

// // // //       }


// // // //       // ---------------------------------------------------
// // // //       // COPY BOOKING DATA
// // // //       // ---------------------------------------------------

// // // //       const bookingData =
// // // //         JSON.parse(
// // // //           JSON.stringify(
// // // //             request.bookingData
// // // //           )
// // // //         );


// // // //       // ===================================================
// // // //       // CUSTOMER EMAIL
// // // //       // ===================================================

// // // //       const customerEmail =
// // // //         String(
// // // //           request.customerEmail ||
// // // //             bookingData?.customerEmail ||
// // // //             bookingData?.email ||
// // // //             bookingData?.userEmail ||
// // // //             ""
// // // //         )
// // // //           .trim()
// // // //           .toLowerCase();


// // // //       // ===================================================
// // // //       // CUSTOMER WHATSAPP
// // // //       // ===================================================

// // // //       const whatsappNumber =
// // // //         String(
// // // //           request.whatsappNumber ||
// // // //             bookingData?.whatsappNumber ||
// // // //             bookingData?.phone ||
// // // //             bookingData?.mobile ||
// // // //             ""
// // // //         ).trim();


// // // //       // ===================================================
// // // //       // CREATE CONFIRMED BOOKING
// // // //       // ===================================================




// // // // const fakeReq = {
// // // //   body: {
// // // //     ...bookingData,

// // // //     // IMPORTANT:
// // // //     // Customer ka original userId preserve karo
// // // //     userId:
// // // //       bookingData?.userId ||
// // // //       bookingData?.user?._id ||
// // // //       bookingData?.user?.id ||
// // // //       null,

// // // //     // ------------------------------------------------
// // // //     // CUSTOMER EMAIL
// // // //     // ------------------------------------------------
// // // //     customerEmail: customerEmail,

// // // //     email:
// // // //       bookingData?.email ||
// // // //       customerEmail,

// // // //     // ------------------------------------------------
// // // //     // BAGGAGE
// // // //     // ------------------------------------------------
// // // //     baggage: {
// // // //       ...(bookingData?.baggage || {}),

// // // //       cabinBaggage:
// // // //         bookingData?.baggage?.cabinBaggage ||
// // // //         bookingData?.baggage?.cabin ||
// // // //         bookingData?.flight?.cabinBaggage ||
// // // //         bookingData?.flight?.baggage?.cabin ||
// // // //         bookingData?.cabinBaggage ||
// // // //         "",

// // // //       checkinBaggage:
// // // //         bookingData?.baggage?.checkinBaggage ||
// // // //         bookingData?.baggage?.checkin ||
// // // //         bookingData?.baggage?.weight ||
// // // //         bookingData?.flight?.checkinBaggage ||
// // // //         bookingData?.flight?.baggage?.checkin ||
// // // //         bookingData?.checkinBaggage ||
// // // //         "",
// // // //     },

// // // //     // ------------------------------------------------
// // // //     // WHATSAPP
// // // //     // ------------------------------------------------
// // // //     whatsappNumber: whatsappNumber,

// // // //     // ------------------------------------------------
// // // //     // PAYMENT
// // // //     // ------------------------------------------------
// // // //     paymentVerified: true,
// // // //     paymentStatus: "Paid",
// // // //     bookingStatus: "Confirmed",
// // // //     paymentMethod: request.bankName,
// // // //     paymentId: request.paymentId,
// // // //   },

// // // //   user: req.user,
// // // // };













































// // // //       // const fakeReq = {

// // // //       //   body: {

// // // //       //     ...bookingData,


// // // //       //     // ------------------------------------------------
// // // //       //     // CUSTOMER EMAIL
// // // //       //     // ------------------------------------------------

// // // //       //     customerEmail:
// // // //       //       customerEmail,

// // // //       //     email:
// // // //       //       bookingData?.email ||
// // // //       //       customerEmail,


// // // //       //     // ------------------------------------------------
// // // //       //     // BAGGAGE
// // // //       //     // ------------------------------------------------

// // // //       //     baggage: {

// // // //       //       ...(bookingData?.baggage || {}),


// // // //       //       cabinBaggage:

// // // //       //         bookingData?.baggage
// // // //       //           ?.cabinBaggage ||

// // // //       //         bookingData?.baggage
// // // //       //           ?.cabin ||

// // // //       //         bookingData?.flight
// // // //       //           ?.cabinBaggage ||

// // // //       //         bookingData?.flight
// // // //       //           ?.baggage
// // // //       //           ?.cabin ||

// // // //       //         bookingData?.cabinBaggage ||

// // // //       //         "",


// // // //       //       checkinBaggage:

// // // //       //         bookingData?.baggage
// // // //       //           ?.checkinBaggage ||

// // // //       //         bookingData?.baggage
// // // //       //           ?.checkin ||

// // // //       //         bookingData?.baggage
// // // //       //           ?.weight ||

// // // //       //         bookingData?.flight
// // // //       //           ?.checkinBaggage ||

// // // //       //         bookingData?.flight
// // // //       //           ?.baggage
// // // //       //           ?.checkin ||

// // // //       //         bookingData?.checkinBaggage ||

// // // //       //         "",
// // // //       //     },


// // // //       //     // ------------------------------------------------
// // // //       //     // WHATSAPP
// // // //       //     // ------------------------------------------------

// // // //       //     whatsappNumber:
// // // //       //       whatsappNumber,


// // // //       //     // ------------------------------------------------
// // // //       //     // PAYMENT
// // // //       //     // ------------------------------------------------

// // // //       //     paymentVerified:
// // // //       //       true,

// // // //       //     paymentStatus:
// // // //       //       "Paid",

// // // //       //     bookingStatus:
// // // //       //       "Confirmed",

// // // //       //     paymentMethod:
// // // //       //       request.bankName,

// // // //       //     paymentId:
// // // //       //       request.paymentId,

// // // //       //   },


// // // //       //   user:
// // // //       //     req.user,

// // // //       // };


// // // //       let createdBooking =
// // // //         null;


// // // //       // ===================================================
// // // //       // CREATE BOOKING
// // // //       // ===================================================

// // // //       const fakeRes = {

// // // //         status(code) {

// // // //           return {

// // // //             json(data) {

// // // //               if (
// // // //                 code >= 200 &&
// // // //                 code < 300
// // // //               ) {

// // // //                 createdBooking =
// // // //                   data?.booking ||
// // // //                   data?.data ||
// // // //                   data;

// // // //               } else {

// // // //                 throw new Error(
// // // //                   data?.message ||
// // // //                   "Failed to create booking."
// // // //                 );

// // // //               }

// // // //             },

// // // //           };

// // // //         },

// // // //       };


// // // //       await bookingController.createBooking(
// // // //         fakeReq,
// // // //         fakeRes
// // // //       );


// // // //       // ===================================================
// // // //       // CHECK BOOKING
// // // //       // ===================================================

// // // //       if (!createdBooking) {

// // // //         throw new Error(
// // // //           "Booking was not created."
// // // //         );

// // // //       }


// // // //       // ===================================================
// // // //       // UPDATE PAYMENT REQUEST
// // // //       // ===================================================

// // // //       request.status =
// // // //         "Accepted";


// // // //       request.approvedBookingId =
// // // //         createdBooking._id;


// // // //       request.adminNote =
// // // //         adminNote || "";


// // // //       request.processedAt =
// // // //         new Date();


// // // //       request.adminActionToken =
// // // //         null;


// // // //       request.adminActionTokenExpiresAt =
// // // //         null;


// // // //       // ---------------------------------------------------
// // // //       // SAVE CUSTOMER EMAIL IF IT WAS MISSING
// // // //       // ---------------------------------------------------

// // // //       if (
// // // //         customerEmail &&
// // // //         !request.customerEmail
// // // //       ) {

// // // //         request.customerEmail =
// // // //           customerEmail;

// // // //       }


// // // //       // ---------------------------------------------------
// // // //       // SAVE WHATSAPP IF IT WAS MISSING
// // // //       // ---------------------------------------------------

// // // //       if (
// // // //         whatsappNumber &&
// // // //         !request.whatsappNumber
// // // //       ) {

// // // //         request.whatsappNumber =
// // // //           whatsappNumber;

// // // //       }


// // // //       await request.save();


// // // //       // ===================================================
// // // //       // CUSTOMER TICKET EMAIL
// // // //       // ===================================================

// // // //       let customerEmailSent =
// // // //         false;


// // // //       try {

// // // //         if (!customerEmail) {

// // // //           console.error(
// // // //             "CUSTOMER TICKET EMAIL ERROR: Customer email is missing."
// // // //           );

// // // //         } else {

// // // //           await sendTicketEmail({

// // // //             to:
// // // //               customerEmail,

// // // //             booking:
// // // //               createdBooking,

// // // //           });


// // // //           customerEmailSent =
// // // //             true;


// // // //           console.log(
// // // //             "CUSTOMER TICKET PDF SENT TO EMAIL:",
// // // //             customerEmail
// // // //           );

// // // //         }

// // // //       } catch (emailError) {

// // // //         console.error(
// // // //           "CUSTOMER TICKET EMAIL ERROR:",
// // // //           emailError
// // // //         );

// // // //       }


// // // //       // ===================================================
// // // //       // ADMIN TICKET EMAIL
// // // //       // ===================================================

// // // //       let adminEmailSent =
// // // //         false;


// // // //       try {

// // // //         const adminEmail =
// // // //           await getAdminEmail();


// // // //         if (!adminEmail) {

// // // //           console.error(
// // // //             "ADMIN TICKET EMAIL ERROR: Admin email is missing."
// // // //           );

// // // //         } else {

// // // //           await sendTicketEmail({

// // // //             to:
// // // //               adminEmail,

// // // //             booking:
// // // //               createdBooking,

// // // //           });


// // // //           adminEmailSent =
// // // //             true;


// // // //           console.log(
// // // //             "ADMIN TICKET PDF SENT TO:",
// // // //             adminEmail
// // // //           );

// // // //         }

// // // //       } catch (adminEmailError) {

// // // //         console.error(
// // // //           "ADMIN TICKET EMAIL ERROR:",
// // // //           adminEmailError
// // // //         );

// // // //       }


// // // //       // ===================================================
// // // //       // CUSTOMER WHATSAPP TICKET
// // // //       // ===================================================

// // // //       let whatsappSent =
// // // //         false;


// // // //       try {

// // // //         if (!whatsappNumber) {

// // // //           console.error(
// // // //             "CUSTOMER TICKET WHATSAPP ERROR: WhatsApp number is missing."
// // // //           );

// // // //         } else {

// // // //           await sendTicketWhatsApp({

// // // //             to:
// // // //               whatsappNumber,

// // // //             booking:
// // // //               createdBooking,

// // // //           });


// // // //           whatsappSent =
// // // //             true;


// // // //           console.log(
// // // //             "CUSTOMER TICKET WHATSAPP SENT TO:",
// // // //             whatsappNumber
// // // //           );

// // // //         }

// // // //       } catch (whatsappError) {

// // // //         console.error(
// // // //           "CUSTOMER TICKET WHATSAPP ERROR:",
// // // //           whatsappError
// // // //         );

// // // //       }


// // // //       // ===================================================
// // // //       // RESPONSE
// // // //       // ===================================================

// // // //       return res.status(200).json({

// // // //         success: true,

// // // //         message:
// // // //           "Payment accepted and booking confirmed successfully.",

// // // //         paymentRequest:
// // // //           request,

// // // //         booking:
// // // //           createdBooking,

// // // //         ticketStatus: {

// // // //           customerEmail:
// // // //             customerEmailSent
// // // //               ? "sent"
// // // //               : "failed",

// // // //           adminEmail:
// // // //             adminEmailSent
// // // //               ? "sent"
// // // //               : "failed",

// // // //           whatsapp:
// // // //             whatsappSent
// // // //               ? "sent"
// // // //               : "failed",

// // // //         },

// // // //       });

// // // //     } catch (error) {

// // // //       console.error(
// // // //         "ACCEPT PAYMENT ERROR:",
// // // //         error
// // // //       );

// // // //       return res.status(500).json({

// // // //         success: false,

// // // //         message:
// // // //           error.message ||
// // // //           "Failed to accept payment.",

// // // //       });

// // // //     }

// // // //   };












// // // // =========================================================
// // // // ACCEPT PAYMENT REQUEST
// // // // PUT /api/payment-requests/:id/accept
// // // // =========================================================

// // // const acceptPaymentRequest = async (req, res) => {
// // //   try {
// // //     const { adminNote } = req.body || {};

// // //     // -----------------------------------------------------
// // //     // FIND PAYMENT REQUEST
// // //     // -----------------------------------------------------

// // //     const request = await PaymentRequest.findById(req.params.id);

// // //     if (!request) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: "Payment request not found.",
// // //       });
// // //     }

// // //     // -----------------------------------------------------
// // //     // ONLY PENDING CAN BE ACCEPTED
// // //     // -----------------------------------------------------

// // //     if (request.status !== "Pending") {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: `Payment request is already ${request.status}.`,
// // //       });
// // //     }

// // //     // -----------------------------------------------------
// // //     // BOOKING DATA CHECK
// // //     // -----------------------------------------------------

// // //     if (!request.bookingData) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "Booking data is missing from payment request.",
// // //       });
// // //     }

// // //     // -----------------------------------------------------
// // //     // COPY BOOKING DATA
// // //     // -----------------------------------------------------

// // //     const bookingData = JSON.parse(
// // //       JSON.stringify(request.bookingData)
// // //     );

// // //     // =====================================================
// // //     // CUSTOMER EMAIL
// // //     // =====================================================

// // //     const customerEmail = String(
// // //       request.customerEmail ||
// // //         bookingData?.customerEmail ||
// // //         bookingData?.email ||
// // //         bookingData?.userEmail ||
// // //         bookingData?.passenger?.email ||
// // //         bookingData?.passengers?.[0]?.email ||
// // //         ""
// // //     )
// // //       .trim()
// // //       .toLowerCase();

// // //     if (!customerEmail) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: "Customer email is missing from booking.",
// // //       });
// // //     }

// // //     // =====================================================
// // //     // CUSTOMER USER ID
// // //     // =====================================================

// // //     const rawUserId =
// // //       bookingData?.userId ||
// // //       bookingData?.user?._id ||
// // //       bookingData?.user?.id ||
// // //       null;

// // //     const customerUserId =
// // //       rawUserId &&
// // //       mongoose.Types.ObjectId.isValid(String(rawUserId))
// // //         ? new mongoose.Types.ObjectId(String(rawUserId))
// // //         : null;

// // //     console.log("====================================");
// // //     console.log("ACCEPT PAYMENT - CUSTOMER DETAILS");
// // //     console.log("EMAIL:", customerEmail);
// // //     console.log("USER ID:", customerUserId);
// // //     console.log("====================================");

// // //     // =====================================================
// // //     // CUSTOMER WHATSAPP
// // //     // =====================================================

// // //     const whatsappNumber = String(
// // //       request.whatsappNumber ||
// // //         bookingData?.whatsappNumber ||
// // //         bookingData?.phone ||
// // //         bookingData?.mobile ||
// // //         ""
// // //     ).trim();

// // //     // =====================================================
// // //     // CREATE CONFIRMED BOOKING
// // //     // =====================================================

// // //     const fakeReq = {
// // //       body: {
// // //         ...bookingData,

// // //         // -----------------------------------------------
// // //         // IMPORTANT: CUSTOMER IDENTITY
// // //         // -----------------------------------------------

// // //         userId: customerUserId
// // //           ? String(customerUserId)
// // //           : bookingData?.userId || null,

// // //         customerEmail: customerEmail,

// // //         email: customerEmail,

// // //         // -----------------------------------------------
// // //         // BAGGAGE
// // //         // -----------------------------------------------

// // //         baggage: {
// // //           ...(bookingData?.baggage || {}),

// // //           cabinBaggage:
// // //             bookingData?.baggage?.cabinBaggage ||
// // //             bookingData?.baggage?.cabin ||
// // //             bookingData?.flight?.cabinBaggage ||
// // //             bookingData?.flight?.baggage?.cabin ||
// // //             bookingData?.cabinBaggage ||
// // //             "",

// // //           checkinBaggage:
// // //             bookingData?.baggage?.checkinBaggage ||
// // //             bookingData?.baggage?.checkin ||
// // //             bookingData?.baggage?.weight ||
// // //             bookingData?.flight?.checkinBaggage ||
// // //             bookingData?.flight?.baggage?.checkin ||
// // //             bookingData?.checkinBaggage ||
// // //             "",
// // //         },

// // //         // -----------------------------------------------
// // //         // WHATSAPP
// // //         // -----------------------------------------------

// // //         whatsappNumber: whatsappNumber,

// // //         // -----------------------------------------------
// // //         // PAYMENT
// // //         // -----------------------------------------------

// // //         paymentVerified: true,

// // //         paymentStatus: "Paid",

// // //         bookingStatus: "Confirmed",

// // //         paymentMethod: request.bankName,

// // //         paymentId: request.paymentId,
// // //       },

// // //       // Important for bookingController
// // //       user: req.user || null,
// // //     };

// // //     let createdBooking = null;

// // //     // =====================================================
// // //     // CREATE BOOKING
// // //     // =====================================================

// // //     const fakeRes = {
// // //       status(code) {
// // //         return {
// // //           json(data) {
// // //             if (code >= 200 && code < 300) {
// // //               createdBooking =
// // //                 data?.booking ||
// // //                 data?.data ||
// // //                 data;
// // //             } else {
// // //               throw new Error(
// // //                 data?.message ||
// // //                   "Failed to create booking."
// // //               );
// // //             }
// // //           },
// // //         };
// // //       },
// // //     };

// // //     await bookingController.createBooking(
// // //       fakeReq,
// // //       fakeRes
// // //     );

// // //     // =====================================================
// // //     // CHECK BOOKING
// // //     // =====================================================

// // //     if (!createdBooking?._id) {
// // //       throw new Error(
// // //         "Booking was not created."
// // //       );
// // //     }

// // //     // =====================================================
// // //     // VERY IMPORTANT
// // //     // FORCE EMAIL + USER ID INTO FINAL BOOKING
// // //     // =====================================================

// // //     const bookingUpdate = {
// // //       email: customerEmail,
// // //       customerEmail: customerEmail,
// // //     };

// // //     if (customerUserId) {
// // //       bookingUpdate.userId = customerUserId;
// // //     }

// // //     const finalBooking =
// // //       await Booking.findByIdAndUpdate(
// // //         createdBooking._id,
// // //         {
// // //           $set: bookingUpdate,
// // //         },
// // //         {
// // //           new: true,
// // //         }
// // //       ).lean();

// // //     if (!finalBooking) {
// // //       throw new Error(
// // //         "Booking was created but could not be linked to customer."
// // //       );
// // //     }

// // //     createdBooking = finalBooking;

// // //     console.log("====================================");
// // //     console.log("BOOKING SAVED SUCCESSFULLY");
// // //     console.log("BOOKING ID:", createdBooking._id);
// // //     console.log("BOOKING EMAIL:", createdBooking.email);
// // //     console.log(
// // //       "BOOKING CUSTOMER EMAIL:",
// // //       createdBooking.customerEmail
// // //     );
// // //     console.log(
// // //       "BOOKING USER ID:",
// // //       createdBooking.userId || "NOT AVAILABLE"
// // //     );
// // //     console.log("====================================");

// // //     // =====================================================
// // //     // UPDATE PAYMENT REQUEST
// // //     // =====================================================

// // //     request.status = "Accepted";

// // //     request.approvedBookingId =
// // //       createdBooking._id;

// // //     request.adminNote =
// // //       adminNote || "";

// // //     request.processedAt =
// // //       new Date();

// // //     request.adminActionToken =
// // //       null;

// // //     request.adminActionTokenExpiresAt =
// // //       null;

// // //     if (
// // //       customerEmail &&
// // //       !request.customerEmail
// // //     ) {
// // //       request.customerEmail =
// // //         customerEmail;
// // //     }

// // //     if (
// // //       whatsappNumber &&
// // //       !request.whatsappNumber
// // //     ) {
// // //       request.whatsappNumber =
// // //         whatsappNumber;
// // //     }

// // //     await request.save();

// // //     // =====================================================
// // //     // CUSTOMER TICKET EMAIL
// // //     // =====================================================

// // //     let customerEmailSent = false;

// // //     try {
// // //       await sendTicketEmail({
// // //         to: customerEmail,
// // //         booking: createdBooking,
// // //       });

// // //       customerEmailSent = true;

// // //       console.log(
// // //         "CUSTOMER TICKET EMAIL SENT:",
// // //         customerEmail
// // //       );
// // //     } catch (emailError) {
// // //       console.error(
// // //         "CUSTOMER TICKET EMAIL ERROR:",
// // //         emailError
// // //       );
// // //     }

// // //     // =====================================================
// // //     // ADMIN TICKET EMAIL
// // //     // =====================================================

// // //     let adminEmailSent = false;

// // //     try {
// // //       const adminEmail =
// // //         await getAdminEmail();

// // //       if (adminEmail) {
// // //         await sendTicketEmail({
// // //           to: adminEmail,
// // //           booking: createdBooking,
// // //         });

// // //         adminEmailSent = true;

// // //         console.log(
// // //           "ADMIN TICKET EMAIL SENT:",
// // //           adminEmail
// // //         );
// // //       }
// // //     } catch (adminEmailError) {
// // //       console.error(
// // //         "ADMIN TICKET EMAIL ERROR:",
// // //         adminEmailError
// // //       );
// // //     }

// // //     // =====================================================
// // //     // CUSTOMER WHATSAPP TICKET
// // //     // =====================================================

// // //     let whatsappSent = false;

// // //     try {
// // //       if (whatsappNumber) {
// // //         await sendTicketWhatsApp({
// // //           to: whatsappNumber,
// // //           booking: createdBooking,
// // //         });

// // //         whatsappSent = true;

// // //         console.log(
// // //           "CUSTOMER TICKET WHATSAPP SENT:",
// // //           whatsappNumber
// // //         );
// // //       }
// // //     } catch (whatsappError) {
// // //       console.error(
// // //         "CUSTOMER TICKET WHATSAPP ERROR:",
// // //         whatsappError
// // //       );
// // //     }

// // //     // =====================================================
// // //     // RESPONSE
// // //     // =====================================================

// // //     return res.status(200).json({
// // //       success: true,

// // //       message:
// // //         "Payment accepted and booking confirmed successfully.",

// // //       paymentRequest: request,

// // //       booking: createdBooking,

// // //       ticketStatus: {
// // //         customerEmail:
// // //           customerEmailSent
// // //             ? "sent"
// // //             : "failed",

// // //         adminEmail:
// // //           adminEmailSent
// // //             ? "sent"
// // //             : "failed",

// // //         whatsapp:
// // //           whatsappSent
// // //             ? "sent"
// // //             : "failed",
// // //       },
// // //     });

// // //   } catch (error) {
// // //     console.error(
// // //       "ACCEPT PAYMENT ERROR:",
// // //       error
// // //     );

// // //     return res.status(500).json({
// // //       success: false,

// // //       message:
// // //         error.message ||
// // //         "Failed to accept payment.",
// // //     });
// // //   }
// // // };




























































// // // // =========================================================
// // // // REJECT PAYMENT REQUEST
// // // // PUT /api/payment-requests/:id/reject
// // // // =========================================================

// // // const rejectPaymentRequest =
// // //   async (req, res) => {

// // //     try {

// // //       const {
// // //         adminNote,
// // //       } = req.body || {};


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


// // //       request.status =
// // //         "Rejected";


// // //       request.adminNote =
// // //         adminNote || "";


// // //       request.processedAt =
// // //         new Date();


// // //       request.adminActionToken =
// // //         null;


// // //       request.adminActionTokenExpiresAt =
// // //         null;


// // //       await request.save();


// // //       return res.status(200).json({

// // //         success: true,

// // //         message:
// // //           "Payment request rejected successfully.",

// // //         paymentRequest:
// // //           request,

// // //       });

// // //     } catch (error) {

// // //       console.error(
// // //         "REJECT PAYMENT ERROR:",
// // //         error
// // //       );

// // //       return res.status(500).json({

// // //         success: false,

// // //         message:
// // //           error.message ||
// // //           "Failed to reject payment.",

// // //       });

// // //     }

// // //   };


















// // //   // =========================================================
// // // // DELETE PAYMENT REQUEST
// // // // DELETE /api/payment-requests/:id
// // // //
// // // // Pending request cannot be deleted.
// // // // Accepted / Rejected request can be deleted.
// // // // IMPORTANT:
// // // // This only deletes PaymentRequest.
// // // // Confirmed Booking will NOT be deleted.
// // // // =========================================================

// // // const deletePaymentRequest = async (req, res) => {
// // //   try {
// // //     const request = await PaymentRequest.findById(
// // //       req.params.id
// // //     );

// // //     // -------------------------------------------------------
// // //     // REQUEST NOT FOUND
// // //     // -------------------------------------------------------

// // //     if (!request) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         message: "Payment request not found.",
// // //       });
// // //     }

// // //     // -------------------------------------------------------
// // //     // PENDING CANNOT BE DELETED
// // //     // -------------------------------------------------------

// // //     if (
// // //       String(request.status).toLowerCase() ===
// // //       "pending"
// // //     ) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message:
// // //           "Pending payment request cannot be deleted. Accept or reject it first.",
// // //       });
// // //     }

// // //     // -------------------------------------------------------
// // //     // DELETE PAYMENT REQUEST
// // //     // -------------------------------------------------------

// // //     await PaymentRequest.findByIdAndDelete(
// // //       req.params.id
// // //     );

// // //     return res.status(200).json({
// // //       success: true,
// // //       message:
// // //         "Payment request deleted successfully.",
// // //     });
// // //   } catch (error) {
// // //     console.error(
// // //       "DELETE PAYMENT REQUEST ERROR:",
// // //       error
// // //     );

// // //     return res.status(500).json({
// // //       success: false,
// // //       message:
// // //         error.message ||
// // //         "Failed to delete payment request.",
// // //     });
// // //   }
// // // };







// // // // =========================================================
// // // // EMAIL ACCEPT PAYMENT
// // // // GET/POST /email-accept
// // // // =========================================================

// // // const emailAcceptPaymentRequest =
// // //   async (req, res) => {

// // //     try {

// // //       const request =
// // //         await PaymentRequest.findById(
// // //           req.params.id
// // //         );


// // //       if (!request) {

// // //         return res.status(404).send(
// // //           "Payment request not found."
// // //         );

// // //       }


// // //       if (
// // //         request.status !==
// // //         "Pending"
// // //       ) {

// // //         return res.status(400).send(
// // //           `Payment request is already ${request.status}.`
// // //         );

// // //       }


// // //       return res.send(`

// // //         <html>

// // //           <head>

// // //             <title>
// // //               Saiyed Travels
// // //             </title>

// // //           </head>


// // //           <body
// // //             style="
// // //               font-family:Arial;
// // //               padding:40px;
// // //               text-align:center;
// // //             "
// // //           >

// // //             <h2>
// // //               Payment Approval
// // //             </h2>


// // //             <p>
// // //               Please use the Admin Dashboard
// // //               to accept this payment request.
// // //             </p>

// // //           </body>

// // //         </html>

// // //       `);

// // //     } catch (error) {

// // //       console.error(
// // //         "EMAIL ACCEPT ERROR:",
// // //         error
// // //       );

// // //       return res.status(500).send(
// // //         "Something went wrong."
// // //       );

// // //     }

// // //   };


// // // // =========================================================
// // // // EMAIL REJECT PAYMENT
// // // // =========================================================

// // // const emailRejectPaymentRequest =
// // //   async (req, res) => {

// // //     try {

// // //       const request =
// // //         await PaymentRequest.findById(
// // //           req.params.id
// // //         );


// // //       if (!request) {

// // //         return res.status(404).send(
// // //           "Payment request not found."
// // //         );

// // //       }


// // //       if (
// // //         request.status !==
// // //         "Pending"
// // //       ) {

// // //         return res.status(400).send(
// // //           `Payment request is already ${request.status}.`
// // //         );

// // //       }


// // //       return res.send(`

// // //         <html>

// // //           <head>

// // //             <title>
// // //               Saiyed Travels
// // //             </title>

// // //           </head>


// // //           <body
// // //             style="
// // //               font-family:Arial;
// // //               padding:40px;
// // //               text-align:center;
// // //             "
// // //           >

// // //             <h2>
// // //               Payment Rejection
// // //             </h2>


// // //             <p>
// // //               Please use the Admin Dashboard
// // //               to reject this payment request.
// // //             </p>

// // //           </body>

// // //         </html>

// // //       `);

// // //     } catch (error) {

// // //       console.error(
// // //         "EMAIL REJECT ERROR:",
// // //         error
// // //       );

// // //       return res.status(500).send(
// // //         "Something went wrong."
// // //       );

// // //     }

// // //   };



// // // module.exports = {
// // //   createPaymentRequest,
// // //   getAllPaymentRequests,
// // //   getPaymentRequestById,
// // //   getCustomerPaymentStatus,
// // //   getPendingPaymentCount,
// // //   acceptPaymentRequest,
// // //   rejectPaymentRequest,
// // //   deletePaymentRequest,
// // //   emailAcceptPaymentRequest,
// // //   emailRejectPaymentRequest,
// // // };






























































































































// // // // const crypto = require("crypto");

// // // // const mongoose = require("mongoose");

// // // // const PaymentRequest = require("../models/PaymentRequest");
// // // // const Booking = require("../models/Booking");
// // // // const User = require("../models/User");

// // // // const bookingController = require("./bookingController");

// // // // const {
// // // //   sendAdminPaymentNotification,
// // // //   sendTicketEmail,
// // // // } = require("../services/emailService");

// // // // const {
// // // //   sendTicketWhatsApp,
// // // // } = require("../services/whatsappService");


// // // // // =========================================================
// // // // // GET ADMIN EMAIL
// // // // // =========================================================

// // // // const getAdminEmail = async () => {
// // // //   try {
// // // //     // First priority: Render Environment Variable
// // // //     if (process.env.ADMIN_EMAIL) {
// // // //       return String(process.env.ADMIN_EMAIL)
// // // //         .trim()
// // // //         .toLowerCase();
// // // //     }

// // // //     // Second priority: EMAIL_USER
// // // //     if (process.env.EMAIL_USER) {
// // // //       return String(process.env.EMAIL_USER)
// // // //         .trim()
// // // //         .toLowerCase();
// // // //     }

// // // //     // Third priority: Database admin
// // // //     const admin = await User.findOne({
// // // //       role: "admin",
// // // //       isActive: true,
// // // //     }).sort({
// // // //       createdAt: -1,
// // // //     });

// // // //     if (!admin) {
// // // //       throw new Error(
// // // //         "Active admin account not found."
// // // //       );
// // // //     }

// // // //     if (!admin.email) {
// // // //       throw new Error(
// // // //         "Admin email is missing."
// // // //       );
// // // //     }

// // // //     return String(admin.email)
// // // //       .trim()
// // // //       .toLowerCase();

// // // //   } catch (error) {
// // // //     console.error(
// // // //       "GET ADMIN EMAIL ERROR:",
// // // //       error
// // // //     );

// // // //     throw error;
// // // //   }
// // // // };


// // // // // =========================================================
// // // // // CREATE PAYMENT REQUEST
// // // // // POST /api/payment-requests
// // // // // =========================================================

// // // // const createPaymentRequest = async (
// // // //   req,
// // // //   res
// // // // ) => {
// // // //   try {

// // // //     // -----------------------------------------------------
// // // //     // FILE CHECK
// // // //     // -----------------------------------------------------

// // // //     if (!req.file) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message:
// // // //           "Payment screenshot is required.",
// // // //       });
// // // //     }


// // // //     // -----------------------------------------------------
// // // //     // GET FORM DATA
// // // //     // -----------------------------------------------------

// // // //     const {
// // // //       bookingData,
// // // //       amount,
// // // //       bankName,
// // // //       paymentId,
// // // //       paymentDateTime,
// // // //       customerEmail,
// // // //       whatsappNumber,
// // // //     } = req.body;


// // // //     // -----------------------------------------------------
// // // //     // BASIC VALIDATION
// // // //     // -----------------------------------------------------

// // // //     if (!bookingData) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message:
// // // //           "Booking data is required.",
// // // //       });
// // // //     }


// // // //     if (!amount) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message:
// // // //           "Payment amount is required.",
// // // //       });
// // // //     }


// // // //     if (
// // // //       bankName !== "ICICI Bank" &&
// // // //       bankName !== "Bank of Baroda"
// // // //     ) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message:
// // // //           "Please select a valid bank.",
// // // //       });
// // // //     }


// // // //     if (!paymentId) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message:
// // // //           "Payment ID / UTR is required.",
// // // //       });
// // // //     }


// // // //     if (!paymentDateTime) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message:
// // // //           "Payment date/time is required.",
// // // //       });
// // // //     }


// // // //     if (!whatsappNumber) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message:
// // // //           "WhatsApp number is required.",
// // // //       });
// // // //     }


// // // //     // -----------------------------------------------------
// // // //     // PARSE BOOKING DATA
// // // //     // -----------------------------------------------------

// // // //     let parsedBookingData;

// // // //     try {

// // // //       parsedBookingData =
// // // //         typeof bookingData === "string"
// // // //           ? JSON.parse(bookingData)
// // // //           : bookingData;

// // // //     } catch (error) {

// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message:
// // // //           "Invalid booking data.",
// // // //       });

// // // //     }


// // // //     // -----------------------------------------------------
// // // //     // CUSTOMER EMAIL FALLBACK
// // // //     // -----------------------------------------------------

// // // //     const finalCustomerEmail =
// // // //       String(
// // // //         customerEmail ||
// // // //           parsedBookingData?.customerEmail ||
// // // //           parsedBookingData?.email ||
// // // //           parsedBookingData?.userEmail ||
// // // //           ""
// // // //       )
// // // //         .trim()
// // // //         .toLowerCase();


// // // //     // CUSTOMER EMAIL REQUIRED
// // // //     if (!finalCustomerEmail) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message:
// // // //           "Customer email is required. Please enter customer email before submitting payment.",
// // // //       });
// // // //     }


// // // //     // -----------------------------------------------------
// // // //     // WHATSAPP FALLBACK
// // // //     // -----------------------------------------------------

// // // //     const finalWhatsappNumber =
// // // //       String(
// // // //         whatsappNumber ||
// // // //           parsedBookingData?.whatsappNumber ||
// // // //           parsedBookingData?.phone ||
// // // //           parsedBookingData?.mobile ||
// // // //           ""
// // // //       ).trim();


// // // //     // -----------------------------------------------------
// // // //     // ADD CONTACT DATA INSIDE BOOKING DATA
// // // //     // -----------------------------------------------------

// // // //     parsedBookingData = {
// // // //       ...parsedBookingData,

// // // //       customerEmail:
// // // //         finalCustomerEmail,

// // // //       email:
// // // //         parsedBookingData?.email ||
// // // //         finalCustomerEmail,

// // // //       whatsappNumber:
// // // //         finalWhatsappNumber,
// // // //     };


// // // //     // -----------------------------------------------------
// // // //     // PAYMENT DATE
// // // //     // -----------------------------------------------------

// // // //     const parsedPaymentDate =
// // // //       new Date(paymentDateTime);


// // // //     if (
// // // //       Number.isNaN(
// // // //         parsedPaymentDate.getTime()
// // // //       )
// // // //     ) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message:
// // // //           "Invalid payment date/time.",
// // // //       });
// // // //     }


// // // //     // -----------------------------------------------------
// // // //     // SCREENSHOT URL
// // // //     // -----------------------------------------------------

// // // //     const screenshotPath =
// // // //       `/uploads/payment-screenshots/${req.file.filename}`;


// // // //     // =====================================================
// // // //     // CREATE PAYMENT REQUEST
// // // //     // =====================================================

// // // //     const request =
// // // //       await PaymentRequest.create({

// // // //         bookingData:
// // // //           parsedBookingData,

// // // //         amount:
// // // //           Number(amount),

// // // //         bankName,

// // // //         paymentId:
// // // //           String(paymentId).trim(),

// // // //         screenshot:
// // // //           screenshotPath,

// // // //         paymentDateTime:
// // // //           parsedPaymentDate,

// // // //         customerEmail:
// // // //           finalCustomerEmail,

// // // //         whatsappNumber:
// // // //           finalWhatsappNumber,

// // // //         status:
// // // //           "Pending",

// // // //         adminActionToken:
// // // //           null,

// // // //         adminActionTokenExpiresAt:
// // // //           null,

// // // //       });


// // // //     // =====================================================
// // // //     // CREATE ADMIN EMAIL ACTION TOKEN
// // // //     // =====================================================

// // // //     const rawToken =
// // // //       crypto
// // // //         .randomBytes(32)
// // // //         .toString("hex");


// // // //     const tokenHash =
// // // //       crypto
// // // //         .createHash("sha256")
// // // //         .update(rawToken)
// // // //         .digest("hex");


// // // //     const tokenExpiry =
// // // //       new Date(
// // // //         Date.now() +
// // // //           7 *
// // // //           24 *
// // // //           60 *
// // // //           60 *
// // // //           1000
// // // //       );


// // // //     request.adminActionToken =
// // // //       tokenHash;

// // // //     request.adminActionTokenExpiresAt =
// // // //       tokenExpiry;


// // // //     await request.save();


// // // //     // =====================================================
// // // //     // GET ADMIN EMAIL
// // // //     // =====================================================

// // // //     let adminEmail = null;

// // // //     try {

// // // //       adminEmail =
// // // //         await getAdminEmail();

// // // //       console.log(
// // // //         "ADMIN PAYMENT EMAIL:",
// // // //         adminEmail
// // // //       );

// // // //     } catch (error) {

// // // //       console.error(
// // // //         "ADMIN EMAIL LOOKUP ERROR:",
// // // //         error
// // // //       );

// // // //     }


// // // //     // =====================================================
// // // //     // SEND ADMIN PAYMENT REQUEST EMAIL
// // // //     // =====================================================

// // // //     if (adminEmail) {

// // // //       try {

// // // //         await sendAdminPaymentNotification({
// // // //           paymentRequest:
// // // //             request,

// // // //           adminActionToken:
// // // //             rawToken,

// // // //           adminEmail:
// // // //             adminEmail,
// // // //         });


// // // //         console.log(
// // // //           "ADMIN PAYMENT REQUEST EMAIL SENT TO:",
// // // //           adminEmail
// // // //         );

// // // //       } catch (emailError) {

// // // //         console.error(
// // // //           "ADMIN PAYMENT EMAIL ERROR:",
// // // //           emailError
// // // //         );

// // // //       }

// // // //     } else {

// // // //       console.error(
// // // //         "ADMIN EMAIL NOT FOUND - EMAIL NOT SENT"
// // // //       );

// // // //     }


// // // //     // =====================================================
// // // //     // RESPONSE
// // // //     // =====================================================

// // // //     return res.status(201).json({

// // // //       success: true,

// // // //       message:
// // // //         "Payment request submitted successfully. Waiting for admin verification.",

// // // //       paymentRequest: {

// // // //         id:
// // // //           request._id,

// // // //         status:
// // // //           request.status,

// // // //         amount:
// // // //           request.amount,

// // // //         bankName:
// // // //           request.bankName,

// // // //         paymentId:
// // // //           request.paymentId,

// // // //         customerEmail:
// // // //           request.customerEmail,

// // // //         whatsappNumber:
// // // //           request.whatsappNumber,

// // // //       },

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


// // // // // =========================================================
// // // // // GET ALL PAYMENT REQUESTS
// // // // // GET /api/payment-requests
// // // // // =========================================================

// // // // const getAllPaymentRequests =
// // // //   async (req, res) => {

// // // //     try {

// // // //       const requests =
// // // //         await PaymentRequest.find()
// // // //           .populate(
// // // //             "approvedBookingId"
// // // //           )
// // // //           .sort({
// // // //             createdAt: -1,
// // // //           });


// // // //       return res.status(200).json({

// // // //         success: true,

// // // //         count:
// // // //           requests.length,

// // // //         requests:
// // // //           requests,

// // // //       });

// // // //     } catch (error) {

// // // //       console.error(
// // // //         "GET PAYMENT REQUESTS ERROR:",
// // // //         error
// // // //       );

// // // //       return res.status(500).json({

// // // //         success: false,

// // // //         message:
// // // //           error.message ||
// // // //           "Failed to get payment requests.",

// // // //       });

// // // //     }

// // // //   };


// // // // // =========================================================
// // // // // GET SINGLE PAYMENT REQUEST
// // // // // GET /api/payment-requests/:id
// // // // // =========================================================

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

// // // //         request:
// // // //           request,

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


// // // // // =========================================================
// // // // // CUSTOMER PAYMENT STATUS
// // // // // GET /api/payment-requests/:id/status
// // // // // =========================================================

// // // // const getCustomerPaymentStatus =
// // // //   async (req, res) => {

// // // //     try {

// // // //       const requestId =
// // // //         req.params.id;


// // // //       if (!requestId) {

// // // //         return res.status(400).json({

// // // //           success: false,

// // // //           message:
// // // //             "Payment request ID is required.",

// // // //         });

// // // //       }


// // // //       if (
// // // //         !mongoose.Types.ObjectId.isValid(
// // // //           requestId
// // // //         )
// // // //       ) {

// // // //         return res.status(400).json({

// // // //           success: false,

// // // //           message:
// // // //             "Invalid payment request ID.",

// // // //         });

// // // //       }


// // // //       const request =
// // // //         await PaymentRequest.findById(
// // // //           requestId
// // // //         );


// // // //       if (!request) {

// // // //         return res.status(404).json({

// // // //           success: false,

// // // //           message:
// // // //             "Payment request not found.",

// // // //         });

// // // //       }


// // // //       // ===================================================
// // // //       // PENDING
// // // //       // ===================================================

// // // //       if (
// // // //         request.status ===
// // // //         "Pending"
// // // //       ) {

// // // //         return res.status(200).json({

// // // //           success: true,

// // // //           status:
// // // //             "Pending",

// // // //           approvedBookingId:
// // // //             null,

// // // //           booking:
// // // //             null,

// // // //           message:
// // // //             "Payment is waiting for admin verification.",

// // // //         });

// // // //       }


// // // //       // ===================================================
// // // //       // REJECTED
// // // //       // ===================================================

// // // //       if (
// // // //         request.status ===
// // // //         "Rejected"
// // // //       ) {

// // // //         return res.status(200).json({

// // // //           success: true,

// // // //           status:
// // // //             "Rejected",

// // // //           approvedBookingId:
// // // //             null,

// // // //           booking:
// // // //             null,

// // // //           adminNote:
// // // //             request.adminNote ||
// // // //             "",

// // // //           message:
// // // //             "Payment request was rejected.",

// // // //         });

// // // //       }


// // // //       // =========================================================
// // // // // ACCEPT PAYMENT REQUEST
// // // // // PUT /api/payment-requests/:id/accept
// // // // // =========================================================

// // // // const acceptPaymentRequest =
// // // //   async (req, res) => {

// // // //     try {

// // // //       const {
// // // //         adminNote,
// // // //       } = req.body || {};


// // // //       // ---------------------------------------------------
// // // //       // FIND PAYMENT REQUEST
// // // //       // ---------------------------------------------------

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


// // // //       // ---------------------------------------------------
// // // //       // ONLY PENDING CAN BE ACCEPTED
// // // //       // ---------------------------------------------------

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


// // // //       // ---------------------------------------------------
// // // //       // BOOKING DATA CHECK
// // // //       // ---------------------------------------------------

// // // //       if (!request.bookingData) {

// // // //         return res.status(400).json({

// // // //           success: false,

// // // //           message:
// // // //             "Booking data is missing from payment request.",

// // // //         });

// // // //       }


// // // //       // ---------------------------------------------------
// // // //       // COPY BOOKING DATA
// // // //       // ---------------------------------------------------

// // // //       const bookingData =
// // // //         JSON.parse(
// // // //           JSON.stringify(
// // // //             request.bookingData
// // // //           )
// // // //         );


// // // //       // ===================================================
// // // //       // CUSTOMER EMAIL
// // // //       // ===================================================

// // // //       const customerEmail =
// // // //         String(
// // // //           request.customerEmail ||
// // // //             bookingData?.customerEmail ||
// // // //             bookingData?.email ||
// // // //             bookingData?.userEmail ||
// // // //             ""
// // // //         )
// // // //           .trim()
// // // //           .toLowerCase();


// // // //       // ===================================================
// // // //       // CUSTOMER USER ID
// // // //       // ===================================================

// // // //       const customerUserId =
// // // //         bookingData?.userId ||
// // // //         bookingData?.user?._id ||
// // // //         bookingData?.user?.id ||
// // // //         null;


// // // //       // ===================================================
// // // //       // CUSTOMER / AGENT ROLE
// // // //       // ===================================================

// // // //       const customerRole =
// // // //         String(
// // // //           bookingData?.userRole ||
// // // //             bookingData?.fareRole ||
// // // //             "customer"
// // // //         )
// // // //           .trim()
// // // //           .toLowerCase();


// // // //       // ===================================================
// // // //       // CUSTOMER WHATSAPP
// // // //       // ===================================================

// // // //       const whatsappNumber =
// // // //         String(
// // // //           request.whatsappNumber ||
// // // //             bookingData?.whatsappNumber ||
// // // //             bookingData?.phone ||
// // // //             bookingData?.mobile ||
// // // //             ""
// // // //         ).trim();


// // // //       // ===================================================
// // // //       // CREATE CONFIRMED BOOKING
// // // //       // ===================================================

// // // //       let createdBooking =
// // // //         null;


// // // //       // ===================================================
// // // //       // IMPORTANT FIX
// // // //       // ===================================================
// // // //       // Admin payment accept kar raha hai.
// // // //       //
// // // //       // Lekin booking customer / agent ki honi chahiye.
// // // //       //
// // // //       // Isliye yahan req.user (Admin) ko directly
// // // //       // bookingController me nahi bhejna hai.
// // // //       //
// // // //       // Original customer/agent ka:
// // // //       // 1. userId
// // // //       // 2. role
// // // //       //
// // // //       // preserve karna zaroori hai.
// // // //       // ===================================================

// // // //       const fakeReq = {

// // // //         body: {

// // // //           ...bookingData,


// // // //           // ------------------------------------------------
// // // //           // ORIGINAL CUSTOMER / AGENT USER ID
// // // //           // ------------------------------------------------

// // // //           userId:
// // // //             customerUserId,


// // // //           // ------------------------------------------------
// // // //           // ORIGINAL CUSTOMER / AGENT ROLE
// // // //           // ------------------------------------------------

// // // //           userRole:
// // // //             customerRole,

// // // //           fareRole:
// // // //             bookingData?.fareRole ||
// // // //             customerRole,


// // // //           // ------------------------------------------------
// // // //           // CUSTOMER EMAIL
// // // //           // ------------------------------------------------

// // // //           customerEmail:
// // // //             customerEmail,

// // // //           email:
// // // //             bookingData?.email ||
// // // //             customerEmail,


// // // //           // ------------------------------------------------
// // // //           // BAGGAGE
// // // //           // ------------------------------------------------

// // // //           baggage: {

// // // //             ...(bookingData?.baggage || {}),

// // // //             cabinBaggage:
// // // //               bookingData?.baggage?.cabinBaggage ||
// // // //               bookingData?.baggage?.cabin ||
// // // //               bookingData?.flight?.cabinBaggage ||
// // // //               bookingData?.flight?.baggage?.cabin ||
// // // //               bookingData?.cabinBaggage ||
// // // //               "",

// // // //             checkinBaggage:
// // // //               bookingData?.baggage?.checkinBaggage ||
// // // //               bookingData?.baggage?.checkin ||
// // // //               bookingData?.baggage?.weight ||
// // // //               bookingData?.flight?.checkinBaggage ||
// // // //               bookingData?.flight?.baggage?.checkin ||
// // // //               bookingData?.checkinBaggage ||
// // // //               "",

// // // //           },


// // // //           // ------------------------------------------------
// // // //           // WHATSAPP
// // // //           // ------------------------------------------------

// // // //           whatsappNumber:
// // // //             whatsappNumber,


// // // //           // ------------------------------------------------
// // // //           // PAYMENT
// // // //           // ------------------------------------------------

// // // //           paymentVerified:
// // // //             true,

// // // //           paymentStatus:
// // // //             "Paid",

// // // //           bookingStatus:
// // // //             "Confirmed",

// // // //           paymentMethod:
// // // //             request.bankName,

// // // //           paymentId:
// // // //             request.paymentId,

// // // //         },


// // // //         // =================================================
// // // //         // VERY IMPORTANT
// // // //         // =================================================
// // // //         // Admin ka req.user yahan nahi bhejna.
// // // //         //
// // // //         // Customer / Agent ka fake user object bhejna hai.
// // // //         // Isse bookingController:
// // // //         //
// // // //         // req.user.role
// // // //         //
// // // //         // me customer / agent dekhega.
// // // //         //
// // // //         // Isse agent booking par agent fare
// // // //         // aur customer booking par customer fare lagega.
// // // //         // =================================================

// // // //         user: {

// // // //           _id:
// // // //             customerUserId || null,

// // // //           id:
// // // //             customerUserId || null,

// // // //           role:
// // // //             customerRole,

// // // //           email:
// // // //             customerEmail,

// // // //         },

// // // //       };


// // // //       // ===================================================
// // // //       // FAKE RESPONSE
// // // //       // ===================================================

// // // //       const fakeRes = {

// // // //         status(code) {

// // // //           return {

// // // //             json(data) {

// // // //               if (
// // // //                 code >= 200 &&
// // // //                 code < 300
// // // //               ) {

// // // //                 createdBooking =
// // // //                   data?.booking ||
// // // //                   data?.data ||
// // // //                   data;

// // // //               } else {

// // // //                 throw new Error(
// // // //                   data?.message ||
// // // //                   "Failed to create booking."
// // // //                 );

// // // //               }

// // // //             },

// // // //           };

// // // //         },

// // // //       };


// // // //       // ===================================================
// // // //       // CREATE BOOKING
// // // //       // ===================================================

// // // //       await bookingController.createBooking(
// // // //         fakeReq,
// // // //         fakeRes
// // // //       );


// // // //       // ===================================================
// // // //       // CHECK BOOKING
// // // //       // ===================================================

// // // //       if (!createdBooking) {

// // // //         throw new Error(
// // // //           "Booking was not created."
// // // //         );

// // // //       }


// // // //       // ===================================================
// // // //       // FINAL SAFETY UPDATE
// // // //       // ===================================================
// // // //       // Agar bookingController ne kisi wajah se
// // // //       // userId/email save nahi kiya ho to yahan
// // // //       // final booking me forcefully save karenge.
// // // //       // ===================================================

// // // //       const finalBookingId =
// // // //         createdBooking?._id ||
// // // //         createdBooking?.id;


// // // //       if (finalBookingId) {

// // // //         const updateData = {

// // // //           userId:
// // // //             customerUserId ||
// // // //             null,

// // // //           userRole:
// // // //             customerRole,

// // // //           fareRole:
// // // //             bookingData?.fareRole ||
// // // //             customerRole,

// // // //           email:
// // // //             customerEmail,

// // // //           customerEmail:
// // // //             customerEmail,

// // // //           whatsappNumber:
// // // //             whatsappNumber,

// // // //         };


// // // //         await Booking.findByIdAndUpdate(

// // // //           finalBookingId,

// // // //           {
// // // //             $set:
// // // //               updateData,
// // // //           },

// // // //           {
// // // //             new:
// // // //               true,
// // // //           }

// // // //         );


// // // //         // Fresh booking dobara fetch
// // // //         // taaki response me updated data aaye.

// // // //         const refreshedBooking =
// // // //           await Booking.findById(
// // // //             finalBookingId
// // // //           ).lean();


// // // //         if (refreshedBooking) {

// // // //           createdBooking =
// // // //             refreshedBooking;

// // // //         }

// // // //       }


// // // //       // ===================================================
// // // //       // UPDATE PAYMENT REQUEST
// // // //       // ===================================================

// // // //       request.status =
// // // //         "Accepted";


// // // //       request.approvedBookingId =
// // // //         createdBooking._id;


// // // //       request.adminNote =
// // // //         adminNote || "";


// // // //       request.processedAt =
// // // //         new Date();


// // // //       request.adminActionToken =
// // // //         null;


// // // //       request.adminActionTokenExpiresAt =
// // // //         null;


// // // //       // ---------------------------------------------------
// // // //       // SAVE CUSTOMER EMAIL IF MISSING
// // // //       // ---------------------------------------------------

// // // //       if (
// // // //         customerEmail &&
// // // //         !request.customerEmail
// // // //       ) {

// // // //         request.customerEmail =
// // // //           customerEmail;

// // // //       }


// // // //       // ---------------------------------------------------
// // // //       // SAVE WHATSAPP IF MISSING
// // // //       // ---------------------------------------------------

// // // //       if (
// // // //         whatsappNumber &&
// // // //         !request.whatsappNumber
// // // //       ) {

// // // //         request.whatsappNumber =
// // // //           whatsappNumber;

// // // //       }


// // // //       await request.save();


// // // //       // ===================================================
// // // //       // CUSTOMER TICKET EMAIL
// // // //       // ===================================================

// // // //       let customerEmailSent =
// // // //         false;


// // // //       try {

// // // //         if (!customerEmail) {

// // // //           console.error(
// // // //             "CUSTOMER TICKET EMAIL ERROR: Customer email is missing."
// // // //           );

// // // //         } else {

// // // //           await sendTicketEmail({

// // // //             to:
// // // //               customerEmail,

// // // //             booking:
// // // //               createdBooking,

// // // //           });


// // // //           customerEmailSent =
// // // //             true;


// // // //           console.log(
// // // //             "CUSTOMER TICKET PDF SENT TO EMAIL:",
// // // //             customerEmail
// // // //           );

// // // //         }

// // // //       } catch (emailError) {

// // // //         console.error(
// // // //           "CUSTOMER TICKET EMAIL ERROR:",
// // // //           emailError
// // // //         );

// // // //       }


// // // //       // ===================================================
// // // //       // ADMIN TICKET EMAIL
// // // //       // ===================================================

// // // //       let adminEmailSent =
// // // //         false;


// // // //       try {

// // // //         const adminEmail =
// // // //           await getAdminEmail();


// // // //         if (!adminEmail) {

// // // //           console.error(
// // // //             "ADMIN TICKET EMAIL ERROR: Admin email is missing."
// // // //           );

// // // //         } else {

// // // //           await sendTicketEmail({

// // // //             to:
// // // //               adminEmail,

// // // //             booking:
// // // //               createdBooking,

// // // //           });


// // // //           adminEmailSent =
// // // //             true;


// // // //           console.log(
// // // //             "ADMIN TICKET PDF SENT TO:",
// // // //             adminEmail
// // // //           );

// // // //         }

// // // //       } catch (adminEmailError) {

// // // //         console.error(
// // // //           "ADMIN TICKET EMAIL ERROR:",
// // // //           adminEmailError
// // // //         );

// // // //       }


// // // //       // ===================================================
// // // //       // CUSTOMER WHATSAPP TICKET
// // // //       // ===================================================

// // // //       let whatsappSent =
// // // //         false;


// // // //       try {

// // // //         if (!whatsappNumber) {

// // // //           console.error(
// // // //             "CUSTOMER TICKET WHATSAPP ERROR: WhatsApp number is missing."
// // // //           );

// // // //         } else {

// // // //           await sendTicketWhatsApp({

// // // //             to:
// // // //               whatsappNumber,

// // // //             booking:
// // // //               createdBooking,

// // // //           });


// // // //           whatsappSent =
// // // //             true;


// // // //           console.log(
// // // //             "CUSTOMER TICKET WHATSAPP SENT TO:",
// // // //             whatsappNumber
// // // //           );

// // // //         }

// // // //       } catch (whatsappError) {

// // // //         console.error(
// // // //           "CUSTOMER TICKET WHATSAPP ERROR:",
// // // //           whatsappError
// // // //         );

// // // //       }


// // // //       // ===================================================
// // // //       // RESPONSE
// // // //       // ===================================================

// // // //       return res.status(200).json({

// // // //         success: true,

// // // //         message:
// // // //           "Payment accepted and booking confirmed successfully.",

// // // //         paymentRequest:
// // // //           request,

// // // //         booking:
// // // //           createdBooking,

// // // //         ticketStatus: {

// // // //           customerEmail:
// // // //             customerEmailSent
// // // //               ? "sent"
// // // //               : "failed",

// // // //           adminEmail:
// // // //             adminEmailSent
// // // //               ? "sent"
// // // //               : "failed",

// // // //           whatsapp:
// // // //             whatsappSent
// // // //               ? "sent"
// // // //               : "failed",

// // // //         },

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


// // // //   // =========================================================
// // // // // REJECT PAYMENT REQUEST
// // // // // PUT /api/payment-requests/:id/reject
// // // // // =========================================================

// // // // const rejectPaymentRequest =
// // // //   async (req, res) => {

// // // //     try {

// // // //       const {
// // // //         adminNote,
// // // //       } = req.body || {};


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


// // // //       request.status =
// // // //         "Rejected";


// // // //       request.adminNote =
// // // //         adminNote || "";


// // // //       request.processedAt =
// // // //         new Date();


// // // //       request.adminActionToken =
// // // //         null;


// // // //       request.adminActionTokenExpiresAt =
// // // //         null;


// // // //       await request.save();


// // // //       return res.status(200).json({

// // // //         success: true,

// // // //         message:
// // // //           "Payment request rejected successfully.",

// // // //         paymentRequest:
// // // //           request,

// // // //       });

// // // //     } catch (error) {

// // // //       console.error(
// // // //         "REJECT PAYMENT ERROR:",
// // // //         error
// // // //       );

// // // //       return res.status(500).json({

// // // //         success: false,

// // // //         message:
// // // //           error.message ||
// // // //           "Failed to reject payment.",

// // // //       });

// // // //     }

// // // //   };


// // // // // =========================================================
// // // // // DELETE PAYMENT REQUEST
// // // // // DELETE /api/payment-requests/:id
// // // // // =========================================================

// // // // const deletePaymentRequest =
// // // //   async (req, res) => {

// // // //     try {

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


// // // //       // Pending request delete nahi hogi

// // // //       if (
// // // //         String(request.status)
// // // //           .toLowerCase() ===
// // // //         "pending"
// // // //       ) {

// // // //         return res.status(400).json({

// // // //           success: false,

// // // //           message:
// // // //             "Pending payment request cannot be deleted. Accept or reject it first.",

// // // //         });

// // // //       }


// // // //       await PaymentRequest.findByIdAndDelete(
// // // //         req.params.id
// // // //       );


// // // //       return res.status(200).json({

// // // //         success: true,

// // // //         message:
// // // //           "Payment request deleted successfully.",

// // // //       });

// // // //     } catch (error) {

// // // //       console.error(
// // // //         "DELETE PAYMENT REQUEST ERROR:",
// // // //         error
// // // //       );

// // // //       return res.status(500).json({

// // // //         success: false,

// // // //         message:
// // // //           error.message ||
// // // //           "Failed to delete payment request.",

// // // //       });

// // // //     }

// // // //   };


// // // // // =========================================================
// // // // // EMAIL ACCEPT PAYMENT
// // // // // GET/POST /email-accept
// // // // // =========================================================

// // // // const emailAcceptPaymentRequest =
// // // //   async (req, res) => {

// // // //     try {

// // // //       const request =
// // // //         await PaymentRequest.findById(
// // // //           req.params.id
// // // //         );


// // // //       if (!request) {

// // // //         return res.status(404).send(
// // // //           "Payment request not found."
// // // //         );

// // // //       }


// // // //       if (
// // // //         request.status !==
// // // //         "Pending"
// // // //       ) {

// // // //         return res.status(400).send(
// // // //           `Payment request is already ${request.status}.`
// // // //         );

// // // //       }


// // // //       return res.send(`

// // // //         <html>

// // // //           <head>

// // // //             <title>
// // // //               Saiyed Travels
// // // //             </title>

// // // //           </head>


// // // //           <body
// // // //             style="
// // // //               font-family:Arial;
// // // //               padding:40px;
// // // //               text-align:center;
// // // //             "
// // // //           >

// // // //             <h2>
// // // //               Payment Approval
// // // //             </h2>


// // // //             <p>
// // // //               Please use the Admin Dashboard
// // // //               to accept this payment request.
// // // //             </p>

// // // //           </body>

// // // //         </html>

// // // //       `);

// // // //     } catch (error) {

// // // //       console.error(
// // // //         "EMAIL ACCEPT ERROR:",
// // // //         error
// // // //       );

// // // //       return res.status(500).send(
// // // //         "Something went wrong."
// // // //       );

// // // //     }

// // // //   };


// // // // // =========================================================
// // // // // EMAIL REJECT PAYMENT
// // // // // =========================================================

// // // // const emailRejectPaymentRequest =
// // // //   async (req, res) => {

// // // //     try {

// // // //       const request =
// // // //         await PaymentRequest.findById(
// // // //           req.params.id
// // // //         );


// // // //       if (!request) {

// // // //         return res.status(404).send(
// // // //           "Payment request not found."
// // // //         );

// // // //       }


// // // //       if (
// // // //         request.status !==
// // // //         "Pending"
// // // //       ) {

// // // //         return res.status(400).send(
// // // //           `Payment request is already ${request.status}.`
// // // //         );

// // // //       }


// // // //       return res.send(`

// // // //         <html>

// // // //           <head>

// // // //             <title>
// // // //               Saiyed Travels
// // // //             </title>

// // // //           </head>


// // // //           <body
// // // //             style="
// // // //               font-family:Arial;
// // // //               padding:40px;
// // // //               text-align:center;
// // // //             "
// // // //           >

// // // //             <h2>
// // // //               Payment Rejection
// // // //             </h2>


// // // //             <p>
// // // //               Please use the Admin Dashboard
// // // //               to reject this payment request.
// // // //             </p>

// // // //           </body>

// // // //         </html>

// // // //       `);

// // // //     } catch (error) {

// // // //       console.error(
// // // //         "EMAIL REJECT ERROR:",
// // // //         error
// // // //       );

// // // //       return res.status(500).send(
// // // //         "Something went wrong."
// // // //       );

// // // //     }

// // // //   };


// // // // // =========================================================
// // // // // EXPORTS
// // // // // =========================================================

// // // // module.exports = {

// // // //   createPaymentRequest,

// // // //   getAllPaymentRequests,

// // // //   getPaymentRequestById,

// // // //   getCustomerPaymentStatus,

// // // //   getPendingPaymentCount,

// // // //   acceptPaymentRequest,

// // // //   rejectPaymentRequest,

// // // //   deletePaymentRequest,

// // // //   emailAcceptPaymentRequest,

// // // //   emailRejectPaymentRequest,

// // // // };


















































































































































// // const crypto = require("crypto");
// // const mongoose = require("mongoose");

// // const PaymentRequest = require("../models/PaymentRequest");
// // const Booking = require("../models/Booking");
// // const User = require("../models/User");

// // const bookingController = require("./bookingController");

// // const {
// //   sendAdminPaymentNotification,
// //   sendTicketEmail,
// // } = require("../services/emailService");

// // const {
// //   sendTicketWhatsApp,
// // } = require("../services/whatsappService");


// // // =========================================================
// // // GET ADMIN EMAIL
// // // =========================================================

// // const getAdminEmail = async () => {
// //   try {
// //     if (process.env.ADMIN_EMAIL) {
// //       return String(process.env.ADMIN_EMAIL)
// //         .trim()
// //         .toLowerCase();
// //     }

// //     if (process.env.EMAIL_USER) {
// //       return String(process.env.EMAIL_USER)
// //         .trim()
// //         .toLowerCase();
// //     }

// //     const admin = await User.findOne({
// //       role: "admin",
// //       isActive: true,
// //     }).sort({
// //       createdAt: -1,
// //     });

// //     if (!admin) {
// //       throw new Error(
// //         "Active admin account not found."
// //       );
// //     }

// //     if (!admin.email) {
// //       throw new Error(
// //         "Admin email is missing."
// //       );
// //     }

// //     return String(admin.email)
// //       .trim()
// //       .toLowerCase();

// //   } catch (error) {
// //     console.error(
// //       "GET ADMIN EMAIL ERROR:",
// //       error
// //     );

// //     throw error;
// //   }
// // };


// // // =========================================================
// // // CREATE PAYMENT REQUEST
// // // =========================================================

// // const createPaymentRequest = async (
// //   req,
// //   res
// // ) => {
// //   try {

// //     // FILE CHECK
// //     if (!req.file) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Payment screenshot is required.",
// //       });
// //     }


// //     // FORM DATA
// //     const {
// //       bookingData,
// //       amount,
// //       bankName,
// //       paymentId,
// //       paymentDateTime,
// //       customerEmail,
// //       whatsappNumber,
// //     } = req.body;


// //     // BASIC VALIDATION
// //     if (!bookingData) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Booking data is required.",
// //       });
// //     }

// //     if (!amount) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Payment amount is required.",
// //       });
// //     }

// //     if (
// //       bankName !== "ICICI Bank" &&
// //       bankName !== "Bank of Baroda"
// //     ) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Please select a valid bank.",
// //       });
// //     }

// //     if (!paymentId) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Payment ID / UTR is required.",
// //       });
// //     }

// //     if (!paymentDateTime) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Payment date/time is required.",
// //       });
// //     }

// //     if (!whatsappNumber) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "WhatsApp number is required.",
// //       });
// //     }


// //     // PARSE BOOKING DATA
// //     let parsedBookingData;

// //     try {

// //       parsedBookingData =
// //         typeof bookingData === "string"
// //           ? JSON.parse(bookingData)
// //           : bookingData;

// //     } catch (error) {

// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Invalid booking data.",
// //       });

// //     }


// //     // CUSTOMER EMAIL
// //     const finalCustomerEmail =
// //       String(
// //         customerEmail ||
// //           parsedBookingData?.customerEmail ||
// //           parsedBookingData?.email ||
// //           parsedBookingData?.userEmail ||
// //           ""
// //       )
// //         .trim()
// //         .toLowerCase();


// //     if (!finalCustomerEmail) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Customer email is required. Please enter customer email before submitting payment.",
// //       });
// //     }


// //     // WHATSAPP
// //     const finalWhatsappNumber =
// //       String(
// //         whatsappNumber ||
// //           parsedBookingData?.whatsappNumber ||
// //           parsedBookingData?.phone ||
// //           parsedBookingData?.mobile ||
// //           ""
// //       ).trim();


// //     // ADD CONTACT DATA
// //     parsedBookingData = {
// //       ...parsedBookingData,

// //       customerEmail:
// //         finalCustomerEmail,

// //       email:
// //         parsedBookingData?.email ||
// //         finalCustomerEmail,

// //       whatsappNumber:
// //         finalWhatsappNumber,
// //     };


// //     // PAYMENT DATE
// //     const parsedPaymentDate =
// //       new Date(paymentDateTime);

// //     if (
// //       Number.isNaN(
// //         parsedPaymentDate.getTime()
// //       )
// //     ) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Invalid payment date/time.",
// //       });
// //     }


// //     // SCREENSHOT
// //     const screenshotPath =
// //       `/uploads/payment-screenshots/${req.file.filename}`;


// //     // CREATE PAYMENT REQUEST
// //     const request =
// //       await PaymentRequest.create({

// //         bookingData:
// //           parsedBookingData,

// //         amount:
// //           Number(amount),

// //         bankName,

// //         paymentId:
// //           String(paymentId).trim(),

// //         screenshot:
// //           screenshotPath,

// //         paymentDateTime:
// //           parsedPaymentDate,

// //         customerEmail:
// //           finalCustomerEmail,

// //         whatsappNumber:
// //           finalWhatsappNumber,

// //         status:
// //           "Pending",

// //         adminActionToken:
// //           null,

// //         adminActionTokenExpiresAt:
// //           null,

// //       });


// //     // ADMIN ACTION TOKEN
// //     const rawToken =
// //       crypto
// //         .randomBytes(32)
// //         .toString("hex");


// //     const tokenHash =
// //       crypto
// //         .createHash("sha256")
// //         .update(rawToken)
// //         .digest("hex");


// //     const tokenExpiry =
// //       new Date(
// //         Date.now() +
// //           7 *
// //           24 *
// //           60 *
// //           60 *
// //           1000
// //       );


// //     request.adminActionToken =
// //       tokenHash;

// //     request.adminActionTokenExpiresAt =
// //       tokenExpiry;


// //     await request.save();


// //     // GET ADMIN EMAIL
// //     let adminEmail = null;

// //     try {

// //       adminEmail =
// //         await getAdminEmail();

// //       console.log(
// //         "ADMIN PAYMENT EMAIL:",
// //         adminEmail
// //       );

// //     } catch (error) {

// //       console.error(
// //         "ADMIN EMAIL LOOKUP ERROR:",
// //         error
// //       );

// //     }


// //     // SEND ADMIN PAYMENT EMAIL
// //     if (adminEmail) {

// //       try {

// //         await sendAdminPaymentNotification({
// //           paymentRequest:
// //             request,

// //           adminActionToken:
// //             rawToken,

// //           adminEmail:
// //             adminEmail,
// //         });


// //         console.log(
// //           "ADMIN PAYMENT REQUEST EMAIL SENT TO:",
// //           adminEmail
// //         );

// //       } catch (emailError) {

// //         console.error(
// //           "ADMIN PAYMENT EMAIL ERROR:",
// //           emailError
// //         );

// //       }

// //     } else {

// //       console.error(
// //         "ADMIN EMAIL NOT FOUND - EMAIL NOT SENT"
// //       );

// //     }


// //     // RESPONSE
// //     return res.status(201).json({

// //       success: true,

// //       message:
// //         "Payment request submitted successfully. Waiting for admin verification.",

// //       paymentRequest: {

// //         id:
// //           request._id,

// //         status:
// //           request.status,

// //         amount:
// //           request.amount,

// //         bankName:
// //           request.bankName,

// //         paymentId:
// //           request.paymentId,

// //         customerEmail:
// //           request.customerEmail,

// //         whatsappNumber:
// //           request.whatsappNumber,

// //       },

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


// // // =========================================================
// // // GET ALL PAYMENT REQUESTS
// // // =========================================================

// // const getAllPaymentRequests =
// //   async (req, res) => {

// //     try {

// //       const requests =
// //         await PaymentRequest.find()
// //           .populate(
// //             "approvedBookingId"
// //           )
// //           .sort({
// //             createdAt: -1,
// //           });


// //       return res.status(200).json({

// //         success: true,

// //         count:
// //           requests.length,

// //         requests:
// //           requests,

// //       });

// //     } catch (error) {

// //       console.error(
// //         "GET PAYMENT REQUESTS ERROR:",
// //         error
// //       );

// //       return res.status(500).json({

// //         success: false,

// //         message:
// //           error.message ||
// //           "Failed to get payment requests.",

// //       });

// //     }

// //   };


// // // =========================================================
// // // GET SINGLE PAYMENT REQUEST
// // // =========================================================

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

// //         request:
// //           request,

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


// // // =========================================================
// // // CUSTOMER PAYMENT STATUS
// // // =========================================================

// // const getCustomerPaymentStatus =
// //   async (req, res) => {

// //     try {

// //       const requestId =
// //         req.params.id;


// //       if (!requestId) {

// //         return res.status(400).json({

// //           success: false,

// //           message:
// //             "Payment request ID is required.",

// //         });

// //       }


// //       if (
// //         !mongoose.Types.ObjectId.isValid(
// //           requestId
// //         )
// //       ) {

// //         return res.status(400).json({

// //           success: false,

// //           message:
// //             "Invalid payment request ID.",

// //         });

// //       }


// //       const request =
// //         await PaymentRequest.findById(
// //           requestId
// //         );


// //       if (!request) {

// //         return res.status(404).json({

// //           success: false,

// //           message:
// //             "Payment request not found.",

// //         });

// //       }


// //       // PENDING
// //       if (
// //         request.status ===
// //         "Pending"
// //       ) {

// //         return res.status(200).json({

// //           success: true,

// //           status:
// //             "Pending",

// //           approvedBookingId:
// //             null,

// //           booking:
// //             null,

// //           message:
// //             "Payment is waiting for admin verification.",

// //         });

// //       }


// //       // REJECTED
// //       if (
// //         request.status ===
// //         "Rejected"
// //       ) {

// //         return res.status(200).json({

// //           success: true,

// //           status:
// //             "Rejected",

// //           approvedBookingId:
// //             null,

// //           booking:
// //             null,

// //           adminNote:
// //             request.adminNote ||
// //             "",

// //           message:
// //             "Payment request was rejected.",

// //         });

// //       }


// //       // ACCEPTED
// //       if (
// //         request.status ===
// //           "Accepted" &&
// //         request.approvedBookingId
// //       ) {

// //         const booking =
// //           await Booking.findById(
// //             request.approvedBookingId
// //           ).lean();


// //         if (!booking) {

// //           return res.status(200).json({

// //             success: true,

// //             status:
// //               "Accepted",

// //             approvedBookingId:
// //               String(
// //                 request.approvedBookingId
// //               ),

// //             booking:
// //               null,

// //             message:
// //               "Payment accepted. Booking is loading.",

// //           });

// //         }


// //         return res.status(200).json({

// //           success: true,

// //           status:
// //             "Accepted",

// //           approvedBookingId:
// //             String(
// //               request.approvedBookingId
// //             ),

// //           booking:
// //             booking,

// //           message:
// //             "Payment accepted and booking confirmed.",

// //         });

// //       }


// //       // OTHER STATUS
// //       return res.status(200).json({

// //         success: true,

// //         status:
// //           request.status,

// //         approvedBookingId:
// //           request.approvedBookingId
// //             ? String(
// //                 request.approvedBookingId
// //               )
// //             : null,

// //         booking:
// //           null,

// //       });

// //     } catch (error) {

// //       console.error(
// //         "CUSTOMER PAYMENT STATUS ERROR:",
// //         error
// //       );

// //       return res.status(500).json({

// //         success: false,

// //         message:
// //           error.message ||
// //           "Failed to check payment status.",

// //       });

// //     }

// //   };


// // // =========================================================
// // // GET PENDING PAYMENT COUNT
// // // =========================================================

// // const getPendingPaymentCount =
// //   async (req, res) => {

// //     try {

// //       const count =
// //         await PaymentRequest.countDocuments({
// //           status:
// //             "Pending",
// //         });


// //       return res.status(200).json({

// //         success: true,

// //         count:
// //           count,

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

// //   // =========================================================
// // // ACCEPT PAYMENT REQUEST
// // // PUT /api/payment-requests/:id/accept
// // // =========================================================

// // const acceptPaymentRequest = async (req, res) => {
// //   try {

// //     const {
// //       adminNote,
// //     } = req.body || {};


// //     // =====================================================
// //     // FIND PAYMENT REQUEST
// //     // =====================================================

// //     const request =
// //       await PaymentRequest.findById(
// //         req.params.id
// //       );


// //     if (!request) {

// //       return res.status(404).json({

// //         success: false,

// //         message:
// //           "Payment request not found.",

// //       });

// //     }


// //     // =====================================================
// //     // ONLY PENDING CAN BE ACCEPTED
// //     // =====================================================

// //     if (
// //       request.status !==
// //       "Pending"
// //     ) {

// //       return res.status(400).json({

// //         success: false,

// //         message:
// //           `Payment request is already ${request.status}.`,

// //       });

// //     }


// //     // =====================================================
// //     // BOOKING DATA CHECK
// //     // =====================================================

// //     if (!request.bookingData) {

// //       return res.status(400).json({

// //         success: false,

// //         message:
// //           "Booking data is missing from payment request.",

// //       });

// //     }


// //     // =====================================================
// //     // COPY BOOKING DATA
// //     // =====================================================

// //     const bookingData =
// //       JSON.parse(
// //         JSON.stringify(
// //           request.bookingData
// //         )
// //       );


// //     // =====================================================
// //     // CUSTOMER EMAIL
// //     // =====================================================

// //     const customerEmail =
// //       String(
// //         request.customerEmail ||
// //           bookingData?.customerEmail ||
// //           bookingData?.email ||
// //           bookingData?.userEmail ||
// //           bookingData?.passenger?.email ||
// //           bookingData?.passengers?.[0]?.email ||
// //           ""
// //       )
// //         .trim()
// //         .toLowerCase();


// //     if (!customerEmail) {

// //       return res.status(400).json({

// //         success: false,

// //         message:
// //           "Customer email is missing from booking.",

// //       });

// //     }


// //     // =====================================================
// //     // CUSTOMER USER ID
// //     // =====================================================

// //     const rawUserId =
// //       bookingData?.userId ||
// //       bookingData?.user?._id ||
// //       bookingData?.user?.id ||
// //       null;


// //     const customerUserId =
// //       rawUserId &&
// //       mongoose.Types.ObjectId.isValid(
// //         String(rawUserId)
// //       )
// //         ? new mongoose.Types.ObjectId(
// //             String(rawUserId)
// //           )
// //         : null;


// //     // =====================================================
// //     // CUSTOMER / AGENT ROLE
// //     // =====================================================

// //     const customerRole =
// //       String(
// //         bookingData?.userRole ||
// //           bookingData?.fareRole ||
// //           "customer"
// //       )
// //         .trim()
// //         .toLowerCase();


// //     console.log(
// //       "===================================="
// //     );

// //     console.log(
// //       "ACCEPT PAYMENT - CUSTOMER DETAILS"
// //     );

// //     console.log(
// //       "EMAIL:",
// //       customerEmail
// //     );

// //     console.log(
// //       "USER ID:",
// //       customerUserId
// //     );

// //     console.log(
// //       "ROLE:",
// //       customerRole
// //     );

// //     console.log(
// //       "===================================="
// //     );


// //     // =====================================================
// //     // CUSTOMER WHATSAPP
// //     // =====================================================

// //     const whatsappNumber =
// //       String(
// //         request.whatsappNumber ||
// //           bookingData?.whatsappNumber ||
// //           bookingData?.phone ||
// //           bookingData?.mobile ||
// //           ""
// //       ).trim();


// //     // =====================================================
// //     // CREATE CONFIRMED BOOKING
// //     // =====================================================

// //     const fakeReq = {

// //       body: {

// //         ...bookingData,


// //         // -------------------------------------------------
// //         // ORIGINAL CUSTOMER / AGENT USER ID
// //         // -------------------------------------------------

// //         userId:
// //           customerUserId
// //             ? String(customerUserId)
// //             : bookingData?.userId || null,


// //         // -------------------------------------------------
// //         // ORIGINAL CUSTOMER / AGENT ROLE
// //         // -------------------------------------------------

// //         userRole:
// //           customerRole,


// //         fareRole:
// //           bookingData?.fareRole ||
// //           customerRole,


// //         // -------------------------------------------------
// //         // CUSTOMER EMAIL
// //         // -------------------------------------------------

// //         customerEmail:
// //           customerEmail,


// //         email:
// //           customerEmail,


// //         // -------------------------------------------------
// //         // BAGGAGE
// //         // -------------------------------------------------

// //         baggage: {

// //           ...(bookingData?.baggage || {}),


// //           cabinBaggage:
// //             bookingData?.baggage?.cabinBaggage ||
// //             bookingData?.baggage?.cabin ||
// //             bookingData?.flight?.cabinBaggage ||
// //             bookingData?.flight?.baggage?.cabin ||
// //             bookingData?.cabinBaggage ||
// //             "",


// //           checkinBaggage:
// //             bookingData?.baggage?.checkinBaggage ||
// //             bookingData?.baggage?.checkin ||
// //             bookingData?.baggage?.weight ||
// //             bookingData?.flight?.checkinBaggage ||
// //             bookingData?.flight?.baggage?.checkin ||
// //             bookingData?.checkinBaggage ||
// //             "",

// //         },


// //         // -------------------------------------------------
// //         // WHATSAPP
// //         // -------------------------------------------------

// //         whatsappNumber:
// //           whatsappNumber,


// //         // -------------------------------------------------
// //         // PAYMENT
// //         // -------------------------------------------------

// //         paymentVerified:
// //           true,


// //         paymentStatus:
// //           "Paid",


// //         bookingStatus:
// //           "Confirmed",


// //         paymentMethod:
// //           request.bankName,


// //         paymentId:
// //           request.paymentId,

// //       },


// //       // =================================================
// //       // VERY IMPORTANT
// //       // =================================================
// //       // YAHAN ADMIN KA req.user NAHI BHEJNA.
// //       //
// //       // Original customer/agent ki identity bhejni hai.
// //       // Isse bookingController ko correct:
// //       // userId + role milega.
// //       // =================================================

// //       user: {

// //         _id:
// //           customerUserId ||
// //           null,

// //         id:
// //           customerUserId ||
// //           null,

// //         role:
// //           customerRole,

// //         email:
// //           customerEmail,

// //       },

// //     };


// //     // =====================================================
// //     // CREATED BOOKING
// //     // =====================================================

// //     let createdBooking =
// //       null;


// //     // =====================================================
// //     // FAKE RESPONSE
// //     // =====================================================

// //     const fakeRes = {

// //       status(code) {

// //         return {

// //           json(data) {

// //             if (
// //               code >= 200 &&
// //               code < 300
// //             ) {

// //               createdBooking =
// //                 data?.booking ||
// //                 data?.data ||
// //                 data;

// //             } else {

// //               throw new Error(
// //                 data?.message ||
// //                   "Failed to create booking."
// //               );

// //             }

// //           },

// //         };

// //       },

// //     };


// //     // =====================================================
// //     // CREATE BOOKING
// //     // =====================================================

// //     await bookingController.createBooking(
// //       fakeReq,
// //       fakeRes
// //     );


// //     // =====================================================
// //     // CHECK BOOKING
// //     // =====================================================

// //     if (!createdBooking?._id) {

// //       throw new Error(
// //         "Booking was not created."
// //       );

// //     }


// //     // =====================================================
// //     // FORCE FINAL EMAIL / USER ID / ROLE
// //     // =====================================================

// //     const bookingUpdate = {

// //       email:
// //         customerEmail,

// //       customerEmail:
// //         customerEmail,

// //       userRole:
// //         customerRole,

// //       fareRole:
// //         bookingData?.fareRole ||
// //         customerRole,

// //     };


// //     if (customerUserId) {

// //       bookingUpdate.userId =
// //         customerUserId;

// //     }


// //     // =====================================================
// //     // UPDATE FINAL BOOKING
// //     // =====================================================

// //     const finalBooking =
// //       await Booking.findByIdAndUpdate(

// //         createdBooking._id,

// //         {
// //           $set:
// //             bookingUpdate,
// //         },

// //         {
// //           new:
// //             true,
// //         }

// //       ).lean();


// //     if (!finalBooking) {

// //       throw new Error(
// //         "Booking was created but could not be linked to customer."
// //       );

// //     }


// //     createdBooking =
// //       finalBooking;


// //     console.log(
// //       "===================================="
// //     );

// //     console.log(
// //       "BOOKING SAVED SUCCESSFULLY"
// //     );

// //     console.log(
// //       "BOOKING ID:",
// //       createdBooking._id
// //     );

// //     console.log(
// //       "BOOKING EMAIL:",
// //       createdBooking.email
// //     );

// //     console.log(
// //       "BOOKING USER ID:",
// //       createdBooking.userId ||
// //         "NOT AVAILABLE"
// //     );

// //     console.log(
// //       "BOOKING ROLE:",
// //       createdBooking.userRole ||
// //         "NOT AVAILABLE"
// //     );

// //     console.log(
// //       "===================================="
// //     );


// //     // =====================================================
// //     // UPDATE PAYMENT REQUEST
// //     // =====================================================

// //     request.status =
// //       "Accepted";


// //     request.approvedBookingId =
// //       createdBooking._id;


// //     request.adminNote =
// //       adminNote || "";


// //     request.processedAt =
// //       new Date();


// //     request.adminActionToken =
// //       null;


// //     request.adminActionTokenExpiresAt =
// //       null;


// //     // CUSTOMER EMAIL
// //     if (
// //       customerEmail &&
// //       !request.customerEmail
// //     ) {

// //       request.customerEmail =
// //         customerEmail;

// //     }


// //     // WHATSAPP
// //     if (
// //       whatsappNumber &&
// //       !request.whatsappNumber
// //     ) {

// //       request.whatsappNumber =
// //         whatsappNumber;

// //     }


// //     await request.save();


// //     // =====================================================
// //     // CUSTOMER TICKET EMAIL
// //     // =====================================================

// //     let customerEmailSent =
// //       false;


// //     try {

// //       await sendTicketEmail({

// //         to:
// //           customerEmail,

// //         booking:
// //           createdBooking,

// //       });


// //       customerEmailSent =
// //         true;


// //       console.log(
// //         "CUSTOMER TICKET EMAIL SENT:",
// //         customerEmail
// //       );


// //     } catch (emailError) {

// //       console.error(
// //         "CUSTOMER TICKET EMAIL ERROR:",
// //         emailError
// //       );

// //     }


// //     // =====================================================
// //     // ADMIN TICKET EMAIL
// //     // =====================================================

// //     let adminEmailSent =
// //       false;


// //     try {

// //       const adminEmail =
// //         await getAdminEmail();


// //       if (adminEmail) {

// //         await sendTicketEmail({

// //           to:
// //             adminEmail,

// //           booking:
// //             createdBooking,

// //         });


// //         adminEmailSent =
// //           true;


// //         console.log(
// //           "ADMIN TICKET EMAIL SENT:",
// //           adminEmail
// //         );

// //       }

// //     } catch (adminEmailError) {

// //       console.error(
// //         "ADMIN TICKET EMAIL ERROR:",
// //         adminEmailError
// //       );

// //     }


// //     // =====================================================
// //     // CUSTOMER WHATSAPP TICKET
// //     // =====================================================

// //     let whatsappSent =
// //       false;


// //     try {

// //       if (whatsappNumber) {

// //         await sendTicketWhatsApp({

// //           to:
// //             whatsappNumber,

// //           booking:
// //             createdBooking,

// //         });


// //         whatsappSent =
// //           true;


// //         console.log(
// //           "CUSTOMER TICKET WHATSAPP SENT:",
// //           whatsappNumber
// //         );

// //       }

// //     } catch (whatsappError) {

// //       console.error(
// //         "CUSTOMER TICKET WHATSAPP ERROR:",
// //         whatsappError
// //       );

// //     }


// //     // =====================================================
// //     // RESPONSE
// //     // =====================================================

// //     return res.status(200).json({

// //       success:
// //         true,

// //       message:
// //         "Payment accepted and booking confirmed successfully.",

// //       paymentRequest:
// //         request,

// //       booking:
// //         createdBooking,

// //       ticketStatus: {

// //         customerEmail:
// //           customerEmailSent
// //             ? "sent"
// //             : "failed",

// //         adminEmail:
// //           adminEmailSent
// //             ? "sent"
// //             : "failed",

// //         whatsapp:
// //           whatsappSent
// //             ? "sent"
// //             : "failed",

// //       },

// //     });


// //   } catch (error) {

// //     console.error(
// //       "ACCEPT PAYMENT ERROR:",
// //       error
// //     );


// //     return res.status(500).json({

// //       success:
// //         false,

// //       message:
// //         error.message ||
// //         "Failed to accept payment.",

// //     });

// //   }

// // };


// // // =========================================================
// // // REJECT PAYMENT REQUEST
// // // PUT /api/payment-requests/:id/reject
// // // =========================================================

// // const rejectPaymentRequest = async (req, res) => {
// //   try {

// //     const {
// //       adminNote,
// //     } = req.body || {};


// //     // -----------------------------------------------------
// //     // FIND PAYMENT REQUEST
// //     // -----------------------------------------------------

// //     const request =
// //       await PaymentRequest.findById(
// //         req.params.id
// //       );


// //     if (!request) {

// //       return res.status(404).json({

// //         success: false,

// //         message:
// //           "Payment request not found.",

// //       });

// //     }


// //     // -----------------------------------------------------
// //     // ONLY PENDING CAN BE REJECTED
// //     // -----------------------------------------------------

// //     if (
// //       request.status !==
// //       "Pending"
// //     ) {

// //       return res.status(400).json({

// //         success: false,

// //         message:
// //           `Payment request is already ${request.status}.`,

// //       });

// //     }


// //     // -----------------------------------------------------
// //     // UPDATE STATUS
// //     // -----------------------------------------------------

// //     request.status =
// //       "Rejected";


// //     request.adminNote =
// //       adminNote || "";


// //     request.processedAt =
// //       new Date();


// //     request.adminActionToken =
// //       null;


// //     request.adminActionTokenExpiresAt =
// //       null;


// //     await request.save();


// //     // -----------------------------------------------------
// //     // RESPONSE
// //     // -----------------------------------------------------

// //     return res.status(200).json({

// //       success: true,

// //       message:
// //         "Payment request rejected successfully.",

// //       paymentRequest:
// //         request,

// //     });


// //   } catch (error) {

// //     console.error(
// //       "REJECT PAYMENT ERROR:",
// //       error
// //     );


// //     return res.status(500).json({

// //       success: false,

// //       message:
// //         error.message ||
// //         "Failed to reject payment.",

// //     });

// //   }

// // };


// // // =========================================================
// // // DELETE PAYMENT REQUEST
// // // DELETE /api/payment-requests/:id
// // // =========================================================

// // const deletePaymentRequest = async (
// //   req,
// //   res
// // ) => {

// //   try {

// //     const request =
// //       await PaymentRequest.findById(
// //         req.params.id
// //       );


// //     // -----------------------------------------------------
// //     // REQUEST NOT FOUND
// //     // -----------------------------------------------------

// //     if (!request) {

// //       return res.status(404).json({

// //         success: false,

// //         message:
// //           "Payment request not found.",

// //       });

// //     }


// //     // -----------------------------------------------------
// //     // PENDING CANNOT BE DELETED
// //     // -----------------------------------------------------

// //     if (
// //       String(request.status)
// //         .toLowerCase() ===
// //       "pending"
// //     ) {

// //       return res.status(400).json({

// //         success: false,

// //         message:
// //           "Pending payment request cannot be deleted. Accept or reject it first.",

// //       });

// //     }


// //     // -----------------------------------------------------
// //     // DELETE PAYMENT REQUEST
// //     // -----------------------------------------------------

// //     await PaymentRequest.findByIdAndDelete(
// //       req.params.id
// //     );


// //     return res.status(200).json({

// //       success: true,

// //       message:
// //         "Payment request deleted successfully.",

// //     });


// //   } catch (error) {

// //     console.error(
// //       "DELETE PAYMENT REQUEST ERROR:",
// //       error
// //     );


// //     return res.status(500).json({

// //       success: false,

// //       message:
// //         error.message ||
// //         "Failed to delete payment request.",

// //     });

// //   }

// // };


// // // =========================================================
// // // EMAIL ACCEPT PAYMENT
// // // =========================================================

// // const emailAcceptPaymentRequest =
// //   async (req, res) => {

// //     try {

// //       const request =
// //         await PaymentRequest.findById(
// //           req.params.id
// //         );


// //       if (!request) {

// //         return res.status(404).send(
// //           "Payment request not found."
// //         );

// //       }


// //       if (
// //         request.status !==
// //         "Pending"
// //       ) {

// //         return res.status(400).send(
// //           `Payment request is already ${request.status}.`
// //         );

// //       }


// //       return res.send(`

// //         <html>

// //           <head>

// //             <title>
// //               Saiyed Travels
// //             </title>

// //           </head>

// //           <body
// //             style="
// //               font-family:Arial;
// //               padding:40px;
// //               text-align:center;
// //             "
// //           >

// //             <h2>
// //               Payment Approval
// //             </h2>

// //             <p>
// //               Please use the Admin Dashboard
// //               to accept this payment request.
// //             </p>

// //           </body>

// //         </html>

// //       `);


// //     } catch (error) {

// //       console.error(
// //         "EMAIL ACCEPT ERROR:",
// //         error
// //       );


// //       return res.status(500).send(
// //         "Something went wrong."
// //       );

// //     }

// //   };


// // // =========================================================
// // // EMAIL REJECT PAYMENT
// // // =========================================================

// // const emailRejectPaymentRequest =
// //   async (req, res) => {

// //     try {

// //       const request =
// //         await PaymentRequest.findById(
// //           req.params.id
// //         );


// //       if (!request) {

// //         return res.status(404).send(
// //           "Payment request not found."
// //         );

// //       }


// //       if (
// //         request.status !==
// //         "Pending"
// //       ) {

// //         return res.status(400).send(
// //           `Payment request is already ${request.status}.`
// //         );

// //       }


// //       return res.send(`

// //         <html>

// //           <head>

// //             <title>
// //               Saiyed Travels
// //             </title>

// //           </head>

// //           <body
// //             style="
// //               font-family:Arial;
// //               padding:40px;
// //               text-align:center;
// //             "
// //           >

// //             <h2>
// //               Payment Rejection
// //             </h2>

// //             <p>
// //               Please use the Admin Dashboard
// //               to reject this payment request.
// //             </p>

// //           </body>

// //         </html>

// //       `);


// //     } catch (error) {

// //       console.error(
// //         "EMAIL REJECT ERROR:",
// //         error
// //       );


// //       return res.status(500).send(
// //         "Something went wrong."
// //       );

// //     }

// //   };


// //   // =========================================================
// // // MODULE EXPORTS
// // // =========================================================

// // module.exports = {

// //   createPaymentRequest,

// //   getAllPaymentRequests,

// //   getPaymentRequestById,

// //   getCustomerPaymentStatus,

// //   getPendingPaymentCount,

// //   acceptPaymentRequest,

// //   rejectPaymentRequest,

// //   deletePaymentRequest,

// //   emailAcceptPaymentRequest,

// //   emailRejectPaymentRequest,

// // };
























































// const PaymentRequest = require("../models/PaymentRequest");
// const Booking = require("../models/Booking");
// const Flight = require("../models/Flight");
// const mongoose = require("mongoose");

// // =====================================================
// // HELPERS
// // =====================================================

// const numberValue = (value) => {
//   const n = Number(value);
//   return Number.isFinite(n) ? n : 0;
// };

// const safeString = (value) => {
//   if (
//     value === null ||
//     value === undefined
//   ) {
//     return "";
//   }

//   return String(value).trim();
// };

// const normalizeEmail = (value) => {
//   return safeString(value).toLowerCase();
// };

// // =====================================================
// // CREATE PAYMENT REQUEST
// // =====================================================

// const createPaymentRequest = async (
//   req,
//   res
// ) => {

//   try {

//     console.log(
//       "========================================"
//     );

//     console.log(
//       "CREATE PAYMENT REQUEST"
//     );

//     console.log(
//       "USER:",
//       req.user
//     );

//     // =================================================
//     // BOOKING DATA
//     // =================================================

//     let parsedBookingData =
//       req.body?.bookingData ||
//       req.body?.booking ||
//       req.body?.data ||
//       req.body;

//     if (
//       typeof parsedBookingData ===
//       "string"
//     ) {

//       try {

//         parsedBookingData =
//           JSON.parse(
//             parsedBookingData
//           );

//       } catch (parseError) {

//         return res.status(400).json({
//           success: false,
//           message:
//             "Invalid booking data.",
//         });
//       }
//     }

//     if (
//       !parsedBookingData ||
//       typeof parsedBookingData !==
//         "object"
//     ) {

//       return res.status(400).json({
//         success: false,
//         message:
//           "Booking data is required.",
//       });
//     }

//     // =================================================
//     // ORIGINAL USER ID
//     // =================================================

//     const originalUserId =
//       req.user?._id ||
//       req.user?.id ||
//       parsedBookingData?.userId ||
//       parsedBookingData?.user?._id ||
//       parsedBookingData?.user?.id ||
//       null;

//     // =================================================
//     // ORIGINAL USER ROLE
//     // =================================================

//     const originalUserRole =
//       String(
//         req.user?.role ||
//         parsedBookingData?.userRole ||
//         parsedBookingData?.fareRole ||
//         "customer"
//       )
//         .trim()
//         .toLowerCase();

//     // =================================================
//     // USER ID REQUIRED
//     // =================================================

//     if (!originalUserId) {

//       return res.status(401).json({
//         success: false,
//         message:
//           "User identity missing. Please login again.",
//       });
//     }

//     // =================================================
//     // SAVE ORIGINAL OWNER
//     // =================================================

//     parsedBookingData.userId =
//       String(originalUserId);

//     parsedBookingData.userRole =
//       originalUserRole;

//     parsedBookingData.fareRole =
//       parsedBookingData.fareRole ||
//       originalUserRole;

//     console.log(
//       "PAYMENT REQUEST OWNER:",
//       parsedBookingData.userId
//     );

//     console.log(
//       "PAYMENT REQUEST ROLE:",
//       parsedBookingData.userRole
//     );

//     // =================================================
//     // CUSTOMER EMAIL
//     // =================================================

//     const customerEmail =
//       normalizeEmail(
//         parsedBookingData?.email ||
//         parsedBookingData?.customerEmail ||
//         parsedBookingData?.passenger?.email ||
//         parsedBookingData?.passengers?.[0]?.email ||
//         req.user?.email ||
//         req.user?.emailAddress
//       );

//     if (!customerEmail) {

//       return res.status(400).json({
//         success: false,
//         message:
//           "Customer email is required.",
//       });
//     }

//     // =================================================
//     // BASIC BOOKING DETAILS
//     // =================================================

//     const bookingId =
//       safeString(
//         parsedBookingData?.bookingId
//       );

//     const flightId =
//       parsedBookingData?.flightId ||
//       parsedBookingData?.flight?._id ||
//       parsedBookingData?.flight?.id ||
//       null;

//     const pnr =
//       safeString(
//         parsedBookingData?.pnr
//       ).toUpperCase();

//     // =================================================
//     // TOTAL AMOUNT
//     // =================================================

//     const totalAmount =
//       numberValue(
//         parsedBookingData?.total ??
//         parsedBookingData?.finalTotal ??
//         parsedBookingData?.amount ??
//         parsedBookingData?.price ??
//         0
//       );

//     // =================================================
//     // PAYMENT METHOD
//     // =================================================

//     const paymentMethod =
//       safeString(
//         parsedBookingData?.paymentMethod ||
//         req.body?.paymentMethod ||
//         "upi"
//       );

//     // =================================================
//     // PAYMENT SCREENSHOT
//     // =================================================

//     const paymentScreenshot =
//       safeString(
//         parsedBookingData?.paymentScreenshot ||
//         parsedBookingData?.screenshot ||
//         parsedBookingData?.paymentProof ||
//         req.body?.paymentScreenshot ||
//         req.body?.screenshot ||
//         req.body?.paymentProof
//       );

//     // =================================================
//     // PAYMENT ID
//     // =================================================

//     const paymentId =
//       safeString(
//         parsedBookingData?.paymentId ||
//         req.body?.paymentId
//       );

//     // =================================================
//     // ORDER ID
//     // =================================================

//     const orderId =
//       safeString(
//         parsedBookingData?.orderId ||
//         req.body?.orderId
//       );

//     // =================================================
//     // FLIGHT SNAPSHOT
//     // =================================================

//     const flightData =
//       parsedBookingData?.flight ||
//       {};

//     // =================================================
//     // PASSENGERS
//     // =================================================

//     const passengers =
//       Array.isArray(
//         parsedBookingData?.passengers
//       )
//         ? parsedBookingData.passengers
//         : parsedBookingData?.passenger
//         ? [
//             parsedBookingData.passenger,
//           ]
//         : [];

//     // =================================================
//     // PAYMENT REQUEST DATA
//     // =================================================

//     const paymentRequestData = {

//       userId:
//         originalUserId,

//       userRole:
//         originalUserRole,

//       fareRole:
//         parsedBookingData.fareRole ||
//         originalUserRole,

//       email:
//         customerEmail,

//       customerEmail:
//         customerEmail,

//       bookingId:
//         bookingId,

//       flightId:
//         flightId,

//       pnr:
//         pnr,

//       amount:
//         totalAmount,

//       total:
//         totalAmount,

//       paymentMethod:
//         paymentMethod,

//       paymentId:
//         paymentId,

//       orderId:
//         orderId,

//       paymentScreenshot:
//         paymentScreenshot,

//       screenshot:
//         paymentScreenshot,

//       paymentProof:
//         paymentScreenshot,

//       bookingData:
//         parsedBookingData,

//       passengers:
//         passengers,

//       passenger:
//         passengers[0] || null,

//       flight:
//         flightData,

//       status:
//         "Pending",

//       createdAt:
//         new Date(),

//     };

//     console.log(
//       "========================================"
//     );

//     console.log(
//       "PAYMENT REQUEST DATA"
//     );

//     console.log(
//       "USER ID:",
//       paymentRequestData.userId
//     );

//     console.log(
//       "ROLE:",
//       paymentRequestData.userRole
//     );

//     console.log(
//       "EMAIL:",
//       paymentRequestData.email
//     );

//     console.log(
//       "BOOKING ID:",
//       paymentRequestData.bookingId
//     );

//     console.log(
//       "AMOUNT:",
//       paymentRequestData.amount
//     );

//     console.log(
//       "========================================"
//     );

//     // =================================================
//     // CREATE PAYMENT REQUEST
//     // =================================================

//     const paymentRequest =
//       await PaymentRequest.create(
//         paymentRequestData
//       );

//     console.log(
//       "PAYMENT REQUEST CREATED:",
//       paymentRequest._id
//     );

//     // =================================================
//     // SUCCESS
//     // =================================================

//     return res.status(201).json({

//       success: true,

//       message:
//         "Payment request submitted successfully.",

//       paymentRequest,

//       requestId:
//         paymentRequest._id,

//       userId:
//         paymentRequest.userId,

//       userRole:
//         paymentRequest.userRole,

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
//         "Unable to create payment request.",

//     });
//   }
// };

// // =====================================================
// // GET ALL PAYMENT REQUESTS
// // =====================================================

// const getAllPaymentRequests = async (
//   req,
//   res
// ) => {

//   try {

//     const requests =
//       await PaymentRequest.find()
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
//         "Unable to fetch payment requests.",

//     });
//   }
// };

// // =====================================================
// // GET PAYMENT REQUEST BY ID
// // =====================================================

// const getPaymentRequestById = async (
//   req,
//   res
// ) => {

//   try {

//     const request =
//       await PaymentRequest.findById(
//         req.params.id
//       );

//     if (!request) {

//       return res.status(404).json({

//         success: false,

//         message:
//           "Payment request not found.",

//       });
//     }

//     return res.status(200).json({

//       success: true,

//       request,

//     });

//   } catch (error) {

//     console.error(
//       "GET PAYMENT REQUEST BY ID ERROR:",
//       error
//     );

//     return res.status(500).json({

//       success: false,

//       message:
//         error.message ||
//         "Unable to fetch payment request.",

//     });
//   }
// };

// // =====================================================
// // CUSTOMER PAYMENT STATUS
// // =====================================================

// const getCustomerPaymentStatus = async (
//   req,
//   res
// ) => {

//   try {

//     const userId =
//       req.user?._id ||
//       req.user?.id ||
//       req.query.userId ||
//       req.body?.userId ||
//       req.headers["x-user-id"] ||
//       null;

//     if (!userId) {

//       return res.status(401).json({

//         success: false,

//         message:
//           "User login required.",

//       });
//     }

//     const request =
//       await PaymentRequest.findOne({
//         userId:
//           userId,

//       }).sort({
//         createdAt: -1,
//       });

//     if (!request) {

//       return res.status(200).json({

//         success: true,

//         exists: false,

//         status:
//           null,

//         request:
//           null,

//       });
//     }

//     return res.status(200).json({

//       success: true,

//       exists: true,

//       status:
//         request.status,

//       request,

//     });

//   } catch (error) {

//     console.error(
//       "CUSTOMER PAYMENT STATUS ERROR:",
//       error
//     );

//     return res.status(500).json({

//       success: false,

//       message:
//         error.message ||
//         "Unable to fetch payment status.",

//     });
//   }
// };

// // =========================================================
// // GET PENDING PAYMENT COUNT
// // GET /api/payment-requests/pending-count
// // =========================================================

// const getPendingPaymentCount =
//   async (req, res) => {

//     try {

//       const count =
//         await PaymentRequest.countDocuments({
//           status:
//             "Pending",
//         });

//       return res.status(200).json({

//         success: true,

//         count:
//           count,

//       });

//     } catch (error) {

//       console.error(
//         "GET PENDING PAYMENT COUNT ERROR:",
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


// // =========================================================
// // ACCEPT PAYMENT REQUEST
// // POST /api/payment-requests/:id/accept
// // =========================================================

// const acceptPaymentRequest =
//   async (req, res) => {

//     try {

//       // -----------------------------------------------------
//       // GET REQUEST
//       // -----------------------------------------------------

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


//       // -----------------------------------------------------
//       // ALREADY ACCEPTED
//       // -----------------------------------------------------

//       if (
//         request.status ===
//           "Accepted" &&
//         request.approvedBookingId
//       ) {

//         const existingBooking =
//           await Booking.findById(
//             request.approvedBookingId
//           );

//         return res.status(200).json({

//           success: true,

//           message:
//             "Payment request is already accepted.",

//           booking:
//             existingBooking,

//           bookingId:
//             request.approvedBookingId,

//         });

//       }


//       // -----------------------------------------------------
//       // ALREADY REJECTED
//       // -----------------------------------------------------

//       if (
//         request.status ===
//         "Rejected"
//       ) {

//         return res.status(400).json({

//           success: false,

//           message:
//             "This payment request has already been rejected.",

//         });

//       }


//       // -----------------------------------------------------
//       // GET BOOKING DATA
//       // -----------------------------------------------------

//       let bookingData =
//         request.bookingData;

//       if (
//         typeof bookingData ===
//         "string"
//       ) {

//         try {

//           bookingData =
//             JSON.parse(
//               bookingData
//             );

//         } catch (parseError) {

//           return res.status(400).json({

//             success: false,

//             message:
//               "Invalid booking data stored in payment request.",

//           });

//         }

//       }


//       if (
//         !bookingData ||
//         typeof bookingData !==
//           "object"
//       ) {

//         return res.status(400).json({

//           success: false,

//           message:
//             "Booking data is missing from payment request.",

//         });

//       }


//       // =====================================================
//       // ORIGINAL CUSTOMER / AGENT USER ID
//       // =====================================================

//       const rawUserId =
//         bookingData?.userId ||
//         bookingData?.user?._id ||
//         bookingData?.user?.id ||
//         null;


//       const customerUserId =
//         rawUserId &&
//         mongoose.Types.ObjectId.isValid(
//           String(rawUserId)
//         )
//           ? new mongoose.Types.ObjectId(
//               String(rawUserId)
//             )
//           : null;


//       // =====================================================
//       // ORIGINAL CUSTOMER EMAIL
//       // =====================================================

//       const customerEmail =
//         String(
//           request.customerEmail ||
//           bookingData?.customerEmail ||
//           bookingData?.email ||
//           bookingData?.userEmail ||
//           ""
//         )
//           .trim()
//           .toLowerCase();


//       // =====================================================
//       // ORIGINAL USER ROLE
//       // =====================================================

//       const originalUserRole =
//         String(
//           bookingData?.userRole ||
//           bookingData?.fareRole ||
//           "customer"
//         )
//           .trim()
//           .toLowerCase();


//       // =====================================================
//       // USER ID REQUIRED
//       // =====================================================

//       if (!customerUserId) {

//         return res.status(400).json({

//           success: false,

//           message:
//             "Original customer/agent user ID is missing from payment request. Please create a new payment request after login.",

//         });

//       }


//       console.log(
//         "========================================"
//       );

//       console.log(
//         "ACCEPT PAYMENT REQUEST"
//       );

//       console.log(
//         "PAYMENT REQUEST ID:",
//         request._id
//       );

//       console.log(
//         "ORIGINAL USER ID:",
//         customerUserId
//       );

//       console.log(
//         "ORIGINAL USER ROLE:",
//         originalUserRole
//       );

//       console.log(
//         "CUSTOMER EMAIL:",
//         customerEmail
//       );

//       console.log(
//         "========================================"
//       );


//       // =====================================================
//       // CREATE BOOKING REQUEST
//       // IMPORTANT:
//       // ADMIN MUST NOT BECOME BOOKING OWNER
//       // =====================================================

//       const fakeReq = {

//         body: {

//           ...bookingData,


//           // -------------------------------------------------
//           // FORCE ORIGINAL USER ID
//           // -------------------------------------------------

//           userId:
//             customerUserId,


//           // -------------------------------------------------
//           // FORCE ORIGINAL ROLE
//           // -------------------------------------------------

//           userRole:
//             originalUserRole,


//           fareRole:
//             bookingData?.fareRole ||
//             originalUserRole,


//           // -------------------------------------------------
//           // PAYMENT IS ALREADY VERIFIED
//           // -------------------------------------------------

//           paymentVerified:
//             true,


//           paymentMethod:
//             bookingData?.paymentMethod ||
//             "upi",


//           paymentId:
//             request.paymentId ||
//             bookingData?.paymentId ||
//             "",


//           // -------------------------------------------------
//           // PAYMENT REQUEST AMOUNT
//           // -------------------------------------------------

//           paymentAmount:
//             numberValue(
//               request.amount
//             ),

//         },


//         // ===================================================
//         // IMPORTANT:
//         // DO NOT PASS ADMIN USER HERE
//         // ===================================================

//         user: {

//           _id:
//             customerUserId,

//           id:
//             customerUserId,

//           role:
//             originalUserRole,

//           email:
//             customerEmail,

//         },

//       };


//       // =====================================================
//       // FAKE RESPONSE
//       // =====================================================

//       let bookingResponseStatus =
//         200;

//       let bookingResponseData =
//         null;


//       const fakeRes = {

//         status(code) {

//           bookingResponseStatus =
//             code;

//           return this;

//         },

//         json(data) {

//           bookingResponseData =
//             data;

//           return this;

//         },

//       };


//       // =====================================================
//       // CREATE ACTUAL BOOKING
//       // =====================================================

//       await bookingController.createBooking(
//         fakeReq,
//         fakeRes
//       );


//       // =====================================================
//       // CHECK BOOKING CREATION
//       // =====================================================

//       if (
//         bookingResponseStatus <
//           200 ||
//         bookingResponseStatus >=
//           300 ||
//         !bookingResponseData?.success ||
//         !bookingResponseData?.booking
//       ) {

//         console.error(
//           "BOOKING CREATION FROM PAYMENT REQUEST FAILED:",
//           bookingResponseData
//         );

//         return res.status(
//           bookingResponseStatus >= 400
//             ? bookingResponseStatus
//             : 500
//         ).json({

//           success: false,

//           message:
//             bookingResponseData?.message ||
//             "Payment accepted but booking could not be created.",

//           booking:
//             bookingResponseData?.booking ||
//             null,

//         });

//       }


//       // =====================================================
//       // GET CREATED BOOKING
//       // =====================================================

//       const createdBooking =
//         bookingResponseData.booking;


//       // =====================================================
//       // FINAL OWNER SAFETY
//       // =====================================================

//       const finalBookingUserId =
//         customerUserId;


//       // =====================================================
//       // UPDATE BOOKING OWNER
//       // =====================================================

//       const updatedBooking =
//         await Booking.findByIdAndUpdate(

//           createdBooking._id,

//           {

//             $set: {

//               userId:
//                 finalBookingUserId,

//               userRole:
//                 originalUserRole,

//               fareRole:
//                 createdBooking.fareRole ||
//                 bookingData?.fareRole ||
//                 originalUserRole,

//               email:
//                 customerEmail,

//               customerEmail:
//                 customerEmail,

//             },

//           },

//           {
//             new: true,
//           }

//         );


//       // =====================================================
//       // UPDATE PAYMENT REQUEST
//       // =====================================================

//       request.status =
//         "Accepted";


//       request.approvedBookingId =
//         updatedBooking?._id ||
//         createdBooking._id;


//       request.approvedAt =
//         new Date();


//       request.approvedBy =
//         req.user?._id ||
//         req.user?.id ||
//         null;


//       await request.save();


//       // =====================================================
//       // LOG
//       // =====================================================

//       console.log(
//         "========================================"
//       );

//       console.log(
//         "PAYMENT REQUEST ACCEPTED"
//       );

//       console.log(
//         "PAYMENT REQUEST:",
//         request._id
//       );

//       console.log(
//         "BOOKING:",
//         updatedBooking?._id
//       );

//       console.log(
//         "BOOKING ID:",
//         updatedBooking?.bookingId
//       );

//       console.log(
//         "PNR:",
//         updatedBooking?.pnr
//       );

//       console.log(
//         "OWNER USER ID:",
//         updatedBooking?.userId
//       );

//       console.log(
//         "OWNER ROLE:",
//         updatedBooking?.userRole
//       );

//       console.log(
//         "FARE ROLE:",
//         updatedBooking?.fareRole
//       );

//       console.log(
//         "========================================"
//       );


//       // =====================================================
//       // SUCCESS
//       // =====================================================

//       return res.status(200).json({

//         success: true,

//         message:
//           "Payment accepted and booking confirmed successfully.",

//         paymentRequest:
//           request,

//         booking:
//           updatedBooking,

//         bookingId:
//           updatedBooking?._id,

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

//       // =====================================================
//     // UPDATE PAYMENT REQUEST
//     // =====================================================

//     request.status = "Accepted";

//     request.approvedBookingId =
//       createdBooking._id;

//     request.adminNote =
//       adminNote || "";

//     request.processedAt =
//       new Date();

//     request.adminActionToken =
//       null;

//     request.adminActionTokenExpiresAt =
//       null;

//     if (
//       customerEmail &&
//       !request.customerEmail
//     ) {
//       request.customerEmail =
//         customerEmail;
//     }

//     if (
//       whatsappNumber &&
//       !request.whatsappNumber
//     ) {
//       request.whatsappNumber =
//         whatsappNumber;
//     }

//     await request.save();

//     // =====================================================
//     // CUSTOMER TICKET EMAIL
//     // =====================================================

//     let customerEmailSent =
//       false;

//     try {

//       await sendTicketEmail({

//         to:
//           customerEmail,

//         booking:
//           createdBooking,

//       });

//       customerEmailSent =
//         true;

//       console.log(
//         "CUSTOMER TICKET EMAIL SENT:",
//         customerEmail
//       );

//     } catch (emailError) {

//       console.error(
//         "CUSTOMER TICKET EMAIL ERROR:",
//         emailError
//       );

//     }

//     // =====================================================
//     // ADMIN TICKET EMAIL
//     // =====================================================

//     let adminEmailSent =
//       false;

//     try {

//       const adminEmail =
//         await getAdminEmail();

//       if (adminEmail) {

//         await sendTicketEmail({

//           to:
//             adminEmail,

//           booking:
//             createdBooking,

//         });

//         adminEmailSent =
//           true;

//         console.log(
//           "ADMIN TICKET EMAIL SENT:",
//           adminEmail
//         );

//       }

//     } catch (adminEmailError) {

//       console.error(
//         "ADMIN TICKET EMAIL ERROR:",
//         adminEmailError
//       );

//     }

//     // =====================================================
//     // CUSTOMER WHATSAPP TICKET
//     // =====================================================

//     let whatsappSent =
//       false;

//     try {

//       if (whatsappNumber) {

//         await sendTicketWhatsApp({

//           to:
//             whatsappNumber,

//           booking:
//             createdBooking,

//         });

//         whatsappSent =
//           true;

//         console.log(
//           "CUSTOMER TICKET WHATSAPP SENT:",
//           whatsappNumber
//         );

//       }

//     } catch (whatsappError) {

//       console.error(
//         "CUSTOMER TICKET WHATSAPP ERROR:",
//         whatsappError
//       );

//     }

//     // =====================================================
//     // RESPONSE
//     // =====================================================

//     return res.status(200).json({

//       success:
//         true,

//       message:
//         "Payment accepted and booking confirmed successfully.",

//       paymentRequest:
//         request,

//       booking:
//         createdBooking,

//       ticketStatus: {

//         customerEmail:
//           customerEmailSent
//             ? "sent"
//             : "failed",

//         adminEmail:
//           adminEmailSent
//             ? "sent"
//             : "failed",

//         whatsapp:
//           whatsappSent
//             ? "sent"
//             : "failed",

//       },

//     });

//   // catch (error) {

//   //   console.error(
//   //     "ACCEPT PAYMENT ERROR:",
//   //     error
//   //   );

//   //   return res.status(500).json({

//   //     success:
//   //       false,

//   //     message:
//   //       error.message ||
//   //       "Failed to accept payment.",

//   //   });

//   // }



// // =========================================================
// // REJECT PAYMENT REQUEST
// // PUT /api/payment-requests/:id/reject
// // =========================================================

// const rejectPaymentRequest =
//   async (req, res) => {

//     try {

//       const {
//         adminNote,
//       } = req.body || {};

//       const request =
//         await PaymentRequest.findById(
//           req.params.id
//         );

//       if (!request) {

//         return res.status(404).json({

//           success:
//             false,

//           message:
//             "Payment request not found.",

//         });

//       }

//       if (
//         request.status !==
//         "Pending"
//       ) {

//         return res.status(400).json({

//           success:
//             false,

//           message:
//             `Payment request is already ${request.status}.`,

//         });

//       }

//       request.status =
//         "Rejected";

//       request.adminNote =
//         adminNote || "";

//       request.processedAt =
//         new Date();

//       request.adminActionToken =
//         null;

//       request.adminActionTokenExpiresAt =
//         null;

//       await request.save();

//       return res.status(200).json({

//         success:
//           true,

//         message:
//           "Payment request rejected successfully.",

//         paymentRequest:
//           request,

//       });

//     } catch (error) {

//       console.error(
//         "REJECT PAYMENT ERROR:",
//         error
//       );

//       return res.status(500).json({

//         success:
//           false,

//         message:
//           error.message ||
//           "Failed to reject payment.",

//       });

//     }

//   };


// // =========================================================
// // DELETE PAYMENT REQUEST
// // DELETE /api/payment-requests/:id
// //
// // Pending request cannot be deleted.
// // Accepted / Rejected request can be deleted.
// // Confirmed Booking will NOT be deleted.
// // =========================================================

// const deletePaymentRequest =
//   async (req, res) => {

//     try {

//       const request =
//         await PaymentRequest.findById(
//           req.params.id
//         );

//       if (!request) {

//         return res.status(404).json({

//           success:
//             false,

//           message:
//             "Payment request not found.",

//         });

//       }

//       // ---------------------------------------------------
//       // PENDING CANNOT BE DELETED
//       // ---------------------------------------------------

//       if (
//         String(
//           request.status
//         ).toLowerCase() ===
//         "pending"
//       ) {

//         return res.status(400).json({

//           success:
//             false,

//           message:
//             "Pending payment request cannot be deleted. Accept or reject it first.",

//         });

//       }

//       // ---------------------------------------------------
//       // DELETE REQUEST
//       // ---------------------------------------------------

//       await PaymentRequest.findByIdAndDelete(
//         req.params.id
//       );

//       return res.status(200).json({

//         success:
//           true,

//         message:
//           "Payment request deleted successfully.",

//       });

//     } catch (error) {

//       console.error(
//         "DELETE PAYMENT REQUEST ERROR:",
//         error
//       );

//       return res.status(500).json({

//         success:
//           false,

//         message:
//           error.message ||
//           "Failed to delete payment request.",

//       });

//     }

//   };


// // =========================================================
// // EMAIL ACCEPT PAYMENT
// // GET/POST /email-accept
// // =========================================================

// const emailAcceptPaymentRequest =
//   async (req, res) => {

//     try {

//       const request =
//         await PaymentRequest.findById(
//           req.params.id
//         );

//       if (!request) {

//         return res.status(404).send(
//           "Payment request not found."
//         );

//       }

//       if (
//         request.status !==
//         "Pending"
//       ) {

//         return res.status(400).send(
//           `Payment request is already ${request.status}.`
//         );

//       }

//       return res.send(`

//         <html>

//           <head>

//             <title>
//               Saiyed Travels
//             </title>

//           </head>

//           <body
//             style="
//               font-family:Arial;
//               padding:40px;
//               text-align:center;
//             "
//           >

//             <h2>
//               Payment Approval
//             </h2>

//             <p>
//               Please use the Admin Dashboard
//               to accept this payment request.
//             </p>

//           </body>

//         </html>

//       `);

//     } catch (error) {

//       console.error(
//         "EMAIL ACCEPT ERROR:",
//         error
//       );

//       return res.status(500).send(
//         "Something went wrong."
//       );

//     }

//   };


// // =========================================================
// // EMAIL REJECT PAYMENT
// // =========================================================

// const emailRejectPaymentRequest =
//   async (req, res) => {

//     try {

//       const request =
//         await PaymentRequest.findById(
//           req.params.id
//         );

//       if (!request) {

//         return res.status(404).send(
//           "Payment request not found."
//         );

//       }

//       if (
//         request.status !==
//         "Pending"
//       ) {

//         return res.status(400).send(
//           `Payment request is already ${request.status}.`
//         );

//       }

//       return res.send(`

//         <html>

//           <head>

//             <title>
//               Saiyed Travels
//             </title>

//           </head>

//           <body
//             style="
//               font-family:Arial;
//               padding:40px;
//               text-align:center;
//             "
//           >

//             <h2>
//               Payment Rejection
//             </h2>

//             <p>
//               Please use the Admin Dashboard
//               to reject this payment request.
//             </p>

//           </body>

//         </html>

//       `);

//     } catch (error) {

//       console.error(
//         "EMAIL REJECT ERROR:",
//         error
//       );

//       return res.status(500).send(
//         "Something went wrong."
//       );

//     }

//   };


// // =========================================================
// // EXPORTS
// // =========================================================

// // module.exports = {

// //   createPaymentRequest,

// //   getAllPaymentRequests,

// //   getPaymentRequestById,

// //   getCustomerPaymentStatus,

// //   getPendingPaymentCount,

// //   acceptPaymentRequest,

// //   rejectPaymentRequest,

// //   deletePaymentRequest,

// //   emailAcceptPaymentRequest,

// //   emailRejectPaymentRequest,

// // };



// module.exports = {
//   createPaymentRequest,
//   getAllPaymentRequests,
//   getPaymentRequestById,
//   getCustomerPaymentStatus,
//   getPendingPaymentCount,
//   acceptPaymentRequest,
//   rejectPaymentRequest,
//   deletePaymentRequest,
//   emailAcceptPaymentRequest,
//   emailRejectPaymentRequest,
// };



































































const crypto = require("crypto");

const mongoose = require("mongoose");

const PaymentRequest = require("../models/PaymentRequest");
const Booking = require("../models/Booking");
const User = require("../models/User");

const bookingController = require("./bookingController");

const {
  sendAdminPaymentNotification,
  sendTicketEmail,
} = require("../services/emailService");

const {
  sendTicketWhatsApp,
} = require("../services/whatsappService");


// =========================================================
// GET ADMIN EMAIL
// =========================================================

const getAdminEmail = async () => {
  try {

    // First priority: Render Environment Variable
    if (process.env.ADMIN_EMAIL) {

      return String(
        process.env.ADMIN_EMAIL
      )
        .trim()
        .toLowerCase();

    }

    // Second priority: EMAIL_USER
    if (process.env.EMAIL_USER) {

      return String(
        process.env.EMAIL_USER
      )
        .trim()
        .toLowerCase();

    }

    // Third priority: Database admin
    const admin =
      await User.findOne({
        role: "admin",
        isActive: true,
      }).sort({
        createdAt: -1,
      });

    if (!admin) {

      throw new Error(
        "Active admin account not found."
      );

    }

    if (!admin.email) {

      throw new Error(
        "Admin email is missing."
      );

    }

    return String(
      admin.email
    )
      .trim()
      .toLowerCase();

  } catch (error) {

    console.error(
      "GET ADMIN EMAIL ERROR:",
      error
    );

    throw error;

  }
};


// =========================================================
// CREATE PAYMENT REQUEST
// POST /api/payment-requests
// =========================================================

const createPaymentRequest = async (
  req,
  res
) => {

  try {

    // -----------------------------------------------------
    // FILE CHECK
    // -----------------------------------------------------

    if (!req.file) {

      return res.status(400).json({

        success: false,

        message:
          "Payment screenshot is required.",

      });

    }


    // -----------------------------------------------------
    // GET FORM DATA
    // -----------------------------------------------------

    const {
      bookingData,
      amount,
      bankName,
      paymentId,
      paymentDateTime,
      customerEmail,
      whatsappNumber,
    } = req.body;


    // -----------------------------------------------------
    // BASIC VALIDATION
    // -----------------------------------------------------

    if (!bookingData) {

      return res.status(400).json({

        success: false,

        message:
          "Booking data is required.",

      });

    }


    if (!amount) {

      return res.status(400).json({

        success: false,

        message:
          "Payment amount is required.",

      });

    }


    if (
      bankName !== "ICICI Bank" &&
      bankName !== "Bank of Baroda"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Please select a valid bank.",

      });

    }


    if (!paymentId) {

      return res.status(400).json({

        success: false,

        message:
          "Payment ID / UTR is required.",

      });

    }


    if (!paymentDateTime) {

      return res.status(400).json({

        success: false,

        message:
          "Payment date/time is required.",

      });

    }


    if (!whatsappNumber) {

      return res.status(400).json({

        success: false,

        message:
          "WhatsApp number is required.",

      });

    }


    // -----------------------------------------------------
    // PARSE BOOKING DATA
    // -----------------------------------------------------

    let parsedBookingData;

    try {

      parsedBookingData =
        typeof bookingData === "string"
          ? JSON.parse(bookingData)
          : bookingData;

    } catch (error) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid booking data.",

      });

    }


    // -----------------------------------------------------
    // ORIGINAL USER ID + ROLE
    // -----------------------------------------------------

    const originalUserId =
      req.user?._id ||
      req.user?.id ||
      parsedBookingData?.userId ||
      parsedBookingData?.user?._id ||
      parsedBookingData?.user?.id ||
      null;


    const originalUserRole =
      String(
        req.user?.role ||
        parsedBookingData?.userRole ||
        parsedBookingData?.fareRole ||
        "customer"
      )
        .trim()
        .toLowerCase();


    // -----------------------------------------------------
    // USER ID REQUIRED
    // -----------------------------------------------------

    if (!originalUserId) {

      return res.status(401).json({

        success: false,

        message:
          "User identity missing. Please login again.",

      });

    }


    // -----------------------------------------------------
    // SAVE ORIGINAL USER ID
    // -----------------------------------------------------

    parsedBookingData.userId =
      String(originalUserId);


    parsedBookingData.userRole =
      originalUserRole;


    parsedBookingData.fareRole =
      parsedBookingData.fareRole ||
      originalUserRole;


    console.log(
      "========================================"
    );

    console.log(
      "PAYMENT REQUEST OWNER:",
      parsedBookingData.userId
    );

    console.log(
      "PAYMENT REQUEST ROLE:",
      parsedBookingData.userRole
    );

    console.log(
      "========================================"
    );


    // -----------------------------------------------------
    // CUSTOMER EMAIL FALLBACK
    // -----------------------------------------------------

    const finalCustomerEmail =
      String(
        customerEmail ||
        parsedBookingData?.customerEmail ||
        parsedBookingData?.email ||
        parsedBookingData?.userEmail ||
        ""
      )
        .trim()
        .toLowerCase();


    // -----------------------------------------------------
    // CUSTOMER EMAIL REQUIRED
    // -----------------------------------------------------

    if (!finalCustomerEmail) {

      return res.status(400).json({

        success: false,

        message:
          "Customer email is required. Please enter customer email before submitting payment.",

      });

    }


    // -----------------------------------------------------
    // WHATSAPP FALLBACK
    // -----------------------------------------------------

    const finalWhatsappNumber =
      String(
        whatsappNumber ||
        parsedBookingData?.whatsappNumber ||
        parsedBookingData?.phone ||
        parsedBookingData?.mobile ||
        ""
      ).trim();


    // -----------------------------------------------------
    // ADD CONTACT DATA INSIDE BOOKING DATA
    // -----------------------------------------------------

    parsedBookingData = {

      ...parsedBookingData,

      customerEmail:
        finalCustomerEmail,

      email:
        parsedBookingData?.email ||
        finalCustomerEmail,

      whatsappNumber:
        finalWhatsappNumber,

    };


    // -----------------------------------------------------
    // PAYMENT DATE
    // -----------------------------------------------------

    const parsedPaymentDate =
      new Date(
        paymentDateTime
      );


    if (
      Number.isNaN(
        parsedPaymentDate.getTime()
      )
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid payment date/time.",

      });

    }


    // -----------------------------------------------------
    // SCREENSHOT URL
    // -----------------------------------------------------

    const screenshotPath =
      `/uploads/payment-screenshots/${req.file.filename}`;


    // =====================================================
    // CREATE PAYMENT REQUEST
    // =====================================================

    const request =
      await PaymentRequest.create({

        bookingData:
          parsedBookingData,

        amount:
          Number(amount),

        bankName:

          bankName,

        paymentId:
          String(
            paymentId
          ).trim(),

        screenshot:
          screenshotPath,

        paymentDateTime:
          parsedPaymentDate,

        customerEmail:
          finalCustomerEmail,

        whatsappNumber:
          finalWhatsappNumber,

        status:
          "Pending",

        adminActionToken:
          null,

        adminActionTokenExpiresAt:
          null,

      });


    // =====================================================
    // CREATE ADMIN EMAIL ACTION TOKEN
    // =====================================================

    const rawToken =
      crypto
        .randomBytes(32)
        .toString("hex");


    const tokenHash =
      crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");


    const tokenExpiry =
      new Date(
        Date.now() +
        7 *
        24 *
        60 *
        60 *
        1000
      );


    request.adminActionToken =
      tokenHash;


    request.adminActionTokenExpiresAt =
      tokenExpiry;


    await request.save();


    // =====================================================
    // GET ADMIN EMAIL
    // =====================================================

    let adminEmail =
      null;


    try {

      adminEmail =
        await getAdminEmail();

      console.log(
        "ADMIN PAYMENT EMAIL:",
        adminEmail
      );

    } catch (error) {

      console.error(
        "ADMIN EMAIL LOOKUP ERROR:",
        error
      );

    }


    // =====================================================
    // SEND ADMIN PAYMENT REQUEST EMAIL
    // =====================================================

    if (adminEmail) {

      try {

        await sendAdminPaymentNotification({

          paymentRequest:
            request,

          adminActionToken:
            rawToken,

          adminEmail:
            adminEmail,

        });


        console.log(
          "ADMIN PAYMENT REQUEST EMAIL SENT TO:",
          adminEmail
        );

      } catch (emailError) {

        console.error(
          "ADMIN PAYMENT EMAIL ERROR:",
          emailError
        );

      }

    } else {

      console.error(
        "ADMIN EMAIL NOT FOUND - EMAIL NOT SENT"
      );

    }


    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(201).json({

      success:
        true,

      message:
        "Payment request submitted successfully. Waiting for admin verification.",

      paymentRequest: {

        id:
          request._id,

        status:
          request.status,

        amount:
          request.amount,

        bankName:
          request.bankName,

        paymentId:
          request.paymentId,

        customerEmail:
          request.customerEmail,

        whatsappNumber:
          request.whatsappNumber,

      },

    });


  } catch (error) {

    console.error(
      "CREATE PAYMENT REQUEST ERROR:",
      error
    );

    return res.status(500).json({

      success:
        false,

      message:
        error.message ||
        "Failed to create payment request.",

    });

  }

};


// =========================================================
// GET ALL PAYMENT REQUESTS
// GET /api/payment-requests
// =========================================================

const getAllPaymentRequests =
  async (
    req,
    res
  ) => {

    try {

      const requests =
        await PaymentRequest.find()
          .populate(
            "approvedBookingId"
          )
          .sort({
            createdAt: -1,
          });


      return res.status(200).json({

        success:
          true,

        count:
          requests.length,

        requests:
          requests,

      });

    } catch (error) {

      console.error(
        "GET PAYMENT REQUESTS ERROR:",
        error
      );

      return res.status(500).json({

        success:
          false,

        message:
          error.message ||
          "Failed to get payment requests.",

      });

    }

  };


// =========================================================
// GET SINGLE PAYMENT REQUEST
// GET /api/payment-requests/:id
// =========================================================

const getPaymentRequestById =
  async (
    req,
    res
  ) => {

    try {

      const request =
        await PaymentRequest.findById(
          req.params.id
        ).populate(
          "approvedBookingId"
        );


      if (!request) {

        return res.status(404).json({

          success:
            false,

          message:
            "Payment request not found.",

        });

      }


      return res.status(200).json({

        success:
          true,

        request:
          request,

      });

    } catch (error) {

      console.error(
        "GET PAYMENT REQUEST ERROR:",
        error
      );

      return res.status(500).json({

        success:
          false,

        message:
          error.message ||
          "Failed to get payment request.",

      });

    }

  };


// =========================================================
// CUSTOMER PAYMENT STATUS
// GET /api/payment-requests/:id/status
// =========================================================

const getCustomerPaymentStatus =
  async (
    req,
    res
  ) => {

    try {

      const requestId =
        req.params.id;


      if (!requestId) {

        return res.status(400).json({

          success:
            false,

          message:
            "Payment request ID is required.",

        });

      }


      if (
        !mongoose.Types.ObjectId.isValid(
          requestId
        )
      ) {

        return res.status(400).json({

          success:
            false,

          message:
            "Invalid payment request ID.",

        });

      }


      const request =
        await PaymentRequest.findById(
          requestId
        );


      if (!request) {

        return res.status(404).json({

          success:
            false,

          message:
            "Payment request not found.",

        });

      }


      // ===================================================
      // PENDING
      // ===================================================

      if (
        request.status ===
        "Pending"
      ) {

        return res.status(200).json({

          success:
            true,

          status:
            "Pending",

          approvedBookingId:
            null,

          booking:
            null,

          message:
            "Payment is waiting for admin verification.",

        });

      }


      // ===================================================
      // REJECTED
      // ===================================================

      if (
        request.status ===
        "Rejected"
      ) {

        return res.status(200).json({

          success:
            true,

          status:
            "Rejected",

          approvedBookingId:
            null,

          booking:
            null,

          adminNote:
            request.adminNote ||
            "",

          message:
            "Payment request was rejected.",

        });

      }


      // ===================================================
      // ACCEPTED
      // ===================================================

      if (
        request.status ===
          "Accepted" &&
        request.approvedBookingId
      ) {

        const booking =
          await Booking.findById(
            request.approvedBookingId
          ).lean();


        if (!booking) {

          return res.status(200).json({

            success:
              true,

            status:
              "Accepted",

            approvedBookingId:
              String(
                request.approvedBookingId
              ),

            booking:
              null,

            message:
              "Payment accepted. Booking is loading.",

          });

        }


        return res.status(200).json({

          success:
            true,

          status:
            "Accepted",

          approvedBookingId:
            String(
              request.approvedBookingId
            ),

          booking:
            booking,

          message:
            "Payment accepted and booking confirmed.",

        });

      }


      // ===================================================
      // OTHER STATUS
      // ===================================================

      return res.status(200).json({

        success:
          true,

        status:
          request.status,

        approvedBookingId:
          request.approvedBookingId
            ? String(
                request.approvedBookingId
              )
            : null,

        booking:
          null,

      });

    } catch (error) {

      console.error(
        "CUSTOMER PAYMENT STATUS ERROR:",
        error
      );

      return res.status(500).json({

        success:
          false,

        message:
          error.message ||
          "Failed to check payment status.",

      });

    }

  };


// =========================================================
// GET PENDING PAYMENT COUNT
// GET /api/payment-requests/pending-count
// =========================================================

const getPendingPaymentCount =
  async (
    req,
    res
  ) => {

    try {

      const count =
        await PaymentRequest.countDocuments({

          status:
            "Pending",

        });


      return res.status(200).json({

        success:
          true,

        count:
          count,

      });

    } catch (error) {

      console.error(
        "PENDING PAYMENT COUNT ERROR:",
        error
      );

      return res.status(500).json({

        success:
          false,

        message:
          error.message ||
          "Failed to get pending payment count.",

      });

    }

  };

  // =========================================================
// ACCEPT PAYMENT REQUEST
// PUT /api/payment-requests/:id/accept
// =========================================================

const acceptPaymentRequest = async (
  req,
  res
) => {

  try {

    const {
      adminNote,
    } = req.body || {};

    // -----------------------------------------------------
    // FIND PAYMENT REQUEST
    // -----------------------------------------------------

    const request =
      await PaymentRequest.findById(
        req.params.id
      );

    if (!request) {

      return res.status(404).json({

        success:
          false,

        message:
          "Payment request not found.",

      });

    }

    // -----------------------------------------------------
    // ONLY PENDING CAN BE ACCEPTED
    // -----------------------------------------------------

    if (
      request.status !==
      "Pending"
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          `Payment request is already ${request.status}.`,

      });

    }

    // -----------------------------------------------------
    // BOOKING DATA CHECK
    // -----------------------------------------------------

    if (!request.bookingData) {

      return res.status(400).json({

        success:
          false,

        message:
          "Booking data is missing from payment request.",

      });

    }

    // -----------------------------------------------------
    // COPY BOOKING DATA
    // -----------------------------------------------------

    const bookingData =
      JSON.parse(
        JSON.stringify(
          request.bookingData
        )
      );


    // =====================================================
    // CUSTOMER EMAIL
    // =====================================================

    const customerEmail =
      String(
        request.customerEmail ||
        bookingData?.customerEmail ||
        bookingData?.email ||
        bookingData?.userEmail ||
        bookingData?.passenger?.email ||
        bookingData?.passengers?.[0]?.email ||
        ""
      )
        .trim()
        .toLowerCase();


    if (!customerEmail) {

      return res.status(400).json({

        success:
          false,

        message:
          "Customer email is missing from booking.",

      });

    }


    // =====================================================
    // CUSTOMER USER ID
    // =====================================================

    const rawUserId =
      bookingData?.userId ||
      bookingData?.user?._id ||
      bookingData?.user?.id ||
      null;


    const customerUserId =
      rawUserId &&
      mongoose.Types.ObjectId.isValid(
        String(rawUserId)
      )
        ? new mongoose.Types.ObjectId(
            String(rawUserId)
          )
        : null;


    console.log(
      "===================================="
    );

    console.log(
      "ACCEPT PAYMENT - CUSTOMER DETAILS"
    );

    console.log(
      "EMAIL:",
      customerEmail
    );

    console.log(
      "USER ID:",
      customerUserId
    );

    console.log(
      "===================================="
    );


    // =====================================================
    // CUSTOMER WHATSAPP
    // =====================================================

    const whatsappNumber =
      String(
        request.whatsappNumber ||
        bookingData?.whatsappNumber ||
        bookingData?.phone ||
        bookingData?.mobile ||
        ""
      ).trim();


    // =====================================================
    // CREATE CONFIRMED BOOKING
    // =====================================================

    const fakeReq = {

      body: {

        ...bookingData,


        // -----------------------------------------------
        // IMPORTANT: CUSTOMER IDENTITY
        // -----------------------------------------------

        userId:
          customerUserId
            ? String(
                customerUserId
              )
            : bookingData?.userId ||
              null,


        userRole:
          String(
            bookingData?.userRole ||
            bookingData?.fareRole ||
            "customer"
          )
            .trim()
            .toLowerCase(),


        fareRole:
          bookingData?.fareRole ||
          bookingData?.userRole ||
          "customer",


        // -----------------------------------------------
        // CUSTOMER EMAIL
        // -----------------------------------------------

        customerEmail:
          customerEmail,

        email:
          customerEmail,


        // -----------------------------------------------
        // BAGGAGE
        // -----------------------------------------------

        baggage: {

          ...(bookingData?.baggage || {}),

          cabinBaggage:
            bookingData?.baggage
              ?.cabinBaggage ||

            bookingData?.baggage
              ?.cabin ||

            bookingData?.flight
              ?.cabinBaggage ||

            bookingData?.flight
              ?.baggage
              ?.cabin ||

            bookingData?.cabinBaggage ||

            "",


          checkinBaggage:
            bookingData?.baggage
              ?.checkinBaggage ||

            bookingData?.baggage
              ?.checkin ||

            bookingData?.baggage
              ?.weight ||

            bookingData?.flight
              ?.checkinBaggage ||

            bookingData?.flight
              ?.baggage
              ?.checkin ||

            bookingData?.checkinBaggage ||

            "",

        },


        // -----------------------------------------------
        // WHATSAPP
        // -----------------------------------------------

        whatsappNumber:
          whatsappNumber,


        // -----------------------------------------------
        // PAYMENT
        // -----------------------------------------------

        paymentVerified:
          true,

        paymentStatus:
          "Paid",

        bookingStatus:
          "Confirmed",

        paymentMethod:
          request.bankName,

        paymentId:
          request.paymentId,

      },


      // =================================================
      // IMPORTANT
      // ADMIN MUST NEVER BECOME BOOKING OWNER
      // =================================================

      user: {

        _id:
          customerUserId ||
          null,

        id:
          customerUserId ||
          null,

        role:
          String(
            bookingData?.userRole ||
            bookingData?.fareRole ||
            "customer"
          )
            .trim()
            .toLowerCase(),

        email:
          customerEmail,

      },

    };


    let createdBooking =
      null;


    // =====================================================
    // CREATE BOOKING
    // =====================================================

    const fakeRes = {

      status(code) {

        return {

          json(data) {

            if (
              code >= 200 &&
              code < 300
            ) {

              createdBooking =
                data?.booking ||
                data?.data ||
                data;

            } else {

              throw new Error(
                data?.message ||
                "Failed to create booking."
              );

            }

          },

        };

      },

    };


    await bookingController.createBooking(
      fakeReq,
      fakeRes
    );


    // =====================================================
    // CHECK BOOKING
    // =====================================================

    if (
      !createdBooking?._id
    ) {

      throw new Error(
        "Booking was not created."
      );

    }


    // =====================================================
    // VERY IMPORTANT
    // FORCE EMAIL + USER ID INTO FINAL BOOKING
    // =====================================================

    const bookingUpdate = {

      email:
        customerEmail,

      customerEmail:
        customerEmail,

    };


    if (customerUserId) {

      bookingUpdate.userId =
        customerUserId;

    }


    const finalBooking =
      await Booking.findByIdAndUpdate(

        createdBooking._id,

        {
          $set:
            bookingUpdate,
        },

        {
          new:
            true,
        }

      ).lean();


    if (!finalBooking) {

      throw new Error(
        "Booking was created but could not be linked to customer."
      );

    }


    createdBooking =
      finalBooking;


    console.log(
      "===================================="
    );

    console.log(
      "BOOKING SAVED SUCCESSFULLY"
    );

    console.log(
      "BOOKING ID:",
      createdBooking._id
    );

    console.log(
      "BOOKING EMAIL:",
      createdBooking.email
    );

    console.log(
      "BOOKING CUSTOMER EMAIL:",
      createdBooking.customerEmail
    );

    console.log(
      "BOOKING USER ID:",
      createdBooking.userId ||
      "NOT AVAILABLE"
    );

    console.log(
      "===================================="
    );


    // =====================================================
    // UPDATE PAYMENT REQUEST
    // =====================================================

    request.status =
      "Accepted";


    request.approvedBookingId =
      createdBooking._id;


    request.adminNote =
      adminNote || "";


    request.processedAt =
      new Date();


    request.adminActionToken =
      null;


    request.adminActionTokenExpiresAt =
      null;


    if (
      customerEmail &&
      !request.customerEmail
    ) {

      request.customerEmail =
        customerEmail;

    }


    if (
      whatsappNumber &&
      !request.whatsappNumber
    ) {

      request.whatsappNumber =
        whatsappNumber;

    }


    await request.save();


    // =====================================================
    // CUSTOMER TICKET EMAIL
    // =====================================================

    let customerEmailSent =
      false;


    try {

      await sendTicketEmail({

        to:
          customerEmail,

        booking:
          createdBooking,

      });


      customerEmailSent =
        true;


      console.log(
        "CUSTOMER TICKET EMAIL SENT:",
        customerEmail
      );


    } catch (emailError) {

      console.error(
        "CUSTOMER TICKET EMAIL ERROR:",
        emailError
      );

    }


    // =====================================================
    // ADMIN TICKET EMAIL
    // =====================================================

    let adminEmailSent =
      false;


    try {

      const adminEmail =
        await getAdminEmail();


      if (adminEmail) {

        await sendTicketEmail({

          to:
            adminEmail,

          booking:
            createdBooking,

        });


        adminEmailSent =
          true;


        console.log(
          "ADMIN TICKET EMAIL SENT:",
          adminEmail
        );

      }


    } catch (adminEmailError) {

      console.error(
        "ADMIN TICKET EMAIL ERROR:",
        adminEmailError
      );

    }


    // =====================================================
    // CUSTOMER WHATSAPP TICKET
    // =====================================================

    let whatsappSent =
      false;


    try {

      if (whatsappNumber) {

        await sendTicketWhatsApp({

          to:
            whatsappNumber,

          booking:
            createdBooking,

        });


        whatsappSent =
          true;


        console.log(
          "CUSTOMER TICKET WHATSAPP SENT:",
          whatsappNumber
        );

      }


    } catch (whatsappError) {

      console.error(
        "CUSTOMER TICKET WHATSAPP ERROR:",
        whatsappError
      );

    }


    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({

      success:
        true,

      message:
        "Payment accepted and booking confirmed successfully.",

      paymentRequest:
        request,

      booking:
        createdBooking,

      ticketStatus: {

        customerEmail:
          customerEmailSent
            ? "sent"
            : "failed",

        adminEmail:
          adminEmailSent
            ? "sent"
            : "failed",

        whatsapp:
          whatsappSent
            ? "sent"
            : "failed",

      },

    });


  } catch (error) {

    console.error(
      "ACCEPT PAYMENT ERROR:",
      error
    );


    return res.status(500).json({

      success:
        false,

      message:
        error.message ||
        "Failed to accept payment.",

    });

  }

};
// =========================================================
// REJECT PAYMENT REQUEST
// PUT /api/payment-requests/:id/reject
// =========================================================

const rejectPaymentRequest = async (
  req,
  res
) => {

  try {

    const {
      adminNote,
    } = req.body || {};


    // -----------------------------------------------------
    // FIND REQUEST
    // -----------------------------------------------------

    const request =
      await PaymentRequest.findById(
        req.params.id
      );


    if (!request) {

      return res.status(404).json({

        success:
          false,

        message:
          "Payment request not found.",

      });

    }


    // -----------------------------------------------------
    // ONLY PENDING CAN BE REJECTED
    // -----------------------------------------------------

    if (
      request.status !==
      "Pending"
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          `Payment request is already ${request.status}.`,

      });

    }


    // -----------------------------------------------------
    // UPDATE STATUS
    // -----------------------------------------------------

    request.status =
      "Rejected";


    request.adminNote =
      adminNote || "";


    request.processedAt =
      new Date();


    request.adminActionToken =
      null;


    request.adminActionTokenExpiresAt =
      null;


    await request.save();


    console.log(
      "PAYMENT REQUEST REJECTED:",
      request._id
    );


    // -----------------------------------------------------
    // RESPONSE
    // -----------------------------------------------------

    return res.status(200).json({

      success:
        true,

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

      success:
        false,

      message:
        error.message ||
        "Failed to reject payment.",

    });

  }

};


// =========================================================
// DELETE PAYMENT REQUEST
// DELETE /api/payment-requests/:id
//
// Pending request cannot be deleted.
// Accepted / Rejected request can be deleted.
// Confirmed booking will NOT be deleted.
// =========================================================

const deletePaymentRequest =
  async (
    req,
    res
  ) => {

    try {

      // ---------------------------------------------------
      // FIND REQUEST
      // ---------------------------------------------------

      const request =
        await PaymentRequest.findById(
          req.params.id
        );


      if (!request) {

        return res.status(404).json({

          success:
            false,

          message:
            "Payment request not found.",

        });

      }


      // ---------------------------------------------------
      // PENDING CANNOT BE DELETED
      // ---------------------------------------------------

      if (
        String(
          request.status
        ).toLowerCase() ===
        "pending"
      ) {

        return res.status(400).json({

          success:
            false,

          message:
            "Pending payment request cannot be deleted. Accept or reject it first.",

        });

      }


      // ---------------------------------------------------
      // DELETE PAYMENT REQUEST
      // ---------------------------------------------------

      await PaymentRequest.findByIdAndDelete(
        req.params.id
      );


      return res.status(200).json({

        success:
          true,

        message:
          "Payment request deleted successfully.",

      });


    } catch (error) {

      console.error(
        "DELETE PAYMENT REQUEST ERROR:",
        error
      );


      return res.status(500).json({

        success:
          false,

        message:
          error.message ||
          "Failed to delete payment request.",

      });

    }

  };


// =========================================================
// EMAIL ACCEPT PAYMENT REQUEST
// GET /api/payment-requests/:id/email-accept
// =========================================================

const emailAcceptPaymentRequest =
  async (
    req,
    res
  ) => {

    try {

      const request =
        await PaymentRequest.findById(
          req.params.id
        );


      if (!request) {

        return res.status(404).send(
          "Payment request not found."
        );

      }


      if (
        request.status !==
        "Pending"
      ) {

        return res.status(400).send(
          `Payment request is already ${request.status}.`
        );

      }


      return res.send(`

        <!DOCTYPE html>

        <html>

          <head>

            <meta
              charset="UTF-8"
            />

            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />

            <title>
              Saiyed Travels - Payment Approval
            </title>

          </head>


          <body
            style="
              margin:0;
              padding:40px 20px;
              background:#f5f7fb;
              font-family:Arial,sans-serif;
              text-align:center;
            "
          >

            <div
              style="
                max-width:600px;
                margin:auto;
                background:#ffffff;
                padding:35px;
                border-radius:16px;
                box-shadow:0 8px 30px rgba(0,0,0,0.08);
              "
            >

              <h2
                style="
                  margin-top:0;
                  color:#111827;
                "
              >
                Saiyed Travels
              </h2>


              <h3
                style="
                  color:#16a34a;
                "
              >
                Payment Approval
              </h3>


              <p
                style="
                  color:#4b5563;
                  line-height:1.6;
                "
              >
                Please use the Admin Dashboard
                to accept this payment request.
              </p>


              <p
                style="
                  color:#6b7280;
                  font-size:14px;
                "
              >
                Request ID:
                ${request._id}
              </p>

            </div>

          </body>

        </html>

      `);


    } catch (error) {

      console.error(
        "EMAIL ACCEPT ERROR:",
        error
      );


      return res.status(500).send(
        "Something went wrong."
      );

    }

  };


// =========================================================
// EMAIL REJECT PAYMENT REQUEST
// GET /api/payment-requests/:id/email-reject
// =========================================================

const emailRejectPaymentRequest =
  async (
    req,
    res
  ) => {

    try {

      const request =
        await PaymentRequest.findById(
          req.params.id
        );


      if (!request) {

        return res.status(404).send(
          "Payment request not found."
        );

      }


      if (
        request.status !==
        "Pending"
      ) {

        return res.status(400).send(
          `Payment request is already ${request.status}.`
        );

      }


      return res.send(`

        <!DOCTYPE html>

        <html>

          <head>

            <meta
              charset="UTF-8"
            />

            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />

            <title>
              Saiyed Travels - Payment Rejection
            </title>

          </head>


          <body
            style="
              margin:0;
              padding:40px 20px;
              background:#f5f7fb;
              font-family:Arial,sans-serif;
              text-align:center;
            "
          >

            <div
              style="
                max-width:600px;
                margin:auto;
                background:#ffffff;
                padding:35px;
                border-radius:16px;
                box-shadow:0 8px 30px rgba(0,0,0,0.08);
              "
            >

              <h2
                style="
                  margin-top:0;
                  color:#111827;
                "
              >
                Saiyed Travels
              </h2>


              <h3
                style="
                  color:#dc2626;
                "
              >
                Payment Rejection
              </h3>


              <p
                style="
                  color:#4b5563;
                  line-height:1.6;
                "
              >
                Please use the Admin Dashboard
                to reject this payment request.
              </p>


              <p
                style="
                  color:#6b7280;
                  font-size:14px;
                "
              >
                Request ID:
                ${request._id}
              </p>

            </div>

          </body>

        </html>

      `);


    } catch (error) {

      console.error(
        "EMAIL REJECT ERROR:",
        error
      );


      return res.status(500).send(
        "Something went wrong."
      );

    }

  };


// =========================================================
// EXPORTS
// =========================================================

// module.exports = {

//   createPaymentRequest,

//   getAllPaymentRequests,

//   getPaymentRequestById,

//   getCustomerPaymentStatus,

//   getPendingPaymentCount,

//   acceptPaymentRequest,

//   rejectPaymentRequest,

//   deletePaymentRequest,

//   emailAcceptPaymentRequest,

//   emailRejectPaymentRequest,

// };


module.exports = {
  createPaymentRequest,
  getAllPaymentRequests,
  getPaymentRequestById,
  getCustomerPaymentStatus,
  getPendingPaymentCount,
  acceptPaymentRequest,
  rejectPaymentRequest,
  deletePaymentRequest,
  emailAcceptPaymentRequest,
  emailRejectPaymentRequest,
};