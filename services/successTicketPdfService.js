const puppeteer = require("puppeteer");

const generateSuccessTicketPdf = async (booking) => {
  let browser;

  try {
    if (!booking || !booking.flight) {
      throw new Error(
        "Ticket data is incomplete. Booking flight details are missing."
      );
    }

    const frontendUrl = (
      process.env.FRONTEND_URL ||
      "https://saiyed-travel.vercel.app"
    ).replace(/\/+$/, "");

    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 1440,
      height: 1100,
      deviceScaleFactor: 1,
    });

    // Pass this booking to React Router before React loads.
    await page.evaluateOnNewDocument((ticketBooking) => {
      window.history.replaceState(
        {
          usr: {
            booking: ticketBooking,
            autoDownload: false,
          },
          key: "email-ticket",
          idx: 0,
        },
        "",
        window.location.href
      );
    }, booking);

    await page.goto(`${frontendUrl}/success`, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // Wait for the actual ticket component.
    await page.waitForSelector("#ticket-print-area", {
      visible: true,
      timeout: 30000,
    });

    // Show ticket price in the PDF.
    const priceButton = await page.$("button.price-btn");

    if (priceButton) {
      const isVisible = await priceButton.isVisible();

      if (isVisible) {
        await priceButton.click();
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    // Wait for images and fonts.
    await page.evaluate(async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const images = Array.from(document.images);

      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();

          return new Promise((resolve) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });

            setTimeout(resolve, 8000);
          });
        })
      );
    });

    // Keep only the ticket visible when printing.
    await page.addStyleTag({
      content: `
        @page {
          size: A4;
          margin: 8mm;
        }

        html,
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        body * {
          visibility: hidden !important;
        }

        #ticket-print-area,
        #ticket-print-area * {
          visibility: visible !important;
        }

        #ticket-print-area {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          box-sizing: border-box !important;
          box-shadow: none !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        #ticket-print-area img {
          max-width: 100%;
        }

        button,
        nav,
        footer {
          display: none !important;
        }
      `,
    });

    await page.emulateMediaType("print");

    const ticketElement = await page.$("#ticket-print-area");

    if (!ticketElement) {
      throw new Error("Ticket element was not found.");
    }

    const ticketText = await ticketElement.evaluate((element) =>
      element.innerText.trim()
    );

    if (!ticketText) {
      throw new Error("Ticket is empty. PDF generation stopped.");
    }

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "8mm",
        right: "8mm",
        bottom: "8mm",
        left: "8mm",
      },
    });

    if (!Buffer.isBuffer(pdfBuffer) || pdfBuffer.length === 0) {
      throw new Error("Generated ticket PDF is empty.");
    }

    console.log("SUCCESS PAGE TICKET PDF GENERATED");

    return pdfBuffer;
  } catch (error) {
    console.error(
      "SUCCESS PAGE TICKET PDF ERROR:",
      error.message
    );

    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = {
  generateSuccessTicketPdf,
};