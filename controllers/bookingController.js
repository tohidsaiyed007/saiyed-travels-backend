// const Booking = require("../models/Booking");
// const Flight = require("../models/Flight");

// // =====================================================
// // HELPERS
// // =====================================================

// const numberValue = (value) => {
//   const n = Number(value);
//   return Number.isFinite(n) ? n : 0;
// };

// const generateBookingId = () => {
//   return "ST" + Math.floor(100000 + Math.random() * 900000);
// };

// const getUniqueBookingId = async () => {
//   let bookingId;
//   let exists = true;

//   while (exists) {
//     bookingId = generateBookingId();
//     exists = await Booking.exists({ bookingId });
//   }

//   return bookingId;
// };

// // =====================================================
// // EXACT BAGGAGE FROM ADMIN ADD FLIGHT
// // =====================================================

// const getExactBaggage = (dbFlight) => {
//   const firstNonEmpty = (...values) => {
//     for (const value of values) {
//       if (
//         value !== null &&
//         value !== undefined &&
//         String(value).trim() !== ""
//       ) {
//         return String(value).trim();
//       }
//     }

//     return "";
//   };

//   const cabinBaggage = firstNonEmpty(
//     dbFlight?.cabinBaggage,
//     dbFlight?.cabinBag,
//     dbFlight?.cabinBaggageAllowance,

//     dbFlight?.baggage?.cabinBaggage,
//     dbFlight?.baggage?.cabin,

//     dbFlight?.cabins?.[0]?.cabinBaggage,
//     dbFlight?.cabins?.[0]?.baggageCabin,
//     dbFlight?.cabins?.[0]?.baggage?.cabinBaggage,
//     dbFlight?.cabins?.[0]?.baggage?.cabin
//   );

//   const checkinBaggage = firstNonEmpty(
//     dbFlight?.checkinBaggage,
//     dbFlight?.checkinBag,
//     dbFlight?.checkinBaggageAllowance,

//     dbFlight?.baggage?.checkinBaggage,
//     dbFlight?.baggage?.checkin,

//     dbFlight?.cabins?.[0]?.checkinBaggage,
//     dbFlight?.cabins?.[0]?.baggageCheckin,
//     dbFlight?.cabins?.[0]?.baggage,
//     dbFlight?.cabins?.[0]?.baggage?.checkinBaggage,
//     dbFlight?.cabins?.[0]?.baggage?.checkin
//   );

//   console.log("========================================");
//   console.log("ADMIN BAGGAGE");
//   console.log("Cabin:", cabinBaggage);
//   console.log("Check-in:", checkinBaggage);
//   console.log("========================================");

//   return {
//     cabinBaggage,
//     checkinBaggage,
//   };
// };

// // =====================================================
// // CREATE BOOKING
// // =====================================================

// const createBooking = async (req, res) => {
//   let bookedFlightId = null;
//   let bookedPNR = null;
//   let generatedBookingId = null;

//   try {
//     const {
//       passenger,
//       passengers,
//       flight,
//       flightId,
//       seat,
//       seats,
//       seatPrice,
//       meal,
//       meals,
//       baggage,
//       baggages,
//       paymentMethod,
//       paymentVerified,
//       paymentId,
//       orderId,
//       discount,
//       adults,
//       children,
//       infants,
//       fareRole,
//       userRole,
//     } = req.body;

//     // =================================================
//     // USER ROLE
//     // =================================================

//     const authenticatedRole = String(
//       req.user?.role || ""
//     )
//       .trim()
//       .toLowerCase();

//     const bodyUserRole = String(
//       userRole || fareRole || "customer"
//     )
//       .trim()
//       .toLowerCase();

//     const normalizedUserRole =
//       authenticatedRole === "admin" && req.body?.userId
//         ? bodyUserRole
//         : authenticatedRole || bodyUserRole;

//     const isAdmin = authenticatedRole === "admin";
//     const isAgent = normalizedUserRole === "agent";

//     let bookingUserId = null;

//     if (
//       authenticatedRole === "admin" &&
//       req.body?.userId
//     ) {
//       bookingUserId = req.body.userId;
//     } else {
//       bookingUserId =
//         req.user?._id ||
//         req.user?.id ||
//         req.body?.userId ||
//         req.headers["x-user-id"] ||
//         null;
//     }

//     console.log(
//       "BOOKING OWNER:",
//       bookingUserId,
//       "ROLE:",
//       normalizedUserRole,
//       "AUTH ROLE:",
//       authenticatedRole
//     );

//     // =================================================
//     // PAYMENT
//     // =================================================

//     const verifiedPayment =
//       paymentVerified === true ||
//       paymentVerified === "true";

//     if (!isAdmin && !verifiedPayment) {
//       return res.status(402).json({
//         success: false,
//         paymentRequired: true,
//         paymentVerified: false,
//         userRole: normalizedUserRole,
//         message:
//           "Payment is required before the ticket can be confirmed.",
//       });
//     }

//     // =================================================
//     // PASSENGERS
//     // =================================================

//     let passengerList = [];

//     if (
//       Array.isArray(passengers) &&
//       passengers.length > 0
//     ) {
//       passengerList = passengers;
//     } else if (passenger) {
//       passengerList = [
//         {
//           ...passenger,
//           type: passenger.type || "Adult",
//         },
//       ];
//     }

//     if (passengerList.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "At least one passenger is required.",
//       });
//     }

//     passengerList = passengerList.map((item) => ({
//       ...item,
//       type: [
//         "Adult",
//         "Child",
//         "Infant",
//       ].includes(item.type)
//         ? item.type
//         : "Adult",
//     }));

//     for (let i = 0; i < passengerList.length; i++) {
//       if (
//         !String(
//           passengerList[i].firstName || ""
//         ).trim()
//       ) {
//         return res.status(400).json({
//           success: false,
//           message:
//             `First name is required for passenger ${
//               i + 1
//             }.`,
//         });
//       }

//       if (
//         !String(
//           passengerList[i].lastName || ""
//         ).trim()
//       ) {
//         return res.status(400).json({
//           success: false,
//           message:
//             `Last name is required for passenger ${
//               i + 1
//             }.`,
//         });
//       }
//     }

//     // =================================================
//     // FLIGHT ID
//     // =================================================

//     const requestedFlightId =
//       flightId ||
//       flight?._id ||
//       flight?.id ||
//       flight?.flightId;

//     if (!requestedFlightId) {
//       return res.status(400).json({
//         success: false,
//         message: "Flight ID is missing.",
//       });
//     }

//     // =================================================
//     // GET REAL DATABASE FLIGHT
//     // =================================================

//     let dbFlight = null;

//     try {
//       dbFlight = await Flight.findById(
//         requestedFlightId
//       );
//     } catch (error) {
//       console.log(
//         "Invalid Flight ID:",
//         requestedFlightId
//       );
//     }

//     if (!dbFlight && flight?.flightNo) {
//       dbFlight = await Flight.findOne({
//         flightNo: String(flight.flightNo)
//           .trim()
//           .toUpperCase(),
//       });
//     }

//     if (!dbFlight) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Flight not found. Please select the flight again.",
//       });
//     }

//     // =================================================
//     // EXACT ADMIN BAGGAGE
//     // =================================================

//     const {
//       cabinBaggage,
//       checkinBaggage,
//     } = getExactBaggage(dbFlight);

//     console.log("========================================");
//     console.log("ADMIN BAGGAGE");
//     console.log("Cabin:", cabinBaggage);
//     console.log("Check-in:", checkinBaggage);
//     console.log("========================================");

//     // =================================================
//     // AVAILABLE PNR
//     // =================================================

//     if (
//       !Array.isArray(dbFlight.tickets) ||
//       dbFlight.tickets.length === 0
//     ) {
//       return res.status(409).json({
//         success: false,
//         message:
//           "No ticket / PNR is available for this flight.",
//       });
//     }

//     const availableTicket =
//       dbFlight.tickets.find(
//         (ticket) =>
//           ticket.status === "Available"
//       );

//     if (!availableTicket) {
//       return res.status(409).json({
//         success: false,
//         message:
//           "No ticket / PNR is available for this flight.",
//       });
//     }

//     const selectedPNR = String(
//       availableTicket.pnr || ""
//     )
//       .trim()
//       .toUpperCase();

//     // =================================================
//     // BOOKING ID
//     // =================================================

//     const bookingId =
//       await getUniqueBookingId();

//     generatedBookingId = bookingId;

//     // =================================================
//     // PASSENGER COUNTS
//     // =================================================

//     const adultCount =
//       numberValue(adults) ||
//       passengerList.filter(
//         (item) =>
//           item.type === "Adult"
//       ).length;

