// // // // // const express = require("express");

// // // // // const {
// // // // //   createBooking,
// // // // //   getAllBookings,
// // // // //   getBookingById,
// // // // //   deleteBooking,
// // // // // } = require("../controllers/bookingController");

// // // // // const router = express.Router();

// // // // // // ==========================================
// // // // // // CREATE BOOKING
// // // // // // POST /api/bookings
// // // // // // ==========================================

// // // // // router.post(
// // // // //   "/",
// // // // //   createBooking
// // // // // );

// // // // // // ==========================================
// // // // // // GET ALL BOOKINGS
// // // // // // GET /api/bookings
// // // // // // ==========================================

// // // // // router.get(
// // // // //   "/",
// // // // //   getAllBookings
// // // // // );

// // // // // // ==========================================
// // // // // // GET SINGLE BOOKING
// // // // // // GET /api/bookings/:id
// // // // // // ==========================================

// // // // // router.get(
// // // // //   "/:id",
// // // // //   getBookingById
// // // // // );

// // // // // // ==========================================
// // // // // // DELETE BOOKING
// // // // // // DELETE /api/bookings/:id
// // // // // // ==========================================

// // // // // router.delete(
// // // // //   "/:id",
// // // // //   deleteBooking
// // // // // );

// // // // // module.exports = router;


// // // // const express = require("express");

// // // // const {
// // // //   createBooking,
// // // //   getAllBookings,
// // // //   getBookingById,
// // // //   deleteBooking,
// // // // } = require("../controllers/bookingController");

// // // // const router =
// // // //   express.Router();

// // // // // ==========================================
// // // // // CREATE BOOKING
// // // // // ==========================================

// // // // router.post(
// // // //   "/",
// // // //   createBooking
// // // // );

// // // // // ==========================================
// // // // // GET ALL BOOKINGS
// // // // // ==========================================

// // // // router.get(
// // // //   "/",
// // // //   getAllBookings
// // // // );

// // // // // ==========================================
// // // // // GET SINGLE BOOKING
// // // // // ==========================================

// // // // router.get(
// // // //   "/:id",
// // // //   getBookingById
// // // // );

// // // // // ==========================================
// // // // // DELETE BOOKING
// // // // // ==========================================

// // // // router.delete(
// // // //   "/:id",
// // // //   deleteBooking
// // // // );

// // // // module.exports = router;



// // // const express = require("express");

// // // const router = express.Router();

// // // const bookingController = require("../controllers/bookingController");


// // // // =====================================================
// // // // CUSTOMER — MY BOOKINGS
// // // // IMPORTANT: ye route /:id se pehle hona chahiye
// // // // =====================================================

// // // router.get(
// // //   "/my-bookings",
// // //   bookingController.getMyBookings
// // // );


// // // // =====================================================
// // // // CUSTOMER — BOOKING BY PNR
// // // // =====================================================

// // // router.get(
// // //   "/my-bookings/pnr/:pnr",
// // //   bookingController.getMyBookingByPNR
// // // );


// // // // =====================================================
// // // // CUSTOMER — SINGLE OWN BOOKING
// // // // =====================================================

// // // router.get(
// // //   "/my-bookings/:bookingId",
// // //   bookingController.checkMyBooking
// // // );


// // // // =====================================================
// // // // CUSTOMER — BOOKING COUNT
// // // // =====================================================

// // // router.get(
// // //   "/my-bookings-count",
// // //   bookingController.getMyBookingCount
// // // );


// // // // =====================================================
// // // // CREATE BOOKING
// // // // =====================================================

// // // router.post(
// // //   "/",
// // //   bookingController.createBooking
// // // );


// // // // =====================================================
// // // // GET ALL BOOKINGS
// // // // =====================================================

// // // router.get(
// // //   "/",
// // //   bookingController.getAllBookings
// // // );


// // // // =====================================================
// // // // GET BOOKING BY ID
// // // // =====================================================

// // // router.get(
// // //   "/:id",
// // //   bookingController.getBookingById
// // // );


// // // // =====================================================
// // // // DELETE BOOKING
// // // // =====================================================

// // // router.delete(
// // //   "/:id",
// // //   bookingController.deleteBooking
// // // );


// // // module.exports = router;













// // const express = require("express");

// // const router = express.Router();

// // const bookingController = require("../controllers/bookingController");
// // // const paymentController = require("../controllers/paymentController");

// // // =====================================================
// // // CUSTOMER — MY BOOKINGS
// // // IMPORTANT: ye route /:id se pehle hona chahiye
// // // =====================================================

// // router.get(
// //   "/my-bookings",
// //   bookingController.getMyBookings
// // );

// // // =====================================================
// // // CUSTOMER — BOOKING BY PNR
// // // =====================================================

// // router.get(
// //   "/my-bookings/pnr/:pnr",
// //   bookingController.getMyBookingByPNR
// // );

