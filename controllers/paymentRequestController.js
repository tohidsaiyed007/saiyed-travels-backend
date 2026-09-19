
// // const crypto = require("crypto");

// // const PaymentRequest = require("../models/PaymentRequest");
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
// //   const admin = await User.findOne({
// //     role: "admin",
// //     isActive: true,
// //   }).sort({ createdAt: -1 });

// //   if (!admin) {
// //     throw new Error("Active admin account not found.");
// //   }

// //   if (!admin.email) {
// //     throw new Error("Admin email is missing.");
// //   }

// //   return admin.email.trim().toLowerCase();
// // };

// // // =========================================================
// // // CREATE PAYMENT REQUEST
// // // =========================================================

// // const createPaymentRequest = async (req, res) => {
// //   try {
// //     const {
// //       bookingData,
// //       amount,
// //       bankName,
// //       paymentId,
// //       paymentDateTime,

// //       // New
// //       whatsappNumber,

// //       // Old email kept optional for old bookings
// //       customerEmail,
// //     } = req.body;

// //     if (!customerEmail) {
// //   return res.status(400).json({
// //     success: false,
// //     message: "Customer email is required.",
// //   });
// // }

// //     const screenshot = req.file;

// //     // ---------------- VALIDATION ----------------

// //     if (!bookingData) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Booking data is required.",
// //       });
// //     }

// //     if (!amount) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Payment amount is required.",
// //       });
// //     }

// //     if (
// //       bankName !== "ICICI Bank" &&
// //       bankName !== "Bank of Baroda"
// //     ) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Please select a valid bank.",
// //       });
// //     }

// //     if (!paymentId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Payment ID / UTR is required.",
// //       });
// //     }

// //     if (!paymentDateTime) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Payment date/time is required.",
// //       });
// //     }

// //     // WhatsApp number is now required
// //     if (!whatsappNumber) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "WhatsApp number is required.",
// //       });
// //     }

// //     if (!screenshot) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Payment screenshot is required.",
// //       });
// //     }

// //     // ---------------- BOOKING DATA ----------------

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

// //     // ------------------------------------------------
// //     // MAKE SURE WHATSAPP NUMBER IS ALSO INSIDE BOOKING
// //     // ------------------------------------------------

// //     parsedBookingData = {
// //       ...parsedBookingData,
// //       whatsappNumber: String(whatsappNumber).trim(),
// //     };

// //     // ---------------- PAYMENT DATE ----------------

// //     const parsedPaymentDate = new Date(paymentDateTime);

// //     if (
// //       Number.isNaN(parsedPaymentDate.getTime())
// //     ) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid payment date/time.",
// //       });
// //     }

// //     // ---------------- SCREENSHOT ----------------

// //     const screenshotPath =
// //       `/uploads/payment-screenshots/${screenshot.filename}`;

// //     // =====================================================
// //     // CREATE PAYMENT REQUEST
// //     // =====================================================

// //     const request = await PaymentRequest.create({
// //       bookingData: parsedBookingData,

// //       amount: Number(amount),

// //       bankName,

// //       paymentId: String(paymentId).trim(),

// //       screenshot: screenshotPath,

// //       paymentDateTime: parsedPaymentDate,

// //       // Customer email is optional now
// //       // customerEmail: customerEmail
// //       //   ? String(customerEmail).trim().toLowerCase()
// //       //   : "",

// //       customerEmail: String(customerEmail)
// //   .trim()
// //   .toLowerCase(),

// //       // Customer WhatsApp number
// //       whatsappNumber: String(whatsappNumber).trim(),

// //       status: "Pending",

// //       adminActionToken: null,

// //       adminActionTokenExpiresAt: null,
// //     });

// //     // =====================================================
// //     // CREATE EMAIL ACTION TOKEN
// //     // =====================================================

// //     const rawToken = crypto
// //       .randomBytes(32)
// //       .toString("hex");

// //     const tokenHash = crypto
// //       .createHash("sha256")
// //       .update(rawToken)
// //       .digest("hex");

// //     const tokenExpiry = new Date(
// //       Date.now() +
// //         7 * 24 * 60 * 60 * 1000
// //     );

// //     request.adminActionToken = tokenHash;

// //     request.adminActionTokenExpiresAt =
// //       tokenExpiry;

// //     await request.save();

// //     // =====================================================
// //     // FIND ADMIN EMAIL
// //     // =====================================================

// //     let adminEmail;

// //     try {
// //       adminEmail = await getAdminEmail();

// //       console.log(
// //         "===================================="
// //       );

// //       console.log(
// //         "ADMIN PAYMENT EMAIL:"
// //       );

// //       console.log(adminEmail);

// //       console.log(
// //         "===================================="
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
// //           paymentRequest: request,
// //           adminActionToken: rawToken,
// //           adminEmail,
// //         });

// //         console.log(
// //           "ADMIN PAYMENT REQUEST EMAIL SENT TO:",
// //           adminEmail
// //         );
// //       } catch (emailError) {
// //         console.error(
// //           "===================================="
// //         );

// //         console.error(
// //           "ADMIN PAYMENT EMAIL FAILED"
// //         );

// //         console.error(emailError);

// //         console.error(
// //           "===================================="
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
// //       success: true,

// //       message:
// //         "Payment request submitted successfully. Waiting for admin verification.",

// //       paymentRequest: {
// //         id: request._id,

// //         status: request.status,

// //         amount: request.amount,

// //         bankName: request.bankName,

// //         paymentId: request.paymentId,

// //         whatsappNumber:
// //           request.whatsappNumber,

// //         customerEmail:
// //           request.customerEmail,
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

// // const getAllPaymentRequests = async (
// //   req,
// //   res
// // ) => {
// //   try {
// //     const requests =
// //       await PaymentRequest.find()
// //         .sort({
// //           createdAt: -1,
// //         });

// //     return res.status(200).json({
// //       success: true,

// //       count: requests.length,

// //       paymentRequests: requests,
// //     });
// //   } catch (error) {
// //     console.error(
// //       "GET PAYMENT REQUESTS ERROR:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,

// //       message:
// //         "Failed to fetch payment requests.",
// //     });
// //   }
// // };

// // // =========================================================
// // // GET SINGLE PAYMENT REQUEST
// // // =========================================================

// // const getPaymentRequestById = async (
// //   req,
// //   res
// // ) => {
// //   try {
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

// //     return res.status(200).json({
// //       success: true,

// //       paymentRequest: request,
// //     });
// //   } catch (error) {
// //     console.error(
// //       "GET PAYMENT REQUEST ERROR:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,

// //       message:
// //         "Failed to fetch payment request.",
// //     });
// //   }
// // };

// // // =========================================================
// // // GET PENDING COUNT
// // // =========================================================

// // const getPendingPaymentCount = async (
// //   req,
// //   res
// // ) => {
// //   try {
// //     const count =
// //       await PaymentRequest.countDocuments({
// //         status: "Pending",
// //       });

// //     return res.status(200).json({
// //       success: true,

// //       count,
// //     });
// //   } catch (error) {
// //     console.error(
// //       "GET PENDING COUNT ERROR:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,

// //       message:
// //         "Failed to get pending payment count.",
// //     });
// //   }
// // };

// // // =========================================================
// // // CREATE CONFIRMED BOOKING
// // // =========================================================

// // const createConfirmedBooking = async (
// //   request
// // ) => {
// //   return new Promise(
// //     (resolve, reject) => {
// //       let responseSent = false;

// //       const fakeResponse = {
// //         status: function (
// //           statusCode
// //         ) {
// //           return {
// //             json: function (
// //               data
// //             ) {
// //               responseSent = true;

// //               if (
// //                 statusCode >= 200 &&
// //                 statusCode < 300
// //               ) {
// //                 resolve(data);
// //               } else {
// //                 reject(
// //                   new Error(
// //                     data?.message ||
// //                       "Booking creation failed."
// //                   )
// //                 );
// //               }

