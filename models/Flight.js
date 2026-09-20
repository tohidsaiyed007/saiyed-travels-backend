

// // // const mongoose = require("mongoose");

// // // // =====================================================
// // // // INDIVIDUAL TICKET / PNR SCHEMA
// // // // =====================================================

// // // const ticketSchema = new mongoose.Schema(
// // //   {
// // //     // Airline ka original PNR
// // //     pnr: {
// // //       type: String,
// // //       required: true,
// // //       trim: true,
// // //       uppercase: true,
// // //     },

// // //     // Ticket availability
// // //     status: {
// // //       type: String,
// // //       enum: [
// // //         "Available",
// // //         "Booked",
// // //         "Cancelled",
// // //       ],
// // //       default: "Available",
// // //     },

// // //     // Booking hone ke baad fill hoga
// // //     bookingId: {
// // //       type: String,
// // //       default: "",
// // //       trim: true,
// // //     },

// // //     passengerName: {
// // //       type: String,
// // //       default: "",
// // //       trim: true,
// // //     },

// // //     bookedAt: {
// // //       type: Date,
// // //       default: null,
// // //     },
// // //   },
// // //   {
// // //     _id: true,
// // //   }
// // // );


// // // // =====================================================
// // // // CABIN SCHEMA
// // // // =====================================================

// // // const cabinSchema = new mongoose.Schema(
// // //   {
// // //     name: {
// // //       type: String,
// // //       enum: [
// // //         "Economy",
// // //         "Premium Economy",
// // //         "Business",
// // //         "First Class",
// // //       ],
// // //       required: true,
// // //     },

// // //     totalSeats: {
// // //       type: Number,
// // //       required: true,
// // //       min: 0,
// // //     },

// // //     availableSeats: {
// // //       type: Number,
// // //       required: true,
// // //       min: 0,
// // //     },

// // //     price: {
// // //       type: Number,
// // //       required: true,
// // //       min: 0,
// // //     },

// // //     baggage: {
// // //       type: String,
// // //       default: "15 KG",
// // //       trim: true,
// // //     },
// // //   },
// // //   {
// // //     _id: false,
// // //   }
// // // );


// // // // =====================================================
// // // // FLIGHT SCHEMA
// // // // =====================================================

// // // const flightSchema = new mongoose.Schema(
// // //   {
// // //     // =================================================
// // //     // BASIC INFORMATION
// // //     // =================================================

// // //     airline: {
// // //       type: String,
// // //       required: true,
// // //       trim: true,
// // //     },

// // //     // Automatic airline logo
// // //     logo: {
// // //       type: String,
// // //       default: "",
// // //       trim: true,
// // //     },

// // //     flightNo: {
// // //       type: String,
// // //       required: true,
// // //       unique: true,
// // //       trim: true,
// // //       uppercase: true,
// // //     },

// // //     flightType: {
// // //       type: String,
// // //       enum: [
// // //         "Domestic",
// // //         "International",
// // //       ],
// // //       required: true,
// // //       default: "Domestic",
// // //     },

// // //     aircraft: {
// // //       type: String,
// // //       required: true,
// // //       trim: true,
// // //     },


// // //     // =================================================
// // //     // ROUTE
// // //     // =================================================

// // //     fromCity: {
// // //       type: String,
// // //       required: true,
// // //       trim: true,
// // //     },

// // //     fromAirport: {
// // //       type: String,
// // //       required: true,
// // //       trim: true,
// // //     },

// // //     fromCode: {
// // //       type: String,
// // //       required: true,
// // //       trim: true,
// // //       uppercase: true,
// // //     },

// // //     toCity: {
// // //       type: String,
// // //       required: true,
// // //       trim: true,
// // //     },

// // //     toAirport: {
// // //       type: String,
// // //       required: true,
// // //       trim: true,
// // //     },

// // //     toCode: {
// // //       type: String,
// // //       required: true,
// // //       trim: true,
// // //       uppercase: true,
// // //     },


// // //     // =================================================
// // //     // DEPARTURE
// // //     // =================================================

// // //     departureDate: {
// // //       type: String,
// // //       required: true,
// // //     },