//     const childCount =
//       numberValue(children) ||
//       passengerList.filter(
//         (item) =>
//           item.type === "Child"
//       ).length;

//     const infantCount =
//       numberValue(infants) ||
//       passengerList.filter(
//         (item) =>
//           item.type === "Infant"
//       ).length;

//     const totalPassengerCount =
//       passengerList.length;

//     // =================================================
//     // EXACT CUSTOMER / AGENT FARES
//     // =================================================

//     const customerAdultFare =
//       numberValue(
//         dbFlight.adultFare ??
//           dbFlight.finalPrice ??
//           dbFlight.price
//       );

//     const customerChildFare =
//       numberValue(
//         dbFlight.childFare ??
//           customerAdultFare
//       );

//     const customerInfantFare =
//       numberValue(
//         dbFlight.infantFare
//       );

//     const agentAdultFare =
//       numberValue(
//         dbFlight.agentAdultFare
//       );

//     const agentChildFare =
//       numberValue(
//         dbFlight.agentChildFare ??
//           agentAdultFare
//       );

//     const agentInfantFare =
//       numberValue(
//         dbFlight.agentInfantFare ??
//           agentAdultFare
//       );

//     const selectedAdultFare =
//       isAgent
//         ? agentAdultFare
//         : customerAdultFare;

//     const selectedChildFare =
//       isAgent
//         ? agentChildFare
//         : customerChildFare;

//     const selectedInfantFare =
//       isAgent
//         ? agentInfantFare
//         : customerInfantFare;

//     // =================================================
//     // FLIGHT FARE
//     // =================================================

//     const flightFare =
//       selectedAdultFare * adultCount +
//       selectedChildFare * childCount +
//       selectedInfantFare * infantCount;

//     // =================================================
//     // SEATS
//     // =================================================

//     let seatList = [];

//     if (Array.isArray(seats)) {
//       seatList = seats;
//     } else if (seat) {
//       seatList = [
//         {
//           seatNumber: seat,
//           price: numberValue(seatPrice),
//         },
//       ];
//     }

//     const normalizedSeats =
//       seatList
//         .filter(Boolean)
//         .map((item, index) => {
//           const passengerAtIndex =
//             passengerList[index];

//           return {
//             passengerId:
//               passengerAtIndex?._id ||
//               null,

//             passengerName:
//               passengerAtIndex
//                 ? `${passengerAtIndex.firstName || ""} ${
//                     passengerAtIndex.lastName || ""
//                   }`.trim()
//                 : "",

//             seatNumber: String(
//               item?.seatNumber ||
//                 item?.seat ||
//                 ""
//             ).trim(),

//             price: numberValue(
//               item?.price ||
//                 item?.seatPrice ||
//                 0
//             ),
//           };
//         });


//   //       const seatFare =
//   // normalizedSeats.reduce(
//   //   (total, item) =>
//   //     total + numberValue(item.price),
//   //   0
//   // );

//   const seatFare =
//   normalizedSeats.reduce(
//     (total, item) =>
//       total + numberValue(item.price),
//     0
//   ) || numberValue(seatPrice);

//             // =================================================
//     // MEALS
//     // =================================================

//     let mealList = [];

//     if (Array.isArray(meals)) {
//       mealList = meals;
//     } else if (meal) {
//       mealList = [meal];
//     }

//     const normalizedMeals = mealList
//       .filter(Boolean)
//       .map((item, index) => {
//         const passengerAtIndex =
//           passengerList[index];

//         return {
//           passengerId:
//             passengerAtIndex?._id || null,

//           passengerName:
//             passengerAtIndex
//               ? `${passengerAtIndex.firstName || ""} ${
//                   passengerAtIndex.lastName || ""
//                 }`.trim()
//               : "",

//           name:
//             typeof item?.name === "string"
//               ? item.name
//               : "No Meal",

//           price: numberValue(item?.price),
//         };
//       });

//     const mealFare =
//       normalizedMeals.reduce(
//         (total, item) =>
//           total + numberValue(item.price),
//         0
//       );

//     // =================================================
//     // BAGGAGE
//     // =================================================

//     let baggageList = [];

//     if (Array.isArray(baggages)) {
//       baggageList = baggages;
//     } else if (baggage) {
//       baggageList = [baggage];
//     }

//     const normalizedBaggages =
//       passengerList.map(
//         (passengerAtIndex, index) => {
//           const frontendBaggage =
//             baggageList[index] || {};

//           return {
//             passengerId:
//               passengerAtIndex?._id || null,

//             passengerName:
//               `${passengerAtIndex.firstName || ""} ${
//                 passengerAtIndex.lastName || ""
//               }`.trim(),

//             cabinBaggage:
//               cabinBaggage,

//             cabin:
//               cabinBaggage,

//             checkinBaggage:
//               checkinBaggage,

//             checkin:
//               checkinBaggage,

//             weight:
//               checkinBaggage,

//             price:
//               numberValue(
//                 frontendBaggage?.price
//               ),
//           };
//         }
//       );

//     const baggageFare =
//       normalizedBaggages.reduce(
//         (total, item) =>
//           total + numberValue(item.price),
//         0
//       );

//     // =================================================
//     // OTHER CHARGES
//     // =================================================

//     const taxes = 0;

//     const convenienceFee = 0;

//     const discountAmount =
//       Math.max(
//         0,
//         numberValue(discount)
//       );

//     // =================================================
//     // FINAL TOTAL
//     // =================================================

//     const calculatedTotal =
//       flightFare +
//       seatFare +
//       mealFare +
//       baggageFare +
//       taxes +
//       convenienceFee -
//       discountAmount;

//     if (calculatedTotal < 0) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Invalid booking total.",
//       });
//     }

//     // =================================================
//     // FIRST PASSENGER
//     // =================================================

//     const firstPassenger =
//       passengerList[0];

//     const firstPassengerName =
//       `${firstPassenger.firstName || ""} ${
//         firstPassenger.lastName || ""
//       }`.trim();

//     // =================================================
//     // BOOK PNR
//     // =================================================

//     const updatedFlight =
//       await Flight.findOneAndUpdate(
//         {
//           _id: dbFlight._id,

//           tickets: {
//             $elemMatch: {
//               pnr: selectedPNR,
//               status: "Available",
//             },
//           },
//         },

//         {
//           $set: {
//             "tickets.$.status":
//               "Booked",

//             "tickets.$.bookingId":
//               bookingId,

//             "tickets.$.passengerName":
//               firstPassengerName,

//             "tickets.$.bookedAt":
//               new Date(),
//           },
//         },

//         {
//           new: true,
//         }
//       );

//     if (!updatedFlight) {
//       return res.status(409).json({
//         success: false,
//         message:
//           "This ticket was just booked. Please try again.",
//       });
//     }

//     bookedFlightId =
//       dbFlight._id;

//     bookedPNR =
//       selectedPNR;

//     // =================================================
//     // FLIGHT SNAPSHOT
//     // =================================================

//     const flightSnapshot = {
//       flightId:
//         dbFlight._id,

//       airline:
//         dbFlight.airline || "",

//       flightNo:
//         dbFlight.flightNo || "",

//       flightType:
//         dbFlight.flightType ||
//         "Domestic",

//       aircraft:
//         dbFlight.aircraft || "",

//       fromCity:
//         dbFlight.fromCity || "",

//       fromAirport:
//         dbFlight.fromAirport || "",

//       fromCode:
//         dbFlight.fromCode || "",

//       toCity:
//         dbFlight.toCity || "",

//       toAirport:
//         dbFlight.toAirport || "",

//       toCode:
//         dbFlight.toCode || "",

//       departureDate:
//         dbFlight.departureDate || "",

//       departureTime:
//         dbFlight.departureTime || "",

//       departureTerminal:
//         dbFlight.departureTerminal || "",

//       arrivalDate:
//         dbFlight.arrivalDate || "",

//       arrivalTime:
//         dbFlight.arrivalTime || "",

//       arrivalTerminal:
//         dbFlight.arrivalTerminal || "",

//       duration:
//         dbFlight.duration || "",

//       stops:
//         dbFlight.stops ||
//         "Non-stop",

//       stopAirport:
//         dbFlight.stopAirport || "",

//       price:
//         selectedAdultFare,

//       finalPrice:
//         selectedAdultFare,

//       adultFare:
//         selectedAdultFare,

//       childFare:
//         selectedChildFare,

//       infantFare:
//         selectedInfantFare,

//       fareRole:
//         isAgent
//           ? "agent"
//           : "customer",