// //               return data;
// //             },
// //           };
// //         },

// //         json: function (data) {
// //           if (responseSent) {
// //             return data;
// //           }

// //           responseSent = true;

// //           resolve(data);

// //           return data;
// //         },
// //       };

// //       const fakeRequest = {
// //         body: {
// //           ...request.bookingData,

// //           // Make sure WhatsApp number
// //           // goes into confirmed booking
// //           whatsappNumber:
// //             request.whatsappNumber ||
// //             request.bookingData?.whatsappNumber ||
// //             "",

// //           paymentVerified: true,

// //           paymentStatus: "Paid",

// //           bookingStatus: "Confirmed",

// //           paymentMethod:
// //             request.bankName,

// //           paymentId:
// //             request.paymentId,
// //         },

// //         user: {
// //           role: "admin",

// //           userRole: "admin",

// //           accountType: "admin",
// //         },

// //         headers: {},

// //         get: () => undefined,
// //       };

// //       Promise.resolve(
// //         bookingController.createBooking(
// //           fakeRequest,
// //           fakeResponse
// //         )
// //       ).catch(reject);
// //     }
// //   );
// // };

// // // =========================================================
// // // SEND ADMIN TICKET EMAIL
// // // =========================================================

// // const sendAdminTicket = async (
// //   createdBooking,
// //   adminEmail
// // ) => {
// //   try {
// //     if (!adminEmail) {
// //       throw new Error(
// //         "Admin email is missing."
// //       );
// //     }

// //     await sendTicketEmail({
// //       to: adminEmail,
// //       booking: createdBooking,
// //     });

// //     console.log(
// //       "ADMIN TICKET PDF SENT TO:",
// //       adminEmail
// //     );

// //     return true;
// //   } catch (error) {
// //     console.error(
// //       "ADMIN TICKET EMAIL ERROR:",
// //       error
// //     );

// //     return false;
// //   }
// // };

// // // =========================================================
// // // SEND CUSTOMER EMAIL
// // // Optional - old requests only
// // // =========================================================

// // const sendCustomerEmailTicket = async (
// //   request,
// //   createdBooking
// // ) => {
// //   try {
// //     const customerEmail =
// //       String(
// //         request.customerEmail || ""
// //       )
// //         .trim()
// //         .toLowerCase();

// //     if (!customerEmail) {
// //       console.log(
// //         "CUSTOMER EMAIL NOT PROVIDED - SKIPPING CUSTOMER EMAIL TICKET"
// //       );

// //       return false;
// //     }

// //     await sendTicketEmail({
// //       to: customerEmail,
// //       booking: createdBooking,
// //     });

// //     console.log(
// //       "CUSTOMER TICKET PDF SENT TO EMAIL:",
// //       customerEmail
// //     );

// //     return true;
// //   } catch (error) {
// //     console.error(
// //       "CUSTOMER TICKET EMAIL ERROR:",
// //       error
// //     );

// //     return false;
// //   }
// // };

// // // =========================================================
// // // SEND TICKETS
// // //
// // // WhatsApp sending will be connected here next.
// // // Customer number is request.whatsappNumber.
// // // Admin ticket goes to admin email.
// // // =========================================================
// // // =====================================================
// // // SEND CONFIRMED TICKETS
// // // Customer WhatsApp + Customer Email + Admin Email
// // // =====================================================

// // const sendConfirmedTickets = async (
// //   request,
// //   createdBooking,
// //   adminEmail
// // ) => {
// //   let whatsappSent = false;
// //   let customerEmailSent = false;
// //   let adminEmailSent = false;

// //   // =====================================================
// //   // CUSTOMER WHATSAPP
// //   // =====================================================

// //   const whatsappNumber = String(
// //     request.whatsappNumber ||
// //       request.bookingData?.whatsappNumber ||
// //       ""
// //   ).trim();

// //   if (whatsappNumber) {
// //     try {
// //       console.log(
// //         "===================================="
// //       );
// //       console.log(
// //         "SENDING TICKET TO CUSTOMER WHATSAPP"
// //       );
// //       console.log(
// //         "CUSTOMER WHATSAPP:",
// //         whatsappNumber
// //       );

// //       await sendTicketWhatsApp({
// //         to: whatsappNumber,
// //         booking: createdBooking,
// //       });

// //       whatsappSent = true;

// //       console.log(
// //         "WHATSAPP TICKET SENT SUCCESSFULLY"
// //       );
// //       console.log(
// //         "===================================="
// //       );
// //     } catch (whatsappError) {
// //       console.error(
// //         "===================================="
// //       );
// //       console.error(
// //         "WHATSAPP TICKET ERROR:"
// //       );
// //       console.error(whatsappError);
// //       console.error(
// //         "===================================="
// //       );
// //     }
// //   } else {
// //     console.error(
// //       "CUSTOMER WHATSAPP NUMBER IS MISSING."
// //     );
// //   }

// //   // =====================================================
// //   // CUSTOMER EMAIL
// //   // Optional
// //   // =====================================================

// //   customerEmailSent =
// //     await sendCustomerEmailTicket(
// //       request,
// //       createdBooking
// //     );

// //   // =====================================================
// //   // ADMIN EMAIL
// //   // =====================================================

// //   adminEmailSent =
// //     await sendAdminTicket(
// //       createdBooking,
// //       adminEmail
// //     );

// //   // =====================================================
// //   // RETURN STATUS
// //   // =====================================================

// //   return {
// //     whatsapp: whatsappSent,

// //     customerEmail:
// //       customerEmailSent,

// //     admin:
// //       adminEmailSent,
// //   };
// // };
// // // const sendConfirmedTickets = async (
// // //   request,
// // //   createdBooking,
// // //   adminEmail
// // // ) => {
// // //   let whatsappSent = false;

// // //   let customerEmailSent = false;

// // //   let adminEmailSent = false;

// // //   // =====================================================
// // //   // CUSTOMER WHATSAPP NUMBER
// // //   // =====================================================

// // //   const whatsappNumber =
// // //     String(
// // //       request.whatsappNumber ||
// // //         request.bookingData?.whatsappNumber ||
// // //         ""
// // //     ).trim();

// // //   if (whatsappNumber) {
// // //     console.log(
// // //       "CUSTOMER WHATSAPP NUMBER FOR TICKET:",
// // //       whatsappNumber
// // //     );

// // //     /*
// // //       WhatsApp ticket sending will be added
// // //       in whatsappService.js.

// // //       IMPORTANT:
// // //       The number is already saved and passed
// // //       correctly to this function.
// // //     */

// // //     // whatsappSent will become true
// // //     // after WhatsApp Cloud API is connected.
// // //   } else {
// // //     console.error(
// // //       "CUSTOMER WHATSAPP NUMBER IS MISSING."
// // //     );
// // //   }

// // //   // =====================================================
// // //   // OLD CUSTOMER EMAIL
// // //   // =====================================================

// // //   customerEmailSent =
// // //     await sendCustomerEmailTicket(
// // //       request,
// // //       createdBooking
// // //     );

// // //   // =====================================================
// // //   // ADMIN PDF
// // //   // =====================================================

// // //   adminEmailSent =
// // //     await sendAdminTicket(
// // //       createdBooking,
// // //       adminEmail
// // //     );

// // //   // =====================================================
// // //   // RETURN STATUS
// // //   // =====================================================

// // //   return {
// // //     whatsapp: whatsappSent,

// // //     customerEmail:
// // //       customerEmailSent,

// // //     admin:
// // //       adminEmailSent,
// // //   };
// // // };

// // // =========================================================
// // // ACCEPT PAYMENT REQUEST
// // // =========================================================

// // const acceptPaymentRequest = async (
// //   req,
// //   res
// // ) => {
// //   try {
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

