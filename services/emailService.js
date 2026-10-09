// const PDFDocument = require("pdfkit");

// /* =========================================================
//    RESEND EMAIL API
// ========================================================= */

// const sendEmailViaResend = async ({
//   to,
//   subject,
//   html,
//   attachments = [],
// }) => {
//   if (!to) {
//     throw new Error("Email recipient is missing.");
//   }

//   if (!process.env.RESEND_API_KEY) {
//     throw new Error("RESEND_API_KEY is missing.");
//   }

//   /*
//     Testing:
//     onboarding@resend.dev

//     Production:
//     RESEND_FROM_EMAIL should be an email
//     from your verified domain.
//   */

//   const fromEmail =
//     process.env.RESEND_FROM_EMAIL ||
//     "onboarding@resend.dev";

//   const response = await fetch(
//     "https://api.resend.com/emails",
//     {
//       method: "POST",

//       headers: {
//         Authorization:
//           `Bearer ${process.env.RESEND_API_KEY}`,

//         "Content-Type":
//           "application/json",
//       },

//       body: JSON.stringify({
//         from:
//           `Saiyed Travels <${fromEmail}>`,

//         to: [to],

//         subject,

//         html,

//         attachments,
//       }),
//     }
//   );

//   let result = {};

//   try {
//     result = await response.json();
//   } catch (error) {
//     // Resend response JSON nahi hai
//   }

//   if (!response.ok) {
//     throw new Error(
//       `Resend email failed (${response.status}): ${
//         result?.message ||
//         JSON.stringify(result)
//       }`
//     );
//   }

//   return result;
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

//   const pdfBuffer =
//     await generateTicketPdf(booking);

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


//   await sendEmailViaResend({

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
//           pdfBuffer.toString("base64"),
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

//     await sendEmailViaResend({

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

  const fromEmail =
    process.env.RESEND_FROM_EMAIL ||
    "onboarding@resend.dev";

  const fromName =
    process.env.RESEND_FROM_NAME ||
    "Saiyed Travels";

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
        from: `${fromName} <${fromEmail}>`,
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
   BASIC VALUE HELPER
========================================================= */

