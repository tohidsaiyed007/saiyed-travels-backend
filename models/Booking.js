

// const mongoose = require("mongoose");

// // =====================================================
// // PASSENGER SCHEMA
// // =====================================================

// const passengerSchema = new mongoose.Schema(
//   {
//     type: {
//       type: String,
//       enum: ["Adult", "Child", "Infant"],
//       required: true,
//       default: "Adult",
//     },

//     firstName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     lastName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     dob: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     gender: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     nationality: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     passport: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     passportExpiry: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     email: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     phone: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     city: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     address: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     request: {
//       type: String,
//       default: "",
//       trim: true,
//     },
//   },
//   {
//     _id: true,
//   }
// );

// // =====================================================
// // FLIGHT SNAPSHOT SCHEMA
// // =====================================================

// const flightSchema = new mongoose.Schema(
//   {
//     flightId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Flight",
//       default: null,
//     },

//     airline: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     flightNo: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     flightType: {
//       type: String,
//       default: "Domestic",
//       trim: true,
//     },

//     aircraft: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     fromCity: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     fromAirport: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     fromCode: {
//       type: String,
//       default: "",
//       trim: true,
//       uppercase: true,
//     },

//     toCity: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     toAirport: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     toCode: {
//       type: String,
//       default: "",
//       trim: true,
//       uppercase: true,
//     },

//     departureDate: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     departureTime: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     departureTerminal: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     arrivalDate: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     arrivalTime: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     arrivalTerminal: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     duration: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     stops: {
//       type: String,
//       default: "Non-stop",
//       trim: true,
//     },

//     stopAirport: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     price: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     finalPrice: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     taxes: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     serviceFee: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     logo: {
//       type: String,
//       default: "",
//       trim: true,
//     },
//   },
//   {
//     _id: false,
//   }
// );

// // =====================================================
// // SEAT SCHEMA
// // =====================================================

// const seatSchema = new mongoose.Schema(
//   {
//     passengerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       default: null,
//     },

//     passengerName: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     seatNumber: {
//       type: String,
//       required: true,
//       trim: true,
//       uppercase: true,
//     },

//     price: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//   },
//   {
//     _id: true,
//   }
// );

// // =====================================================
// // MEAL SCHEMA
// // =====================================================

// const mealSchema = new mongoose.Schema(
//   {
//     passengerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       default: null,
//     },

//     passengerName: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     name: {
//       type: String,
//       default: "No Meal",
//       trim: true,
//     },

//     price: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//   },
//   {
//     _id: true,
//   }
// );

// // =====================================================
// // BAGGAGE SCHEMA
// // =====================================================

// const baggageSchema = new mongoose.Schema(
//   {
//     passengerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       default: null,
//     },

//     passengerName: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     weight: {
//       type: String,
//       default: "15 KG (Included)",
//       trim: true,
//     },

//     price: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//   },
//   {
//     _id: true,
//   }
// );

// // =====================================================
// // BOOKING SCHEMA
// // =====================================================

// const bookingSchema = new mongoose.Schema(
//   {
//     // =================================================
//     // BOOKING ID
//     // =================================================

//     bookingId: {
//       type: String,
//       unique: true,
//       required: true,
//       trim: true,
//       uppercase: true,
//     },

//     // =================================================
//     // CUSTOMER USER ID
//     // =================================================

//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//       index: true,
//     },

//     // =================================================
//     // AIRLINE PNR
//     // IMPORTANT:
//     // PNR IS NOT UNIQUE.
//     // SAME PNR CAN BE USED FOR MULTIPLE TICKETS.
//     // =================================================

//     pnr: {
//       type: String,
//       required: true,
//       trim: true,
//       uppercase: true,
//       index: true,
//     },

//     // =================================================
//     // FLIGHT DATABASE ID
//     // =================================================

//     flightId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Flight",
//       default: null,
//     },

//     // =================================================
//     // PASSENGER COUNTS
//     // =================================================

//     adults: {
//       type: Number,
//       default: 1,
//       min: 0,
//     },

//     children: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     infants: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     totalPassengers: {
//       type: Number,
//       default: 1,
//       min: 1,
//     },

//     // =================================================
//     // MULTIPLE PASSENGERS
//     // =================================================

//     passengers: {
//       type: [passengerSchema],
//       required: true,

//       validate: {
//         validator: function (value) {
//           return (
//             Array.isArray(value) &&
//             value.length > 0
//           );
//         },

//         message:
//           "At least one passenger is required.",
//       },
//     },

//     // =================================================
//     // OLD SINGLE PASSENGER COMPATIBILITY
//     // =================================================

