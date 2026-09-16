// const express = require("express");

// const router = express.Router();


// // ==========================================
// // CONTROLLER
// // ==========================================

// const {
//   getUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
// } = require("../controllers/userController");


// // ==========================================
// // AUTH MIDDLEWARE
// // ==========================================

// const {
//   protect,
//   adminOnly,
// } = require("../middleware/authMiddleware");


// // ==========================================
// // ALL USER ROUTES = ADMIN ONLY
// // ==========================================


// // GET ALL USERS

// router.get(
//   "/",
//   protect,
//   adminOnly,
//   getUsers
// );


// // GET SINGLE USER

// router.get(
//   "/:id",
//   protect,
//   adminOnly,
//   getUserById
// );


// // UPDATE USER

// router.put(
//   "/:id",
//   protect,
//   adminOnly,
//   updateUser
// );


// // DELETE USER

// router.delete(
//   "/:id",
//   protect,
//   adminOnly,
//   deleteUser
// );





const express = require("express");

const router = express.Router();


// ==========================================
// CONTROLLER
// ==========================================

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,

  // PROFILE
  getMyProfile,
  updateMyProfile,
  changePassword,

} = require("../controllers/userController");


// ==========================================
// AUTH MIDDLEWARE
// ==========================================

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");


// ==========================================
// MY PROFILE
// CUSTOMER + AGENT + ADMIN
// ==========================================


// GET MY PROFILE

router.get(
  "/profile",
  protect,
  getMyProfile
);


// UPDATE MY PROFILE

router.put(
  "/profile",
  protect,
  updateMyProfile
);


// CHANGE PASSWORD

router.put(
  "/change-password",
  protect,
  changePassword
);


// ==========================================
// ALL USER ROUTES
// ADMIN ONLY
// ==========================================


// GET ALL USERS

router.get(
  "/",
  protect,
  adminOnly,
  getUsers
);


// GET SINGLE USER

router.get(
  "/:id",
  protect,
  adminOnly,
  getUserById
);


// UPDATE USER

router.put(
  "/:id",
  protect,
  adminOnly,
  updateUser
);


// DELETE USER

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteUser
);


module.exports = router;