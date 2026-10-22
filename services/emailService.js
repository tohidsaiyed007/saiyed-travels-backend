const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");



const sendEmailViaResend = async ({
  to,
  subject,
  html,
  attachments = [],
}) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing in Render Environment.");
  }

  if (!fromEmail) {
    throw new Error("RESEND_FROM_EMAIL is missing in Render Environment.");
  }

  if (!to) {
    throw new Error("Email recipient is missing.");
  }

  const fromName = process.env.RESEND_FROM_NAME || "Saiyed Travels";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${fromName} <${fromEmail}>`,
      to: [to],
      subject,
      html,
      attachments: attachments.map((file) => ({
        filename: file.filename,
        content: Buffer.from(file.content).toString("base64"),
      })),
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `Resend email failed (${response.status}): ${
        result.message || JSON.stringify(result)
      }`
    );
  }

  console.log("RESEND EMAIL SENT:", {
    to,
    id: result.id,
  });

  return result;
};















































const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER or EMAIL_PASS is missing in .env");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const value = (obj, keys, fallback = "-") => {
  for (const key of keys) {
    const val = obj?.[key];
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      return val;
    }
  }
  return fallback;
};

const QRCode = require("qrcode");

const generateTicketPdf = async (booking = {}) => {
  const flight = booking.flight || booking.flightDetails || booking.selectedFlight || booking.flightData || {};

  const firstDefined = (...values) =>
    values.find(v => v !== undefined && v !== null && String(v).trim() !== "");

  const get = (keys, fallback = "-") => {
    for (const key of keys) {
      const parts = key.split(".");
      let value = booking;
      for (const part of parts) value = value?.[part];
      if (value !== undefined && value !== null && String(value).trim() !== "") return value;
    }
    return fallback;
  };

  const formatDate = (raw) => {
    if (!raw || raw === "-") return "-";
    const date = new Date(raw);
    return Number.isNaN(date.getTime())
      ? String(raw)
      : date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  const bookingId = String(firstDefined(booking.bookingId, booking._id, booking.id, "-"));
  const airlinePnr = String(firstDefined(booking.airlinePnr, booking.airlinePNR, booking.pnr, booking.PNR, flight.airlinePnr, flight.pnr, "-"));
  const bookingDate = formatDate(firstDefined(booking.bookingDate, booking.createdAt, booking.confirmedAt, new Date()));
  const from = String(firstDefined(booking.from, booking.source, booking.origin, flight.from, flight.source, flight.origin, "-"));
  const to = String(firstDefined(booking.to, booking.destination, flight.to, flight.destination, "-"));
  const flightNo = String(firstDefined(booking.flightNumber, booking.flightNo, flight.flightNumber, flight.flightNo, flight.number, typeof booking.flight === "string" ? booking.flight : undefined, "-"));
  const departureTime = String(firstDefined(booking.departureTime, flight.departureTime, flight.departure?.time, "-"));
  const arrivalTime = String(firstDefined(booking.arrivalTime, flight.arrivalTime, flight.arrival?.time, "-"));
  const duration = String(firstDefined(booking.duration, flight.duration, flight.travelDuration, "-"));
  const travelClass = String(firstDefined(booking.travelClass, booking.class, booking.cabinClass, flight.travelClass, flight.class, flight.cabinClass, "-"));
  const departure = String(firstDefined(booking.departure, booking.departureAirport, flight.departure, flight.departureAirport, flight.fromAirport, from));
  const arrival = String(firstDefined(booking.arrival, booking.arrivalAirport, flight.arrival, flight.arrivalAirport, flight.toAirport, to));
  const seat = String(firstDefined(booking.seat, booking.seatNumber, booking.seats, "-"));
  const meal = String(firstDefined(booking.meal, booking.mealPreference, "-"));

  const baggageObj = booking.baggage || flight.baggage || {};

  const baggage = String(firstDefined(
    typeof baggageObj === "string" ? baggageObj : undefined,
    booking.checkinBaggage && booking.cabinBaggage
      ? `Check-in: ${booking.checkinBaggage}; Cabin: ${booking.cabinBaggage}`
      : undefined,
    baggageObj.checkinBaggage || baggageObj.checkin
      ? `Check-in: ${baggageObj.checkinBaggage || baggageObj.checkin}`
      : undefined,
    baggageObj.weight,
    booking.baggageAllowance,
    "-"
  ));

  const rawPassengers = firstDefined(
    booking.passengerDetails,
    booking.passengers,
    booking.passenger ? [booking.passenger] : undefined,
    []
  );

  const passengerList = Array.isArray(rawPassengers)
    ? rawPassengers
    : rawPassengers && typeof rawPassengers === "object"
      ? [rawPassengers]
      : [];

  const totalPassengers = String(firstDefined(
    booking.passengerCount,
    booking.numberOfPassengers,
    booking.totalPassengers,
    passengerList.length || (typeof booking.passengers === "number" ? booking.passengers : undefined),
    "1"
  ));

  const passengerName = (p) => String(firstDefined(
    p.name,
    p.fullName,
    p.passengerName,
    [p.firstName, p.middleName, p.lastName].filter(Boolean).join(" "),
    "Passenger"
  ));

  const passengerLines = passengerList.length
    ? passengerList.map((p, i) => ({
        name: passengerName(p),
        details: [
          p.type || p.passengerType,
          p.gender,
          p.dob || p.dateOfBirth,
          p.seat || p.seatNumber,
        ].filter(Boolean).join(" • "),
      }))
    : [{
        name: String(firstDefined(booking.name, booking.passengerName, booking.fullName, "Passenger")),
        details: "",
      }];

  const qrPayload = JSON.stringify({
    bookingId,
    airlinePnr,
    from,
    to,
    flightNo,
    departureDate: formatDate(firstDefined(booking.departureDate, booking.travelDate, flight.departureDate, "-")),
  });

  const qrBuffer = await QRCode.toBuffer(qrPayload, {
    type: "png",
    width: 180,
    margin: 1,
    errorCorrectionLevel: "M",
  });

  const height = Math.max(720, 620 + passengerLines.length * 56);

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: [420, height],
        margins: 24,
        autoFirstPage: false,
        bufferPages: true,
      });

      const chunks = [];

      doc.on("data", chunk => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      doc.addPage({ size: [420, height], margin: 24 });

      const left = 26;
      const right = 394;
      const width = right - left;
      const ink = "#172033";
      const muted = "#64748b";
      const line = "#dbe2ea";
      const pale = "#f4f7fb";
      const accent = "#12304a";

      let y = 24;

      const text = (str, x, yy, opts = {}) =>
        doc
          .fillColor(opts.color || ink)
          .font(opts.bold ? "Helvetica-Bold" : "Helvetica")
          .fontSize(opts.size || 9)
          .text(String(str ?? "-"), x, yy, {
            width: opts.width || width,
            lineBreak: true,
            ...opts,
          });

      const rule = (yy) => {
        doc.moveTo(left, yy)
          .lineTo(right, yy)
          .strokeColor(line)
          .lineWidth(1)
          .stroke();
      };

      const section = (title) => {
        y += 10;
        text(title.toUpperCase(), left, y, {
          size: 8,
          bold: true,
          color: muted,
        });
        y += 16;
      };

      const field = (label, val, x, yy, w = 170) => {
        text(label.toUpperCase(), x, yy, {
          size: 7,
          color: muted,
          width: w,
        });
        text(val || "-", x, yy + 11, {
          size: 9,
          bold: true,
          width: w,
        });
      };

      const row = (aLabel, aVal, bLabel, bVal) => {
        field(aLabel, aVal, left, y, 170);
        field(bLabel, bVal, 218, y, 170);
        y += 34;
      };

      doc.roundedRect(18, 16, 384, height - 32, 12)
        .lineWidth(1)
        .strokeColor(line)
        .stroke();

      doc.roundedRect(18, 16, 384, 70, 12).fill(accent);

      doc.fillColor("#ffffff")
        .font("Helvetica-Bold")
        .fontSize(17)
        .text("E-TICKET", left, 31, { width });

      doc.fillColor("#e2e8f0")
        .font("Helvetica")
        .fontSize(8)
        .text("TRAVEL CONFIRMATION", left, 55, { width });

      y = 101;

      row("Booking ID", bookingId, "Airline PNR", airlinePnr);
      row("Booking Date", bookingDate, "Total Passengers", totalPassengers);

      rule(y - 5);
      section("Journey Details");

      row("From", from, "To", to);
      row("Flight No", flightNo, "Class", travelClass);

      row(
        "Departure Date",
        formatDate(firstDefined(booking.departureDate, booking.travelDate, flight.departureDate, "-")),
        "Duration",
        duration
      );

      row("Departure Time", departureTime, "Arrival Time", arrivalTime);
      row("Departure", departure, "Arrival", arrival);

      rule(y - 5);
      section("Baggage & Preferences");

      row("Seat", seat, "Meal", meal);
      field("Baggage", baggage, left, y, width);

      y += 42;
      rule(y - 5);
      section("Passenger Details");

      passengerLines.forEach((p, i) => {
        doc.roundedRect(left, y - 3, width, p.details ? 42 : 29, 5).fill(pale);

        text(`${i + 1}. ${p.name}`, left + 9, y + 4, {
          size: 9,
          bold: true,
          width: width - 18,
        });

        if (p.details) {
          text(p.details, left + 9, y + 19, {
            size: 7,
            color: muted,
            width: width - 18,
          });
        }

        y += p.details ? 48 : 35;
      });

      y += 7;
      rule(y);
      y += 12;

      text("TICKET QR", left, y, {
        size: 8,
        bold: true,
        color: muted,
        width: 130,
      });

      doc.image(qrBuffer, 278, y - 4, {
        width: 88,
        height: 88,
      });

      text("Scan to view booking reference", left, y + 17, {
        size: 8,
        color: muted,
        width: 205,
      });

      text(`Booking ID: ${bookingId}`, left, y + 34, {
        size: 8,
        width: 205,
      });

      text(`PNR: ${airlinePnr}`, left, y + 49, {
        size: 8,
        width: 205,
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

const sendTicketEmail = async ({
  to,
  booking,
  pdfBuffer: suppliedPdfBuffer,
}) => {
  if (!to) {
    throw new Error("Ticket email recipient is missing.");
  }

  const transporter = createTransporter();
  const pdfBuffer = suppliedPdfBuffer || await generateTicketPdf(booking);

  const pnr = value(booking, ["pnr", "PNR"], "Ticket");

  const passengerName = value(
    booking,
    ["name", "passengerName", "fullName"],
    "Customer"
  );

  const amount = value(
    booking,
    ["amount", "totalAmount", "price", "totalPrice"],
    "0"
  );

  await transporter.sendMail({
    from: `"Saiyed Travels" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Booking Confirmed - PNR ${pnr} | Saiyed Travels`,
    html: `
      <div style="
        font-family:Arial,sans-serif;
        max-width:650px;
        margin:auto;
        border:1px solid #ddd;
        padding:25px;
        border-radius:12px;
      ">
        <h1 style="text-align:center;">
          SAIYED TRAVELS
        </h1>
        <h2 style="text-align:center;">
          Booking Confirmed ✅
        </h2>
        <p>
          Dear <strong>${passengerName}</strong>,
        </p>
        <p>
          Your booking has been successfully
          verified and confirmed by Saiyed Travels.
        </p>
        <div style="
          background:#f5f5f5;
          padding:15px;
          border-radius:8px;
        ">
          <p>
            <strong>PNR:</strong> ${pnr}
          </p>
          <p>
            <strong>Amount:</strong> ₹${amount}
          </p>
        </div>
        <p>
          Your confirmed ticket is attached
          as a PDF with this email.
        </p>
        <p>
          Thank you for choosing Saiyed Travels.
        </p>
      </div>
    `,
    attachments: [
      {
        filename: `Saiyed-Travels-Ticket-${pnr}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  return true;
};

