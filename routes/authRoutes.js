// // // // const express = require("express");

// // // // const {
// // // //   signup,
// // // //   login,
// // // // } = require("../controllers/authController");

// // // // const router = express.Router();


// // // // // Customer / Agent Signup

// // // // router.post(
// // // //   "/signup",
// // // //   signup
// // // // );


// // // // // Customer / Agent / Admin Login

// // // // router.post(
// // // //   "/login",
// // // //   login
// // // // );


// // // // module.exports = router;



// // // const express = require("express");

// // // const {
// // //   signup,
// // //   login,
// // //   forgotPassword,
// // //   verifyOTP,
// // //   resetPassword,
// // // } = require("../controllers/authController");

// // // const router = express.Router();

// // // // ==========================================
// // // // SIGNUP
// // // // ==========================================

// // // router.post("/signup", signup);

// // // // ==========================================
// // // // LOGIN
// // // // ==========================================

// // // router.post("/login", login);

// // // // ==========================================
// // // // FORGOT PASSWORD
// // // // ==========================================

// // // router.post(
// // //   "/forgot-password",
// // //   forgotPassword
// // // );

// // // // ==========================================
// // // // VERIFY OTP
// // // // ==========================================

// // // router.post(
// // //   "/verify-otp",
// // //   verifyOTP
// // // );

// // // // ==========================================
// // // // RESET PASSWORD
// // // // ==========================================

// // // router.post(
// // //   "/reset-password",
// // //   resetPassword
// // // );

// // // module.exports = router;


// // const bcrypt = require("bcryptjs");
// // const jwt = require("jsonwebtoken");
// // const nodemailer = require("nodemailer");

// // const User = require("../models/User");

// // // ==========================================
// // // CREATE JWT
// // // ==========================================

// // const createToken = (user) => {
// //   return jwt.sign(
// //     {
// //       id: user._id,
// //       role: user.role,
// //     },
// //     process.env.JWT_SECRET,
// //     {
// //       expiresIn: "7d",
// //     }
// //   );
// // };

// // // ==========================================
// // // EMAIL TRANSPORTER
// // // ==========================================

// // const transporter = nodemailer.createTransport({
// //   host: "smtp.gmail.com",
// //   port: 465,
// //   secure: true,

// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS,
// //   },
// // });

// // // ==========================================
// // // SIGNUP
// // // ==========================================

// // const signup = async (req, res) => {
// //   try {
// //     const {
// //       firstName,
// //       lastName,
// //       email,
// //       phone,
// //       password,
// //       role,
// //       agencyName,
// //       city,
// //       state,
// //       gstNumber,
// //     } = req.body;

// //     if (!firstName || !email || !password) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "First name, email and password are required.",
// //       });
// //     }

// //     if (
// //       role !== "customer" &&
// //       role !== "agent"
// //     ) {
// //       return res.status(403).json({
// //         success: false,
// //         message: "Invalid signup role.",
// //       });
// //     }

// //     const existingUser =
// //       await User.findOne({
// //         email: email.toLowerCase(),
// //       });

// //     if (existingUser) {
// //       return res.status(409).json({
// //         success: false,
// //         message:
// //           "An account with this email already exists.",
// //       });
// //     }

// //     if (role === "agent") {
// //       if (!agencyName || !city || !state) {
// //         return res.status(400).json({
// //           success: false,
// //           message:
// //             "Agency name, city and state are required for agents.",
// //         });
// //       }
// //     }

// //     const hashedPassword =
// //       await bcrypt.hash(password, 12);

// //     const user = await User.create({
// //       firstName,
// //       lastName,
// //       email: email.toLowerCase(),
// //       phone,
// //       password: hashedPassword,
// //       role,

// //       agencyName:
// //         role === "agent"
// //           ? agencyName
// //           : "",

// //       city:
// //         role === "agent"
// //           ? city
// //           : "",

// //       state:
// //         role === "agent"
// //           ? state
// //           : "",

// //       gstNumber:
// //         role === "agent"
// //           ? gstNumber || ""
// //           : "",
// //     });

// //     const token =
// //       createToken(user);

// //     res.status(201).json({
// //       success: true,
// //       message:
// //         "Account created successfully.",

// //       token,

