// // const crypto = require("crypto");

// // const mongoose = require("mongoose");

// // const PaymentRequest = require("../models/PaymentRequest");
// // const Booking = require("../models/Booking");
// // const User = require("../models/User");

// // const bookingController = require("./bookingController");

// // // const {
// // //   sendAdminPaymentNotification,
// // //   sendTicketEmail,
// // // } = require("../services/emailService");

// // // const {
// // //   sendAdminPaymentNotification,
// // //   sendTicketEmail,
// // //   generateTicketPdf,
// // // } = require("../services/emailService");

// // const {
// //   sendAdminPaymentNotification,
// //   sendTicketEmail,
// // } = require("../services/emailService");

// // const {
// //   generateSuccessTicketPdf,
// // } = require("../services/successTicketPdfService");

// // const {
// //   sendTicketWhatsApp,
// // } = require("../services/whatsappService");

// // // =========================================================
// // // GET ADMIN EMAIL
// // // =========================================================

// // const getAdminEmail = async () => {
// //   try {

// //     // First priority: Render Environment Variable
// //     if (process.env.ADMIN_EMAIL) {

// //       return String(
// //         process.env.ADMIN_EMAIL
// //       )
// //         .trim()
// //         .toLowerCase();

// //     }

// //     // Second priority: EMAIL_USER
// //     if (process.env.EMAIL_USER) {

// //       return String(
// //         process.env.EMAIL_USER
// //       )
// //         .trim()
// //         .toLowerCase();

// //     }

// //     // Third priority: Database admin
// //     const admin =
// //       await User.findOne({
// //         role: "admin",
// //         isActive: true,
// //       }).sort({
// //         createdAt: -1,
// //       });

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

// //     return String(
// //       admin.email
// //     )
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
// // // POST /api/payment-requests
// // // =========================================================

// // const createPaymentRequest = async (
// //   req,
// //   res
// // ) => {

// //   try {

// //     // -----------------------------------------------------
// //     // FILE CHECK
// //     // -----------------------------------------------------

// //     // if (!req.file) {

// //     //   return res.status(400).json({

// //     //     success: false,

// //     //     message:
// //     //       "Payment screenshot is required.",

// //     //   });

// //     // }



// //   //   const screenshotUrl =
// //   // paymentRequest.screenshot
// //   //   ? `${backendUrl}${paymentRequest.screenshot}`
// //   //   : null;


// //     // -----------------------------------------------------
// //     // GET FORM DATA
// //     // -----------------------------------------------------

// //     const {
// //       bookingData,
// //       amount,
// //       bankName,
// //       paymentId,
// //       paymentDateTime,
// //       customerEmail,
// //       whatsappNumber,
// //     } = req.body;


// //     // -----------------------------------------------------
// //     // BASIC VALIDATION
// //     // -----------------------------------------------------

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


// //     // -----------------------------------------------------
// //     // PARSE BOOKING DATA
// //     // -----------------------------------------------------

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


// //     // -----------------------------------------------------
// //     // ORIGINAL USER ID + ROLE
// //     // -----------------------------------------------------

// //     const originalUserId =
// //       req.user?._id ||
// //       req.user?.id ||
// //       parsedBookingData?.userId ||
// //       parsedBookingData?.user?._id ||
// //       parsedBookingData?.user?.id ||
// //       null;


// //     const originalUserRole =
// //       String(
// //         req.user?.role ||
// //         parsedBookingData?.userRole ||
// //         parsedBookingData?.fareRole ||
// //         "customer"
// //       )
// //         .trim()
// //         .toLowerCase();


// //     // -----------------------------------------------------
// //     // USER ID REQUIRED
// //     // -----------------------------------------------------

// //     if (!originalUserId) {

// //       return res.status(401).json({

// //         success: false,

// //         message:
// //           "User identity missing. Please login again.",

// //       });

// //     }


// //     // -----------------------------------------------------
// //     // SAVE ORIGINAL USER ID
// //     // -----------------------------------------------------

// //     parsedBookingData.userId =
// //       String(originalUserId);


// //     parsedBookingData.userRole =
// //       originalUserRole;


// //     parsedBookingData.fareRole =
// //       parsedBookingData.fareRole ||
// //       originalUserRole;


// //     console.log(
// //       "========================================"
// //     );

// //     console.log(
// //       "PAYMENT REQUEST OWNER:",
// //       parsedBookingData.userId
// //     );

// //     console.log(
// //       "PAYMENT REQUEST ROLE:",
// //       parsedBookingData.userRole
// //     );

// //     console.log(
// //       "========================================"
// //     );


// //     // -----------------------------------------------------
// //     // CUSTOMER EMAIL FALLBACK
// //     // -----------------------------------------------------

// //     const finalCustomerEmail =
// //       String(
// //         customerEmail ||
// //         parsedBookingData?.customerEmail ||
// //         parsedBookingData?.email ||
// //         parsedBookingData?.userEmail ||
// //         ""
// //       )
// //         .trim()
// //         .toLowerCase();


// //     // -----------------------------------------------------
// //     // CUSTOMER EMAIL REQUIRED
// //     // -----------------------------------------------------

// //     if (!finalCustomerEmail) {

// //       return res.status(400).json({

// //         success: false,

// //         message:
// //           "Customer email is required. Please enter customer email before submitting payment.",

// //       });

// //     }


// //     // -----------------------------------------------------
// //     // WHATSAPP FALLBACK
// //     // -----------------------------------------------------

// //     const finalWhatsappNumber =
// //       String(
// //         whatsappNumber ||
// //         parsedBookingData?.whatsappNumber ||
// //         parsedBookingData?.phone ||
// //         parsedBookingData?.mobile ||
// //         ""
// //       ).trim();


// //     // -----------------------------------------------------
// //     // ADD CONTACT DATA INSIDE BOOKING DATA
// //     // -----------------------------------------------------

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


// //     // -----------------------------------------------------
// //     // PAYMENT DATE
// //     // -----------------------------------------------------

// //     const parsedPaymentDate =
// //       new Date(
// //         paymentDateTime
// //       );


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


// //     // -----------------------------------------------------
// //     // SCREENSHOT URL
// //     // -----------------------------------------------------

// //     // const screenshotPath =
// //     //   `/uploads/payment-screenshots/${req.file.filename}`;
// // const screenshot = req.file
// //   ? `/uploads/payment-screenshots/${req.file.filename}`
// //   : "";

// //     // =====================================================
// //     // CREATE PAYMENT REQUEST
// //     // =====================================================

// //     const request =
// //       await PaymentRequest.create({

// //         bookingData:
// //           parsedBookingData,

// //         amount:
// //           Number(amount),

// //         bankName:

// //           bankName,

// //         paymentId:
// //           String(
// //             paymentId
// //           ).trim(),

// //         // screenshot:
// //         //   screenshotPath,

// //         screenshot:
// //   screenshot,

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


// //     // =====================================================
// //     // CREATE ADMIN EMAIL ACTION TOKEN
// //     // =====================================================

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
// //         7 *
// //         24 *
// //         60 *
// //         60 *
// //         1000
// //       );


// //     request.adminActionToken =
// //       tokenHash;


// //     request.adminActionTokenExpiresAt =
// //       tokenExpiry;


// //     await request.save();


// //     // =====================================================
// //     // GET ADMIN EMAIL
// //     // =====================================================

// //     let adminEmail =
// //       null;


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


// //     // =====================================================
// //     // SEND ADMIN PAYMENT REQUEST EMAIL
// //     // =====================================================

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


// //     // =====================================================
// //     // RESPONSE
// //     // =====================================================

// //     return res.status(201).json({

// //       success:
// //         true,

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

// //       success:
// //         false,

// //       message:
// //         error.message ||
// //         "Failed to create payment request.",

// //     });

// //   }

// // };


// // // =========================================================
// // // GET ALL PAYMENT REQUESTS
// // // GET /api/payment-requests
// // // =========================================================

// // const getAllPaymentRequests =
// //   async (
// //     req,
// //     res
// //   ) => {

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

// //         success:
// //           true,

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

// //         success:
// //           false,

// //         message:
// //           error.message ||
// //           "Failed to get payment requests.",

// //       });

// //     }

// //   };


// // // =========================================================
// // // GET SINGLE PAYMENT REQUEST
// // // GET /api/payment-requests/:id
// // // =========================================================

// // const getPaymentRequestById =
// //   async (
// //     req,
// //     res
// //   ) => {

// //     try {

// //       const request =
// //         await PaymentRequest.findById(
// //           req.params.id
// //         ).populate(
// //           "approvedBookingId"
// //         );


// //       if (!request) {

// //         return res.status(404).json({

// //           success:
// //             false,

// //           message:
// //             "Payment request not found.",

// //         });

// //       }


// //       return res.status(200).json({

// //         success:
// //           true,

// //         request:
// //           request,

// //       });

// //     } catch (error) {

// //       console.error(
// //         "GET PAYMENT REQUEST ERROR:",
// //         error
// //       );

// //       return res.status(500).json({

// //         success:
// //           false,

// //         message:
// //           error.message ||
// //           "Failed to get payment request.",