//       cabinBaggage:
//         cabinBaggage,

//       checkinBaggage:
//         checkinBaggage,

//       baggage: {
//         cabinBaggage:
//           cabinBaggage,

//         cabin:
//           cabinBaggage,

//         checkinBaggage:
//           checkinBaggage,

//         checkin:
//           checkinBaggage,

//         weight:
//           checkinBaggage,
//       },

//       logo:
//         dbFlight.logo || "",

//       airlineLogo:
//         dbFlight.airlineLogo || "",
//     };

//     // =================================================
//     // PAYMENT STATUS
//     // =================================================

//     const finalPaymentStatus =
//       isAdmin || verifiedPayment
//         ? "Paid"
//         : "Pending";

//     const finalBookingStatus =
//       isAdmin || verifiedPayment
//         ? "Confirmed"
//         : "Pending";

//     // =================================================
//     // USER ID
//     // =================================================

//     // bookingUserId is resolved above so Admin Accept cannot steal ownership.

//     // =================================================
//     // CREATE BOOKING
//     // =================================================

//     const booking =
//       await Booking.create({

//         bookingId:
//           bookingId,

//         pnr:
//           selectedPNR,

//         flightId:
//           dbFlight._id,

//         userId:
//           bookingUserId,

//         userRole:
//           normalizedUserRole,

//         adults:
//           adultCount,

//         children:
//           childCount,

//         infants:
//           infantCount,

//         totalPassengers:
//           totalPassengerCount,

//         passengers:
//           passengerList,

//         passenger:
//           firstPassenger,

//         flight:
//           flightSnapshot,

//         seats:
//           normalizedSeats,

//         seat:
//           normalizedSeats[0]?.seatNumber ||
//           seat ||
//           "",

//         seatPrice:
//           seatFare,

//         meals:
//           normalizedMeals,

//         meal: {
//           name:
//             normalizedMeals[0]?.name ||
//             "No Meal",

//           price:
//             mealFare,
//         },

//         mealPrice:
//           mealFare,

//         baggages:
//           normalizedBaggages,

//         baggage: {
//           cabinBaggage:
//             cabinBaggage,

//           cabin:
//             cabinBaggage,

//           checkinBaggage:
//             checkinBaggage,

//           checkin:
//             checkinBaggage,

//           weight:
//             checkinBaggage,

//           price:
//             baggageFare,
//         },

//         baggagePrice:
//           baggageFare,

//         flightFare:
//           flightFare,

//         adultFare:
//           selectedAdultFare,

//         childFare:
//           selectedChildFare,

//         infantFare:
//           selectedInfantFare,

//         fareRole:
//           isAgent
//             ? "agent"
//             : "customer",

//         seatFare:
//           seatFare,

//         mealFare:
//           mealFare,

//         paymentMethod:
//           isAdmin
//             ? "admin"
//             : paymentMethod || "upi",

//         paymentStatus:
//           finalPaymentStatus,

//         bookingStatus:
//           finalBookingStatus,

//         paymentId:
//           paymentId || "",

//         orderId:
//           orderId || "",

//         discount:
//           discountAmount,

//         taxes:
//           taxes,

//         convenienceFee:
//           convenienceFee,

//         total:
//           calculatedTotal,
//       });

//     // =================================================
//     // SUCCESS
//     // =================================================

//     console.log(
//       "========================================"
//     );

//     console.log(
//       "BOOKING CREATED"
//     );

//     console.log(
//       "Booking ID:",
//       booking.bookingId
//     );

//     console.log(
//       "PNR:",
//       booking.pnr
//     );

//     console.log(
//       "USER ID:",
//       booking.userId
//     );

//     console.log(
//       "PASSENGER EMAIL:",
//       booking.passengers?.[0]?.email
//     );

//     console.log(
//       "Cabin Baggage:",
//       cabinBaggage
//     );

//     console.log(
//       "Check-in Baggage:",
//       checkinBaggage
//     );

//     console.log(
//       "Fare Role:",
//       booking.fareRole
//     );

//     console.log(
//       "Adult Fare:",
//       booking.adultFare
//     );

//     console.log(
//       "FINAL TOTAL:",
//       booking.total
//     );

//     console.log(
//       "========================================"
//     );

//     return res.status(201).json({
//       success: true,

//       message:
//         isAdmin
//           ? "Admin booking confirmed successfully."
//           : "Payment verified and booking confirmed successfully.",

//       booking,

//       userRole:
//         normalizedUserRole,

//       paymentRequired:
//         !isAdmin,

//       paymentVerified:
//         isAdmin || verifiedPayment,
//     });

//   } catch (error) {

//     console.error(
//       "CREATE BOOKING ERROR:",
//       error
//     );

//     // =================================================
//     // ROLLBACK PNR
//     // =================================================

//     if (
//       bookedFlightId &&
//       bookedPNR &&
//       generatedBookingId
//     ) {
//       try {

//         await Flight.updateOne(
//           {
//             _id:
//               bookedFlightId,

//             tickets: {
//               $elemMatch: {
//                 pnr:
//                   bookedPNR,

//                 bookingId:
//                   generatedBookingId,
//               },
//             },
//           },

//           {
//             $set: {
//               "tickets.$.status":
//                 "Available",

//               "tickets.$.bookingId":
//                 "",

//               "tickets.$.passengerName":
//                 "",

//               "tickets.$.bookedAt":
//                 null,
//             },
//           }
//         );

//       } catch (rollbackError) {

//         console.error(
//           "PNR ROLLBACK ERROR:",
//           rollbackError
//         );
//       }
//     }

//     return res.status(500).json({
//       success: false,

//       message:
//         error.message ||
//         "Unable to create booking.",
//     });
//   }
// };

// // =====================================================
// // GET ALL BOOKINGS
// // =====================================================

// const getAllBookings = async (
//   req,
//   res
// ) => {

//   try {

//     const bookings =
//       await Booking.find()
//         .sort({
//           createdAt: -1,
//         });

//     return res.status(200).json({
//       success: true,

//       count:
//         bookings.length,

//       bookings,
//     });

//   } catch (error) {

//     console.error(
//       "GET BOOKINGS ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,

//       message:
//         error.message ||
//         "Unable to fetch bookings.",
//     });
//   }
// };

// // =====================================================
// // GET SINGLE BOOKING
// // =====================================================

// const getBookingById = async (
//   req,
//   res
// ) => {

//   try {

//     const booking =
//       await Booking.findById(
//         req.params.id
//       );

//     if (!booking) {
//       return res.status(404).json({
//         success: false,

//         message:
//           "Booking not found.",
//       });
//     }

//     return res.status(200).json({
//       success: true,

//       booking,
//     });

//   } catch (error) {

//     console.error(
//       "GET SINGLE BOOKING ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,

//       message:
//         error.message ||
//         "Unable to fetch booking.",
//     });
//   }
// };

// // =====================================================
// // DELETE BOOKING
// // =====================================================

// const deleteBooking = async (
//   req,
//   res
// ) => {

//   try {

//     const booking =
//       await Booking.findByIdAndDelete(
//         req.params.id
//       );

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Booking not found.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message:
//         "Booking deleted successfully.",
//     });

//   } catch (error) {

//     console.error(
//       "DELETE BOOKING ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "Unable to delete booking.",
//     });
//   }
// };

// // =====================================================
// // CUSTOMER - MY BOOKINGS
// // USER ID + EMAIL BASED
// // =====================================================

// const getMyBookings = async (
//   req,
//   res
// ) => {

//   try {

//     // =================================================
//     // GET USER ID
//     // =================================================

//     const userId =
//       req.user?._id ||
//       req.user?.id ||
//       req.query.userId ||
//       req.body?.userId ||
//       req.headers["x-user-id"] ||
//       null;

//     // =================================================
//     // GET USER EMAIL
//     // =================================================

//     const rawEmail =
//       req.user?.email ||
//       req.user?.emailAddress ||
//       req.query.email ||
//       req.body?.email ||
//       req.headers["x-user-email"] ||
//       "";

//     const userEmail = String(
//       rawEmail
//     )
//       .trim()
//       .toLowerCase();

//     console.log(
//       "========================================"
//     );

//     console.log(
//       "MY BOOKINGS REQUEST"
//     );

//     console.log(
//       "USER ID:",
//       userId
//     );

//     console.log(
//       "USER EMAIL:",
//       userEmail
//     );

//     console.log(
//       "========================================"
//     );

//     // =================================================
//     // LOGIN CHECK
//     // =================================================

//     if (!userId && !userEmail) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "Customer login required.",
//       });
//     }

