

// const nodemailer = require("nodemailer");
// const PDFDocument = require("pdfkit");

// /* =========================================================
//    GMAIL TRANSPORTER
// ========================================================= */

// const createTransporter = () => {
//   if (
//     !process.env.EMAIL_USER ||
//     !process.env.EMAIL_PASS
//   ) {
//     throw new Error(
//       "EMAIL_USER or EMAIL_PASS is missing in .env"
//     );
//   }

//   return nodemailer.createTransport({
//     service: "gmail",

//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
// };


// /* =========================================================
//    VALUE HELPER
// ========================================================= */

// const value = (
//   obj,
//   keys,
//   fallback = "-"
// ) => {
//   for (const key of keys) {
//     const val = obj?.[key];

//     if (
//       val !== undefined &&
//       val !== null &&
//       String(val).trim() !== ""
//     ) {
//       return val;
//     }
//   }

//   return fallback;
// };


// /* =========================================================
//    PDF GENERATOR
// ========================================================= */

// const generateTicketPdf = (booking) => {
//   return new Promise((resolve, reject) => {
//     try {
//       const doc = new PDFDocument({
//         size: "A4",
//         margin: 40,
//       });

//       const chunks = [];

//       doc.on("data", (chunk) => {
//         chunks.push(chunk);
//       });

//       doc.on("end", () => {
//         resolve(Buffer.concat(chunks));
//       });

//       doc.on("error", reject);


//       /* ---------- DATA ---------- */

//       const pnr = value(
//         booking,
//         ["pnr", "PNR"],
//         "N/A"
//       );

//       const status = value(
//         booking,
//         [
//           "bookingStatus",
//           "status",
//         ],
//         "Confirmed"
//       );

//       const passengerName = value(
//         booking,
//         [
//           "name",
//           "passengerName",
//           "fullName",
//         ],
//         "Passenger"
//       );

//       const email = value(
//         booking,
//         [
//           "email",
//           "customerEmail",
//         ],
//         "-"
//       );

//       const phone = value(
//         booking,
//         [
//           "phone",
//           "mobile",
//           "contactNumber",
//         ],
//         "-"
//       );

//       const from = value(
//         booking,
//         [
//           "from",
//           "source",
//           "origin",
//         ],
//         "-"
//       );

//       const to = value(
//         booking,
//         [
//           "to",
//           "destination",
//         ],
//         "-"
//       );

//       const flightNumber = value(
//         booking,
//         [
//           "flightNumber",
//           "flightNo",
//           "flight",
//         ],
//         "-"
//       );

//       const departureDate = value(
//         booking,
//         [
//           "departureDate",
//           "date",
//           "travelDate",
//         ],
//         "-"
//       );

//       const departureTime = value(
//         booking,
//         [
//           "departureTime",
//           "time",
//         ],
//         "-"
//       );

//       const passengers = value(
//         booking,
//         [
//           "passengers",
//           "passengerCount",
//           "numberOfPassengers",
//         ],
//         "1"
//       );

//       const amount = value(
//         booking,
//         [
//           "amount",
//           "totalAmount",
//           "price",
//           "totalPrice",
//         ],
//         "0"
//       );

//       const paymentMethod = value(
//         booking,
//         [
//           "paymentMethod",
//           "paymentMode",
//         ],
//         "-"
//       );

//       const paymentId = value(
//         booking,
//         [
//           "paymentId",
//           "utr",
//           "transactionId",
//         ],
//         "-"
//       );

//       const bookingId = value(
//         booking,
//         [
//           "_id",
//           "bookingId",
//         ],
//         "-"
//       );


//       /* =====================================================
//          HEADER
//       ===================================================== */

//       doc
//         .fontSize(24)
//         .font("Helvetica-Bold")
//         .text(
//           "SAIYED TRAVELS",
//           {
//             align: "center",
//           }
//         );

//       doc
//         .moveDown(0.3)
//         .fontSize(15)
//         .font("Helvetica")
//         .text(
//           "E-TICKET / BOOKING CONFIRMATION",
//           {
//             align: "center",
//           }
//         );

//       doc.moveDown(1);


//       /* =====================================================
//          PNR
//       ===================================================== */

//       doc
//         .fontSize(11)
//         .font("Helvetica-Bold")
//         .text(`PNR: ${pnr}`);

//       doc
//         .font("Helvetica")
//         .text(`Status: ${status}`);