// //       });

// //     }

// //   };


// // // =========================================================
// // // CUSTOMER PAYMENT STATUS
// // // GET /api/payment-requests/:id/status
// // // =========================================================

// // const getCustomerPaymentStatus =
// //   async (
// //     req,
// //     res
// //   ) => {

// //     try {

// //       const requestId =
// //         req.params.id;


// //       if (!requestId) {

// //         return res.status(400).json({

// //           success:
// //             false,

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

// //           success:
// //             false,

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

// //           success:
// //             false,

// //           message:
// //             "Payment request not found.",

// //         });

// //       }


// //       // ===================================================
// //       // PENDING
// //       // ===================================================

// //       if (
// //         request.status ===
// //         "Pending"
// //       ) {

// //         return res.status(200).json({

// //           success:
// //             true,

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


// //       // ===================================================
// //       // REJECTED
// //       // ===================================================

// //       if (
// //         request.status ===
// //         "Rejected"
// //       ) {

// //         return res.status(200).json({

// //           success:
// //             true,

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


// //       // ===================================================
// //       // ACCEPTED
// //       // ===================================================

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

// //             success:
// //               true,

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

// //           success:
// //             true,

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


// //       // ===================================================
// //       // OTHER STATUS
// //       // ===================================================

// //       return res.status(200).json({

// //         success:
// //           true,

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

// //         success:
// //           false,

// //         message:
// //           error.message ||
// //           "Failed to check payment status.",

// //       });

// //     }

// //   };


// // // =========================================================
// // // GET PENDING PAYMENT COUNT
// // // GET /api/payment-requests/pending-count
// // // =========================================================

// // const getPendingPaymentCount =
// //   async (
// //     req,
// //     res
// //   ) => {

// //     try {

// //       const count =
// //         await PaymentRequest.countDocuments({

// //           status:
// //             "Pending",

// //         });


// //       return res.status(200).json({

// //         success:
// //           true,

// //         count:
// //           count,

// //       });

// //     } catch (error) {

// //       console.error(
// //         "PENDING PAYMENT COUNT ERROR:",
// //         error
// //       );

// //       return res.status(500).json({

// //         success:
// //           false,

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

// // const acceptPaymentRequest = async (
// //   req,
// //   res
// // ) => {

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

// //         success:
// //           false,

// //         message:
// //           "Payment request not found.",

// //       });

// //     }

// //     // -----------------------------------------------------
// //     // ONLY PENDING CAN BE ACCEPTED
// //     // -----------------------------------------------------

// //     if (
// //       request.status !==
// //       "Pending"
// //     ) {

// //       return res.status(400).json({

// //         success:
// //           false,

// //         message:
// //           `Payment request is already ${request.status}.`,

// //       });

// //     }

// //     // -----------------------------------------------------
// //     // BOOKING DATA CHECK
// //     // -----------------------------------------------------

// //     if (!request.bookingData) {

// //       return res.status(400).json({

// //         success:
// //           false,

// //         message:
// //           "Booking data is missing from payment request.",

// //       });

// //     }

// //     // -----------------------------------------------------
// //     // COPY BOOKING DATA
// //     // -----------------------------------------------------

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
// //         bookingData?.customerEmail ||
// //         bookingData?.email ||
// //         bookingData?.userEmail ||
// //         bookingData?.passenger?.email ||
// //         bookingData?.passengers?.[0]?.email ||
// //         ""
// //       )
// //         .trim()
// //         .toLowerCase();


// //     if (!customerEmail) {

// //       return res.status(400).json({

// //         success:
// //           false,

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
// //       "===================================="
// //     );


// //     // =====================================================
// //     // CUSTOMER WHATSAPP
// //     // =====================================================

// //     const whatsappNumber =
// //       String(
// //         request.whatsappNumber ||
// //         bookingData?.whatsappNumber ||
// //         bookingData?.phone ||
// //         bookingData?.mobile ||
// //         ""
// //       ).trim();


// //     // =====================================================
// //     // CREATE CONFIRMED BOOKING
// //     // =====================================================

// //     const fakeReq = {

// //       body: {

// //         ...bookingData,


// //         // -----------------------------------------------
// //         // IMPORTANT: CUSTOMER IDENTITY
// //         // -----------------------------------------------

// //         userId:
// //           customerUserId
// //             ? String(
// //                 customerUserId
// //               )
// //             : bookingData?.userId ||
// //               null,


// //         userRole:
// //           String(
// //             bookingData?.userRole ||
// //             bookingData?.fareRole ||
// //             "customer"
// //           )
// //             .trim()
// //             .toLowerCase(),


// //         fareRole:
// //           bookingData?.fareRole ||
// //           bookingData?.userRole ||
// //           "customer",


// //         // -----------------------------------------------
// //         // CUSTOMER EMAIL
// //         // -----------------------------------------------

// //         customerEmail:
// //           customerEmail,

// //         email:
// //           customerEmail,


// //         // -----------------------------------------------
// //         // BAGGAGE
// //         // -----------------------------------------------

// //         baggage: {

// //           ...(bookingData?.baggage || {}),

// //           cabinBaggage:
// //             bookingData?.baggage
// //               ?.cabinBaggage ||

// //             bookingData?.baggage
// //               ?.cabin ||

// //             bookingData?.flight
// //               ?.cabinBaggage ||

// //             bookingData?.flight
// //               ?.baggage
// //               ?.cabin ||

// //             bookingData?.cabinBaggage ||

// //             "",


// //           checkinBaggage:
// //             bookingData?.baggage
// //               ?.checkinBaggage ||

// //             bookingData?.baggage
// //               ?.checkin ||

// //             bookingData?.baggage
// //               ?.weight ||

// //             bookingData?.flight
// //               ?.checkinBaggage ||

// //             bookingData?.flight
// //               ?.baggage
// //               ?.checkin ||

// //             bookingData?.checkinBaggage ||

// //             "",

// //         },


// //         // -----------------------------------------------
// //         // WHATSAPP
// //         // -----------------------------------------------

// //         whatsappNumber:
// //           whatsappNumber,


// //         // -----------------------------------------------
// //         // PAYMENT
// //         // -----------------------------------------------

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
// //       // IMPORTANT
// //       // ADMIN MUST NEVER BECOME BOOKING OWNER
// //       // =================================================

// //       user: {

// //         _id:
// //           customerUserId ||
// //           null,

// //         id:
// //           customerUserId ||
// //           null,

// //         role:
// //           String(
// //             bookingData?.userRole ||
// //             bookingData?.fareRole ||
// //             "customer"
// //           )
// //             .trim()
// //             .toLowerCase(),

// //         email:
// //           customerEmail,

// //       },

// //     };


// //     let createdBooking =
// //       null;


// //     // =====================================================
// //     // CREATE BOOKING
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
// //                 "Failed to create booking."
// //               );

// //             }

// //           },

// //         };

// //       },

// //     };


// //     await bookingController.createBooking(
// //       fakeReq,
// //       fakeRes
// //     );


// //     // =====================================================
// //     // CHECK BOOKING
// //     // =====================================================

// //     if (
// //       !createdBooking?._id
// //     ) {

// //       throw new Error(
// //         "Booking was not created."
// //       );

// //     }


// //     // =====================================================
// //     // VERY IMPORTANT
// //     // FORCE EMAIL + USER ID INTO FINAL BOOKING
// //     // =====================================================

// //     const bookingUpdate = {

// //       email:
// //         customerEmail,

// //       customerEmail:
// //         customerEmail,

// //     };


// //     if (customerUserId) {

// //       bookingUpdate.userId =
// //         customerUserId;

// //     }


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
// //       "BOOKING CUSTOMER EMAIL:",
// //       createdBooking.customerEmail
// //     );

// //     console.log(
// //       "BOOKING USER ID:",
// //       createdBooking.userId ||
// //       "NOT AVAILABLE"
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


// //     if (
// //       customerEmail &&
// //       !request.customerEmail
// //     ) {

// //       request.customerEmail =
// //         customerEmail;

// //     }


// //     if (
// //       whatsappNumber &&
// //       !request.whatsappNumber
// //     ) {

// //       request.whatsappNumber =
// //         whatsappNumber;

// //     }


// //     await request.save();











// // // =====================================================
// // // GENERATE TICKET PDF ONCE
// // // =====================================================

// // // =====================================================
// // // GENERATE TICKET PDF
// // // =====================================================

// // let ticketPdfBuffer = null;

// // try {
// //   ticketPdfBuffer = await generateSuccessTicketPdf(
// //     ticketBooking
// //   );

// //   if (
// //     !Buffer.isBuffer(ticketPdfBuffer) ||
// //     ticketPdfBuffer.length === 0
// //   ) {
// //     throw new Error("Ticket PDF is empty.");
// //   }

// //   console.log("TICKET PDF GENERATED SUCCESSFULLY");
// // } catch (pdfError) {
// //   console.error("TICKET PDF GENERATION ERROR:", pdfError);
// // }

// //   // =====================================================
// // // PREPARE CORRECT TICKET DATA
// // // =====================================================
// // const ticketBooking = {
// //   ...createdBooking,

