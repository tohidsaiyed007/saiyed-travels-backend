// // const Flight = require("../models/Flight");


// // // =====================================================
// // // HELPER FUNCTIONS
// // // =====================================================

// // const toNumber = (value, defaultValue = 0) => {
// //   if (value === undefined || value === null || value === "") {
// //     return defaultValue;
// //   }

// //   const number = Number(value);

// //   return Number.isFinite(number)
// //     ? number
// //     : defaultValue;
// // };


// // const toBoolean = (value, defaultValue = false) => {
// //   if (value === undefined || value === null) {
// //     return defaultValue;
// //   }

// //   if (typeof value === "boolean") {
// //     return value;
// //   }

// //   if (value === "true") {
// //     return true;
// //   }

// //   if (value === "false") {
// //     return false;
// //   }

// //   return Boolean(value);
// // };


// // const normalizePNR = (pnr) => {
// //   return String(pnr || "")
// //     .trim()
// //     .toUpperCase();
// // };


// // // =====================================================
// // // PREPARE TICKETS
// // // =====================================================

// // const prepareTickets = (tickets = []) => {

// //   if (!Array.isArray(tickets)) {
// //     return [];
// //   }

// //   return tickets
// //     .map((ticket) => {

// //       // ---------------------------------------------
// //       // Agar frontend simple PNR string bheje
// //       // ---------------------------------------------

// //       if (typeof ticket === "string") {

// //         const pnr = normalizePNR(ticket);

// //         if (!pnr) {
// //           return null;
// //         }

// //         return {
// //           pnr,
// //           status: "Available",
// //           bookingId: "",
// //           passengerName: "",
// //           bookedAt: null,
// //         };
// //       }


// //       // ---------------------------------------------
// //       // Agar object bheja gaya hai
// //       // ---------------------------------------------

// //       const pnr =
// //         normalizePNR(
// //           ticket?.pnr
// //         );

// //       if (!pnr) {
// //         return null;
// //       }

// //       return {
// //         pnr,

// //         status:
// //           ticket.status || "Available",

// //         bookingId:
// //           ticket.bookingId || "",

// //         passengerName:
// //           ticket.passengerName || "",

// //         bookedAt:
// //           ticket.bookedAt || null,
// //       };

// //     })
// //     .filter(Boolean);

// // };


// // // =====================================================
// // // VALIDATE TICKETS
// // // =====================================================

// // const validateTickets = (tickets) => {

// //   if (!Array.isArray(tickets)) {
// //     return {
// //       valid: false,
// //       message: "Tickets must be an array.",
// //     };
// //   }


// //   if (tickets.length === 0) {
// //     return {
// //       valid: false,
// //       message:
// //         "At least one PNR ticket is required.",
// //     };
// //   }


// //   const pnrList =
// //     tickets.map(
// //       (ticket) => ticket.pnr
// //     );


// //   const uniquePNRs =
// //     new Set(pnrList);


// //   if (
// //     uniquePNRs.size !==
// //     pnrList.length
// //   ) {

// //     return {
// //       valid: false,
// //       message:
// //         "Duplicate PNR numbers are not allowed.",
// //     };

// //   }


// //   return {
// //     valid: true,
// //   };

// // };


// // // =====================================================
// // // VALIDATE CABINS
// // // =====================================================

// // const prepareCabins = (cabins = []) => {

// //   if (!Array.isArray(cabins)) {
// //     return [];
// //   }

// //   return cabins.map(
// //     (cabin) => ({

// //       name:
// //         cabin.name || "Economy",

// //       totalSeats:
// //         toNumber(
// //           cabin.totalSeats
// //         ),

// //       availableSeats:
// //         toNumber(
// //           cabin.availableSeats
// //         ),

// //       price:
// //         toNumber(
// //           cabin.price
// //         ),

// //       baggage:
// //         cabin.baggage ||
// //         "15 KG",

// //     })
// //   );

// // };


// // // =====================================================
// // // GET ALL FLIGHTS
// // // =====================================================

// // const getFlights = async (
// //   req,
// //   res
// // ) => {

// //   try {

// //     const flights =
// //       await Flight.find()
// //         .sort({
// //           departureDate: 1,
// //           departureTime: 1,
// //           createdAt: -1,
// //         });


// //     res.status(200).json({

// //       success: true,

// //       count:
// //         flights.length,

// //       flights,

// //     });


// //   } catch (error) {

// //     console.error(
// //       "Get Flights Error:",
// //       error
// //     );


// //     res.status(500).json({

// //       success: false,

// //       message:
// //         "Server error while fetching flights.",

// //     });

// //   }

// // };


// // // =====================================================
// // // GET SINGLE FLIGHT
// // // =====================================================