// // //     departureTime: {
// // //       type: String,
// // //       required: true,
// // //     },

// // //     departureTerminal: {
// // //       type: String,
// // //       default: "",
// // //       trim: true,
// // //     },


// // //     // =================================================
// // //     // ARRIVAL
// // //     // =================================================

// // //     arrivalDate: {
// // //       type: String,
// // //       required: true,
// // //     },

// // //     arrivalTime: {
// // //       type: String,
// // //       required: true,
// // //     },

// // //     arrivalTerminal: {
// // //       type: String,
// // //       default: "",
// // //       trim: true,
// // //     },


// // //     // =================================================
// // //     // FLIGHT DETAILS
// // //     // =================================================

// // //     duration: {
// // //       type: String,
// // //       required: true,
// // //       trim: true,
// // //     },

// // //     stops: {
// // //       type: String,
// // //       enum: [
// // //         "Non-stop",
// // //         "1 Stop",
// // //         "2 Stops",
// // //       ],
// // //       default: "Non-stop",
// // //     },

// // //     stopAirport: {
// // //       type: String,
// // //       default: "",
// // //       trim: true,
// // //     },

// // //     stopCity: {
// // //       type: String,
// // //       default: "",
// // //       trim: true,
// // //     },

// // //     layoverDuration: {
// // //       type: String,
// // //       default: "",
// // //       trim: true,
// // //     },


// // //     // =================================================
// // //     // CABINS
// // //     // =================================================

// // //     cabins: {
// // //       type: [cabinSchema],
// // //       required: true,

// // //       validate: {
// // //         validator: function (value) {
// // //           return (
// // //             value &&
// // //             value.length > 0
// // //           );
// // //         },

// // //         message:
// // //           "At least one cabin is required.",
// // //       },
// // //     },


// // //     // =================================================
// // //     // PRICING
// // //     // =================================================

// // //     baseFare: {
// // //       type: Number,
// // //       default: 0,
// // //       min: 0,
// // //     },

// // //     taxes: {
// // //       type: Number,
// // //       default: 0,
// // //       min: 0,
// // //     },

// // //     airportCharges: {
// // //       type: Number,
// // //       default: 0,
// // //       min: 0,
// // //     },

// // //     serviceFee: {
// // //       type: Number,
// // //       default: 0,
// // //       min: 0,
// // //     },

// // //     discount: {
// // //       type: Number,
// // //       default: 0,
// // //       min: 0,
// // //     },

// // //     finalPrice: {
// // //       type: Number,
// // //       required: true,
// // //       min: 0,
// // //     },

// // //     currency: {
// // //       type: String,
// // //       default: "INR",
// // //       trim: true,
// // //     },


// // //     // =================================================
// // //     // BAGGAGE
// // //     // =================================================

// // //     cabinBaggage: {
// // //       type: String,
// // //       default: "7 KG",
// // //       trim: true,
// // //     },

// // //     checkinBaggage: {
// // //       type: String,
// // //       default: "15 KG",
// // //       trim: true,
// // //     },

// // //     extraBaggagePrice: {
// // //       type: Number,
// // //       default: 0,
// // //       min: 0,
// // //     },


// // //     // =================================================
// // //     // SERVICES
// // //     // =================================================

// // //     mealAvailable: {
// // //       type: Boolean,
// // //       default: false,
// // //     },

// // //     wifiAvailable: {
// // //       type: Boolean,
// // //       default: false,
// // //     },

// // //     entertainmentAvailable: {
// // //       type: Boolean,
// // //       default: false,
// // //     },

// // //     powerAvailable: {
// // //       type: Boolean,
// // //       default: false,
// // //     },


// // //     // =================================================
// // //     // BOOKING
// // //     // =================================================

// // //     bookingStartDate: {
// // //       type: String,
// // //       default: "",
// // //     },

// // //     bookingClosingDate: {
// // //       type: String,
// // //       default: "",
// // //     },

// // //     refundable: {
// // //       type: Boolean,
// // //       default: false,
// // //     },

// // //     changeable: {
// // //       type: Boolean,
// // //       default: false,
// // //     },