//     // =================================================
//     // SEARCH CONDITIONS
//     // =================================================

//     const conditions = [];

//     if (userId) {
//       conditions.push({
//         userId:
//           userId,
//       });
//     }

//     if (userEmail) {

//       conditions.push({
//         "passengers.email": {
//           $regex:
//             `^${userEmail.replace(
//               /[.*+?^${}()|[\]\\]/g,
//               "\\$&"
//             )}$`,
//           $options:
//             "i",
//         },
//       });

//       conditions.push({
//         "passenger.email": {
//           $regex:
//             `^${userEmail.replace(
//               /[.*+?^${}()|[\]\\]/g,
//               "\\$&"
//             )}$`,
//           $options:
//             "i",
//         },
//       });

//       conditions.push({
//         email: {
//           $regex:
//             `^${userEmail.replace(
//               /[.*+?^${}()|[\]\\]/g,
//               "\\$&"
//             )}$`,
//           $options:
//             "i",
//         },
//       });

//       conditions.push({
//         customerEmail: {
//           $regex:
//             `^${userEmail.replace(
//               /[.*+?^${}()|[\]\\]/g,
//               "\\$&"
//             )}$`,
//           $options:
//             "i",
//         },
//       });
//     }

//     // =================================================
//     // SAFETY
//     // =================================================

//     if (conditions.length === 0) {
//       return res.status(200).json({
//         success: true,
//         count: 0,
//         bookings: [],
//       });
//     }

//     // =================================================
//     // FIND BOOKINGS
//     // =================================================

//     let bookings = [];

//     // =================================================
//     // NEW BOOKINGS
//     // STRICT USER ID OWNERSHIP
//     // =================================================

//     if (userId) {

//       bookings =
//         await Booking.find({
//           userId:
//             userId,
//         }).sort({
//           createdAt: -1,
//         });
//     }

//     // =================================================
//     // LEGACY BOOKINGS
//     // EMAIL FALLBACK ONLY
//     // =================================================

//     if (
//       bookings.length === 0 &&
//       userEmail
//     ) {

//       const escapedEmail =
//         userEmail.replace(
//           /[.*+?^${}()|[\]\\]/g,
//           "\\$&"
//         );

//       bookings =
//         await Booking.find({

//           $and: [

//             {
//               $or: [

//                 {
//                   email: {
//                     $regex:
//                       `^${escapedEmail}$`,
//                     $options:
//                       "i",
//                   },
//                 },

//                 {
//                   customerEmail: {
//                     $regex:
//                       `^${escapedEmail}$`,
//                     $options:
//                       "i",
//                   },
//                 },

//                 {
//                   "passengers.email": {
//                     $regex:
//                       `^${escapedEmail}$`,
//                     $options:
//                       "i",
//                   },
//                 },

//                 {
//                   "passenger.email": {
//                     $regex:
//                       `^${escapedEmail}$`,
//                     $options:
//                       "i",
//                   },
//                 },

//               ],
//             },

//             // IMPORTANT:
//             // Email fallback sirf un
//             // purani bookings ke liye hai
//             // jisme userId missing hai.

//             {
//               $or: [
//                 {
//                   userId: {
//                     $exists: false,
//                   },
//                 },

//                 {
//                   userId: null,
//                 },
//               ],
//             },

//           ],

//         }).sort({
//           createdAt: -1,
//         });
//     }

//     console.log(
//       "MY BOOKINGS FOUND:",
//       bookings.length
//     );

//     if (bookings.length > 0) {

//       console.log(
//         "BOOKING IDS:",
//         bookings.map(
//           (item) =>
//             item.bookingId
//         )
//       );
//     }

//     console.log(
//       "========================================"
//     );

//     return res.status(200).json({
//       success: true,

//       count:
//         bookings.length,

//       bookings,
//     });

//   } catch (error) {

//     console.error(
//       "GET MY BOOKINGS ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,

//       message:
//         error.message ||
//         "Unable to fetch your bookings.",
//     });
//   }
// };

// // =====================================================
// // CUSTOMER - BOOKING BY PNR
// // =====================================================

// const getMyBookingByPNR = async (
//   req,
//   res
// ) => {

//   try {

//     const userId =
//       req.user?._id ||
//       req.user?.id ||
//       req.query.userId ||
//       req.body?.userId ||
//       req.headers["x-user-id"];

//     const pnr =
//       String(
//         req.params.pnr || ""
//       )
//         .trim()
//         .toUpperCase();

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "User login required",
//       });
//     }

//     if (!pnr) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "PNR is required",
//       });
//     }

//     const booking =
//       await Booking.findOne({

//         userId:
//           userId,

//         pnr:
//           pnr,

//       });

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Booking not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       booking,
//     });

//   } catch (error) {

//     console.error(
//       "getMyBookingByPNR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "Unable to fetch booking",
//     });
//   }
// };

// // =====================================================
// // CUSTOMER - SINGLE BOOKING
// // =====================================================

// const checkMyBooking = async (
//   req,
//   res
// ) => {

//   try {

//     const userId =
//       req.user?._id ||
//       req.user?.id ||
//       req.query.userId ||
//       req.body?.userId ||
//       req.headers["x-user-id"];

//     const bookingId =
//       req.params.bookingId;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "User login required",
//       });
//     }

//     if (!bookingId) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Booking ID is required",
//       });
//     }

//     const booking =
//       await Booking.findOne({
//         _id:
//           bookingId,

//         userId:
//           userId,
//       });

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Booking not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       booking,
//     });

//   } catch (error) {

//     console.error(
//       "checkMyBooking:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "Unable to fetch booking",
//     });
//   }
// };

// // =====================================================
// // CUSTOMER - BOOKING COUNT
// // =====================================================

// const getMyBookingCount = async (
//   req,
//   res
// ) => {

//   try {

//     const userId =
//       req.user?._id ||
//       req.user?.id ||
//       req.query.userId ||
//       req.body?.userId ||
//       req.headers["x-user-id"];

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "User login required",
//       });
//     }

//     const count =
//       await Booking.countDocuments({
//         userId:
//           userId,
//       });

//     return res.status(200).json({
//       success: true,
//       count,
//     });

//   } catch (error) {

//     console.error(
//       "getMyBookingCount:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "Unable to count bookings",
//     });
//   }
// };

// // =====================================================
// // GET BOOKING BY PNR
// // =====================================================

// const getBookingByPNR = async (
//   req,
//   res
// ) => {

//   try {

//     const pnr =
//       String(
//         req.params.pnr ||
//         req.query.pnr ||
//         ""
//       )
//         .trim()
//         .toUpperCase();

//     if (!pnr) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "PNR is required",
//       });
//     }

//     const booking =
//       await Booking.findOne({
//         pnr:
//           pnr,
//       });

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Booking not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       booking,
//     });

//   } catch (error) {

//     console.error(
//       "GET BOOKING BY PNR ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "Unable to fetch booking",
//     });
//   }
// };

// // =====================================================
// // EXPORT
// // =====================================================

// module.exports = {
//   createBooking,
//   getAllBookings,
//   getBookingById,
//   getMyBookings,
//   getBookingByPNR,
//   getMyBookingByPNR,
//   checkMyBooking,
//   getMyBookingCount,
//   deleteBooking,
// };


































































































const Booking = require("../models/Booking");
const Flight = require("../models/Flight");
const AgentWallet = require("../models/AgentWallet");
const WalletTransaction = require("../models/WalletTransaction");

// =====================================================
// HELPERS
// =====================================================

const numberValue = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const generateBookingId = () => {
  return "ST" + Math.floor(100000 + Math.random() * 900000);
};

const getUniqueBookingId = async () => {
  let bookingId;
  let exists = true;

  while (exists) {
    bookingId = generateBookingId();
    exists = await Booking.exists({ bookingId });
  }

  return bookingId;
};

// =====================================================
// EXACT BAGGAGE FROM ADMIN ADD FLIGHT
// =====================================================