// // // =====================================================
// // // CUSTOMER — SINGLE OWN BOOKING
// // // =====================================================

// // router.get(
// //   "/my-bookings/:bookingId",
// //   bookingController.checkMyBooking
// // );

// // // =====================================================
// // // CUSTOMER — BOOKING COUNT
// // // =====================================================

// // router.get(
// //   "/my-bookings-count",
// //   bookingController.getMyBookingCount
// // );

// // // =====================================================
// // // RAZORPAY — CREATE PAYMENT ORDER
// // // =====================================================

// // // router.post(
// // //   "/payment/create-order",
// // //   paymentController.createOrder
// // // );

// // // =====================================================
// // // RAZORPAY — VERIFY PAYMENT
// // // =====================================================

// // // router.post(
// // //   "/payment/verify",
// // //   paymentController.verifyPayment
// // // );


// // // =====================================================
// // // CREATE BOOKING
// // // =====================================================

// // router.post(
// //   "/",
// //   bookingController.createBooking
// // );

// // // =====================================================
// // // GET ALL BOOKINGS
// // // =====================================================

// // router.get(
// //   "/",
// //   bookingController.getAllBookings
// // );

// // // =====================================================
// // // GET BOOKING BY ID
// // // =====================================================

// // router.get(
// //   "/:id",
// //   bookingController.getBookingById
// // );

// // // =====================================================
// // // DELETE BOOKING
// // // =====================================================

// // router.delete(
// //   "/:id",
// //   bookingController.deleteBooking
// // );

// // module.exports = router;









// const express = require("express");

// const router = express.Router();

// const bookingController = require("../controllers/bookingController");
// const paymentController = require("../controllers/paymentController");

// // =====================================================
// // CUSTOMER — MY BOOKINGS
// // =====================================================

// router.get(
//   "/my-bookings",
//   bookingController.getMyBookings
// );

// // =====================================================
// // CUSTOMER — BOOKING BY PNR
// // =====================================================

// router.get(
//   "/my-bookings/pnr/:pnr",
//   bookingController.getMyBookingByPNR
// );

// // =====================================================
// // CUSTOMER — SINGLE OWN BOOKING
// // =====================================================

// router.get(
//   "/my-bookings/:bookingId",
//   bookingController.checkMyBooking
// );

// // =====================================================
// // CUSTOMER — BOOKING COUNT
// // =====================================================

// router.get(
//   "/my-bookings-count",
//   bookingController.getMyBookingCount
// );

// // =====================================================
// // RAZORPAY — CREATE PAYMENT ORDER
// // =====================================================

// router.post(
//   "/payment/create-order",
//   paymentController.createOrder
// );

// // =====================================================
// // RAZORPAY — VERIFY PAYMENT
// // =====================================================

// router.post(
//   "/payment/verify",
//   paymentController.verifyPayment
// );

// // =====================================================
// // CREATE BOOKING
// // =====================================================

// router.post(
//   "/",
//   bookingController.createBooking
// );

// // =====================================================
// // GET ALL BOOKINGS
// // =====================================================

// router.get(
//   "/",
//   bookingController.getAllBookings
// );

// // =====================================================
// // GET BOOKING BY ID
// // =====================================================

// router.get(
//   "/:id",
//   bookingController.getBookingById
// );

// // =====================================================
// // DELETE BOOKING
// // =====================================================

// router.delete(
//   "/:id",
//   bookingController.deleteBooking
// );

// module.exports = router;



const express = require("express");

const router = express.Router();

const bookingController = require("../controllers/bookingController");

// =====================================================
// CUSTOMER — MY BOOKINGS
// =====================================================

router.get(
  "/my-bookings",
  bookingController.getMyBookings
);

// =====================================================
// CUSTOMER — BOOKING BY PNR
// =====================================================

router.get(
  "/my-bookings/pnr/:pnr",
  bookingController.getMyBookingByPNR
);

// =====================================================
// CUSTOMER — SINGLE OWN BOOKING
// =====================================================

router.get(
  "/my-bookings/:bookingId",
  bookingController.checkMyBooking
);

// =====================================================
// CUSTOMER — BOOKING COUNT
// =====================================================

router.get(
  "/my-bookings-count",
  bookingController.getMyBookingCount
);

// =====================================================
// CREATE BOOKING
// =====================================================

router.post(
  "/",
  bookingController.createBooking
);

// =====================================================
// GET ALL BOOKINGS
// =====================================================

router.get(
  "/",
  bookingController.getAllBookings
);

// =====================================================
// GET BOOKING BY ID
// =====================================================

router.get(
  "/:id",
  bookingController.getBookingById
);

// =====================================================
// DELETE BOOKING
// =====================================================

router.delete(
  "/:id",
  bookingController.deleteBooking
);

module.exports = router;