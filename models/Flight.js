const mongoose = require("mongoose");

// =====================================================
// INDIVIDUAL TICKET / PNR SCHEMA
// =====================================================

const ticketSchema = new mongoose.Schema(
  {
    // Airline ka original PNR
    pnr: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    // Ticket availability
    status: {
      type: String,
      enum: [
        "Available",
        "Booked",
        "Cancelled",
      ],
      default: "Available",
    },

    // Booking hone ke baad fill hoga
    bookingId: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    // Booking ke baad first passenger ka naam
    passengerName: {
      type: String,
      default: "",
      trim: true,
    },

    // Booking date/time
    bookedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: true,
  }
);


// =====================================================
// CABIN SCHEMA
// =====================================================

const cabinSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: [
        "Economy",
        "Premium Economy",
        "Business",
        "First Class",
      ],
      required: true,
    },

    totalSeats: {
      type: Number,
      required: true,
      min: 0,
    },

    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    baggage: {
      type: String,
      default: "15 KG",
      trim: true,
    },
  },
  {
    _id: false,
  }
);


// =====================================================
// FLIGHT SCHEMA
// =====================================================

const flightSchema = new mongoose.Schema(
  {
    // =================================================
    // BASIC INFORMATION
    // =================================================

    airline: {
      type: String,
      required: true,
      trim: true,
    },

    // Airline logo URL
    logo: {
      type: String,
      default: "",
      trim: true,
    },

    // =================================================
    // FLIGHT NUMBER
    // =================================================
    // IMPORTANT:
    // flightNo alone is NOT unique.
    // Same flight number can be used on different dates.
    // Unique combination is:
    // flightNo + departureDate
    // =================================================

    flightNo: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    flightType: {
      type: String,
      enum: [
        "Domestic",
        "International",
      ],
      required: true,
      default: "Domestic",
    },

    aircraft: {
      type: String,
      required: true,
      trim: true,
    },


    // =================================================
    // ROUTE
    // =================================================

    fromCity: {
      type: String,
      required: true,
      trim: true,
    },

    fromAirport: {
      type: String,
      required: true,
      trim: true,
    },

    fromCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    toCity: {
      type: String,
      required: true,
      trim: true,
    },

    toAirport: {
      type: String,
      required: true,
      trim: true,
    },

    toCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },


    // =================================================
    // DEPARTURE
    // =================================================

    departureDate: {
      type: String,
      required: true,
      trim: true,
    },

    departureTime: {
      type: String,
      required: true,
      trim: true,
    },

    departureTerminal: {
      type: String,
      default: "",
      trim: true,
    },


    // =================================================
    // ARRIVAL
    // =================================================

    arrivalDate: {
      type: String,
      required: true,
      trim: true,
    },

    arrivalTime: {
      type: String,
      required: true,
      trim: true,
    },

    arrivalTerminal: {
      type: String,
      default: "",
      trim: true,
    },


    // =================================================
    // FLIGHT DETAILS
    // =================================================

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    stops: {
      type: String,
      enum: [
        "Non-stop",
        "1 Stop",
        "2 Stops",
      ],
      default: "Non-stop",
    },

    stopAirport: {
      type: String,
      default: "",
      trim: true,
    },

    stopCity: {
      type: String,
      default: "",
      trim: true,
    },

    layoverDuration: {
      type: String,
      default: "",
      trim: true,
    },


    // =================================================
    // CABINS
    // =================================================

    cabins: {
      type: [cabinSchema],

      required: true,

      validate: {
        validator: function (value) {
          return (
            Array.isArray(value) &&
            value.length > 0
          );
        },

        message:
          "At least one cabin is required.",
      },
    },


    // =================================================
    // PRICING
    // =================================================

    // -----------------------------------------------
    // ADULT FARE
    // -----------------------------------------------

    adultFare: {
      type: Number,
      default: 0,
      min: 0,
    },

    // -----------------------------------------------
    // CHILD FARE
    // -----------------------------------------------

    childFare: {
      type: Number,
      default: 0,
      min: 0,
    },

    // -----------------------------------------------
    // INFANT FARE
    // -----------------------------------------------

    infantFare: {
      type: Number,
      default: 0,
      min: 0,
    },



    // -----------------------------------------------
// AGENT ADULT FARE
// -----------------------------------------------

agentAdultFare: {
  type: Number,
  default: 0,
  min: 0,
},

// -----------------------------------------------
// AGENT CHILD FARE
// -----------------------------------------------

agentChildFare: {
  type: Number,
  default: 0,
  min: 0,
},

// -----------------------------------------------
// AGENT INFANT FARE
// -----------------------------------------------

agentInfantFare: {
  type: Number,
  default: 0,
  min: 0,
},

    // -----------------------------------------------
    // OLD / GENERAL FARE FIELDS
    // -----------------------------------------------

    baseFare: {
      type: Number,
      default: 0,
      min: 0,
    },

    taxes: {
      type: Number,
      default: 0,
      min: 0,
    },

    airportCharges: {
      type: Number,
      default: 0,
      min: 0,
    },

    serviceFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },


    // =================================================
    // MEAL PRICING
    // =================================================

    adultMealPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    childMealPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    infantMealPrice: {
      type: Number,
      default: 0,
      min: 0,
    },


    // =================================================
    // BAGGAGE PRICING
    // =================================================

    adultBaggagePrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    childBaggagePrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    infantBaggagePrice: {
      type: Number,
      default: 0,
      min: 0,
    },


    // =================================================
    // SEAT PRICING
    // =================================================

    adultSeatPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    childSeatPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    infantSeatPrice: {
      type: Number,
      default: 0,
      min: 0,
    },


    // =================================================
    // CUSTOMER KO DIKHNE WALA FINAL FLIGHT PRICE
    // =================================================

    finalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      trim: true,
      uppercase: true,
    },


    // =================================================
    // BAGGAGE
    // =================================================

    cabinBaggage: {
      type: String,
      default: "7 KG",
      trim: true,
    },

    checkinBaggage: {
      type: String,
      default: "15 KG",
      trim: true,
    },

    extraBaggagePrice: {
      type: Number,
      default: 0,
      min: 0,
    },


    // =================================================
    // SERVICES
    // =================================================

    mealAvailable: {
      type: Boolean,
      default: false,
    },

    wifiAvailable: {
      type: Boolean,
      default: false,
    },

    entertainmentAvailable: {
      type: Boolean,
      default: false,
    },

    powerAvailable: {
      type: Boolean,
      default: false,
    },


    // =================================================
    // BOOKING WINDOW
    // =================================================

    bookingStartDate: {
      type: String,
      default: "",
      trim: true,
    },

    bookingClosingDate: {
      type: String,
      default: "",
      trim: true,
    },

    refundable: {
      type: Boolean,
      default: false,
    },

    changeable: {
      type: Boolean,
      default: false,
    },


    // =================================================
    // INDIVIDUAL AIRLINE TICKETS / PNR
    // =================================================

    tickets: {
      type: [ticketSchema],
      default: [],
    },


    // =================================================
    // FLIGHT STATUS
    // =================================================

    status: {
      type: String,
      enum: [
        "Scheduled",
        "Delayed",
        "Cancelled",
        "Boarding",
        "Departed",
        "Arrived",
      ],
      default: "Scheduled",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    specialInstructions: {
      type: String,
      default: "",
      trim: true,
    },
  },

  {
    timestamps: true,
  }
);