// // //     // =================================================
// // //     // INDIVIDUAL TICKETS / PNR
// // //     // =================================================

// // //     tickets: {
// // //       type: [ticketSchema],
// // //       default: [],
// // //     },


// // //     // =================================================
// // //     // STATUS
// // //     // =================================================

// // //     status: {
// // //       type: String,
// // //       enum: [
// // //         "Scheduled",
// // //         "Delayed",
// // //         "Cancelled",
// // //         "Boarding",
// // //         "Departed",
// // //         "Arrived",
// // //       ],
// // //       default: "Scheduled",
// // //     },

// // //     description: {
// // //       type: String,
// // //       default: "",
// // //       trim: true,
// // //     },

// // //     specialInstructions: {
// // //       type: String,
// // //       default: "",
// // //       trim: true,
// // //     },
// // //   },

// // //   {
// // //     timestamps: true,
// // //   }
// // // );


// // // // =====================================================
// // // // AUTOMATIC TICKET COUNTS
// // // // =====================================================

// // // flightSchema.virtual(
// // //   "totalTickets"
// // // ).get(function () {

// // //   return this.tickets.length;

// // // });


// // // flightSchema.virtual(
// // //   "availableTickets"
// // // ).get(function () {

// // //   return this.tickets.filter(
// // //     (ticket) =>
// // //       ticket.status ===
// // //       "Available"
// // //   ).length;

// // // });


// // // flightSchema.virtual(
// // //   "bookedTickets"
// // // ).get(function () {

// // //   return this.tickets.filter(
// // //     (ticket) =>
// // //       ticket.status ===
// // //       "Booked"
// // //   ).length;

// // // });


// // // flightSchema.virtual(
// // //   "cancelledTickets"
// // // ).get(function () {

// // //   return this.tickets.filter(
// // //     (ticket) =>
// // //       ticket.status ===
// // //       "Cancelled"
// // //   ).length;

// // // });


// // // // =====================================================
// // // // JSON VIRTUALS
// // // // =====================================================

// // // flightSchema.set(
// // //   "toJSON",
// // //   {
// // //     virtuals: true,
// // //   }
// // // );

// // // flightSchema.set(
// // //   "toObject",
// // //   {
// // //     virtuals: true,
// // //   }
// // // );


// // // // =====================================================
// // // // MODEL
// // // // =====================================================

// // // module.exports =
// // //   mongoose.model(
// // //     "Flight",
// // //     flightSchema
// // //   );



// // const mongoose = require("mongoose");

// // // =====================================================
// // // INDIVIDUAL TICKET / PNR SCHEMA
// // // =====================================================

// // const ticketSchema = new mongoose.Schema(
// //   {
// //     // Airline ka original PNR
// //     pnr: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //       uppercase: true,
// //     },

// //     // Ticket availability
// //     status: {
// //       type: String,
// //       enum: [
// //         "Available",
// //         "Booked",
// //         "Cancelled",
// //       ],
// //       default: "Available",
// //     },

// //     // Booking hone ke baad fill hoga
// //     bookingId: {
// //       type: String,
// //       default: "",
// //       trim: true,
// //       uppercase: true,
// //     },

// //     // Booking ke baad first passenger ka naam
// //     passengerName: {
// //       type: String,
// //       default: "",
// //       trim: true,
// //     },

// //     // Booking date/time
// //     bookedAt: {
// //       type: Date,
// //       default: null,
// //     },
// //   },
// //   {
// //     _id: true,
// //   }
// // );


// // // =====================================================
// // // CABIN SCHEMA
// // // =====================================================

// // const cabinSchema = new mongoose.Schema(
// //   {
// //     name: {
// //       type: String,

// //       enum: [
// //         "Economy",
// //         "Premium Economy",
// //         "Business",
// //         "First Class",
// //       ],

// //       required: true,
// //     },

// //     totalSeats: {
// //       type: Number,
// //       required: true,
// //       min: 0,
// //     },

// //     availableSeats: {
// //       type: Number,
// //       required: true,
// //       min: 0,
// //     },