const getExactBaggage = (dbFlight) => {
  const firstNonEmpty = (...values) => {
    for (const value of values) {
      if (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
      ) {
        return String(value).trim();
      }
    }

    return "";
  };

  const cabinBaggage = firstNonEmpty(
    dbFlight?.cabinBaggage,
    dbFlight?.cabinBag,
    dbFlight?.cabinBaggageAllowance,

    dbFlight?.baggage?.cabinBaggage,
    dbFlight?.baggage?.cabin,

    dbFlight?.cabins?.[0]?.cabinBaggage,
    dbFlight?.cabins?.[0]?.baggageCabin,
    dbFlight?.cabins?.[0]?.baggage?.cabinBaggage,
    dbFlight?.cabins?.[0]?.baggage?.cabin
  );

  const checkinBaggage = firstNonEmpty(
    dbFlight?.checkinBaggage,
    dbFlight?.checkinBag,
    dbFlight?.checkinBaggageAllowance,

    dbFlight?.baggage?.checkinBaggage,
    dbFlight?.baggage?.checkin,

    dbFlight?.cabins?.[0]?.checkinBaggage,
    dbFlight?.cabins?.[0]?.baggageCheckin,
    dbFlight?.cabins?.[0]?.baggage,
    dbFlight?.cabins?.[0]?.baggage?.checkinBaggage,
    dbFlight?.cabins?.[0]?.baggage?.checkin
  );

  console.log("========================================");
  console.log("ADMIN BAGGAGE");
  console.log("Cabin:", cabinBaggage);
  console.log("Check-in:", checkinBaggage);
  console.log("========================================");

  return {
    cabinBaggage,
    checkinBaggage,
  };
};

// =====================================================
// CREATE BOOKING
// =====================================================