// // const getFlightById = async (
// //   req,
// //   res
// // ) => {

// //   try {

// //     const flight =
// //       await Flight.findById(
// //         req.params.id
// //       );


// //     if (!flight) {

// //       return res.status(404).json({

// //         success: false,

// //         message:
// //           "Flight not found.",

// //       });

// //     }


// //     res.status(200).json({

// //       success: true,

// //       flight,

// //     });


// //   } catch (error) {

// //     console.error(
// //       "Get Flight By ID Error:",
// //       error
// //     );


// //     res.status(500).json({

// //       success: false,

// //       message:
// //         "Server error while fetching flight.",

// //     });

// //   }

// // };


// // // =====================================================
// // // CREATE FLIGHT
// // // =====================================================

// // const createFlight = async (
// //   req,
// //   res
// // ) => {

// //   try {

// //     const {

// //       // =============================================
// //       // BASIC
// //       // =============================================

// //       airline,
// //       logo,
// //       flightNo,
// //       flightType,
// //       aircraft,


// //       // =============================================
// //       // ROUTE
// //       // =============================================

// //       fromCity,
// //       fromAirport,
// //       fromCode,

// //       toCity,
// //       toAirport,
// //       toCode,


// //       // =============================================
// //       // DEPARTURE
// //       // =============================================

// //       departureDate,
// //       departureTime,
// //       departureTerminal,


// //       // =============================================
// //       // ARRIVAL
// //       // =============================================

// //       arrivalDate,
// //       arrivalTime,
// //       arrivalTerminal,


// //       // =============================================
// //       // DETAILS
// //       // =============================================

// //       duration,
// //       stops,
// //       stopAirport,
// //       stopCity,
// //       layoverDuration,


// //       // =============================================
// //       // CABINS
// //       // =============================================

// //       cabins,


// //       // =============================================
// //       // GENERAL PRICING
// //       // =============================================

// //       baseFare,
// //       taxes,
// //       airportCharges,
// //       serviceFee,
// //       discount,
// //       finalPrice,
// //       currency,


// //       // =============================================
// //       // PASSENGER FARES
// //       // =============================================

// //       adultFare,
// //       childFare,
// //       infantFare,


// //       // =============================================
// //       // MEAL PRICES
// //       // =============================================

// //       adultMealPrice,
// //       childMealPrice,
// //       infantMealPrice,


// //       // =============================================
// //       // BAGGAGE PRICES
// //       // =============================================

// //       adultBaggagePrice,
// //       childBaggagePrice,
// //       infantBaggagePrice,


// //       // =============================================
// //       // SEAT PRICES
// //       // =============================================

// //       adultSeatPrice,
// //       childSeatPrice,
// //       infantSeatPrice,


// //       // =============================================
// //       // BAGGAGE
// //       // =============================================

// //       cabinBaggage,
// //       checkinBaggage,
// //       extraBaggagePrice,


// //       // =============================================
// //       // SERVICES
// //       // =============================================

// //       mealAvailable,
// //       wifiAvailable,
// //       entertainmentAvailable,
// //       powerAvailable,


// //       // =============================================
// //       // BOOKING
// //       // =============================================

// //       bookingStartDate,
// //       bookingClosingDate,
// //       refundable,
// //       changeable,


// //       // =============================================
// //       // TICKETS
// //       // =============================================

// //       tickets,


// //       // =============================================
// //       // STATUS
// //       // =============================================

// //       status,
// //       description,
// //       specialInstructions,

// //     } = req.body;


// //     // =================================================
// //     // REQUIRED FIELD VALIDATION
// //     // =================================================

// //     if (
// //       !airline ||
// //       !flightNo ||
// //       !aircraft ||
// //       !fromCity ||
// //       !fromAirport ||
// //       !fromCode ||
// //       !toCity ||
// //       !toAirport ||
// //       !toCode ||
// //       !departureDate ||
// //       !departureTime ||
// //       !arrivalDate ||
// //       !arrivalTime ||
// //       !duration
// //     ) {

// //       return res.status(400).json({

// //         success: false,

// //         message:
// //           "Please fill all required flight fields.",

// //       });

// //     }


// //     // =================================================
// //     // CHECK DUPLICATE FLIGHT NUMBER
// //     // =================================================

// //     const existingFlight =
// //       await Flight.findOne({
// //         flightNo:
// //           String(flightNo)
// //             .trim()
// //             .toUpperCase(),
// //       });


// //     if (existingFlight) {

// //       return res.status(409).json({

// //         success: false,

// //         message:
// //           "A flight with this flight number already exists.",

// //       });

// //     }


// //     // =================================================
// //     // PREPARE CABINS
// //     // =================================================

// //     const preparedCabins =
// //       prepareCabins(
// //         cabins
// //       );