// //   // Passenger details
// //   name:
// //     createdBooking.name ||
// //     createdBooking.passengerName ||
// //     bookingData.name ||
// //     bookingData.passengerName ||
// //     bookingData.fullName ||
// //     bookingData.passenger?.name ||
// //     bookingData.passenger?.fullName ||
// //     bookingData.passengers?.[0]?.name ||
// //     bookingData.passengers?.[0]?.fullName ||
// //     bookingData.passengerDetails?.[0]?.name ||
// //     bookingData.passengerDetails?.[0]?.fullName ||
// //     "Passenger",

// //   passengerName:
// //     createdBooking.passengerName ||
// //     bookingData.passengerName ||
// //     bookingData.name ||
// //     bookingData.fullName ||
// //     bookingData.passenger?.name ||
// //     bookingData.passenger?.fullName ||
// //     bookingData.passengers?.[0]?.name ||
// //     bookingData.passengers?.[0]?.fullName ||
// //     bookingData.passengerDetails?.[0]?.name ||
// //     bookingData.passengerDetails?.[0]?.fullName ||
// //     "Passenger",

// //   passenger:
// //     createdBooking.passenger ||
// //     bookingData.passenger ||
// //     {},

// //   passengers:
// //     createdBooking.passengers ||
// //     bookingData.passengers ||
// //     [],

// //   passengerDetails:
// //     createdBooking.passengerDetails ||
// //     bookingData.passengerDetails ||
// //     [],

// //   email: customerEmail,
// //   customerEmail,

// //   // Actual payment details
// //   amount: Number(request.amount),
// //   totalAmount: Number(request.amount),
// //   paymentMethod: request.bankName,
// //   paymentId: request.paymentId,

// //   // Flight information
// //   flight:
// //     createdBooking.flight ||
// //     bookingData.flight ||
// //     {},

// //   flightDetails:
// //     createdBooking.flightDetails ||
// //     bookingData.flightDetails ||
// //     {},

// //   selectedFlight:
// //     createdBooking.selectedFlight ||
// //     bookingData.selectedFlight ||
// //     {},

// //   flightData:
// //     createdBooking.flightData ||
// //     bookingData.flightData ||
// //     {},

// //   // Route
// //   from:
// //     createdBooking.from ||
// //     bookingData.from ||
// //     bookingData.source ||
// //     bookingData.origin ||
// //     bookingData.flight?.from ||
// //     bookingData.flightDetails?.from ||
// //     bookingData.selectedFlight?.from ||
// //     bookingData.flightData?.from ||
// //     "",

// //   to:
// //     createdBooking.to ||
// //     bookingData.to ||
// //     bookingData.destination ||
// //     bookingData.flight?.to ||
// //     bookingData.flightDetails?.to ||
// //     bookingData.selectedFlight?.to ||
// //     bookingData.flightData?.to ||
// //     "",

// //   // Departure
// //   departureDate:
// //     createdBooking.departureDate ||
// //     bookingData.departureDate ||
// //     bookingData.travelDate ||
// //     bookingData.flight?.departureDate ||
// //     bookingData.flightDetails?.departureDate ||
// //     bookingData.selectedFlight?.departureDate ||
// //     bookingData.flightData?.departureDate ||
// //     "",

// //   departureTime:
// //     createdBooking.departureTime ||
// //     bookingData.departureTime ||
// //     bookingData.flight?.departureTime ||
// //     bookingData.flightDetails?.departureTime ||
// //     bookingData.selectedFlight?.departureTime ||
// //     bookingData.flightData?.departureTime ||
// //     "",

// //   // Arrival
// //   arrivalDate:
// //     createdBooking.arrivalDate ||
// //     bookingData.arrivalDate ||
// //     bookingData.flight?.arrivalDate ||
// //     bookingData.flightDetails?.arrivalDate ||
// //     bookingData.selectedFlight?.arrivalDate ||
// //     bookingData.flightData?.arrivalDate ||
// //     "",

// //   arrivalTime:
// //     createdBooking.arrivalTime ||
// //     bookingData.arrivalTime ||
// //     bookingData.flight?.arrivalTime ||
// //     bookingData.flightDetails?.arrivalTime ||
// //     bookingData.selectedFlight?.arrivalTime ||
// //     bookingData.flightData?.arrivalTime ||
// //     "",

// //   // Baggage
// //   baggage:
// //     createdBooking.baggage ||
// //     bookingData.baggage ||
// //     bookingData.flight?.baggage ||
// //     bookingData.flightDetails?.baggage ||
// //     bookingData.selectedFlight?.baggage ||
// //     bookingData.flightData?.baggage ||
// //     {},

// //   cabinBaggage:
// //     createdBooking.cabinBaggage ||
// //     bookingData.cabinBaggage ||
// //     "",

// //   checkinBaggage:
// //     createdBooking.checkinBaggage ||
// //     bookingData.checkinBaggage ||
// //     "",
// // };
// // // const ticketBooking = {
// // //   ...createdBooking,

// // //   // Customer details
// // //   name:
// // //     createdBooking.name ||
// // //     bookingData.name ||
// // //     bookingData.passengerName ||
// // //     "Passenger",

// // //   email: customerEmail,
// // //   customerEmail: customerEmail,

// // //   // Actual payment details from PaymentRequest
// // //   amount: Number(request.amount),
// // //   totalAmount: Number(request.amount),

// // //   paymentMethod: request.bankName,
// // //   paymentId: request.paymentId,

// // //   // Preserve original flight data
// // //   flight:
// // //     createdBooking.flight ||
// // //     bookingData.flight,

// // //   flightDetails:
// // //     createdBooking.flightDetails ||
// // //     bookingData.flightDetails,

// // //   selectedFlight:
// // //     createdBooking.selectedFlight ||
// // //     bookingData.selectedFlight,

// // //   flightData:
// // //     createdBooking.flightData ||
// // //     bookingData.flightData,

// // //   // Preserve route and date information
// // //   from:
// // //     createdBooking.from ||
// // //     bookingData.from,

// // //   to:
// // //     createdBooking.to ||
// // //     bookingData.to,

// // //   departureDate:
// // //     createdBooking.departureDate ||
// // //     bookingData.departureDate,

// // //   departureTime:
// // //     createdBooking.departureTime ||
// // //     bookingData.departureTime,
// // // };

// // console.log("TICKET DATA:", {
// //   bookingId: ticketBooking._id,
// //   from: ticketBooking.from,
// //   to: ticketBooking.to,
// //   amount: ticketBooking.amount,
// //   paymentMethod: ticketBooking.paymentMethod,
// //   paymentId: ticketBooking.paymentId,
// // });

// // // Generate PDF once
// // ticketPdfBuffer = await generateTicketPdf(ticketBooking);

// // console.log("TICKET PDF GENERATED SUCCESSFULLY");

// //   console.log(
// //     "TICKET PDF GENERATED SUCCESSFULLY"
// //   );

// // } catch (pdfError) {
// //   console.error(
// //     "TICKET PDF GENERATION ERROR:",
// //     pdfError
// //   );
// // }































// //     // =====================================================
// //     // CUSTOMER TICKET EMAIL
// //     // =====================================================

// //     let customerEmailSent =
// //       false;


// //     try {

// //       // await sendTicketEmail({

// //       //   to:
// //       //     customerEmail,

// //       //   booking:
// //       //     createdBooking,

// //       // });



// //       if (!ticketPdfBuffer) {
// //   throw new Error(
// //     "Ticket PDF could not be generated."
// //   );
// // }

// // await sendTicketEmail({

// //   to: customerEmail,

// //   booking: createdBooking,

// //   pdfBuffer: ticketPdfBuffer,

// // });


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

// //         // await sendTicketEmail({

// //         //   to:
// //         //     adminEmail,

// //         //   booking:
// //         //     createdBooking,

// //         // });



// //         if (!ticketPdfBuffer) {
// //   throw new Error(
// //     "Ticket PDF could not be generated."
// //   );
// // }

// // await sendTicketEmail({

// //   to: adminEmail,

// //   booking: createdBooking,

// //   pdfBuffer: ticketPdfBuffer,

// // });


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
// // if (!ticketPdfBuffer || !Buffer.isBuffer(ticketPdfBuffer)) {
// //   throw new Error("Ticket PDF could not be generated.");
// // }

// // await sendTicketWhatsApp({
// //   to: whatsappNumber,
// //   booking: ticketBooking,
// //   pdfBuffer: ticketPdfBuffer,
// // });


// //     let whatsappSent =
// //       false;


// //     try {

// //       if (whatsappNumber) {

// //         // await sendTicketWhatsApp({

// //         //   to:
// //         //     whatsappNumber,

// //         //   booking:
// //         //     createdBooking,

// //         // });  
// // await sendTicketWhatsApp({
// //   to: whatsappNumber,
// //   booking: ticketBooking,
// //   pdfBuffer: ticketPdfBuffer,
// // });

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

// // const rejectPaymentRequest = async (
// //   req,
// //   res
// // ) => {

// //   try {

// //     const {
// //       adminNote,
// //     } = req.body || {};