// //     price: {
// //       type: Number,
// //       required: true,
// //       min: 0,
// //     },

// //     baggage: {
// //       type: String,
// //       default: "15 KG",
// //       trim: true,
// //     },
// //   },
// //   {
// //     _id: false,
// //   }
// // );


// // // =====================================================
// // // FLIGHT SCHEMA
// // // =====================================================

// // const flightSchema = new mongoose.Schema(
// //   {
// //     // =================================================
// //     // BASIC INFORMATION
// //     // =================================================

// //     airline: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },

// //     // Airline logo URL
// //     logo: {
// //       type: String,
// //       default: "",
// //       trim: true,
// //     },

// //     flightNo: {
// //       type: String,
// //       required: true,
// //       unique: true,
// //       trim: true,
// //       uppercase: true,
// //     },

// //     flightType: {
// //       type: String,

// //       enum: [
// //         "Domestic",
// //         "International",
// //       ],

// //       required: true,

// //       default: "Domestic",
// //     },

// //     aircraft: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },


// //     // =================================================
// //     // ROUTE
// //     // =================================================

// //     fromCity: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },

// //     fromAirport: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },

// //     fromCode: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //       uppercase: true,
// //     },

// //     toCity: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },

// //     toAirport: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },

// //     toCode: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //       uppercase: true,
// //     },


// //     // =================================================
// //     // DEPARTURE
// //     // =================================================

// //     departureDate: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },

// //     departureTime: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },

// //     departureTerminal: {
// //       type: String,
// //       default: "",
// //       trim: true,
// //     },


// //     // =================================================
// //     // ARRIVAL
// //     // =================================================

// //     arrivalDate: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },

// //     arrivalTime: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },

// //     arrivalTerminal: {
// //       type: String,
// //       default: "",
// //       trim: true,
// //     },


// //     // =================================================
// //     // FLIGHT DETAILS
// //     // =================================================

// //     duration: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },

// //     stops: {
// //       type: String,

// //       enum: [
// //         "Non-stop",
// //         "1 Stop",
// //         "2 Stops",
// //       ],

// //       default: "Non-stop",
// //     },

// //     stopAirport: {
// //       type: String,
// //       default: "",
// //       trim: true,
// //     },

// //     stopCity: {
// //       type: String,
// //       default: "",
// //       trim: true,
// //     },

// //     layoverDuration: {
// //       type: String,
// //       default: "",
// //       trim: true,
// //     },


// //     // =================================================
// //     // CABINS
// //     // =================================================

// //     cabins: {
// //       type: [cabinSchema],

// //       required: true,

// //       validate: {
// //         validator: function (value) {
// //           return (
// //             Array.isArray(value) &&
// //             value.length > 0
// //           );
// //         },

// //         message:
// //           "At least one cabin is required.",
// //       },
// //     },


// //     // =================================================
// //     // PRICING
// //     // =================================================

// //     baseFare: {
// //       type: Number,
// //       default: 0,
// //       min: 0,
// //     },

// //     taxes: {
// //       type: Number,
// //       default: 0,
// //       min: 0,
// //     },

// //     airportCharges: {
// //       type: Number,
// //       default: 0,
// //       min: 0,
// //     },

// //     serviceFee: {
// //       type: Number,
// //       default: 0,
// //       min: 0,
// //     },

// //     discount: {
// //       type: Number,
// //       default: 0,
// //       min: 0,
// //     },

// //     // =================================================
// //     // CUSTOMER KO DIKHNE WALA FINAL FLIGHT PRICE
// //     // =================================================

// //     finalPrice: {
// //       type: Number,
// //       required: true,
// //       min: 0,
// //     },

// //     currency: {
// //       type: String,
// //       default: "INR",
// //       trim: true,
// //       uppercase: true,
// //     },


// //     // =================================================
// //     // BAGGAGE
// //     // =================================================

// //     cabinBaggage: {
// //       type: String,
// //       default: "7 KG",
// //       trim: true,
// //     },

// //     checkinBaggage: {
// //       type: String,
// //       default: "15 KG",
// //       trim: true,
// //     },

