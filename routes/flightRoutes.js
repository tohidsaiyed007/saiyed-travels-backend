
// const express = require("express");

// const router = express.Router();

// const {
//   addFlight,
//   getFlights,
//   getFlightById,
//   updateFlight,
//   deleteFlight,
// } = require("../controllers/flightController");

// const {
//   protect,
//   adminOnly,
// } = require("../middleware/authMiddleware");


// // GET ALL FLIGHTS
// router.get("/", getFlights);


// // GET SINGLE FLIGHT
// router.get("/:id", getFlightById);


// // ADD FLIGHT - ADMIN ONLY
// router.post(
//   "/",
//   protect,
//   adminOnly,
//   addFlight
// );


// // UPDATE FLIGHT - ADMIN ONLY
// router.put(
//   "/:id",
//   protect,
//   adminOnly,
//   updateFlight
// );


// // DELETE FLIGHT - ADMIN ONLY
// router.delete(
//   "/:id",
//   protect,
//   adminOnly,
//   deleteFlight
// );


// module.exports = router;

const express = require("express");

const router = express.Router();


// =====================================================
// CONTROLLER
// =====================================================

const {
  createFlight,
  getFlights,
  getFlightById,
  updateFlight,
  deleteFlight,
  searchFlights,
} = require("../controllers/flightController");


// =====================================================
// AUTH MIDDLEWARE
// =====================================================

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");


// =====================================================
// GET ALL FLIGHTS
// =====================================================

router.get(
  "/",
  getFlights
);


// =====================================================
// SEARCH FLIGHTS
// IMPORTANT: /search ko /:id se pehle rakha hai
// =====================================================

router.get(
  "/search",
  searchFlights
);


// =====================================================
// GET SINGLE FLIGHT
// =====================================================

router.get(
  "/:id",
  getFlightById
);


// =====================================================
// ADD FLIGHT - ADMIN ONLY
// =====================================================

router.post(
  "/",
  protect,
  adminOnly,
  createFlight
);


// =====================================================
// UPDATE FLIGHT - ADMIN ONLY
// =====================================================

router.put(
  "/:id",
  protect,
  adminOnly,
  updateFlight
);


// =====================================================
// DELETE FLIGHT - ADMIN ONLY
// =====================================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteFlight
);


module.exports = router;