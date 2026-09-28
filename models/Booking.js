const mongoose = require("mongoose");

// =====================================================
// PASSENGER SCHEMA
// =====================================================

const passengerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },

    firstName: {
      type: String,
      default: "",
      trim: true,
    },

    lastName: {
      type: String,
      default: "",
      trim: true,
    },

    gender: {
      type: String,
      default: "",
      trim: true,
    },

    dob: {
      type: String,
      default: "",
      trim: true,
    },

    nationality: {
      type: String,
      default: "",
      trim: true,
    },

    passportNumber: {
      type: String,
      default: "",
      trim: true,
    },

    passportExpiry: {
      type: String,
      default: "",
      trim: true,
    },

    passengerType: {
      type: String,
      default: "Adult",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: true,
  }
);

// =====================================================
// FLIGHT SCHEMA
// =====================================================

const flightSchema = new mongoose.Schema(
  {
    flightId: {
      type: String,
      default: "",
      trim: true,
    },

    airline: {
      type: String,
      default: "",
      trim: true,
    },

    flightNo: {
      type: String,
      default: "",
      trim: true,
    },

    flightType: {
      type: String,
      default: "",
      trim: true,
    },

    aircraft: {
      type: String,
      default: "",
      trim: true,
    },

    fromCity: {
      type: String,
      default: "",
      trim: true,
    },

    fromAirport: {
      type: String,
      default: "",
      trim: true,
    },

    fromCode: {
      type: String,
      default: "",
      trim: true,
    },

    toCity: {
      type: String,
      default: "",
      trim: true,
    },

    toAirport: {
      type: String,
      default: "",
      trim: true,
    },

    toCode: {
      type: String,
      default: "",
      trim: true,
    },

    departureDate: {
      type: String,
      default: "",
      trim: true,
    },

    departureTime: {
      type: String,
      default: "",
      trim: true,
    },

    departureTerminal: {
      type: String,
      default: "",
      trim: true,
    },

    arrivalDate: {
      type: String,
      default: "",
      trim: true,
    },

    arrivalTime: {
      type: String,
      default: "",
      trim: true,
    },

    arrivalTerminal: {
      type: String,
      default: "",
      trim: true,
    },

    duration: {
      type: String,
      default: "",
      trim: true,
    },

    stops: {
      type: mongoose.Schema.Types.Mixed,
      default: 0,
    },

    stopAirport: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    finalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    taxes: {
      type: Number,
      default: 0,
      min: 0,
    },

    serviceFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =================================================
    // EXACT ADMIN CABIN BAGGAGE
    // =================================================

    cabinBaggage: {
      type: String,
      default: "",
      trim: true,
    },

    // =================================================
    // EXACT ADMIN CHECK-IN BAGGAGE
    // =================================================

    checkinBaggage: {
      type: String,
      default: "",
      trim: true,
    },

    // =================================================
    // COMPLETE BAGGAGE OBJECT
    // =================================================

    baggage: {
      cabinBaggage: {
        type: String,
        default: "",
        trim: true,
      },

      cabin: {
        type: String,
        default: "",
        trim: true,
      },

      checkinBaggage: {
        type: String,
        default: "",
        trim: true,
      },

      checkin: {
        type: String,
        default: "",
        trim: true,
      },

      weight: {
        type: String,
        default: "",
        trim: true,
      },
    },

    logo: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

// =====================================================
// BAGGAGE SCHEMA
// =====================================================

const baggageSchema = new mongoose.Schema(
  {
    passengerId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    passengerName: {
      type: String,
      default: "",
      trim: true,
    },

    // =================================================
    // EXACT CABIN BAGGAGE
    // =================================================

    cabinBaggage: {
      type: String,
      default: "",
      trim: true,
    },

    cabin: {
      type: String,
      default: "",
      trim: true,
    },

    // =================================================
    // EXACT CHECK-IN BAGGAGE
    // =================================================

    checkinBaggage: {
      type: String,
      default: "",
      trim: true,
    },

    checkin: {
      type: String,
      default: "",
      trim: true,
    },

    // =================================================
    // CHECK-IN WEIGHT
    // =================================================

    weight: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: true,
  }
);

// =====================================================
// BOOKING SCHEMA
// =====================================================

const bookingSchema = new mongoose.Schema(
  {
    // =================================================
    // BOOKING ID
    // =================================================

    bookingId: {
      type: String,
      default: "",
      trim: true,
    },

    // =================================================
    // CUSTOMER DETAILS
    // =================================================

    name: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    whatsappNumber: {
      type: String,
      default: "",
      trim: true,
    },

    // =================================================
    // FLIGHT DETAILS
    // =================================================

    flight: {
      type: flightSchema,
      required: true,
    },

    // =================================================
    // PASSENGERS
    // =================================================

    passengers: {
      type: [passengerSchema],
      default: [],
    },

    // =================================================
    // PASSENGER COUNTS
    // =================================================

    adults: {
      type: Number,
      default: 1,
      min: 0,
    },

    children: {
      type: Number,
      default: 0,
      min: 0,
    },

    infants: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =================================================
    // SEATS
    // =================================================

    selectedSeats: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    seats: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    // =================================================
    // MEAL
    // =================================================

    meal: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    meals: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    // =================================================
    // BAGGAGES
    // =================================================

    baggages: {
      type: [baggageSchema],
      default: [],
    },

    // =================================================
    // MAIN BAGGAGE
    // =================================================

    baggage: {
      type: baggageSchema,

      default: () => ({
        cabinBaggage: "",
        cabin: "",
        checkinBaggage: "",
        checkin: "",
        weight: "",
        price: 0,
      }),
    },

    // =================================================
    // PRICING
    // =================================================

    pricing: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    adultFare: {
      type: Number,
      default: 0,
      min: 0,
    },

    childFare: {
      type: Number,
      default: 0,
      min: 0,
    },

    infantFare: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =================================================
    // AGENT FARES
    // =================================================

    agentAdultFare: {
      type: Number,
      default: 0,
      min: 0,
    },

    agentChildFare: {
      type: Number,
      default: 0,
      min: 0,
    },

    agentInfantFare: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =================================================
    // FARE ROLE
    // customer / agent
    // =================================================

    fareRole: {
      type: String,
      enum: ["customer", "agent"],
      default: "customer",
    },

    // =================================================
    // TOTAL AMOUNT
    // =================================================

    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    amount: {
      type: Number,
      default: 0,
      min: 0,
    },

    finalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =================================================
    // PAYMENT DETAILS
    // =================================================

    paymentStatus: {
      type: String,
      default: "Pending",
      trim: true,
    },

    paymentMethod: {
      type: String,
      default: "",
      trim: true,
    },

    paymentId: {
      type: String,
      default: "",
      trim: true,
    },

    paymentVerified: {
      type: Boolean,
      default: false,
    },

    // =================================================
    // BOOKING STATUS
    // =================================================

    bookingStatus: {
      type: String,
      default: "Pending",
      trim: true,
    },

    status: {
      type: String,
      default: "Pending",
      trim: true,
    },

    // =================================================
    // ADMIN DETAILS
    // =================================================

    adminNote: {
      type: String,
      default: "",
      trim: true,
    },

    // =================================================
    // TICKET DETAILS
    // =================================================

    ticketNumber: {
      type: String,
      default: "",
      trim: true,
    },

    pnr: {
      type: String,
      default: "",
      trim: true,
    },

    // =================================================
    // SOURCE
    // =================================================

    source: {
      type: String,
      default: "website",
      trim: true,
    },

    // =================================================
    // USER
    // =================================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },

  {
    timestamps: true,

    // Extra fields ko preserve karega
    strict: false,
  }
);

// =====================================================
// MODEL
// =====================================================

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;