// //     extraBaggagePrice: {
// //       type: Number,
// //       default: 0,
// //       min: 0,
// //     },


// //     // =================================================
// //     // SERVICES
// //     // =================================================

// //     mealAvailable: {
// //       type: Boolean,
// //       default: false,
// //     },

// //     wifiAvailable: {
// //       type: Boolean,
// //       default: false,
// //     },

// //     entertainmentAvailable: {
// //       type: Boolean,
// //       default: false,
// //     },

// //     powerAvailable: {
// //       type: Boolean,
// //       default: false,
// //     },


// //     // =================================================
// //     // BOOKING WINDOW
// //     // =================================================

// //     bookingStartDate: {
// //       type: String,
// //       default: "",
// //       trim: true,
// //     },

// //     bookingClosingDate: {
// //       type: String,
// //       default: "",
// //       trim: true,
// //     },

// //     refundable: {
// //       type: Boolean,
// //       default: false,
// //     },

// //     changeable: {
// //       type: Boolean,
// //       default: false,
// //     },


// //     // =================================================
// //     // INDIVIDUAL AIRLINE TICKETS / PNR
// //     // =================================================

// //     tickets: {
// //       type: [ticketSchema],
// //       default: [],
// //     },


// //     // =================================================
// //     // FLIGHT STATUS
// //     // =================================================

// //     status: {
// //       type: String,

// //       enum: [
// //         "Scheduled",
// //         "Delayed",
// //         "Cancelled",
// //         "Boarding",
// //         "Departed",
// //         "Arrived",
// //       ],

// //       default: "Scheduled",
// //     },

// //     description: {
// //       type: String,
// //       default: "",
// //       trim: true,
// //     },

// //     specialInstructions: {
// //       type: String,
// //       default: "",
// //       trim: true,
// //     },
// //   },

// //   {
// //     timestamps: true,
// //   }
// // );


// // // =====================================================
// // // TICKET COUNTS
// // // =====================================================

// // flightSchema.virtual(
// //   "totalTickets"
// // ).get(function () {

// //   return Array.isArray(this.tickets)
// //     ? this.tickets.length
// //     : 0;

// // });


// // flightSchema.virtual(
// //   "availableTickets"
// // ).get(function () {

// //   if (!Array.isArray(this.tickets)) {
// //     return 0;
// //   }

// //   return this.tickets.filter(
// //     (ticket) =>
// //       ticket.status ===
// //       "Available"
// //   ).length;

// // });


// // flightSchema.virtual(
// //   "bookedTickets"
// // ).get(function () {

// //   if (!Array.isArray(this.tickets)) {
// //     return 0;
// //   }

// //   return this.tickets.filter(
// //     (ticket) =>
// //       ticket.status ===
// //       "Booked"
// //   ).length;

// // });


// // flightSchema.virtual(
// //   "cancelledTickets"
// // ).get(function () {

// //   if (!Array.isArray(this.tickets)) {
// //     return 0;
// //   }

// //   return this.tickets.filter(
// //     (ticket) =>
// //       ticket.status ===
// //       "Cancelled"
// //   ).length;

// // });


// // // =====================================================
// // // AVAILABLE TICKET COUNT
// // // =====================================================

// // flightSchema.virtual(
// //   "hasAvailableTicket"
// // ).get(function () {

// //   if (!Array.isArray(this.tickets)) {
// //     return false;
// //   }

// //   return this.tickets.some(
// //     (ticket) =>
// //       ticket.status ===
// //       "Available"
// //   );

// // });


// // // =====================================================
// // // JSON VIRTUALS
// // // =====================================================

// // flightSchema.set(
// //   "toJSON",
// //   {
// //     virtuals: true,
// //   }
// // );


// // flightSchema.set(
// //   "toObject",
// //   {
// //     virtuals: true,
// //   }
// // );


// // // =====================================================
// // // MODEL
// // // =====================================================

// // module.exports =
// //   mongoose.model(
// //     "Flight",
// //     flightSchema
// //   );



// const mongoose = require("mongoose");

// // =====================================================
// // INDIVIDUAL TICKET / PNR SCHEMA
// // =====================================================

