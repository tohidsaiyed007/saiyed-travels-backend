// // // // // const nodemailer = require("nodemailer");

// // // // // const sendTicketEmail = async ({
// // // // //   to,
// // // // //   booking,
// // // // //   ticketUrl = null,
// // // // // }) => {
// // // // //   try {
// // // // //     if (!to) {
// // // // //       throw new Error("Customer email is required.");
// // // // //     }

// // // // //     if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
// // // // //       throw new Error(
// // // // //         "EMAIL_USER or EMAIL_PASS is missing in backend .env"
// // // // //       );
// // // // //     }

// // // // //     const transporter = nodemailer.createTransport({
// // // // //       service: "gmail",
// // // // //       auth: {
// // // // //         user: process.env.EMAIL_USER,
// // // // //         pass: process.env.EMAIL_PASS,
// // // // //       },
// // // // //     });

// // // // //     const passenger =
// // // // //       booking?.passengers?.[0] || {};

// // // // //     const flight =
// // // // //       booking?.flight || {};

// // // // //     const subject =
// // // // //       `Saiyed Travels - Flight Ticket Confirmed | ${
// // // // //         booking?.pnr || "PNR"
// // // // //       }`;

// // // // //     const html = `
// // // // //       <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto;">

// // // // //         <h2 style="color:#0b5ed7;">
// // // // //           Saiyed Travels
// // // // //         </h2>

// // // // //         <h3>
// // // // //           🎉 Booking Confirmed
// // // // //         </h3>

// // // // //         <p>
// // // // //           Dear <strong>
// // // // //             ${passenger?.firstName || passenger?.name || "Customer"}
// // // // //           </strong>,
// // // // //         </p>

// // // // //         <p>
// // // // //           Your payment has been verified by Saiyed Travels
// // // // //           and your flight booking has been confirmed.
// // // // //         </p>

// // // // //         <hr />

// // // // //         <h3>Booking Details</h3>

// // // // //         <p>
// // // // //           <strong>Booking ID:</strong>
// // // // //           ${booking?.bookingId || booking?._id || "N/A"}
// // // // //         </p>

// // // // //         <p>
// // // // //           <strong>PNR:</strong>
// // // // //           ${booking?.pnr || "N/A"}
// // // // //         </p>

// // // // //         <p>
// // // // //           <strong>Airline:</strong>
// // // // //           ${flight?.airline || "N/A"}
// // // // //         </p>

// // // // //         <p>
// // // // //           <strong>Flight:</strong>
// // // // //           ${flight?.flightNo || "N/A"}
// // // // //         </p>

// // // // //         <p>
// // // // //           <strong>Route:</strong>
// // // // //           ${flight?.from || "N/A"}
// // // // //           →
// // // // //           ${flight?.to || "N/A"}
// // // // //         </p>

// // // // //         <p>
// // // // //           <strong>Amount Paid:</strong>
// // // // //           ₹${Number(booking?.total || 0).toLocaleString("en-IN")}
// // // // //         </p>

// // // // //         <hr />

// // // // //         <p>
// // // // //           Your ticket is now confirmed.
// // // // //         </p>

// // // // //         ${
// // // // //           ticketUrl
// // // // //             ? `
// // // // //               <p>
// // // // //                 <a
// // // // //                   href="${ticketUrl}"
// // // // //                   style="
// // // // //                     display:inline-block;
// // // // //                     padding:12px 20px;
// // // // //                     background:#0b5ed7;
// // // // //                     color:white;
// // // // //                     text-decoration:none;
// // // // //                     border-radius:6px;
// // // // //                   "
// // // // //                 >
// // // // //                   View / Download Ticket
// // // // //                 </a>
// // // // //               </p>
// // // // //             `
// // // // //             : ""
// // // // //         }

// // // // //         <p style="color:#666;">
// // // // //           Thank you for choosing Saiyed Travels.
// // // // //         </p>

// // // // //         <p>
// // // // //           Regards,<br />
// // // // //           <strong>Saiyed Travels</strong>
// // // // //         </p>

// // // // //       </div>
// // // // //     `;

// // // // //     const info = await transporter.sendMail({
// // // // //       from: `"Saiyed Travels" <${process.env.EMAIL_USER}>`,
// // // // //       to,
// // // // //       subject,
// // // // //       html,
// // // // //     });

// // // // //     console.log(
// // // // //       "TICKET EMAIL SENT:",
// // // // //       info.messageId
// // // // //     );

// // // // //     return {
// // // // //       success: true,
// // // // //       messageId: info.messageId,
// // // // //     };

// // // // //   } catch (error) {
// // // // //     console.error(
// // // // //       "TICKET EMAIL ERROR:",
// // // // //       error.message
// // // // //     );

// // // // //     throw error;
// // // // //   }
// // // // // };

// // // // // module.exports = {
// // // // //   sendTicketEmail,
// // // // // };


// // // // const nodemailer = require("nodemailer");

// // // // // =====================================================
// // // // // CREATE GMAIL TRANSPORTER
// // // // // =====================================================

// // // // const createTransporter = () => {
// // // //   if (
// // // //     !process.env.EMAIL_USER ||
// // // //     !process.env.EMAIL_PASS
// // // //   ) {
// // // //     throw new Error(
// // // //       "EMAIL_USER or EMAIL_PASS is missing in backend .env"
// // // //     );
// // // //   }

// // // //   return nodemailer.createTransport({
// // // //     service: "gmail",
// // // //     auth: {
// // // //       user: process.env.EMAIL_USER,
// // // //       pass: process.env.EMAIL_PASS,
// // // //     },
// // // //   });
// // // // };


// // // // // =====================================================
// // // // // SEND TICKET EMAIL TO CUSTOMER
// // // // // =====================================================

// // // // const sendTicketEmail = async ({
// // // //   to,
// // // //   booking,
// // // //   ticketUrl = null,
// // // // }) => {
// // // //   try {
// // // //     if (!to) {
// // // //       throw new Error("Customer email is required.");
// // // //     }

// // // //     const transporter = createTransporter();

// // // //     const passenger =
// // // //       booking?.passengers?.[0] || {};

// // // //     const flight =
// // // //       booking?.flight || {};

// // // //     const subject =
// // // //       `Saiyed Travels - Flight Ticket Confirmed | ${
// // // //         booking?.pnr || "PNR"
// // // //       }`;

// // // //     const html = `
// // // //       <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto;">

// // // //         <h2 style="color:#0b5ed7;">
// // // //           Saiyed Travels
// // // //         </h2>

// // // //         <h3>
// // // //           🎉 Booking Confirmed
// // // //         </h3>

// // // //         <p>
// // // //           Dear <strong>
// // // //             ${
// // // //               passenger?.firstName ||
// // // //               passenger?.name ||
// // // //               "Customer"
// // // //             }
// // // //           </strong>,
// // // //         </p>

// // // //         <p>
// // // //           Your payment has been verified by Saiyed Travels
// // // //           and your flight booking has been confirmed.
// // // //         </p>

// // // //         <hr />

// // // //         <h3>Booking Details</h3>

// // // //         <p>
// // // //           <strong>Booking ID:</strong>
// // // //           ${
// // // //             booking?.bookingId ||
// // // //             booking?._id ||
// // // //             "N/A"
// // // //           }
// // // //         </p>

// // // //         <p>
// // // //           <strong>PNR:</strong>
// // // //           ${booking?.pnr || "N/A"}
// // // //         </p>

// // // //         <p>
// // // //           <strong>Airline:</strong>
// // // //           ${flight?.airline || "N/A"}
// // // //         </p>

// // // //         <p>
// // // //           <strong>Flight:</strong>
// // // //           ${flight?.flightNo || "N/A"}
// // // //         </p>

// // // //         <p>
// // // //           <strong>Route:</strong>
// // // //           ${flight?.from || "N/A"}
// // // //           →
// // // //           ${flight?.to || "N/A"}
// // // //         </p>