// //     // Prevent duplicate booking/ticket
// //     if (
// //       request.status !== "Pending"
// //     ) {
// //       return res.status(400).json({
// //         success: false,

// //         message:
// //           `Payment request is already ${request.status}.`,
// //       });
// //     }

// //     const adminNote =
// //       req.body?.adminNote || "";

// //     // ===================================================
// //     // CREATE BOOKING
// //     // ===================================================

// //     let bookingResult;

// //     try {
// //       bookingResult =
// //         await createConfirmedBooking(
// //           request
// //         );
// //     } catch (bookingError) {
// //       console.error(
// //         "BOOKING CREATION ERROR:",
// //         bookingError
// //       );

// //       return res.status(500).json({
// //         success: false,

// //         message:
// //           bookingError.message ||
// //           "Booking creation failed.",
// //       });
// //     }

// //     // ===================================================
// //     // GET CREATED BOOKING
// //     // ===================================================

// //     const createdBooking =
// //       bookingResult?.booking ||
// //       bookingResult?.data ||
// //       bookingResult;

// //     const bookingId =
// //       createdBooking?._id ||
// //       bookingResult?.booking?._id ||
// //       bookingResult?.bookingId;

// //     if (!bookingId) {
// //       console.error(
// //         "INVALID BOOKING RESULT:",
// //         bookingResult
// //       );

// //       return res.status(500).json({
// //         success: false,

// //         message:
// //           "Booking was not created correctly.",
// //       });
// //     }

// //     // ===================================================
// //     // GET ADMIN EMAIL
// //     // ===================================================

// //     let adminEmail = null;

// //     // Dashboard login wala admin
// //     if (req.user?.email) {
// //       adminEmail =
// //         String(req.user.email)
// //           .trim()
// //           .toLowerCase();
// //     }

// //     // Email action se accept hua
// //     if (!adminEmail) {
// //       try {
// //         adminEmail =
// //           await getAdminEmail();
// //       } catch (error) {
// //         console.error(
// //           "ADMIN EMAIL LOOKUP ERROR:",
// //           error
// //         );
// //       }
// //     }

// //     // ===================================================
// //     // UPDATE PAYMENT REQUEST
// //     // ===================================================

// //     request.status = "Accepted";

// //     request.approvedBookingId =
// //       bookingId;

// //     request.adminNote =
// //       adminNote;

// //     request.processedAt =
// //       new Date();

// //     // Token invalid after acceptance
// //     request.adminActionToken =
// //       null;

// //     request.adminActionTokenExpiresAt =
// //       null;

// //     await request.save();

// //     // ===================================================
// //     // SEND CUSTOMER WHATSAPP + ADMIN EMAIL
// //     // ===================================================

// //     const ticketStatus =
// //       await sendConfirmedTickets(
// //         request,
// //         createdBooking,
// //         adminEmail
// //       );

// //     // ===================================================
// //     // RESPONSE
// //     // ===================================================

// //     return res.status(200).json({
// //       success: true,

// //       message:
// //         "Payment accepted and booking confirmed successfully.",

// //       booking: createdBooking,

// //       paymentRequest: request,

// //       ticketStatus,
// //     });
// //   } catch (error) {
// //     console.error(
// //       "ACCEPT PAYMENT ERROR:",
// //       error
// //     );

// //     return res.status(500).json({
// //       success: false,

// //       message:
// //         error.message ||
// //         "Failed to accept payment request.",
// //     });
// //   }
// // };

// // // =========================================================
// // // REJECT PAYMENT REQUEST
// // // =========================================================

// // const rejectPaymentRequest = async (
// //   req,
// //   res
// // ) => {
// //   try {
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

// //     if (
// //       request.status !== "Pending"
// //     ) {
// //       return res.status(400).json({
// //         success: false,

// //         message:
// //           `Payment request is already ${request.status}.`,
// //       });
// //     }

// //     const adminNote =
// //       req.body?.adminNote || "";

// //     request.status = "Rejected";

// //     request.adminNote =
// //       adminNote;

// //     request.processedAt =
// //       new Date();

// //     request.adminActionToken =
// //       null;

// //     request.adminActionTokenExpiresAt =
// //       null;

// //     await request.save();

// //     return res.status(200).json({
// //       success: true,

// //       message:
// //         "Payment request rejected successfully.",

// //       paymentRequest: request,
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
// //         "Failed to reject payment request.",
// //     });
// //   }
// // };

// // // =========================================================
// // // VALIDATE EMAIL ACTION TOKEN
// // // =========================================================

// // const validateEmailActionToken = async (
// //   requestId,
// //   token
// // ) => {
// //   if (!token) {
// //     throw new Error(
// //       "Action token is missing."
// //     );
// //   }

// //   const request =
// //     await PaymentRequest.findById(
// //       requestId
// //     );

// //   if (!request) {
// //     throw new Error(
// //       "Payment request not found."
// //     );
// //   }

// //   if (
// //     request.status !== "Pending"
// //   ) {
// //     throw new Error(
// //       `Payment request is already ${request.status}.`
// //     );
// //   }

// //   if (!request.adminActionToken) {
// //     throw new Error(
// //       "This email action link is no longer valid."
// //     );
// //   }

// //   if (
// //     request.adminActionTokenExpiresAt &&
// //     request.adminActionTokenExpiresAt <
// //       new Date()
// //   ) {
// //     throw new Error(
// //       "This email action link has expired."
// //     );
// //   }

// //   const tokenHash =
// //     crypto
// //       .createHash("sha256")
// //       .update(token)
// //       .digest("hex");

// //   const storedHash =
// //     String(
// //       request.adminActionToken
// //     );

// //   if (
// //     tokenHash.length !==
// //     storedHash.length
// //   ) {
// //     throw new Error(
// //       "Invalid email action token."
// //     );
// //   }

// //   const tokenMatches =
// //     crypto.timingSafeEqual(
// //       Buffer.from(tokenHash),
// //       Buffer.from(storedHash)
// //     );

// //   if (!tokenMatches) {
// //     throw new Error(
// //       "Invalid email action token."
// //     );
// //   }

// //   return request;
// // };

// // // =========================================================
// // // EMAIL ACCEPT
// // // =========================================================

// // const emailAcceptPaymentRequest =
// //   async (req, res) => {
// //     try {
// //       const request =
// //         await validateEmailActionToken(
// //           req.params.id,
// //           req.query.token
// //         );

// //       let result;

// //       const fakeRequest = {
// //         params: {
// //           id: request._id,
// //         },

// //         body: {
// //           adminNote:
// //             "Accepted from admin email.",
// //         },
// //       };

// //       const fakeResponse = {
// //         status: function (
// //           statusCode
// //         ) {
// //           return {
// //             json: function (
// //               data
// //             ) {
// //               result = {
// //                 statusCode,
// //                 data,
// //               };

// //               return data;
// //             },
// //           };
// //         },
// //       };

// //       await acceptPaymentRequest(
// //         fakeRequest,
// //         fakeResponse
// //       );

// //       if (
// //         !result ||
// //         result.statusCode >= 400
// //       ) {
// //         const message =
// //           result?.data?.message ||
// //           "Failed to accept payment.";

// //         return res
// //           .status(
// //             result?.statusCode ||
// //               500
// //           )
// //           .send(`
// //             <html>
// //               <head>
// //                 <title>Saiyed Travels</title>
// //                 <meta
// //                   name="viewport"
// //                   content="width=device-width, initial-scale=1"
// //                 />
// //               </head>

// //               <body style="
// //                 font-family:Arial;
// //                 text-align:center;
// //                 padding:50px;
// //               ">
// //                 <h1>
// //                   ❌ Payment Acceptance Failed
// //                 </h1>

// //                 <p>
// //                   ${message}
// //                 </p>
// //               </body>
// //             </html>
// //           `);
// //       }

