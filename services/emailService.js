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



















/* =========================================================
   GENERATE TICKET PDF
   SAME TICKET STYLE AS SUCCESS PAGE
========================================================= */

const generateTicketPdf = (booking) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 28,
      });

      const chunks = [];

      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });

      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", reject);

      // =====================================================
      // SAFE VALUE
      // =====================================================

      const safe = (value, fallback = "N/A") => {
        if (
          value === undefined ||
          value === null ||
          value === ""
        ) {
          return fallback;
        }

        if (
          typeof value === "object"
        ) {
          return fallback;
        }

        return String(value);
      };

      const numberValue = (value) => {
        const number = Number(value);

        return Number.isFinite(number)
          ? number
          : 0;
      };

      // =====================================================
      // BOOKING
      // =====================================================

      const flight =
        booking?.flight &&
        typeof booking.flight === "object"
          ? booking.flight
          : {};

      // =====================================================
      // BOOKING ID
      // =====================================================

      const bookingId = safe(
        booking?.bookingId ||
          booking?._id,
        "ST-PENDING"
      );

      // =====================================================
      // PNR
      // =====================================================

      const pnr = safe(
        booking?.pnr ||
          booking?.PNR,
        "N/A"
      );

      // =====================================================
      // AIRLINE
      // =====================================================

      const airline = safe(
        flight?.airline ||
          booking?.airline,
        "Airline"
      );

      const flightNo = safe(
        flight?.flightNo ||
          flight?.flightNumber ||
          booking?.flightNo,
        "N/A"
      );

      // =====================================================
      // ROUTE
      // =====================================================

      const fromCode = safe(
        flight?.fromCode ||
          booking?.fromCode ||
          flight?.from,
        "N/A"
      );

      const toCode = safe(
        flight?.toCode ||
          booking?.toCode ||
          flight?.to,
        "N/A"
      );

      const fromCity = safe(
        flight?.fromCity ||
          booking?.fromCity ||
          flight?.from,
        "N/A"
      );

      const toCity = safe(
        flight?.toCity ||
          booking?.toCity ||
          flight?.to,
        "N/A"
      );

      const fromAirport = safe(
        flight?.fromAirport ||
          booking?.fromAirport,
        ""
      );

      const toAirport = safe(
        flight?.toAirport ||
          booking?.toAirport,
        ""
      );

      // =====================================================
      // DATE / TIME
      // =====================================================

      const departureDate = safe(
        flight?.departureDate ||
          booking?.departureDate ||
          flight?.date ||
          booking?.date,
        "N/A"
      );

      const arrivalDate = safe(
        flight?.arrivalDate ||
          booking?.arrivalDate ||
          departureDate,
        departureDate
      );

      const departureTime = safe(
        flight?.departureTime ||
          booking?.departureTime ||
          flight?.departure,
        "N/A"
      );

      const arrivalTime = safe(
        flight?.arrivalTime ||
          booking?.arrivalTime ||
          flight?.arrival,
        "N/A"
      );

      const duration = safe(
        flight?.duration ||
          booking?.duration,
        "N/A"
      );

      const stops = safe(
        flight?.stops ||
          booking?.stops,
        "Non-stop"
      );

      const aircraft = safe(
        flight?.aircraft ||
          booking?.aircraft,
        "N/A"
      );

      const departureTerminal = safe(
        flight?.departureTerminal ||
          booking?.departureTerminal,
        "N/A"
      );

      const arrivalTerminal = safe(
        flight?.arrivalTerminal ||
          booking?.arrivalTerminal,
        "N/A"
      );

      const cabin = safe(
        flight?.cabin ||
          flight?.cabinClass ||
          flight?.selectedCabin ||
          booking?.cabin,
        "Economy"
      );

      // =====================================================
      // PASSENGERS
      // =====================================================

      let passengers = [];

      if (
        Array.isArray(
          booking?.passengers
        ) &&
        booking.passengers.length
      ) {
        passengers =
          booking.passengers;
      } else if (
        Array.isArray(
          booking?.travellersList
        ) &&
        booking.travellersList.length
      ) {
        passengers =
          booking.travellersList;
      } else if (
        Array.isArray(
          booking?.travellers
        ) &&
        booking.travellers.length
      ) {
        passengers =
          booking.travellers;
      } else if (
        booking?.passenger
      ) {
        passengers = [
          booking.passenger,
        ];
      }

      if (!passengers.length) {
        passengers = [
          {
            name:
              booking?.name ||
              booking?.passengerName ||
              "Passenger",

            type: "Adult",
          },
        ];
      }

      // =====================================================
      // SEATS
      // =====================================================

      let seats = [];

      if (
        Array.isArray(
          booking?.seats
        )
      ) {
        seats =
          booking.seats;
      } else if (
        booking?.seat
      ) {
        seats = [
          booking.seat,
        ];
      }

      // =====================================================
      // MEALS
      // =====================================================

      let meals = [];

      if (
        Array.isArray(
          booking?.meals
        )
      ) {
        meals =
          booking.meals;
      } else if (
        booking?.meal
      ) {
        meals = [
          booking.meal,
        ];
      }

      // =====================================================
      // BAGGAGE
      // =====================================================

      const getBaggageValue = (
        value
      ) => {
        if (
          value === undefined ||
          value === null ||
          value === ""
        ) {
          return "";
        }

        if (
          typeof value ===
            "string" ||
          typeof value ===
            "number"
        ) {
          return String(value);
        }

        if (
          typeof value ===
          "object"
        ) {
          return (
            value?.cabinBaggage ||
            value?.cabin ||
            value?.baggageCabin ||
            value?.checkinBaggage ||
            value?.checkin ||
            value?.weight ||
            ""
          );
        }

        return "";
      };

      const cabinBaggage =
        getBaggageValue(
          booking?.baggage
            ?.cabinBaggage
        ) ||
        getBaggageValue(
          booking?.baggage
            ?.cabin
        ) ||
        getBaggageValue(
          booking?.baggages?.[0]
            ?.cabinBaggage
        ) ||
        getBaggageValue(
          booking?.flight
            ?.baggage
            ?.cabinBaggage
        ) ||
        getBaggageValue(
          booking?.flight
            ?.cabinBaggage
        ) ||
        "7 KG";

      const checkinBaggage =
        getBaggageValue(
          booking?.baggage
            ?.checkinBaggage
        ) ||
        getBaggageValue(
          booking?.baggage
            ?.checkin
        ) ||
        getBaggageValue(
          booking?.baggage
            ?.weight
        ) ||
        getBaggageValue(
          booking?.baggages?.[0]
            ?.checkinBaggage
        ) ||
        getBaggageValue(
          booking?.flight
            ?.baggage
            ?.checkinBaggage
        ) ||
        getBaggageValue(
          booking?.flight
            ?.checkinBaggage
        ) ||
        "15 KG";

      // =====================================================
      // PRICE
      // =====================================================

      const flightFare =
        numberValue(
          booking?.flightFare
        ) ||
        numberValue(
          booking?.priceDetails
            ?.flightFare
        ) ||
        numberValue(
          flight?.finalPrice
        ) ||
        numberValue(
          flight?.price
        );

      const seatFare =
        numberValue(
          booking?.seatFare
        ) ||
        numberValue(
          booking?.seatPrice
        ) ||
        numberValue(
          booking?.priceDetails
            ?.seatCharges
        );

      const mealFare =
        numberValue(
          booking?.mealFare
        ) ||
        numberValue(
          booking?.mealPrice
        ) ||
        numberValue(
          booking?.priceDetails
            ?.mealCharges
        );

      const baggageFare =
        numberValue(
          booking?.baggageFare
        ) ||
        numberValue(
          booking?.baggagePrice
        ) ||
        numberValue(
          booking?.priceDetails
            ?.baggageCharges
        );

      const taxes =
        numberValue(
          booking?.taxes
        ) ||
        numberValue(
          booking?.tax
        );

      const convenienceFee =
        numberValue(
          booking?.convenienceFee
        );

      const discount =
        numberValue(
          booking?.discount
        );

      const calculatedTotal =
        flightFare +
        seatFare +
        mealFare +
        baggageFare +
        taxes +
        convenienceFee -
        discount;

      const finalTotal =
        numberValue(
          booking?.total
        ) ||
        numberValue(
          booking?.totalAmount
        ) ||
        numberValue(
          booking?.finalPrice
        ) ||
        numberValue(
          booking?.priceDetails
            ?.total
        ) ||
        calculatedTotal;

      // =====================================================
      // PAYMENT
      // =====================================================

      const paymentMethod =
        safe(
          booking?.paymentMethod,
          "UPI"
        );

      const paymentStatus =
        safe(
          booking?.paymentStatus,
          "Paid"
        );

      const bookingStatus =
        safe(
          booking?.bookingStatus ||
            booking?.status,
          "Confirmed"
        );

      // =====================================================
      // DATE
      // =====================================================

      const bookingDate =
        booking?.createdAt
          ? new Date(
              booking.createdAt
            ).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )
          : new Date().toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            );

      // =====================================================
      // COLORS
      // =====================================================

      const BLUE = "#0B5ED7";
      const DARK = "#111827";
      const ORANGE = "#F97316";
      const LIGHT = "#F3F6FA";
      const BORDER = "#D9E1EA";
      const GREEN = "#15803D";
      const GRAY = "#64748B";

      // =====================================================
      // PAGE BORDER
      // =====================================================

      doc
        .roundedRect(
          18,
          18,
          559,
          806,
          8
        )
        .lineWidth(1)
        .strokeColor(BORDER)
        .stroke();

      // =====================================================
      // HEADER
      // =====================================================

      doc
        .roundedRect(
          18,
          18,
          559,
          82,
          8
        )
        .fillColor(DARK)
        .fill();

      doc
        .fillColor("#FFFFFF")
        .fontSize(21)
        .font("Helvetica-Bold")
        .text(
          "SAIYED TRAVELS",
          38,
          35
        );

      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#D1D5DB")
        .text(
          "Flight Booking & Travel Services",
          39,
          61
        );

      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor("#FFFFFF")
        .text(
          airline,
          405,
          37,
          {
            width: 145,
            align: "right",
          }
        );

      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#D1D5DB")
        .text(
          flightNo,
          405,
          57,
          {
            width: 145,
            align: "right",
          }
        );

      // =====================================================
      // BOOKING DETAILS TITLE
      // =====================================================

      let y = 118;

      doc
        .roundedRect(
          30,
          y,
          535,
          27,
          4
        )
        .fillColor(BLUE)
        .fill();

      doc
        .fillColor("#FFFFFF")
        .fontSize(11)
        .font("Helvetica-Bold")
        .text(
          "Booking Details — Confirmed",
          42,
          y + 8
        );

      y += 37;

      // =====================================================
      // BOOKING GRID
      // =====================================================

      const colWidth =
        535 / 4;

      const headings = [
        "Booking ID",
        "GDS PNR",
        "Airline PNR",
        "Booking Date",
      ];

      const values = [
        bookingId,
        pnr,
        pnr,
        bookingDate,
      ];

      for (
        let i = 0;
        i < 4;
        i++
      ) {
        const x =
          30 +
          i * colWidth;

        doc
          .rect(
            x,
            y,
            colWidth,
            25
          )
          .fillColor(LIGHT)
          .fill();

        doc
          .rect(
            x,
            y,
            colWidth,
            25
          )
          .strokeColor(BORDER)
          .stroke();

        doc
          .fontSize(7.5)
          .font(
            "Helvetica-Bold"
          )
          .fillColor(GRAY)
          .text(
            headings[i],
            x + 7,
            y + 7
          );

        doc
          .rect(
            x,
            y + 25,
            colWidth,
            30
          )
          .strokeColor(BORDER)
          .stroke();

        doc
          .fontSize(8.5)
          .font(
            "Helvetica-Bold"
          )
          .fillColor(DARK)
          .text(
            values[i],
            x + 7,
            y + 36,
            {
              width:
                colWidth - 14,
              ellipsis: true,
            }
          );
      }

      y += 70;

      // =====================================================
      // FLIGHT DETAILS TITLE
      // =====================================================

      doc
        .roundedRect(
          30,
          y,
          535,
          27,
          4
        )
        .fillColor(ORANGE)
        .fill();

      doc
        .fillColor("#FFFFFF")
        .fontSize(11)
        .font("Helvetica-Bold")
        .text(
          "Flight Details",
          42,
          y + 8
        );

      y += 35;

      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor(GRAY)
        .text(
          "Subject to prior sale, price and schedule changes. Please check your flight details before travelling.",
          32,
          y,
          {
            width: 530,
          }
        );

      y += 22;

      // =====================================================
      // ROUTE
      // =====================================================

      doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .fillColor(DARK)
        .text(
          `${fromCode}  →  ${toCode}`,
          32,
          y
        );

      y += 32;

      // =====================================================
      // FLIGHT GRID
      // =====================================================

      const flightColumns = [
        {
          title: "Carrier / Date",
          value:
            `${airline}\n${departureDate}`,
          width: 92,
        },
        {
          title: "Flight No",
          value:
            `${flightNo}\n${aircraft}`,
          width: 65,
        },
        {
          title: "Departure",
          value:
            `${fromCity}\n${fromCode}\n${fromAirport}\nTerminal ${departureTerminal}`,
          width: 82,
        },
        {
          title: "Arrival",
          value:
            `${toCity}\n${toCode}\n${toAirport}\nTerminal ${arrivalTerminal}`,
          width: 82,
        },
        {
          title: "Departure",
          value:
            `${departureTime}\n${departureDate}`,
          width: 67,
        },
        {
          title: "Arrival",
          value:
            `${arrivalTime}\n${arrivalDate}`,
          width: 67,
        },
        {
          title: "Duration",
          value:
            `${duration}\n${stops}`,
          width: 52,
        },
        {
          title: "Class",
          value:
            `${cabin}\n${
              flight?.refundable
                ? "Refundable"
                : "Non Refundable"
            }`,
          width: 28,
        },
      ];

      let flightX = 30;

      const headerHeight = 24;
      const bodyHeight = 70;

      for (
        let i = 0;
        i <
        flightColumns.length;
        i++
      ) {
        const column =
          flightColumns[i];

        doc
          .rect(
            flightX,
            y,
            column.width,
            headerHeight
          )
          .fillColor(LIGHT)
          .fill();

        doc
          .rect(
            flightX,
            y,
            column.width,
            headerHeight
          )
          .strokeColor(BORDER)
          .stroke();

        doc
          .fontSize(6)
          .font(
            "Helvetica-Bold"
          )
          .fillColor(GRAY)
          .text(
            column.title,
            flightX + 3,
            y + 8,
            {
              width:
                column.width - 6,
              align: "center",
            }
          );

        doc
          .rect(
            flightX,
            y + headerHeight,
            column.width,
            bodyHeight
          )
          .strokeColor(BORDER)
          .stroke();

        doc
          .fontSize(6.5)
          .font(
            "Helvetica-Bold"
          )
          .fillColor(DARK)
          .text(
            column.value,
            flightX + 3,
            y + headerHeight + 8,
            {
              width:
                column.width - 6,
              height:
                bodyHeight - 10,
              align: "center",
            }
          );

        flightX +=
          column.width;
      }

      y +=
        headerHeight +
        bodyHeight +
        10;

      // =====================================================
      // IMPORTANT NOTE
      // =====================================================

      doc
        .roundedRect(
          30,
          y,
          535,
          32,
          4
        )
        .fillColor("#FFF7ED")
        .fill();

      doc
        .fillColor(ORANGE)
        .fontSize(7.5)
        .font("Helvetica-Bold")
        .text(
          "● IMPORTANT:",
          40,
          y + 9
        );

      doc
        .fillColor(DARK)
        .fontSize(7.5)
        .font("Helvetica")
        .text(
          "Check-in counters close 60 minutes prior to departure. All times are local time.",
          105,
          y + 9,
          {
            width: 445,
          }
        );

      y += 45;

      // =====================================================
      // PASSENGER DETAILS
      // =====================================================

      doc
        .roundedRect(
          30,
          y,
          535,
          27,
          4
        )
        .fillColor(ORANGE)
        .fill();

      doc
        .fillColor("#FFFFFF")
        .fontSize(11)
        .font("Helvetica-Bold")
        .text(
          "Passenger Details",
          42,
          y + 8
        );

      y += 34;

      const adultCount =
        numberValue(
          booking?.adults
        ) ||
        numberValue(
          booking?.travellers
            ?.adults
        ) ||
        passengers.filter(
          (item) =>
            String(
              item?.type ||
                "Adult"
            ).toLowerCase() ===
            "adult"
        ).length;

      const childCount =
        numberValue(
          booking?.children
        ) ||
        numberValue(
          booking?.travellers
            ?.children
        ) ||
        passengers.filter(
          (item) =>
            String(
              item?.type || ""
            ).toLowerCase() ===
            "child"
        ).length;

      const infantCount =
        numberValue(
          booking?.infants
        ) ||
        numberValue(
          booking?.travellers
            ?.infants
        ) ||
        passengers.filter(
          (item) =>
            String(
              item?.type || ""
            ).toLowerCase() ===
            "infant"
        ).length;

      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor(DARK)
        .text(
          `Total: ${passengers.length}    Adults: ${adultCount}    Children: ${childCount}    Infants: ${infantCount}`,
          32,
          y
        );

      y += 22;

      // =====================================================
      // PASSENGER TABLE HEADER
      // =====================================================

      const passengerCols = [
        {
          title: "Passenger Name",
          width: 145,
        },
        {
          title: "Type",
          width: 52,
        },
        {
          title: "Sector",
          width: 65,
        },
        {
          title: "PNR",
          width: 65,
        },
        {
          title: "Seat",
          width: 50,
        },
        {
          title: "Meal",
          width: 75,
        },
        {
          title: "Baggage",
          width: 83,
        },
      ];

      let px = 30;

      for (
        const col of passengerCols
      ) {
        doc
          .rect(
            px,
            y,
            col.width,
            24
          )
          .fillColor(LIGHT)
          .fill();

        doc
          .rect(
            px,
            y,
            col.width,
            24
          )
          .strokeColor(BORDER)
          .stroke();

        doc
          .fontSize(6.5)
          .font(
            "Helvetica-Bold"
          )
          .fillColor(GRAY)
          .text(
            col.title,
            px + 3,
            y + 8,
            {
              width:
                col.width - 6,
              align: "center",
            }
          );

        px += col.width;
      }

      y += 24;

      // =====================================================
      // PASSENGER ROWS
      // =====================================================

      passengers.forEach(
        (item, index) => {
          const name =
            safe(
              item?.name,
              `${safe(
                item?.firstName,
                ""
              )} ${safe(
                item?.lastName,
                ""
              )}`.trim() ||
                "Passenger"
            );

          const type =
            safe(
              item?.type,
              "Adult"
            );

          let seat =
            item?.seat ||
            item?.seatNumber;

          if (
            seat &&
            typeof seat ===
              "object"
          ) {
            seat =
              seat?.seatNumber ||
              seat?.seat ||
              "N/A";
          }

          if (!seat) {
            const selectedSeat =
              seats[index];

            if (
              selectedSeat &&
              typeof selectedSeat ===
                "object"
            ) {
              seat =
                selectedSeat?.seatNumber ||
                selectedSeat?.seat ||
                "N/A";
            } else {
              seat =
                selectedSeat ||
                "N/A";
            }
          }

          if (
            String(type)
              .toLowerCase() ===
            "infant"
          ) {
            seat = "No Seat";
          }

          const meal =
            safe(
              item?.meal?.name ||
                item?.meal ||
                item?.mealName ||
                meals[index]?.name ||
                meals[0]?.name,
              "No Meal"
            );

          const row = [
            name.toUpperCase(),
            type,
            `${fromCode}-${toCode}`,
            pnr,
            seat,
            meal,
            `Cabin: ${cabinBaggage}\nCheck-in: ${checkinBaggage}`,
          ];

          let rx = 30;

          for (
            let i = 0;
            i <
            passengerCols.length;
            i++
          ) {
            const col =
              passengerCols[i];

            doc
              .rect(
                rx,
                y,
                col.width,
                42
              )
              .strokeColor(
                BORDER
              )
              .stroke();

            doc
              .fontSize(6.5)
              .font(
                i === 0
                  ? "Helvetica-Bold"
                  : "Helvetica"
              )
              .fillColor(DARK)
              .text(
                String(row[i]),
                rx + 3,
                y + 7,
                {
                  width:
                    col.width - 6,
                  height: 32,
                  align: "center",
                }
              );

            rx += col.width;
          }

          y += 42;
        }
      );

      y += 8;

      // =====================================================
      // QR / PROMO
      // =====================================================

      doc
        .roundedRect(
          30,
          y,
          535,
          62,
          5
        )
        .fillColor("#F8FAFC")
        .fill();

      doc
        .fontSize(15)
        .font("Helvetica-Bold")
        .fillColor(DARK)
        .text(
          "Saiyed Travels",
          45,
          y + 14
        );

      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor(GRAY)
        .text(
          "Your Journey, Our Responsibility",
          45,
          y + 35
        );

      doc
        .fontSize(7)
        .text(
          "Flight Booking • Visa • Holidays",
          45,
          y + 48
        );

      // =====================================================
      // QR CODE
      // =====================================================

      const qrData =
        encodeURIComponent(
          JSON.stringify({
            bookingId,
            pnr,
            passenger:
              passengers.map(
                (item) =>
                  safe(
                    item?.name,
                    "Passenger"
                  )
              ),
            airline,
            flightNo,
            from: fromCode,
            to: toCode,
            seats:
              seats.map(
                (item) =>
                  typeof item ===
                  "object"
                    ? (
                        item?.seatNumber ||
                        item?.seat ||
                        ""
                      )
                    : item
              ),
          })
        );

      const qrUrl =
        `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;

      // NOTE:
      // PDFKit cannot directly render a remote URL.
      // QR will be added when remote image loading is available.
      // Ticket remains fully valid without QR image.

      doc
        .fontSize(7)
        .font("Helvetica")
        .fillColor(GRAY)
        .text(
          "Scan to verify booking",
          445,
          y + 25,
          {
            width: 100,
            align: "center",
          }
        );

      y += 75;

      // =====================================================
      // IMPORTANT INFORMATION
      // =====================================================

      doc
        .roundedRect(
          30,
          y,
          535,
          72,
          5
        )
        .fillColor("#F8FAFC")
        .fill();

      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor(DARK)
        .text(
          "Important Information",
          42,
          y + 10
        );

      doc
        .fontSize(7)
        .font("Helvetica")
        .fillColor(GRAY)
        .text(
          "1. Please carry valid government issued identity proof during your journey.",
          42,
          y + 28
        )
        .text(
          "2. Please reach the airport before the recommended check-in time.",
          42,
          y + 40
        )
        .text(
          "3. Baggage allowance is subject to airline rules and ticket conditions.",
          42,
          y + 52
        )
        .text(
          "4. Please verify all passenger and flight details before travelling.",
          42,
          y + 64
        );

      y += 84;

      // =====================================================
      // PAYMENT / TOTAL
      // =====================================================

      doc
        .roundedRect(
          30,
          y,
          535,
          45,
          5
        )
        .fillColor("#EFF6FF")
        .fill();

      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor(GRAY)
        .text(
          `Payment: ${paymentMethod}`,
          42,
          y + 10
        );

      doc
        .fontSize(8)
        .text(
          `Status: ${paymentStatus} | Booking: ${bookingStatus}`,
          42,
          y + 25
        );

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .fillColor(GREEN)
        .text(
          `₹${finalTotal.toLocaleString(
            "en-IN"
          )}`,
          440,
          y + 14,
          {
            width: 105,
            align: "right",
          }
        );

      y += 58;

      // =====================================================
      // FOOTER
      // =====================================================

      doc
        .moveTo(
          30,
          y
        )
        .lineTo(
          565,
          y
        )
        .strokeColor(
          BORDER
        )
        .stroke();

      y += 10;

      doc
        .fontSize(8)
        .font("Helvetica-Bold")
        .fillColor(DARK)
        .text(
          "Saiyed Travels",
          30,
          y
        );

      doc
        .fontSize(7)
        .font("Helvetica")
        .fillColor(GRAY)
        .text(
          "Flight Booking & Travel Services",
          30,
          y + 13
        );

      doc
        .fontSize(7)
        .text(
          `Booking ID: ${bookingId}    PNR: ${pnr}`,
          350,
          y + 6,
          {
            width: 215,
            align: "right",
          }
        );

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
};






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