// //     if (
// //       preparedCabins.length === 0
// //     ) {

// //       return res.status(400).json({

// //         success: false,

// //         message:
// //           "At least one cabin is required.",

// //       });

// //     }


// //     // =================================================
// //     // CABIN VALIDATION
// //     // =================================================

// //     for (
// //       const cabin of preparedCabins
// //     ) {

// //       if (
// //         cabin.totalSeats < 0 ||
// //         cabin.availableSeats < 0 ||
// //         cabin.price < 0
// //       ) {

// //         return res.status(400).json({

// //           success: false,

// //           message:
// //             "Cabin values cannot be negative.",

// //         });

// //       }


// //       if (
// //         cabin.availableSeats >
// //         cabin.totalSeats
// //       ) {

// //         return res.status(400).json({

// //           success: false,

// //           message:
// //             "Available seats cannot be greater than total seats.",

// //         });

// //       }

// //     }


// //     // =================================================
// //     // PREPARE TICKETS
// //     // =================================================

// //     const preparedTickets =
// //       prepareTickets(
// //         tickets
// //       );


// //     // =================================================
// //     // TICKET VALIDATION
// //     // =================================================

// //     const ticketValidation =
// //       validateTickets(
// //         preparedTickets
// //       );


// //     if (
// //       !ticketValidation.valid
// //     ) {

// //       return res.status(400).json({

// //         success: false,

// //         message:
// //           ticketValidation.message,

// //       });

// //     }


// //     // =================================================
// //     // CREATE FLIGHT
// //     // =================================================

// //     const flight =
// //       await Flight.create({

// //         // =============================================
// //         // BASIC
// //         // =============================================

// //         airline:
// //           String(airline).trim(),

// //         logo:
// //           logo || "",

// //         flightNo:
// //           String(flightNo)
// //             .trim()
// //             .toUpperCase(),

// //         flightType:
// //           flightType || "Domestic",

// //         aircraft:
// //           String(aircraft).trim(),


// //         // =============================================
// //         // ROUTE
// //         // =============================================

// //         fromCity:
// //           String(fromCity).trim(),

// //         fromAirport:
// //           String(fromAirport).trim(),

// //         fromCode:
// //           String(fromCode)
// //             .trim()
// //             .toUpperCase(),

// //         toCity:
// //           String(toCity).trim(),

// //         toAirport:
// //           String(toAirport).trim(),

// //         toCode:
// //           String(toCode)
// //             .trim()
// //             .toUpperCase(),


// //         // =============================================
// //         // DEPARTURE
// //         // =============================================

// //         departureDate,

// //         departureTime,

// //         departureTerminal:
// //           departureTerminal || "",


// //         // =============================================
// //         // ARRIVAL
// //         // =============================================

// //         arrivalDate,

// //         arrivalTime,

// //         arrivalTerminal:
// //           arrivalTerminal || "",


// //         // =============================================
// //         // DETAILS
// //         // =============================================

// //         duration:

// //           String(duration).trim(),

// //         stops:
// //           stops || "Non-stop",

// //         stopAirport:
// //           stopAirport || "",

// //         stopCity:
// //           stopCity || "",

// //         layoverDuration:
// //           layoverDuration || "",


// //         // =============================================
// //         // CABINS
// //         // =============================================

// //         cabins:
// //           preparedCabins,


// //         // =============================================
// //         // GENERAL PRICING
// //         // =============================================

// //         baseFare:
// //           toNumber(baseFare),

// //         taxes:
// //           toNumber(taxes),

// //         airportCharges:
// //           toNumber(airportCharges),

// //         serviceFee:
// //           toNumber(serviceFee),

// //         discount:
// //           toNumber(discount),

// //         finalPrice:
// //           toNumber(finalPrice),

// //         currency:
// //           currency || "INR",


// //         // =============================================
// //         // ADULT / CHILD / INFANT FARES
// //         // =============================================

// //         adultFare:
// //           toNumber(adultFare),

// //         childFare:
// //           toNumber(childFare),

// //         infantFare:
// //           toNumber(infantFare),


// //         // =============================================
// //         // MEAL PRICES
// //         // =============================================

// //         adultMealPrice:
// //           toNumber(adultMealPrice),

// //         childMealPrice:
// //           toNumber(childMealPrice),

// //         infantMealPrice:
// //           toNumber(infantMealPrice),


// //         // =============================================
// //         // BAGGAGE PRICES
// //         // =============================================

// //         adultBaggagePrice:
// //           toNumber(
// //             adultBaggagePrice
// //           ),

// //         childBaggagePrice:
// //           toNumber(
// //             childBaggagePrice
// //           ),

// //         infantBaggagePrice:
// //           toNumber(
// //             infantBaggagePrice
// //           ),


