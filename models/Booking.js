// // // const mongoose = require("mongoose");

// // // const bookingSchema = new mongoose.Schema({

// // //   from: String,

// // //   to: String,

// // //   name: String,

// // //   phone: String,

// // //   passengers: Number

// // // });

// // // module.exports = mongoose.model(
// // //   "Booking",
// // //   bookingSchema
// // // );









// // const mongoose = require("mongoose");

// // const bookingSchema = new mongoose.Schema({
// //   from: String,
// //   to: String,
// //   name: String,
// //   phone: String,
// //   passengers: Number
// // });

// // module.exports = mongoose.model("Booking", bookingSchema
// // );




// // const mongoose = require("mongoose");

// // const bookingSchema = new mongoose.Schema({
// //   from: String,
// //   to: String,
// //   name: String,
// //   phone: String,
// //   passengers: Number
// // });

// // module.exports = mongoose.model("Booking", bookingSchema);








// // const mongoose = require("mongoose");

// // const bookingSchema = new mongoose.Schema({

// //   from: String,

// //   to: String,

// //   name: String,

// //   phone: String,

// //   passengers: Number,

// //   bookingDate: {
// //     type: Date,
// //     default: Date.now
// //   }

// // });

// // module.exports = mongoose.model(
// //   "Booking",
// //   bookingSchema
// // );













// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema({

//   from: String,

//   to: String,

//   name: String,

//   phone: String,

//   passengers: Number,

//   bookingDate: {
//     type: Date,
//     default: Date.now
//   }

// });

// module.exports = mongoose.model(
//   "Booking",
//   bookingSchema
// );











const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

  from: String,

  to: String,

  name: String,

  phone: String,

  passengers: Number,

  screenshot: String,

  bookingDate: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  "Booking",
  bookingSchema
);