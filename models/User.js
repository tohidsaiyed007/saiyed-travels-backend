
// // // const mongoose = require("mongoose");

// // // const userSchema = new mongoose.Schema(
// // //   {
// // //     firstName: {
// // //       type: String,
// // //       required: true,
// // //       trim: true,
// // //     },

// // //     lastName: {
// // //       type: String,
// // //       default: "",
// // //       trim: true,
// // //     },

// // //     email: {
// // //       type: String,
// // //       required: true,
// // //       unique: true,
// // //       lowercase: true,
// // //       trim: true,
// // //     },

// // //     phone: {
// // //       type: String,
// // //       default: "",
// // //       trim: true,
// // //     },

// // //     password: {
// // //       type: String,
// // //       required: true,
// // //     },

// // //     role: {
// // //       type: String,
// // //       enum: ["customer", "agent", "admin"],
// // //       default: "customer",
// // //     },

// // //     agencyName: {
// // //       type: String,
// // //       default: "",
// // //       trim: true,
// // //     },

// // //     city: {
// // //       type: String,
// // //       default: "",
// // //       trim: true,
// // //     },

// // //     state: {
// // //       type: String,
// // //       default: "",
// // //       trim: true,
// // //     },

// // //     gstNumber: {
// // //       type: String,
// // //       default: "",
// // //       trim: true,
// // //     },

// // //     isActive: {
// // //       type: Boolean,
// // //       default: true,
// // //     },

// // //     // ==========================================
// // //     // FORGOT PASSWORD
// // //     // ==========================================

// // //     resetPasswordOTP: {
// // //       type: String,
// // //       default: null,
// // //     },

// // //     resetPasswordOTPExpires: {
// // //       type: Date,
// // //       default: null,
// // //     },

// // //     resetPasswordVerified: {
// // //       type: Boolean,
// // //       default: false,
// // //     },
// // //   },
// // //   {
// // //     timestamps: true,
// // //   }
// // // );

// // // module.exports = mongoose.model("User", userSchema);











// // const mongoose = require("mongoose");

// // const userSchema = new mongoose.Schema(
// //   {
// //     firstName: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },

// //     lastName: {
// //       type: String,
// //       default: "",
// //       trim: true,
// //     },

// //     email: {
// //       type: String,
// //       required: true,
// //       unique: true,
// //       lowercase: true,
// //       trim: true,
// //     },

// //     phone: {
// //       type: String,
// //       default: "",
// //       trim: true,
// //     },

// //     // Normal password login ke liye
// //     // Google users ke liye empty ho sakta hai
// //     password: {
// //       type: String,
// //       default: "",
// //     },

// //     // Google account unique ID
// //     googleId: {
// //       type: String,
// //       default: null,
// //       index: true,
// //       sparse: true,
// //     },

// //     role: {
// //       type: String,
// //       enum: ["customer", "agent", "admin"],
// //       default: "customer",
// //     },

// //     agencyName: {
// //       type: String,
// //       default: "",
// //       trim: true,
// //     },

// //     city: {
// //       type: String,
// //       default: "",
// //       trim: true,
// //     },

// //     state: {
// //       type: String,
// //       default: "",
// //       trim: true,
// //     },

// //     gstNumber: {
// //       type: String,
// //       default: "",
// //       trim: true,
// //     },

// //     isActive: {
// //       type: Boolean,
// //       default: true,
// //     },

// //     // ==========================================
// //     // FORGOT PASSWORD
// //     // ==========================================

// //     resetPasswordOTP: {
// //       type: String,
// //       default: null,
// //     },

// //     resetPasswordOTPExpires: {
// //       type: Date,
// //       default: null,
// //     },

// //     resetPasswordVerified: {
// //       type: Boolean,
// //       default: false,
// //     },
// //   },
// //   {
// //     timestamps: true,
// //   }
// // );

// // module.exports =
// //   mongoose.model("User", userSchema);




// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     firstName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     lastName: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     phone: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     // Normal login password
//     // Google users ke liye empty ho sakta hai
//     password: {
//       type: String,
//       default: "",
//     },

//     // ==========================================
//     // GOOGLE LOGIN
//     // ==========================================

//     googleId: {
//       type: String,
//       default: null,
//       unique: true,
//       sparse: true,
//     },

//     role: {
//       type: String,
//       enum: ["customer", "agent", "admin"],
//       default: "customer",
//     },

//     agencyName: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     city: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     state: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     gstNumber: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     isActive: {
//       type: Boolean,
//       default: true,
//     },

//     // ==========================================
//     // FORGOT PASSWORD
//     // ==========================================

//     resetPasswordOTP: {
//       type: String,
//       default: null,
//     },

//     resetPasswordOTPExpires: {
//       type: Date,
//       default: null,
//     },

//     resetPasswordVerified: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    password: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: [
        "customer",
        "agent",
        "admin",
      ],
      default: "customer",
    },

    agencyName: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    gstNumber: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ==========================================
    // FORGOT PASSWORD
    // ==========================================

    resetPasswordOTP: {
      type: String,
      default: null,
    },

    resetPasswordOTPExpires: {
      type: Date,
      default: null,
    },

    resetPasswordVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "User",
    userSchema
  );