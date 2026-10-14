const crypto = require("crypto");
const mongoose = require("mongoose");
const PaymentRequest = require("../models/PaymentRequest");
const Booking = require("../models/Booking");
const User = require("../models/User");
const bookingController = require("./bookingController");

const {
  sendAdminPaymentNotification,
  sendTicketEmail,
  generateTicketPdf,
} = require("../services/emailService");


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

































// ============================================
// COMPLETE TICKET DATA WITH ALL PASSENGERS
// ============================================

const ticketBooking = {
  ...bookingData,
  ...savedBooking,

  _id: createdBooking._id,

  bookingId:
    savedBooking.bookingId ||
    String(createdBooking._id),

  // Passenger details
  name:
    savedBooking.name ||
    savedBooking.passengerName ||
    bookingData.name ||
    bookingData.passengerName ||
    `${passengerList[0]?.firstName || ""} ${
      passengerList[0]?.lastName || ""
    }`.trim(),

  passengerName:
    savedBooking.passengerName ||
    bookingData.passengerName ||
    bookingData.name ||
    `${passengerList[0]?.firstName || ""} ${
      passengerList[0]?.lastName || ""
    }`.trim(),

  passenger:
    savedBooking.passenger ||
    passengerList[0] ||
    bookingData.passenger ||
    {},

  // Keep every passenger and their available details
  passengers: passengerList.map((p) => ({
    ...p,
    firstName:
      p.firstName ||
      p.givenName ||
      p.name?.split(/\s+/)[0] ||
      p.fullName?.split(/\s+/)[0] ||
      "",
    lastName:
      p.lastName ||
      p.surname ||
      p.name?.split(/\s+/).slice(1).join(" ") ||
      p.fullName?.split(/\s+/).slice(1).join(" ") ||
      "",
    fullName:
      p.fullName ||
      p.name ||
      `${p.firstName || p.givenName || ""} ${
        p.lastName || p.surname || ""
      }`.trim(),
    type: p.type || "Adult",
    email: p.email || customerEmail,
    phone: p.phone || whatsappNumber,
  })),

  passengerDetails: passengerList.map((p) => ({
    ...p,
    firstName:
      p.firstName ||
      p.givenName ||
      p.name?.split(/\s+/)[0] ||
      p.fullName?.split(/\s+/)[0] ||
      "",
    lastName:
      p.lastName ||
      p.surname ||
      p.name?.split(/\s+/).slice(1).join(" ") ||
      p.fullName?.split(/\s+/).slice(1).join(" ") ||
      "",
    fullName:
      p.fullName ||
      p.name ||
      `${p.firstName || p.givenName || ""} ${
        p.lastName || p.surname || ""
      }`.trim(),
    type: p.type || "Adult",
    email: p.email || customerEmail,
    phone: p.phone || whatsappNumber,
  })),

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

// Generate PDF using complete ticket data
const ticketPdfBuffer = await generateTicketPdf(ticketBooking);

if (
  !Buffer.isBuffer(ticketPdfBuffer) ||
  ticketPdfBuffer.length === 0
) {
  throw new Error("Ticket PDF could not be generated.");
}









    // const savedBooking =
    //   typeof createdBooking.toObject === "function"
    //     ? createdBooking.toObject()
    //     : createdBooking;

    // const ticketBooking = {
    //   ...bookingData,
    //   ...savedBooking,
    //   _id: createdBooking._id,
    //   bookingId:
    //     savedBooking.bookingId ||
    //     String(createdBooking._id),
    //   name:
    //     savedBooking.name ||
    //     savedBooking.passengerName ||
    //     bookingData.name ||
    //     bookingData.passengerName ||
    //     `${passengerList[0].firstName || ""} ${
    //       passengerList[0].lastName || ""
    //     }`.trim(),
    //   passengerName:
    //     savedBooking.passengerName ||
    //     bookingData.passengerName ||
    //     bookingData.name ||
    //     `${passengerList[0].firstName || ""} ${
    //       passengerList[0].lastName || ""
    //     }`.trim(),
    //   passenger: savedBooking.passenger || passengerList[0],
    //   passengers:
    //     savedBooking.passengers?.length > 0
    //       ? savedBooking.passengers
    //       : passengerList,
    //   passengerDetails:
    //     savedBooking.passengerDetails?.length > 0
    //       ? savedBooking.passengerDetails
    //       : passengerList,
    //   email: customerEmail,
    //   customerEmail,
    //   phone: whatsappNumber,
    //   whatsappNumber,
    //   amount: Number(request.amount),
    //   totalAmount: Number(request.amount),
    //   paymentMethod: request.bankName,
    //   paymentId: request.paymentId,
    //   flight:
    //     savedBooking.flight ||
    //     bookingData.flight ||
    //     bookingData.flightDetails ||
    //     bookingData.selectedFlight ||
    //     bookingData.flightData ||
    //     {},
    //   flightDetails:
    //     savedBooking.flightDetails ||
    //     bookingData.flightDetails ||
    //     {},
    //   selectedFlight:
    //     savedBooking.selectedFlight ||
    //     bookingData.selectedFlight ||
    //     {},
    //   flightData:
    //     savedBooking.flightData ||
    //     bookingData.flightData ||
    //     {},
    //   from:
    //     savedBooking.from ||
    //     bookingData.from ||
    //     bookingData.source ||
    //     bookingData.origin ||
    //     bookingData.flight?.from ||
    //     bookingData.flightDetails?.from ||
    //     bookingData.selectedFlight?.from ||
    //     bookingData.flightData?.from ||
    //     "",
    //   to:
    //     savedBooking.to ||
    //     bookingData.to ||
    //     bookingData.destination ||
    //     bookingData.flight?.to ||
    //     bookingData.flightDetails?.to ||
    //     bookingData.selectedFlight?.to ||
    //     bookingData.flightData?.to ||
    //     "",
    //   departureDate:
    //     savedBooking.departureDate ||
    //     bookingData.departureDate ||
    //     bookingData.travelDate ||
    //     bookingData.flight?.departureDate ||
    //     bookingData.flightDetails?.departureDate ||
    //     bookingData.selectedFlight?.departureDate ||
    //     bookingData.flightData?.departureDate ||
    //     "",
    //   departureTime:
    //     savedBooking.departureTime ||
    //     bookingData.departureTime ||
    //     bookingData.flight?.departureTime ||
    //     bookingData.flightDetails?.departureTime ||
    //     bookingData.selectedFlight?.departureTime ||
    //     bookingData.flightData?.departureTime ||
    //     "",
    //   arrivalDate:
    //     savedBooking.arrivalDate ||
    //     bookingData.arrivalDate ||
    //     bookingData.flight?.arrivalDate ||
    //     bookingData.flightDetails?.arrivalDate ||
    //     bookingData.selectedFlight?.arrivalDate ||
    //     bookingData.flightData?.arrivalDate ||
    //     "",
    //   arrivalTime:
    //     savedBooking.arrivalTime ||
    //     bookingData.arrivalTime ||
    //     bookingData.flight?.arrivalTime ||
    //     bookingData.flightDetails?.arrivalTime ||
    //     bookingData.selectedFlight?.arrivalTime ||
    //     bookingData.flightData?.arrivalTime ||
    //     "",
    //   baggage:
    //     savedBooking.baggage ||
    //     bookingData.baggage ||
    //     bookingData.flight?.baggage ||
    //     bookingData.flightDetails?.baggage ||
    //     bookingData.selectedFlight?.baggage ||
    //     bookingData.flightData?.baggage ||
    //     {},
    //   cabinBaggage:
    //     savedBooking.cabinBaggage ||
    //     bookingData.cabinBaggage ||
    //     "",
    //   checkinBaggage:
    //     savedBooking.checkinBaggage ||
    //     bookingData.checkinBaggage ||
    //     "",
    // };

    // // const ticketPdfBuffer = await generateSuccessTicketPdf(ticketBooking);
    // const ticketPdfBuffer = await generateTicketPdf(ticketBooking);

    // if (!Buffer.isBuffer(ticketPdfBuffer) || ticketPdfBuffer.length === 0) {
    //   throw new Error("Ticket PDF could not be generated.");
    // }





































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