//       doc.moveDown(1);


//       /* =====================================================
//          PASSENGER
//       ===================================================== */

//       doc
//         .fontSize(14)
//         .font("Helvetica-Bold")
//         .text("Passenger Details");

//       doc.moveDown(0.4);

//       doc
//         .fontSize(10)
//         .font("Helvetica")
//         .text(`Name: ${passengerName}`)
//         .text(`Email: ${email}`)
//         .text(`Phone: ${phone}`)
//         .text(`Passengers: ${passengers}`);

//       doc.moveDown(1);


//       /* =====================================================
//          FLIGHT
//       ===================================================== */

//       doc
//         .fontSize(14)
//         .font("Helvetica-Bold")
//         .text("Flight Details");

//       doc.moveDown(0.4);

//       doc
//         .fontSize(10)
//         .font("Helvetica")
//         .text(`From: ${from}`)
//         .text(`To: ${to}`)
//         .text(`Flight Number: ${flightNumber}`)
//         .text(`Departure Date: ${departureDate}`)
//         .text(`Departure Time: ${departureTime}`);

//       doc.moveDown(1);


//       /* =====================================================
//          PAYMENT
//       ===================================================== */

//       doc
//         .fontSize(14)
//         .font("Helvetica-Bold")
//         .text("Payment Details");

//       doc.moveDown(0.4);

//       doc
//         .fontSize(10)
//         .font("Helvetica")
//         .text(`Amount: ₹${amount}`)
//         .text(`Payment Method: ${paymentMethod}`)
//         .text(`Payment ID / UTR: ${paymentId}`);

//       doc.moveDown(1);


//       /* =====================================================
//          BOOKING
//       ===================================================== */

//       doc
//         .fontSize(14)
//         .font("Helvetica-Bold")
//         .text("Booking Information");

//       doc.moveDown(0.4);

//       doc
//         .fontSize(10)
//         .font("Helvetica")
//         .text(`Booking ID: ${bookingId}`)
//         .text(
//           "Payment verified by Saiyed Travels admin."
//         );

//       doc.moveDown(1);

//       doc.text(
//         "Please carry a valid ID proof during travel."
//       );

//       doc.moveDown(0.5);

//       doc.text(
//         "Please keep this e-ticket safely."
//       );

//       doc.moveDown(2);


//       /* =====================================================
//          FOOTER
//       ===================================================== */

//       doc
//         .fontSize(9)
//         .text(
//           "Saiyed Travels | SAIYEDTRAVELS.COM",
//           {
//             align: "center",
//           }
//         );

//       doc.end();

//     } catch (error) {
//       reject(error);
//     }
//   });
// };


// /* =========================================================
//    SEND TICKET EMAIL
// ========================================================= */

// const sendTicketEmail = async ({
//   to,
//   booking,
// }) => {

//   if (!to) {
//     throw new Error(
//       "Ticket email recipient is missing."
//     );
//   }

//   const transporter =
//     createTransporter();

//   const pdfBuffer =
//     await generateTicketPdf(
//       booking
//     );

//   const pnr =
//     value(
//       booking,
//       ["pnr", "PNR"],
//       "Ticket"
//     );

//   const passengerName =
//     value(
//       booking,
//       [
//         "name",
//         "passengerName",
//         "fullName",
//       ],
//       "Customer"
//     );

//   const amount =
//     value(
//       booking,
//       [
//         "amount",
//         "totalAmount",
//         "price",
//         "totalPrice",
//       ],
//       "0"
//     );


//   await transporter.sendMail({

//     from:
//       `"Saiyed Travels" <${process.env.EMAIL_USER}>`,

//     to,

//     subject:
//       `Booking Confirmed - PNR ${pnr} | Saiyed Travels`,

//     html: `

//       <div style="
//         font-family:Arial,sans-serif;
//         max-width:650px;
//         margin:auto;
//         border:1px solid #ddd;
//         padding:25px;
//         border-radius:12px;
//       ">

//         <h1 style="text-align:center;">
//           SAIYED TRAVELS
//         </h1>

//         <h2 style="text-align:center;">
//           Booking Confirmed ✅
//         </h2>

//         <p>
//           Dear <strong>${passengerName}</strong>,
//         </p>

//         <p>
//           Your booking has been successfully
//           verified and confirmed by Saiyed Travels.
//         </p>

