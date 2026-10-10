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
  pdfBuffer,
}) => {
  if (!to) {
    throw new Error(
      "Customer WhatsApp number is missing."
    );
  }

  if (!booking) {
    throw new Error(
      "Customer booking data is missing."
    );
  }

  if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
    throw new Error(
      "Customer ticket PDF is missing."
    );
  }

  const accessToken =
    process.env.WHATSAPP_ACCESS_TOKEN?.trim();

  const phoneNumberId =
    process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();

  if (!accessToken || !phoneNumberId) {
    throw new Error(
      "WhatsApp environment variables are missing."
    );
  }

  const apiVersion =
    process.env.WHATSAPP_API_VERSION || "v25.0";

  const whatsappNumber = normalizeWhatsAppNumber(to);

  const uploadUrl =
    `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/media`;

  const uploadForm = new FormData();

  uploadForm.append(
    "messaging_product",
    "whatsapp"
  );

  uploadForm.append(
    "file",
    new Blob([pdfBuffer], {
      type: "application/pdf",
    }),
    "Saiyed-Travels-Ticket.pdf"
  );

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: uploadForm,
  });

  const uploadData = await uploadResponse.json();

  if (!uploadResponse.ok || !uploadData.id) {
    throw new Error(
      uploadData?.error?.message ||
      "WhatsApp PDF upload failed."
    );
  }

  const messageUrl =
    `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

  const messageResponse = await fetch(messageUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: whatsappNumber,
      type: "document",
      document: {
        id: uploadData.id,
        filename: "Saiyed-Travels-Ticket.pdf",
        caption:
          "Your Saiyed Travels booking is confirmed. Please find your ticket attached.",
      },
    }),
  });

  const messageData = await messageResponse.json();

  if (!messageResponse.ok) {
    throw new Error(
      messageData?.error?.message ||
      "WhatsApp ticket sending failed."
    );
  }

  return {
    success: true,
    whatsappNumber,
    messageId: messageData?.messages?.[0]?.id || null,
  };
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  sendTicketWhatsApp,
};