// const sendAdminPaymentNotification = async ({
//   paymentRequest,
//   adminActionToken,
// }) => {

  const sendAdminPaymentNotification = async ({
  paymentRequest,
  adminActionToken,
  adminEmail,
}) => {
  const transporter = createTransporter();
  const booking = paymentRequest?.bookingData || {};

  const customerName = value(
    booking,
    ["name", "passengerName", "fullName"],
    "Customer"
  );

  const customerPhone = value(
    booking,
    ["phone", "mobile", "contactNumber"],
    "-"
  );

  const from = value(
    booking,
    ["from", "source", "origin"],
    "-"
  );

  const to = value(
    booking,
    ["to", "destination"],
    "-"
  );

  const passengers = value(
    booking,
    ["passengers", "passengerCount", "numberOfPassengers"],
    "1"
  );

  const amount = paymentRequest.amount || 0;
  const bankName = paymentRequest.bankName || "-";
  const paymentId = paymentRequest.paymentId || "-";

  const paymentDateTime = paymentRequest.paymentDateTime
    ? new Date(paymentRequest.paymentDateTime).toLocaleString("en-IN")
    : "-";

  const backendUrl =
    process.env.BACKEND_URL ||
    "https://saiyed-travels-backend-1.onrender.com";

  const requestId = paymentRequest._id.toString();

  if (!adminActionToken) {
    throw new Error("Admin action token is missing.");
  }

  const acceptUrl =
    `${backendUrl}/api/payment-requests/${requestId}/email-action/accept?token=${adminActionToken}`;

  const rejectUrl =
    `${backendUrl}/api/payment-requests/${requestId}/email-action/reject?token=${adminActionToken}`;

  const screenshotUrl = paymentRequest.screenshot
    ? `${backendUrl}${paymentRequest.screenshot}`
    : null;

  await transporter.sendMail({
    from: `"Saiyed Travels Admin" <${process.env.EMAIL_USER}>`,
    // to: process.env.EMAIL_USER,
    // to: process.env.EMAIL_USER,
    to: adminEmail || process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `🔔 New Payment Request - ₹${amount} - ${customerName}`,
    html: `
      <div style="
        font-family:Arial,sans-serif;
        max-width:700px;
        margin:auto;
        border:1px solid #ddd;
        border-radius:12px;
        overflow:hidden;
        background:#ffffff;
      ">
        <div style="
          background:#111827;
          color:white;
          padding:22px;
          text-align:center;
        ">
          <h1 style="margin:0;">
            SAIYED TRAVELS
          </h1>
          <p style="margin:8px 0 0;">
            New Payment Verification Request
          </p>
        </div>

        <div style="padding:25px;">
          <h2>💳 Payment Details</h2>

          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px;border-bottom:1px solid #eee;">
                <strong>Customer</strong>
              </td>
              <td style="padding:8px;border-bottom:1px solid #eee;">
                ${customerName}
              </td>
            </tr>
            <tr>
              <td style="padding:8px;">
                <strong>Email</strong>
              </td>
              <td style="padding:8px;">
                ${paymentRequest.customerEmail}
              </td>
            </tr>
            <tr>
              <td style="padding:8px;">
                <strong>Phone</strong>
              </td>
              <td style="padding:8px;">
                ${customerPhone}
              </td>
            </tr>
            <tr>
              <td style="padding:8px;">
                <strong>From</strong>
              </td>
              <td style="padding:8px;">
                ${from}
              </td>
            </tr>
            <tr>
              <td style="padding:8px;">
                <strong>To</strong>
              </td>
              <td style="padding:8px;">
                ${to}
              </td>
            </tr>
            <tr>
              <td style="padding:8px;">
                <strong>Passengers</strong>
              </td>
              <td style="padding:8px;">
                ${passengers}
              </td>
            </tr>
            <tr>
              <td style="padding:8px;">
                <strong>Amount</strong>
              </td>
              <td style="padding:8px;">
                <strong>₹${amount}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding:8px;">
                <strong>Bank</strong>
              </td>
              <td style="padding:8px;">
                ${bankName}
              </td>
            </tr>
            <tr>
              <td style="padding:8px;">
                <strong>UTR / Payment ID</strong>
              </td>
              <td style="padding:8px;">
                ${paymentId}
              </td>
            </tr>
            <tr>
              <td style="padding:8px;">
                <strong>Payment Date/Time</strong>
              </td>
              <td style="padding:8px;">
                ${paymentDateTime}
              </td>
            </tr>
          </table>

          ${
            screenshotUrl
              ? `
                <div style="margin-top:25px;text-align:center;">
                  <a
                    href="${screenshotUrl}"
                    style="
                      display:inline-block;
                      padding:13px 22px;
                      background:#2563eb;
                      color:white;
                      text-decoration:none;
                      border-radius:7px;
                      font-weight:bold;
                    "
                  >
                    📸 VIEW PAYMENT SCREENSHOT
                  </a>
                </div>
              `
              : ""
          }

          <div style="
            margin-top:30px;
            padding:25px 10px;
            border-top:1px solid #ddd;
            text-align:center;
          ">
            <h2>Admin Action</h2>
            <p style="color:#555;">
              Verify the payment before accepting.
            </p>

            <a
              href="${acceptUrl}"
              style="
                display:inline-block;
                background:#16a34a;
                color:#ffffff;
                padding:15px 25px;
                text-decoration:none;
                border-radius:8px;
                font-weight:bold;
                margin:7px;
                font-size:15px;
              "
            >
              ✅ ACCEPT PAYMENT
            </a>

            <a
              href="${rejectUrl}"
              style="
                display:inline-block;
                background:#dc2626;
                color:#ffffff;
                padding:15px 25px;
                text-decoration:none;
                border-radius:8px;
                font-weight:bold;
                margin:7px;
                font-size:15px;
              "
            >
              ❌ REJECT PAYMENT
            </a>
          </div>

          <div style="
            margin-top:20px;
            padding-top:15px;
            border-top:1px solid #eee;
            text-align:center;
            color:#777;
            font-size:12px;
          ">
            <p>Saiyed Travels</p>
            <p>
              Please verify UTR and payment
              screenshot before accepting.
            </p>
          </div>
        </div>
      </div>
    `,
  });

  console.log("Admin payment notification email sent with Accept/Reject buttons.");

  return true;
};

module.exports = {
  sendTicketEmail,
  sendAdminPaymentNotification,
  generateTicketPdf,
};