// //     // -----------------------------------------------------
// //     // FIND REQUEST
// //     // -----------------------------------------------------

// //     const request =
// //       await PaymentRequest.findById(
// //         req.params.id
// //       );


// //     if (!request) {

// //       return res.status(404).json({

// //         success:
// //           false,

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

// //         success:
// //           false,

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


// //     console.log(
// //       "PAYMENT REQUEST REJECTED:",
// //       request._id
// //     );


// //     // -----------------------------------------------------
// //     // RESPONSE
// //     // -----------------------------------------------------

// //     return res.status(200).json({

// //       success:
// //         true,

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

// //       success:
// //         false,

// //       message:
// //         error.message ||
// //         "Failed to reject payment.",

// //     });

// //   }

// // };


// // // =========================================================
// // // DELETE PAYMENT REQUEST
// // // DELETE /api/payment-requests/:id
// // //
// // // Pending request cannot be deleted.
// // // Accepted / Rejected request can be deleted.
// // // Confirmed booking will NOT be deleted.
// // // =========================================================

// // const deletePaymentRequest =
// //   async (
// //     req,
// //     res
// //   ) => {

// //     try {

// //       // ---------------------------------------------------
// //       // FIND REQUEST
// //       // ---------------------------------------------------

// //       const request =
// //         await PaymentRequest.findById(
// //           req.params.id
// //         );


// //       if (!request) {

// //         return res.status(404).json({

// //           success:
// //             false,

// //           message:
// //             "Payment request not found.",

// //         });

// //       }


// //       // ---------------------------------------------------
// //       // PENDING CANNOT BE DELETED
// //       // ---------------------------------------------------

// //       if (
// //         String(
// //           request.status
// //         ).toLowerCase() ===
// //         "pending"
// //       ) {

// //         return res.status(400).json({

// //           success:
// //             false,

// //           message:
// //             "Pending payment request cannot be deleted. Accept or reject it first.",

// //         });

// //       }


// //       // ---------------------------------------------------
// //       // DELETE PAYMENT REQUEST
// //       // ---------------------------------------------------

// //       await PaymentRequest.findByIdAndDelete(
// //         req.params.id
// //       );


// //       return res.status(200).json({

// //         success:
// //           true,

// //         message:
// //           "Payment request deleted successfully.",

// //       });


// //     } catch (error) {

// //       console.error(
// //         "DELETE PAYMENT REQUEST ERROR:",
// //         error
// //       );


// //       return res.status(500).json({

// //         success:
// //           false,

// //         message:
// //           error.message ||
// //           "Failed to delete payment request.",

// //       });

// //     }

// //   };


// // // =========================================================
// // // EMAIL ACCEPT PAYMENT REQUEST
// // // GET /api/payment-requests/:id/email-accept
// // // =========================================================

// // const emailAcceptPaymentRequest =
// //   async (
// //     req,
// //     res
// //   ) => {

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

// //         <!DOCTYPE html>

// //         <html>

// //           <head>

// //             <meta
// //               charset="UTF-8"
// //             />

// //             <meta
// //               name="viewport"
// //               content="width=device-width, initial-scale=1.0"
// //             />

// //             <title>
// //               Saiyed Travels - Payment Approval
// //             </title>

// //           </head>


// //           <body
// //             style="
// //               margin:0;
// //               padding:40px 20px;
// //               background:#f5f7fb;
// //               font-family:Arial,sans-serif;
// //               text-align:center;
// //             "
// //           >

// //             <div
// //               style="
// //                 max-width:600px;
// //                 margin:auto;
// //                 background:#ffffff;
// //                 padding:35px;
// //                 border-radius:16px;
// //                 box-shadow:0 8px 30px rgba(0,0,0,0.08);
// //               "
// //             >

// //               <h2
// //                 style="
// //                   margin-top:0;
// //                   color:#111827;
// //                 "
// //               >
// //                 Saiyed Travels
// //               </h2>


// //               <h3
// //                 style="
// //                   color:#16a34a;
// //                 "
// //               >
// //                 Payment Approval
// //               </h3>


// //               <p
// //                 style="
// //                   color:#4b5563;
// //                   line-height:1.6;
// //                 "
// //               >
// //                 Please use the Admin Dashboard
// //                 to accept this payment request.
// //               </p>


// //               <p
// //                 style="
// //                   color:#6b7280;
// //                   font-size:14px;
// //                 "
// //               >
// //                 Request ID:
// //                 ${request._id}
// //               </p>

// //             </div>

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


// // const emailRejectPaymentRequest =
// //   async (
// //     req,
// //     res
// //   ) => {

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

// //         <!DOCTYPE html>

// //         <html>

// //           <head>

// //             <meta
// //               charset="UTF-8"
// //             />

// //             <meta
// //               name="viewport"
// //               content="width=device-width, initial-scale=1.0"
// //             />

// //             <title>
// //               Saiyed Travels - Payment Rejection
// //             </title>

// //           </head>


// //           <body
// //             style="
// //               margin:0;
// //               padding:40px 20px;
// //               background:#f5f7fb;
// //               font-family:Arial,sans-serif;
// //               text-align:center;
// //             "
// //           >

// //             <div
// //               style="
// //                 max-width:600px;
// //                 margin:auto;
// //                 background:#ffffff;
// //                 padding:35px;
// //                 border-radius:16px;
// //                 box-shadow:0 8px 30px rgba(0,0,0,0.08);
// //               "
// //             >

// //               <h2
// //                 style="
// //                   margin-top:0;
// //                   color:#111827;
// //                 "
// //               >
// //                 Saiyed Travels
// //               </h2>


// //               <h3
// //                 style="
// //                   color:#dc2626;
// //                 "
// //               >
// //                 Payment Rejection
// //               </h3>


// //               <p
// //                 style="
// //                   color:#4b5563;
// //                   line-height:1.6;
// //                 "
// //               >
// //                 Please use the Admin Dashboard
// //                 to reject this payment request.
// //               </p>


// //               <p
// //                 style="
// //                   color:#6b7280;
// //                   font-size:14px;
// //                 "
// //               >
// //                 Request ID:
// //                 ${request._id}
// //               </p>

// //             </div>

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













































































































// const crypto = require("crypto");
// const mongoose = require("mongoose");
// const PaymentRequest = require("../models/PaymentRequest");
// const Booking = require("../models/Booking");
// const User = require("../models/User");
// const bookingController = require("./bookingController");

// const {
//   sendAdminPaymentNotification,
//   sendTicketEmail,
// } = require("../services/emailService");

// const {
//   generateSuccessTicketPdf,
// } = require("../services/successTicketPdfService");

// const {
//   sendTicketWhatsApp,
// } = require("../services/whatsappService");

// const getAdminEmail = async () => {
//   if (process.env.ADMIN_EMAIL) {
//     return String(process.env.ADMIN_EMAIL).trim().toLowerCase();
//   }

//   if (process.env.EMAIL_USER) {
//     return String(process.env.EMAIL_USER).trim().toLowerCase();
//   }

//   const admin = await User.findOne({
//     role: "admin",
//     isActive: true,
//   }).sort({ createdAt: -1 });

//   if (!admin?.email) {
//     throw new Error("Active admin email not found.");
//   }

//   return String(admin.email).trim().toLowerCase();
// };

// const createPaymentRequest = async (req, res) => {
//   try {
//     const {
//       bookingData,
//       amount,
//       bankName,
//       paymentId,
//       paymentDateTime,
//       customerEmail,
//       whatsappNumber,
//     } = req.body;

//     if (!bookingData) {
//       return res.status(400).json({
//         success: false,
//         message: "Booking data is required.",
//       });
//     }

//     if (!amount || Number(amount) <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "A valid payment amount is required.",
//       });
//     }

//     if (
//       bankName !== "ICICI Bank" &&
//       bankName !== "Bank of Baroda"
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please select a valid bank.",
//       });
//     }

//     if (!paymentId) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment ID / UTR is required.",
//       });
//     }

//     const normalizedEmail = String(
//       customerEmail || bookingData.customerEmail || bookingData.email || ""
//     ).trim().toLowerCase();

//     const normalizedWhatsApp = String(
//       whatsappNumber || bookingData.whatsappNumber || bookingData.phone || ""
//     ).trim();

//     const paymentRequest = await PaymentRequest.create({
//       bookingData,
//       amount: Number(amount),
//       bankName,
//       paymentId: String(paymentId).trim(),
//       paymentDateTime: paymentDateTime || new Date(),
//       customerEmail: normalizedEmail,
//       whatsappNumber: normalizedWhatsApp,
//       status: "Pending",
//     });

//     try {
//       const adminEmail = await getAdminEmail();

//       await sendAdminPaymentNotification({
//         to: adminEmail,
//         paymentRequest,
//       });
//     } catch (emailError) {
//       console.error("PAYMENT REQUEST NOTIFICATION ERROR:", emailError);
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Payment request submitted successfully.",
//       paymentRequest,
//     });
//   } catch (error) {
//     console.error("CREATE PAYMENT REQUEST ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to create payment request.",
//     });
//   }
// };

