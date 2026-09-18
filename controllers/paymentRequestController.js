
// const crypto = require("crypto");

// const PaymentRequest = require("../models/PaymentRequest");
// const User = require("../models/User");

// const bookingController = require("./bookingController");

// const {
//   sendAdminPaymentNotification,
//   sendTicketEmail,
// } = require("../services/emailService");


// // =========================================================
// // ADMIN EMAIL
// // =========================================================

// const getAdminEmail = async () => {

//   const admin = await User.findOne({
//     role: "admin",
//     isActive: true,
//   }).select("email");

//   if (!admin || !admin.email) {
//     throw new Error(
//       "Active admin email not found."
//     );
//   }

//   return admin.email;
// };


// // =========================================================
// // CREATE PAYMENT REQUEST
// // CUSTOMER
// // =========================================================

// const createPaymentRequest = async (
//   req,
//   res
// ) => {

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
//     // VALIDATION
//     // -----------------------------------------

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


//     if (!bankName) {

//       return res.status(400).json({
//         success: false,
//         message: "Bank name is required.",
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
//         message:
//           "Payment date and time is required.",
//       });

//     }


//     if (!customerEmail) {

//       return res.status(400).json({
//         success: false,
//         message:
//           "Customer email is required.",
//       });

//     }


//     if (!req.file) {

//       return res.status(400).json({
//         success: false,
//         message:
//           "Payment screenshot is required.",
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
//         message:
//           "Invalid booking data format.",
//       });

//     }


//     // -----------------------------------------
//     // SCREENSHOT PATH
//     // -----------------------------------------

//     const screenshot =
//       `/uploads/payment-screenshots/${req.file.filename}`;


//     // -----------------------------------------
//     // CREATE REQUEST
//     // -----------------------------------------

//     const paymentRequest =
//       await PaymentRequest.create({

//         bookingData:
//           parsedBookingData,

//         amount:
//           Number(amount),

//         bankName:
//           bankName.trim(),

//         paymentId:
//           paymentId.trim(),

//         paymentDateTime:
//           new Date(paymentDateTime),

//         customerEmail:
//           customerEmail
//             .trim()
//             .toLowerCase(),

//         screenshot,

//         status:
//           "Pending",

//         adminNote:
//           "",

//       });


//     // -----------------------------------------
//     // EMAIL ACTION TOKEN
//     // -----------------------------------------

//     const rawAdminActionToken =
//       crypto.randomBytes(32).toString("hex");


//     const hashedAdminActionToken =
//       crypto
//         .createHash("sha256")
//         .update(rawAdminActionToken)
//         .digest("hex");


//     paymentRequest.adminActionToken =
//       hashedAdminActionToken;

//     paymentRequest.adminActionTokenExpires =
//       new Date(
//         Date.now() +
//           7 * 24 * 60 * 60 * 1000
//       );


//     await paymentRequest.save();


//     // -----------------------------------------
//     // GET ADMIN EMAIL
//     // -----------------------------------------

//     let adminEmail = null;

//     try {

//       adminEmail =
//         await getAdminEmail();

//     } catch (error) {

//       console.error(
//         "ADMIN EMAIL ERROR:",
//         error.message
//       );

//     }


//     // -----------------------------------------
//     // SEND ADMIN NOTIFICATION
//     // -----------------------------------------

//     try {

//       await sendAdminPaymentNotification({

//         paymentRequest,

//         adminActionToken:
//           rawAdminActionToken,

//         adminEmail,

//       });

//       console.log(
//         "Admin payment notification sent to:",
//         adminEmail
//       );

//     } catch (emailError) {

//       console.error(
//         "ADMIN PAYMENT EMAIL ERROR:",
//         emailError
//       );

//       // Payment request remains saved.
//     }


//     // -----------------------------------------
//     // RESPONSE
//     // -----------------------------------------

//     return res.status(201).json({

//       success: true,

//       message:
//         "Payment request submitted successfully. Admin will verify your payment and confirm the ticket.",

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
//         "Server error while creating payment request.",

//       error:
//         error.message,

//     });

//   }

// };


// // =========================================================
// // GET ALL PAYMENT REQUESTS
// // ADMIN
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
//         })
//         .lean();


//     return res.status(200).json({

