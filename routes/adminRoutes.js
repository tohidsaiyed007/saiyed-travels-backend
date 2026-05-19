// console.log("ADMIN ROUTE NEW FILE RUNNING");

// const express = require("express");
// const router = express.Router();
// const Booking = require("../models/Booking");
// const jwt = require("jsonwebtoken");

// const ADMIN_EMAIL = "tohidsaiyed007@gmail.com";
// const ADMIN_PASSWORD = "9166313065";

// /* LOGIN */

// router.post("/login", (req, res) => {

//   console.log("BODY:", req.body);

//   const email = req.body.email || "";
//   const password = req.body.password || "";

//   console.log(email);
//   console.log(password);

//   // EMAIL CHECK
//   if (email.trim() !== ADMIN_EMAIL) {

//     return res.status(401).json({
//       message: "Invalid Email"
//     });

//   }

//   // PASSWORD CHECK
//   if (password.trim() !== ADMIN_PASSWORD) {

//     return res.status(401).json({
//       message: "Invalid Password"
//     });

//   }

//   // TOKEN
//   const token = jwt.sign(
//     { email: ADMIN_EMAIL },
//     "SAIYED_SECRET_KEY",
//     { expiresIn: "7d" }
//   );

//   res.json({
//     success: true,
//     token
//   });

// });

// /* BOOKINGS */

// router.get("/bookings", async (req, res) => {

//   try {

//     const data = await Booking.find({});
//     res.json(data);

//   } catch (err) {

//     console.log(err);

//     res.status(500).json({
//       message: "Error fetching bookings"
//     });

//   }

// });

// module.exports = router;











console.log("ADMIN ROUTE NEW FILE RUNNING");

const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const jwt = require("jsonwebtoken");

const ADMIN_EMAIL = "tohidsaiyed007@gmail.com";
const ADMIN_PASSWORD = "9166313065";

/* LOGIN */

router.post("/login", (req, res) => {

  console.log("BODY:", req.body);

  const email = req.body.email || "";
  const password = req.body.password || "";

  // EMAIL CHECK
  if (email.trim() !== ADMIN_EMAIL) {

    return res.status(401).json({
      message: "Invalid Email"
    });

  }

  // PASSWORD CHECK
  if (password.trim() !== ADMIN_PASSWORD) {

    return res.status(401).json({
      message: "Invalid Password"
    });

  }

  // TOKEN
  const token = jwt.sign(
    { email: ADMIN_EMAIL },
    "SAIYED_SECRET_KEY",
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    token
  });

});

/* GET BOOKINGS */

router.get("/bookings", async (req, res) => {

  try {

    const data = await Booking.find({});

    res.json(data);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Error fetching bookings"
    });

  }

});

/* DELETE BOOKING */

router.delete("/booking/:id", async (req, res) => {

  try {

    await Booking.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "Booking Deleted ✅"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Delete Failed ❌"
    });

  }

});

module.exports = router;