// const getAllPaymentRequests = async (req, res) => {
//   try {
//     const requests = await PaymentRequest.find()
//       .sort({ createdAt: -1 })
//       .lean();

//     return res.status(200).json({
//       success: true,
//       count: requests.length,
//       paymentRequests: requests,
//     });
//   } catch (error) {
//     console.error("GET PAYMENT REQUESTS ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch payment requests.",
//     });
//   }
// };

// const getPaymentRequestById = async (req, res) => {
//   try {
//     const request = await PaymentRequest.findById(req.params.id).lean();

//     if (!request) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment request not found.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       paymentRequest: request,
//     });
//   } catch (error) {
//     console.error("GET PAYMENT REQUEST ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch payment request.",
//     });
//   }
// };

// const getCustomerPaymentStatus = async (req, res) => {
//   try {
//     const email = String(
//       req.query.email || req.body?.email || ""
//     ).trim().toLowerCase();

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Customer email is required.",
//       });
//     }

//     const requests = await PaymentRequest.find({
//       customerEmail: email,
//     })
//       .sort({ createdAt: -1 })
//       .lean();

//     return res.status(200).json({
//       success: true,
//       paymentRequests: requests,
//     });
//   } catch (error) {
//     console.error("CUSTOMER PAYMENT STATUS ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch payment status.",
//     });
//   }
// };

// const getPendingPaymentCount = async (req, res) => {
//   try {
//     const count = await PaymentRequest.countDocuments({
//       status: "Pending",
//     });

//     return res.status(200).json({
//       success: true,
//       count,
//     });
//   } catch (error) {
//     console.error("PENDING PAYMENT COUNT ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch pending payment count.",
//     });
//   }
// };

// const acceptPaymentRequest = async (req, res) => {
//   try {
//     const { adminNote } = req.body || {};

//     const request = await PaymentRequest.findById(req.params.id);

//     if (!request) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment request not found.",
//       });
//     }

//     if (request.status !== "Pending") {
//       return res.status(400).json({
//         success: false,
//         message: `Payment request is already ${request.status}.`,
//       });
//     }

//     if (!request.bookingData) {
//       return res.status(400).json({
//         success: false,
//         message: "Booking data is missing.",
//       });
//     }

//     const bookingData =
//       typeof request.bookingData.toObject === "function"
//         ? request.bookingData.toObject()
//         : request.bookingData;

//     const customerEmail = String(
//       request.customerEmail ||
//         bookingData.customerEmail ||
//         bookingData.email ||
//         bookingData.passenger?.email ||
//         ""
//     )
//       .trim()
//       .toLowerCase();

//     const whatsappNumber = String(
//       request.whatsappNumber ||
//         bookingData.whatsappNumber ||
//         bookingData.phone ||
//         bookingData.passenger?.phone ||
//         ""
//     ).trim();

//     const existingBookingId =
//       request.approvedBookingId || bookingData.bookingId || null;

//     let createdBooking = null;

//     if (existingBookingId) {
//       createdBooking = await Booking.findById(existingBookingId);
//     }

//     if (!createdBooking) {
//       const bookingPayload = {
//         ...bookingData,
//         email: customerEmail || bookingData.email || "",
//         customerEmail,
//         phone: whatsappNumber || bookingData.phone || "",
//         amount: Number(request.amount),
//         totalAmount: Number(request.amount),
//         paymentMethod: request.bankName,
//         paymentId: request.paymentId,
//         paymentStatus: "Paid",
//         status: "Confirmed",
//       };

//       delete bookingPayload._id;
//       delete bookingPayload.__v;

//       if (bookingController && typeof bookingController.createBooking === "function") {
//         const bookingResult = await new Promise((resolve, reject) => {
//           const fakeRes = {
//             statusCode: 200,
//             status(code) {
//               this.statusCode = code;
//               return this;
//             },
//             json(body) {
//               if (this.statusCode >= 400 || body?.success === false) {
//                 return reject(
//                   new Error(body?.message || "Failed to create booking.")
//                 );
//               }
//               resolve(body);
//               return this;
//             },
//           };

//           Promise.resolve(
//             bookingController.createBooking(
//               {
//                 body: bookingPayload,
//                 user: req.user,
//               },
//               fakeRes
//             )
//           ).catch(reject);
//         });

//         createdBooking =
//           bookingResult?.booking ||
//           bookingResult?.data?.booking ||
//           null;
//       }

//       if (!createdBooking) {
//         createdBooking = await Booking.create(bookingPayload);
//       }
//     } else {
//       createdBooking.paymentStatus = "Paid";
//       createdBooking.status = "Confirmed";
//       createdBooking.amount = Number(request.amount);
//       createdBooking.totalAmount = Number(request.amount);
//       createdBooking.paymentMethod = request.bankName;
//       createdBooking.paymentId = request.paymentId;

//       if (customerEmail) {
//         createdBooking.email = customerEmail;
//         createdBooking.customerEmail = customerEmail;
//       }

//       if (whatsappNumber) {
//         createdBooking.phone = whatsappNumber;
//         createdBooking.whatsappNumber = whatsappNumber;
//       }

//       await createdBooking.save();
//     }

//     const ticketBooking = {
//       ...(createdBooking.toObject
//         ? createdBooking.toObject()
//         : createdBooking),

//       name:
//         createdBooking.name ||
//         createdBooking.passengerName ||
//         bookingData.name ||
//         bookingData.passengerName ||
//         bookingData.fullName ||
//         bookingData.passenger?.name ||
//         bookingData.passenger?.fullName ||
//         bookingData.passengers?.[0]?.name ||
//         bookingData.passengers?.[0]?.fullName ||
//         bookingData.passengerDetails?.[0]?.name ||
//         bookingData.passengerDetails?.[0]?.fullName ||
//         "Passenger",

//       passengerName:
//         createdBooking.passengerName ||
//         bookingData.passengerName ||
//         bookingData.name ||
//         bookingData.fullName ||
//         bookingData.passenger?.name ||
//         bookingData.passengers?.[0]?.name ||
//         "Passenger",

//       passenger:
//         createdBooking.passenger ||
//         bookingData.passenger ||
//         {},

//       passengers:
//         createdBooking.passengers ||
//         bookingData.passengers ||
//         [],

//       passengerDetails:
//         createdBooking.passengerDetails ||
//         bookingData.passengerDetails ||
//         [],

//       email: customerEmail,
//       customerEmail,
//       phone: whatsappNumber,
//       whatsappNumber,
//       amount: Number(request.amount),
//       totalAmount: Number(request.amount),
//       paymentMethod: request.bankName,
//       paymentId: request.paymentId,

//       flight:
//         createdBooking.flight ||
//         bookingData.flight ||
//         {},

//       flightDetails:
//         createdBooking.flightDetails ||
//         bookingData.flightDetails ||
//         {},

//       selectedFlight:
//         createdBooking.selectedFlight ||
//         bookingData.selectedFlight ||
//         {},

//       flightData:
//         createdBooking.flightData ||
//         bookingData.flightData ||
//         {},

//       from:
//         createdBooking.from ||
//         bookingData.from ||
//         bookingData.source ||
//         bookingData.origin ||
//         bookingData.flight?.from ||
//         bookingData.flightDetails?.from ||
//         bookingData.selectedFlight?.from ||
//         bookingData.flightData?.from ||
//         "",

//       to:
//         createdBooking.to ||
//         bookingData.to ||
//         bookingData.destination ||
//         bookingData.flight?.to ||
//         bookingData.flightDetails?.to ||
//         bookingData.selectedFlight?.to ||
//         bookingData.flightData?.to ||
//         "",

//       departureDate:
//         createdBooking.departureDate ||
//         bookingData.departureDate ||
//         bookingData.travelDate ||
//         bookingData.flight?.departureDate ||
//         bookingData.flightDetails?.departureDate ||
//         bookingData.selectedFlight?.departureDate ||
//         bookingData.flightData?.departureDate ||
//         "",

//       departureTime:
//         createdBooking.departureTime ||
//         bookingData.departureTime ||
//         bookingData.flight?.departureTime ||
//         bookingData.flightDetails?.departureTime ||
//         bookingData.selectedFlight?.departureTime ||
//         bookingData.flightData?.departureTime ||
//         "",

//       arrivalDate:
//         createdBooking.arrivalDate ||
//         bookingData.arrivalDate ||
//         bookingData.flight?.arrivalDate ||
//         bookingData.flightDetails?.arrivalDate ||
//         bookingData.selectedFlight?.arrivalDate ||
//         bookingData.flightData?.arrivalDate ||
//         "",

//       arrivalTime:
//         createdBooking.arrivalTime ||
//         bookingData.arrivalTime ||
//         bookingData.flight?.arrivalTime ||
//         bookingData.flightDetails?.arrivalTime ||
//         bookingData.selectedFlight?.arrivalTime ||
//         bookingData.flightData?.arrivalTime ||
//         "",

//       baggage:
//         createdBooking.baggage ||
//         bookingData.baggage ||
//         bookingData.flight?.baggage ||
//         bookingData.flightDetails?.baggage ||
//         bookingData.selectedFlight?.baggage ||
//         bookingData.flightData?.baggage ||
//         {},

