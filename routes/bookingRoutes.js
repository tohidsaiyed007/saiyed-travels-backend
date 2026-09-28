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