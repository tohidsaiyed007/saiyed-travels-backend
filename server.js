// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");

// // ==========================================
// // LOAD ENV FIRST
// // ==========================================

// dotenv.config();

// // ==========================================
// // DATABASE
// // ==========================================

// const connectDB = require("./config/db");

// // ==========================================
// // ROUTES
// // ==========================================

// const authRoutes = require("./routes/authRoutes");
// const flightRoutes = require("./routes/flightRoutes");
// const userRoutes = require("./routes/userRoutes");
// const bookingRoutes = require("./routes/bookingRoutes");
// const paymentRequestRoutes = require("./routes/paymentRequestRoutes");

// // ==========================================
// // DATABASE CONNECT
// // ==========================================

// connectDB();

// // ==========================================
// // EXPRESS
// // ==========================================

// const app = express();

// // ==========================================
// // CORS
// // ==========================================

// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:5174",
//   "https://saiyed-travel.vercel.app",
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow requests without origin
//       // Postman / server-to-server requests
//       if (!origin) {
//         return callback(null, true);
//       }

//       // Allow our frontend origins
//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       console.log("CORS BLOCKED:", origin);

//       return callback(
//         new Error(`CORS blocked: ${origin}`)
//       );
//     },

//     credentials: true,

//     methods: [
//       "GET",
//       "POST",
//       "PUT",
//       "PATCH",
//       "DELETE",
//       "OPTIONS",
//     ],

//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "x-user-id",
//       "x-user-email",
//     ],
//   })
// );

// // ==========================================
// // BODY PARSER
// // ==========================================

// app.use(express.json());

// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

// // ==========================================
// // STATIC FILES
// // Payment screenshots access
// // ==========================================

// app.use(
//   "/uploads",
//   express.static("uploads")
// );

// // ==========================================
// // ROOT
// // ==========================================

// app.get("/", (req, res) => {
//   res.status(200).send(
//     "Saiyed Travels Backend Running..."
//   );
// });

// // ==========================================
// // AUTH
// // ==========================================

// app.use(
//   "/api/auth",
//   authRoutes
// );

// // ==========================================
// // FLIGHTS
// // ==========================================

// app.use(
//   "/api/flights",
//   flightRoutes
// );

// // ==========================================
// // USERS
// // ==========================================

// app.use(
//   "/api/users",
//   userRoutes
// );

// // ==========================================
// // BOOKINGS
// // ==========================================

// app.use(
//   "/api/bookings",
//   bookingRoutes
// );

// // ==========================================
// // PAYMENT REQUESTS
// // ==========================================

// app.use(
//   "/api/payment-requests",
//   paymentRequestRoutes
// );

// // ==========================================
// // 404 API
// // ==========================================

// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message:
//       `Route not found: ${req.method} ${req.originalUrl}`,
//   });
// });

// // ==========================================
// // ERROR HANDLER
// // ==========================================

// app.use((err, req, res, next) => {
//   console.error(
//     "SERVER ERROR:",
//     err.message
//   );

//   // CORS error
//   if (
//     err.message &&
//     err.message.startsWith(
//       "CORS blocked"
//     )
//   ) {
//     return res.status(403).json({
//       success: false,
//       message: err.message,
//     });
//   }

//   return res.status(500).json({
//     success: false,
//     message:
//       err.message ||
//       "Internal server error.",
//   });
// });

// // ==========================================
// // SERVER
// // ==========================================

// const PORT =
//   process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(
//     `Server Running On Port ${PORT}`
//   );

//   console.log(
//     "Booking API:",
//     `http://localhost:${PORT}/api/bookings`
//   );

//   console.log(
//     "Payment Request API:",
//     `http://localhost:${PORT}/api/payment-requests`
//   );

//   console.log(
//     "Email User:",
//     process.env.EMAIL_USER
//       ? process.env.EMAIL_USER
//       : "NOT SET"
//   );

//   console.log(
//     "Email Password:",
//     process.env.EMAIL_PASS
//       ? "SET"
//       : "NOT SET"
//   );
// });




const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// ==========================================
// LOAD ENV FIRST
// ==========================================

dotenv.config();

// ==========================================
// DATABASE
// ==========================================

const connectDB = require("./config/db");

// ==========================================
// ROUTES
// ==========================================

const authRoutes = require("./routes/authRoutes");
const flightRoutes = require("./routes/flightRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRequestRoutes = require("./routes/paymentRequestRoutes");

// ==========================================
// DATABASE CONNECT
// ==========================================

connectDB();

// ==========================================
// EXPRESS
// ==========================================

const app = express();

// ==========================================
// CORS
// ==========================================

const allowedOrigins = [
  // Local development
  "http://localhost:5173",
  "http://localhost:5174",

  // Vercel
  "https://saiyed-travel.vercel.app",

  // Custom Domain
  "https://saiyedtravels.com",
  "https://www.saiyedtravels.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without origin
      // Postman / server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      // Allow our frontend origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS BLOCKED:", origin);

      return callback(
        new Error(`CORS blocked: ${origin}`)
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-user-id",
      "x-user-email",
    ],
  })
);

// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==========================================
// STATIC FILES
// Payment screenshots access
// ==========================================

app.use(
  "/uploads",
  express.static("uploads")
);

// ==========================================
// ROOT
// ==========================================

app.get("/", (req, res) => {
  res.status(200).send(
    "Saiyed Travels Backend Running..."
  );
});

// ==========================================
// AUTH
// ==========================================

app.use(
  "/api/auth",
  authRoutes
);

// ==========================================
// FLIGHTS
// ==========================================

app.use(
  "/api/flights",
  flightRoutes
);

// ==========================================
// USERS
// ==========================================

app.use(
  "/api/users",
  userRoutes
);

// ==========================================
// BOOKINGS
// ==========================================

app.use(
  "/api/bookings",
  bookingRoutes
);

// ==========================================
// PAYMENT REQUESTS
// ==========================================

app.use(
  "/api/payment-requests",
  paymentRequestRoutes
);

// ==========================================
// 404 API
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message:
      `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error(
    "SERVER ERROR:",
    err.message
  );

  // CORS error
  if (
    err.message &&
    err.message.startsWith(
      "CORS blocked"
    )
  ) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message:
      err.message ||
      "Internal server error.",
  });
});

// ==========================================
// SERVER
// ==========================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server Running On Port ${PORT}`
  );

  console.log(
    "Booking API:",
    `http://localhost:${PORT}/api/bookings`
  );

  console.log(
    "Payment Request API:",
    `http://localhost:${PORT}/api/payment-requests`
  );

  console.log(
    "Email User:",
    process.env.EMAIL_USER
      ? process.env.EMAIL_USER
      : "NOT SET"
  );

  console.log(
    "Email Password:",
    process.env.EMAIL_PASS
      ? "SET"
      : "NOT SET"
  );
});