//       success: true,

//       count:
//         requests.length,

//       paymentRequests:
//         requests,

//     });


//   } catch (error) {

//     console.error(
//       "GET PAYMENT REQUESTS ERROR:",
//       error
//     );


//     return res.status(500).json({

//       success: false,

//       message:
//         "Server error while fetching payment requests.",

//     });

//   }

// };


// // =========================================================
// // GET PAYMENT REQUEST BY ID
// // ADMIN
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

//       paymentRequest:
//         request,

//     });


//   } catch (error) {

//     console.error(
//       "GET PAYMENT REQUEST ERROR:",
//       error
//     );


//     return res.status(500).json({

//       success: false,

//       message:
//         "Server error while fetching payment request.",

//     });

//   }

// };


// // =========================================================
// // PENDING PAYMENT COUNT
// // ADMIN
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
//       "PENDING PAYMENT COUNT ERROR:",
//       error
//     );


//     return res.status(500).json({

//       success: false,

//       message:
//         "Server error while getting pending payment count.",

//     });

//   }

// };


// // =========================================================
// // CREATE CONFIRMED BOOKING
// // =========================================================

// const createConfirmedBooking = async (
//   paymentRequest,
//   adminUser
// ) => {

//   return new Promise(
//     async (resolve, reject) => {

//       try {

//         let bookingResult = null;


//         // -----------------------------------------
//         // FAKE REQUEST
//         // -----------------------------------------

//         const fakeReq = {

//           body: {

//             ...paymentRequest.bookingData,

//             paymentVerified:
//               true,

//             paymentStatus:
//               "Paid",

//             bookingStatus:
//               "Confirmed",

//             paymentMethod:
//               paymentRequest.bankName,

//             paymentId:
//               paymentRequest.paymentId,

//             amount:
//               paymentRequest.amount,

//           },

//           user:
//             adminUser || null,

//         };


//         // -----------------------------------------
//         // FAKE RESPONSE
//         // -----------------------------------------

//         const fakeRes = {

//           status(code) {

//             return {

//               json(data) {

//                 if (code >= 400) {

//                   reject(
//                     new Error(
//                       data?.message ||
//                         "Booking creation failed."
//                     )
//                   );

//                 } else {

//                   bookingResult =
//                     data;

//                   resolve(data);

//                 }

//               },

//             };

//           },

//           json(data) {

//             bookingResult =
//               data;

//             resolve(data);

//           },

//         };


//         await bookingController.createBooking(
//           fakeReq,
//           fakeRes
//         );


//       } catch (error) {

//         reject(error);

//       }

//     }
//   );

// };


// // =========================================================
// // ACCEPT PAYMENT REQUEST
// // ADMIN DASHBOARD
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


//     // -----------------------------------------
//     // ALREADY PROCESSED
//     // -----------------------------------------

//     if (
//       String(request.status)
//         .toLowerCase() !==
//       "pending"
//     ) {

//       return res.status(400).json({

//         success: false,

//         message:
//           `Payment request is already ${request.status}.`,

//       });

//     }


//     // -----------------------------------------
//     // ADMIN NOTE
//     // -----------------------------------------

//     const adminNote =
//       req.body?.adminNote || "";


//     // -----------------------------------------
//     // ADMIN USER
//     // -----------------------------------------

//     const adminUser =
//       req.user || null;


//     // -----------------------------------------
//     // CREATE BOOKING
//     // -----------------------------------------

//     const bookingResponse =
//       await createConfirmedBooking(
//         request,
//         adminUser
//       );


//     if (
//       !bookingResponse ||
//       bookingResponse.success === false
//     ) {

//       throw new Error(
//         bookingResponse?.message ||
//           "Booking could not be confirmed."
//       );

//     }


//     // -----------------------------------------
//     // GET BOOKING
//     // -----------------------------------------

//     const booking =
//       bookingResponse.booking ||
//       bookingResponse.data ||
//       bookingResponse;


//     // -----------------------------------------
//     // UPDATE PAYMENT REQUEST
//     // -----------------------------------------

//     request.status =
//       "Accepted";

//     request.adminNote =
//       adminNote;

//     request.paymentVerified =
//       true;

//     request.paymentStatus =
//       "Paid";