const value = (
  obj,
  keys,
  fallback = "-"
) => {
  if (!obj || typeof obj !== "object") {
    return fallback;
  }

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
   DISPLAY VALUE
   Prevents [object Object]
========================================================= */

const displayValue = (
  input,
  fallback = "-"
) => {
  if (
    input === undefined ||
    input === null ||
    input === ""
  ) {
    return fallback;
  }

  /* ---------- STRING / NUMBER / BOOLEAN ---------- */

  if (
    typeof input === "string" ||
    typeof input === "number" ||
    typeof input === "boolean"
  ) {
    return String(input);
  }


  /* ---------- DATE ---------- */

  if (input instanceof Date) {
    return input.toLocaleDateString("en-IN");
  }


  /* ---------- ARRAY ---------- */

  if (Array.isArray(input)) {
    if (input.length === 0) {
      return fallback;
    }

    /*
      Example:
      ["Adult", "Child"]
    */

    if (
      input.every(
        (item) =>
          typeof item !== "object" ||
          item === null
      )
    ) {
      return input
        .map((item) =>
          displayValue(item, "")
        )
        .filter(Boolean)
        .join(", ");
    }

    /*
      Example:
      [
        { name: "Tohid" },
        { name: "Ali" }
      ]
    */

    const values = input
      .map((item) => {
        if (
          item &&
          typeof item === "object"
        ) {
          return displayObjectValue(item);
        }

        return displayValue(item, "");
      })
      .filter(Boolean);

    return values.length
      ? values.join(", ")
      : fallback;
  }


  /* ---------- OBJECT ---------- */

  if (typeof input === "object") {
    return displayObjectValue(input);
  }


  return fallback;
};


/* =========================================================
   OBJECT DISPLAY HELPER
========================================================= */

const displayObjectValue = (obj) => {
  if (!obj || typeof obj !== "object") {
    return "-";
  }

  /*
    Most useful possible values.
  */

  const commonKeys = [
    "name",
    "fullName",
    "passengerName",

    "flightNumber",
    "flightNo",
    "number",

    "code",
    "iata",
    "value",

    "city",
    "airport",
    "airportName",

    "from",
    "to",

    "origin",
    "destination",

    "date",
    "travelDate",
    "departureDate",

    "time",
    "departureTime",

    "count",
    "total",
    "amount",

    "email",
    "phone",
    "mobile",
  ];

  for (const key of commonKeys) {
    const val = obj?.[key];

    if (
      val !== undefined &&
      val !== null &&
      val !== ""
    ) {
      /*
        Avoid returning nested object again.
      */

      if (
        typeof val !== "object"
      ) {
        return String(val);
      }

      const nested =
        displayObjectValue(val);

      if (
        nested &&
        nested !== "-"
      ) {
        return nested;
      }
    }
  }


  /*
    Sometimes backend stores:
    { label: "Delhi", value: "DEL" }
  */

  if (obj.label) {
    return displayValue(
      obj.label,
      "-"
    );
  }


  /*
    Last fallback:
    Make a readable JSON instead of
    [object Object].
  */

  try {
    return JSON.stringify(obj);
  } catch (error) {
    return "-";
  }
};


/* =========================================================
   FIND VALUE FROM NESTED BOOKING
========================================================= */

const findBookingValue = (
  booking,
  paths = [],
  fallback = "-"
) => {
  if (!booking) {
    return fallback;
  }

  for (const path of paths) {
    const parts = path.split(".");

    let current = booking;

    for (const part of parts) {
      if (
        current === undefined ||
        current === null
      ) {
        current = undefined;
        break;
      }

      current = current[part];
    }

    if (
      current !== undefined &&
      current !== null &&
      current !== ""
    ) {
      const result =
        displayValue(
          current,
          ""
        );

      if (
        result &&
        result !== "-"
      ) {
        return result;
      }
    }
  }

  return fallback;
};


/* =========================================================
   PASSENGER COUNT
========================================================= */

const getPassengerCount = (
  booking
) => {
  const passengers =
    booking?.passengers;

  /*
    Number
  */

  if (
    typeof passengers === "number"
  ) {
    return String(passengers);
  }

  /*
    String
  */

  if (
    typeof passengers === "string" &&
    passengers.trim() !== ""
  ) {
    return passengers;
  }

  /*
    Array
  */

  if (Array.isArray(passengers)) {
    return String(
      passengers.length || 1
    );
  }

  /*
    Object
  */

  if (
    passengers &&
    typeof passengers === "object"
  ) {
    const count =
      passengers.count ??
      passengers.total ??
      passengers.number ??
      passengers.quantity;

    if (
      count !== undefined &&
      count !== null
    ) {
      return String(count);
    }

    /*
      Sometimes:
      {
        adults: 1,
        children: 0,
        infants: 0
      }
    */

    const adults =
      Number(
        passengers.adults || 0
      );

    const children =
      Number(
        passengers.children || 0
      );

    const infants =
      Number(
        passengers.infants || 0
      );

    const total =
      adults +
      children +
      infants;

    if (total > 0) {
      return String(total);
    }

    return "1";
  }

  return "1";
};


/* =========================================================
   MONEY FORMAT
========================================================= */

const formatAmount = (
  amount
) => {
  if (
    amount === undefined ||
    amount === null ||
    amount === ""
  ) {
    return "0";
  }

  /*
    If amount is object
  */

  if (
    typeof amount === "object"
  ) {
    amount =
      amount.amount ??
      amount.value ??
      amount.total ??
      amount.price ??
      0;
  }

  const numericAmount =
    Number(
      String(amount)
        .replace(/₹/g, "")
        .replace(/,/g, "")
        .trim()
    );

  if (
    Number.isNaN(numericAmount)
  ) {
    return displayValue(
      amount,
      "0"
    );
  }

  return numericAmount.toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  );
};


/* =========================================================
   DATE FORMAT
========================================================= */

const formatDate = (
  input
) => {
  if (
    input === undefined ||
    input === null ||
    input === ""
  ) {
    return "-";
  }

  /*
    If already a normal string date
  */

  if (
    typeof input === "string"
  ) {
    const trimmed =
      input.trim();

    /*
      Don't convert simple values
      unnecessarily.
    */

    if (
      /^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}$/.test(
        trimmed
      )
    ) {
      return trimmed;
    }

    /*
      ISO date
    */

    const date =
      new Date(trimmed);

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {
      return date.toLocaleDateString(
        "en-IN"
      );
    }

    return trimmed;
  }


  if (
    input instanceof Date
  ) {
    return input.toLocaleDateString(
      "en-IN"
    );
  }


  if (
    typeof input === "object"
  ) {
    const nested =
      input.date ??
      input.value ??
      input.travelDate ??
      input.departureDate;

    if (nested) {
      return formatDate(nested);
    }
  }

  return displayValue(
    input,
    "-"
  );
};