// //         // =============================================
// //         // SEAT PRICES
// //         // =============================================

// //         adultSeatPrice:
// //           toNumber(
// //             adultSeatPrice
// //           ),

// //         childSeatPrice:
// //           toNumber(
// //             childSeatPrice
// //           ),

// //         infantSeatPrice:
// //           toNumber(
// //             infantSeatPrice
// //           ),


// //         // =============================================
// //         // BAGGAGE
// //         // =============================================

// //         cabinBaggage:
// //           cabinBaggage || "7 KG",

// //         checkinBaggage:
// //           checkinBaggage || "15 KG",

// //         extraBaggagePrice:
// //           toNumber(
// //             extraBaggagePrice
// //           ),


// //         // =============================================
// //         // SERVICES
// //         // =============================================

// //         mealAvailable:
// //           toBoolean(
// //             mealAvailable
// //           ),

// //         wifiAvailable:
// //           toBoolean(
// //             wifiAvailable
// //           ),

// //         entertainmentAvailable:
// //           toBoolean(
// //             entertainmentAvailable
// //           ),

// //         powerAvailable:
// //           toBoolean(
// //             powerAvailable
// //           ),


// //         // =============================================
// //         // BOOKING
// //         // =============================================

// //         bookingStartDate:
// //           bookingStartDate || "",

// //         bookingClosingDate:
// //           bookingClosingDate || "",

// //         refundable:
// //           toBoolean(
// //             refundable
// //           ),

// //         changeable:
// //           toBoolean(
// //             changeable
// //           ),


// //         // =============================================
// //         // TICKETS
// //         // =============================================

// //         tickets:
// //           preparedTickets,


// //         // =============================================
// //         // STATUS
// //         // =============================================

// //         status:
// //           status || "Scheduled",

// //         description:
// //           description || "",

// //         specialInstructions:
// //           specialInstructions || "",

// //       });


// //     // =================================================
// //     // RESPONSE
// //     // =================================================

// //     res.status(201).json({

// //       success: true,

// //       message:
// //         "Flight created successfully.",

// //       flight,

// //     });


// //   } catch (error) {

// //     console.error(
// //       "Create Flight Error:",
// //       error
// //     );


// //     // =============================================
// //     // DUPLICATE KEY
// //     // =============================================

// //     if (
// //       error.code === 11000
// //     ) {

// //       return res.status(409).json({

// //         success: false,

// //         message:
// //           "Flight number already exists.",

// //       });

// //     }


// //     // =============================================
// //     // VALIDATION ERROR
// //     // =============================================

// //     if (
// //       error.name ===
// //       "ValidationError"
// //     ) {

// //       const messages =
// //         Object.values(
// //           error.errors
// //         ).map(
// //           (err) => err.message
// //         );


// //       return res.status(400).json({

// //         success: false,

// //         message:
// //           messages.join(", "),

// //       });

// //     }


// //     res.status(500).json({

// //       success: false,

// //       message:
// //         "Server error while creating flight.",

// //     });

// //   }

// // };


// // // =====================================================
// // // UPDATE FLIGHT
// // // =====================================================

// // const updateFlight = async (
// //   req,
// //   res
// // ) => {

// //   try {

// //     const flight =
// //       await Flight.findById(
// //         req.params.id
// //       );


// //     if (!flight) {

// //       return res.status(404).json({

// //         success: false,

// //         message:
// //           "Flight not found.",

// //       });

// //     }


// //     const body = {
// //       ...req.body,
// //     };


// //     // =================================================
// //     // NORMALIZE NUMERIC FIELDS
// //     // =================================================

// //     const numericFields = [

// //       "baseFare",
// //       "taxes",
// //       "airportCharges",
// //       "serviceFee",
// //       "discount",
// //       "finalPrice",

// //       "adultFare",
// //       "childFare",
// //       "infantFare",

// //       "adultMealPrice",
// //       "childMealPrice",
// //       "infantMealPrice",

// //       "adultBaggagePrice",
// //       "childBaggagePrice",
// //       "infantBaggagePrice",

// //       "adultSeatPrice",
// //       "childSeatPrice",
// //       "infantSeatPrice",

// //       "extraBaggagePrice",

// //     ];


// //     numericFields.forEach(
// //       (field) => {

// //         if (
// //           body[field] !==
// //           undefined
// //         ) {

// //           body[field] =
// //             toNumber(
// //               body[field]
// //             );

// //         }

// //       }
// //     );


// //     // =================================================
// //     // NORMALIZE BOOLEAN FIELDS
// //     // =================================================

// //     const booleanFields = [

// //       "mealAvailable",
// //       "wifiAvailable",
// //       "entertainmentAvailable",
// //       "powerAvailable",
// //       "refundable",
// //       "changeable",