// // // //         <p>
// // // //           <strong>Amount Paid:</strong>
// // // //           ₹${Number(
// // // //             booking?.total || 0
// // // //           ).toLocaleString("en-IN")}
// // // //         </p>

// // // //         <hr />

// // // //         <p>
// // // //           Your ticket is now confirmed.
// // // //         </p>

// // // //         ${
// // // //           ticketUrl
// // // //             ? `
// // // //               <p>
// // // //                 <a
// // // //                   href="${ticketUrl}"
// // // //                   style="
// // // //                     display:inline-block;
// // // //                     padding:12px 20px;
// // // //                     background:#0b5ed7;
// // // //                     color:white;
// // // //                     text-decoration:none;
// // // //                     border-radius:6px;
// // // //                   "
// // // //                 >
// // // //                   View / Download Ticket
// // // //                 </a>
// // // //               </p>
// // // //             `
// // // //             : ""
// // // //         }

// // // //         <p style="color:#666;">
// // // //           Thank you for choosing Saiyed Travels.
// // // //         </p>

// // // //         <p>
// // // //           Regards,<br />
// // // //           <strong>Saiyed Travels</strong>
// // // //         </p>

// // // //       </div>
// // // //     `;

// // // //     const info = await transporter.sendMail({
// // // //       from: `"Saiyed Travels" <${process.env.EMAIL_USER}>`,
// // // //       to,
// // // //       subject,
// // // //       html,
// // // //     });

// // // //     console.log(
// // // //       "TICKET EMAIL SENT:",
// // // //       info.messageId
// // // //     );

// // // //     return {
// // // //       success: true,
// // // //       messageId: info.messageId,
// // // //     };

// // // //   } catch (error) {
// // // //     console.error(
// // // //       "TICKET EMAIL ERROR:",
// // // //       error.message
// // // //     );

// // // //     throw error;
// // // //   }
// // // // };


// // // // // =====================================================
// // // // // SEND NEW PAYMENT REQUEST NOTIFICATION TO ADMIN
// // // // // =====================================================

// // // // const sendAdminPaymentNotification = async ({
// // // //   paymentRequest,
// // // // }) => {
// // // //   try {
// // // //     if (!paymentRequest) {
// // // //       throw new Error(
// // // //         "Payment request data is required."
// // // //       );
// // // //     }

// // // //     const transporter = createTransporter();

// // // //     // -----------------------------------------
// // // //     // ADMIN EMAIL
// // // //     // -----------------------------------------

// // // //     const adminEmail =
// // // //       process.env.EMAIL_USER;

// // // //     if (!adminEmail) {
// // // //       throw new Error(
// // // //         "EMAIL_USER is missing in backend .env"
// // // //       );
// // // //     }

// // // //     // -----------------------------------------
// // // //     // BOOKING DATA
// // // //     // -----------------------------------------

// // // //     const booking =
// // // //       paymentRequest.bookingData || {};

// // // //     const passenger =
// // // //       booking?.passengers?.[0] || {};

// // // //     const flight =
// // // //       booking?.flight || {};

// // // //     const customerName =
// // // //       passenger?.firstName ||
// // // //       passenger?.name ||
// // // //       booking?.name ||
// // // //       "Customer";

// // // //     const from =
// // // //       flight?.from ||
// // // //       booking?.from ||
// // // //       "N/A";

// // // //     const to =
// // // //       flight?.to ||
// // // //       booking?.to ||
// // // //       "N/A";

// // // //     const airline =
// // // //       flight?.airline ||
// // // //       "N/A";

// // // //     const flightNo =
// // // //       flight?.flightNo ||
// // // //       "N/A";

// // // //     const amount =
// // // //       Number(
// // // //         paymentRequest.amount || 0
// // // //       ).toLocaleString("en-IN");

// // // //     const paymentDateTime =
// // // //       paymentRequest.paymentDateTime
// // // //         ? new Date(
// // // //             paymentRequest.paymentDateTime
// // // //           ).toLocaleString("en-IN")
// // // //         : "N/A";

// // // //     // Screenshot URL
// // // //     const screenshotUrl =
// // // //       paymentRequest.screenshot
// // // //         ? `https://saiyed-travels-backend-1.onrender.com${paymentRequest.screenshot}`
// // // //         : null;

// // // //     // -----------------------------------------
// // // //     // EMAIL SUBJECT
// // // //     // -----------------------------------------

// // // //     const subject =
// // // //       `🔔 New Payment Request - ₹${amount} | ${customerName}`;

// // // //     // -----------------------------------------
// // // //     // EMAIL HTML
// // // //     // -----------------------------------------

// // // //     const html = `
// // // //       <div
// // // //         style="
// // // //           font-family: Arial, sans-serif;
// // // //           max-width: 700px;
// // // //           margin: auto;
// // // //           background:#f7f9fc;
// // // //           padding:20px;
// // // //         "
// // // //       >

// // // //         <div
// // // //           style="
// // // //             background:#0b5ed7;
// // // //             color:white;
// // // //             padding:20px;
// // // //             border-radius:10px 10px 0 0;
// // // //           "
// // // //         >
// // // //           <h2 style="margin:0;">
// // // //             Saiyed Travels
// // // //           </h2>

// // // //           <p style="margin:8px 0 0;">
// // // //             New Payment Request Received
// // // //           </p>
// // // //         </div>

// // // //         <div
// // // //           style="
// // // //             background:white;
// // // //             padding:25px;
// // // //             border-radius:0 0 10px 10px;
// // // //           "
// // // //         >

// // // //           <h3>
// // // //             🔔 Payment Verification Required
// // // //           </h3>

// // // //           <p>
// // // //             A customer has submitted a new payment
// // // //             request. Please verify the payment manually
// // // //             from the Admin Dashboard.
// // // //           </p>

// // // //           <hr />

// // // //           <h3>Customer Details</h3>

// // // //           <p>
// // // //             <strong>Name:</strong>
// // // //             ${customerName}
// // // //           </p>

// // // //           <p>
// // // //             <strong>Email:</strong>
// // // //             ${paymentRequest.customerEmail || "N/A"}
// // // //           </p>

// // // //           <p>
// // // //             <strong>Phone:</strong>
// // // //             ${
// // // //               passenger?.phone ||
// // // //               booking?.phone ||
// // // //               "N/A"
// // // //             }
// // // //           </p>

// // // //           <hr />

// // // //           <h3>Flight Details</h3>

// // // //           <p>
// // // //             <strong>Airline:</strong>
// // // //             ${airline}
// // // //           </p>

// // // //           <p>
// // // //             <strong>Flight:</strong>
// // // //             ${flightNo}
// // // //           </p>

// // // //           <p>
// // // //             <strong>Route:</strong>
// // // //             ${from} → ${to}
// // // //           </p>

// // // //           <hr />

// // // //           <h3>Payment Details</h3>

// // // //           <p>
// // // //             <strong>Amount:</strong>
// // // //             ₹${amount}
// // // //           </p>

// // // //           <p>
// // // //             <strong>Bank:</strong>
// // // //             ${paymentRequest.bankName || "N/A"}
// // // //           </p>

// // // //           <p>
// // // //             <strong>Payment ID / UTR:</strong>
// // // //             ${paymentRequest.paymentId || "N/A"}
// // // //           </p>

// // // //           <p>
// // // //             <strong>Payment Date & Time:</strong>
// // // //             ${paymentDateTime}
// // // //           </p>

// // // //           <p>
// // // //             <strong>Status:</strong>
// // // //             <span
// // // //               style="
// // // //                 background:#fff3cd;
// // // //                 color:#856404;
// // // //                 padding:5px 10px;
// // // //                 border-radius:5px;
// // // //               "
// // // //             >
// // // //               Pending Verification
// // // //             </span>
// // // //           </p>

// // // //           <hr />