// //       return res
// //         .status(200)
// //         .send(`
// //           <html>
// //             <head>
// //               <title>Saiyed Travels</title>

// //               <meta
// //                 name="viewport"
// //                 content="width=device-width, initial-scale=1"
// //               />
// //             </head>

// //             <body style="
// //               font-family:Arial;
// //               text-align:center;
// //               padding:40px 20px;
// //               background:#f5f7fa;
// //             ">

// //               <div style="
// //                 max-width:500px;
// //                 margin:auto;
// //                 background:white;
// //                 padding:30px;
// //                 border-radius:15px;
// //                 box-shadow:0 5px 25px rgba(0,0,0,.1);
// //               ">

// //                 <div style="
// //                   font-size:55px;
// //                 ">
// //                   ✅
// //                 </div>

// //                 <h1>
// //                   Payment Accepted
// //                 </h1>

// //                 <p>
// //                   Payment has been verified
// //                   and the booking has been confirmed.
// //                 </p>

// //                 <p>
// //                   Ticket PDF has been sent
// //                   to the customer WhatsApp
// //                   and admin email.
// //                 </p>

// //                 <strong>
// //                   Saiyed Travels
// //                 </strong>

// //               </div>

// //             </body>
// //           </html>
// //         `);
// //     } catch (error) {
// //       console.error(
// //         "EMAIL ACCEPT ERROR:",
// //         error
// //       );

// //       return res
// //         .status(400)
// //         .send(`
// //           <html>
// //             <head>
// //               <title>Saiyed Travels</title>
// //             </head>

// //             <body style="
// //               font-family:Arial;
// //               text-align:center;
// //               padding:50px;
// //             ">

// //               <h1>
// //                 ❌ Action Failed
// //               </h1>

// //               <p>
// //                 ${error.message}
// //               </p>

// //             </body>
// //           </html>
// //         `);
// //     }
// //   };

// // // =========================================================
// // // EMAIL REJECT
// // // =========================================================

// // const emailRejectPaymentRequest =
// //   async (req, res) => {
// //     try {
// //       const request =
// //         await validateEmailActionToken(
// //           req.params.id,
// //           req.query.token
// //         );

// //       let result;

// //       const fakeRequest = {
// //         params: {
// //           id: request._id,
// //         },

// //         body: {
// //           adminNote:
// //             "Rejected from admin email.",
// //         },
// //       };

// //       const fakeResponse = {
// //         status: function (
// //           statusCode
// //         ) {
// //           return {
// //             json: function (
// //               data
// //             ) {
// //               result = {
// //                 statusCode,
// //                 data,
// //               };

// //               return data;
// //             },
// //           };
// //         },
// //       };

// //       await rejectPaymentRequest(
// //         fakeRequest,
// //         fakeResponse
// //       );

// //       if (
// //         !result ||
// //         result.statusCode >= 400
// //       ) {
// //         const message =
// //           result?.data?.message ||
// //           "Failed to reject payment.";

// //         return res
// //           .status(
// //             result?.statusCode ||
// //               500
// //           )
// //           .send(`
// //             <html>
// //               <body style="
// //                 font-family:Arial;
// //                 text-align:center;
// //                 padding:50px;
// //               ">

// //                 <h1>
// //                   ❌ Payment Rejection Failed
// //                 </h1>

// //                 <p>
// //                   ${message}
// //                 </p>

// //               </body>
// //             </html>
// //           `);
// //       }

// //       return res
// //         .status(200)
// //         .send(`
// //           <html>
// //             <head>
// //               <title>Saiyed Travels</title>

// //               <meta
// //                 name="viewport"
// //                 content="width=device-width, initial-scale=1"
// //               />
// //             </head>

// //             <body style="
// //               font-family:Arial;
// //               text-align:center;
// //               padding:40px 20px;
// //               background:#f5f7fa;
// //             ">

// //               <div style="
// //                 max-width:500px;
// //                 margin:auto;
// //                 background:white;
// //                 padding:30px;
// //                 border-radius:15px;
// //                 box-shadow:0 5px 25px rgba(0,0,0,.1);
// //               ">

// //                 <div style="
// //                   font-size:55px;
// //                 ">
// //                   ❌
// //                 </div>

// //                 <h1>
// //                   Payment Rejected
// //                 </h1>

// //                 <p>
// //                   The payment request has been
// //                   rejected successfully.
// //                 </p>

// //                 <strong>
// //                   Saiyed Travels
// //                 </strong>

// //               </div>

// //             </body>
// //           </html>
// //         `);
// //     } catch (error) {
// //       console.error(
// //         "EMAIL REJECT ERROR:",
// //         error
// //       );

// //       return res
// //         .status(400)
// //         .send(`
// //           <html>
// //             <body style="
// //               font-family:Arial;
// //               text-align:center;
// //               padding:50px;
// //             ">

// //               <h1>
// //                 ❌ Action Failed
// //               </h1>

// //               <p>
// //                 ${error.message}
// //               </p>

// //             </body>
// //           </html>
// //         `);
// //     }
// //   };

// // // =========================================================
// // // EXPORTS
// // // =========================================================

// // module.exports = {
// //   createPaymentRequest,

// //   getAllPaymentRequests,

// //   getPaymentRequestById,

// //   getPendingPaymentCount,

// //   acceptPaymentRequest,

// //   rejectPaymentRequest,

// //   emailAcceptPaymentRequest,

// //   emailRejectPaymentRequest,
// // };


// const crypto = require("crypto");

// const PaymentRequest = require("../models/PaymentRequest");
// const User = require("../models/User");
// const bookingController = require("./bookingController");

// const {
//   sendAdminPaymentNotification,
//   sendTicketEmail,
// } = require("../services/emailService");

// const {
//   sendTicketWhatsApp,
// } = require("../services/whatsappService");

// // =========================================================
// // GET ADMIN EMAIL
// // =========================================================

// const getAdminEmail = async () => {
//   const admin = await User.findOne({
//     role: "admin",
//     isActive: true,
//   }).sort({ createdAt: -1 });

//   if (!admin) {
//     throw new Error("Active admin account not found.");
//   }

//   if (!admin.email) {
//     throw new Error("Admin email is missing.");
//   }

//   return admin.email.trim().toLowerCase();
// };

// // =========================================================
// // CREATE PAYMENT REQUEST
// // =========================================================

// const createPaymentRequest = async (req, res) => {
//   try {
//     const {
//       bookingData,
//       amount,
//       bankName,
//       paymentId,
//       paymentDateTime,
//       whatsappNumber,
//       customerEmail,
//     } = req.body;

//     const screenshot = req.file;

//     // =====================================================
//     // VALIDATION
//     // =====================================================

//     if (!bookingData) {
//       return res.status(400).json({
//         success: false,
//         message: "Booking data is required.",
//       });
//     }

//     if (!amount) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment amount is required.",
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

//     if (!paymentDateTime) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment date/time is required.",
//       });
//     }

//     // Customer Email REQUIRED
//     if (!customerEmail) {
//       return res.status(400).json({
//         success: false,
//         message: "Customer email is required.",
//       });
//     }

//     // WhatsApp REQUIRED
//     if (!whatsappNumber) {
//       return res.status(400).json({
//         success: false,
//         message: "WhatsApp number is required.",
//       });
//     }

//     if (!screenshot) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment screenshot is required.",
//       });
//     }

//     // =====================================================
//     // BOOKING DATA
//     // =====================================================

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

//     // WhatsApp number booking ke andar bhi save hoga
//     parsedBookingData = {
//       ...parsedBookingData,
//       whatsappNumber: String(whatsappNumber).trim(),
//     };

//     // =====================================================
//     // PAYMENT DATE
//     // =====================================================

//     const parsedPaymentDate = new Date(paymentDateTime);

//     if (Number.isNaN(parsedPaymentDate.getTime())) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid payment date/time.",
//       });
//     }