const createBooking = async (req, res) => {
  let bookedFlightId = null;
  let bookedPNR = null;
  let generatedBookingId = null;

  // =====================================================
  // WALLET ROLLBACK STATE
  // =====================================================

  let walletDebited = false;
  let walletAgentId = null;
  let walletDebitAmount = 0;
  let walletBalanceBefore = 0;
  let walletBalanceAfter = 0;

  try {
    const {
      passenger,
      passengers,
      flight,
      flightId,
      seat,
      seats,
      seatPrice,
      meal,
      meals,
      baggage,
      baggages,
      paymentMethod,
      paymentVerified,
      paymentId,
      orderId,
      discount,
      adults,
      children,
      infants,
      fareRole,
      userRole,
    } = req.body;

    // =================================================
    // USER ROLE
    // =================================================

    const authenticatedRole = String(
      req.user?.role || ""
    )
      .trim()
      .toLowerCase();

    const bodyUserRole = String(
      userRole || fareRole || "customer"
    )
      .trim()
      .toLowerCase();

    const normalizedUserRole =
      authenticatedRole === "admin" && req.body?.userId
        ? bodyUserRole
        : authenticatedRole || bodyUserRole;

    const isAdmin =
      authenticatedRole === "admin";

    const isAgent =
      normalizedUserRole === "agent";

    let bookingUserId = null;

    if (
      authenticatedRole === "admin" &&
      req.body?.userId
    ) {
      bookingUserId = req.body.userId;
    } else {
      bookingUserId =
        req.user?._id ||
        req.user?.id ||
        req.body?.userId ||
        req.headers["x-user-id"] ||
        null;
    }

    console.log(
      "BOOKING OWNER:",
      bookingUserId,
      "ROLE:",
      normalizedUserRole,
      "AUTH ROLE:",
      authenticatedRole
    );

    // =================================================
    // PAYMENT
    // =================================================

    const verifiedPayment =
      paymentVerified === true ||
      paymentVerified === "true";

    const normalizedPaymentMethod =
      String(paymentMethod || "")
        .trim()
        .toLowerCase();

    const isWalletPayment =
      normalizedPaymentMethod === "wallet";

    // =================================================
    // WALLET ONLY FOR AGENT
    // =================================================

    if (isWalletPayment && !isAgent) {
      return res.status(403).json({
        success: false,
        message:
          "Wallet payment is available only for agents.",
      });
    }

    // Wallet payment must have agent/user id
    if (
      isWalletPayment &&
      !bookingUserId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Agent ID is required for wallet payment.",
      });
    }

    // =================================================
    // NORMAL PAYMENT GATE
    // =================================================

    if (
      !isAdmin &&
      !verifiedPayment &&
      !isWalletPayment
    ) {
      return res.status(402).json({
        success: false,
        paymentRequired: true,
        paymentVerified: false,
        userRole: normalizedUserRole,
        message:
          "Payment is required before the ticket can be confirmed.",
      });
    }

    // =================================================
    // PASSENGERS
    // =================================================

    let passengerList = [];

    if (
      Array.isArray(passengers) &&
      passengers.length > 0
    ) {
      passengerList = passengers;
    } else if (passenger) {
      passengerList = [
        {
          ...passenger,
          type: passenger.type || "Adult",
        },
      ];
    }

    if (passengerList.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "At least one passenger is required.",
      });
    }

    passengerList = passengerList.map(
      (item) => ({
        ...item,
        type: [
          "Adult",
          "Child",
          "Infant",
        ].includes(item.type)
          ? item.type
          : "Adult",
      })
    );

    for (
      let i = 0;
      i < passengerList.length;
      i++
    ) {
      if (
        !String(
          passengerList[i].firstName || ""
        ).trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            `First name is required for passenger ${
              i + 1
            }.`,
        });
      }

      if (
        !String(
          passengerList[i].lastName || ""
        ).trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Last name is required for passenger ${
              i + 1
            }.`,
        });
      }
    }

    // =================================================
    // FLIGHT ID
    // =================================================

    const requestedFlightId =
      flightId ||
      flight?._id ||
      flight?.id ||
      flight?.flightId;

    if (!requestedFlightId) {
      return res.status(400).json({
        success: false,
        message: "Flight ID is missing.",
      });
    }

    // =================================================
    // GET REAL DATABASE FLIGHT
    // =================================================

    let dbFlight = null;

    try {
      dbFlight =
        await Flight.findById(
          requestedFlightId
        );
    } catch (error) {
      console.log(
        "Invalid Flight ID:",
        requestedFlightId
      );
    }

    if (
      !dbFlight &&
      flight?.flightNo
    ) {
      dbFlight =
        await Flight.findOne({
          flightNo: String(
            flight.flightNo
          )
            .trim()
            .toUpperCase(),
        });
    }

    if (!dbFlight) {
      return res.status(404).json({
        success: false,
        message:
          "Flight not found. Please select the flight again.",
      });
    }

    // =================================================
    // EXACT ADMIN BAGGAGE
    // =================================================

    const {
      cabinBaggage,
      checkinBaggage,
    } = getExactBaggage(dbFlight);

    console.log(
      "========================================"
    );

    console.log(
      "ADMIN BAGGAGE"
    );

    console.log(
      "Cabin:",
      cabinBaggage
    );

    console.log(
      "Check-in:",
      checkinBaggage
    );

    console.log(
      "========================================"
    );

    // =================================================
    // AVAILABLE PNR
    // =================================================

    if (
      !Array.isArray(
        dbFlight.tickets
      ) ||
      dbFlight.tickets.length === 0
    ) {
      return res.status(409).json({
        success: false,
        message:
          "No ticket / PNR is available for this flight.",
      });
    }

    const availableTicket =
      dbFlight.tickets.find(
        (ticket) =>
          ticket.status === "Available"
      );

    if (!availableTicket) {
      return res.status(409).json({
        success: false,
        message:
          "No ticket / PNR is available for this flight.",
      });
    }

    const selectedPNR =
      String(
        availableTicket.pnr || ""
      )
        .trim()
        .toUpperCase();

    // =================================================
    // BOOKING ID
    // =================================================

    const bookingId =
      await getUniqueBookingId();

    generatedBookingId =
      bookingId;

    // =================================================
    // PASSENGER COUNTS
    // =================================================

    const adultCount =
      numberValue(adults) ||
      passengerList.filter(
        (item) =>
          item.type === "Adult"
      ).length;

    const childCount =
      numberValue(children) ||
      passengerList.filter(
        (item) =>
          item.type === "Child"
      ).length;

    const infantCount =
      numberValue(infants) ||
      passengerList.filter(
        (item) =>
          item.type === "Infant"
      ).length;

    const totalPassengerCount =
      passengerList.length;

    // =================================================
    // EXACT CUSTOMER / AGENT FARES
    // =================================================

    const customerAdultFare =
      numberValue(
        dbFlight.adultFare ??
          dbFlight.finalPrice ??
          dbFlight.price
      );

    const customerChildFare =
      numberValue(
        dbFlight.childFare ??
          customerAdultFare
      );

    const customerInfantFare =
      numberValue(
        dbFlight.infantFare
      );

    const agentAdultFare =
      numberValue(
        dbFlight.agentAdultFare
      );

    const agentChildFare =
      numberValue(
        dbFlight.agentChildFare ??
          agentAdultFare
      );

    const agentInfantFare =
      numberValue(
        dbFlight.agentInfantFare ??
          agentAdultFare
      );

    const selectedAdultFare =
      isAgent
        ? agentAdultFare
        : customerAdultFare;

    const selectedChildFare =
      isAgent
        ? agentChildFare
        : customerChildFare;

    const selectedInfantFare =
      isAgent
        ? agentInfantFare
        : customerInfantFare;

    // =================================================
    // FLIGHT FARE
    // =================================================

    const flightFare =
      selectedAdultFare *
        adultCount +
      selectedChildFare *
        childCount +
      selectedInfantFare *
        infantCount;

    // =================================================
    // SEATS
    // =================================================

    let seatList = [];

    if (Array.isArray(seats)) {
      seatList = seats;
    } else if (seat) {
      seatList = [
        {
          seatNumber: seat,
          price:
            numberValue(
              seatPrice
            ),
        },
      ];
    }

    const normalizedSeats =
      seatList
        .filter(Boolean)
        .map(
          (item, index) => {
            const passengerAtIndex =
              passengerList[index];

            return {
              passengerId:
                passengerAtIndex?._id ||
                null,

              passengerName:
                passengerAtIndex
                  ? `${
                      passengerAtIndex.firstName ||
                      ""
                    } ${
                      passengerAtIndex.lastName ||
                      ""
                    }`.trim()
                  : "",

              seatNumber:
                String(
                  item?.seatNumber ||
                    item?.seat ||
                    ""
                ).trim(),

              price:
                numberValue(
                  item?.price ||
                    item?.seatPrice ||
                    0
                ),
            };
          }
        );

    const seatFare =
      normalizedSeats.reduce(
        (total, item) =>
          total +
          numberValue(
            item.price
          ),
        0
      ) ||
      numberValue(
        seatPrice
      );

    // =================================================
    // MEALS
    // =================================================

    let mealList = [];

    if (Array.isArray(meals)) {
      mealList = meals;
    } else if (meal) {
      mealList = [meal];
    }

    const normalizedMeals =
      mealList
        .filter(Boolean)
        .map(
          (item, index) => {
            const passengerAtIndex =
              passengerList[index];

            return {
              passengerId:
                passengerAtIndex?._id ||
                null,

              passengerName:
                passengerAtIndex
                  ? `${
                      passengerAtIndex.firstName ||
                      ""
                    } ${
                      passengerAtIndex.lastName ||
                      ""
                    }`.trim()
                  : "",

              name:
                typeof item?.name ===
                "string"
                  ? item.name
                  : "No Meal",

              price:
                numberValue(
                  item?.price
                ),
            };
          }
        );

    const mealFare =
      normalizedMeals.reduce(
        (total, item) =>
          total +
          numberValue(
            item.price
          ),
        0
      );

    // =================================================
    // BAGGAGE
    // =================================================

    let baggageList = [];

    if (
      Array.isArray(baggages)
    ) {
      baggageList = baggages;
    } else if (baggage) {
      baggageList = [baggage];
    }

    const normalizedBaggages =
      passengerList.map(
        (
          passengerAtIndex,
          index
        ) => {
          const frontendBaggage =
            baggageList[index] ||
            {};

          return {
            passengerId:
              passengerAtIndex?._id ||
              null,

            passengerName:
              `${
                passengerAtIndex.firstName ||
                ""
              } ${
                passengerAtIndex.lastName ||
                ""
              }`.trim(),

            cabinBaggage:
              cabinBaggage,

            cabin:
              cabinBaggage,

            checkinBaggage:
              checkinBaggage,

            checkin:
              checkinBaggage,

            weight:
              checkinBaggage,

            price:
              numberValue(
                frontendBaggage?.price
              ),
          };
        }
      );

    const baggageFare =
      normalizedBaggages.reduce(
        (total, item) =>
          total +
          numberValue(
            item.price
          ),
        0
      );

    // =================================================
    // OTHER CHARGES
    // =================================================

    const taxes = 0;

    const convenienceFee = 0;

    const discountAmount =
      Math.max(
        0,
        numberValue(discount)
      );

    // =================================================
    // FINAL TOTAL
    // =================================================

    const calculatedTotal =
      flightFare +
      seatFare +
      mealFare +
      baggageFare +
      taxes +
      convenienceFee -
      discountAmount;

    if (
      calculatedTotal < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid booking total.",
      });
    }

    // =================================================
    // WALLET PAYMENT
    // IMPORTANT:
    // EXACT AGENT FARE WILL BE DEDUCTED
    // =================================================

    if (isWalletPayment) {
      walletAgentId =
        bookingUserId;

      walletDebitAmount =
        calculatedTotal;

      console.log(
        "========================================"
      );

      console.log(
        "WALLET PAYMENT"
      );

      console.log(
        "Agent ID:",
        walletAgentId
      );

      console.log(
        "Wallet Debit Amount:",
        walletDebitAmount
      );

      console.log(
        "========================================"
      );

      if (
        walletDebitAmount <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid wallet payment amount.",
        });
      }

      // =================================================
      // ATOMIC WALLET DEDUCTION
      // This prevents double spending.
      // =================================================

      const updatedWallet =
        await AgentWallet.findOneAndUpdate(
          {
            agentId:
              walletAgentId,

            isActive: true,

            balance: {
              $gte:
                walletDebitAmount,
            },
          },
          {
            $inc: {
              balance:
                -walletDebitAmount,

              totalDebit:
                walletDebitAmount,
            },
          },
          {
            new: true,
          }
        );

      if (!updatedWallet) {
        const currentWallet =
          await AgentWallet.findOne({
            agentId:
              walletAgentId,
          });

        const currentBalance =
          numberValue(
            currentWallet?.balance
          );

        return res.status(402).json({
          success: false,
          message:
            `Insufficient wallet balance. Available: ₹${currentBalance.toLocaleString(
              "en-IN"
            )} | Required: ₹${walletDebitAmount.toLocaleString(
              "en-IN"
            )}`,
          walletBalance:
            currentBalance,
          requiredAmount:
            walletDebitAmount,
        });
      }

      walletDebited = true;

      walletBalanceAfter =
        numberValue(
          updatedWallet.balance
        );

      walletBalanceBefore =
        walletBalanceAfter +
        walletDebitAmount;

      console.log(
        "WALLET DEBIT SUCCESS"
      );

      console.log(
        "Balance Before:",
        walletBalanceBefore
      );

      console.log(
        "Debit:",
        walletDebitAmount
      );

      console.log(
        "Balance After:",
        walletBalanceAfter
      );
    }

    // =================================================
    // FIRST PASSENGER
    // =================================================

    const firstPassenger =
      passengerList[0];

    const firstPassengerName =
      `${
        firstPassenger.firstName ||
        ""
      } ${
        firstPassenger.lastName ||
        ""
      }`.trim();

    // =================================================
    // BOOK PNR
    // =================================================

    const updatedFlight =
      await Flight.findOneAndUpdate(
        {
          _id:
            dbFlight._id,

          tickets: {
            $elemMatch: {
              pnr:
                selectedPNR,

              status:
                "Available",
            },
          },
        },

        {
          $set: {
            "tickets.$.status":
              "Booked",

            "tickets.$.bookingId":
              bookingId,

            "tickets.$.passengerName":
              firstPassengerName,

            "tickets.$.bookedAt":
              new Date(),
          },
        },

        {
          new: true,
        }
      );

    if (!updatedFlight) {
      return res.status(409).json({
        success: false,
        message:
          "This ticket was just booked. Please try again.",
      });
    }

    bookedFlightId =
      dbFlight._id;

    bookedPNR =
      selectedPNR;

    // =================================================
    // FLIGHT SNAPSHOT
    // =================================================

    const flightSnapshot = {
      flightId:
        dbFlight._id,

      airline:
        dbFlight.airline || "",

      flightNo:
        dbFlight.flightNo || "",

      flightType:
        dbFlight.flightType ||
        "Domestic",

      aircraft:
        dbFlight.aircraft || "",

      fromCity:
        dbFlight.fromCity || "",

      fromAirport:
        dbFlight.fromAirport || "",

      fromCode:
        dbFlight.fromCode || "",

      toCity:
        dbFlight.toCity || "",

      toAirport:
        dbFlight.toAirport || "",

      toCode:
        dbFlight.toCode || "",

      departureDate:
        dbFlight.departureDate || "",

      departureTime:
        dbFlight.departureTime || "",

      departureTerminal:
        dbFlight.departureTerminal || "",

      arrivalDate:
        dbFlight.arrivalDate || "",

      arrivalTime:
        dbFlight.arrivalTime || "",

      arrivalTerminal:
        dbFlight.arrivalTerminal || "",

      duration:
        dbFlight.duration || "",

      stops:
        dbFlight.stops ||
        "Non-stop",

      stopAirport:
        dbFlight.stopAirport || "",

      price:
        selectedAdultFare,

      finalPrice:
        selectedAdultFare,

      adultFare:
        selectedAdultFare,

      childFare:
        selectedChildFare,

      infantFare:
        selectedInfantFare,

      fareRole:
        isAgent
          ? "agent"
          : "customer",

      cabinBaggage:
        cabinBaggage,

      checkinBaggage:
        checkinBaggage,

      baggage: {
        cabinBaggage:
          cabinBaggage,

        cabin:
          cabinBaggage,

        checkinBaggage:
          checkinBaggage,

        checkin:
          checkinBaggage,

        weight:
          checkinBaggage,
      },

      logo:
        dbFlight.logo || "",

      airlineLogo:
        dbFlight.airlineLogo || "",
    };

    // =================================================
    // PAYMENT STATUS
    // =================================================

    const finalPaymentStatus =
      isAdmin ||
      verifiedPayment ||
      isWalletPayment
        ? "Paid"
        : "Pending";

    const finalBookingStatus =
      isAdmin ||
      verifiedPayment ||
      isWalletPayment
        ? "Confirmed"
        : "Pending";

    // =================================================
    // CREATE BOOKING
    // =================================================

    const booking =
      await Booking.create({

        bookingId:
          bookingId,

        pnr:
          selectedPNR,

        flightId:
          dbFlight._id,

        userId:
          bookingUserId,

        userRole:
          normalizedUserRole,

        adults:
          adultCount,

        children:
          childCount,

        infants:
          infantCount,

        totalPassengers:
          totalPassengerCount,

        passengers:
          passengerList,

        passenger:
          firstPassenger,

        flight:
          flightSnapshot,

        seats:
          normalizedSeats,

        seat:
          normalizedSeats[0]
            ?.seatNumber ||
          seat ||
          "",

        seatPrice:
          seatFare,

        meals:
          normalizedMeals,

        meal: {
          name:
            normalizedMeals[0]
              ?.name ||
            "No Meal",

          price:
            mealFare,
        },

        mealPrice:
          mealFare,

        baggages:
          normalizedBaggages,

        baggage: {
          cabinBaggage:
            cabinBaggage,

          cabin:
            cabinBaggage,

          checkinBaggage:
            checkinBaggage,

          checkin:
            checkinBaggage,

          weight:
            checkinBaggage,

          price:
            baggageFare,
        },

        baggagePrice:
          baggageFare,

        flightFare:
          flightFare,

        adultFare:
          selectedAdultFare,

        childFare:
          selectedChildFare,

        infantFare:
          selectedInfantFare,

        fareRole:
          isAgent
            ? "agent"
            : "customer",

        seatFare:
          seatFare,

        mealFare:
          mealFare,

        paymentMethod:
          isAdmin
            ? "admin"
            : isWalletPayment
            ? "wallet"
            : paymentMethod ||
              "upi",

        paymentStatus:
          finalPaymentStatus,

        bookingStatus:
          finalBookingStatus,

        paymentId:
          isWalletPayment
            ? "WALLET_PAYMENT"
            : paymentId || "",

        orderId:
          isWalletPayment
            ? `WALLET_${bookingId}`
            : orderId || "",

        discount:
          discountAmount,

        taxes:
          taxes,

        convenienceFee:
          convenienceFee,

        total:
          calculatedTotal,
      });

    // =================================================
    // WALLET TRANSACTION
    // =================================================

    if (
      isWalletPayment &&
      walletDebited
    ) {
      try {

        await WalletTransaction.create({
          agentId:
            walletAgentId,

          type:
            "debit",

          amount:
            walletDebitAmount,

          balanceBefore:
            walletBalanceBefore,

          balanceAfter:
            walletBalanceAfter,

          bookingId:
            booking._id,

          bookingNumber:
            booking.bookingId,

          pnr:
            booking.pnr,

          note:
            `Wallet payment for booking ${booking.bookingId}`,

          performedBy:
            walletAgentId,

          performedByRole:
            "agent",
        });

        console.log(
          "========================================"
        );

        console.log(
          "WALLET TRANSACTION CREATED"
        );

        console.log(
          "Booking:",
          booking.bookingId
        );

        console.log(
          "PNR:",
          booking.pnr
        );

        console.log(
          "Amount:",
          walletDebitAmount
        );

        console.log(
          "Balance:",
          walletBalanceAfter
        );

        console.log(
          "========================================"
        );

      } catch (
        walletTransactionError
      ) {

        // Booking transaction create
        // failed, so remove booking.
        await Booking.deleteOne({
          _id:
            booking._id,
        });

        throw walletTransactionError;
      }
    }

    // =================================================
    // SUCCESS
    // =================================================

    console.log(
      "========================================"
    );

    console.log(
      "BOOKING CREATED"
    );

    console.log(
      "Booking ID:",
      booking.bookingId
    );

    console.log(
      "PNR:",
      booking.pnr
    );

    console.log(
      "USER ID:",
      booking.userId
    );

    console.log(
      "PASSENGER EMAIL:",
      booking.passengers?.[0]
        ?.email
    );

    console.log(
      "Cabin Baggage:",
      cabinBaggage
    );

    console.log(
      "Check-in Baggage:",
      checkinBaggage
    );

    console.log(
      "Fare Role:",
      booking.fareRole
    );

    console.log(
      "Adult Fare:",
      booking.adultFare
    );

    console.log(
      "FINAL TOTAL:",
      booking.total
    );

    if (isWalletPayment) {
      console.log(
        "WALLET DEBIT:",
        walletDebitAmount
      );

      console.log(
        "WALLET BALANCE AFTER:",
        walletBalanceAfter
      );
    }

    console.log(
      "========================================"
    );

    return res.status(201).json({
      success: true,

      message:
        isAdmin
          ? "Admin booking confirmed successfully."
          : isWalletPayment
          ? "Wallet payment successful and booking confirmed successfully."
          : "Payment verified and booking confirmed successfully.",

      booking,

      userRole:
        normalizedUserRole,

      paymentRequired:
        !isAdmin &&
        !isWalletPayment,

      paymentVerified:
        isAdmin ||
        isWalletPayment ||
        verifiedPayment,

      walletPayment:
        isWalletPayment,

      walletBalance:
        isWalletPayment
          ? walletBalanceAfter
          : undefined,
    });

  } catch (error) {

    console.error(
      "========================================"
    );

    console.error(
      "CREATE BOOKING ERROR:",
      error
    );

    console.error(
      "========================================"
    );

    // =================================================
    // ROLLBACK PNR
    // =================================================

    if (
      bookedFlightId &&
      bookedPNR &&
      generatedBookingId
    ) {
      try {

        await Flight.updateOne(
          {
            _id:
              bookedFlightId,

            tickets: {
              $elemMatch: {
                pnr:
                  bookedPNR,

                bookingId:
                  generatedBookingId,
              },
            },
          },

          {
            $set: {
              "tickets.$.status":
                "Available",

              "tickets.$.bookingId":
                "",

              "tickets.$.passengerName":
                "",

              "tickets.$.bookedAt":
                null,
            },
          }
        );

        console.log(
          "PNR ROLLBACK SUCCESS:",
          bookedPNR
        );

      } catch (
        rollbackError
      ) {

        console.error(
          "PNR ROLLBACK ERROR:",
          rollbackError
        );
      }
    }

    // =================================================
    // ROLLBACK WALLET DEBIT
    // =================================================

    if (
      walletDebited &&
      walletAgentId &&
      walletDebitAmount > 0
    ) {
      try {

        const refundedWallet =
          await AgentWallet.findOneAndUpdate(
            {
              agentId:
                walletAgentId,

              isActive:
                true,
            },

            {
              $inc: {
                balance:
                  walletDebitAmount,

                totalDebit:
                  -walletDebitAmount,
              },
            },

            {
              new: true,
            }
          );

        console.log(
          "========================================"
        );

        console.log(
          "WALLET DEBIT ROLLED BACK"
        );

        console.log(
          "Amount:",
          walletDebitAmount
        );

        console.log(
          "New Balance:",
          refundedWallet?.balance
        );

        console.log(
          "========================================"
        );

      } catch (
        walletRollbackError
      ) {

        console.error(
          "WALLET ROLLBACK ERROR:",
          walletRollbackError
        );
      }
    }

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to create booking.",
    });
  }
};

// =====================================================
// GET ALL BOOKINGS
// =====================================================

const getAllBookings = async (
  req,
  res
) => {

  try {

    const bookings =
      await Booking.find()
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,

      count:
        bookings.length,

      bookings,
    });

  } catch (error) {

    console.error(
      "GET BOOKINGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to fetch bookings.",
    });
  }
};

// =====================================================
// GET SINGLE BOOKING
// =====================================================

const getBookingById = async (
  req,
  res
) => {

  try {

    const booking =
      await Booking.findById(
        req.params.id
      );

    if (!booking) {
      return res.status(404).json({
        success: false,

        message:
          "Booking not found.",
      });
    }

    return res.status(200).json({
      success: true,

      booking,
    });

  } catch (error) {

    console.error(
      "GET SINGLE BOOKING ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to fetch booking.",
    });
  }
};

// =====================================================
// DELETE BOOKING
// =====================================================

const deleteBooking = async (
  req,
  res
) => {

  try {

    const booking =
      await Booking.findByIdAndDelete(
        req.params.id
      );

    if (!booking) {
      return res.status(404).json({
        success: false,

        message:
          "Booking not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Booking deleted successfully.",
    });

  } catch (error) {

    console.error(
      "DELETE BOOKING ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to fetch booking.",
    });
  }
};

// =====================================================
// CUSTOMER - MY BOOKINGS
// USER ID + EMAIL BASED
// =====================================================

const getMyBookings = async (
  req,
  res
) => {

  try {

    // =================================================
    // GET USER ID
    // =================================================

    const userId =
      req.user?._id ||
      req.user?.id ||
      req.query.userId ||
      req.body?.userId ||
      req.headers["x-user-id"] ||
      null;

    // =================================================
    // GET USER EMAIL
    // =================================================

    const rawEmail =
      req.user?.email ||
      req.user?.emailAddress ||
      req.query.email ||
      req.body?.email ||
      req.headers["x-user-email"] ||
      "";

    const userEmail =
      String(rawEmail)
        .trim()
        .toLowerCase();

    console.log(
      "========================================"
    );

    console.log(
      "MY BOOKINGS REQUEST"
    );

    console.log(
      "USER ID:",
      userId
    );

    console.log(
      "USER EMAIL:",
      userEmail
    );

    console.log(
      "========================================"
    );

    // =================================================
    // LOGIN CHECK
    // =================================================

    if (
      !userId &&
      !userEmail
    ) {
      return res.status(401).json({
        success: false,

        message:
          "Customer login required.",
      });
    }

    // =================================================
    // SEARCH CONDITIONS
    // =================================================

    const conditions = [];

    if (userId) {
      conditions.push({
        userId:
          userId,
      });
    }

    if (userEmail) {

      conditions.push({
        "passengers.email": {
          $regex:
            `^${userEmail.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            )}$`,

          $options:
            "i",
        },
      });

      conditions.push({
        "passenger.email": {
          $regex:
            `^${userEmail.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            )}$`,

          $options:
            "i",
        },
      });

      conditions.push({
        email: {
          $regex:
            `^${userEmail.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            )}$`,

          $options:
            "i",
        },
      });

      conditions.push({
        customerEmail: {
          $regex:
            `^${userEmail.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            )}$`,

          $options:
            "i",
        },
      });
    }

    // =================================================
    // SAFETY
    // =================================================

    if (
      conditions.length === 0
    ) {
      return res.status(200).json({
        success: true,

        count: 0,

        bookings: [],
      });
    }

    // =================================================
    // FIND BOOKINGS
    // =================================================

    let bookings = [];

    // =================================================
    // NEW BOOKINGS
    // STRICT USER ID OWNERSHIP
    // =================================================

    if (userId) {

      bookings =
        await Booking.find({
          userId:
            userId,
        }).sort({
          createdAt: -1,
        });
    }

    // =================================================
    // LEGACY BOOKINGS
    // EMAIL FALLBACK ONLY
    // =================================================

    if (
      bookings.length === 0 &&
      userEmail
    ) {

      const escapedEmail =
        userEmail.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );

      bookings =
        await Booking.find({

          $and: [

            {
              $or: [

                {
                  email: {
                    $regex:
                      `^${escapedEmail}$`,

                    $options:
                      "i",
                  },
                },

                {
                  customerEmail: {
                    $regex:
                      `^${escapedEmail}$`,

                    $options:
                      "i",
                  },
                },

                {
                  "passengers.email": {
                    $regex:
                      `^${escapedEmail}$`,

                    $options:
                      "i",
                  },
                },

                {
                  "passenger.email": {
                    $regex:
                      `^${escapedEmail}$`,

                    $options:
                      "i",
                  },
                },
              ],
            },

            // IMPORTANT:
            // Email fallback sirf un
            // purani bookings ke liye hai
            // jisme userId missing hai.

            {
              $or: [

                {
                  userId: {
                    $exists:
                      false,
                  },
                },

                {
                  userId:
                    null,
                },
              ],
            },
          ],

        }).sort({
          createdAt: -1,
        });
    }

    console.log(
      "MY BOOKINGS FOUND:",
      bookings.length
    );

    if (
      bookings.length > 0
    ) {

      console.log(
        "BOOKING IDS:",
        bookings.map(
          (item) =>
            item.bookingId
        )
      );
    }

    console.log(
      "========================================"
    );

    return res.status(200).json({
      success: true,

      count:
        bookings.length,

      bookings,
    });

  } catch (error) {

    console.error(
      "GET MY BOOKINGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to fetch your bookings.",
    });
  }
};

// =====================================================
// CUSTOMER - BOOKING BY PNR
// =====================================================

const getMyBookingByPNR = async (
  req,
  res
) => {

  try {

    const userId =
      req.user?._id ||
      req.user?.id ||
      req.query.userId ||
      req.body?.userId ||
      req.headers["x-user-id"];

    const pnr =
      String(
        req.params.pnr || ""
      )
        .trim()
        .toUpperCase();

    if (!userId) {
      return res.status(401).json({
        success: false,

        message:
          "User login required",
      });
    }

    if (!pnr) {
      return res.status(400).json({
        success: false,

        message:
          "PNR is required",
      });
    }

    const booking =
      await Booking.findOne({

        userId:
          userId,

        pnr:
          pnr,
      });

    if (!booking) {
      return res.status(404).json({
        success: false,

        message:
          "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,

      booking,
    });

  } catch (error) {

    console.error(
      "getMyBookingByPNR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to fetch booking",
    });
  }
};

// =====================================================
// CUSTOMER - SINGLE BOOKING
// =====================================================

const checkMyBooking = async (
  req,
  res
) => {

  try {

    const userId =
      req.user?._id ||
      req.user?.id ||
      req.query.userId ||
      req.body?.userId ||
      req.headers["x-user-id"];

    const bookingId =
      req.params.bookingId;

    if (!userId) {
      return res.status(401).json({
        success: false,

        message:
          "User login required",
      });
    }

    if (!bookingId) {
      return res.status(400).json({
        success: false,

        message:
          "Booking ID is required",
      });
    }

    const booking =
      await Booking.findOne({

        _id:
          bookingId,

        userId:
          userId,
      });

    if (!booking) {
      return res.status(404).json({
        success: false,

        message:
          "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,

      booking,
    });

  } catch (error) {

    console.error(
      "checkMyBooking:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to fetch booking",
    });
  }
};

// =====================================================
// CUSTOMER - BOOKING COUNT
// =====================================================

const getMyBookingCount = async (
  req,
  res
) => {

  try {

    const userId =
      req.user?._id ||
      req.user?.id ||
      req.query.userId ||
      req.body?.userId ||
      req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,

        message:
          "User login required",
      });
    }

    const count =
      await Booking.countDocuments({
        userId:
          userId,
      });

    return res.status(200).json({
      success: true,

      count,
    });

  } catch (error) {

    console.error(
      "getMyBookingCount:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to count bookings",
    });
  }
};

// =====================================================
// GET BOOKING BY PNR
// =====================================================

const getBookingByPNR = async (
  req,
  res
) => {

  try {

    const pnr =
      String(
        req.params.pnr ||
        req.query.pnr ||
        ""
      )
        .trim()
        .toUpperCase();

    if (!pnr) {
      return res.status(400).json({
        success: false,

        message:
          "PNR is required",
      });
    }

    const booking =
      await Booking.findOne({
        pnr:
          pnr,
      });

    if (!booking) {
      return res.status(404).json({
        success: false,

        message:
          "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,

      booking,
    });

  } catch (error) {

    console.error(
      "GET BOOKING BY PNR ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to fetch booking",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createBooking,

  getAllBookings,

  getBookingById,

  getMyBookings,

  getBookingByPNR,

  getMyBookingByPNR,

  checkMyBooking,

  getMyBookingCount,

  deleteBooking,
};






