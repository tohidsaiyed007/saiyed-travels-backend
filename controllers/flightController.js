const Flight = require("../models/Flight");

// =====================================================
// CREATE FLIGHT
// =====================================================

const createFlight = async (req, res) => {
  try {
    const data = req.body;

    console.log("CREATE FLIGHT DATA:", data);

    // -----------------------------------------------
    // IMPORTANT:
    // Flight model requires:
    // airline
    // flightNo
    // -----------------------------------------------

    const airline = String(
      data.airline ||
        data.airlineName ||
        ""
    ).trim();

    const flightNo = String(
      data.flightNo ||
        data.flightNumber ||
        ""
    )
      .trim()
      .toUpperCase();

    if (!airline) {
      return res.status(400).json({
        success: false,
        message: "Airline name is required.",
      });
    }

    if (!flightNo) {
      return res.status(400).json({
        success: false,
        message: "Flight number is required.",
      });
    }

    // -----------------------------------------------
    // STOP DETAILS
    // -----------------------------------------------

    const stopDetails =
      Array.isArray(data.stopDetails)
        ? data.stopDetails.map((stop) => ({
            city:
              stop.city || "",

            airport:
              stop.airport || "",

            airportCode:
              String(
                stop.airportCode || ""
              )
                .trim()
                .toUpperCase(),

            terminal:
              stop.terminal || "",

            arrivalTime:
              stop.arrivalTime || "",

            departureTime:
              stop.departureTime || "",

            layoverDuration:
              stop.layoverDuration ||
              "",
          }))
        : [];

    // -----------------------------------------------
    // TICKET INVENTORY
    // -----------------------------------------------

    const ticketInventory = Math.max(
      Number(data.ticketInventory) || 0,
      0
    );

    // -----------------------------------------------
    // PNR
    // -----------------------------------------------

    const pnr = String(
      data.pnr ||
        data.PNR ||
        ""
    )
      .trim()
      .toUpperCase();

    // -----------------------------------------------
    // FARES
    // -----------------------------------------------

    const adultFare =
      Number(data.adultFare) || 0;

    const childFare =
      Number(data.childFare) || 0;

    const infantFare =
      Number(data.infantFare) || 0;

    const agentAdultFare =
      Number(data.agentAdultFare) || 0;

    const agentChildFare =
      Number(data.agentChildFare) || 0;

    const agentInfantFare =
      Number(data.agentInfantFare) || 0;

    // -----------------------------------------------
    // BAGGAGE
    // -----------------------------------------------

    const cabinBaggage = String(
      data.cabinBaggage ||
        data.cabinBag ||
        ""
    ).trim();

    const checkinBaggage = String(
      data.checkinBaggage ||
        data.checkinBag ||
        ""
    ).trim();

    // -----------------------------------------------
    // TICKETS
    //
    // One group PNR is stored for the inventory.
    // -----------------------------------------------

    const tickets = [];

    if (Array.isArray(data.tickets)) {
      data.tickets.forEach((ticket) => {
        if (ticket && ticket.pnr) {
          tickets.push({
            pnr: String(
              ticket.pnr
            )
              .trim()
              .toUpperCase(),

            status:
              ticket.status ||
              "Available",

            bookingId:
              ticket.bookingId ||
              "",

            passengerName:
              ticket.passengerName ||
              "",

            bookedAt:
              ticket.bookedAt ||
              null,
          });
        }
      });
    }

    // If AddFlight sends one PNR, keep it.
    if (
      tickets.length === 0 &&
      pnr
    ) {
      tickets.push({
        pnr,
        status: "Available",
        bookingId: "",
        passengerName: "",
        bookedAt: null,
      });
    }

    // -----------------------------------------------
    // CABIN
    // -----------------------------------------------

    let cabins = [];

    if (Array.isArray(data.cabins)) {
      cabins = data.cabins.map(
        (cabin) => ({
          name:
            cabin.name ||
            "Economy",

          totalSeats:
            Number(
              cabin.totalSeats
            ) || 0,

          availableSeats:
            Number(
              cabin.availableSeats ??
                cabin.totalSeats ??
                0
            ),

          price:
            Number(
              cabin.price
            ) || 0,

          baggage:
            cabin.baggage ||
            cabinBaggage ||
            checkinBaggage ||
            "",
        })
      );
    }

    // If no cabins are supplied, create
    // one Economy cabin automatically.
    if (cabins.length === 0) {
      cabins.push({
        name: "Economy",

        totalSeats:
          ticketInventory,

        availableSeats:
          ticketInventory,

        price:
          adultFare,

        baggage:
          checkinBaggage ||
          cabinBaggage ||
          "",
      });
    }

    // -----------------------------------------------
    // CREATE FLIGHT
    // -----------------------------------------------

    const flight = await Flight.create({
      // =================================================
      // BASIC
      // =================================================

      // IMPORTANT:
      // These exact field names match Flight.js
      airline,

      airlineName:
        data.airlineName ||
        airline,

      flightNo,

      flightNumber:
        data.flightNumber ||
        flightNo,

      flightType:
        data.flightType ||
        "Domestic",

      aircraft:
        String(
          data.aircraft || ""
        ).trim(),

      // =================================================
      // ROUTE
      // =================================================

      route:
        data.route ||
        `${data.fromCity || ""} - ${
          data.toCity || ""
        }`,

      fromCity:
        data.fromCity || "",

      fromAirport:
        data.fromAirport || "",

      fromCode:
        String(
          data.fromCode ||
            data.fromAirportCode ||
            ""
        )
          .trim()
          .toUpperCase(),

      fromTerminal:
        data.fromTerminal || "",

      toCity:
        data.toCity || "",

      toAirport:
        data.toAirport || "",

      toCode:
        String(
          data.toCode ||
            data.toAirportCode ||
            ""
        )
          .trim()
          .toUpperCase(),

      toTerminal:
        data.toTerminal || "",

      // =================================================
      // SCHEDULE
      // =================================================

      departureDate:
        data.departureDate || "",

      departureTime:
        data.departureTime || "",

      departureTerminal:
        data.departureTerminal ||
        data.fromTerminal ||
        "",

      arrivalDate:
        data.arrivalDate ||
        data.departureDate ||
        "",

      arrivalTime:
        data.arrivalTime || "",

      arrivalTerminal:
        data.arrivalTerminal ||
        data.toTerminal ||
        "",

      duration:
        data.duration || "",

      // =================================================
      // STOPS
      // =================================================

      stops:
        data.stops ||
        "Non-stop",

      stopAirport:
        data.stopAirport ||
        "",

      stopCity:
        data.stopCity ||
        "",

      stopAirportCode:
        String(
          data.stopAirportCode ||
            ""
        )
          .trim()
          .toUpperCase(),

      stopTerminal:
        data.stopTerminal ||
        "",

      layoverDuration:
        data.layoverDuration ||
        "",

      stopDetails,

      // =================================================
      // INVENTORY
      // =================================================

      ticketInventory,

      pnr,

      tickets,

      // =================================================
      // CUSTOMER FARES
      // =================================================

      adultFare,

      childFare,

      infantFare,

      // =================================================
      // AGENT FARES
      // =================================================

      agentAdultFare,

      agentChildFare,

      agentInfantFare,

      // =================================================
      // GENERAL PRICE
      // =================================================

      baseFare:
        data.baseFare !== undefined
          ? Number(data.baseFare)
          : adultFare,

      taxes:
        Number(data.taxes) || 0,

      airportCharges:
        Number(
          data.airportCharges
        ) || 0,

      serviceFee:
        Number(data.serviceFee) || 0,

      discount:
        Number(data.discount) || 0,

      finalPrice:
        data.finalPrice !== undefined
          ? Number(data.finalPrice)
          : adultFare,

      currency:
        data.currency ||
        "INR",

      // =================================================
      // BAGGAGE
      // =================================================

      cabinBaggage,

      checkinBaggage,

      extraBaggagePrice:
        Number(
          data.extraBaggagePrice
        ) || 0,

      // =================================================
      // BOOKING RULES
      // =================================================

      bookingRules:
        data.bookingRules ||
        data.bookingRule ||
        "",

      refundable:
        data.refundable === true ||
        data.refundable === "true" ||
        data.bookingRule ===
          "Refundable",

      changeable:
        data.changeable === true ||
        data.changeable === "true" ||
        data.bookingRule ===
          "Refundable",

      bookingStartDate:
        data.bookingStartDate ||
        "",

      bookingClosingDate:
        data.bookingClosingDate ||
        "",

      // =================================================
      // CABINS
      // =================================================

      cabins,

      // =================================================
      // SERVICES
      // =================================================

      mealAvailable:
        Boolean(
          data.mealAvailable
        ),

      wifiAvailable:
        Boolean(
          data.wifiAvailable
        ),

      entertainmentAvailable:
        Boolean(
          data.entertainmentAvailable
        ),

      powerAvailable:
        Boolean(
          data.powerAvailable
        ),

      // =================================================
      // STATUS
      // =================================================

      status:
        data.status ||
        "Scheduled",

      description:
        data.description ||
        "",

      specialInstructions:
        data.specialInstructions ||
        "",

      // =================================================
      // LOGO
      // =================================================

      logo:
        data.logo ||
        "",

      airlineLogo:
        data.airlineLogo ||
        data.logo ||
        "",
    });

    console.log(
      "FLIGHT CREATED:",
      flight._id
    );

    return res.status(201).json({
      success: true,

      message:
        "Flight added successfully.",

      flight,
    });

  } catch (error) {
    console.error(
      "CREATE FLIGHT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to add flight.",
    });
  }
};