//     // =====================================================
//     // SCREENSHOT
//     // =====================================================

//     const screenshotPath =
//       `/uploads/payment-screenshots/${screenshot.filename}`;

//     // =====================================================
//     // CREATE PAYMENT REQUEST
//     // =====================================================

//     const request = await PaymentRequest.create({
//       bookingData: parsedBookingData,

//       amount: Number(amount),

//       bankName,

//       paymentId: String(paymentId).trim(),

//       screenshot: screenshotPath,

//       paymentDateTime: parsedPaymentDate,

//       // Customer email REQUIRED
//       customerEmail: String(customerEmail)
//         .trim()
//         .toLowerCase(),

//       // WhatsApp number
//       whatsappNumber: String(whatsappNumber).trim(),

//       status: "Pending",

//       adminActionToken: null,

//       adminActionTokenExpiresAt: null,
//     });

//     // =====================================================
//     // CREATE EMAIL ACTION TOKEN
//     // =====================================================

//     const rawToken = crypto
//       .randomBytes(32)
//       .toString("hex");

//     const tokenHash = crypto
//       .createHash("sha256")
//       .update(rawToken)
//       .digest("hex");

//     const tokenExpiry = new Date(
//       Date.now() +
//         7 * 24 * 60 * 60 * 1000
//     );

//     request.adminActionToken = tokenHash;

//     request.adminActionTokenExpiresAt =
//       tokenExpiry;

//     await request.save();

//     // =====================================================
//     // FIND ADMIN EMAIL
//     // =====================================================

//     let adminEmail;

//     try {
//       adminEmail = await getAdminEmail();

//       console.log(
//         "===================================="
//       );

//       console.log(
//         "ADMIN PAYMENT EMAIL:"
//       );

//       console.log(adminEmail);

//       console.log(
//         "===================================="
//       );
//     } catch (error) {
//       console.error(
//         "ADMIN EMAIL LOOKUP ERROR:",
//         error
//       );
//     }

//     // =====================================================
//     // SEND ADMIN PAYMENT REQUEST EMAIL
//     // =====================================================

//     if (adminEmail) {
//       try {
//         await sendAdminPaymentNotification({
//           paymentRequest: request,
//           adminActionToken: rawToken,
//           adminEmail,
//         });

//         console.log(
//           "ADMIN PAYMENT REQUEST EMAIL SENT TO:",
//           adminEmail
//         );
//       } catch (emailError) {
//         console.error(
//           "===================================="
//         );

//         console.error(
//           "ADMIN PAYMENT EMAIL FAILED"
//         );

//         console.error(emailError);

//         console.error(
//           "===================================="
//         );
//       }
//     } else {
//       console.error(
//         "ADMIN EMAIL NOT FOUND - EMAIL NOT SENT"
//       );
//     }

//     // =====================================================
//     // RESPONSE
//     // =====================================================

//     return res.status(201).json({
//       success: true,

//       message:
//         "Payment request submitted successfully. Waiting for admin verification.",

//       paymentRequest: {
//         id: request._id,

//         status: request.status,

//         amount: request.amount,

//         bankName: request.bankName,

//         paymentId: request.paymentId,

//         whatsappNumber:
//           request.whatsappNumber,

//         customerEmail:
//           request.customerEmail,
//       },
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

// // =========================================================
// // GET ALL PAYMENT REQUESTS
// // =========================================================

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

//       count: requests.length,

//       paymentRequests: requests,
//     });
//   } catch (error) {
//     console.error(
//       "GET PAYMENT REQUESTS ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,

//       message:
//         "Failed to fetch payment requests.",
//     });
//   }
// };

// // =========================================================
// // GET SINGLE PAYMENT REQUEST
// // =========================================================

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

//       paymentRequest: request,
//     });
//   } catch (error) {
//     console.error(
//       "GET PAYMENT REQUEST ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,

//       message:
//         "Failed to fetch payment request.",
//     });
//   }
// };

// // =========================================================
// // GET PENDING COUNT
// // =========================================================

// const getPendingPaymentCount = async (
//   req,
//   res
// ) => {
//   try {
//     const count =
//       await PaymentRequest.countDocuments({
//         status: "Pending",
//       });

//     return res.status(200).json({
//       success: true,

//       count,
//     });
//   } catch (error) {
//     console.error(
//       "GET PENDING COUNT ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,

//       message:
//         "Failed to get pending payment count.",
//     });
//   }
// };

// // =========================================================
// // CREATE CONFIRMED BOOKING
// // =========================================================

// const createConfirmedBooking = async (
//   request
// ) => {
//   return new Promise(
//     (resolve, reject) => {
//       let responseSent = false;

//       const fakeResponse = {
//         status: function (
//           statusCode
//         ) {
//           return {
//             json: function (
//               data
//             ) {
//               responseSent = true;

//               if (
//                 statusCode >= 200 &&
//                 statusCode < 300
//               ) {
//                 resolve(data);
//               } else {
//                 reject(
//                   new Error(
//                     data?.message ||
//                       "Booking creation failed."
//                   )
//                 );
//               }

//               return data;
//             },
//           };
//         },

//         json: function (data) {
//           if (responseSent) {
//             return data;
//           }

//           responseSent = true;

//           resolve(data);

//           return data;
//         },
//       };

//       const fakeRequest = {
//         body: {
//           ...request.bookingData,

//           // WhatsApp number confirmed booking me bhi
//           whatsappNumber:
//             request.whatsappNumber ||
//             request.bookingData?.whatsappNumber ||
//             "",

//           paymentVerified: true,

//           paymentStatus: "Paid",

//           bookingStatus: "Confirmed",

//           paymentMethod:
//             request.bankName,

//           paymentId:
//             request.paymentId,
//         },

//         user: {
//           role: "admin",

//           userRole: "admin",

//           accountType: "admin",
//         },

//         headers: {},

//         get: () => undefined,
//       };

//       Promise.resolve(
//         bookingController.createBooking(
//           fakeRequest,
//           fakeResponse
//         )
//       ).catch(reject);
//     }
//   );
// };

// // =========================================================
// // SEND ADMIN TICKET EMAIL
// // =========================================================

// const sendAdminTicket = async (
//   createdBooking,
//   adminEmail
// ) => {
//   try {
//     if (!adminEmail) {
//       throw new Error(
//         "Admin email is missing."
//       );
//     }

//     await sendTicketEmail({
//       to: adminEmail,
//       booking: createdBooking,
//     });

//     console.log(
//       "ADMIN TICKET PDF SENT TO:",
//       adminEmail
//     );

//     return true;
//   } catch (error) {
//     console.error(
//       "ADMIN TICKET EMAIL ERROR:",
//       error
//     );

//     return false;
//   }
// };

// // =========================================================
// // SEND CUSTOMER EMAIL
// // =========================================================

// const sendCustomerEmailTicket = async (
//   request,
//   createdBooking
// ) => {
//   try {
//     const customerEmail =
//       String(
//         request.customerEmail || ""
//       )
//         .trim()
//         .toLowerCase();

//     if (!customerEmail) {
//       console.error(
//         "CUSTOMER EMAIL IS MISSING."
//       );

//       return false;
//     }

//     await sendTicketEmail({
//       to: customerEmail,
//       booking: createdBooking,
//     });

//     console.log(
//       "CUSTOMER TICKET PDF SENT TO EMAIL:",
//       customerEmail
//     );

//     return true;
//   } catch (error) {
//     console.error(
//       "CUSTOMER TICKET EMAIL ERROR:",
//       error
//     );

//     return false;
//   }
// };

// // =========================================================
// // SEND CONFIRMED TICKETS
// // Customer WhatsApp + Customer Email + Admin Email
// // =========================================================

// const sendConfirmedTickets = async (
//   request,
//   createdBooking,
//   adminEmail
// ) => {
//   let whatsappSent = false;

