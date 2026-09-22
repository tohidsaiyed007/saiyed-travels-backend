// const {
//   generateTicketPdf,
// } = require("./emailService");


// // =====================================================
// // NORMALIZE WHATSAPP NUMBER
// // =====================================================

// const normalizeWhatsAppNumber = (number) => {
//   let value = String(number || "").trim();

//   // spaces, -, brackets remove
//   value = value.replace(/[^\d+]/g, "");

//   // +91XXXXXXXXXX
//   if (value.startsWith("+91")) {
//     value = value.substring(1);
//   }

//   // 91XXXXXXXXXX
//   if (value.startsWith("91") && value.length === 12) {
//     return value;
//   }

//   // XXXXXXXXXX
//   if (value.length === 10) {
//     return `91${value}`;
//   }

//   throw new Error(
//     "Invalid WhatsApp number. Please use a valid Indian mobile number."
//   );
// };


// // =====================================================
// // SEND TICKET PDF ON WHATSAPP
// // =====================================================

// const sendTicketWhatsApp = async ({
//   to,
//   booking,
// }) => {

//   if (!to) {
//     throw new Error(
//       "Customer WhatsApp number is missing."
//     );
//   }

//   if (!process.env.WHATSAPP_ACCESS_TOKEN) {
//     throw new Error(
//       "WHATSAPP_ACCESS_TOKEN is missing."
//     );
//   }

//   if (!process.env.WHATSAPP_PHONE_NUMBER_ID) {
//     throw new Error(
//       "WHATSAPP_PHONE_NUMBER_ID is missing."
//     );
//   }


//   const apiVersion =
//     process.env.WHATSAPP_API_VERSION || "v25.0";

//   const phoneNumberId =
//     process.env.WHATSAPP_PHONE_NUMBER_ID;

//   const accessToken =
//     process.env.WHATSAPP_ACCESS_TOKEN;


//   const whatsappNumber =
//     normalizeWhatsAppNumber(to);


//   // ===================================================
//   // GENERATE SAME TICKET PDF
//   // ===================================================

//   const pdfBuffer =
//     await generateTicketPdf(booking);


//   // ===================================================
//   // UPLOAD PDF TO WHATSAPP
//   // ===================================================

//   const uploadUrl =
//     `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/media`;


//   const uploadForm =
//     new FormData();


//   uploadForm.append(
//     "messaging_product",
//     "whatsapp"
//   );


//   uploadForm.append(
//     "file",
//     new Blob(
//       [pdfBuffer],
//       {
//         type: "application/pdf",
//       }
//     ),
//     "Saiyed-Travels-Ticket.pdf"
//   );


//   const uploadResponse =
//     await fetch(
//       uploadUrl,
//       {
//         method: "POST",

//         headers: {
//           Authorization:
//             `Bearer ${accessToken}`,
//         },

//         body: uploadForm,
//       }
//     );


//   const uploadData =
//     await uploadResponse.json();


//   if (!uploadResponse.ok) {

//     console.error(
//       "WHATSAPP PDF UPLOAD ERROR:",
//       uploadData
//     );

//     throw new Error(
//       uploadData?.error?.message ||
//       "WhatsApp PDF upload failed."
//     );
//   }


//   const mediaId =
//     uploadData.id;


//   if (!mediaId) {
//     throw new Error(
//       "WhatsApp media ID was not returned."
//     );
//   }


//   // ===================================================
//   // SEND PDF TO CUSTOMER
//   // ===================================================

//   const messageUrl =
//     `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;


//   const messageResponse =
//     await fetch(
//       messageUrl,
//       {
//         method: "POST",

//         headers: {
//           Authorization:
//             `Bearer ${accessToken}`,

//           "Content-Type":
//             "application/json",
//         },

//         body: JSON.stringify({

//           messaging_product:
//             "whatsapp",

//           to:
//             whatsappNumber,

//           type:
//             "document",

//           document: {

//             id:
//               mediaId,

//             filename:
//               "Saiyed-Travels-Ticket.pdf",

//             caption:
//               "Your Saiyed Travels booking is confirmed. Please find your ticket attached.",
//           },

//         }),
//       }
//     );


//   const messageData =
//     await messageResponse.json();


//   if (!messageResponse.ok) {

//     console.error(
//       "WHATSAPP TICKET SEND ERROR:",
//       messageData
//     );

//     throw new Error(
//       messageData?.error?.message ||
//       "WhatsApp ticket sending failed."
//     );
//   }


//   console.log(
//     "===================================="
//   );

//   console.log(
//     "WHATSAPP TICKET SENT SUCCESSFULLY"
//   );

//   console.log(
//     "CUSTOMER NUMBER:",
//     whatsappNumber
//   );

//   console.log(
//     "WHATSAPP MESSAGE ID:",
//     messageData?.messages?.[0]?.id || "-"
//   );

//   console.log(
//     "===================================="
//   );


//   return {
//     success: true,

//     whatsappNumber,

//     messageId:
//       messageData?.messages?.[0]?.id || null,
//   };
// };


// // =====================================================
// // EXPORT
// // =====================================================

// module.exports = {
//   sendTicketWhatsApp,
// };









const {
  generateTicketPdf,
} = require("./emailService");

// =====================================================
// NORMALIZE WHATSAPP NUMBER
// =====================================================

