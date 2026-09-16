// // const mongoose = require("mongoose");

// // const connectDB = async () => {

// //   try {

// //     const conn = await mongoose.connect(process.env.MONGO_URI);

// //     console.log("MongoDB Connected Successfully");
// //     console.log(`Database Host : ${conn.connection.host}`);
// //     console.log(`Database Name : ${conn.connection.name}`);

// //   } catch (error) {

// //     console.log("MongoDB Connection Failed");
// //     console.log(error.message);

// //     process.exit(1);

// //   }

// // };

// // module.exports = connectDB;






// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI);

//     console.log("MongoDB Connected Successfully");
//     console.log(`Database Host : ${conn.connection.host}`);
//     console.log(`Database Name : ${conn.connection.name}`);
//   } catch (error) {
//     console.log("MongoDB Connection Failed");
//     console.log(error.message);

//     process.exit(1);
//   }
// };

// module.exports = connectDB;


const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected Successfully");
    console.log(`Database Host : ${conn.connection.host}`);
    console.log(`Database Name : ${conn.connection.name}`);
  } catch (error) {
    console.log("MongoDB Connection Failed");
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;