//   let customerEmailSent = false;

//   let adminEmailSent = false;

//   // =====================================================
//   // CUSTOMER WHATSAPP
//   // =====================================================

//   const whatsappNumber = String(
//     request.whatsappNumber ||
//       request.bookingData?.whatsappNumber ||
//       ""
//   ).trim();

//   if (whatsappNumber) {
//     try {
//       console.log(
//         "===================================="
//       );

//       console.log(
//         "SENDING TICKET TO CUSTOMER WHATSAPP"
//       );

//       console.log(
//         "CUSTOMER WHATSAPP:",
//         whatsappNumber
//       );

//       await sendTicketWhatsApp({
//         to: whatsappNumber,
//         booking: createdBooking,
//       });

//       whatsappSent = true;

//       console.log(
//         "WHATSAPP TICKET SENT SUCCESSFULLY"
//       );

//       console.log(
//         "===================================="
//       );
//     } catch (whatsappError) {
//       console.error(
//         "===================================="
//       );

//       console.error(
//         "WHATSAPP TICKET ERROR:"
//       );

//       console.error(whatsappError);

//       console.error(
//         "===================================="
//       );
//     }
//   } else {
//     console.error(
//       "CUSTOMER WHATSAPP NUMBER IS MISSING."
//     );
//   }

//   // =====================================================
//   // CUSTOMER EMAIL
//   // =====================================================

//   customerEmailSent =
//     await sendCustomerEmailTicket(
//       request,
//       createdBooking
//     );

//   // =====================================================
//   // ADMIN EMAIL
//   // =====================================================

//   adminEmailSent =
//     await sendAdminTicket(
//       createdBooking,
//       adminEmail
//     );

//   // =====================================================
//   // RETURN STATUS
//   // =====================================================

//   return {
//     whatsapp: whatsappSent,

//     customerEmail:
//       customerEmailSent,

//     admin:
//       adminEmailSent,
//   };
// };

// // =========================================================
// // ACCEPT PAYMENT REQUEST
// // =========================================================

// const acceptPaymentRequest = async (
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

//     // Prevent duplicate booking/ticket
//     if (
//       request.status !== "Pending"
//     ) {
//       return res.status(400).json({
//         success: false,

//         message:
//           `Payment request is already ${request.status}.`,
//       });
//     }

//     const adminNote =
//       req.body?.adminNote || "";

//     // ===================================================
//     // CREATE BOOKING
//     // ===================================================

//     let bookingResult;

//     try {
//       bookingResult =
//         await createConfirmedBooking(
//           request
//         );
//     } catch (bookingError) {
//       console.error(
//         "BOOKING CREATION ERROR:",
//         bookingError
//       );

//       return res.status(500).json({
//         success: false,

//         message:
//           bookingError.message ||
//           "Booking creation failed.",
//       });
//     }

//     // ===================================================
//     // GET CREATED BOOKING
//     // ===================================================

//     const createdBooking =
//       bookingResult?.booking ||
//       bookingResult?.data ||
//       bookingResult;

//     const bookingId =
//       createdBooking?._id ||
//       bookingResult?.booking?._id ||
//       bookingResult?.bookingId;

//     if (!bookingId) {
//       console.error(
//         "INVALID BOOKING RESULT:",
//         bookingResult
//       );

//       return res.status(500).json({
//         success: false,

//         message:
//           "Booking was not created correctly.",
//       });
//     }

//     // ===================================================
//     // GET ADMIN EMAIL
//     // ===================================================

//     let adminEmail = null;

//     // Dashboard login wala admin
//     if (req.user?.email) {
//       adminEmail =
//         String(req.user.email)
//           .trim()
//           .toLowerCase();
//     }

//     // Email action se accept hua
//     if (!adminEmail) {
//       try {
//         adminEmail =
//           await getAdminEmail();
//       } catch (error) {
//         console.error(
//           "ADMIN EMAIL LOOKUP ERROR:",
//           error
//         );
//       }
//     }

//     // ===================================================
//     // UPDATE PAYMENT REQUEST
//     // ===================================================

//     request.status = "Accepted";

//     request.approvedBookingId =
//       bookingId;

//     request.adminNote =
//       adminNote;

//     request.processedAt =
//       new Date();

//     // Token invalid after acceptance
//     request.adminActionToken =
//       null;

//     request.adminActionTokenExpiresAt =
//       null;

//     await request.save();

//     // ===================================================
//     // SEND CUSTOMER WHATSAPP
//     // + CUSTOMER EMAIL
//     // + ADMIN EMAIL
//     // ===================================================

//     const ticketStatus =
//       await sendConfirmedTickets(
//         request,
//         createdBooking,
//         adminEmail
//       );

//     // ===================================================
//     // RESPONSE
//     // ===================================================

//     return res.status(200).json({
//       success: true,

//       message:
//         "Payment accepted and booking confirmed successfully.",

//       booking: createdBooking,

//       paymentRequest: request,

//       ticketStatus,
//     });
//   } catch (error) {
//     console.error(
//       "ACCEPT PAYMENT ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,

//       message:
//         error.message ||
//         "Failed to accept payment request.",
//     });
//   }
// };

// // =========================================================
// // REJECT PAYMENT REQUEST
// // =========================================================

// const rejectPaymentRequest = async (
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

//     if (
//       request.status !== "Pending"
//     ) {
//       return res.status(400).json({
//         success: false,

//         message:
//           `Payment request is already ${request.status}.`,
//       });
//     }

//     const adminNote =
//       req.body?.adminNote || "";

//     request.status = "Rejected";

//     request.adminNote =
//       adminNote;

//     request.processedAt =
//       new Date();

//     request.adminActionToken =
//       null;

//     request.adminActionTokenExpiresAt =
//       null;

//     await request.save();

//     return res.status(200).json({
//       success: true,

//       message:
//         "Payment request rejected successfully.",

//       paymentRequest: request,
//     });
//   } catch (error) {
//     console.error(
//       "REJECT PAYMENT ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,

//       message:
//         error.message ||
//         "Failed to reject payment request.",
//     });
//   }
// };

// // =========================================================
// // VALIDATE EMAIL ACTION TOKEN
// // =========================================================

// const validateEmailActionToken = async (
//   requestId,
//   token
// ) => {
//   if (!token) {
//     throw new Error(
//       "Action token is missing."
//     );
//   }

//   const request =
//     await PaymentRequest.findById(
//       requestId
//     );

//   if (!request) {
//     throw new Error(
//       "Payment request not found."
//     );
//   }

//   if (
//     request.status !== "Pending"
//   ) {
//     throw new Error(
//       `Payment request is already ${request.status}.`
//     );
//   }

//   if (!request.adminActionToken) {
//     throw new Error(
//       "This email action link is no longer valid."
//     );
//   }

//   if (
//     request.adminActionTokenExpiresAt &&
//     request.adminActionTokenExpiresAt <
//       new Date()
//   ) {
//     throw new Error(
//       "This email action link has expired."
//     );
//   }

//   const tokenHash =
//     crypto
//       .createHash("sha256")
//       .update(token)
//       .digest("hex");

//   const storedHash =
//     String(
//       request.adminActionToken
//     );

//   if (
//     tokenHash.length !==
//     storedHash.length
//   ) {
//     throw new Error(
//       "Invalid email action token."
//     );
//   }

//   const tokenMatches =
//     crypto.timingSafeEqual(
//       Buffer.from(tokenHash),
//       Buffer.from(storedHash)
//     );

//   if (!tokenMatches) {
//     throw new Error(
//       "Invalid email action token."
//     );
//   }

//   return request;
// };

// // =========================================================
// // EMAIL ACCEPT
// // =========================================================

// const emailAcceptPaymentRequest =
//   async (req, res) => {
//     try {
//       const request =
//         await validateEmailActionToken(
//           req.params.id,
//           req.query.token
//         );