// //     ];


// //     booleanFields.forEach(
// //       (field) => {

// //         if (
// //           body[field] !==
// //           undefined
// //         ) {

// //           body[field] =
// //             toBoolean(
// //               body[field]
// //             );

// //         }

// //       }
// //     );


// //     // =================================================
// //     // FLIGHT NUMBER
// //     // =================================================

// //     if (
// //       body.flightNo
// //     ) {

// //       body.flightNo =
// //         String(
// //           body.flightNo
// //         )
// //           .trim()
// //           .toUpperCase();


// //       const duplicate =
// //         await Flight.findOne({

// //           flightNo:
// //             body.flightNo,

// //           _id: {
// //             $ne:
// //               flight._id,
// //           },

// //         });


// //       if (duplicate) {

// //         return res.status(409).json({

// //           success: false,

// //           message:
// //             "Another flight already has this flight number.",

// //         });

// //       }

// //     }


// //     // =================================================
// //     // CODES
// //     // =================================================

// //     if (
// //       body.fromCode
// //     ) {

// //       body.fromCode =
// //         String(
// //           body.fromCode
// //         )
// //           .trim()
// //           .toUpperCase();

// //     }


// //     if (
// //       body.toCode
// //     ) {

// //       body.toCode =
// //         String(
// //           body.toCode
// //         )
// //           .trim()
// //           .toUpperCase();

// //     }


// //     // =================================================
// //     // CABINS
// //     // =================================================

// //     if (
// //       body.cabins !==
// //       undefined
// //     ) {

// //       const preparedCabins =
// //         prepareCabins(
// //           body.cabins
// //         );


// //       for (
// //         const cabin of
// //         preparedCabins
// //       ) {

// //         if (
// //           cabin.availableSeats >
// //           cabin.totalSeats
// //         ) {

// //           return res.status(400).json({

// //             success: false,

// //             message:
// //               "Available seats cannot be greater than total seats.",

// //           });

// //         }

// //       }


// //       body.cabins =
// //         preparedCabins;

// //     }


// //     // =================================================
// //     // TICKETS
// //     // =================================================

// //     if (
// //       body.tickets !==
// //       undefined
// //     ) {

// //       const preparedTickets =
// //         prepareTickets(
// //           body.tickets
// //         );


// //       const validation =
// //         validateTickets(
// //           preparedTickets
// //         );


// //       if (
// //         !validation.valid
// //       ) {

// //         return res.status(400).json({

// //           success: false,

// //           message:
// //             validation.message,

// //         });

// //       }


// //       body.tickets =
// //         preparedTickets;

// //     }


// //     // =================================================
// //     // UPDATE
// //     // =================================================

// //     Object.keys(body)
// //       .forEach(
// //         (key) => {

// //           if (
// //             key !== "_id"
// //           ) {

// //             flight[key] =
// //               body[key];

// //           }

// //         }
// //       );


// //     await flight.save();


// //     res.status(200).json({

// //       success: true,

// //       message:
// //         "Flight updated successfully.",

// //       flight,

// //     });


// //   } catch (error) {

// //     console.error(
// //       "Update Flight Error:",
// //       error
// //     );


// //     if (
// //       error.code === 11000
// //     ) {

// //       return res.status(409).json({

// //         success: false,

// //         message:
// //           "Flight number already exists.",

// //       });

// //     }


// //     if (
// //       error.name ===
// //       "ValidationError"
// //     ) {

// //       const messages =
// //         Object.values(
// //           error.errors
// //         ).map(
// //           (err) => err.message
// //         );


// //       return res.status(400).json({

// //         success: false,

// //         message:
// //           messages.join(", "),

// //       });

// //     }


// //     res.status(500).json({

// //       success: false,

// //       message:
// //         "Server error while updating flight.",

// //     });

// //   }

// // };


// // // =====================================================
// // // DELETE FLIGHT
// // // =====================================================

// // const deleteFlight = async (
// //   req,
// //   res
// // ) => {

// //   try {

// //     const flight =
// //       await Flight.findById(
// //         req.params.id
// //       );


// //     if (!flight) {

// //       return res.status(404).json({

// //         success: false,

// //         message:
// //           "Flight not found.",

// //       });

// //     }


// //     await Flight.findByIdAndDelete(
// //       req.params.id
// //     );


// //     res.status(200).json({

// //       success: true,

// //       message:
// //         "Flight deleted successfully.",

// //     });


// //   } catch (error) {

// //     console.error(
// //       "Delete Flight Error:",
// //       error
// //     );


// //     res.status(500).json({

// //       success: false,

// //       message:
// //         "Server error while deleting flight.",

// //     });

// //   }