// =====================================================
// IMPORTANT UNIQUE INDEX
// =====================================================
//
// Same flight number on DIFFERENT dates = ALLOWED
//
// OV797 + 2026-09-12 = ALLOWED
// OV797 + 2026-09-17 = ALLOWED
//
// Same flight number + SAME departure date = NOT ALLOWED
//
// OV797 + 2026-09-12 = FIRST RECORD
// OV797 + 2026-09-12 = DUPLICATE ❌
//
// =====================================================

flightSchema.index(
  {
    flightNo: 1,
    departureDate: 1,
  },
  {
    unique: true,
  }
);


// =====================================================
// TICKET COUNTS
// =====================================================

flightSchema.virtual(
  "totalTickets"
).get(function () {

  return Array.isArray(this.tickets)
    ? this.tickets.length
    : 0;

});


flightSchema.virtual(
  "availableTickets"
).get(function () {

  if (!Array.isArray(this.tickets)) {
    return 0;
  }

  return this.tickets.filter(
    (ticket) =>
      ticket.status ===
      "Available"
  ).length;

});


flightSchema.virtual(
  "bookedTickets"
).get(function () {

  if (!Array.isArray(this.tickets)) {
    return 0;
  }

  return this.tickets.filter(
    (ticket) =>
      ticket.status ===
      "Booked"
  ).length;

});


flightSchema.virtual(
  "cancelledTickets"
).get(function () {

  if (!Array.isArray(this.tickets)) {
    return 0;
  }

  return this.tickets.filter(
    (ticket) =>
      ticket.status ===
      "Cancelled"
  ).length;

});


// =====================================================
// AVAILABLE TICKET COUNT
// =====================================================

flightSchema.virtual(
  "hasAvailableTicket"
).get(function () {

  if (!Array.isArray(this.tickets)) {
    return false;
  }

  return this.tickets.some(
    (ticket) =>
      ticket.status ===
      "Available"
  );

});


// =====================================================
// JSON VIRTUALS
// =====================================================

flightSchema.set(
  "toJSON",
  {
    virtuals: true,
  }
);


flightSchema.set(
  "toObject",
  {
    virtuals: true,
  }
);


// =====================================================
// MODEL
// =====================================================

module.exports =
  mongoose.model(
    "Flight",
    flightSchema
  );