//     request.bookingStatus =
//       "Confirmed";


//     if (booking?._id) {

//       request.bookingId =
//         booking._id;

//     }


//     await request.save();


//     // -----------------------------------------
//     // CUSTOMER TICKET EMAIL
//     // -----------------------------------------

//     let customerEmailSent =
//       false;

//     try {

//       await sendTicketEmail({

//         to:
//           request.customerEmail,

//         booking,

//       });

//       customerEmailSent =
//         true;

//       console.log(
//         "Customer ticket email sent to:",
//         request.customerEmail
//       );

//     } catch (emailError) {

//       console.error(
//         "CUSTOMER TICKET EMAIL ERROR:",
//         emailError
//       );

//     }


//     // -----------------------------------------
//     // ADMIN EMAIL
//     // USE LOGGED-IN ADMIN EMAIL
//     // -----------------------------------------

//     let adminEmail = null;

//     try {

//       // First preference:
//       // logged-in admin email

//       if (
//         req.user &&
//         req.user.email
//       ) {

//         adminEmail =
//           req.user.email;

//       } else {

//         adminEmail =
//           await getAdminEmail();

//       }


//     } catch (error) {

//       console.error(
//         "ADMIN EMAIL ERROR:",
//         error.message
//       );

//     }


//     // -----------------------------------------
//     // ADMIN TICKET EMAIL
//     // -----------------------------------------

//     let adminEmailSent =
//       false;

//     if (adminEmail) {

//       try {

//         await sendTicketEmail({

//           to:
//             adminEmail,

//           booking,

//         });

//         adminEmailSent =
//           true;

//         console.log(
//           "Admin ticket email sent to:",
//           adminEmail
//         );

//       } catch (emailError) {

//         console.error(
//           "ADMIN TICKET EMAIL ERROR:",
//           emailError
//         );

//       }

//     }


//     // -----------------------------------------
//     // RESPONSE
//     // -----------------------------------------

//     return res.status(200).json({

//       success: true,

//       message:
//         "Payment accepted and booking confirmed successfully.",

//       paymentRequest:
//         request,

//       booking,

//       emails: {

//         customer:
//           customerEmailSent,

//         admin:
//           adminEmailSent,

//         adminEmail:
//           adminEmail,

//       },

//     });


//   } catch (error) {

//     console.error(
//       "ACCEPT PAYMENT REQUEST ERROR:",
//       error
//     );


//     return res.status(500).json({

//       success: false,

//       message:
//         error.message ||
//         "Server error while accepting payment.",

//     });

//   }

// };


// // =========================================================
// // REJECT PAYMENT REQUEST
// // ADMIN DASHBOARD
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


//     // -----------------------------------------
//     // ALREADY PROCESSED
//     // -----------------------------------------

//     if (
//       String(request.status)
//         .toLowerCase() !==
//       "pending"
//     ) {

//       return res.status(400).json({

//         success: false,

//         message:
//           `Payment request is already ${request.status}.`,

//       });

//     }


//     // -----------------------------------------
//     // UPDATE
//     // -----------------------------------------

//     request.status =
//       "Rejected";

//     request.adminNote =
//       req.body?.adminNote || "";

//     request.paymentVerified =
//       false;

//     request.paymentStatus =
//       "Rejected";

//     request.bookingStatus =
//       "Rejected";


//     await request.save();


//     // -----------------------------------------
//     // NO TICKET EMAIL
//     // -----------------------------------------

//     return res.status(200).json({

//       success: true,

//       message:
//         "Payment request rejected successfully.",

//       paymentRequest:
//         request,

//     });


//   } catch (error) {

//     console.error(
//       "REJECT PAYMENT REQUEST ERROR:",
//       error
//     );


//     return res.status(500).json({

//       success: false,

//       message:
//         "Server error while rejecting payment.",

//     });

//   }

// };


// // =========================================================
// // EMAIL ACTION TOKEN VALIDATION
// // =========================================================

// const validateEmailActionToken =
//   async (
//     req,
//     res
//   ) => {

//     try {

//       const request =
//         await PaymentRequest.findById(
//           req.params.id
//         );


//       if (!request) {

//         return {
//           valid: false,
//           message:
//             "Payment request not found.",
//         };

//       }