// // // //           ${
// // // //             screenshotUrl
// // // //               ? `
// // // //                 <p>
// // // //                   <strong>
// // // //                     Payment Screenshot:
// // // //                   </strong>
// // // //                 </p>

// // // //                 <p>
// // // //                   <a
// // // //                     href="${screenshotUrl}"
// // // //                     target="_blank"
// // // //                     style="
// // // //                       display:inline-block;
// // // //                       padding:10px 16px;
// // // //                       background:#198754;
// // // //                       color:white;
// // // //                       text-decoration:none;
// // // //                       border-radius:6px;
// // // //                     "
// // // //                   >
// // // //                     View Payment Screenshot
// // // //                   </a>
// // // //                 </p>
// // // //               `
// // // //               : ""
// // // //           }

// // // //           <br />

// // // //           <p>
// // // //             Please open the Admin Dashboard and
// // // //             verify the UTR/payment screenshot before
// // // //             accepting the booking.
// // // //           </p>

// // // //           <p>
// // // //             <strong>
// // // //               ⚠️ Do not confirm the booking only from
// // // //               this email. Verify the payment manually.
// // // //             </strong>
// // // //           </p>

// // // //           <hr />

// // // //           <p style="color:#666;">
// // // //             Saiyed Travels Admin Notification
// // // //           </p>

// // // //         </div>

// // // //       </div>
// // // //     `;

// // // //     const info = await transporter.sendMail({
// // // //       from: `"Saiyed Travels" <${process.env.EMAIL_USER}>`,
// // // //       to: adminEmail,
// // // //       subject,
// // // //       html,
// // // //     });

// // // //     console.log(
// // // //       "ADMIN PAYMENT NOTIFICATION SENT:",
// // // //       info.messageId
// // // //     );

// // // //     return {
// // // //       success: true,
// // // //       messageId: info.messageId,
// // // //     };

// // // //   } catch (error) {
// // // //     console.error(
// // // //       "ADMIN PAYMENT NOTIFICATION ERROR:",
// // // //       error.message
// // // //     );

// // // //     // Email fail hone par payment request ko
// // // //     // fail nahi karna chahiye.
// // // //     return {
// // // //       success: false,
// // // //       message: error.message,
// // // //     };
// // // //   }
// // // // };


// // // // // =====================================================
// // // // // EXPORT
// // // // // =====================================================

// // // // module.exports = {
// // // //   sendTicketEmail,
// // // //   sendAdminPaymentNotification,
// // // // };


// // // const nodemailer = require("nodemailer");
// // // const PDFDocument = require("pdfkit");

// // // // =====================================================
// // // // CREATE GMAIL TRANSPORTER
// // // // =====================================================

// // // const createTransporter = () => {
// // //   if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
// // //     throw new Error(
// // //       "EMAIL_USER or EMAIL_PASS is missing in backend .env"
// // //     );
// // //   }

// // //   return nodemailer.createTransport({
// // //     service: "gmail",
// // //     auth: {
// // //       user: process.env.EMAIL_USER,
// // //       pass: process.env.EMAIL_PASS,
// // //     },
// // //   });
// // // };

// // // // =====================================================
// // // // SAFE VALUE HELPER
// // // // =====================================================

// // // const value = (data, fallback = "-") => {
// // //   if (
// // //     data === undefined ||
// // //     data === null ||
// // //     data === ""
// // //   ) {
// // //     return fallback;
// // //   }

// // //   return String(data);
// // // };

// // // // =====================================================
// // // // GENERATE PDF TICKET
// // // // =====================================================

// // // const generateTicketPdf = (booking) => {
// // //   return new Promise((resolve, reject) => {
// // //     try {
// // //       const doc = new PDFDocument({
// // //         size: "A4",
// // //         margin: 45,
// // //       });

// // //       const chunks = [];

// // //       doc.on("data", (chunk) => {
// // //         chunks.push(chunk);
// // //       });

// // //       doc.on("end", () => {
// // //         resolve(Buffer.concat(chunks));
// // //       });

// // //       doc.on("error", (error) => {
// // //         reject(error);
// // //       });

// // //       // -------------------------------------------------
// // //       // BOOKING DATA
// // //       // -------------------------------------------------

// // //       const passenger =
// // //         booking?.passengers?.[0] || {};

// // //       const flight =
// // //         booking?.flight || {};

// // //       const pnr =
// // //         value(
// // //           booking?.pnr ||
// // //           booking?.PNR
// // //         );

// // //       const bookingId =
// // //         value(
// // //           booking?._id ||
// // //           booking?.bookingId
// // //         );

// // //       const passengerName =
// // //         value(
// // //           passenger?.name ||
// // //           `${passenger?.firstName || ""} ${
// // //             passenger?.lastName || ""
// // //           }`.trim()
// // //         );

// // //       const passengerEmail =
// // //         value(
// // //           passenger?.email ||
// // //           booking?.customerEmail ||
// // //           booking?.email
// // //         );

// // //       const passengerPhone =
// // //         value(
// // //           passenger?.phone ||
// // //           booking?.phone ||
// // //           booking?.mobile
// // //         );

// // //       const from =
// // //         value(
// // //           flight?.from ||
// // //           booking?.from
// // //         );

// // //       const to =
// // //         value(
// // //           flight?.to ||
// // //           booking?.to
// // //         );

// // //       const airline =
// // //         value(
// // //           flight?.airline ||
// // //           flight?.airlineName ||
// // //           booking?.airline
// // //         );

// // //       const flightNumber =
// // //         value(
// // //           flight?.flightNumber ||
// // //           flight?.flightNo ||
// // //           booking?.flightNumber
// // //         );

// // //       const travelDate =
// // //         value(
// // //           flight?.date ||
// // //           flight?.travelDate ||
// // //           booking?.date
// // //         );

// // //       const departureTime =
// // //         value(
// // //           flight?.departureTime ||
// // //           flight?.departure
// // //         );

// // //       const arrivalTime =
// // //         value(
// // //           flight?.arrivalTime ||
// // //           flight?.arrival
// // //         );

// // //       const paymentMethod =
// // //         value(
// // //           booking?.paymentMethod ||
// // //           booking?.bankName
// // //         );

// // //       const paymentId =
// // //         value(
// // //           booking?.paymentId ||
// // //           booking?.utr ||
// // //           booking?.transactionId
// // //         );

// // //       const amount =
// // //         value(
// // //           booking?.totalAmount ??
// // //           booking?.amount ??
// // //           booking?.payableAmount ??
// // //           booking?.fare,
// // //           "0"
// // //         );

// // //       // =================================================
// // //       // HEADER
// // //       // =================================================

// // //       doc
// // //         .fontSize(24)
// // //         .font("Helvetica-Bold")
// // //         .text("SAIYED TRAVELS", {
// // //           align: "center",
// // //         });

// // //       doc
// // //         .fontSize(11)
// // //         .font("Helvetica")
// // //         .text(
// // //           "Flight Booking & Travel Services",
// // //           {
// // //             align: "center",
// // //           }
// // //         );

// // //       doc.moveDown(1);

// // //       // -------------------------------------------------
// // //       // TICKET TITLE
// // //       // -------------------------------------------------

// // //       doc
// // //         .fontSize(18)
// // //         .font("Helvetica-Bold")
// // //         .text("E-TICKET / BOOKING CONFIRMATION", {
// // //           align: "center",
// // //         });

// // //       doc.moveDown(0.8);

// // //       // =================================================
// // //       // PNR BOX
// // //       // =================================================

// // //       const boxTop = doc.y;

// // //       doc
// // //         .roundedRect(
// // //           45,
// // //           boxTop,
// // //           505,
// // //           65,
// // //           8
// // //         )
// // //         .stroke();

// // //       doc
// // //         .fontSize(10)
// // //         .font("Helvetica")
// // //         .text(
// // //           "PNR",
// // //           65,
// // //           boxTop + 13
// // //         );