const normalizeWhatsAppNumber = (number) => {
  let value = String(number || "").trim();

  value = value.replace(/[^\d+]/g, "");

  // +91XXXXXXXXXX
  if (value.startsWith("+91")) {
    value = value.substring(1);
  }

  // 91XXXXXXXXXX
  if (value.startsWith("91") && value.length === 12) {
    return value;
  }

  // XXXXXXXXXX
  if (value.length === 10) {
    return `91${value}`;
  }

  throw new Error(
    "Invalid WhatsApp number. Please use a valid Indian mobile number."
  );
};


// =====================================================
// SEND TICKET PDF ON WHATSAPP
// =====================================================

const sendTicketWhatsApp = async ({
  to,
  booking,
}) => {

  // ---------------------------------------------------
  // CHECK NUMBER
  // ---------------------------------------------------

  if (!to) {
    throw new Error(
      "Customer WhatsApp number is missing."
    );
  }

  // ---------------------------------------------------
  // CHECK TOKEN
  // ---------------------------------------------------

  const accessToken =
    process.env.WHATSAPP_ACCESS_TOKEN?.trim();

  if (!accessToken) {
    throw new Error(
      "WHATSAPP_ACCESS_TOKEN is missing in Render Environment."
    );
  }

  // ---------------------------------------------------
  // CHECK PHONE NUMBER ID
  // ---------------------------------------------------

  const phoneNumberId =
    process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();

  if (!phoneNumberId) {
    throw new Error(
      "WHATSAPP_PHONE_NUMBER_ID is missing in Render Environment."
    );
  }

  // ---------------------------------------------------
  // API VERSION
  // ---------------------------------------------------

  const apiVersion =
    process.env.WHATSAPP_API_VERSION || "v25.0";

  // ---------------------------------------------------
  // NORMALIZE NUMBER
  // ---------------------------------------------------

  const whatsappNumber =
    normalizeWhatsAppNumber(to);

  console.log(
    "WHATSAPP TICKET START"
  );

  console.log(
    "Customer WhatsApp:",
    whatsappNumber
  );

  // ---------------------------------------------------
  // GENERATE TICKET PDF
  // ---------------------------------------------------

  const pdfBuffer =
    await generateTicketPdf(booking);

  if (!pdfBuffer) {
    throw new Error(
      "Ticket PDF could not be generated."
    );
  }

  // ===================================================
  // UPLOAD PDF TO WHATSAPP
  // ===================================================

  const uploadUrl =
    `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/media`;

  const uploadForm = new FormData();

  uploadForm.append(
    "messaging_product",
    "whatsapp"
  );

  uploadForm.append(
    "file",
    new Blob(
      [pdfBuffer],
      {
        type: "application/pdf",
      }
    ),
    "Saiyed-Travels-Ticket.pdf"
  );

  const uploadResponse =
    await fetch(
      uploadUrl,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,
        },

        body: uploadForm,
      }
    );

  const uploadData =
    await uploadResponse.json();

  // ---------------------------------------------------
  // HANDLE UPLOAD ERROR
  // ---------------------------------------------------

  if (!uploadResponse.ok) {

    console.error(
      "WHATSAPP PDF UPLOAD ERROR:"
    );

    console.error(
      JSON.stringify(
        uploadData,
        null,
        2
      )
    );

    if (
      uploadData?.error?.code === 190
    ) {
      throw new Error(
        "WhatsApp access token is invalid or expired. Please update WHATSAPP_ACCESS_TOKEN in Render."
      );
    }

    throw new Error(
      uploadData?.error?.message ||
      "WhatsApp PDF upload failed."
    );
  }

  const mediaId =
    uploadData?.id;

  if (!mediaId) {
    throw new Error(
      "WhatsApp media ID was not returned."
    );
  }

  console.log(
    "WHATSAPP PDF UPLOADED:",
    mediaId
  );

  // ===================================================
  // SEND PDF TO CUSTOMER
  // ===================================================

  const messageUrl =
    `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

  const messageResponse =
    await fetch(
      messageUrl,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({

          messaging_product:
            "whatsapp",

          to:
            whatsappNumber,

          type:
            "document",

          document: {

            id:
              mediaId,

            filename:
              "Saiyed-Travels-Ticket.pdf",

            caption:
              "Your Saiyed Travels booking is confirmed. Please find your ticket attached.",

          },

        }),
      }
    );

  const messageData =
    await messageResponse.json();

  // ---------------------------------------------------
  // HANDLE MESSAGE ERROR
  // ---------------------------------------------------

  if (!messageResponse.ok) {

    console.error(
      "WHATSAPP TICKET SEND ERROR:"
    );

    console.error(
      JSON.stringify(
        messageData,
        null,
        2
      )
    );

    if (
      messageData?.error?.code === 190
    ) {
      throw new Error(
        "WhatsApp access token is invalid or expired. Please update WHATSAPP_ACCESS_TOKEN in Render."
      );
    }

    throw new Error(
      messageData?.error?.message ||
      "WhatsApp ticket sending failed."
    );
  }

  // ===================================================
  // SUCCESS
  // ===================================================

  const messageId =
    messageData?.messages?.[0]?.id || null;

  console.log(
    "===================================="
  );

  console.log(
    "WHATSAPP TICKET SENT SUCCESSFULLY"
  );

  console.log(
    "CUSTOMER NUMBER:",
    whatsappNumber
  );

  console.log(
    "WHATSAPP MESSAGE ID:",
    messageId
  );

  console.log(
    "===================================="
  );

  return {
    success: true,
    whatsappNumber,
    messageId,
  };
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  sendTicketWhatsApp,
};