//       if (
//         String(request.status)
//           .toLowerCase() !==
//         "pending"
//       ) {

//         return {
//           valid: false,
//           message:
//             `Payment request is already ${request.status}.`,
//         };

//       }


//       const token =
//         req.query.token;


//       if (!token) {

//         return {
//           valid: false,
//           message:
//             "Action token is missing.",
//         };

//       }


//       const hashedToken =
//         crypto
//           .createHash("sha256")
//           .update(token)
//           .digest("hex");


//       if (
//         hashedToken !==
//         request.adminActionToken
//       ) {

//         return {
//           valid: false,
//           message:
//             "Invalid action token.",
//         };

//       }


//       if (
//         request.adminActionTokenExpires &&
//         request.adminActionTokenExpires <
//           new Date()
//       ) {

//         return {
//           valid: false,
//           message:
//             "Action token has expired.",
//         };

//       }


//       return {
//         valid: true,
//         request,
//       };


//     } catch (error) {

//       console.error(
//         "EMAIL TOKEN VALIDATION ERROR:",
//         error
//       );


//       return {
//         valid: false,
//         message:
//           "Unable to validate action token.",
//       };

//     }

//   };


// // =========================================================
// // EMAIL ACCEPT
// // =========================================================

// const emailAcceptPaymentRequest =
//   async (
//     req,
//     res
//   ) => {

//     try {

//       const validation =
//         await validateEmailActionToken(
//           req,
//           res
//         );


//       if (!validation.valid) {

//         return res.status(400).send(
//           `<h2>${validation.message}</h2>`
//         );

//       }


//       const request =
//         validation.request;


//       // -----------------------------------------
//       // CREATE BOOKING
//       // -----------------------------------------

//       const bookingResponse =
//         await createConfirmedBooking(
//           request,
//           null
//         );


//       if (
//         !bookingResponse ||
//         bookingResponse.success === false
//       ) {

//         throw new Error(
//           bookingResponse?.message ||
//             "Booking could not be confirmed."
//         );

//       }


//       const booking =
//         bookingResponse.booking ||
//         bookingResponse.data ||
//         bookingResponse;


//       // -----------------------------------------
//       // UPDATE REQUEST
//       // -----------------------------------------

//       request.status =
//         "Accepted";

//       request.paymentVerified =
//         true;

//       request.paymentStatus =
//         "Paid";

//       request.bookingStatus =
//         "Confirmed";

//       request.adminActionToken =
//         undefined;

//       request.adminActionTokenExpires =
//         undefined;


//       if (booking?._id) {

//         request.bookingId =
//           booking._id;

//       }


//       await request.save();


//       // -----------------------------------------
//       // CUSTOMER EMAIL
//       // -----------------------------------------

//       try {

//         await sendTicketEmail({

//           to:
//             request.customerEmail,

//           booking,

//         });

//       } catch (emailError) {

//         console.error(
//           "EMAIL ACTION CUSTOMER TICKET ERROR:",
//           emailError
//         );

//       }


//       // -----------------------------------------
//       // ADMIN EMAIL
//       // -----------------------------------------

//       try {

//         const adminEmail =
//           await getAdminEmail();

//         await sendTicketEmail({

//           to:
//             adminEmail,

//           booking,

//         });

//       } catch (emailError) {

//         console.error(
//           "EMAIL ACTION ADMIN TICKET ERROR:",
//           emailError
//         );

//       }


//       return res.send(`

//         <html>

//           <head>

//             <title>
//               Payment Accepted
//             </title>

//             <meta
//               name="viewport"
//               content="width=device-width, initial-scale=1"
//             />

//           </head>

//           <body
//             style="
//               font-family:Arial;
//               text-align:center;
//               padding:50px;
//             "
//           >

//             <h1>
//               Payment Accepted
//             </h1>

//             <p>
//               Booking confirmed successfully.
//             </p>

//             <p>
//               Ticket has been sent to the
//               customer email.
//             </p>

//           </body>

//         </html>

//       `);


//     } catch (error) {

//       console.error(
//         "EMAIL ACCEPT ERROR:",
//         error
//       );


//       return res.status(500).send(`

//         <html>

//           <body
//             style="
//               font-family:Arial;
//               text-align:center;
//               padding:50px;
//             "
//           >