//         <div style="
//           background:#f5f5f5;
//           padding:15px;
//           border-radius:8px;
//         ">

//           <p>
//             <strong>PNR:</strong> ${pnr}
//           </p>

//           <p>
//             <strong>Amount:</strong> ₹${amount}
//           </p>

//         </div>

//         <p>
//           Your confirmed ticket is attached
//           as a PDF with this email.
//         </p>

//         <p>
//           Thank you for choosing Saiyed Travels.
//         </p>

//       </div>

//     `,

//     attachments: [
//       {
//         filename:
//           `Saiyed-Travels-Ticket-${pnr}.pdf`,

//         content:
//           pdfBuffer,

//         contentType:
//           "application/pdf",
//       },
//     ],
//   });

//   console.log(
//     `Ticket email sent successfully to: ${to}`
//   );

//   return true;
// };


// /* =========================================================
//    ADMIN PAYMENT NOTIFICATION
// ========================================================= */

// const sendAdminPaymentNotification =
//   async ({
//     paymentRequest,
//     adminActionToken,
//     adminEmail,
//   }) => {

//     if (!adminEmail) {
//       throw new Error(
//         "Admin email recipient is missing."
//       );
//     }

//     const transporter =
//       createTransporter();

//     const booking =
//       paymentRequest?.bookingData ||
//       {};


//     /* ---------- CUSTOMER ---------- */

//     const customerName =
//       value(
//         booking,
//         [
//           "name",
//           "passengerName",
//           "fullName",
//         ],
//         "Customer"
//       );

//     const customerPhone =
//       value(
//         booking,
//         [
//           "phone",
//           "mobile",
//           "contactNumber",
//         ],
//         "-"
//       );


//     /* ---------- FLIGHT ---------- */

//     const from =
//       value(
//         booking,
//         [
//           "from",
//           "source",
//           "origin",
//         ],
//         "-"
//       );

//     const to =
//       value(
//         booking,
//         [
//           "to",
//           "destination",
//         ],
//         "-"
//       );

//     const passengers =
//       value(
//         booking,
//         [
//           "passengers",
//           "passengerCount",
//           "numberOfPassengers",
//         ],
//         "1"
//       );


//     /* ---------- PAYMENT ---------- */

//     const amount =
//       paymentRequest.amount || 0;

//     const bankName =
//       paymentRequest.bankName || "-";

//     const paymentId =
//       paymentRequest.paymentId || "-";

//     const paymentDateTime =
//       paymentRequest.paymentDateTime
//         ? new Date(
//             paymentRequest.paymentDateTime
//           ).toLocaleString("en-IN")
//         : "-";


//     /* =====================================================
//        PUBLIC BACKEND URL
//     ===================================================== */

//     const backendUrl =
//       process.env.BACKEND_URL ||
//       "https://saiyed-travels-backend-1.onrender.com";


//     const requestId =
//       paymentRequest._id.toString();


//     /* =====================================================
//        EMAIL ACTION TOKEN
//     ===================================================== */

//     if (!adminActionToken) {
//       throw new Error(
//         "Admin action token is missing."
//       );
//     }


//     const acceptUrl =
//       `${backendUrl}/api/payment-requests/${requestId}/email-action/accept?token=${adminActionToken}`;

//     const rejectUrl =
//       `${backendUrl}/api/payment-requests/${requestId}/email-action/reject?token=${adminActionToken}`;


//     /* =====================================================
//        SCREENSHOT
//     ===================================================== */

//     const screenshotUrl =
//       paymentRequest.screenshot
//         ? `${backendUrl}${paymentRequest.screenshot}`
//         : null;


//     /* =====================================================
//        SEND ADMIN EMAIL
//     ===================================================== */

//     await transporter.sendMail({

//       from:
//         `"Saiyed Travels Admin" <${process.env.EMAIL_USER}>`,

//       // IMPORTANT:
//       // Admin notification ab logged-in/admin account
//       // ke email par jayegi.
//       to: adminEmail,

//       subject:
//         `🔔 New Payment Request - ₹${amount} - ${customerName}`,

//       html: `

//         <div style="
//           font-family:Arial,sans-serif;
//           max-width:700px;
//           margin:auto;
//           border:1px solid #ddd;
//           border-radius:12px;
//           overflow:hidden;
//           background:#ffffff;
//         ">


//           <!-- HEADER -->