//       cabinBaggage:
//         createdBooking.cabinBaggage ||
//         bookingData.cabinBaggage ||
//         "",

//       checkinBaggage:
//         createdBooking.checkinBaggage ||
//         bookingData.checkinBaggage ||
//         "",
//     };

//     const ticketPdfBuffer =
//       await generateSuccessTicketPdf(ticketBooking);

//     if (
//       !Buffer.isBuffer(ticketPdfBuffer) ||
//       ticketPdfBuffer.length === 0
//     ) {
//       throw new Error("Ticket PDF could not be generated.");
//     }

//     request.status = "Accepted";
//     request.approvedBookingId = createdBooking._id;
//     request.adminNote = adminNote || "";
//     request.processedAt = new Date();
//     request.adminActionToken = null;
//     request.adminActionTokenExpiresAt = null;

//     if (customerEmail) {
//       request.customerEmail = customerEmail;
//     }

//     if (whatsappNumber) {
//       request.whatsappNumber = whatsappNumber;
//     }

//     await request.save();

//     let customerEmailSent = false;
//     let adminEmailSent = false;
//     let whatsappSent = false;

//     if (customerEmail) {
//       try {
//         await sendTicketEmail({
//           to: customerEmail,
//           booking: ticketBooking,
//           pdfBuffer: ticketPdfBuffer,
//         });

//         customerEmailSent = true;
//       } catch (error) {
//         console.error("CUSTOMER TICKET EMAIL ERROR:", error);
//       }
//     }

//     try {
//       const adminEmail = await getAdminEmail();

//       if (adminEmail) {
//         await sendTicketEmail({
//           to: adminEmail,
//           booking: ticketBooking,
//           pdfBuffer: ticketPdfBuffer,
//         });

//         adminEmailSent = true;
//       }
//     } catch (error) {
//       console.error("ADMIN TICKET EMAIL ERROR:", error);
//     }

//     if (whatsappNumber) {
//       try {
//         await sendTicketWhatsApp({
//           to: whatsappNumber,
//           booking: ticketBooking,
//           pdfBuffer: ticketPdfBuffer,
//         });

//         whatsappSent = true;
//       } catch (error) {
//         console.error("CUSTOMER TICKET WHATSAPP ERROR:", error);
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Payment accepted and booking confirmed successfully.",
//       paymentRequest: request,
//       booking: createdBooking,
//       ticketStatus: {
//         customerEmail: customerEmailSent ? "sent" : "failed",
//         adminEmail: adminEmailSent ? "sent" : "failed",
//         whatsapp: whatsappSent ? "sent" : "failed",
//       },
//     });
//   } catch (error) {
//     console.error("ACCEPT PAYMENT ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to accept payment.",
//     });
//   }
// };

// const rejectPaymentRequest = async (req, res) => {
//   try {
//     const { adminNote } = req.body || {};
//     const request = await PaymentRequest.findById(req.params.id);

//     if (!request) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment request not found.",
//       });
//     }

//     if (request.status !== "Pending") {
//       return res.status(400).json({
//         success: false,
//         message: `Payment request is already ${request.status}.`,
//       });
//     }

//     request.status = "Rejected";
//     request.adminNote = adminNote || "";
//     request.processedAt = new Date();
//     request.adminActionToken = null;
//     request.adminActionTokenExpiresAt = null;

//     await request.save();

//     return res.status(200).json({
//       success: true,
//       message: "Payment request rejected.",
//       paymentRequest: request,
//     });
//   } catch (error) {
//     console.error("REJECT PAYMENT REQUEST ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to reject payment request.",
//     });
//   }
// };

// const deletePaymentRequest = async (req, res) => {
//   try {
//     const request = await PaymentRequest.findByIdAndDelete(req.params.id);

//     if (!request) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment request not found.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Payment request deleted.",
//     });
//   } catch (error) {
//     console.error("DELETE PAYMENT REQUEST ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to delete payment request.",
//     });
//   }
// };

// const emailAcceptPaymentRequest = async (req, res) => {
//   try {
//     const request = await PaymentRequest.findById(req.params.id);

//     if (!request) {
//       return res.status(404).send("Payment request not found.");
//     }

//     if (request.status !== "Pending") {
//       return res.status(400).send("Payment request has already been processed.");
//     }

//     request.adminActionToken = crypto.randomBytes(32).toString("hex");
//     request.adminActionTokenExpiresAt =
//       Date.now() + 15 * 60 * 1000;

//     await request.save();

//     const frontendUrl = String(
//       process.env.FRONTEND_URL || "https://saiyed-travel.vercel.app"
//     ).replace(/\/+$/, "");

//     return res.status(200).send(`
//       <!doctype html>
//       <html lang="en">
//         <head>
//           <meta charset="utf-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1">
//           <title>Accept Payment Request</title>
//         </head>
//         <body style="font-family:Arial,sans-serif;padding:32px;color:#111827">
//           <h2>Payment request action</h2>
//           <p>Open the admin dashboard to review and approve this payment request.</p>
//           <p><a href="${frontendUrl}/admin">Open Admin Dashboard</a></p>
//           <p>Request ID: ${request._id}</p>
//         </body>
//       </html>
//     `);
//   } catch (error) {
//     console.error("EMAIL ACCEPT PAYMENT ERROR:", error);

//     return res.status(500).send("Something went wrong.");
//   }
// };

// const emailRejectPaymentRequest = async (req, res) => {
//   try {
//     const request = await PaymentRequest.findById(req.params.id);

//     if (!request) {
//       return res.status(404).send("Payment request not found.");
//     }

//     if (request.status !== "Pending") {
//       return res.status(400).send("Payment request has already been processed.");
//     }

//     request.adminActionToken = crypto.randomBytes(32).toString("hex");
//     request.adminActionTokenExpiresAt =
//       Date.now() + 15 * 60 * 1000;

//     await request.save();

//     const frontendUrl = String(
//       process.env.FRONTEND_URL || "https://saiyed-travel.vercel.app"
//     ).replace(/\/+$/, "");

//     return res.status(200).send(`
//       <!doctype html>
//       <html lang="en">
//         <head>
//           <meta charset="utf-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1">
//           <title>Reject Payment Request</title>
//         </head>
//         <body style="font-family:Arial,sans-serif;padding:32px;color:#111827">
//           <h2>Payment request action</h2>
//           <p>Open the admin dashboard to review this payment request.</p>
//           <p><a href="${frontendUrl}/admin">Open Admin Dashboard</a></p>
//           <p>Request ID: ${request._id}</p>
//         </body>
//       </html>
//     `);
//   } catch (error) {
//     console.error("EMAIL REJECT PAYMENT ERROR:", error);

//     return res.status(500).send("Something went wrong.");
//   }
// };

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
  generateSuccessTicketPdf,
} = require("../services/successTicketPdfService");

const {
  sendTicketWhatsApp,
} = require("../services/whatsappService");

const getAdminEmail = async () => {
  if (process.env.ADMIN_EMAIL) {
    return String(process.env.ADMIN_EMAIL).trim().toLowerCase();
  }

  if (process.env.EMAIL_USER) {
    return String(process.env.EMAIL_USER).trim().toLowerCase();
  }

  const admin = await User.findOne({
    role: "admin",
    isActive: true,
  }).sort({ createdAt: -1 });

  if (!admin?.email) {
    throw new Error("Active admin email not found.");
  }

  return String(admin.email).trim().toLowerCase();
};

const createPaymentRequest = async (req, res) => {
  try {
    let {
      bookingData,
      amount,
      bankName,
      paymentId,
      paymentDateTime,
      customerEmail,
      whatsappNumber,
    } = req.body || {};

    if (typeof bookingData === "string") {
      try {
        bookingData = JSON.parse(bookingData);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid booking data.",
        });
      }
    }

    if (!bookingData || typeof bookingData !== "object") {
      return res.status(400).json({
        success: false,
        message: "Booking data is required.",
      });
    }

    if (!amount || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid payment amount is required.",
      });
    }

    if (!["ICICI Bank", "Bank of Baroda"].includes(bankName)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid bank.",
      });
    }

    if (!paymentId || !String(paymentId).trim()) {
      return res.status(400).json({
        success: false,
        message: "Payment ID / UTR is required.",
      });
    }

    const normalizedEmail = String(
      customerEmail ||
        bookingData.customerEmail ||
        bookingData.email ||
        bookingData.passenger?.email ||
        bookingData.passengers?.[0]?.email ||
        bookingData.passengerDetails?.[0]?.email ||
        ""
    )
      .trim()
      .toLowerCase();

    const normalizedWhatsApp = String(
      whatsappNumber ||
        bookingData.whatsappNumber ||
        bookingData.phone ||
        bookingData.passenger?.phone ||
        ""
    ).trim();

    const paymentRequest = await PaymentRequest.create({
      bookingData,
      amount: Number(amount),
      bankName,
      paymentId: String(paymentId).trim(),
      paymentDateTime: paymentDateTime || new Date(),
      customerEmail: normalizedEmail,
      whatsappNumber: normalizedWhatsApp,
      status: "Pending",
    });

    try {
      const adminEmail = await getAdminEmail();

      await sendAdminPaymentNotification({
        to: adminEmail,
        paymentRequest,
      });
    } catch (emailError) {
      console.error("PAYMENT REQUEST NOTIFICATION ERROR:", emailError);
    }

    return res.status(201).json({
      success: true,
      message: "Payment request submitted successfully.",
      paymentRequest,
    });
  } catch (error) {
    console.error("CREATE PAYMENT REQUEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment request.",
    });
  }
};