//             <h2>
//               Unable to confirm payment.
//             </h2>

//             <p>
//               ${error.message}
//             </p>

//           </body>

//         </html>

//       `);

//     }

//   };


// // =========================================================
// // EMAIL REJECT
// // =========================================================

// const emailRejectPaymentRequest =
//   async (
//     req,
//     res
//   ) => {

//     try {

//       const validation =
//         await validateEmailActionToken(
//           req,
//           res
//         );


//       if (!validation.valid) {

//         return res.status(400).send(
//           `<h2>${validation.message}</h2>`
//         );

//       }


//       const request =
//         validation.request;


//       request.status =
//         "Rejected";

//       request.paymentVerified =
//         false;

//       request.paymentStatus =
//         "Rejected";

//       request.bookingStatus =
//         "Rejected";

//       request.adminActionToken =
//         undefined;

//       request.adminActionTokenExpires =
//         undefined;


//       await request.save();


//       return res.send(`

//         <html>

//           <head>

//             <title>
//               Payment Rejected
//             </title>

//             <meta
//               name="viewport"
//               content="width=device-width, initial-scale=1"
//             />

//           </head>

//           <body
//             style="
//               font-family:Arial;
//               text-align:center;
//               padding:50px;
//             "
//           >

//             <h1>
//               Payment Rejected
//             </h1>

//             <p>
//               The payment request has been rejected.
//             </p>

//           </body>

//         </html>

//       `);


//     } catch (error) {

//       console.error(
//         "EMAIL REJECT ERROR:",
//         error
//       );


//       return res.status(500).send(`

//         <html>

//           <body
//             style="
//               font-family:Arial;
//               text-align:center;
//               padding:50px;
//             "
//           >

//             <h2>
//               Unable to reject payment.
//             </h2>

//             <p>
//               ${error.message}
//             </p>

//           </body>

//         </html>

//       `);

//     }

//   };


// // =========================================================
// // EXPORT
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
const User = require("../models/User");
const bookingController = require("./bookingController");

const {
  sendAdminPaymentNotification,
  sendTicketEmail,
} = require("../services/emailService");


// =========================================================
// GET ADMIN EMAIL
// =========================================================

const getAdminEmail = async () => {
  const admin = await User.findOne({
    role: "admin",
    isActive: true,
  }).sort({ createdAt: -1 });

  if (!admin) {
    throw new Error("Active admin account not found.");
  }

  if (!admin.email) {
    throw new Error("Admin email is missing.");
  }

  return admin.email.trim().toLowerCase();
};


// =========================================================
// CREATE PAYMENT REQUEST
// =========================================================

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


    // ---------------- VALIDATION ----------------

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


    // ---------------- BOOKING DATA ----------------

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


    // ---------------- PAYMENT DATE ----------------

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


    // ---------------- SCREENSHOT ----------------

    const screenshotPath =
      `/uploads/payment-screenshots/${screenshot.filename}`;


    // =====================================================
    // CREATE PAYMENT REQUEST
    // =====================================================

    const request =
      await PaymentRequest.create({

        bookingData:
          parsedBookingData,

        amount:
          Number(amount),

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

        status:
          "Pending",

        adminActionToken:
          null,

        adminActionTokenExpiresAt:
          null,

      });


    // =====================================================
    // CREATE EMAIL ACTION TOKEN
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
        7 * 24 * 60 * 60 * 1000
      );


    request.adminActionToken =
      tokenHash;

    request.adminActionTokenExpiresAt =
      tokenExpiry;

    await request.save();


    // =====================================================
    // FIND ADMIN EMAIL
    // =====================================================

    let adminEmail;

    try {

      adminEmail =
        await getAdminEmail();

      console.log(
        "===================================="
      );

      console.log(
        "ADMIN PAYMENT EMAIL:"
      );

      console.log(
        adminEmail
      );

      console.log(
        "===================================="
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
          "===================================="
        );

        console.error(
          "ADMIN PAYMENT EMAIL FAILED"
        );

        console.error(
          emailError
        );

        console.error(
          "===================================="
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
// =========================================================

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

      success:
        true,

      count:
        requests.length,

      paymentRequests:
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
        "Failed to fetch payment requests.",

    });

  }

};