//           <div style="
//             background:#111827;
//             color:white;
//             padding:22px;
//             text-align:center;
//           ">

//             <h1 style="margin:0;">
//               SAIYED TRAVELS
//             </h1>

//             <p style="
//               margin:8px 0 0;
//             ">
//               New Payment Verification Request
//             </p>

//           </div>


//           <!-- CONTENT -->

//           <div style="
//             padding:25px;
//           ">


//             <h2>
//               💳 Payment Details
//             </h2>


//             <table style="
//               width:100%;
//               border-collapse:collapse;
//             ">


//               <tr>

//                 <td style="
//                   padding:8px;
//                   border-bottom:1px solid #eee;
//                 ">
//                   <strong>Customer</strong>
//                 </td>

//                 <td style="
//                   padding:8px;
//                   border-bottom:1px solid #eee;
//                 ">
//                   ${customerName}
//                 </td>

//               </tr>


//               <tr>

//                 <td style="padding:8px;">
//                   <strong>Email</strong>
//                 </td>

//                 <td style="padding:8px;">
//                   ${paymentRequest.customerEmail || "-"}
//                 </td>

//               </tr>


//               <tr>

//                 <td style="padding:8px;">
//                   <strong>Phone</strong>
//                 </td>

//                 <td style="padding:8px;">
//                   ${customerPhone}
//                 </td>

//               </tr>


//               <tr>

//                 <td style="padding:8px;">
//                   <strong>From</strong>
//                 </td>

//                 <td style="padding:8px;">
//                   ${from}
//                 </td>

//               </tr>


//               <tr>

//                 <td style="padding:8px;">
//                   <strong>To</strong>
//                 </td>

//                 <td style="padding:8px;">
//                   ${to}
//                 </td>

//               </tr>


//               <tr>

//                 <td style="padding:8px;">
//                   <strong>Passengers</strong>
//                 </td>

//                 <td style="padding:8px;">
//                   ${passengers}
//                 </td>

//               </tr>


//               <tr>

//                 <td style="padding:8px;">
//                   <strong>Amount</strong>
//                 </td>

//                 <td style="padding:8px;">
//                   <strong>
//                     ₹${amount}
//                   </strong>
//                 </td>

//               </tr>


//               <tr>

//                 <td style="padding:8px;">
//                   <strong>Bank</strong>
//                 </td>

//                 <td style="padding:8px;">
//                   ${bankName}
//                 </td>

//               </tr>


//               <tr>

//                 <td style="padding:8px;">
//                   <strong>UTR / Payment ID</strong>
//                 </td>

//                 <td style="padding:8px;">
//                   ${paymentId}
//                 </td>

//               </tr>


//               <tr>

//                 <td style="padding:8px;">
//                   <strong>Payment Date/Time</strong>
//                 </td>

//                 <td style="padding:8px;">
//                   ${paymentDateTime}
//                 </td>

//               </tr>


//             </table>


//             <!-- SCREENSHOT -->

//             ${
//               screenshotUrl
//                 ? `

//                   <div style="
//                     margin-top:25px;
//                     text-align:center;
//                   ">

//                     <a
//                       href="${screenshotUrl}"
//                       style="
//                         display:inline-block;
//                         padding:13px 22px;
//                         background:#2563eb;
//                         color:white;
//                         text-decoration:none;
//                         border-radius:7px;
//                         font-weight:bold;
//                       "
//                     >
//                       📸 VIEW PAYMENT SCREENSHOT
//                     </a>

//                   </div>

//                 `
//                 : ""
//             }


//             <!-- ADMIN ACTION -->

//             <div style="
//               margin-top:30px;
//               padding:25px 10px;
//               border-top:1px solid #ddd;
//               text-align:center;
//             ">


//               <h2>
//                 Admin Action
//               </h2>


//               <p style="
//                 color:#555;
//               ">
//                 Verify the payment before accepting.
//               </p>


//               <!-- ACCEPT -->

//               <a
//                 href="${acceptUrl}"
//                 style="
//                   display:inline-block;
//                   background:#16a34a;
//                   color:#ffffff;
//                   padding:15px 25px;
//                   text-decoration:none;
//                   border-radius:8px;
//                   font-weight:bold;
//                   margin:7px;
//                   font-size:15px;
//                 "
//               >
//                 ✅ ACCEPT PAYMENT
//               </a>


//               <!-- REJECT -->