// const ticketSchema = new mongoose.Schema(
//   {
//     // Airline ka original PNR
//     pnr: {
//       type: String,
//       required: true,
//       trim: true,
//       uppercase: true,
//     },

//     // Ticket availability
//     status: {
//       type: String,
//       enum: [
//         "Available",
//         "Booked",
//         "Cancelled",
//       ],
//       default: "Available",
//     },

//     // Booking hone ke baad fill hoga
//     bookingId: {
//       type: String,
//       default: "",
//       trim: true,
//       uppercase: true,
//     },

//     // Booking ke baad first passenger ka naam
//     passengerName: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     // Booking date/time
//     bookedAt: {
//       type: Date,
//       default: null,
//     },
//   },
//   {
//     _id: true,
//   }
// );


// // =====================================================
// // CABIN SCHEMA
// // =====================================================

// const cabinSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       enum: [
//         "Economy",
//         "Premium Economy",
//         "Business",
//         "First Class",
//       ],
//       required: true,
//     },

//     totalSeats: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     availableSeats: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     baggage: {
//       type: String,
//       default: "15 KG",
//       trim: true,
//     },
//   },
//   {
//     _id: false,
//   }
// );


// // =====================================================
// // FLIGHT SCHEMA
// // =====================================================

// const flightSchema = new mongoose.Schema(
//   {
//     // =================================================
//     // BASIC INFORMATION
//     // =================================================

//     airline: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     // Airline logo URL
//     logo: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     flightNo: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       uppercase: true,
//     },

//     flightType: {
//       type: String,
//       enum: [
//         "Domestic",
//         "International",
//       ],
//       required: true,
//       default: "Domestic",
//     },

//     aircraft: {
//       type: String,
//       required: true,
//       trim: true,
//     },


//     // =================================================
//     // ROUTE
//     // =================================================

//     fromCity: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     fromAirport: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     fromCode: {
//       type: String,
//       required: true,
//       trim: true,
//       uppercase: true,
//     },

//     toCity: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     toAirport: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     toCode: {
//       type: String,
//       required: true,
//       trim: true,
//       uppercase: true,
//     },


//     // =================================================
//     // DEPARTURE
//     // =================================================

//     departureDate: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     departureTime: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     departureTerminal: {
//       type: String,
//       default: "",
//       trim: true,
//     },


//     // =================================================
//     // ARRIVAL
//     // =================================================

//     arrivalDate: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     arrivalTime: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     arrivalTerminal: {
//       type: String,
//       default: "",
//       trim: true,
//     },


//     // =================================================
//     // FLIGHT DETAILS
//     // =================================================

//     duration: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     stops: {
//       type: String,
//       enum: [
//         "Non-stop",
//         "1 Stop",
//         "2 Stops",
//       ],
//       default: "Non-stop",
//     },

//     stopAirport: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     stopCity: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     layoverDuration: {
//       type: String,
//       default: "",
//       trim: true,
//     },


//     // =================================================
//     // CABINS
//     // =================================================

//     cabins: {
//       type: [cabinSchema],

//       required: true,

//       validate: {
//         validator: function (value) {
//           return (
//             Array.isArray(value) &&
//             value.length > 0
//           );
//         },

//         message:
//           "At least one cabin is required.",
//       },
//     },


//     // =================================================
//     // PRICING
//     // =================================================

//     // -----------------------------------------------
//     // ADULT FARE
//     // -----------------------------------------------

//     adultFare: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     // -----------------------------------------------
//     // CHILD FARE
//     // -----------------------------------------------

//     childFare: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     // -----------------------------------------------
//     // INFANT FARE
//     // -----------------------------------------------

//     infantFare: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },


//     // -----------------------------------------------
//     // OLD / GENERAL FARE FIELDS
//     // -----------------------------------------------

//     baseFare: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     taxes: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     airportCharges: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     serviceFee: {
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
//     // MEAL PRICING
//     // =================================================

//     adultMealPrice: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     childMealPrice: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     infantMealPrice: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },


//     // =================================================
//     // BAGGAGE PRICING
//     // =================================================

//     adultBaggagePrice: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     childBaggagePrice: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     infantBaggagePrice: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },


