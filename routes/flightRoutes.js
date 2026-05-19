const express = require("express");

const router = express.Router();

const Flight = require("../models/Flight");



router.post("/add", async (req, res) => {

  try {

    console.log(req.body);

    const newFlight =
      new Flight(req.body);

    await newFlight.save();

    res.status(200).json({
      success: true,
      message: "Flight Added ✅"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error ❌"
    });

  }

});


// GET ALL FLIGHTS

router.get("/", async (req, res) => {

  try {

    const flights =
      await Flight.find();

    res.status(200).json(flights);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error Fetching Flights"
    });

  }

});


// DELETE FLIGHT

router.delete("/:id", async (req, res) => {

  try {

    await Flight.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Flight Deleted ✅"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Delete Failed ❌"
    });

  }

});


// UPDATE FLIGHT

router.put("/:id", async (req, res) => {

  try {

    await Flight.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Flight Updated ✅"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Update Failed ❌"
    });

  }

});

module.exports = router;