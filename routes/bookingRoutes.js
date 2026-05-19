// // const express = require("express");

// // const router = express.Router();

// // const Booking = require("../models/Booking");

// // router.post("/book", async (req, res) => {

// //   try {

// //     const newBooking = new Booking(req.body);

// //     await newBooking.save();

// //     res.status(201).json({
// //       success: true,
// //       message: "Booking Saved"
// //     });

// //   } catch (error) {

// //     res.status(500).json({
// //       success: false,
// //       message: "Error saving booking"
// //     });

// //   }

// // });

// // module.exports = router;










// const express = require("express");

// const router = express.Router();

// const Booking = require("../models/Booking");


// // SAVE BOOKING

// router.post("/booking", async (req, res) => {

//   try {

//     const newBooking = new Booking(req.body);

//     await newBooking.save();

//     res.status(201).json({
//       message: "Booking Saved Successfully ✅",
//       booking: newBooking
//     });

//   } catch (error) {

//     res.status(500).json({
//       message: "Error Saving Booking ❌",
//       error
//     });

//   }

// });


// // GET ALL BOOKINGS

// router.get("/bookings", async (req, res) => {

//   try {

//     const bookings = await Booking.find();

//     res.json(bookings);

//   } catch (error) {

//     res.status(500).json({
//       message: "Error Fetching Bookings ❌"
//     });

//   }

// });

// module.exports = router;











const express = require("express");

const router = express.Router();

const Booking = require("../models/Booking");

const multer = require("multer");

/* MULTER SETUP */

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "uploads");

  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() + "-" + file.originalname
    );

  }

});

const upload = multer({
  storage: storage
});

/* SAVE BOOKING */

router.post(
  "/booking",
  upload.single("screenshot"),
  async (req, res) => {

    try {

      const newBooking = new Booking({

        from: req.body.from,

        to: req.body.to,

        name: req.body.name,

        phone: req.body.phone,

        passengers: req.body.passengers,

        screenshot: req.file
          ? req.file.filename
          : ""

      });

      await newBooking.save();

      res.status(201).json({

        message:
          "Booking Saved Successfully ✅",

        booking: newBooking

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Error Saving Booking ❌",

        error

      });

    }

  }
);

/* GET ALL BOOKINGS */

router.get("/bookings", async (req, res) => {

  try {

    const bookings = await Booking.find();

    res.json(bookings);

  } catch (error) {

    res.status(500).json({

      message:
        "Error Fetching Bookings ❌"

    });

  }

});

module.exports = router;