//     passenger: {
//       type: mongoose.Schema.Types.Mixed,
//       default: null,
//     },

//     // =================================================
//     // FLIGHT SNAPSHOT
//     // =================================================

//     flight: {
//       type: flightSchema,
//       required: true,
//     },

//     // =================================================
//     // MULTIPLE SEATS
//     // =================================================

//     seats: {
//       type: [seatSchema],
//       default: [],
//     },

//     // =================================================
//     // OLD SINGLE SEAT
//     // =================================================

//     seat: {
//       type: String,
//       default: "",
//       trim: true,
//       uppercase: true,
//     },

//     seatPrice: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     // =================================================
//     // MEALS
//     // =================================================

//     meals: {
//       type: [mealSchema],
//       default: [],
//     },

//     // =================================================
//     // OLD SINGLE MEAL
//     // =================================================

//     meal: {
//       type: mealSchema,

//       default: () => ({
//         name: "No Meal",
//         price: 0,
//       }),
//     },

//     // =================================================
//     // BAGGAGE
//     // =================================================

//     baggages: {
//       type: [baggageSchema],
//       default: [],
//     },

//     // =================================================
//     // OLD SINGLE BAGGAGE
//     // =================================================

//     baggage: {
//       type: baggageSchema,

//       default: () => ({
//         weight: "15 KG (Included)",
//         price: 0,
//       }),
//     },

//     // =================================================
//     // FARE BREAKDOWN
//     // =================================================

//     flightFare: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     seatFare: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     mealFare: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     baggageFare: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     // =================================================
//     // PAYMENT
//     // =================================================

//     paymentMethod: {
//       type: String,
//       default: "upi",
//       trim: true,
//     },

//     paymentStatus: {
//       type: String,

//       enum: [
//         "Pending",
//         "Paid",
//         "Failed",
//       ],

//       default: "Pending",
//     },

//     paymentId: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     orderId: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     // =================================================
//     // PRICE
//     // =================================================

//     price: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     total: {
//       type: Number,
//       required: true,
//       default: 0,
//       min: 0,
//     },

//     finalPrice: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     discount: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     // =================================================
//     // TAXES
//     // =================================================

//     taxes: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     // =================================================
//     // CONVENIENCE FEE
//     // =================================================

//     convenienceFee: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     // =================================================
//     // BOOKING STATUS
//     // =================================================

//     bookingStatus: {
//       type: String,

//       enum: [
//         "Pending",
//         "Confirmed",
//         "Cancelled",
//         "Completed",
//       ],

//       default: "Pending",
//     },

//     // =================================================
//     // OLD STATUS COMPATIBILITY
//     // =================================================

//     status: {
//       type: String,
//       default: "Confirmed",
//       trim: true,
//     },

//     // =================================================
//     // CANCELLATION
//     // =================================================

//     cancellationReason: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     cancelledAt: {
//       type: Date,
//       default: null,
//     },
//   },

//   {
//     timestamps: true,

//     strict: false,
//   }
// );

// // =====================================================
// // VIRTUAL TOTAL PASSENGERS
// // =====================================================

// bookingSchema.virtual(
//   "calculatedPassengers"
// ).get(function () {
//   return (
//     Number(this.adults || 0) +
//     Number(this.children || 0) +
//     Number(this.infants || 0)
//   );
// });

// // =====================================================
// // JSON VIRTUALS
// // =====================================================

// bookingSchema.set("toJSON", {
//   virtuals: true,
// });

// bookingSchema.set("toObject", {
//   virtuals: true,
// });

// // =====================================================
// // MODEL
// // =====================================================

// const Booking = mongoose.model(
//   "Booking",
//   bookingSchema
// );

// // =====================================================
// // REMOVE OLD UNIQUE PNR INDEX
// // =====================================================
// // IMPORTANT:
// // Pehle pnr unique:true tha, isliye MongoDB me pnr_1
// // unique index bana hua ho sakta hai.
// //
// // Ab same PNR multiple tickets/bookings me allowed hai.
// // =====================================================

// (async () => {
//   try {
//     const indexes =
//       await Booking.collection.indexes();

//     const oldPNRIndex =
//       indexes.find(
//         (index) =>
//           index.name === "pnr_1"
//       );

//     if (oldPNRIndex) {
//       await Booking.collection.dropIndex(
//         "pnr_1"
//       );

//       console.log(
//         "SUCCESS: Old unique PNR index pnr_1 removed."
//       );
//     }
//   } catch (error) {
//     console.error(
//       "PNR INDEX CHECK ERROR:",
//       error.message
//     );
//   }
// })();

// module.exports = Booking;


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