// // //       doc
// // //         .fontSize(18)
// // //         .font("Helvetica-Bold")
// // //         .text(
// // //           pnr,
// // //           65,
// // //           boxTop + 29
// // //         );

// // //       doc
// // //         .fontSize(10)
// // //         .font("Helvetica")
// // //         .text(
// // //           "STATUS",
// // //           380,
// // //           boxTop + 13
// // //         );

// // //       doc
// // //         .fontSize(14)
// // //         .font("Helvetica-Bold")
// // //         .text(
// // //           "CONFIRMED",
// // //           380,
// // //           boxTop + 29
// // //         );

// // //       doc.y = boxTop + 85;

// // //       // =================================================
// // //       // PASSENGER DETAILS
// // //       // =================================================

// // //       doc
// // //         .fontSize(14)
// // //         .font("Helvetica-Bold")
// // //         .text("PASSENGER DETAILS");

// // //       doc.moveDown(0.4);

// // //       doc
// // //         .fontSize(10)
// // //         .font("Helvetica")
// // //         .text(
// // //           `Passenger Name: ${passengerName}`
// // //         );

// // //       doc
// // //         .text(
// // //           `Email: ${passengerEmail}`
// // //         );

// // //       doc
// // //         .text(
// // //           `Phone: ${passengerPhone}`
// // //         );

// // //       doc.moveDown(1);

// // //       // =================================================
// // //       // FLIGHT DETAILS
// // //       // =================================================

// // //       doc
// // //         .fontSize(14)
// // //         .font("Helvetica-Bold")
// // //         .text("FLIGHT DETAILS");

// // //       doc.moveDown(0.4);

// // //       doc
// // //         .fontSize(10)
// // //         .font("Helvetica")
// // //         .text(
// // //           `Airline: ${airline}`
// // //         );

// // //       doc
// // //         .text(
// // //           `Flight Number: ${flightNumber}`
// // //         );

// // //       doc
// // //         .text(
// // //           `From: ${from}`
// // //         );

// // //       doc
// // //         .text(
// // //           `To: ${to}`
// // //         );

// // //       doc
// // //         .text(
// // //           `Travel Date: ${travelDate}`
// // //         );

// // //       doc
// // //         .text(
// // //           `Departure: ${departureTime}`
// // //         );

// // //       doc
// // //         .text(
// // //           `Arrival: ${arrivalTime}`
// // //         );

// // //       doc.moveDown(1);

// // //       // =================================================
// // //       // PAYMENT DETAILS
// // //       // =================================================

// // //       doc
// // //         .fontSize(14)
// // //         .font("Helvetica-Bold")
// // //         .text("PAYMENT DETAILS");

// // //       doc.moveDown(0.4);

// // //       doc
// // //         .fontSize(10)
// // //         .font("Helvetica")
// // //         .text(
// // //           `Payment Method: ${paymentMethod}`
// // //         );

// // //       doc
// // //         .text(
// // //           `Payment ID / UTR: ${paymentId}`
// // //         );

// // //       doc
// // //         .fontSize(12)
// // //         .font("Helvetica-Bold")
// // //         .text(
// // //           `Total Amount Paid: ₹${amount}`
// // //         );

// // //       doc.moveDown(1);

// // //       // =================================================
// // //       // BOOKING ID
// // //       // =================================================

// // //       doc
// // //         .fontSize(10)
// // //         .font("Helvetica")
// // //         .text(
// // //           `Booking ID: ${bookingId}`
// // //         );

// // //       doc.moveDown(1);

// // //       // =================================================
// // //       // IMPORTANT INFORMATION
// // //       // =================================================

// // //       doc
// // //         .fontSize(13)
// // //         .font("Helvetica-Bold")
// // //         .text("IMPORTANT INFORMATION");

// // //       doc.moveDown(0.4);

// // //       doc
// // //         .fontSize(9)
// // //         .font("Helvetica")
// // //         .text(
// // //           "• Please carry a valid government ID during travel."
// // //         );

// // //       doc
// // //         .text(
// // //           "• Please reach the airport well before the scheduled departure."
// // //         );

// // //       doc
// // //         .text(
// // //           "• This ticket is generated after manual payment verification by Saiyed Travels."
// // //         );

// // //       doc
// // //         .text(
// // //           "• Please keep this e-ticket safely for your records."
// // //         );

// // //       doc.moveDown(1);

// // //       // =================================================
// // //       // FOOTER
// // //       // =================================================

// // //       doc
// // //         .fontSize(10)
// // //         .font("Helvetica-Bold")
// // //         .text(
// // //           "Thank you for booking with Saiyed Travels.",
// // //           {
// // //             align: "center",
// // //           }
// // //         );

// // //       doc
// // //         .fontSize(8)
// // //         .font("Helvetica")
// // //         .text(
// // //           "SAIYEDTRAVELS.COM",
// // //           {
// // //             align: "center",
// // //           }
// // //         );

// // //       doc.end();

// // //     } catch (error) {
// // //       reject(error);
// // //     }
// // //   });
// // // };

// // // // =====================================================
// // // // SEND CUSTOMER TICKET EMAIL
// // // // =====================================================

// // // const sendTicketEmail = async ({
// // //   to,
// // //   booking,
// // // }) => {
// // //   try {
// // //     if (!to) {
// // //       throw new Error(
// // //         "Customer email is required."
// // //       );
// // //     }

// // //     const transporter =
// // //       createTransporter();

// // //     // Generate PDF
// // //     const pdfBuffer =
// // //       await generateTicketPdf(
// // //         booking
// // //       );

// // //     const pnr =
// // //       value(
// // //         booking?.pnr ||
// // //         booking?.PNR,
// // //         "PNR"
// // //       );

// // //     const subject =
// // //       `Saiyed Travels - Flight Ticket Confirmed | ${pnr}`;

// // //     const html = `
// // //       <div style="font-family:Arial,sans-serif;line-height:1.6;">
// // //         <h2>SAIYED TRAVELS</h2>

// // //         <h3>Booking Confirmed 🎫</h3>

// // //         <p>
// // //           Dear Customer,
// // //         </p>

// // //         <p>
// // //           Your payment has been verified and your
// // //           flight booking has been successfully confirmed.
// // //         </p>

// // //         <p>
// // //           <strong>PNR:</strong> ${pnr}
// // //         </p>

// // //         <p>
// // //           Your official ticket PDF is attached to this email.
// // //         </p>

// // //         <p>
// // //           Please keep the PDF safely for your travel.
// // //         </p>

// // //         <br />

// // //         <p>
// // //           Thank you for choosing
// // //           <strong>Saiyed Travels</strong>.
// // //         </p>

// // //         <p>
// // //           SAIYEDTRAVELS.COM
// // //         </p>
// // //       </div>
// // //     `;

// // //     const info =
// // //       await transporter.sendMail({
// // //         from:
// // //           `"Saiyed Travels" <${process.env.EMAIL_USER}>`,

// // //         to,

// // //         subject,

// // //         html,

// // //         attachments: [
// // //           {
// // //             filename:
// // //               `Saiyed-Travels-Ticket-${pnr}.pdf`,

// // //             content:
// // //               pdfBuffer,

// // //             contentType:
// // //               "application/pdf",
// // //           },
// // //         ],
// // //       });

// // //     console.log(
// // //       "CUSTOMER TICKET PDF EMAIL SENT:",
// // //       info.messageId
// // //     );

// // //     return {
// // //       success: true,
// // //       messageId: info.messageId,
// // //     };

// // //   } catch (error) {
// // //     console.error(
// // //       "CUSTOMER TICKET EMAIL ERROR:",
// // //       error.message
// // //     );

// // //     throw error;
// // //   }
// // // };

// // // // =====================================================
// // // // SEND ADMIN PAYMENT NOTIFICATION
// // // // =====================================================