//               <a
//                 href="${rejectUrl}"
//                 style="
//                   display:inline-block;
//                   background:#dc2626;
//                   color:#ffffff;
//                   padding:15px 25px;
//                   text-decoration:none;
//                   border-radius:8px;
//                   font-weight:bold;
//                   margin:7px;
//                   font-size:15px;
//                 "
//               >
//                 ❌ REJECT PAYMENT
//               </a>


//             </div>


//             <!-- FOOTER -->

//             <div style="
//               margin-top:20px;
//               padding-top:15px;
//               border-top:1px solid #eee;
//               text-align:center;
//               color:#777;
//               font-size:12px;
//             ">

//               <p>
//                 Saiyed Travels
//               </p>

//               <p>
//                 Please verify UTR and payment
//                 screenshot before accepting.
//               </p>

//             </div>


//           </div>

//         </div>

//       `,
//     });


//     console.log(
//       `Admin payment notification email sent successfully to: ${adminEmail}`
//     );

//     return true;
//   };


// /* =========================================================
//    EXPORT
// ========================================================= */

// module.exports = {

//   sendTicketEmail,

//   sendAdminPaymentNotification,

//   generateTicketPdf,

// };


const PDFDocument = require("pdfkit");

/* =========================================================
   RESEND EMAIL API
========================================================= */

const sendEmailViaResend = async ({
  to,
  subject,
  html,
  attachments = [],
}) => {
  if (!to) {
    throw new Error("Email recipient is missing.");
  }

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  /*
    Testing:
    onboarding@resend.dev

    Production:
    RESEND_FROM_EMAIL should be an email
    from your verified domain.
  */

  const fromEmail =
    process.env.RESEND_FROM_EMAIL ||
    "onboarding@resend.dev";

  const response = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${process.env.RESEND_API_KEY}`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        from:
          `Saiyed Travels <${fromEmail}>`,

        to: [to],

        subject,

        html,

        attachments,
      }),
    }
  );

  let result = {};

  try {
    result = await response.json();
  } catch (error) {
    // Resend response JSON nahi hai
  }

  if (!response.ok) {
    throw new Error(
      `Resend email failed (${response.status}): ${
        result?.message ||
        JSON.stringify(result)
      }`
    );
  }

  return result;
};


/* =========================================================
   VALUE HELPER
========================================================= */

const value = (
  obj,
  keys,
  fallback = "-"
) => {
  for (const key of keys) {
    const val = obj?.[key];

    if (
      val !== undefined &&
      val !== null &&
      String(val).trim() !== ""
    ) {
      return val;
    }
  }

  return fallback;
};


/* =========================================================
   PDF GENERATOR
========================================================= */

const generateTicketPdf = (booking) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
      });

      const chunks = [];

      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });

      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", reject);


      /* ---------- DATA ---------- */

      const pnr = value(
        booking,
        ["pnr", "PNR"],
        "N/A"
      );

      const status = value(
        booking,
        [
          "bookingStatus",
          "status",
        ],
        "Confirmed"
      );

      const passengerName = value(
        booking,
        [
          "name",
          "passengerName",
          "fullName",
        ],
        "Passenger"
      );

      const email = value(
        booking,
        [
          "email",
          "customerEmail",
        ],
        "-"
      );

      const phone = value(
        booking,
        [
          "phone",
          "mobile",
          "contactNumber",
        ],
        "-"
      );

      const from = value(
        booking,
        [
          "from",
          "source",
          "origin",
        ],
        "-"
      );

      const to = value(
        booking,
        [
          "to",
          "destination",
        ],
        "-"
      );

      const flightNumber = value(
        booking,
        [
          "flightNumber",
          "flightNo",
          "flight",
        ],
        "-"
      );

      const departureDate = value(
        booking,
        [
          "departureDate",
          "date",
          "travelDate",
        ],
        "-"
      );

      const departureTime = value(
        booking,
        [
          "departureTime",
          "time",
        ],
        "-"
      );

      const passengers = value(
        booking,
        [
          "passengers",
          "passengerCount",
          "numberOfPassengers",
        ],
        "1"
      );

      const amount = value(
        booking,
        [
          "amount",
          "totalAmount",
          "price",
          "totalPrice",
        ],
        "0"
      );

      const paymentMethod = value(
        booking,
        [
          "paymentMethod",
          "paymentMode",
        ],
        "-"
      );

      const paymentId = value(
        booking,
        [
          "paymentId",
          "utr",
          "transactionId",
        ],
        "-"
      );

      const bookingId = value(
        booking,
        [
          "_id",
          "bookingId",
        ],
        "-"
      );


      /* =====================================================
         HEADER
      ===================================================== */

      doc
        .fontSize(24)
        .font("Helvetica-Bold")
        .text(
          "SAIYED TRAVELS",
          {
            align: "center",
          }
        );

      doc
        .moveDown(0.3)
        .fontSize(15)
        .font("Helvetica")
        .text(
          "E-TICKET / BOOKING CONFIRMATION",
          {
            align: "center",
          }
        );

      doc.moveDown(1);


      /* =====================================================
         PNR
      ===================================================== */

      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text(`PNR: ${pnr}`);

      doc
        .font("Helvetica")
        .text(`Status: ${status}`);

      doc.moveDown(1);


      /* =====================================================
         PASSENGER
      ===================================================== */

      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Passenger Details");

      doc.moveDown(0.4);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Name: ${passengerName}`)
        .text(`Email: ${email}`)
        .text(`Phone: ${phone}`)
        .text(`Passengers: ${passengers}`);

      doc.moveDown(1);


      /* =====================================================
         FLIGHT
      ===================================================== */

      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Flight Details");

      doc.moveDown(0.4);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`From: ${from}`)
        .text(`To: ${to}`)
        .text(`Flight Number: ${flightNumber}`)
        .text(`Departure Date: ${departureDate}`)
        .text(`Departure Time: ${departureTime}`);

      doc.moveDown(1);


      /* =====================================================
         PAYMENT
      ===================================================== */

      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Payment Details");

      doc.moveDown(0.4);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Amount: ₹${amount}`)
        .text(`Payment Method: ${paymentMethod}`)
        .text(`Payment ID / UTR: ${paymentId}`);

      doc.moveDown(1);


      /* =====================================================
         BOOKING
      ===================================================== */

      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Booking Information");

      doc.moveDown(0.4);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Booking ID: ${bookingId}`)
        .text(
          "Payment verified by Saiyed Travels admin."
        );

      doc.moveDown(1);

      doc.text(
        "Please carry a valid ID proof during travel."
      );

      doc.moveDown(0.5);

      doc.text(
        "Please keep this e-ticket safely."
      );

      doc.moveDown(2);


      /* =====================================================
         FOOTER
      ===================================================== */

      doc
        .fontSize(9)
        .text(
          "Saiyed Travels | SAIYEDTRAVELS.COM",
          {
            align: "center",
          }
        );

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
};