// =========================================================
// GET SINGLE PAYMENT REQUEST
// =========================================================

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

        success:
          false,

        message:
          "Payment request not found.",

      });

    }

    return res.status(200).json({

      success:
        true,

      paymentRequest:
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
        "Failed to fetch payment request.",

    });

  }

};


// =========================================================
// GET PENDING COUNT
// =========================================================

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

      success:
        true,

      count,

    });

  } catch (error) {

    console.error(
      "GET PENDING COUNT ERROR:",
      error
    );

    return res.status(500).json({

      success:
        false,

      message:
        "Failed to get pending payment count.",

    });

  }

};


// =========================================================
// CREATE CONFIRMED BOOKING
// =========================================================

const createConfirmedBooking = async (
  request
) => {

  return new Promise(
    (resolve, reject) => {

      let responseSent =
        false;


      const fakeResponse = {

        status: function (
          statusCode
        ) {

          return {

            json: function (
              data
            ) {

              responseSent =
                true;

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


        json: function (
          data
        ) {

          if (responseSent) {
            return data;
          }

          responseSent =
            true;

          resolve(data);

          return data;

        },

      };


      const fakeRequest = {

        body: {

          ...request.bookingData,

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

        user: {

          role:
            "admin",

          userRole:
            "admin",

          accountType:
            "admin",

        },

        headers: {},

        get: () =>
          undefined,

      };


      Promise.resolve(

        bookingController.createBooking(
          fakeRequest,
          fakeResponse
        )

      ).catch(
        reject
      );

    }
  );

};


// =========================================================
// SEND TICKETS
// =========================================================

const sendConfirmedTickets = async (
  request,
  createdBooking,
  adminEmail
) => {

  let customerEmailSent =
    false;

  let adminEmailSent =
    false;


  // =====================================================
  // CUSTOMER PDF
  // =====================================================

  try {

    const customerEmail =
      String(
        request.customerEmail || ""
      )
        .trim()
        .toLowerCase();


    if (!customerEmail) {

      throw new Error(
        "Customer email is missing."
      );

    }


    await sendTicketEmail({

      to:
        customerEmail,

      booking:
        createdBooking,

    });


    customerEmailSent =
      true;


    console.log(
      "CUSTOMER TICKET PDF SENT TO:",
      customerEmail
    );


  } catch (error) {

    console.error(
      "CUSTOMER TICKET EMAIL ERROR:",
      error
    );

  }


  // =====================================================
  // ADMIN PDF
  // =====================================================

  try {

    if (!adminEmail) {

      throw new Error(
        "Admin email is missing."
      );

    }


    await sendTicketEmail({

      to:
        adminEmail,

      booking:
        createdBooking,

    });


    adminEmailSent =
      true;


    console.log(
      "ADMIN TICKET PDF SENT TO:",
      adminEmail
    );


  } catch (error) {

    console.error(
      "ADMIN TICKET EMAIL ERROR:",
      error
    );

  }


  return {

    customer:
      customerEmailSent,

    admin:
      adminEmailSent,

  };

};


// =========================================================
// ACCEPT PAYMENT REQUEST
// =========================================================

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

        success:
          false,

        message:
          "Payment request not found.",

      });

    }


    if (
      request.status !== "Pending"
    ) {

      return res.status(400).json({

        success:
          false,

        message:
          `Payment request is already ${request.status}.`,

      });

    }


    const adminNote =
      req.body?.adminNote || "";


    // ===================================================
    // CREATE BOOKING
    // ===================================================

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

        success:
          false,

        message:
          bookingError.message ||
          "Booking creation failed.",

      });

    }


    // ===================================================
    // GET CREATED BOOKING
    // ===================================================

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
        "INVALID BOOKING RESULT:",
        bookingResult
      );

      return res.status(500).json({

        success:
          false,

        message:
          "Booking was not created correctly.",

      });

    }


    // ===================================================
    // GET ADMIN EMAIL
    // ===================================================

    let adminEmail =
      null;


    // Dashboard login wala admin
    if (
      req.user?.email
    ) {

      adminEmail =
        String(
          req.user.email
        )
          .trim()
          .toLowerCase();

    }


    // Email action se accept hua
    if (!adminEmail) {

      try {

        adminEmail =
          await getAdminEmail();

      } catch (error) {

        console.error(
          "ADMIN EMAIL LOOKUP ERROR:",
          error
        );

      }

    }


    // ===================================================
    // UPDATE PAYMENT REQUEST
    // ===================================================

    request.status =
      "Accepted";

    request.approvedBookingId =
      bookingId;

    request.adminNote =
      adminNote;

    request.processedAt =
      new Date();

    request.adminActionToken =
      null;

    request.adminActionTokenExpiresAt =
      null;


    await request.save();


    // ===================================================
    // SEND CUSTOMER + ADMIN PDF
    // ===================================================

    const emailStatus =
      await sendConfirmedTickets(
        request,
        createdBooking,
        adminEmail
      );


    // ===================================================
    // RESPONSE
    // ===================================================

    return res.status(200).json({

      success:
        true,

      message:
        "Payment accepted and booking confirmed successfully.",

      booking:
        createdBooking,

      paymentRequest:
        request,

      emailStatus:

        emailStatus,

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
        "Failed to accept payment request.",

    });

  }

};