// //       user: {
// //         id: user._id,
// //         firstName: user.firstName,
// //         lastName: user.lastName,
// //         email: user.email,
// //         phone: user.phone,
// //         role: user.role,
// //         agencyName: user.agencyName,
// //       },
// //     });
// //   } catch (error) {
// //     console.error(
// //       "Signup Error:",
// //       error
// //     );

// //     res.status(500).json({
// //       success: false,
// //       message:
// //         "Server error during signup.",
// //     });
// //   }
// // };

// // // ==========================================
// // // LOGIN
// // // ==========================================

// // const login = async (req, res) => {
// //   try {
// //     const {
// //       email,
// //       password,
// //     } = req.body;

// //     if (!email || !password) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Email and password are required.",
// //       });
// //     }

// //     const user =
// //       await User.findOne({
// //         email: email.toLowerCase(),
// //       });

// //     if (!user) {
// //       return res.status(401).json({
// //         success: false,
// //         message:
// //           "Invalid email or password.",
// //       });
// //     }

// //     if (!user.isActive) {
// //       return res.status(403).json({
// //         success: false,
// //         message:
// //           "Your account has been disabled.",
// //       });
// //     }

// //     const passwordMatch =
// //       await bcrypt.compare(
// //         password,
// //         user.password
// //       );

// //     if (!passwordMatch) {
// //       return res.status(401).json({
// //         success: false,
// //         message:
// //           "Invalid email or password.",
// //       });
// //     }

// //     const token =
// //       createToken(user);

// //     res.json({
// //       success: true,
// //       message:
// //         "Login successful.",

// //       token,

// //       user: {
// //         id: user._id,
// //         firstName: user.firstName,
// //         lastName: user.lastName,
// //         email: user.email,
// //         phone: user.phone,
// //         role: user.role,
// //         agencyName: user.agencyName,
// //       },
// //     });
// //   } catch (error) {
// //     console.error(
// //       "Login Error:",
// //       error
// //     );

// //     res.status(500).json({
// //       success: false,
// //       message:
// //         "Server error during login.",
// //     });
// //   }
// // };

// // // ==========================================
// // // FORGOT PASSWORD
// // // SEND OTP
// // // ==========================================

// // const forgotPassword = async (
// //   req,
// //   res
// // ) => {
// //   try {
// //     const { email } = req.body;

// //     if (!email) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Email address is required.",
// //       });
// //     }

// //     const user =
// //       await User.findOne({
// //         email: email
// //           .trim()
// //           .toLowerCase(),
// //       });

// //     if (!user) {
// //       return res.status(404).json({
// //         success: false,
// //         message:
// //           "No account found with this email address.",
// //       });
// //     }

// //     // ======================================
// //     // GENERATE 6 DIGIT OTP
// //     // ======================================

// //     const otp =
// //       Math.floor(
// //         100000 +
// //           Math.random() * 900000
// //       ).toString();

// //     const otpExpires =
// //       new Date(
// //         Date.now() +
// //           10 * 60 * 1000
// //       );

// //     // ======================================
// //     // SAVE OTP
// //     // ======================================

// //     user.resetPasswordOTP =
// //       otp;

// //     user.resetPasswordOTPExpires =
// //       otpExpires;

// //     user.resetPasswordVerified =
// //       false;

// //     await user.save();

// //     // ======================================
// //     // SEND EMAIL
// //     // ======================================

// //     await transporter.sendMail({
// //       from: `"Saiyed Travels" <${process.env.EMAIL_USER}>`,

// //       to: user.email,

// //       subject:
// //         "Saiyed Travels - Password Reset OTP",

// //       html: `
// //         <!DOCTYPE html>

// //         <html>

// //         <body style="
// //           margin:0;
// //           padding:0;
// //           background:#f3f4f6;
// //           font-family:Arial, sans-serif;
// //         ">

// //           <div style="
// //             max-width:600px;
// //             margin:40px auto;
// //             background:#ffffff;
// //             border-radius:16px;
// //             overflow:hidden;
// //             box-shadow:0 5px 25px rgba(0,0,0,0.08);
// //           ">

// //             <div style="
// //               background:#2563eb;
// //               padding:30px;
// //               text-align:center;
// //               color:#ffffff;
// //             ">

// //               <h1 style="
// //                 margin:0;
// //                 font-size:28px;
// //               ">
// //                 Saiyed Travels
// //               </h1>

// //               <p style="
// //                 margin:8px 0 0;
// //               ">
// //                 Password Recovery
// //               </p>