// // // const sendAdminPaymentNotification = async ({
// // //   paymentRequest,
// // // }) => {
// // //   try {
// // //     const adminEmail =
// // //       process.env.EMAIL_USER;

// // //     if (!adminEmail) {
// // //       throw new Error(
// // //         "EMAIL_USER is missing in backend .env"
// // //       );
// // //     }

// // //     const transporter =
// // //       createTransporter();

// // //     const booking =
// // //       paymentRequest?.bookingData || {};

// // //     const passenger =
// // //       booking?.passengers?.[0] || {};

// // //     const pnr =
// // //       value(
// // //         booking?.pnr ||
// // //         booking?.PNR,
// // //         "Not Generated Yet"
// // //       );

// // //     const customerName =
// // //       value(
// // //         passenger?.name ||
// // //         `${passenger?.firstName || ""} ${
// // //           passenger?.lastName || ""
// // //         }`.trim()
// // //       );

// // //     const customerPhone =
// // //       value(
// // //         passenger?.phone ||
// // //         booking?.phone ||
// // //         booking?.mobile
// // //       );

// // //     const customerEmail =
// // //       value(
// // //         paymentRequest?.customerEmail ||
// // //         passenger?.email ||
// // //         booking?.email
// // //       );

// // //     const amount =
// // //       value(
// // //         paymentRequest?.amount,
// // //         "0"
// // //       );

// // //     const bankName =
// // //       value(
// // //         paymentRequest?.bankName
// // //       );

// // //     const paymentId =
// // //       value(
// // //         paymentRequest?.paymentId
// // //       );

// // //     const paymentDateTime =
// // //       paymentRequest?.paymentDateTime
// // //         ? new Date(
// // //             paymentRequest.paymentDateTime
// // //           ).toLocaleString("en-IN")
// // //         : "-";

// // //     const from =
// // //       value(
// // //         booking?.flight?.from ||
// // //         booking?.from
// // //       );

// // //     const to =
// // //       value(
// // //         booking?.flight?.to ||
// // //         booking?.to
// // //       );

// // //     const flightNumber =
// // //       value(
// // //         booking?.flight?.flightNumber ||
// // //         booking?.flightNumber
// // //       );

// // //     const backendUrl =
// // //       process.env.BACKEND_URL ||
// // //       "https://saiyed-travels-backend-1.onrender.com";

// // //     const screenshotUrl =
// // //       paymentRequest?.screenshot
// // //         ? `${backendUrl}${paymentRequest.screenshot}`
// // //         : null;

// // //     const html = `
// // //       <div style="font-family:Arial,sans-serif;line-height:1.6;">

// // //         <h2>SAIYED TRAVELS</h2>

// // //         <h3>🔔 New Payment Request</h3>

// // //         <p>
// // //           A customer has submitted a payment request.
// // //           Please verify the payment manually.
// // //         </p>

// // //         <hr />

// // //         <h3>Customer Details</h3>

// // //         <p>
// // //           <strong>Name:</strong>
// // //           ${customerName}
// // //         </p>

// // //         <p>
// // //           <strong>Email:</strong>
// // //           ${customerEmail}
// // //         </p>

// // //         <p>
// // //           <strong>Phone:</strong>
// // //           ${customerPhone}
// // //         </p>

// // //         <h3>Flight Details</h3>

// // //         <p>
// // //           <strong>From:</strong>
// // //           ${from}
// // //         </p>

// // //         <p>
// // //           <strong>To:</strong>
// // //           ${to}
// // //         </p>

// // //         <p>
// // //           <strong>Flight:</strong>
// // //           ${flightNumber}
// // //         </p>

// // //         <h3>Payment Details</h3>

// // //         <p>
// // //           <strong>Amount:</strong>
// // //           ₹${amount}
// // //         </p>

// // //         <p>
// // //           <strong>Bank:</strong>
// // //           ${bankName}
// // //         </p>

// // //         <p>
// // //           <strong>Payment ID / UTR:</strong>
// // //           ${paymentId}
// // //         </p>

// // //         <p>
// // //           <strong>Payment Date & Time:</strong>
// // //           ${paymentDateTime}
// // //         </p>

// // //         ${
// // //           screenshotUrl
// // //             ? `
// // //               <p>
// // //                 <strong>Payment Screenshot:</strong>
// // //                 <br />
// // //                 <a href="${screenshotUrl}">
// // //                   View Payment Screenshot
// // //                 </a>
// // //               </p>
// // //             `
// // //             : ""
// // //         }

// // //         <hr />

// // //         <p>
// // //           ⚠️ Please verify the payment manually
// // //           before accepting this request.
// // //         </p>

// // //         <p>
// // //           After acceptance, the booking will be
// // //           confirmed and the ticket PDF will be sent
// // //           to the customer and admin email.
// // //         </p>

// // //         <br />

// // //         <strong>
// // //           Saiyed Travels Admin
// // //         </strong>

// // //       </div>
// // //     `;

// // //     const info =
// // //       await transporter.sendMail({
// // //         from:
// // //           `"Saiyed Travels" <${process.env.EMAIL_USER}>`,

// // //         to: adminEmail,

// // //         subject:
// // //           `🔔 New Payment Request - ₹${amount}`,

// // //         html,
// // //       });

// // //     console.log(
// // //       "ADMIN PAYMENT NOTIFICATION SENT:",
// // //       info.messageId
// // //     );

// // //     return {
// // //       success: true,
// // //       messageId: info.messageId,
// // //     };

// // //   } catch (error) {
// // //     console.error(
// // //       "ADMIN PAYMENT NOTIFICATION ERROR:",
// // //       error.message
// // //     );

// // //     throw error;
// // //   }
// // // };

// // // // =====================================================
// // // // EXPORTS
// // // // =====================================================

// // // module.exports = {
// // //   sendTicketEmail,
// // //   sendAdminPaymentNotification,
// // //   generateTicketPdf,
// // // };











// // const nodemailer = require("nodemailer");
// // const PDFDocument = require("pdfkit");
// // const crypto = require("crypto");

// // /* =========================================================
// //    GMAIL TRANSPORTER
// // ========================================================= */

// // const createTransporter = () => {
// //   if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
// //     throw new Error(
// //       "EMAIL_USER or EMAIL_PASS is missing in .env"
// //     );
// //   }

// //   return nodemailer.createTransport({
// //     service: "gmail",

// //     auth: {
// //       user: process.env.EMAIL_USER,
// //       pass: process.env.EMAIL_PASS,
// //     },
// //   });
// // };


// // /* =========================================================
// //    HELPER
// // ========================================================= */

// // const value = (obj, keys, fallback = "-") => {
// //   for (const key of keys) {
// //     const val = obj?.[key];

// //     if (
// //       val !== undefined &&
// //       val !== null &&
// //       String(val).trim() !== ""
// //     ) {
// //       return val;
// //     }
// //   }

// //   return fallback;
// // };


// // /* =========================================================
// //    PDF GENERATOR
// // ========================================================= */

// // const generateTicketPdf = (booking) => {
// //   return new Promise((resolve, reject) => {
// //     try {
// //       const doc = new PDFDocument({
// //         size: "A4",
// //         margin: 40,
// //       });

// //       const chunks = [];

// //       doc.on("data", (chunk) => {
// //         chunks.push(chunk);
// //       });

// //       doc.on("end", () => {
// //         resolve(Buffer.concat(chunks));
// //       });

// //       doc.on("error", reject);

// //       const pnr = value(
// //         booking,
// //         ["pnr", "PNR"],
// //         "N/A"
// //       );

// //       const status = value(
// //         booking,
// //         ["bookingStatus", "status"],
// //         "Confirmed"
// //       );

// //       const passengerName = value(
// //         booking,
// //         [
// //           "name",
// //           "passengerName",
// //           "fullName",
// //         ],
// //         "Passenger"
// //       );

// //       const email = value(
// //         booking,
// //         [
// //           "email",
// //           "customerEmail",
// //         ],
// //         "-"
// //       );