const getAllPaymentRequests = async (req, res) => {
  try {
    const requests = await PaymentRequest.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: requests.length,
      paymentRequests: requests,
    });
  } catch (error) {
    console.error("GET PAYMENT REQUESTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment requests.",
    });
  }
};

const getPaymentRequestById = async (req, res) => {
  try {
    const request = await PaymentRequest.findById(req.params.id).lean();

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Payment request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      paymentRequest: request,
    });
  } catch (error) {
    console.error("GET PAYMENT REQUEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment request.",
    });
  }
};

const getCustomerPaymentStatus = async (req, res) => {
  try {
    const email = String(
      req.query.email || req.body?.email || ""
    )
      .trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required.",
      });
    }

    const requests = await PaymentRequest.find({
      customerEmail: email,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      paymentRequests: requests,
    });
  } catch (error) {
    console.error("CUSTOMER PAYMENT STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment status.",
    });
  }
};

const getPendingPaymentCount = async (req, res) => {
  try {
    const count = await PaymentRequest.countDocuments({
      status: "Pending",
    });

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("PENDING PAYMENT COUNT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending payment count.",
    });
  }
};

const normalizePassengerList = (data) => {
  const candidates = [
    data?.passengers,
    data?.passengerDetails,
    data?.passengerList,
    data?.booking?.passengers,
    data?.booking?.passengerDetails,
    data?.bookingData?.passengers,
    data?.bookingData?.passengerDetails,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      return candidate
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
          ...item,
          firstName:
            item.firstName ||
            item.givenName ||
            item.name?.split(/\s+/)[0] ||
            item.fullName?.split(/\s+/)[0] ||
            "",
          lastName:
            item.lastName ||
            item.surname ||
            item.name?.split(/\s+/).slice(1).join(" ") ||
            item.fullName?.split(/\s+/).slice(1).join(" ") ||
            "",
          type: ["Adult", "Child", "Infant"].includes(item.type)
            ? item.type
            : "Adult",
        }));
    }
  }

  const singlePassenger =
    data?.passenger ||
    data?.booking?.passenger ||
    data?.bookingData?.passenger;

  if (singlePassenger && typeof singlePassenger === "object") {
    return [
      {
        ...singlePassenger,
        firstName:
          singlePassenger.firstName ||
          singlePassenger.givenName ||
          singlePassenger.name?.split(/\s+/)[0] ||
          singlePassenger.fullName?.split(/\s+/)[0] ||
          "",
        lastName:
          singlePassenger.lastName ||
          singlePassenger.surname ||
          singlePassenger.name?.split(/\s+/).slice(1).join(" ") ||
          singlePassenger.fullName?.split(/\s+/).slice(1).join(" ") ||
          "",
        type: ["Adult", "Child", "Infant"].includes(singlePassenger.type)
          ? singlePassenger.type
          : "Adult",
      },
    ];
  }

  const name = String(
    data?.passengerName ||
      data?.name ||
      data?.fullName ||
      data?.booking?.passengerName ||
      data?.booking?.name ||
      ""
  ).trim();

  if (name) {
    const parts = name.split(/\s+/);

    return [
      {
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" "),
        type: "Adult",
        email: data?.customerEmail || data?.email || "",
        phone: data?.phone || data?.whatsappNumber || "",
      },
    ];
  }

  return [];
};