/* =========================================================
   TIME FORMAT
========================================================= */

const formatTime = (
  input
) => {
  if (
    input === undefined ||
    input === null ||
    input === ""
  ) {
    return "-";
  }

  if (
    typeof input === "string"
  ) {
    return input.trim();
  }

  if (
    typeof input === "object"
  ) {
    const nested =
      input.time ??
      input.value ??
      input.departureTime;

    if (nested) {
      return formatTime(nested);
    }
  }

  return displayValue(
    input,
    "-"
  );
};


/* =========================================================
   FLIGHT NUMBER
========================================================= */

const getFlightNumber = (
  booking
) => {
  const possibleValues = [
    booking?.flightNumber,
    booking?.flightNo,

    booking?.flight?.flightNumber,
    booking?.flight?.flightNo,
    booking?.flight?.number,
    booking?.flight?.code,

    booking?.flightDetails?.flightNumber,
    booking?.flightDetails?.flightNo,
    booking?.flightDetails?.number,

    booking?.selectedFlight?.flightNumber,
    booking?.selectedFlight?.flightNo,
    booking?.selectedFlight?.number,

    booking?.flightData?.flightNumber,
    booking?.flightData?.flightNo,
    booking?.flightData?.number,
  ];

  for (
    const item of possibleValues
  ) {
    const result =
      displayValue(
        item,
        ""
      );

    if (
      result &&
      result !== "-"
    ) {
      return result;
    }
  }

  return "-";
};


/* =========================================================
   FROM
========================================================= */

const getFrom = (
  booking
) => {
  const possibleValues = [
    booking?.from,
    booking?.source,
    booking?.origin,

    booking?.flight?.from,
    booking?.flight?.source,
    booking?.flight?.origin,

    booking?.flightDetails?.from,
    booking?.flightDetails?.source,
    booking?.flightDetails?.origin,

    booking?.selectedFlight?.from,
    booking?.selectedFlight?.source,
    booking?.selectedFlight?.origin,

    booking?.flightData?.from,
    booking?.flightData?.source,
    booking?.flightData?.origin,
  ];

  for (
    const item of possibleValues
  ) {
    const result =
      displayValue(
        item,
        ""
      );

    if (
      result &&
      result !== "-"
    ) {
      return result;
    }
  }

  return "-";
};


/* =========================================================
   TO
========================================================= */

const getTo = (
  booking
) => {
  const possibleValues = [
    booking?.to,
    booking?.destination,

    booking?.flight?.to,
    booking?.flight?.destination,

    booking?.flightDetails?.to,
    booking?.flightDetails?.destination,

    booking?.selectedFlight?.to,
    booking?.selectedFlight?.destination,

    booking?.flightData?.to,
    booking?.flightData?.destination,
  ];

  for (
    const item of possibleValues
  ) {
    const result =
      displayValue(
        item,
        ""
      );

    if (
      result &&
      result !== "-"
    ) {
      return result;
    }
  }

  return "-";
};


/* =========================================================
   DEPARTURE DATE
========================================================= */

const getDepartureDate = (
  booking
) => {
  const possibleValues = [
    booking?.departureDate,
    booking?.travelDate,
    booking?.date,

    booking?.flight?.departureDate,
    booking?.flight?.travelDate,
    booking?.flight?.date,

    booking?.flightDetails?.departureDate,
    booking?.flightDetails?.travelDate,
    booking?.flightDetails?.date,

    booking?.selectedFlight?.departureDate,
    booking?.selectedFlight?.travelDate,
    booking?.selectedFlight?.date,

    booking?.flightData?.departureDate,
    booking?.flightData?.travelDate,
    booking?.flightData?.date,
  ];

  for (
    const item of possibleValues
  ) {
    const result =
      formatDate(item);

    if (
      result &&
      result !== "-"
    ) {
      return result;
    }
  }

  return "-";
};


/* =========================================================
   DEPARTURE TIME
========================================================= */

const getDepartureTime = (
  booking
) => {
  const possibleValues = [
    booking?.departureTime,
    booking?.time,

    booking?.flight?.departureTime,
    booking?.flight?.time,

    booking?.flightDetails?.departureTime,
    booking?.flightDetails?.time,

    booking?.selectedFlight?.departureTime,
    booking?.selectedFlight?.time,

    booking?.flightData?.departureTime,
    booking?.flightData?.time,
  ];

  for (
    const item of possibleValues
  ) {
    const result =
      formatTime(item);

    if (
      result &&
      result !== "-"
    ) {
      return result;
    }
  }

  return "-";
};