// =========================================================
// REJECT PAYMENT REQUEST
// =========================================================

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

        success:
          false,

        message:
          "Payment request not found.",

      });

    }


    if (
      request.status !== "Pending"
    ) {

      return res.status(400).json({

        success:
          false,

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

    request.adminActionToken =
      null;

    request.adminActionTokenExpiresAt =
      null;


    await request.save();


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
        "Failed to reject payment request.",

    });

  }

};


// =========================================================
// VALIDATE EMAIL ACTION TOKEN
// =========================================================

const validateEmailActionToken = async (
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


  if (
    request.status !== "Pending"
  ) {

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
    request.adminActionTokenExpiresAt < new Date()
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


  const storedHash =
    String(
      request.adminActionToken
    );


  if (
    tokenHash.length !==
    storedHash.length
  ) {

    throw new Error(
      "Invalid email action token."
    );

  }


  const tokenMatches =
    crypto.timingSafeEqual(
      Buffer.from(tokenHash),
      Buffer.from(storedHash)
    );


  if (!tokenMatches) {

    throw new Error(
      "Invalid email action token."
    );

  }


  return request;

};


// =========================================================
// EMAIL ACCEPT
// =========================================================

const emailAcceptPaymentRequest =
  async (
    req,
    res
  ) => {

    try {

      const request =
        await validateEmailActionToken(
          req.params.id,
          req.query.token
        );


      let result;


      const fakeRequest = {

        params: {

          id:
            request._id,

        },

        body: {

          adminNote:
            "Accepted from admin email.",

        },

      };


      const fakeResponse = {

        status: function (
          statusCode
        ) {

          return {

            json: function (
              data
            ) {

              result = {

                statusCode:
                  statusCode,

                data:
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
                padding:50px;
              ">

                <h1>
                  ❌ Payment Acceptance Failed
                </h1>

                <p>
                  ${message}
                </p>

              </body>

            </html>

          `);

      }


      return res
        .status(200)
        .send(`

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
                  ✅
                </div>

                <h1>
                  Payment Accepted
                </h1>

                <p>
                  Payment has been verified
                  and the booking has been confirmed.
                </p>

                <p>
                  Ticket PDF has been sent
                  to the customer and admin.
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


      return res
        .status(400)
        .send(`

          <html>

            <head>

              <title>
                Saiyed Travels
              </title>

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


// =========================================================
// EMAIL REJECT
// =========================================================

const emailRejectPaymentRequest =
  async (
    req,
    res
  ) => {

    try {

      const request =
        await validateEmailActionToken(
          req.params.id,
          req.query.token
        );


      let result;


      const fakeRequest = {

        params: {

          id:
            request._id,

        },

        body: {

          adminNote:
            "Rejected from admin email.",

        },

      };


      const fakeResponse = {

        status: function (
          statusCode
        ) {

          return {

            json: function (
              data
            ) {

              result = {

                statusCode:
                  statusCode,

                data:
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


      return res
        .status(200)
        .send(`

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


      return res
        .status(400)
        .send(`

          <html>

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


// =========================================================
// EXPORTS
// =========================================================

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