// // };


// // // =====================================================
// // // SEARCH FLIGHTS
// // // =====================================================

// // const searchFlights = async (
// //   req,
// //   res
// // ) => {

// //   try {

// //     const {

// //       from,
// //       to,
// //       departureDate,

// //       adults,
// //       children,
// //       infants,

// //     } = req.query;


// //     const query = {};


// //     // =================================================
// //     // FROM
// //     // =================================================

// //     if (from) {

// //       const fromValue =
// //         String(from)
// //           .trim()
// //           .toUpperCase();


// //       query.$or = [

// //         {
// //           fromCode:
// //             fromValue,
// //         },

// //         {
// //           fromCity:
// //             new RegExp(
// //               String(from).trim(),
// //               "i"
// //             ),
// //         },

// //       ];

// //     }


// //     // =================================================
// //     // TO
// //     // =================================================

// //     if (to) {

// //       const toValue =
// //         String(to)
// //           .trim()
// //           .toUpperCase();


// //       const toCondition = {

// //         $or: [

// //           {
// //             toCode:
// //               toValue,
// //           },

// //           {
// //             toCity:
// //               new RegExp(
// //                 String(to).trim(),
// //                 "i"
// //               ),
// //           },

// //         ],

// //       };


// //       if (query.$or) {

// //         query.$and = [

// //           {
// //             $or:
// //               query.$or,
// //           },

// //           toCondition,

// //         ];

// //         delete query.$or;

// //       } else {

// //         query.$or =
// //           toCondition.$or;

// //       }

// //     }


// //     // =================================================
// //     // DATE
// //     // =================================================

// //     if (
// //       departureDate
// //     ) {

// //       query.departureDate =
// //         departureDate;

// //     }


// //     // =================================================
// //     // ONLY SCHEDULED FLIGHTS
// //     // =================================================

// //     query.status = {
// //       $nin: [
// //         "Cancelled",
// //       ],
// //     };


// //     // =================================================
// //     // FIND
// //     // =================================================

// //     const flights =
// //       await Flight.find(
// //         query
// //       ).sort({
// //         departureTime: 1,
// //       });


// //     // =================================================
// //     // PASSENGER COUNT INFO
// //     // =================================================

// //     const passengerCounts = {

// //       adults:
// //         Math.max(
// //           Number(adults || 1),
// //           1
// //         ),

// //       children:
// //         Math.max(
// //           Number(children || 0),
// //           0
// //         ),

// //       infants:
// //         Math.max(
// //           Number(infants || 0),
// //           0
// //         ),

// //     };


// //     // =================================================
// //     // RESPONSE
// //     // =================================================

// //     res.status(200).json({

// //       success: true,

// //       count:
// //         flights.length,

// //       passengerCounts,

// //       flights,

// //     });


// //   } catch (error) {

// //     console.error(
// //       "Search Flights Error:",
// //       error
// //     );


// //     res.status(500).json({

// //       success: false,

// //       message:
// //         "Server error while searching flights.",

// //     });

// //   }

// // };


// // // =====================================================
// // // EXPORT
// // // =====================================================

// // module.exports = {

// //   getFlights,

// //   getFlightById,

// //   createFlight,

// //   updateFlight,

// //   deleteFlight,

// //   searchFlights,

// // };








// // controllers/flightController.js

// const Flight = require("../models/Flight");

// // =====================================================
// // CREATE FLIGHT
// // =====================================================

// const createFlight = async (req, res) => {
//   try {
//     const data = req.body;

//     console.log("CREATE FLIGHT DATA:", data);

//     const flight = await Flight.create({
//       // -------------------------------------------------
//       // BASIC FLIGHT DETAILS
//       // -------------------------------------------------

//       airlineName:
//         data.airlineName ||
//         data.airline ||
//         "",

//       flightNumber:
//         data.flightNumber ||
//         data.flightNo ||
//         "",

//       flightType:
//         data.flightType ||
//         "Domestic",

//       aircraft:
//         data.aircraft ||
//         "",

//       // -------------------------------------------------
//       // ROUTE
//       // -------------------------------------------------

//       route:
//         data.route ||
//         "",

//       from:
//         data.from ||
//         data.fromCode ||
//         "",

//       fromCode:
//         data.fromCode ||
//         "",

//       fromCity:
//         data.fromCity ||
//         "",

//       fromAirport:
//         data.fromAirport ||
//         "",

//       fromTerminal:
//         data.fromTerminal ||
//         "",

//       to:
//         data.to ||
//         data.toCode ||
//         "",

//       toCode:
//         data.toCode ||
//         "",

//       toCity:
//         data.toCity ||
//         "",

//       toAirport:
//         data.toAirport ||
//         "",

