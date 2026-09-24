
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
      return String(process.env.ADMIN_EMAIL)
        .trim()
        .toLowerCase();
    }

    // Second priority: EMAIL_USER
    if (process.env.EMAIL_USER) {
      return String(process.env.EMAIL_USER)
        .trim()
        .toLowerCase();
    }

    // Third priority: Database admin
    const admin = await User.findOne({
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

    return String(admin.email)
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
    // CUSTOMER EMAIL FALLBACK
    // -----------------------------------------------------

    // const finalCustomerEmail =
    //   String(
    //     customerEmail ||
    //       parsedBookingData?.customerEmail ||
    //       parsedBookingData?.email ||
    //       parsedBookingData?.userEmail ||
    //       ""
    //   )
    //     .trim()
    //     .toLowerCase();


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

// CUSTOMER EMAIL REQUIRED
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
      new Date(paymentDateTime);


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

        bankName,

        paymentId:
          String(paymentId).trim(),

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

    let adminEmail = null;

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

      success: true,

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

      success: false,

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

        requests:
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
// GET /api/payment-requests/:id
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

        request:
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

const getCustomerPaymentStatus =
  async (req, res) => {

    try {

      const requestId =
        req.params.id;


      if (!requestId) {

        return res.status(400).json({

          success: false,

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

          success: false,

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

          success: false,

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


      // ===================================================
      // REJECTED
      // ===================================================

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





























//       // =========================================================
// // DELETE PAYMENT REQUEST
// // DELETE /api/payment-requests/:id
// //
// // Pending request cannot be deleted.
// // Accepted / Rejected request can be deleted.
// // IMPORTANT:
// // This only deletes PaymentRequest.
// // Confirmed Booking will NOT be deleted.
// // =========================================================

// const deletePaymentRequest = async (req, res) => {
//   try {
//     const request = await PaymentRequest.findById(
//       req.params.id
//     );

//     // -------------------------------------------------------
//     // REQUEST NOT FOUND
//     // -------------------------------------------------------

//     if (!request) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment request not found.",
//       });
//     }

//     // -------------------------------------------------------
//     // PENDING CANNOT BE DELETED
//     // -------------------------------------------------------

//     if (
//       String(request.status).toLowerCase() ===
//       "pending"
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Pending payment request cannot be deleted. Accept or reject it first.",
//       });
//     }

//     // -------------------------------------------------------
//     // DELETE PAYMENT REQUEST
//     // -------------------------------------------------------

//     await PaymentRequest.findByIdAndDelete(
//       req.params.id
//     );

//     return res.status(200).json({
//       success: true,
//       message:
//         "Payment request deleted successfully.",
//     });
//   } catch (error) {
//     console.error(
//       "DELETE PAYMENT REQUEST ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "Failed to delete payment request.",
//     });
//   }
// };
























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


      // ===================================================
      // OTHER STATUS
      // ===================================================

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
// GET /api/payment-requests/pending-count
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

        count:
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

const acceptPaymentRequest =
  async (req, res) => {

    try {

      const {
        adminNote,
      } = req.body || {};


      // ---------------------------------------------------
      // FIND PAYMENT REQUEST
      // ---------------------------------------------------

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


      // ---------------------------------------------------
      // ONLY PENDING CAN BE ACCEPTED
      // ---------------------------------------------------

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


      // ---------------------------------------------------
      // BOOKING DATA CHECK
      // ---------------------------------------------------

      if (!request.bookingData) {

        return res.status(400).json({

          success: false,

          message:
            "Booking data is missing from payment request.",

        });

      }


      // ---------------------------------------------------
      // COPY BOOKING DATA
      // ---------------------------------------------------

      const bookingData =
        JSON.parse(
          JSON.stringify(
            request.bookingData
          )
        );


      // ===================================================
      // CUSTOMER EMAIL
      // ===================================================

      const customerEmail =
        String(
          request.customerEmail ||
            bookingData?.customerEmail ||
            bookingData?.email ||
            bookingData?.userEmail ||
            ""
        )
          .trim()
          .toLowerCase();


      // ===================================================
      // CUSTOMER WHATSAPP
      // ===================================================

      const whatsappNumber =
        String(
          request.whatsappNumber ||
            bookingData?.whatsappNumber ||
            bookingData?.phone ||
            bookingData?.mobile ||
            ""
        ).trim();


      // ===================================================
      // CREATE CONFIRMED BOOKING
      // ===================================================




const fakeReq = {
  body: {
    ...bookingData,

    // IMPORTANT:
    // Customer ka original userId preserve karo
    userId:
      bookingData?.userId ||
      bookingData?.user?._id ||
      bookingData?.user?.id ||
      null,

    // ------------------------------------------------
    // CUSTOMER EMAIL
    // ------------------------------------------------
    customerEmail: customerEmail,

    email:
      bookingData?.email ||
      customerEmail,

    // ------------------------------------------------
    // BAGGAGE
    // ------------------------------------------------
    baggage: {
      ...(bookingData?.baggage || {}),

      cabinBaggage:
        bookingData?.baggage?.cabinBaggage ||
        bookingData?.baggage?.cabin ||
        bookingData?.flight?.cabinBaggage ||
        bookingData?.flight?.baggage?.cabin ||
        bookingData?.cabinBaggage ||
        "",

      checkinBaggage:
        bookingData?.baggage?.checkinBaggage ||
        bookingData?.baggage?.checkin ||
        bookingData?.baggage?.weight ||
        bookingData?.flight?.checkinBaggage ||
        bookingData?.flight?.baggage?.checkin ||
        bookingData?.checkinBaggage ||
        "",
    },

    // ------------------------------------------------
    // WHATSAPP
    // ------------------------------------------------
    whatsappNumber: whatsappNumber,

    // ------------------------------------------------
    // PAYMENT
    // ------------------------------------------------
    paymentVerified: true,
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
    paymentMethod: request.bankName,
    paymentId: request.paymentId,
  },

  user: req.user,
};













































      // const fakeReq = {

      //   body: {

      //     ...bookingData,


      //     // ------------------------------------------------
      //     // CUSTOMER EMAIL
      //     // ------------------------------------------------

      //     customerEmail:
      //       customerEmail,

      //     email:
      //       bookingData?.email ||
      //       customerEmail,


      //     // ------------------------------------------------
      //     // BAGGAGE
      //     // ------------------------------------------------

      //     baggage: {

      //       ...(bookingData?.baggage || {}),


      //       cabinBaggage:

      //         bookingData?.baggage
      //           ?.cabinBaggage ||

      //         bookingData?.baggage
      //           ?.cabin ||

      //         bookingData?.flight
      //           ?.cabinBaggage ||

      //         bookingData?.flight
      //           ?.baggage
      //           ?.cabin ||

      //         bookingData?.cabinBaggage ||

      //         "",


      //       checkinBaggage:

      //         bookingData?.baggage
      //           ?.checkinBaggage ||

      //         bookingData?.baggage
      //           ?.checkin ||

      //         bookingData?.baggage
      //           ?.weight ||

      //         bookingData?.flight
      //           ?.checkinBaggage ||

      //         bookingData?.flight
      //           ?.baggage
      //           ?.checkin ||

      //         bookingData?.checkinBaggage ||

      //         "",
      //     },


      //     // ------------------------------------------------
      //     // WHATSAPP
      //     // ------------------------------------------------

      //     whatsappNumber:
      //       whatsappNumber,


      //     // ------------------------------------------------
      //     // PAYMENT
      //     // ------------------------------------------------

      //     paymentVerified:
      //       true,

      //     paymentStatus:
      //       "Paid",

      //     bookingStatus:
      //       "Confirmed",

      //     paymentMethod:
      //       request.bankName,

      //     paymentId:
      //       request.paymentId,

      //   },


      //   user:
      //     req.user,

      // };


      let createdBooking =
        null;


      // ===================================================
      // CREATE BOOKING
      // ===================================================

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


      // ===================================================
      // CHECK BOOKING
      // ===================================================

      if (!createdBooking) {

        throw new Error(
          "Booking was not created."
        );

      }


      // ===================================================
      // UPDATE PAYMENT REQUEST
      // ===================================================

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


      // ---------------------------------------------------
      // SAVE CUSTOMER EMAIL IF IT WAS MISSING
      // ---------------------------------------------------

      if (
        customerEmail &&
        !request.customerEmail
      ) {

        request.customerEmail =
          customerEmail;

      }


      // ---------------------------------------------------
      // SAVE WHATSAPP IF IT WAS MISSING
      // ---------------------------------------------------

      if (
        whatsappNumber &&
        !request.whatsappNumber
      ) {

        request.whatsappNumber =
          whatsappNumber;

      }


      await request.save();


      // ===================================================
      // CUSTOMER TICKET EMAIL
      // ===================================================

      let customerEmailSent =
        false;


      try {

        if (!customerEmail) {

          console.error(
            "CUSTOMER TICKET EMAIL ERROR: Customer email is missing."
          );

        } else {

          await sendTicketEmail({

            to:
              customerEmail,

            booking:
              createdBooking,

          });


          customerEmailSent =
            true;


          console.log(
            "CUSTOMER TICKET PDF SENT TO EMAIL:",
            customerEmail
          );

        }

      } catch (emailError) {

        console.error(
          "CUSTOMER TICKET EMAIL ERROR:",
          emailError
        );

      }


      // ===================================================
      // ADMIN TICKET EMAIL
      // ===================================================

      let adminEmailSent =
        false;


      try {

        const adminEmail =
          await getAdminEmail();


        if (!adminEmail) {

          console.error(
            "ADMIN TICKET EMAIL ERROR: Admin email is missing."
          );

        } else {

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

        }

      } catch (adminEmailError) {

        console.error(
          "ADMIN TICKET EMAIL ERROR:",
          adminEmailError
        );

      }


      // ===================================================
      // CUSTOMER WHATSAPP TICKET
      // ===================================================

      let whatsappSent =
        false;


      try {

        if (!whatsappNumber) {

          console.error(
            "CUSTOMER TICKET WHATSAPP ERROR: WhatsApp number is missing."
          );

        } else {

          await sendTicketWhatsApp({

            to:
              whatsappNumber,

            booking:
              createdBooking,

          });


          whatsappSent =
            true;


          console.log(
            "CUSTOMER TICKET WHATSAPP SENT TO:",
            whatsappNumber
          );

        }

      } catch (whatsappError) {

        console.error(
          "CUSTOMER TICKET WHATSAPP ERROR:",
          whatsappError
        );

      }


      // ===================================================
      // RESPONSE
      // ===================================================

      return res.status(200).json({

        success: true,

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

const rejectPaymentRequest =
  async (req, res) => {

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
// DELETE PAYMENT REQUEST
// DELETE /api/payment-requests/:id
//
// Pending request cannot be deleted.
// Accepted / Rejected request can be deleted.
// IMPORTANT:
// This only deletes PaymentRequest.
// Confirmed Booking will NOT be deleted.
// =========================================================

const deletePaymentRequest = async (req, res) => {
  try {
    const request = await PaymentRequest.findById(
      req.params.id
    );

    // -------------------------------------------------------
    // REQUEST NOT FOUND
    // -------------------------------------------------------

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Payment request not found.",
      });
    }

    // -------------------------------------------------------
    // PENDING CANNOT BE DELETED
    // -------------------------------------------------------

    if (
      String(request.status).toLowerCase() ===
      "pending"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Pending payment request cannot be deleted. Accept or reject it first.",
      });
    }

    // -------------------------------------------------------
    // DELETE PAYMENT REQUEST
    // -------------------------------------------------------

    await PaymentRequest.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Payment request deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE PAYMENT REQUEST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete payment request.",
    });
  }
};







// =========================================================
// EMAIL ACCEPT PAYMENT
// GET/POST /email-accept
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