// //       const phone = value(
// //         booking,
// //         [
// //           "phone",
// //           "mobile",
// //           "contactNumber",
// //         ],
// //         "-"
// //       );

// //       const from = value(
// //         booking,
// //         ["from", "source", "origin"],
// //         "-"
// //       );

// //       const to = value(
// //         booking,
// //         ["to", "destination"],
// //         "-"
// //       );

// //       const flightNumber = value(
// //         booking,
// //         [
// //           "flightNumber",
// //           "flightNo",
// //           "flight",
// //         ],
// //         "-"
// //       );

// //       const departureDate = value(
// //         booking,
// //         [
// //           "departureDate",
// //           "date",
// //           "travelDate",
// //         ],
// //         "-"
// //       );

// //       const departureTime = value(
// //         booking,
// //         [
// //           "departureTime",
// //           "time",
// //         ],
// //         "-"
// //       );

// //       const passengers = value(
// //         booking,
// //         [
// //           "passengers",
// //           "passengerCount",
// //           "numberOfPassengers",
// //         ],
// //         "1"
// //       );

// //       const amount = value(
// //         booking,
// //         [
// //           "amount",
// //           "totalAmount",
// //           "price",
// //           "totalPrice",
// //         ],
// //         "0"
// //       );

// //       const paymentMethod = value(
// //         booking,
// //         [
// //           "paymentMethod",
// //           "paymentMode",
// //         ],
// //         "-"
// //       );

// //       const paymentId = value(
// //         booking,
// //         [
// //           "paymentId",
// //           "utr",
// //           "transactionId",
// //         ],
// //         "-"
// //       );

// //       const bookingId = value(
// //         booking,
// //         [
// //           "_id",
// //           "bookingId",
// //         ],
// //         "-"
// //       );

// //       /* HEADER */

// //       doc
// //         .fontSize(24)
// //         .font("Helvetica-Bold")
// //         .text("SAIYED TRAVELS", {
// //           align: "center",
// //         });

// //       doc
// //         .moveDown(0.3)
// //         .fontSize(15)
// //         .font("Helvetica")
// //         .text("E-TICKET / BOOKING CONFIRMATION", {
// //           align: "center",
// //         });

// //       doc.moveDown(1);

// //       doc
// //         .fontSize(11)
// //         .font("Helvetica-Bold")
// //         .text(`PNR: ${pnr}`);

// //       doc
// //         .font("Helvetica")
// //         .text(`Status: ${status}`);

// //       doc.moveDown(1);

// //       /* PASSENGER */

// //       doc
// //         .fontSize(14)
// //         .font("Helvetica-Bold")
// //         .text("Passenger Details");

// //       doc.moveDown(0.4);

// //       doc
// //         .fontSize(10)
// //         .font("Helvetica")
// //         .text(`Name: ${passengerName}`)
// //         .text(`Email: ${email}`)
// //         .text(`Phone: ${phone}`)
// //         .text(`Passengers: ${passengers}`);

// //       doc.moveDown(1);

// //       /* FLIGHT */

// //       doc
// //         .fontSize(14)
// //         .font("Helvetica-Bold")
// //         .text("Flight Details");

// //       doc.moveDown(0.4);

// //       doc
// //         .fontSize(10)
// //         .font("Helvetica")
// //         .text(`From: ${from}`)
// //         .text(`To: ${to}`)
// //         .text(`Flight Number: ${flightNumber}`)
// //         .text(`Departure Date: ${departureDate}`)
// //         .text(`Departure Time: ${departureTime}`);

// //       doc.moveDown(1);

// //       /* PAYMENT */

// //       doc
// //         .fontSize(14)
// //         .font("Helvetica-Bold")
// //         .text("Payment Details");

// //       doc.moveDown(0.4);

// //       doc
// //         .fontSize(10)
// //         .font("Helvetica")
// //         .text(`Amount: ₹${amount}`)
// //         .text(`Payment Method: ${paymentMethod}`)
// //         .text(`Payment ID / UTR: ${paymentId}`);

// //       doc.moveDown(1);

// //       /* BOOKING */

// //       doc
// //         .fontSize(14)
// //         .font("Helvetica-Bold")
// //         .text("Booking Information");

// //       doc.moveDown(0.4);

// //       doc
// //         .fontSize(10)
// //         .font("Helvetica")
// //         .text(`Booking ID: ${bookingId}`)
// //         .text(
// //           "Payment verified by Saiyed Travels admin."
// //         );

// //       doc.moveDown(1);

// //       doc
// //         .fontSize(10)
// //         .font("Helvetica")
// //         .text(
// //           "Please carry a valid ID proof during travel."
// //         );

// //       doc.moveDown(0.5);

// //       doc.text(
// //         "Please keep this e-ticket safely."
// //       );

// //       doc.moveDown(2);

// //       doc
// //         .fontSize(9)
// //         .text(
// //           "Saiyed Travels | SAIYEDTRAVELS.COM",
// //           {
// //             align: "center",
// //           }
// //         );

// //       doc.end();
// //     } catch (error) {
// //       reject(error);
// //     }
// //   });
// // };


// // /* =========================================================
// //    SEND TICKET EMAIL
// // ========================================================= */

// // const sendTicketEmail = async ({
// //   to,
// //   booking,
// // }) => {
// //   if (!to) {
// //     throw new Error(
// //       "Ticket email recipient is missing."
// //     );
// //   }

// //   const transporter = createTransporter();

// //   const pdfBuffer =
// //     await generateTicketPdf(booking);

// //   const pnr = value(
// //     booking,
// //     ["pnr", "PNR"],
// //     "Ticket"
// //   );

// //   const passengerName = value(
// //     booking,
// //     [
// //       "name",
// //       "passengerName",
// //       "fullName",
// //     ],
// //     "Customer"
// //   );

// //   const amount = value(
// //     booking,
// //     [
// //       "amount",
// //       "totalAmount",
// //       "price",
// //       "totalPrice",
// //     ],
// //     "0"
// //   );

// //   await transporter.sendMail({
// //     from: `"Saiyed Travels" <${process.env.EMAIL_USER}>`,

// //     to,

// //     subject:
// //       `Booking Confirmed - PNR ${pnr} | Saiyed Travels`,

// //     html: `
// //       <div style="
// //         font-family: Arial, sans-serif;
// //         max-width: 650px;
// //         margin: auto;
// //         border: 1px solid #ddd;
// //         padding: 25px;
// //         border-radius: 12px;
// //       ">

// //         <h1 style="text-align:center;">
// //           SAIYED TRAVELS
// //         </h1>

// //         <h2 style="text-align:center;">
// //           Booking Confirmed ✅
// //         </h2>

// //         <p>
// //           Dear <strong>${passengerName}</strong>,
// //         </p>

// //         <p>
// //           Your booking has been successfully
// //           verified and confirmed by Saiyed Travels.
// //         </p>

// //         <div style="
// //           background:#f5f5f5;
// //           padding:15px;
// //           border-radius:8px;
// //         ">

// //           <p>
// //             <strong>PNR:</strong> ${pnr}
// //           </p>

// //           <p>
// //             <strong>Amount:</strong> ₹${amount}
// //           </p>

// //         </div>

// //         <p>
// //           Your confirmed ticket is attached
// //           as a PDF with this email.
// //         </p>

// //         <p>
// //           Thank you for choosing Saiyed Travels.
// //         </p>

// //       </div>
// //     `,

// //     attachments: [
// //       {
// //         filename:
// //           `Saiyed-Travels-Ticket-${pnr}.pdf`,

// //         content: pdfBuffer,

// //         contentType:
// //           "application/pdf",
// //       },
// //     ],
// //   });

// //   return true;
// // };


// // /* =========================================================
// //    ADMIN PAYMENT EMAIL
// // ========================================================= */