//       toTerminal:
//         data.toTerminal ||
//         "",

//       // -------------------------------------------------
//       // SCHEDULE
//       // -------------------------------------------------

//       departureDate:
//         data.departureDate ||
//         "",

//       arrivalDate:
//         data.arrivalDate ||
//         data.departureDate ||
//         "",

//       departureTime:
//         data.departureTime ||
//         "",

//       arrivalTime:
//         data.arrivalTime ||
//         "",

//       duration:
//         data.duration ||
//         "",

//       // -------------------------------------------------
//       // STOPS
//       // -------------------------------------------------

//       stops:
//         data.stops ||
//         "Non-stop",

//       stopDetails:
//         Array.isArray(data.stopDetails)
//           ? data.stopDetails
//           : [],

//       // -------------------------------------------------
//       // TICKET INVENTORY
//       // -------------------------------------------------

//       ticketInventory:
//         Number(
//           data.ticketInventory
//         ) || 0,

//       pnr:
//         data.pnr ||
//         data.PNR ||
//         "",

//       // -------------------------------------------------
//       // CUSTOMER FARE
//       // -------------------------------------------------

//       adultFare:
//         Number(
//           data.adultFare
//         ) || 0,

//       childFare:
//         Number(
//           data.childFare
//         ) || 0,

//       infantFare:
//         Number(
//           data.infantFare
//         ) || 0,

//       // -------------------------------------------------
//       // AGENT FARE
//       // IMPORTANT
//       // -------------------------------------------------

//       agentAdultFare:
//         Number(
//           data.agentAdultFare
//         ) || 0,

//       agentChildFare:
//         Number(
//           data.agentChildFare
//         ) || 0,

//       agentInfantFare:
//         Number(
//           data.agentInfantFare
//         ) || 0,

//       // -------------------------------------------------
//       // BAGGAGE
//       // ADMIN ENTERS THIS
//       // -------------------------------------------------

//       cabinBaggage:
//         data.cabinBaggage ||
//         data.cabinBag ||
//         "",

//       checkinBaggage:
//         data.checkinBaggage ||
//         data.checkinBag ||
//         "",

//       // -------------------------------------------------
//       // BOOKING RULES
//       // -------------------------------------------------

//       refundable:
//         Boolean(
//           data.refundable
//         ),

//       bookingRules:
//         data.bookingRules ||
//         "",

//       // -------------------------------------------------
//       // CABIN
//       // -------------------------------------------------

//       cabin:
//         data.cabin ||
//         "Economy",

//       cabinClass:
//         data.cabinClass ||
//         data.cabin ||
//         "Economy",

//       // -------------------------------------------------
//       // LOGO
//       // -------------------------------------------------

//       logo:
//         data.logo ||
//         "",

//       airlineLogo:
//         data.airlineLogo ||
//         data.logo ||
//         "",
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Flight added successfully.",
//       flight,
//     });
//   } catch (error) {
//     console.error(
//       "CREATE FLIGHT ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "Failed to add flight.",
//     });
//   }
// };

// // =====================================================
// // GET ALL FLIGHTS
// // =====================================================

// const getFlights = async (req, res) => {
//   try {
//     const flights =
//       await Flight.find().sort({
//         createdAt: -1,
//       });

//     return res.status(200).json({
//       success: true,
//       flights,
//     });
//   } catch (error) {
//     console.error(
//       "GET FLIGHTS ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "Failed to fetch flights.",
//     });
//   }
// };

// // =====================================================
// // GET FLIGHT BY ID
// // =====================================================

// const getFlightById = async (
//   req,
//   res
// ) => {
//   try {
//     const flight =
//       await Flight.findById(
//         req.params.id
//       );

//     if (!flight) {
//       return res.status(404).json({
//         success: false,
//         message: "Flight not found.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       flight,
//     });
//   } catch (error) {
//     console.error(
//       "GET FLIGHT ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "Failed to fetch flight.",
//     });
//   }
// };

// // =====================================================
// // UPDATE FLIGHT
// // =====================================================

// const updateFlight = async (
//   req,
//   res
// ) => {
//   try {
//     const data = req.body;

//     const updateData = {
//       ...data,

//       // -----------------------------------------------
//       // FARES
//       // -----------------------------------------------

//       adultFare:
//         data.adultFare !== undefined
//           ? Number(data.adultFare)
//           : undefined,

//       childFare:
//         data.childFare !== undefined
//           ? Number(data.childFare)
//           : undefined,

//       infantFare:
//         data.infantFare !== undefined
//           ? Number(data.infantFare)
//           : undefined,

//       agentAdultFare:
//         data.agentAdultFare !== undefined
//           ? Number(data.agentAdultFare)
//           : undefined,

