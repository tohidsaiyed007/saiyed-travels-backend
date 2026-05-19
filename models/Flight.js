const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({

  from: String,

  to: String,

  date: String,

  airline: String,

  departureTime: String,

  arrivalTime: String,

  price: Number,

  seats: Number

});

module.exports =
  mongoose.model(
    "Flight",
    flightSchema
  );