/* =========================================================
   PDF GENERATOR
========================================================= */

const generateTicketPdf = (
  booking
) => {
  return new Promise(
    (resolve, reject) => {
      try {
        const doc =
          new PDFDocument({
            size: "A4",
            margin: 40,
          });

        const chunks = [];

        doc.on(
          "data",
          (chunk) => {
            chunks.push(chunk);
          }
        );

        doc.on(
          "end",
          () => {
            resolve(
              Buffer.concat(chunks)
            );
          }
        );

        doc.on(
          "error",
          reject
        );


        /* =====================================================
           DATA
        ===================================================== */

        const pnr =
          displayValue(
            value(
              booking,
              ["pnr", "PNR"],
              "N/A"
            ),
            "N/A"
          );


        const status =
          displayValue(
            value(
              booking,
              [
                "bookingStatus",
                "status",
              ],
              "Confirmed"
            ),
            "Confirmed"
          );


        const passengerName =
          displayValue(
            value(
              booking,
              [
                "name",
                "passengerName",
                "fullName",
              ],
              "Passenger"
            ),
            "Passenger"
          );


        const email =
          displayValue(
            value(
              booking,
              [
                "email",
                "customerEmail",
              ],
              "-"
            ),
            "-"
          );


        const phone =
          displayValue(
            value(
              booking,
              [
                "phone",
                "mobile",
                "contactNumber",
              ],
              "-"
            ),
            "-"
          );


        const from =
          getFrom(booking);


        const to =
          getTo(booking);


        const flightNumber =
          getFlightNumber(booking);


        const departureDate =
          getDepartureDate(booking);


        const departureTime =
          getDepartureTime(booking);


        const passengers =
          getPassengerCount(
            booking
          );


        const rawAmount =
          booking?.amount ??
          booking?.totalAmount ??
          booking?.price ??
          booking?.totalPrice ??
          booking?.payment?.amount ??
          booking?.paymentDetails?.amount ??
          0;


        const amount =
          formatAmount(
            rawAmount
          );


        const paymentMethod =
          displayValue(
            value(
              booking,
              [
                "paymentMethod",
                "paymentMode",
              ],
              "-"
            ),
            "-"
          );


        const paymentId =
          displayValue(
            value(
              booking,
              [
                "paymentId",
                "utr",
                "transactionId",
              ],
              "-"
            ),
            "-"
          );


        const bookingId =
          displayValue(
            value(
              booking,
              [
                "_id",
                "bookingId",
              ],
              "-"
            ),
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
          .text(
            `PNR: ${pnr}`
          );


        doc
          .font("Helvetica")
          .text(
            `Status: ${status}`
          );


        doc.moveDown(1);


        /* =====================================================
           PASSENGER
        ===================================================== */

        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text(
            "Passenger Details"
          );


        doc.moveDown(0.4);


        doc
          .fontSize(10)
          .font("Helvetica")
          .text(
            `Name: ${passengerName}`
          )
          .text(
            `Email: ${email}`
          )
          .text(
            `Phone: ${phone}`
          )
          .text(
            `Passengers: ${passengers}`
          );


        doc.moveDown(1);


        /* =====================================================
           FLIGHT
        ===================================================== */

        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text(
            "Flight Details"
          );


        doc.moveDown(0.4);


        doc
          .fontSize(10)
          .font("Helvetica")
          .text(
            `From: ${from}`
          )
          .text(
            `To: ${to}`
          )
          .text(
            `Flight Number: ${flightNumber}`
          )
          .text(
            `Departure Date: ${departureDate}`
          )
          .text(
            `Departure Time: ${departureTime}`
          );


        doc.moveDown(1);


        /* =====================================================
           PAYMENT
        ===================================================== */

        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text(
            "Payment Details"
          );


        doc.moveDown(0.4);


        doc
          .fontSize(10)
          .font("Helvetica")
          .text(
            `Amount: ₹${amount}`
          )
          .text(
            `Payment Method: ${paymentMethod}`
          )
          .text(
            `Payment ID / UTR: ${paymentId}`
          );


        doc.moveDown(1);


        /* =====================================================
           BOOKING
        ===================================================== */

        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text(
            "Booking Information"
          );


        doc.moveDown(0.4);


        doc
          .fontSize(10)
          .font("Helvetica")
          .text(
            `Booking ID: ${bookingId}`
          )
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
    }
  );
};


/* =========================================================
   SEND TICKET EMAIL
========================================================= */

const sendTicketEmail = async ({
  to,
  booking,
  pdfBuffer = null,
}) => {

  if (!to) {
    throw new Error(
      "Ticket email recipient is missing."
    );
  }


  /*
    IMPORTANT:

    If controller already generated the ticket PDF,
    use EXACT SAME PDF BUFFER.

    Do NOT generate another PDF.
  */

  if (
    !pdfBuffer ||
    !Buffer.isBuffer(pdfBuffer)
  ) {
    pdfBuffer =
      await generateTicketPdf(
        booking
      );
  }


  const pnr =
    displayValue(
      value(
        booking,
        ["pnr", "PNR"],
        "Ticket"
      ),
      "Ticket"
    );


  const passengerName =
    displayValue(
      value(
        booking,
        [
          "name",
          "passengerName",
          "fullName",
        ],
        "Customer"
      ),
      "Customer"
    );


  const rawAmount =
    booking?.amount ??
    booking?.totalAmount ??
    booking?.price ??
    booking?.totalPrice ??
    booking?.payment?.amount ??
    0;


  const amount =
    formatAmount(
      rawAmount
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

        /*
          SAME PDF BUFFER
        */

        content:
          pdfBuffer.toString(
            "base64"
          ),
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
      displayValue(
        value(
          booking,
          [
            "name",
            "passengerName",
            "fullName",
          ],
          "Customer"
        ),
        "Customer"
      );


    const customerPhone =
      displayValue(
        value(
          booking,
          [
            "phone",
            "mobile",
            "contactNumber",
          ],
          "-"
        ),
        "-"
      );


    /* ---------- FLIGHT ---------- */

    const from =
      getFrom(booking);


    const to =
      getTo(booking);


    const passengers =
      getPassengerCount(
        booking
      );


    /* ---------- PAYMENT ---------- */

    const amount =
      formatAmount(
        paymentRequest?.amount ||
        0
      );


    const bankName =
      displayValue(
        paymentRequest?.bankName,
        "-"
      );


    const paymentId =
      displayValue(
        paymentRequest?.paymentId,
        "-"
      );


    const paymentDateTime =
      paymentRequest?.paymentDateTime
        ? new Date(
            paymentRequest.paymentDateTime
          ).toLocaleString(
            "en-IN"
          )
        : "-";


    /* =====================================================
       PUBLIC BACKEND URL
    ===================================================== */

    const backendUrl =
      process.env.BACKEND_URL ||
      "https://saiyed-travels-backend-1.onrender.com";


    const requestId =
      paymentRequest?._id
        ? paymentRequest._id.toString()
        : "";


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
      paymentRequest?.screenshot
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

                <td style="
                  padding:8px;
                ">
                  <strong>Email</strong>
                </td>

                <td style="
                  padding:8px;
                ">
                  ${displayValue(
                    paymentRequest?.customerEmail,
                    "-"
                  )}
                </td>

              </tr>


              <tr>

                <td style="
                  padding:8px;
                ">
                  <strong>Phone</strong>
                </td>

                <td style="
                  padding:8px;
                ">
                  ${customerPhone}
                </td>

              </tr>


              <tr>

                <td style="
                  padding:8px;
                ">
                  <strong>From</strong>
                </td>

                <td style="
                  padding:8px;
                ">
                  ${from}
                </td>

              </tr>


              <tr>

                <td style="
                  padding:8px;
                ">
                  <strong>To</strong>
                </td>

                <td style="
                  padding:8px;
                ">
                  ${to}
                </td>

              </tr>


              <tr>

                <td style="
                  padding:8px;
                ">
                  <strong>Passengers</strong>
                </td>

                <td style="
                  padding:8px;
                ">
                  ${passengers}
                </td>

              </tr>


              <tr>

                <td style="
                  padding:8px;
                ">
                  <strong>Amount</strong>
                </td>

                <td style="
                  padding:8px;
                ">
                  <strong>
                    ₹${amount}
                  </strong>
                </td>

              </tr>


              <tr>

                <td style="
                  padding:8px;
                ">
                  <strong>Bank</strong>
                </td>

                <td style="
                  padding:8px;
                ">
                  ${bankName}
                </td>

              </tr>


              <tr>

                <td style="
                  padding:8px;
                ">
                  <strong>UTR / Payment ID</strong>
                </td>

                <td style="
                  padding:8px;
                ">
                  ${paymentId}
                </td>

              </tr>


              <tr>

                <td style="
                  padding:8px;
                ">
                  <strong>Payment Date/Time</strong>
                </td>

                <td style="
                  padding:8px;
                ">
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