//       agentChildFare:
//         data.agentChildFare !== undefined
//           ? Number(data.agentChildFare)
//           : undefined,

//       agentInfantFare:
//         data.agentInfantFare !== undefined
//           ? Number(data.agentInfantFare)
//           : undefined,

//       // -----------------------------------------------
//       // INVENTORY
//       // -----------------------------------------------

//       ticketInventory:
//         data.ticketInventory !== undefined
//           ? Number(
//               data.ticketInventory
//             )
//           : undefined,

//       // -----------------------------------------------
//       // BAGGAGE
//       // -----------------------------------------------

//       cabinBaggage:
//         data.cabinBaggage !== undefined
//           ? data.cabinBaggage
//           : data.cabinBag,

//       checkinBaggage:
//         data.checkinBaggage !== undefined
//           ? data.checkinBaggage
//           : data.checkinBag,

//       // -----------------------------------------------
//       // PNR
//       // -----------------------------------------------

//       pnr:
//         data.pnr !== undefined
//           ? data.pnr
//           : data.PNR,

//       // -----------------------------------------------
//       // STOPS
//       // -----------------------------------------------

//       stopDetails:
//         Array.isArray(
//           data.stopDetails
//         )
//           ? data.stopDetails
//           : undefined,
//     };

//     Object.keys(updateData).forEach(
//       (key) => {
//         if (
//           updateData[key] ===
//           undefined
//         ) {
//           delete updateData[key];
//         }
//       }
//     );

//     const flight =
//       await Flight.findByIdAndUpdate(
//         req.params.id,
//         updateData,
//         {
//           new: true,
//           runValidators: true,
//         }
//       );

//     if (!flight) {
//       return res.status(404).json({
//         success: false,
//         message: "Flight not found.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message:
//         "Flight updated successfully.",
//       flight,
//     });
//   } catch (error) {
//     console.error(
//       "UPDATE FLIGHT ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "Failed to update flight.",
//     });
//   }
// };

// // =====================================================
// // DELETE FLIGHT
// // =====================================================

// const deleteFlight = async (
//   req,
//   res
// ) => {
//   try {
//     const flight =
//       await Flight.findByIdAndDelete(
//         req.params.id
//       );

//     if (!flight) {
//       return res.status(404).json({
//         success: false,
//         message: "Flight not found.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message:
//         "Flight deleted successfully.",
//     });
//   } catch (error) {
//     console.error(
//       "DELETE FLIGHT ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "Failed to delete flight.",
//     });
//   }
// };

// // =====================================================
// // SEARCH FLIGHTS
// // =====================================================

// const searchFlights = async (
//   req,
//   res
// ) => {
//   try {
//     const {
//       from,
//       to,
//       departureDate,
//       date,
//     } = req.query;

//     const query = {};

//     // -----------------------------------------------
//     // FROM
//     // -----------------------------------------------

//     if (from) {
//       query.$or = [
//         {
//           fromCode: {
//             $regex: from,
//             $options: "i",
//           },
//         },
//         {
//           fromCity: {
//             $regex: from,
//             $options: "i",
//           },
//         },
//         {
//           fromAirport: {
//             $regex: from,
//             $options: "i",
//           },
//         },
//       ];
//     }

//     // -----------------------------------------------
//     // TO
//     // -----------------------------------------------

//     if (to) {
//       const destinationQuery = {
//         $or: [
//           {
//             toCode: {
//               $regex: to,
//               $options: "i",
//             },
//           },
//           {
//             toCity: {
//               $regex: to,
//               $options: "i",
//             },
//           },
//           {
//             toAirport: {
//               $regex: to,
//               $options: "i",
//             },
//           },
//         ],
//       };

//       if (query.$or) {
//         query.$and = [
//           {
//             $or: query.$or,
//           },
//           destinationQuery,
//         ];

//         delete query.$or;
//       } else {
//         query.$or =
//           destinationQuery.$or;
//       }
//     }

//     // -----------------------------------------------
//     // DATE
//     // -----------------------------------------------

//     if (
//       departureDate ||
//       date
//     ) {
//       query.departureDate =
//         departureDate || date;
//     }

//     const flights =
//       await Flight.find(
//         query
//       ).sort({
//         departureDate: 1,
//         departureTime: 1,
//       });

//     return res.status(200).json({
//       success: true,
//       count: flights.length,
//       flights,
//     });
//   } catch (error) {
//     console.error(
//       "SEARCH FLIGHTS ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "Failed to search flights.",
//     });
//   }
// };

// // =====================================================
// // EXPORT
// // =====================================================

// module.exports = {
//   createFlight,
//   getFlights,
//   getFlightById,
//   updateFlight,
//   deleteFlight,
//   searchFlights,
// };

















// controllers/flightController.js

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