/* =========================================================
   SEND TICKET EMAIL
========================================================= */

const sendTicketEmail = async ({
  to,
  booking,
}) => {

  if (!to) {
    throw new Error(
      "Ticket email recipient is missing."
    );
  }

  const pdfBuffer =
    await generateTicketPdf(booking);

  const pnr =
    value(
      booking,
      ["pnr", "PNR"],
      "Ticket"
    );

  const passengerName =
    value(
      booking,
      [
        "name",
        "passengerName",
        "fullName",
      ],
      "Customer"
    );

  const amount =
    value(
      booking,
      [
        "amount",
        "totalAmount",
        "price",
        "totalPrice",
      ],
      "0"
    );


  await sendEmailViaResend({

    to,

    subject:
      `Booking Confirmed - PNR ${pnr} | Saiyed Travels`,

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
        filename:
          `Saiyed-Travels-Ticket-${pnr}.pdf`,

        content:
          pdfBuffer.toString("base64"),
      },
    ],
  });


  console.log(
    `Ticket email sent successfully to: ${to}`
  );

  return true;
};


/* =========================================================
   ADMIN PAYMENT NOTIFICATION
========================================================= */

const sendAdminPaymentNotification =
  async ({
    paymentRequest,
    adminActionToken,
    adminEmail,
  }) => {

    if (!adminEmail) {
      throw new Error(
        "Admin email recipient is missing."
      );
    }

    const booking =
      paymentRequest?.bookingData ||
      {};


    /* ---------- CUSTOMER ---------- */

    const customerName =
      value(
        booking,
        [
          "name",
          "passengerName",
          "fullName",
        ],
        "Customer"
      );

    const customerPhone =
      value(
        booking,
        [
          "phone",
          "mobile",
          "contactNumber",
        ],
        "-"
      );


    /* ---------- FLIGHT ---------- */

    const from =
      value(
        booking,
        [
          "from",
          "source",
          "origin",
        ],
        "-"
      );

    const to =
      value(
        booking,
        [
          "to",
          "destination",
        ],
        "-"
      );

    const passengers =
      value(
        booking,
        [
          "passengers",
          "passengerCount",
          "numberOfPassengers",
        ],
        "1"
      );


    /* ---------- PAYMENT ---------- */

    const amount =
      paymentRequest.amount || 0;

    const bankName =
      paymentRequest.bankName || "-";

    const paymentId =
      paymentRequest.paymentId || "-";

    const paymentDateTime =
      paymentRequest.paymentDateTime
        ? new Date(
            paymentRequest.paymentDateTime
          ).toLocaleString("en-IN")
        : "-";


    /* =====================================================
       PUBLIC BACKEND URL
    ===================================================== */

    const backendUrl =
      process.env.BACKEND_URL ||
      "https://saiyed-travels-backend-1.onrender.com";


    const requestId =
      paymentRequest._id.toString();


    /* =====================================================
       EMAIL ACTION TOKEN
    ===================================================== */

    if (!adminActionToken) {
      throw new Error(
        "Admin action token is missing."
      );
    }


    const acceptUrl =
      `${backendUrl}/api/payment-requests/${requestId}/email-action/accept?token=${adminActionToken}`;

    const rejectUrl =
      `${backendUrl}/api/payment-requests/${requestId}/email-action/reject?token=${adminActionToken}`;


    /* =====================================================
       SCREENSHOT
    ===================================================== */

    const screenshotUrl =
      paymentRequest.screenshot
        ? `${backendUrl}${paymentRequest.screenshot}`
        : null;


    /* =====================================================
       SEND ADMIN EMAIL
    ===================================================== */

    await sendEmailViaResend({

      to: adminEmail,

      subject:
        `🔔 New Payment Request - ₹${amount} - ${customerName}`,

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


          <!-- HEADER -->

          <div style="
            background:#111827;
            color:white;
            padding:22px;
            text-align:center;
          ">

            <h1 style="margin:0;">
              SAIYED TRAVELS
            </h1>

            <p style="
              margin:8px 0 0;
            ">
              New Payment Verification Request
            </p>

          </div>


          <!-- CONTENT -->

          <div style="
            padding:25px;
          ">


            <h2>
              💳 Payment Details
            </h2>


            <table style="
              width:100%;
              border-collapse:collapse;
            ">


              <tr>

                <td style="
                  padding:8px;
                  border-bottom:1px solid #eee;
                ">
                  <strong>Customer</strong>
                </td>

                <td style="
                  padding:8px;
                  border-bottom:1px solid #eee;
                ">
                  ${customerName}
                </td>

              </tr>


              <tr>

                <td style="padding:8px;">
                  <strong>Email</strong>
                </td>

                <td style="padding:8px;">
                  ${paymentRequest.customerEmail || "-"}
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
                  <strong>
                    ₹${amount}
                  </strong>
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


            <!-- SCREENSHOT -->

            ${
              screenshotUrl
                ? `

                  <div style="
                    margin-top:25px;
                    text-align:center;
                  ">

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


            <!-- ADMIN ACTION -->

            <div style="
              margin-top:30px;
              padding:25px 10px;
              border-top:1px solid #ddd;
              text-align:center;
            ">


              <h2>
                Admin Action
              </h2>


              <p style="
                color:#555;
              ">
                Verify the payment before accepting.
              </p>


              <!-- ACCEPT -->

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


              <!-- REJECT -->

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


            <!-- FOOTER -->

            <div style="
              margin-top:20px;
              padding-top:15px;
              border-top:1px solid #eee;
              text-align:center;
              color:#777;
              font-size:12px;
            ">

              <p>
                Saiyed Travels
              </p>

              <p>
                Please verify UTR and payment
                screenshot before accepting.
              </p>

            </div>


          </div>

        </div>

      `,
    });


    console.log(
      `Admin payment notification email sent successfully to: ${adminEmail}`
    );

    return true;
  };


/* =========================================================
   EXPORT
========================================================= */

module.exports = {
  sendTicketEmail,
  sendAdminPaymentNotification,
  generateTicketPdf,
};