//     // =================================================
//     // SEAT PRICING
//     // =================================================

//     adultSeatPrice: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     childSeatPrice: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     infantSeatPrice: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },


//     // =================================================
//     // CUSTOMER KO DIKHNE WALA FINAL FLIGHT PRICE
//     // =================================================

//     finalPrice: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     currency: {
//       type: String,
//       default: "INR",
//       trim: true,
//       uppercase: true,
//     },


//     // =================================================
//     // BAGGAGE
//     // =================================================

//     cabinBaggage: {
//       type: String,
//       default: "7 KG",
//       trim: true,
//     },

//     checkinBaggage: {
//       type: String,
//       default: "15 KG",
//       trim: true,
//     },

//     extraBaggagePrice: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },


//     // =================================================
//     // SERVICES
//     // =================================================

//     mealAvailable: {
//       type: Boolean,
//       default: false,
//     },

//     wifiAvailable: {
//       type: Boolean,
//       default: false,
//     },

//     entertainmentAvailable: {
//       type: Boolean,
//       default: false,
//     },

//     powerAvailable: {
//       type: Boolean,
//       default: false,
//     },


//     // =================================================
//     // BOOKING WINDOW
//     // =================================================

//     bookingStartDate: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     bookingClosingDate: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     refundable: {
//       type: Boolean,
//       default: false,
//     },

//     changeable: {
//       type: Boolean,
//       default: false,
//     },


//     // =================================================
//     // INDIVIDUAL AIRLINE TICKETS / PNR
//     // =================================================

//     tickets: {
//       type: [ticketSchema],
//       default: [],
//     },


//     // =================================================
//     // FLIGHT STATUS
//     // =================================================

//     status: {
//       type: String,
//       enum: [
//         "Scheduled",
//         "Delayed",
//         "Cancelled",
//         "Boarding",
//         "Departed",
//         "Arrived",
//       ],
//       default: "Scheduled",
//     },

//     description: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     specialInstructions: {
//       type: String,
//       default: "",
//       trim: true,
//     },
//   },

//   {
//     timestamps: true,
//   }
// );


// // =====================================================
// // TICKET COUNTS
// // =====================================================

// flightSchema.virtual(
//   "totalTickets"
// ).get(function () {

//   return Array.isArray(this.tickets)
//     ? this.tickets.length
//     : 0;

// });


// flightSchema.virtual(
//   "availableTickets"
// ).get(function () {

//   if (!Array.isArray(this.tickets)) {
//     return 0;
//   }

//   return this.tickets.filter(
//     (ticket) =>
//       ticket.status ===
//       "Available"
//   ).length;

// });


// flightSchema.virtual(
//   "bookedTickets"
// ).get(function () {

//   if (!Array.isArray(this.tickets)) {
//     return 0;
//   }

//   return this.tickets.filter(
//     (ticket) =>
//       ticket.status ===
//       "Booked"
//   ).length;

// });


// flightSchema.virtual(
//   "cancelledTickets"
// ).get(function () {

//   if (!Array.isArray(this.tickets)) {
//     return 0;
//   }

//   return this.tickets.filter(
//     (ticket) =>
//       ticket.status ===
//       "Cancelled"
//   ).length;

// });


// // =====================================================
// // AVAILABLE TICKET COUNT
// // =====================================================

// flightSchema.virtual(
//   "hasAvailableTicket"
// ).get(function () {

//   if (!Array.isArray(this.tickets)) {
//     return false;
//   }

//   return this.tickets.some(
//     (ticket) =>
//       ticket.status ===
//       "Available"
//   );

// });


// // =====================================================
// // JSON VIRTUALS
// // =====================================================

// flightSchema.set(
//   "toJSON",
//   {
//     virtuals: true,
//   }
// );


// flightSchema.set(
//   "toObject",
//   {
//     virtuals: true,
//   }
// );


// // =====================================================
// // MODEL
// // =====================================================

// module.exports =
//   mongoose.model(
//     "Flight",
//     flightSchema
//   );



const mongoose = require("mongoose");