// =====================================================
// GET ALL FLIGHTS
// =====================================================

const getFlights = async (
  req,
  res
) => {
  try {
    const flights =
      await Flight.find()
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,

      count:
        flights.length,

      flights,
    });

  } catch (error) {
    console.error(
      "GET FLIGHTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to fetch flights.",
    });
  }
};

// =====================================================
// GET FLIGHT BY ID
// =====================================================

const getFlightById = async (
  req,
  res
) => {
  try {
    const flight =
      await Flight.findById(
        req.params.id
      );

    if (!flight) {
      return res.status(404).json({
        success: false,
        message:
          "Flight not found.",
      });
    }

    return res.status(200).json({
      success: true,
      flight,
    });

  } catch (error) {
    console.error(
      "GET FLIGHT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to fetch flight.",
    });
  }
};

// =====================================================
// UPDATE FLIGHT
// =====================================================

const updateFlight = async (
  req,
  res
) => {
  try {
    const data = req.body;

    const updateData = {
      ...data,
    };

    // -----------------------------------------------
    // BASIC
    // -----------------------------------------------

    if (
      data.airline !== undefined ||
      data.airlineName !== undefined
    ) {
      updateData.airline =
        String(
          data.airline ||
            data.airlineName ||
            ""
        ).trim();

      updateData.airlineName =
        data.airlineName ||
        updateData.airline;
    }

    if (
      data.flightNo !== undefined ||
      data.flightNumber !== undefined
    ) {
      updateData.flightNo =
        String(
          data.flightNo ||
            data.flightNumber ||
            ""
        )
          .trim()
          .toUpperCase();

      updateData.flightNumber =
        data.flightNumber ||
        updateData.flightNo;
    }

    // -----------------------------------------------
    // FARES
    // -----------------------------------------------

    if (
      data.adultFare !==
      undefined
    ) {
      updateData.adultFare =
        Number(
          data.adultFare
        );
    }

    if (
      data.childFare !==
      undefined
    ) {
      updateData.childFare =
        Number(
          data.childFare
        );
    }

    if (
      data.infantFare !==
      undefined
    ) {
      updateData.infantFare =
        Number(
          data.infantFare
        );
    }

    if (
      data.agentAdultFare !==
      undefined
    ) {
      updateData.agentAdultFare =
        Number(
          data.agentAdultFare
        );
    }

    if (
      data.agentChildFare !==
      undefined
    ) {
      updateData.agentChildFare =
        Number(
          data.agentChildFare
        );
    }

    if (
      data.agentInfantFare !==
      undefined
    ) {
      updateData.agentInfantFare =
        Number(
          data.agentInfantFare
        );
    }

    // -----------------------------------------------
    // INVENTORY
    // -----------------------------------------------

    if (
      data.ticketInventory !==
      undefined
    ) {
      updateData.ticketInventory =
        Math.max(
          Number(
            data.ticketInventory
          ) || 0,
          0
        );
    }

    // -----------------------------------------------
    // PNR
    // -----------------------------------------------

    if (
      data.pnr !== undefined ||
      data.PNR !== undefined
    ) {
      updateData.pnr =
        String(
          data.pnr ||
            data.PNR ||
            ""
        )
          .trim()
          .toUpperCase();
    }

    // -----------------------------------------------
    // BAGGAGE
    // -----------------------------------------------

    if (
      data.cabinBaggage !==
      undefined ||
      data.cabinBag !==
      undefined
    ) {
      updateData.cabinBaggage =
        data.cabinBaggage !==
        undefined
          ? data.cabinBaggage
          : data.cabinBag;
    }

    if (
      data.checkinBaggage !==
      undefined ||
      data.checkinBag !==
      undefined
    ) {
      updateData.checkinBaggage =
        data.checkinBaggage !==
        undefined
          ? data.checkinBaggage
          : data.checkinBag;
    }

    // -----------------------------------------------
    // STOPS
    // -----------------------------------------------

    if (
      Array.isArray(
        data.stopDetails
      )
    ) {
      updateData.stopDetails =
        data.stopDetails;
    }

    // -----------------------------------------------
    // CLEAN UNDEFINED
    // -----------------------------------------------

    Object.keys(
      updateData
    ).forEach((key) => {
      if (
        updateData[key] ===
        undefined
      ) {
        delete updateData[key];
      }
    });

    // -----------------------------------------------
    // UPDATE
    // -----------------------------------------------

    const flight =
      await Flight.findByIdAndUpdate(
        req.params.id,

        updateData,

        {
          new: true,
          runValidators: true,
        }
      );

    if (!flight) {
      return res.status(404).json({
        success: false,
        message:
          "Flight not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Flight updated successfully.",

      flight,
    });

  } catch (error) {
    console.error(
      "UPDATE FLIGHT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to update flight.",
    });
  }
};