//       let result;

//       const fakeRequest = {
//         params: {
//           id: request._id,
//         },

//         body: {
//           adminNote:
//             "Accepted from admin email.",
//         },
//       };

//       const fakeResponse = {
//         status: function (
//           statusCode
//         ) {
//           return {
//             json: function (
//               data
//             ) {
//               result = {
//                 statusCode,
//                 data,
//               };

//               return data;
//             },
//           };
//         },
//       };

//       await acceptPaymentRequest(
//         fakeRequest,
//         fakeResponse
//       );

//       if (
//         !result ||
//         result.statusCode >= 400
//       ) {
//         const message =
//           result?.data?.message ||
//           "Failed to accept payment.";

//         return res
//           .status(
//             result?.statusCode ||
//               500
//           )
//           .send(`
//             <html>
//               <head>
//                 <title>Saiyed Travels</title>
//                 <meta
//                   name="viewport"
//                   content="width=device-width, initial-scale=1"
//                 />
//               </head>

//               <body style="
//                 font-family:Arial;
//                 text-align:center;
//                 padding:50px;
//               ">
//                 <h1>
//                   ❌ Payment Acceptance Failed
//                 </h1>

//                 <p>
//                   ${message}
//                 </p>
//               </body>
//             </html>
//           `);
//       }

//       return res
//         .status(200)
//         .send(`
//           <html>
//             <head>
//               <title>Saiyed Travels</title>

//               <meta
//                 name="viewport"
//                 content="width=device-width, initial-scale=1"
//               />
//             </head>

//             <body style="
//               font-family:Arial;
//               text-align:center;
//               padding:40px 20px;
//               background:#f5f7fa;
//             ">

//               <div style="
//                 max-width:500px;
//                 margin:auto;
//                 background:white;
//                 padding:30px;
//                 border-radius:15px;
//                 box-shadow:0 5px 25px rgba(0,0,0,.1);
//               ">

//                 <div style="
//                   font-size:55px;
//                 ">
//                   ✅
//                 </div>

//                 <h1>
//                   Payment Accepted
//                 </h1>

//                 <p>
//                   Payment has been verified
//                   and the booking has been confirmed.
//                 </p>

//                 <p>
//                   Ticket PDF has been sent
//                   to the customer WhatsApp
//                   and customer/admin email.
//                 </p>

//                 <strong>
//                   Saiyed Travels
//                 </strong>

//               </div>

//             </body>
//           </html>
//         `);
//     } catch (error) {
//       console.error(
//         "EMAIL ACCEPT ERROR:",
//         error
//       );

//       return res
//         .status(400)
//         .send(`
//           <html>
//             <head>
//               <title>Saiyed Travels</title>
//             </head>

//             <body style="
//               font-family:Arial;
//               text-align:center;
//               padding:50px;
//             ">

//               <h1>
//                 ❌ Action Failed
//               </h1>

//               <p>
//                 ${error.message}
//               </p>

//             </body>
//           </html>
//         `);
//     }
//   };

// // =========================================================
// // EMAIL REJECT
// // =========================================================

// const emailRejectPaymentRequest =
//   async (req, res) => {
//     try {
//       const request =
//         await validateEmailActionToken(
//           req.params.id,
//           req.query.token
//         );

//       let result;

//       const fakeRequest = {
//         params: {
//           id: request._id,
//         },

//         body: {
//           adminNote:
//             "Rejected from admin email.",
//         },
//       };

//       const fakeResponse = {
//         status: function (
//           statusCode
//         ) {
//           return {
//             json: function (
//               data
//             ) {
//               result = {
//                 statusCode,
//                 data,
//               };

//               return data;
//             },
//           };
//         },
//       };

//       await rejectPaymentRequest(
//         fakeRequest,
//         fakeResponse
//       );

//       if (
//         !result ||
//         result.statusCode >= 400
//       ) {
//         const message =
//           result?.data?.message ||
//           "Failed to reject payment.";

//         return res
//           .status(
//             result?.statusCode ||
//               500
//           )
//           .send(`
//             <html>
//               <body style="
//                 font-family:Arial;
//                 text-align:center;
//                 padding:50px;
//               ">

//                 <h1>
//                   ❌ Payment Rejection Failed
//                 </h1>

//                 <p>
//                   ${message}
//                 </p>

//               </body>
//             </html>
//           `);
//       }

//       return res
//         .status(200)
//         .send(`
//           <html>
//             <head>
//               <title>Saiyed Travels</title>

//               <meta
//                 name="viewport"
//                 content="width=device-width, initial-scale=1"
//               />
//             </head>

//             <body style="
//               font-family:Arial;
//               text-align:center;
//               padding:40px 20px;
//               background:#f5f7fa;
//             ">

//               <div style="
//                 max-width:500px;
//                 margin:auto;
//                 background:white;
//                 padding:30px;
//                 border-radius:15px;
//                 box-shadow:0 5px 25px rgba(0,0,0,.1);
//               ">

//                 <div style="
//                   font-size:55px;
//                 ">
//                   ❌
//                 </div>

//                 <h1>
//                   Payment Rejected
//                 </h1>

//                 <p>
//                   The payment request has been
//                   rejected successfully.
//                 </p>

//                 <strong>
//                   Saiyed Travels
//                 </strong>

//               </div>

//             </body>
//           </html>
//         `);
//     } catch (error) {
//       console.error(
//         "EMAIL REJECT ERROR:",
//         error
//       );

//       return res
//         .status(400)
//         .send(`
//           <html>
//             <body style="
//               font-family:Arial;
//               text-align:center;
//               padding:50px;
//             ">

//               <h1>
//                 ❌ Action Failed
//               </h1>

//               <p>
//                 ${error.message}
//               </p>

//             </body>
//           </html>
//         `);
//     }
//   };

// // =========================================================
// // EXPORTS
// // =========================================================

// module.exports = {
//   createPaymentRequest,

//   getAllPaymentRequests,

//   getPaymentRequestById,

//   getPendingPaymentCount,

//   acceptPaymentRequest,

//   rejectPaymentRequest,

//   emailAcceptPaymentRequest,

//   emailRejectPaymentRequest,
// };


const crypto = require("crypto");

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
// CREATE PAYMENT REQUEST
// =========================================================

const createPaymentRequest = async (
  req,
  res
) => {
  try {

    // -----------------------------------------
    // FILE CHECK
    // -----------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Payment screenshot is required.",
      });
    }


    // -----------------------------------------
    // GET FORM DATA
    // -----------------------------------------

    const {
      bookingData,
      amount,
      bankName,
      paymentId,
      paymentDateTime,
      customerEmail,
      whatsappNumber,
    } = req.body;


    // -----------------------------------------
    // VALIDATION
    // -----------------------------------------

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


    if (!bankName) {
      return res.status(400).json({
        success: false,
        message:
          "Bank name is required.",
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
          "Payment date and time is required.",
      });
    }


    if (!whatsappNumber) {
      return res.status(400).json({
        success: false,
        message:
          "WhatsApp number is required.",
      });
    }


    // -----------------------------------------
    // PARSE BOOKING DATA
    // -----------------------------------------

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


    // -----------------------------------------
    // SCREENSHOT URL
    // -----------------------------------------

    const screenshot =
      `/uploads/payment-screenshots/${req.file.filename}`;


    // -----------------------------------------
    // CREATE PAYMENT REQUEST
    // -----------------------------------------

    const paymentRequest =
      await PaymentRequest.create({

        bookingData:
          parsedBookingData,

        amount:
          Number(amount),

        bankName,

        paymentId:
          paymentId.trim(),

        screenshot,

        paymentDateTime:
          new Date(paymentDateTime),

        customerEmail:
          customerEmail
            ? customerEmail
                .trim()
                .toLowerCase()
            : "",

        whatsappNumber:
          whatsappNumber.trim(),

        status:
          "Pending",

      });


    // -----------------------------------------
    // ADMIN EMAIL
    // -----------------------------------------

    try {

      await sendAdminPaymentNotification(
        paymentRequest
      );

    } catch (emailError) {

      console.error(
        "ADMIN PAYMENT EMAIL ERROR:",
        emailError
      );

    }


    // -----------------------------------------
    // RESPONSE
    // -----------------------------------------

    return res.status(201).json({

      success: true,

      message:
        "Payment request submitted successfully.",

      paymentRequest: {

        id:
          paymentRequest._id,

        status:
          paymentRequest.status,

        amount:
          paymentRequest.amount,

        bankName:
          paymentRequest.bankName,

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


// =========================================================
// GET ALL PAYMENT REQUESTS
// =========================================================

const getAllPaymentRequests =
  async (req, res) => {

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

        success: true,

        count:
          requests.length,

        requests,

      });

    } catch (error) {

      console.error(
        "GET PAYMENT REQUESTS ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Failed to get payment requests.",

      });

    }

  };