// // const sendAdminPaymentNotification = async ({
// //   paymentRequest,
// // }) => {
// //   const transporter = createTransporter();

// //   const booking =
// //     paymentRequest?.bookingData || {};

// //   const customerName = value(
// //     booking,
// //     [
// //       "name",
// //       "passengerName",
// //       "fullName",
// //     ],
// //     "Customer"
// //   );

// //   const customerPhone = value(
// //     booking,
// //     [
// //       "phone",
// //       "mobile",
// //       "contactNumber",
// //     ],
// //     "-"
// //   );

// //   const from = value(
// //     booking,
// //     [
// //       "from",
// //       "source",
// //       "origin",
// //     ],
// //     "-"
// //   );

// //   const to = value(
// //     booking,
// //     [
// //       "to",
// //       "destination",
// //     ],
// //     "-"
// //   );

// //   const passengers = value(
// //     booking,
// //     [
// //       "passengers",
// //       "passengerCount",
// //       "numberOfPassengers",
// //     ],
// //     "1"
// //   );

// //   const amount =
// //     paymentRequest.amount || 0;

// //   const bankName =
// //     paymentRequest.bankName || "-";

// //   const paymentId =
// //     paymentRequest.paymentId || "-";

// //   const paymentDateTime =
// //     paymentRequest.paymentDateTime
// //       ? new Date(
// //           paymentRequest.paymentDateTime
// //         ).toLocaleString("en-IN")
// //       : "-";

// //   const backendUrl =
// //     process.env.BACKEND_URL ||
// //     "https://saiyed-travels-backend-1.onrender.com";

// //   const requestId =
// //     paymentRequest._id.toString();

// //   /*
// //     Token generate
// //   */

// //   const token =
// //     crypto.randomBytes(32).toString("hex");

// //   /*
// //     IMPORTANT:
// //     Controller/model ko token save karna hoga.
// //     Ye function token return karega.
// //   */

// //   const acceptUrl =
// //     `${backendUrl}/api/payment-requests/${requestId}/email-action/accept?token=${token}`;

// //   const rejectUrl =
// //     `${backendUrl}/api/payment-requests/${requestId}/email-action/reject?token=${token}`;

// //   const screenshotUrl =
// //     paymentRequest.screenshot
// //       ? `${backendUrl}${paymentRequest.screenshot}`
// //       : null;

// //   await transporter.sendMail({
// //     from:
// //       `"Saiyed Travels Admin" <${process.env.EMAIL_USER}>`,

// //     to: process.env.EMAIL_USER,

// //     subject:
// //       `New Payment Request - ₹${amount} - ${customerName}`,

// //     html: `
// //       <div style="
// //         font-family: Arial, sans-serif;
// //         max-width: 700px;
// //         margin: auto;
// //         border: 1px solid #ddd;
// //         border-radius: 12px;
// //         overflow: hidden;
// //       ">

// //         <div style="
// //           background:#111827;
// //           color:white;
// //           padding:22px;
// //           text-align:center;
// //         ">

// //           <h1 style="margin:0;">
// //             SAIYED TRAVELS
// //           </h1>

// //           <p style="margin:8px 0 0;">
// //             New Payment Verification Request
// //           </p>

// //         </div>


// //         <div style="padding:25px;">

// //           <h2>
// //             Payment Details
// //           </h2>

// //           <table
// //             style="
// //               width:100%;
// //               border-collapse:collapse;
// //             "
// //           >

// //             <tr>
// //               <td style="padding:8px;">
// //                 <strong>Customer</strong>
// //               </td>

// //               <td style="padding:8px;">
// //                 ${customerName}
// //               </td>
// //             </tr>

// //             <tr>
// //               <td style="padding:8px;">
// //                 <strong>Email</strong>
// //               </td>

// //               <td style="padding:8px;">
// //                 ${paymentRequest.customerEmail}
// //               </td>
// //             </tr>

// //             <tr>
// //               <td style="padding:8px;">
// //                 <strong>Phone</strong>
// //               </td>

// //               <td style="padding:8px;">
// //                 ${customerPhone}
// //               </td>
// //             </tr>

// //             <tr>
// //               <td style="padding:8px;">
// //                 <strong>From</strong>
// //               </td>

// //               <td style="padding:8px;">
// //                 ${from}
// //               </td>
// //             </tr>

// //             <tr>
// //               <td style="padding:8px;">
// //                 <strong>To</strong>
// //               </td>

// //               <td style="padding:8px;">
// //                 ${to}
// //               </td>
// //             </tr>

// //             <tr>
// //               <td style="padding:8px;">
// //                 <strong>Passengers</strong>
// //               </td>

// //               <td style="padding:8px;">
// //                 ${passengers}
// //               </td>
// //             </tr>

// //             <tr>
// //               <td style="padding:8px;">
// //                 <strong>Amount</strong>
// //               </td>

// //               <td style="padding:8px;">
// //                 <strong>
// //                   ₹${amount}
// //                 </strong>
// //               </td>
// //             </tr>

// //             <tr>
// //               <td style="padding:8px;">
// //                 <strong>Bank</strong>
// //               </td>

// //               <td style="padding:8px;">
// //                 ${bankName}
// //               </td>
// //             </tr>

// //             <tr>
// //               <td style="padding:8px;">
// //                 <strong>UTR / Payment ID</strong>
// //               </td>

// //               <td style="padding:8px;">
// //                 ${paymentId}
// //               </td>
// //             </tr>

// //             <tr>
// //               <td style="padding:8px;">
// //                 <strong>Payment Date/Time</strong>
// //               </td>

// //               <td style="padding:8px;">
// //                 ${paymentDateTime}
// //               </td>
// //             </tr>

// //           </table>


// //           ${
// //             screenshotUrl
// //               ? `
// //                 <div style="
// //                   margin-top:20px;
// //                   text-align:center;
// //                 ">

// //                   <a
// //                     href="${screenshotUrl}"
// //                     style="
// //                       display:inline-block;
// //                       padding:12px 20px;
// //                       background:#2563eb;
// //                       color:white;
// //                       text-decoration:none;
// //                       border-radius:7px;
// //                       font-weight:bold;
// //                     "
// //                   >
// //                     📸 View Payment Screenshot
// //                   </a>

// //                 </div>
// //               `
// //               : ""
// //           }


// //           <div style="
// //             margin-top:30px;
// //             padding-top:20px;
// //             border-top:1px solid #ddd;
// //             text-align:center;
// //           ">

// //             <h3>
// //               Admin Action
// //             </h3>

// //             <a
// //               href="${acceptUrl}"
// //               style="
// //                 display:inline-block;
// //                 background:#16a34a;
// //                 color:white;
// //                 padding:14px 25px;
// //                 text-decoration:none;
// //                 border-radius:8px;
// //                 font-weight:bold;
// //                 margin:5px;
// //               "
// //             >
// //               ✅ ACCEPT PAYMENT
// //             </a>

// //             <a
// //               href="${rejectUrl}"
// //               style="
// //                 display:inline-block;
// //                 background:#dc2626;
// //                 color:white;
// //                 padding:14px 25px;
// //                 text-decoration:none;
// //                 border-radius:8px;
// //                 font-weight:bold;
// //                 margin:5px;
// //               "
// //             >
// //               ❌ REJECT PAYMENT
// //             </a>

// //           </div>


// //           <p style="
// //             margin-top:25px;
// //             font-size:12px;
// //             color:#666;
// //             text-align:center;
// //           ">
// //             Please verify the UTR and payment screenshot
// //             before accepting the payment.
// //           </p>

// //         </div>

// //       </div>
// //     `,
// //   });

// //   return {
// //     token,
// //   };
// // };


// // /* =========================================================
// //    EXPORT
// // ========================================================= */

// // module.exports = {
// //   sendTicketEmail,
// //   sendAdminPaymentNotification,
// //   generateTicketPdf,
// // };



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

//   return new Promise(
//     (resolve, reject) => {