// =====================================================
// DELETE FLIGHT
// =====================================================

const deleteFlight = async (
  req,
  res
) => {
  try {
    const flight =
      await Flight.findByIdAndDelete(
        req.params.id
      );

    if (!flight) {
      return res.status(404).json({
        success: false,

        message:
          "Flight not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Flight deleted successfully.",

      flightId:
        flight._id,
    });

  } catch (error) {
    console.error(
      "DELETE FLIGHT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to delete flight.",
    });
  }
};

// =====================================================
// SEARCH FLIGHTS
// =====================================================

const searchFlights = async (
  req,
  res
) => {
  try {
    const {
      from,
      to,
      departureDate,
      date,
      adults,
      children,
      infants,
    } = req.query;

    const query = {};

    // -----------------------------------------------
    // FROM
    // -----------------------------------------------

    if (from) {
      query.$or = [
        {
          fromCode: {
            $regex:
              String(from).trim(),
            $options: "i",
          },
        },

        {
          fromCity: {
            $regex:
              String(from).trim(),
            $options: "i",
          },
        },

        {
          fromAirport: {
            $regex:
              String(from).trim(),
            $options: "i",
          },
        },
      ];
    }

    // -----------------------------------------------
    // TO
    // -----------------------------------------------

    if (to) {
      const destinationQuery = {
        $or: [
          {
            toCode: {
              $regex:
                String(to).trim(),
              $options: "i",
            },
          },

          {
            toCity: {
              $regex:
                String(to).trim(),
              $options: "i",
            },
          },

          {
            toAirport: {
              $regex:
                String(to).trim(),
              $options: "i",
            },
          },
        ],
      };

      if (query.$or) {
        query.$and = [
          {
            $or: query.$or,
          },

          destinationQuery,
        ];

        delete query.$or;
      } else {
        query.$or =
          destinationQuery.$or;
      }
    }

    // -----------------------------------------------
    // DATE
    // -----------------------------------------------

    if (
      departureDate ||
      date
    ) {
      query.departureDate =
        departureDate ||
        date;
    }

    // -----------------------------------------------
    // DO NOT SHOW CANCELLED
    // -----------------------------------------------

    query.status = {
      $nin: [
        "Cancelled",
      ],
    };

    // -----------------------------------------------
    // FIND
    // -----------------------------------------------

    const flights =
      await Flight.find(
        query
      ).sort({
        departureDate: 1,
        departureTime: 1,
      });

    // -----------------------------------------------
    // PASSENGER COUNTS
    // -----------------------------------------------

    const passengerCounts = {
      adults: Math.max(
        Number(
          adults || 1
        ),
        1
      ),

      children: Math.max(
        Number(
          children || 0
        ),
        0
      ),

      infants: Math.max(
        Number(
          infants || 0
        ),
        0
      ),
    };

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(200).json({
      success: true,

      count:
        flights.length,

      passengerCounts,

      flights,
    });

  } catch (error) {
    console.error(
      "SEARCH FLIGHTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to search flights.",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createFlight,
  getFlights,
  getFlightById,
  updateFlight,
  deleteFlight,
  searchFlights,
};