// //             </div>

// //             <div style="
// //               padding:35px;
// //             ">

// //               <h2 style="
// //                 color:#111827;
// //               ">
// //                 Hello ${
// //                   user.firstName ||
// //                   "User"
// //                 },
// //               </h2>

// //               <p style="
// //                 color:#4b5563;
// //                 font-size:15px;
// //                 line-height:1.7;
// //               ">
// //                 We received a request to
// //                 reset your Saiyed Travels
// //                 account password.
// //               </p>

// //               <p style="
// //                 color:#4b5563;
// //               ">
// //                 Your verification OTP is:
// //               </p>

// //               <div style="
// //                 background:#eff6ff;
// //                 border:2px solid #2563eb;
// //                 border-radius:12px;
// //                 padding:20px;
// //                 text-align:center;
// //                 margin:25px 0;
// //               ">

// //                 <span style="
// //                   font-size:36px;
// //                   font-weight:bold;
// //                   letter-spacing:10px;
// //                   color:#1d4ed8;
// //                 ">
// //                   ${otp}
// //                 </span>

// //               </div>

// //               <p style="
// //                 color:#4b5563;
// //                 font-size:14px;
// //               ">
// //                 This OTP is valid for
// //                 <strong>10 minutes</strong>.
// //               </p>

// //               <p style="
// //                 color:#6b7280;
// //                 font-size:13px;
// //                 line-height:1.6;
// //               ">
// //                 If you did not request a
// //                 password reset, please ignore
// //                 this email.
// //               </p>

// //             </div>

// //             <div style="
// //               background:#f9fafb;
// //               padding:20px;
// //               text-align:center;
// //               color:#6b7280;
// //               font-size:12px;
// //             ">

// //               © ${new Date().getFullYear()}
// //               Saiyed Travels

// //             </div>

// //           </div>

// //         </body>

// //         </html>
// //       `,
// //     });

// //     console.log(
// //       `Password reset OTP sent to ${user.email}`
// //     );

// //     res.json({
// //       success: true,
// //       message:
// //         "OTP has been sent to your email address.",
// //     });
// //   } catch (error) {
// //     console.error(
// //       "================================"
// //     );

// //     console.error(
// //       "FORGOT PASSWORD EMAIL ERROR"
// //     );

// //     console.error(
// //       "Message:",
// //       error.message
// //     );

// //     console.error(
// //       "Code:",
// //       error.code
// //     );

// //     console.error(
// //       "Response:",
// //       error.response
// //     );

// //     console.error(
// //       "================================"
// //     );

// //     res.status(500).json({
// //       success: false,
// //       message:
// //         "Unable to send OTP. Please check your email configuration.",
// //     });
// //   }
// // };

// // // ==========================================
// // // VERIFY OTP
// // // ==========================================

// // const verifyOTP = async (
// //   req,
// //   res
// // ) => {
// //   try {
// //     const {
// //       email,
// //       otp,
// //     } = req.body;

// //     if (!email || !otp) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Email and OTP are required.",
// //       });
// //     }

// //     const user =
// //       await User.findOne({
// //         email: email
// //           .trim()
// //           .toLowerCase(),
// //       });

// //     if (!user) {
// //       return res.status(404).json({
// //         success: false,
// //         message:
// //           "User not found.",
// //       });
// //     }

// //     if (!user.resetPasswordOTP) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "No password reset request found.",
// //       });
// //     }

// //     if (
// //       user.resetPasswordOTPExpires &&
// //       user.resetPasswordOTPExpires <
// //         new Date()
// //     ) {
// //       user.resetPasswordOTP =
// //         null;

// //       user.resetPasswordOTPExpires =
// //         null;

// //       user.resetPasswordVerified =
// //         false;

// //       await user.save();

// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "OTP has expired. Please request a new OTP.",
// //       });
// //     }

// //     if (
// //       user.resetPasswordOTP !==
// //       otp.toString()
// //     ) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Invalid OTP. Please try again.",
// //       });
// //     }

// //     user.resetPasswordVerified =
// //       true;

// //     await user.save();

// //     res.json({
// //       success: true,
// //       message:
// //         "OTP verified successfully.",
// //     });
// //   } catch (error) {
// //     console.error(
// //       "Verify OTP Error:",
// //       error
// //     );

// //     res.status(500).json({
// //       success: false,
// //       message:
// //         "Server error while verifying OTP.",
// //     });
// //   }
// // };