//       try {

//         const doc = new PDFDocument({
//           size: "A4",
//           margin: 40,
//         });

//         const chunks = [];

//         doc.on(
//           "data",
//           (chunk) => {
//             chunks.push(chunk);
//           }
//         );

//         doc.on(
//           "end",
//           () => {
//             resolve(
//               Buffer.concat(chunks)
//             );
//           }
//         );

//         doc.on(
//           "error",
//           reject
//         );


//         /* ---------- DATA ---------- */

//         const pnr =
//           value(
//             booking,
//             ["pnr", "PNR"],
//             "N/A"
//           );

//         const status =
//           value(
//             booking,
//             [
//               "bookingStatus",
//               "status",
//             ],
//             "Confirmed"
//           );

//         const passengerName =
//           value(
//             booking,
//             [
//               "name",
//               "passengerName",
//               "fullName",
//             ],
//             "Passenger"
//           );

//         const email =
//           value(
//             booking,
//             [
//               "email",
//               "customerEmail",
//             ],
//             "-"
//           );

//         const phone =
//           value(
//             booking,
//             [
//               "phone",
//               "mobile",
//               "contactNumber",
//             ],
//             "-"
//           );

//         const from =
//           value(
//             booking,
//             [
//               "from",
//               "source",
//               "origin",
//             ],
//             "-"
//           );

//         const to =
//           value(
//             booking,
//             [
//               "to",
//               "destination",
//             ],
//             "-"
//           );

//         const flightNumber =
//           value(
//             booking,
//             [
//               "flightNumber",
//               "flightNo",
//               "flight",
//             ],
//             "-"
//           );

//         const departureDate =
//           value(
//             booking,
//             [
//               "departureDate",
//               "date",
//               "travelDate",
//             ],
//             "-"
//           );

//         const departureTime =
//           value(
//             booking,
//             [
//               "departureTime",
//               "time",
//             ],
//             "-"
//           );

//         const passengers =
//           value(
//             booking,
//             [
//               "passengers",
//               "passengerCount",
//               "numberOfPassengers",
//             ],
//             "1"
//           );

//         const amount =
//           value(
//             booking,
//             [
//               "amount",
//               "totalAmount",
//               "price",
//               "totalPrice",
//             ],
//             "0"
//           );

//         const paymentMethod =
//           value(
//             booking,
//             [
//               "paymentMethod",
//               "paymentMode",
//             ],
//             "-"
//           );

//         const paymentId =
//           value(
//             booking,
//             [
//               "paymentId",
//               "utr",
//               "transactionId",
//             ],
//             "-"
//           );

//         const bookingId =
//           value(
//             booking,
//             [
//               "_id",
//               "bookingId",
//             ],
//             "-"
//           );


//         /* =====================================================
//            HEADER
//         ===================================================== */

//         doc
//           .fontSize(24)
//           .font("Helvetica-Bold")
//           .text(
//             "SAIYED TRAVELS",
//             {
//               align: "center",
//             }
//           );

//         doc
//           .moveDown(0.3)
//           .fontSize(15)
//           .font("Helvetica")
//           .text(
//             "E-TICKET / BOOKING CONFIRMATION",
//             {
//               align: "center",
//             }
//           );

//         doc.moveDown(1);


//         /* =====================================================
//            PNR
//         ===================================================== */

//         doc
//           .fontSize(11)
//           .font("Helvetica-Bold")
//           .text(
//             `PNR: ${pnr}`
//           );

//         doc
//           .font("Helvetica")
//           .text(
//             `Status: ${status}`
//           );

//         doc.moveDown(1);


//         /* =====================================================
//            PASSENGER
//         ===================================================== */

//         doc
//           .fontSize(14)
//           .font("Helvetica-Bold")
//           .text(
//             "Passenger Details"
//           );

//         doc.moveDown(0.4);

//         doc
//           .fontSize(10)
//           .font("Helvetica")
//           .text(
//             `Name: ${passengerName}`
//           )
//           .text(
//             `Email: ${email}`
//           )
//           .text(
//             `Phone: ${phone}`
//           )
//           .text(
//             `Passengers: ${passengers}`
//           );

//         doc.moveDown(1);


//         /* =====================================================
//            FLIGHT
//         ===================================================== */

//         doc
//           .fontSize(14)
//           .font("Helvetica-Bold")
//           .text(
//             "Flight Details"
//           );

//         doc.moveDown(0.4);

//         doc
//           .fontSize(10)
//           .font("Helvetica")
//           .text(
//             `From: ${from}`
//           )
//           .text(
//             `To: ${to}`
//           )
//           .text(
//             `Flight Number: ${flightNumber}`
//           )
//           .text(
//             `Departure Date: ${departureDate}`
//           )
//           .text(
//             `Departure Time: ${departureTime}`
//           );

//         doc.moveDown(1);


//         /* =====================================================
//            PAYMENT
//         ===================================================== */

//         doc
//           .fontSize(14)
//           .font("Helvetica-Bold")
//           .text(
//             "Payment Details"
//           );

//         doc.moveDown(0.4);

//         doc
//           .fontSize(10)
//           .font("Helvetica")
//           .text(
//             `Amount: ₹${amount}`
//           )
//           .text(
//             `Payment Method: ${paymentMethod}`
//           )
//           .text(
//             `Payment ID / UTR: ${paymentId}`
//           );

//         doc.moveDown(1);


//         /* =====================================================
//            BOOKING
//         ===================================================== */

//         doc
//           .fontSize(14)
//           .font("Helvetica-Bold")
//           .text(
//             "Booking Information"
//           );

//         doc.moveDown(0.4);

//         doc
//           .fontSize(10)
//           .font("Helvetica")
//           .text(
//             `Booking ID: ${bookingId}`
//           )
//           .text(
//             "Payment verified by Saiyed Travels admin."
//           );

//         doc.moveDown(1);

//         doc.text(
//           "Please carry a valid ID proof during travel."
//         );

//         doc.moveDown(0.5);

//         doc.text(
//           "Please keep this e-ticket safely."
//         );

//         doc.moveDown(2);


//         /* =====================================================
//            FOOTER
//         ===================================================== */

//         doc
//           .fontSize(9)
//           .text(
//             "Saiyed Travels | SAIYEDTRAVELS.COM",
//             {
//               align: "center",
//             }
//           );

//         doc.end();

//       } catch (error) {

//         reject(error);

//       }
//     }
//   );
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

//   return true;
// };


// /* =========================================================
//    ADMIN PAYMENT NOTIFICATION
// ========================================================= */

// const sendAdminPaymentNotification =
//   async ({
//     paymentRequest,
//     adminActionToken,
//   }) => {

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
//        EMAIL ACTION URL
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
//        SEND EMAIL
//     ===================================================== */

//     await transporter.sendMail({

//       from:
//         `"Saiyed Travels Admin" <${process.env.EMAIL_USER}>`,

//       to:
//         process.env.EMAIL_USER,

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
//                   ${paymentRequest.customerEmail}
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
//       "Admin payment notification email sent with Accept/Reject buttons."
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








const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");

/* =========================================================
   GMAIL TRANSPORTER
========================================================= */

const createTransporter = () => {
  if (
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS
  ) {
    throw new Error(
      "EMAIL_USER or EMAIL_PASS is missing in .env"
    );
  }

  return nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
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

  const transporter =
    createTransporter();

  const pdfBuffer =
    await generateTicketPdf(
      booking
    );

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


  await transporter.sendMail({

    from:
      `"Saiyed Travels" <${process.env.EMAIL_USER}>`,

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
          pdfBuffer,

        contentType:
          "application/pdf",
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

    const transporter =
      createTransporter();

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

    await transporter.sendMail({

      from:
        `"Saiyed Travels Admin" <${process.env.EMAIL_USER}>`,

      // IMPORTANT:
      // Admin notification ab logged-in/admin account
      // ke email par jayegi.
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