// =====================================================
// INDIVIDUAL TICKET / PNR SCHEMA
// =====================================================

const ticketSchema = new mongoose.Schema(
  {
    pnr: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    status: {
      type: String,
      enum: [
        "Available",
        "Booked",
        "Cancelled",
      ],
      default: "Available",
    },

    bookingId: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    passengerName: {
      type: String,
      default: "",
      trim: true,
    },

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

    // =================================================
    // CUSTOMER CABIN PRICE
    // =================================================

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // =================================================
    // AGENT CABIN PRICE
    // =================================================

    agentPrice: {
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
    // OLD / COMPATIBILITY BAGGAGE
    // =================================================

    baggage: {
      type: String,
      default: "",
      trim: true,
    },

    // =================================================
    // FARE DETAILS
    // =================================================

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
  },
  {
    _id: false,
  }
);

// // =====================================================
// // CABIN SCHEMA
// // =====================================================

// const cabinSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       enum: [
//         "Economy",
//         "Premium Economy",
//         "Business",
//         "First Class",
//       ],
//       required: true,
//     },

//     totalSeats: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     availableSeats: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     // Admin-defined baggage
//     baggage: {
//       type: String,
//       default: "",
//       trim: true,
//     },
//   },
//   {
//     _id: false,
//   }
// );

// =====================================================
// STOP SCHEMA
// =====================================================

const stopSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      default: "",
      trim: true,
    },

    airport: {
      type: String,
      default: "",
      trim: true,
    },

    airportCode: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    terminal: {
      type: String,
      default: "",
      trim: true,
    },

    arrivalTime: {
      type: String,
      default: "",
      trim: true,
    },

    departureTime: {
      type: String,
      default: "",
      trim: true,
    },

    layoverDuration: {
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

    airlineName: {
      type: String,
      default: "",
      trim: true,
    },

    logo: {
      type: String,
      default: "",
      trim: true,
    },

    airlineLogo: {
      type: String,
      default: "",
      trim: true,
    },

    flightNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    flightNumber: {
      type: String,
      default: "",
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

    route: {
      type: String,
      default: "",
      trim: true,
    },

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

    fromTerminal: {
      type: String,
      default: "",
      trim: true,
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

    toTerminal: {
      type: String,
      default: "",
      trim: true,
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
        "3 Stops",
      ],
      default: "Non-stop",
    },

    // Main stop details
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

    stopAirportCode: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    stopTerminal: {
      type: String,
      default: "",
      trim: true,
    },

    layoverDuration: {
      type: String,
      default: "",
      trim: true,
    },

    // Multiple stops support
    stopDetails: {
      type: [stopSchema],
      default: [],
    },

    // =================================================
    // CABINS
    // =================================================

    cabins: {
      type: [cabinSchema],
      default: [],
    },

    // =================================================
    // TICKET INVENTORY
    // =================================================

    ticketInventory: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =================================================
    // GROUP / AIRLINE PNR
    // =================================================

    pnr: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    // =================================================
    // CUSTOMER PRICING
    // =================================================

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
    // AGENT PRICING
    // IMPORTANT:
    // CUSTOMER KO YE PRICE NAHI DIKHANA HAI.
    // AGENT LOGIN PAR AGENT FARE USE HOGA.
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
    // OLD / GENERAL FARE FIELDS
    // =================================================

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
    // FINAL CUSTOMER PRICE
    // =================================================

    finalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      trim: true,
      uppercase: true,
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
    // ADMIN-DEFINED BAGGAGE ALLOWANCE
    // =================================================

    cabinBaggage: {
      type: String,
      default: "",
      trim: true,
    },

    checkinBaggage: {
      type: String,
      default: "",
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
    // BOOKING RULES
    // =================================================

    bookingRules: {
      type: String,
      default: "",
      trim: true,
    },

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
      ticket.status === "Booked"
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
// AVAILABLE TICKET
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

flightSchema.set("toJSON", {
  virtuals: true,
});

flightSchema.set("toObject", {
  virtuals: true,
});

// =====================================================
// MODEL
// =====================================================

module.exports =
  mongoose.model(
    "Flight",
    flightSchema
  );