const acceptPaymentRequest = async (req, res) => {
  try {
    const { adminNote } = req.body || {};
    const request = await PaymentRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Payment request not found.",
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Payment request is already ${request.status}.`,
      });
    }

    if (!request.bookingData) {
      return res.status(400).json({
        success: false,
        message: "Booking data is missing.",
      });
    }

    const bookingData =
      typeof request.bookingData.toObject === "function"
        ? request.bookingData.toObject()
        : JSON.parse(JSON.stringify(request.bookingData));

    const customerEmail = String(
      request.customerEmail ||
        bookingData.customerEmail ||
        bookingData.email ||
        bookingData.userEmail ||
        bookingData.passenger?.email ||
        bookingData.passengers?.[0]?.email ||
        bookingData.passengerDetails?.[0]?.email ||
        ""
    )
      .trim()
      .toLowerCase();

    const whatsappNumber = String(
      request.whatsappNumber ||
        bookingData.whatsappNumber ||
        bookingData.phone ||
        bookingData.passenger?.phone ||
        ""
    ).trim();

    const passengerList = normalizePassengerList(bookingData);

    if (passengerList.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Passenger details are missing. Please submit the booking again with at least one passenger.",
      });
    }

    const rawUserId =
      bookingData.userId ||
      bookingData.user?._id ||
      bookingData.user?.id ||
      req.user?._id ||
      req.user?.id ||
      null;

    const customerUserId =
      rawUserId && mongoose.Types.ObjectId.isValid(String(rawUserId))
        ? new mongoose.Types.ObjectId(String(rawUserId))
        : null;

    const existingBookingId =
      request.approvedBookingId || bookingData.bookingId || null;

    let createdBooking = null;

    if (
      existingBookingId &&
      mongoose.Types.ObjectId.isValid(String(existingBookingId))
    ) {
      createdBooking = await Booking.findById(existingBookingId);
    }

    if (!createdBooking) {
      const bookingPayload = {
        ...bookingData,
        passenger: passengerList[0],
        passengers: passengerList,
        passengerDetails: passengerList,
        passengerName:
          bookingData.passengerName ||
          bookingData.name ||
          `${passengerList[0].firstName || ""} ${
            passengerList[0].lastName || ""
          }`.trim(),
        name:
          bookingData.name ||
          bookingData.passengerName ||
          `${passengerList[0].firstName || ""} ${
            passengerList[0].lastName || ""
          }`.trim(),
        email: customerEmail || bookingData.email || "",
        customerEmail,
        phone: whatsappNumber || bookingData.phone || "",
        whatsappNumber,
        amount: Number(request.amount),
        totalAmount: Number(request.amount),
        paymentMethod: request.bankName,
        paymentId: request.paymentId,
        paymentStatus: "Paid",
        status: "Confirmed",
      };

      if (customerUserId) {
        bookingPayload.userId = customerUserId;
      }

      delete bookingPayload._id;
      delete bookingPayload.__v;

      if (
        bookingController &&
        typeof bookingController.createBooking === "function"
      ) {
        const bookingResult = await new Promise((resolve, reject) => {
          let settled = false;

          const fakeRes = {
            statusCode: 200,
            status(code) {
              this.statusCode = code;
              return this;
            },
            json(body) {
              if (settled) return this;
              settled = true;

              if (this.statusCode >= 400 || body?.success === false) {
                return reject(
                  new Error(body?.message || "Failed to create booking.")
                );
              }

              resolve(body);
              return this;
            },
          };

          Promise.resolve(
            bookingController.createBooking(
              {
                body: bookingPayload,
                user: req.user || (customerUserId ? { _id: customerUserId } : undefined),
              },
              fakeRes
            )
          ).catch((error) => {
            if (!settled) {
              settled = true;
              reject(error);
            }
          });
        });

        const resultBooking =
          bookingResult?.booking ||
          bookingResult?.data?.booking ||
          bookingResult?.data ||
          null;

        if (resultBooking?._id) {
          createdBooking = await Booking.findById(resultBooking._id);
        }
      }

      if (!createdBooking) {
        createdBooking = await Booking.create(bookingPayload);
      }
    } else {
      createdBooking.passenger =
        createdBooking.passenger || passengerList[0];
      createdBooking.passengers =
        createdBooking.passengers?.length > 0
          ? createdBooking.passengers
          : passengerList;
      createdBooking.passengerDetails =
        createdBooking.passengerDetails?.length > 0
          ? createdBooking.passengerDetails
          : passengerList;
      createdBooking.paymentStatus = "Paid";
      createdBooking.status = "Confirmed";
      createdBooking.amount = Number(request.amount);
      createdBooking.totalAmount = Number(request.amount);
      createdBooking.paymentMethod = request.bankName;
      createdBooking.paymentId = request.paymentId;

      if (customerEmail) {
        createdBooking.email = customerEmail;
        createdBooking.customerEmail = customerEmail;
      }

      if (whatsappNumber) {
        createdBooking.phone = whatsappNumber;
        createdBooking.whatsappNumber = whatsappNumber;
      }

      await createdBooking.save();
    }

    const savedBooking =
      typeof createdBooking.toObject === "function"
        ? createdBooking.toObject()
        : createdBooking;

    const ticketBooking = {
      ...bookingData,
      ...savedBooking,
      _id: createdBooking._id,
      bookingId:
        savedBooking.bookingId ||
        String(createdBooking._id),
      name:
        savedBooking.name ||
        savedBooking.passengerName ||
        bookingData.name ||
        bookingData.passengerName ||
        `${passengerList[0].firstName || ""} ${
          passengerList[0].lastName || ""
        }`.trim(),
      passengerName:
        savedBooking.passengerName ||
        bookingData.passengerName ||
        bookingData.name ||
        `${passengerList[0].firstName || ""} ${
          passengerList[0].lastName || ""
        }`.trim(),
      passenger: savedBooking.passenger || passengerList[0],
      passengers:
        savedBooking.passengers?.length > 0
          ? savedBooking.passengers
          : passengerList,
      passengerDetails:
        savedBooking.passengerDetails?.length > 0
          ? savedBooking.passengerDetails
          : passengerList,
      email: customerEmail,
      customerEmail,
      phone: whatsappNumber,
      whatsappNumber,
      amount: Number(request.amount),
      totalAmount: Number(request.amount),
      paymentMethod: request.bankName,
      paymentId: request.paymentId,
      flight:
        savedBooking.flight ||
        bookingData.flight ||
        bookingData.flightDetails ||
        bookingData.selectedFlight ||
        bookingData.flightData ||
        {},
      flightDetails:
        savedBooking.flightDetails ||
        bookingData.flightDetails ||
        {},
      selectedFlight:
        savedBooking.selectedFlight ||
        bookingData.selectedFlight ||
        {},
      flightData:
        savedBooking.flightData ||
        bookingData.flightData ||
        {},
      from:
        savedBooking.from ||
        bookingData.from ||
        bookingData.source ||
        bookingData.origin ||
        bookingData.flight?.from ||
        bookingData.flightDetails?.from ||
        bookingData.selectedFlight?.from ||
        bookingData.flightData?.from ||
        "",
      to:
        savedBooking.to ||
        bookingData.to ||
        bookingData.destination ||
        bookingData.flight?.to ||
        bookingData.flightDetails?.to ||
        bookingData.selectedFlight?.to ||
        bookingData.flightData?.to ||
        "",
      departureDate:
        savedBooking.departureDate ||
        bookingData.departureDate ||
        bookingData.travelDate ||
        bookingData.flight?.departureDate ||
        bookingData.flightDetails?.departureDate ||
        bookingData.selectedFlight?.departureDate ||
        bookingData.flightData?.departureDate ||
        "",
      departureTime:
        savedBooking.departureTime ||
        bookingData.departureTime ||
        bookingData.flight?.departureTime ||
        bookingData.flightDetails?.departureTime ||
        bookingData.selectedFlight?.departureTime ||
        bookingData.flightData?.departureTime ||
        "",
      arrivalDate:
        savedBooking.arrivalDate ||
        bookingData.arrivalDate ||
        bookingData.flight?.arrivalDate ||
        bookingData.flightDetails?.arrivalDate ||
        bookingData.selectedFlight?.arrivalDate ||
        bookingData.flightData?.arrivalDate ||
        "",
      arrivalTime:
        savedBooking.arrivalTime ||
        bookingData.arrivalTime ||
        bookingData.flight?.arrivalTime ||
        bookingData.flightDetails?.arrivalTime ||
        bookingData.selectedFlight?.arrivalTime ||
        bookingData.flightData?.arrivalTime ||
        "",
      baggage:
        savedBooking.baggage ||
        bookingData.baggage ||
        bookingData.flight?.baggage ||
        bookingData.flightDetails?.baggage ||
        bookingData.selectedFlight?.baggage ||
        bookingData.flightData?.baggage ||
        {},
      cabinBaggage:
        savedBooking.cabinBaggage ||
        bookingData.cabinBaggage ||
        "",
      checkinBaggage:
        savedBooking.checkinBaggage ||
        bookingData.checkinBaggage ||
        "",
    };

    const ticketPdfBuffer = await generateSuccessTicketPdf(ticketBooking);

    if (!Buffer.isBuffer(ticketPdfBuffer) || ticketPdfBuffer.length === 0) {
      throw new Error("Ticket PDF could not be generated.");
    }

    request.status = "Accepted";
    request.approvedBookingId = createdBooking._id;
    request.adminNote = adminNote || "";
    request.processedAt = new Date();
    request.adminActionToken = null;
    request.adminActionTokenExpiresAt = null;

    if (customerEmail) {
      request.customerEmail = customerEmail;
    }

    if (whatsappNumber) {
      request.whatsappNumber = whatsappNumber;
    }

    await request.save();

    let customerEmailSent = false;
    let adminEmailSent = false;
    let whatsappSent = false;

    if (customerEmail) {
      try {
        await sendTicketEmail({
          to: customerEmail,
          booking: ticketBooking,
          pdfBuffer: ticketPdfBuffer,
        });

        customerEmailSent = true;
      } catch (error) {
        console.error("CUSTOMER TICKET EMAIL ERROR:", error);
      }
    }

    try {
      const adminEmail = await getAdminEmail();

      if (adminEmail) {
        await sendTicketEmail({
          to: adminEmail,
          booking: ticketBooking,
          pdfBuffer: ticketPdfBuffer,
        });

        adminEmailSent = true;
      }
    } catch (error) {
      console.error("ADMIN TICKET EMAIL ERROR:", error);
    }

    if (whatsappNumber) {
      try {
        await sendTicketWhatsApp({
          to: whatsappNumber,
          booking: ticketBooking,
          pdfBuffer: ticketPdfBuffer,
        });

        whatsappSent = true;
      } catch (error) {
        console.error("CUSTOMER TICKET WHATSAPP ERROR:", error);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Payment accepted and booking confirmed successfully.",
      paymentRequest: request,
      booking: createdBooking,
      ticketStatus: {
        customerEmail: customerEmailSent ? "sent" : "failed",
        adminEmail: adminEmailSent ? "sent" : "failed",
        whatsapp: whatsappSent ? "sent" : "failed",
      },
    });
  } catch (error) {
    console.error("ACCEPT PAYMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to accept payment.",
    });
  }
};

const rejectPaymentRequest = async (req, res) => {
  try {
    const { adminNote } = req.body || {};
    const request = await PaymentRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Payment request not found.",
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Payment request is already ${request.status}.`,
      });
    }

    request.status = "Rejected";
    request.adminNote = adminNote || "";
    request.processedAt = new Date();
    request.adminActionToken = null;
    request.adminActionTokenExpiresAt = null;

    await request.save();

    return res.status(200).json({
      success: true,
      message: "Payment request rejected.",
      paymentRequest: request,
    });
  } catch (error) {
    console.error("REJECT PAYMENT REQUEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to reject payment request.",
    });
  }
};

const deletePaymentRequest = async (req, res) => {
  try {
    const request = await PaymentRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Payment request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment request deleted.",
    });
  } catch (error) {
    console.error("DELETE PAYMENT REQUEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete payment request.",
    });
  }
};

const emailAcceptPaymentRequest = async (req, res) => {
  try {
    const request = await PaymentRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).send("Payment request not found.");
    }

    if (request.status !== "Pending") {
      return res.status(400).send("Payment request has already been processed.");
    }

    request.adminActionToken = crypto.randomBytes(32).toString("hex");
    request.adminActionTokenExpiresAt = Date.now() + 15 * 60 * 1000;

    await request.save();

    const frontendUrl = String(
      process.env.FRONTEND_URL || "https://saiyed-travel.vercel.app"
    ).replace(/\/+$/, "");

    return res.status(200).send(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Accept Payment Request</title>
        </head>
        <body style="font-family:Arial,sans-serif;padding:32px;color:#111827">
          <h2>Payment request action</h2>
          <p>Open the admin dashboard to review and approve this payment request.</p>
          <p><a href="${frontendUrl}/admin">Open Admin Dashboard</a></p>
          <p>Request ID: ${request._id}</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("EMAIL ACCEPT PAYMENT ERROR:", error);

    return res.status(500).send("Something went wrong.");
  }
};

const emailRejectPaymentRequest = async (req, res) => {
  try {
    const request = await PaymentRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).send("Payment request not found.");
    }

    if (request.status !== "Pending") {
      return res.status(400).send("Payment request has already been processed.");
    }

    request.adminActionToken = crypto.randomBytes(32).toString("hex");
    request.adminActionTokenExpiresAt = Date.now() + 15 * 60 * 1000;

    await request.save();

    const frontendUrl = String(
      process.env.FRONTEND_URL || "https://saiyed-travel.vercel.app"
    ).replace(/\/+$/, "");

    return res.status(200).send(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Reject Payment Request</title>
        </head>
        <body style="font-family:Arial,sans-serif;padding:32px;color:#111827">
          <h2>Payment request action</h2>
          <p>Open the admin dashboard to review this payment request.</p>
          <p><a href="${frontendUrl}/admin">Open Admin Dashboard</a></p>
          <p>Request ID: ${request._id}</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("EMAIL REJECT PAYMENT ERROR:", error);

    return res.status(500).send("Something went wrong.");
  }
};

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