// // // ==========================================
// // // RESET PASSWORD
// // // ==========================================

// // const resetPassword = async (
// //   req,
// //   res
// // ) => {
// //   try {
// //     const {
// //       email,
// //       newPassword,
// //     } = req.body;

// //     if (!email || !newPassword) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Email and new password are required.",
// //       });
// //     }

// //     if (newPassword.length < 6) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Password must be at least 6 characters.",
// //       });
// //     }

// //     const user =
// //       await User.findOne({
// //         email: email
// //           .trim()
// //           .toLowerCase(),
// //       });

// //     if (!user) {
// //       return res.status(404).json({
// //         success: false,
// //         message:
// //           "User not found.",
// //       });
// //     }

// //     if (
// //       !user.resetPasswordVerified
// //     ) {
// //       return res.status(403).json({
// //         success: false,
// //         message:
// //           "Please verify the OTP first.",
// //       });
// //     }

// //     const hashedPassword =
// //       await bcrypt.hash(
// //         newPassword,
// //         12
// //       );

// //     user.password =
// //       hashedPassword;

// //     user.resetPasswordOTP =
// //       null;

// //     user.resetPasswordOTPExpires =
// //       null;

// //     user.resetPasswordVerified =
// //       false;

// //     await user.save();

// //     res.json({
// //       success: true,
// //       message:
// //         "Password reset successfully. You can now login.",
// //     });
// //   } catch (error) {
// //     console.error(
// //       "Reset Password Error:",
// //       error
// //     );

// //     res.status(500).json({
// //       success: false,
// //       message:
// //         "Server error while resetting password.",
// //     });
// //   }
// // };

// // // ==========================================
// // // EXPORT
// // // ==========================================

// // module.exports = {
// //   signup,
// //   login,
// //   forgotPassword,
// //   verifyOTP,
// //   resetPassword,
// // };


// const express = require("express");

// const authController = require("../controllers/authController");

// const router = express.Router();

// // ==========================================
// // SIGNUP
// // ==========================================

// router.post(
//   "/signup",
//   authController.signup
// );

// // ==========================================
// // LOGIN
// // ==========================================

// router.post(
//   "/login",
//   authController.login
// );

// // ==========================================
// // FORGOT PASSWORD
// // ==========================================

// router.post(
//   "/forgot-password",
//   authController.forgotPassword
// );

// // ==========================================
// // VERIFY OTP
// // ==========================================

// router.post(
//   "/verify-otp",
//   authController.verifyOTP
// );

// // ==========================================
// // RESET PASSWORD
// // ==========================================

// router.post(
//   "/reset-password",
//   authController.resetPassword
// );

// module.exports = router;

// const express = require("express");

// const {
//   signup,
//   login,
//   forgotPassword,
//   verifyOTP,
//   resetPassword,
// } = require("../controllers/authController");

// const router = express.Router();

// // ==========================================
// // SIGNUP
// // ==========================================

// router.post(
//   "/signup",
//   signup
// );

// // ==========================================
// // LOGIN
// // ==========================================

// router.post(
//   "/login",
//   login
// );

// // ==========================================
// // FORGOT PASSWORD
// // ==========================================

// router.post(
//   "/forgot-password",
//   forgotPassword
// );

// // ==========================================
// // VERIFY OTP
// // ==========================================

// router.post(
//   "/verify-otp",
//   verifyOTP
// );

// // ==========================================
// // RESET PASSWORD
// // ==========================================

// router.post(
//   "/reset-password",
//   resetPassword
// );

// module.exports = router;



const express = require("express");

const {
  signup,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
} = require("../controllers/authController");

const router =
  express.Router();

// ==========================================
// SIGNUP
// AGENT USES THIS
// ==========================================

router.post(
  "/signup",
  signup
);

// ==========================================
// LOGIN
// CUSTOMER / AGENT / ADMIN
// ==========================================

router.post(
  "/login",
  login
);

// ==========================================
// FORGOT PASSWORD
// ==========================================

router.post(
  "/forgot-password",
  forgotPassword
);

// ==========================================
// VERIFY OTP
// ==========================================

router.post(
  "/verify-otp",
  verifyOTP
);

// ==========================================
// RESET PASSWORD
// ==========================================

router.post(
  "/reset-password",
  resetPassword
);

module.exports = router;