// =========================================================
// GET SINGLE PAYMENT REQUEST
// =========================================================

const getPaymentRequestById =
  async (req, res) => {

    try {

      const request =
        await PaymentRequest.findById(
          req.params.id
        ).populate(
          "approvedBookingId"
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

        request,

      });

    } catch (error) {

      console.error(
        "GET PAYMENT REQUEST ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

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

const getCustomerPaymentStatus = async (
  req,
  res
) => {

  try {

    const requestId =
      req.params.id;


    // -----------------------------------------
    // CHECK PAYMENT REQUEST ID
    // -----------------------------------------

    if (!requestId) {

      return res.status(400).json({

        success: false,

        message:
          "Payment request ID is required.",

      });

    }


    // -----------------------------------------
    // FIND PAYMENT REQUEST
    // -----------------------------------------

    const request =
      await PaymentRequest.findById(
        requestId
      );


    if (!request) {

      return res.status(404).json({

        success: false,

        message:
          "Payment request not found.",

      });

    }


    // =================================================
    // PENDING
    // =================================================

    if (
      request.status ===
      "Pending"
    ) {

      return res.status(200).json({

        success: true,

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


    // =================================================
    // REJECTED
    // =================================================

    if (
      request.status ===
      "Rejected"
    ) {

      return res.status(200).json({

        success: true,

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


    // =================================================
    // ACCEPTED
    // =================================================

    if (
      request.status ===
        "Accepted" &&
      request.approvedBookingId
    ) {


      // -----------------------------------------
      // FIND CONFIRMED BOOKING
      // -----------------------------------------

      const booking =
        await Booking.findById(
          request.approvedBookingId
        ).lean();


      // -----------------------------------------
      // BOOKING NOT FOUND YET
      // -----------------------------------------

      if (!booking) {

        return res.status(200).json({

          success: true,

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


      // -----------------------------------------
      // BOOKING FOUND
      // -----------------------------------------

      return res.status(200).json({

        success: true,

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


    // =================================================
    // OTHER STATUS
    // =================================================

    return res.status(200).json({

      success: true,

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

      success: false,

      message:
        error.message ||
        "Failed to check payment status.",

    });

  }

};


// =========================================================
// GET PENDING PAYMENT COUNT
// =========================================================

const getPendingPaymentCount =
  async (req, res) => {

    try {

      const count =
        await PaymentRequest.countDocuments({

          status:
            "Pending",

        });


      return res.status(200).json({

        success: true,

        count,

      });

    } catch (error) {

      console.error(
        "PENDING PAYMENT COUNT ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

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


    // -----------------------------------------
    // FIND PAYMENT REQUEST
    // -----------------------------------------

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


    // -----------------------------------------
    // ONLY PENDING CAN BE ACCEPTED
    // -----------------------------------------

    if (
      request.status !==
      "Pending"
    ) {

      return res.status(400).json({

        success: false,

        message:
          `Payment request is already ${request.status}.`,

      });

    }


    // -----------------------------------------
    // BOOKING DATA CHECK
    // -----------------------------------------

    if (!request.bookingData) {

      return res.status(400).json({

        success: false,

        message:
          "Booking data is missing from payment request.",

      });

    }


    // -----------------------------------------
    // COPY BOOKING DATA
    // -----------------------------------------

    const bookingData =
      JSON.parse(
        JSON.stringify(
          request.bookingData
        )
      );


    // =================================================
    // CREATE CONFIRMED BOOKING
    // =================================================

    const fakeReq = {

      body: {

        ...bookingData,


        // -----------------------------------------
        // BAGGAGE
        // -----------------------------------------

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


        // -----------------------------------------
        // WHATSAPP
        // -----------------------------------------

        whatsappNumber:

          request.whatsappNumber ||

          bookingData?.whatsappNumber ||

          "",


        // -----------------------------------------
        // PAYMENT
        // -----------------------------------------

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

      user:
        req.user,

    };


    let createdBooking = null;


    // =================================================
    // CREATE BOOKING
    // =================================================

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
                null;

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


    // -----------------------------------------
    // CHECK BOOKING
    // -----------------------------------------

    if (!createdBooking) {

      throw new Error(
        "Booking was not created."
      );

    }


    // =================================================
    // UPDATE PAYMENT REQUEST
    // =================================================

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


    await request.save();


    // =================================================
    // SEND TICKET
    // =================================================

    try {

      await sendTicketEmail(
        request.customerEmail,
        createdBooking
      );

    } catch (emailError) {

      console.error(
        "CUSTOMER TICKET EMAIL ERROR:",
        emailError
      );

    }


    // =================================================
    // WHATSAPP TICKET
    // =================================================

    try {

      if (
        request.whatsappNumber
      ) {

        await sendTicketWhatsApp({

          to:
            request.whatsappNumber,

          booking:
            createdBooking,

        });

      }

    } catch (whatsappError) {

      console.error(
        "CUSTOMER TICKET WHATSAPP ERROR:",
        whatsappError
      );

    }


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({

      success: true,

      message:
        "Payment accepted and booking confirmed successfully.",

      paymentRequest:
        request,

      booking:
        createdBooking,

      ticketStatus: {

        email:
          "sent",

        whatsapp:
          request.whatsappNumber
            ? "sent"
            : "not_available",

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


    if (
      request.status !==
      "Pending"
    ) {

      return res.status(400).json({

        success: false,

        message:
          `Payment request is already ${request.status}.`,

      });

    }


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
        "Failed to reject payment.",

    });

  }

};


// =========================================================
// EMAIL ACCEPT PAYMENT
// =========================================================

const emailAcceptPaymentRequest =
  async (req, res) => {

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

        <html>

          <head>

            <title>
              Saiyed Travels
            </title>

          </head>

          <body
            style="
              font-family:Arial;
              padding:40px;
              text-align:center;
            "
          >

            <h2>
              Payment Approval
            </h2>

            <p>
              Please use the Admin Dashboard
              to accept this payment request.
            </p>

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
// EMAIL REJECT PAYMENT
// =========================================================

const emailRejectPaymentRequest =
  async (req, res) => {

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

        <html>

          <head>

            <title>
              Saiyed Travels
            </title>

          </head>

          <body
            style="
              font-family:Arial;
              padding:40px;
              text-align:center;
            "
          >

            <h2>
              Payment Rejection
            </h2>

            <p>
              Please use the Admin Dashboard
              to reject this payment request.
            </p>

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

module.exports = {

  createPaymentRequest,

  getAllPaymentRequests,

  getPaymentRequestById,

  getCustomerPaymentStatus,

  getPendingPaymentCount,

  acceptPaymentRequest,

  rejectPaymentRequest,

  emailAcceptPaymentRequest,

  emailRejectPaymentRequest,

};