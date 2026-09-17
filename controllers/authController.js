// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { Resend } = require("resend");

// const User = require("../models/User");

// // ==========================================
// // HELPERS
// // ==========================================

// const getEnv = (name) => {
//   return process.env[name]
//     ? String(process.env[name]).trim()
//     : "";
// };

// // ==========================================
// // CREATE JWT
// // ==========================================

// const createToken = (user) => {
//   const jwtSecret = getEnv("JWT_SECRET");

//   if (!jwtSecret) {
//     throw new Error("JWT_SECRET is missing in backend .env");
//   }

//   return jwt.sign(
//     {
//       id: user._id,
//       role: user.role,
//     },
//     jwtSecret,
//     {
//       expiresIn: "7d",
//     }
//   );
// };

// // ==========================================
// // USER RESPONSE
// // ==========================================

// const getUserResponse = (user) => {
//   return {
//     id: user._id,
//     firstName: user.firstName || "",
//     lastName: user.lastName || "",
//     email: user.email || "",
//     phone: user.phone || "",
//     role: user.role,
//     agencyName: user.agencyName || "",
//   };
// };

// // ==========================================
// // SIGNUP
// // ONLY CUSTOMER / AGENT
// // ==========================================

// const signup = async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       email,
//       phone,
//       password,
//       role,
//       agencyName,
//       city,
//       state,
//       gstNumber,
//     } = req.body;

//     if (!firstName || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "First name, email and password are required.",
//       });
//     }

//     if (role !== "customer" && role !== "agent") {
//       return res.status(403).json({
//         success: false,
//         message: "Invalid signup role.",
//       });
//     }

//     const cleanEmail = String(email).trim().toLowerCase();

//     const existingUser = await User.findOne({
//       email: cleanEmail,
//     });

//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         message: "An account with this email already exists.",
//       });
//     }

//     if (role === "agent") {
//       if (!agencyName || !city || !state) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Agency Name, City and State are required for Travel Agent registration.",
//         });
//       }
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);

//     const user = await User.create({
//       firstName: String(firstName).trim(),

//       lastName: lastName
//         ? String(lastName).trim()
//         : "",

//       email: cleanEmail,

//       phone: phone
//         ? String(phone).trim()
//         : "",

//       password: hashedPassword,

//       role,

//       agencyName:
//         role === "agent"
//           ? String(agencyName).trim()
//           : "",

//       city:
//         role === "agent"
//           ? String(city).trim()
//           : "",

//       state:
//         role === "agent"
//           ? String(state).trim()
//           : "",

//       gstNumber:
//         role === "agent"
//           ? gstNumber || ""
//           : "",

//       isActive: true,

//       resetPasswordOTP: null,
//       resetPasswordOTPExpires: null,
//       resetPasswordVerified: false,
//     });

//     const token = createToken(user);

//     return res.status(201).json({
//       success: true,
//       message: "Account created successfully.",
//       token,
//       user: getUserResponse(user),
//     });
//   } catch (error) {
//     console.error("Signup Error:", error);

//     if (error.code === 11000) {
//       return res.status(409).json({
//         success: false,
//         message: "An account with this email already exists.",
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Server error during signup.",
//     });
//   }
// };














// // ==========================================
// // LOGIN
// // CUSTOMER:
// // New email => auto create
// //
// // AGENT:
// // Must signup first
// //
// // ADMIN:
// // Must already exist
// // ==========================================

// const login = async (req, res) => {
//   try {
//     const {
//       email,
//       password,
//       loginType,
//     } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Please enter your email and password.",
//       });
//     }

//     const cleanEmail = String(email)
//       .trim()
//       .toLowerCase();

//     const selectedRole = loginType || "customer";

//     let user = await User.findOne({
//       email: cleanEmail,
//     });

//     // ========================================
//     // NEW CUSTOMER
//     // ========================================

//     if (!user) {
//       if (selectedRole === "customer") {
//         const hashedPassword = await bcrypt.hash(
//           password,
//           12
//         );

//         user = await User.create({
//           firstName: "Customer",
//           lastName: "",
//           email: cleanEmail,
//           phone: "",
//           password: hashedPassword,
//           role: "customer",
//           agencyName: "",
//           city: "",
//           state: "",
//           gstNumber: "",
//           isActive: true,
//           resetPasswordOTP: null,
//           resetPasswordOTPExpires: null,
//           resetPasswordVerified: false,
//         });

//         const token = createToken(user);

//         // ========================================
//         // LOGIN EMAIL FOR NEW CUSTOMER
//         // ========================================

//         try {
//           const resendApiKey = getEnv("RESEND_API_KEY");

//           const fromEmail =
//             getEnv("RESEND_FROM_EMAIL") ||
//             "onboarding@resend.dev";

//           const fromName =
//             getEnv("RESEND_FROM_NAME") ||
//             "Saiyed Travels";

//           if (!resendApiKey) {
//             console.error(
//               "Login Email Error: RESEND_API_KEY is missing."
//             );
//           } else {
//             const resend = new Resend(resendApiKey);

//             const loginTime = new Date().toLocaleString(
//               "en-IN",
//               {
//                 timeZone: "Asia/Kolkata",
//                 dateStyle: "medium",
//                 timeStyle: "short",
//               }
//             );

//             const { data, error } =
//               await resend.emails.send({
//                 from: `${fromName} <${fromEmail}>`,
//                 to: [user.email],
//                 subject:
//                   "Saiyed Travels - New Login Detected",

//                 html: `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8" />
//   <title>New Login Detected</title>
// </head>

// <body style="
//   margin:0;
//   padding:0;
//   background:#f4f8fc;
//   font-family:Arial,Helvetica,sans-serif;
// ">

//   <div style="
//     max-width:600px;
//     margin:35px auto;
//     padding:0 15px;
//   ">

//     <div style="
//       background:#ffffff;
//       border-radius:18px;
//       overflow:hidden;
//       border:1px solid #e4edf5;
//       box-shadow:0 10px 35px rgba(25,70,110,0.08);
//     ">

//       <div style="
//         padding:28px 30px;
//         background:linear-gradient(135deg,#176fe1,#08a9e8);
//       ">

//         <h1 style="
//           margin:0;
//           color:#ffffff;
//           font-size:28px;
//           font-weight:800;
//         ">
//           Saiyed Travels
//         </h1>

//         <p style="
//           margin:8px 0 0;
//           color:rgba(255,255,255,0.88);
//           font-size:13px;
//         ">
//           Secure Flight Booking & Travel Services
//         </p>

//       </div>

//       <div style="
//         padding:30px;
//       ">

//         <h2 style="
//           margin:0 0 14px;
//           color:#162d46;
//           font-size:22px;
//         ">
//           New Login Detected
//         </h2>

//         <p style="
//           margin:0 0 14px;
//           color:#60758a;
//           font-size:14px;
//           line-height:1.6;
//         ">
//           Hello ${
//             user.firstName || "Customer"
//           },
//         </p>

//         <p style="
//           margin:0 0 18px;
//           color:#60758a;
//           font-size:14px;
//           line-height:1.6;
//         ">
//           Your Saiyed Travels account was successfully
//           logged in using your email address and password.
//         </p>

//         <div style="
//           margin:20px 0;
//           padding:18px;
//           background:#f6faff;
//           border:1px solid #dceaf7;
//           border-radius:12px;
//         ">

//           <p style="
//             margin:0 0 10px;
//             color:#304b65;
//             font-size:13px;
//           ">
//             <strong>Email:</strong>
//             ${user.email}
//           </p>

//           <p style="
//             margin:0 0 10px;
//             color:#304b65;
//             font-size:13px;
//           ">
//             <strong>Login Type:</strong>
//             Customer
//           </p>

//           <p style="
//             margin:0;
//             color:#304b65;
//             font-size:13px;
//           ">
//             <strong>Login Time:</strong>
//             ${loginTime}
//           </p>

//         </div>

//         <p style="
//           margin:0 0 12px;
//           color:#667b90;
//           font-size:13px;
//           line-height:1.6;
//         ">
//           If this login was made by you, no action is required.
//         </p>

//         <p style="
//           margin:0;
//           color:#dc2626;
//           font-size:13px;
//           line-height:1.6;
//           font-weight:600;
//         ">
//           If you did not perform this login, please reset
//           your password immediately.
//         </p>

//         <div style="
//           margin-top:25px;
//           padding-top:18px;
//           border-top:1px solid #e8eef4;
//         ">

//           <p style="
//             margin:0;
//             color:#9aa8b7;
//             font-size:11px;
//           ">
//             © ${new Date().getFullYear()}
//             Saiyed Travels. All Rights Reserved.
//           </p>

//         </div>

//       </div>

//     </div>

//   </div>

// </body>
// </html>
//                 `,
//               });

//             if (error) {
//               console.error(
//                 "Login Security Email Error:",
//                 error
//               );
//             } else {
//               console.log(
//                 "New customer login email sent:",
//                 data
//               );
//             }
//           }
//         } catch (emailError) {
//           console.error(
//             "Login Security Email Error:",
//             emailError
//           );
//         }

//         return res.status(201).json({
//           success: true,
//           message:
//             "Customer account created and login successful.",
//           token,
//           user: getUserResponse(user),
//           newCustomer: true,
//         });
//       }

//       if (selectedRole === "agent") {
//         return res.status(404).json({
//           success: false,
//           message:
//             "Agent account not found. Please sign up first.",
//         });
//       }

//       return res.status(404).json({
//         success: false,
//         message: "Admin account not found.",
//       });
//     }

//     // ========================================
//     // ACCOUNT ACTIVE
//     // ========================================

//     if (!user.isActive) {
//       return res.status(403).json({
//         success: false,
//         message: "Your account has been disabled.",
//       });
//     }

//     // ========================================
//     // ROLE CHECK
//     // ========================================

//     if (user.role !== selectedRole) {
//       const roleName =
//         user.role === "customer"
//           ? "Customer"
//           : user.role === "agent"
//           ? "Travel Agent"
//           : "Admin";

//       return res.status(401).json({
//         success: false,
//         message:
//           `This account is registered as ${roleName}. Please select the correct login type.`,
//       });
//     }

//     // ========================================
//     // PASSWORD CHECK
//     // ========================================

//     if (!user.password) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "Password login is not available for this account.",
//       });
//     }

//     const passwordMatch = await bcrypt.compare(
//       password,
//       user.password
//     );

//     // ========================================
//     // WRONG PASSWORD
//     // NO EMAIL WILL BE SENT
//     // ========================================

//     if (!passwordMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password.",
//       });
//     }

//     // ========================================
//     // CREATE TOKEN
//     // ========================================

//     const token = createToken(user);

//     // ========================================
//     // LOGIN SECURITY EMAIL
//     // ONLY AFTER SUCCESSFUL LOGIN
//     // ========================================

//     try {
//       const resendApiKey = getEnv("RESEND_API_KEY");

//       const fromEmail =
//         getEnv("RESEND_FROM_EMAIL") ||
//         "onboarding@resend.dev";

//       const fromName =
//         getEnv("RESEND_FROM_NAME") ||
//         "Saiyed Travels";

//       if (!resendApiKey) {
//         console.error(
//           "Login Email Error: RESEND_API_KEY is missing."
//         );
//       } else {
//         const resend = new Resend(resendApiKey);

//         const loginTime = new Date().toLocaleString(
//           "en-IN",
//           {
//             timeZone: "Asia/Kolkata",
//             dateStyle: "medium",
//             timeStyle: "short",
//           }
//         );

//         const roleLabel =
//           user.role === "agent"
//             ? "Travel Agent"
//             : user.role === "admin"
//             ? "Admin"
//             : "Customer";

//         const { data, error } =
//           await resend.emails.send({
//             from: `${fromName} <${fromEmail}>`,
//             to: [user.email],

//             subject:
//               "Saiyed Travels - New Login Detected",

//             html: `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8" />
//   <title>New Login Detected</title>
// </head>

// <body style="
//   margin:0;
//   padding:0;
//   background:#f4f8fc;
//   font-family:Arial,Helvetica,sans-serif;
// ">

//   <div style="
//     max-width:600px;
//     margin:35px auto;
//     padding:0 15px;
//   ">

//     <div style="
//       background:#ffffff;
//       border-radius:18px;
//       overflow:hidden;
//       border:1px solid #e4edf5;
//       box-shadow:0 10px 35px rgba(25,70,110,0.08);
//     ">

//       <div style="
//         padding:28px 30px;
//         background:linear-gradient(135deg,#176fe1,#08a9e8);
//       ">

//         <h1 style="
//           margin:0;
//           color:#ffffff;
//           font-size:28px;
//           font-weight:800;
//         ">
//           Saiyed Travels
//         </h1>

//         <p style="
//           margin:8px 0 0;
//           color:rgba(255,255,255,0.88);
//           font-size:13px;
//         ">
//           Secure Flight Booking & Travel Services
//         </p>

//       </div>

//       <div style="
//         padding:30px;
//       ">

//         <h2 style="
//           margin:0 0 14px;
//           color:#162d46;
//           font-size:22px;
//         ">
//           New Login Detected
//         </h2>

//         <p style="
//           margin:0 0 14px;
//           color:#60758a;
//           font-size:14px;
//           line-height:1.6;
//         ">
//           Hello ${
//             user.firstName || roleLabel
//           },
//         </p>

//         <p style="
//           margin:0 0 18px;
//           color:#60758a;
//           font-size:14px;
//           line-height:1.6;
//         ">
//           Your Saiyed Travels account was successfully
//           logged in using your email address and password.
//         </p>

//         <div style="
//           margin:20px 0;
//           padding:18px;
//           background:#f6faff;
//           border:1px solid #dceaf7;
//           border-radius:12px;
//         ">

//           <p style="
//             margin:0 0 10px;
//             color:#304b65;
//             font-size:13px;
//           ">
//             <strong>Email:</strong>
//             ${user.email}
//           </p>

//           <p style="
//             margin:0 0 10px;
//             color:#304b65;
//             font-size:13px;
//           ">
//             <strong>Login Type:</strong>
//             ${roleLabel}
//           </p>

//           <p style="
//             margin:0;
//             color:#304b65;
//             font-size:13px;
//           ">
//             <strong>Login Time:</strong>
//             ${loginTime}
//           </p>

//         </div>

//         <p style="
//           margin:0 0 12px;
//           color:#667b90;
//           font-size:13px;
//           line-height:1.6;
//         ">
//           If this login was made by you, no action is required.
//         </p>

//         <p style="
//           margin:0;
//           color:#dc2626;
//           font-size:13px;
//           line-height:1.6;
//           font-weight:600;
//         ">
//           If you did not perform this login, please reset
//           your password immediately.
//         </p>

//         <div style="
//           margin-top:25px;
//           padding-top:18px;
//           border-top:1px solid #e8eef4;
//         ">

//           <p style="
//             margin:0;
//             color:#9aa8b7;
//             font-size:11px;
//           ">
//             © ${new Date().getFullYear()}
//             Saiyed Travels. All Rights Reserved.
//           </p>

//         </div>

//       </div>

//     </div>

//   </div>

// </body>
// </html>
//             `,
//           });

//         if (error) {
//           console.error(
//             "Login Security Email Error:",
//             error
//           );
//         } else {
//           console.log(
//             "Login security email sent:",
//             data
//           );
//         }
//       }
//     } catch (emailError) {
//       // Email fail hone par login fail nahi hoga
//       console.error(
//         "Login Security Email Error:",
//         emailError
//       );
//     }

//     // ========================================
//     // SUCCESS LOGIN RESPONSE
//     // ========================================

//     return res.json({
//       success: true,
//       message: "Login successful.",
//       token,
//       user: getUserResponse(user),
//       newCustomer: false,
//     });

//   } catch (error) {
//     console.error("Login Error:", error);

//     if (error.code === 11000) {
//       return res.status(409).json({
//         success: false,
//         message:
//           "This email is already registered. Please login again.",
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Server error during login.",
//     });
//   }
// };


// // ==========================================
// // FORGOT PASSWORD
// // SEND OTP
// // ==========================================

// const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email address is required.",
//       });
//     }

//     const cleanEmail = String(email)
//       .trim()
//       .toLowerCase();

//     // ========================================
//     // FIND USER
//     // ========================================

//     const user = await User.findOne({
//       email: cleanEmail,
//     });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "No account found with this email address.",
//       });
//     }

//     // ========================================
//     // PASSWORD CHECK
//     // ========================================

//     if (!user.password) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Password reset is not available for this account.",
//       });
//     }

//     // ========================================
//     // RESEND ENV CHECK
//     // ========================================

//     const resendApiKey = getEnv(
//       "RESEND_API_KEY"
//     );

//     const fromEmail = getEnv(
//       "RESEND_FROM_EMAIL"
//     ) || "onboarding@resend.dev";

//     const fromName = getEnv(
//       "RESEND_FROM_NAME"
//     ) || "Saiyed Travels";

//     if (!resendApiKey) {
//       console.error(
//         "RESEND_API_KEY is missing."
//       );

//       return res.status(500).json({
//         success: false,
//         message:
//           "Email service is not configured. Please add RESEND_API_KEY in backend .env.",
//       });
//     }

//     // ========================================
//     // BASIC KEY FORMAT CHECK
//     // ========================================

//     if (!resendApiKey.startsWith("re_")) {
//       console.error(
//         "Invalid RESEND_API_KEY format."
//       );

//       return res.status(500).json({
//         success: false,
//         message:
//           "Invalid Resend API key format. Your API key should start with re_.",
//       });
//     }

//     // ========================================
//     // CREATE RESEND CLIENT
//     // ========================================

//     const resend = new Resend(
//       resendApiKey
//     );

//     // ========================================
//     // GENERATE OTP
//     // ========================================

//     const otp = Math.floor(
//       100000 +
//         Math.random() * 900000
//     ).toString();

//     const expires = new Date(
//       Date.now() +
//         10 * 60 * 1000
//     );

//     // ========================================
//     // SEND EMAIL FIRST
//     // ========================================

//     const {
//       data,
//       error,
//     } = await resend.emails.send({
//       from: `${fromName} <${fromEmail}>`,

//       to: [user.email],

//       subject:
//         "Saiyed Travels - Password Reset OTP",

//       html: `
//         <!DOCTYPE html>
//         <html>
//           <body style="
//             margin:0;
//             padding:0;
//             background:#f4f8fc;
//             font-family:Arial,Helvetica,sans-serif;
//           ">

//             <div style="
//               max-width:600px;
//               margin:35px auto;
//               padding:0 15px;
//             ">

//               <div style="
//                 background:#ffffff;
//                 border-radius:18px;
//                 overflow:hidden;
//                 border:1px solid #e4edf5;
//                 box-shadow:0 10px 35px rgba(25,70,110,0.08);
//               ">

//                 <div style="
//                   padding:28px 30px;
//                   background:linear-gradient(135deg,#176fe1,#08a9e8);
//                 ">

//                   <h1 style="
//                     margin:0;
//                     color:#ffffff;
//                     font-size:28px;
//                     font-weight:800;
//                   ">
//                     Saiyed Travels
//                   </h1>

//                   <p style="
//                     margin:8px 0 0;
//                     color:rgba(255,255,255,0.88);
//                     font-size:13px;
//                   ">
//                     Secure Flight Booking & Travel Services
//                   </p>

//                 </div>

//                 <div style="
//                   padding:30px;
//                 ">

//                   <h2 style="
//                     margin:0 0 12px;
//                     color:#162d46;
//                     font-size:22px;
//                   ">
//                     Password Reset
//                   </h2>

//                   <p style="
//                     margin:0 0 14px;
//                     color:#60758a;
//                     font-size:14px;
//                     line-height:1.6;
//                   ">
//                     Hello ${
//                       user.firstName ||
//                       "Customer"
//                     },
//                   </p>

//                   <p style="
//                     margin:0 0 14px;
//                     color:#60758a;
//                     font-size:14px;
//                     line-height:1.6;
//                   ">
//                     We received a request to reset the password
//                     for your Saiyed Travels account.
//                   </p>

//                   <p style="
//                     margin:22px 0 8px;
//                     color:#304b65;
//                     font-size:13px;
//                     font-weight:700;
//                   ">
//                     Your verification OTP:
//                   </p>

//                   <div style="
//                     margin:10px 0 24px;
//                     padding:18px;
//                     text-align:center;
//                     background:#eef7ff;
//                     border:2px solid #2380df;
//                     border-radius:14px;
//                   ">

//                     <span style="
//                       color:#176ddd;
//                       font-size:34px;
//                       font-weight:800;
//                       letter-spacing:8px;
//                     ">
//                       ${otp}
//                     </span>

//                   </div>

//                   <p style="
//                     margin:0 0 10px;
//                     color:#667b90;
//                     font-size:13px;
//                     line-height:1.6;
//                   ">
//                     This OTP is valid for
//                     <strong>10 minutes</strong>.
//                   </p>

//                   <p style="
//                     margin:18px 0 0;
//                     color:#8a9aab;
//                     font-size:12px;
//                     line-height:1.6;
//                   ">
//                     If you did not request a password reset,
//                     please ignore this email.
//                   </p>

//                   <div style="
//                     margin-top:25px;
//                     padding-top:18px;
//                     border-top:1px solid #e8eef4;
//                   ">

//                     <p style="
//                       margin:0;
//                       color:#9aa8b7;
//                       font-size:11px;
//                     ">
//                       © ${new Date().getFullYear()}
//                       Saiyed Travels. All Rights Reserved.
//                     </p>

//                   </div>

//                 </div>

//               </div>

//             </div>

//           </body>
//         </html>
//       `,
//     });

//     // ========================================
//     // RESEND ERROR
//     // ========================================

//     if (error) {
//       console.error(
//         "RESEND ERROR:",
//         error
//       );

//       const resendMessage =
//         error.message ||
//         error.name ||
//         "Resend email service failed.";

//       return res.status(500).json({
//         success: false,
//         message: resendMessage,
//       });
//     }

//     // ========================================
//     // SAVE OTP ONLY AFTER EMAIL SUCCESS
//     // ========================================

//     user.resetPasswordOTP = otp;

//     user.resetPasswordOTPExpires =
//       expires;

//     user.resetPasswordVerified =
//       false;

//     await user.save();

//     console.log(
//       "OTP email sent successfully:",
//       data
//     );

//     return res.json({
//       success: true,
//       message:
//         "OTP has been sent to your email address.",
//     });
//   } catch (error) {
//     console.error(
//       "FORGOT PASSWORD ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         error.message ||
//         "Unable to send OTP.",
//     });
//   }
// };

// // ==========================================
// // VERIFY OTP
// // ==========================================

// const verifyOTP = async (req, res) => {
//   try {
//     const {
//       email,
//       otp,
//     } = req.body;

//     if (!email || !otp) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Email and OTP are required.",
//       });
//     }

//     const cleanEmail = String(email)
//       .trim()
//       .toLowerCase();

//     const cleanOTP = String(otp).trim();

//     if (!/^\d{6}$/.test(cleanOTP)) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "OTP must be a 6-digit number.",
//       });
//     }

//     const user = await User.findOne({
//       email: cleanEmail,
//     });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     if (!user.resetPasswordOTP) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "No password reset request found.",
//       });
//     }

//     if (
//       !user.resetPasswordOTPExpires ||
//       user.resetPasswordOTPExpires <
//         new Date()
//     ) {
//       user.resetPasswordOTP = null;
//       user.resetPasswordOTPExpires = null;
//       user.resetPasswordVerified = false;

//       await user.save();

//       return res.status(400).json({
//         success: false,
//         message:
//           "OTP has expired. Please request a new OTP.",
//       });
//     }

//     if (
//       String(user.resetPasswordOTP) !==
//       cleanOTP
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Invalid OTP. Please try again.",
//       });
//     }

//     user.resetPasswordVerified =
//       true;

//     await user.save();

//     return res.json({
//       success: true,
//       message:
//         "OTP verified successfully.",
//     });
//   } catch (error) {
//     console.error(
//       "Verify OTP Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while verifying OTP.",
//     });
//   }
// };

// // ==========================================
// // RESET PASSWORD
// // ==========================================

// const resetPassword = async (req, res) => {
//   try {
//     const {
//       email,
//       newPassword,
//     } = req.body;

//     if (!email || !newPassword) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Email and new password are required.",
//       });
//     }

//     if (String(newPassword).length < 6) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Password must be at least 6 characters.",
//       });
//     }

//     const cleanEmail = String(email)
//       .trim()
//       .toLowerCase();

//     const user = await User.findOne({
//       email: cleanEmail,
//     });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     if (!user.resetPasswordVerified) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "Please verify the OTP first.",
//       });
//     }

//     // ========================================
//     // EXTRA EXPIRY CHECK
//     // ========================================

//     if (
//       user.resetPasswordOTPExpires &&
//       user.resetPasswordOTPExpires <
//         new Date()
//     ) {
//       user.resetPasswordOTP = null;
//       user.resetPasswordOTPExpires = null;
//       user.resetPasswordVerified = false;

//       await user.save();

//       return res.status(400).json({
//         success: false,
//         message:
//           "Password reset session expired. Please request a new OTP.",
//       });
//     }

//     const hashedPassword =
//       await bcrypt.hash(
//         newPassword,
//         12
//       );

//     user.password =
//       hashedPassword;

//     user.resetPasswordOTP = null;

//     user.resetPasswordOTPExpires =
//       null;

//     user.resetPasswordVerified =
//       false;

//     await user.save();

//     return res.json({
//       success: true,
//       message:
//         "Password reset successfully. You can now login.",
//     });
//   } catch (error) {
//     console.error(
//       "Reset Password Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Server error while resetting password.",
//     });
//   }
// };

// // ==========================================
// // EXPORT
// // ==========================================

// module.exports = {
//   signup,
//   login,
//   forgotPassword,
//   verifyOTP,
//   resetPassword,
// };






const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");

const User = require("../models/User");

// ==========================================
// HELPERS
// ==========================================

const getEnv = (name) => {
  return process.env[name]
    ? String(process.env[name]).trim()
    : "";
};

// ==========================================
// CREATE JWT
// ==========================================

const createToken = (user) => {
  const jwtSecret = getEnv("JWT_SECRET");

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is missing in backend .env");
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    jwtSecret,
    {
      expiresIn: "7d",
    }
  );
};

// ==========================================
// USER RESPONSE
// ==========================================

const getUserResponse = (user) => {
  return {
    id: user._id,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    role: user.role,
    agencyName: user.agencyName || "",
  };
};

// ==========================================
// SIGNUP
// ONLY CUSTOMER / AGENT
// ==========================================

const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
      agencyName,
      city,
      state,
      gstNumber,
    } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "First name, email and password are required.",
      });
    }

    if (role !== "customer" && role !== "agent") {
      return res.status(403).json({
        success: false,
        message: "Invalid signup role.",
      });
    }

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    if (role === "agent") {
      if (!agencyName || !city || !state) {
        return res.status(400).json({
          success: false,
          message:
            "Agency Name, City and State are required for Travel Agent registration.",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName: String(firstName).trim(),

      lastName: lastName
        ? String(lastName).trim()
        : "",

      email: cleanEmail,

      phone: phone
        ? String(phone).trim()
        : "",

      password: hashedPassword,

      role,

      agencyName:
        role === "agent"
          ? String(agencyName).trim()
          : "",

      city:
        role === "agent"
          ? String(city).trim()
          : "",

      state:
        role === "agent"
          ? String(state).trim()
          : "",

      gstNumber:
        role === "agent"
          ? gstNumber || ""
          : "",

      isActive: true,

      resetPasswordOTP: null,
      resetPasswordOTPExpires: null,
      resetPasswordVerified: false,
    });

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: getUserResponse(user),
    });

  } catch (error) {
    console.error("Signup Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during signup.",
    });
  }
};

// ==========================================
// LOGIN
// CUSTOMER:
// New email => auto create
//
// AGENT:
// Must signup first
//
// ADMIN:
// Must already exist
// ==========================================

const login = async (req, res) => {
  try {
    const {
      email,
      password,
      loginType,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password.",
      });
    }

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    const selectedRole = loginType || "customer";

    let user = await User.findOne({
      email: cleanEmail,
    });

    // ========================================
    // NEW CUSTOMER
    // ========================================

    if (!user) {
      if (selectedRole === "customer") {
        const hashedPassword = await bcrypt.hash(
          password,
          12
        );

        user = await User.create({
          firstName: "Customer",
          lastName: "",
          email: cleanEmail,
          phone: "",
          password: hashedPassword,
          role: "customer",
          agencyName: "",
          city: "",
          state: "",
          gstNumber: "",
          isActive: true,
          resetPasswordOTP: null,
          resetPasswordOTPExpires: null,
          resetPasswordVerified: false,
        });

        const token = createToken(user);

        // ========================================
        // LOGIN EMAIL FOR NEW CUSTOMER
        // ========================================

        try {
          const resendApiKey = getEnv(
            "RESEND_API_KEY"
          );

          const fromEmail =
            getEnv("RESEND_FROM_EMAIL") ||
            "onboarding@resend.dev";

          const fromName =
            getEnv("RESEND_FROM_NAME") ||
            "Saiyed Travels";

          if (!resendApiKey) {
            console.error(
              "Login Email Error: RESEND_API_KEY is missing."
            );
          } else {
            const resend = new Resend(
              resendApiKey
            );

            const loginTime =
              new Date().toLocaleString(
                "en-IN",
                {
                  timeZone: "Asia/Kolkata",
                  dateStyle: "medium",
                  timeStyle: "short",
                }
              );

            const { data, error } =
              await resend.emails.send({
                from: `${fromName} <${fromEmail}>`,
                to: [user.email],
                subject:
                  "Saiyed Travels - New Login Detected",

                html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>New Login Detected</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f4f8fc;
  font-family:Arial,Helvetica,sans-serif;
">

  <div style="
    max-width:600px;
    margin:35px auto;
    padding:0 15px;
  ">

    <div style="
      background:#ffffff;
      border-radius:18px;
      overflow:hidden;
      border:1px solid #e4edf5;
      box-shadow:0 10px 35px rgba(25,70,110,0.08);
    ">

      <div style="
        padding:28px 30px;
        background:linear-gradient(135deg,#176fe1,#08a9e8);
      ">

        <h1 style="
          margin:0;
          color:#ffffff;
          font-size:28px;
          font-weight:800;
        ">
          Saiyed Travels
        </h1>

        <p style="
          margin:8px 0 0;
          color:rgba(255,255,255,0.88);
          font-size:13px;
        ">
          Secure Flight Booking & Travel Services
        </p>

      </div>

      <div style="
        padding:30px;
      ">

        <h2 style="
          margin:0 0 14px;
          color:#162d46;
          font-size:22px;
        ">
          New Login Detected
        </h2>

        <p style="
          margin:0 0 14px;
          color:#60758a;
          font-size:14px;
          line-height:1.6;
        ">
          Hello ${user.firstName || "Customer"},
        </p>

        <p style="
          margin:0 0 18px;
          color:#60758a;
          font-size:14px;
          line-height:1.6;
        ">
          Your Saiyed Travels account was successfully
          logged in using your email address and password.
        </p>

        <div style="
          margin:20px 0;
          padding:18px;
          background:#f6faff;
          border:1px solid #dceaf7;
          border-radius:12px;
        ">

          <p style="
            margin:0 0 10px;
            color:#304b65;
            font-size:13px;
          ">
            <strong>Email:</strong>
            ${user.email}
          </p>

          <p style="
            margin:0 0 10px;
            color:#304b65;
            font-size:13px;
          ">
            <strong>Login Type:</strong>
            Customer
          </p>

          <p style="
            margin:0;
            color:#304b65;
            font-size:13px;
          ">
            <strong>Login Time:</strong>
            ${loginTime}
          </p>

        </div>

        <p style="
          margin:0 0 12px;
          color:#667b90;
          font-size:13px;
          line-height:1.6;
        ">
          If this login was made by you, no action is required.
        </p>

        <p style="
          margin:0;
          color:#dc2626;
          font-size:13px;
          line-height:1.6;
          font-weight:600;
        ">
          If you did not perform this login, please reset
          your password immediately.
        </p>

        <div style="
          margin-top:25px;
          padding-top:18px;
          border-top:1px solid #e8eef4;
        ">

          <p style="
            margin:0;
            color:#9aa8b7;
            font-size:11px;
          ">
            © ${new Date().getFullYear()}
            Saiyed Travels. All Rights Reserved.
          </p>

        </div>

      </div>

    </div>

  </div>

</body>
</html>
                `,
              });

            if (error) {
              console.error(
                "Login Security Email Error:",
                error
              );
            } else {
              console.log(
                "New customer login email sent:",
                data
              );
            }
          }
        } catch (emailError) {
          console.error(
            "Login Security Email Error:",
            emailError
          );
        }

        return res.status(201).json({
          success: true,
          message:
            "Customer account created and login successful.",
          token,
          user: getUserResponse(user),
          newCustomer: true,
        });
      }

      if (selectedRole === "agent") {
        return res.status(404).json({
          success: false,
          message:
            "Agent account not found. Please sign up first.",
        });
      }

      return res.status(404).json({
        success: false,
        message: "Admin account not found.",
      });
    }

    // ========================================
    // ACCOUNT ACTIVE
    // ========================================

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been disabled.",
      });
    }

    // ========================================
    // ROLE CHECK
    // ========================================

    if (user.role !== selectedRole) {
      const roleName =
        user.role === "customer"
          ? "Customer"
          : user.role === "agent"
          ? "Travel Agent"
          : "Admin";

      return res.status(401).json({
        success: false,
        message:
          `This account is registered as ${roleName}. Please select the correct login type.`,
      });
    }

    // ========================================
    // PASSWORD CHECK
    // ========================================

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message:
          "Password login is not available for this account.",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    // ========================================
    // WRONG PASSWORD
    // NO EMAIL WILL BE SENT
    // ========================================

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ========================================
    // CREATE TOKEN
    // ========================================

    const token = createToken(user);

    // ========================================
    // LOGIN SECURITY EMAIL
    // ONLY AFTER SUCCESSFUL LOGIN
    // ========================================

    try {
      const resendApiKey = getEnv(
        "RESEND_API_KEY"
      );

      const fromEmail =
        getEnv("RESEND_FROM_EMAIL") ||
        "onboarding@resend.dev";

      const fromName =
        getEnv("RESEND_FROM_NAME") ||
        "Saiyed Travels";

      if (!resendApiKey) {
        console.error(
          "Login Email Error: RESEND_API_KEY is missing."
        );
      } else {
        const resend = new Resend(
          resendApiKey
        );

        const loginTime =
          new Date().toLocaleString(
            "en-IN",
            {
              timeZone: "Asia/Kolkata",
              dateStyle: "medium",
              timeStyle: "short",
            }
          );

        const roleLabel =
          user.role === "agent"
            ? "Travel Agent"
            : user.role === "admin"
            ? "Admin"
            : "Customer";

        const { data, error } =
          await resend.emails.send({
            from: `${fromName} <${fromEmail}>`,
            to: [user.email],

            subject:
              "Saiyed Travels - New Login Detected",

            html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>New Login Detected</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f4f8fc;
  font-family:Arial,Helvetica,sans-serif;
">

  <div style="
    max-width:600px;
    margin:35px auto;
    padding:0 15px;
  ">

    <div style="
      background:#ffffff;
      border-radius:18px;
      overflow:hidden;
      border:1px solid #e4edf5;
      box-shadow:0 10px 35px rgba(25,70,110,0.08);
    ">

      <div style="
        padding:28px 30px;
        background:linear-gradient(135deg,#176fe1,#08a9e8);
      ">

        <h1 style="
          margin:0;
          color:#ffffff;
          font-size:28px;
          font-weight:800;
        ">
          Saiyed Travels
        </h1>

        <p style="
          margin:8px 0 0;
          color:rgba(255,255,255,0.88);
          font-size:13px;
        ">
          Secure Flight Booking & Travel Services
        </p>

      </div>

      <div style="
        padding:30px;
      ">

        <h2 style="
          margin:0 0 14px;
          color:#162d46;
          font-size:22px;
        ">
          New Login Detected
        </h2>

        <p style="
          margin:0 0 14px;
          color:#60758a;
          font-size:14px;
          line-height:1.6;
        ">
          Hello ${user.firstName || roleLabel},
        </p>

        <p style="
          margin:0 0 18px;
          color:#60758a;
          font-size:14px;
          line-height:1.6;
        ">
          Your Saiyed Travels account was successfully
          logged in using your email address and password.
        </p>

        <div style="
          margin:20px 0;
          padding:18px;
          background:#f6faff;
          border:1px solid #dceaf7;
          border-radius:12px;
        ">

          <p style="
            margin:0 0 10px;
            color:#304b65;
            font-size:13px;
          ">
            <strong>Email:</strong>
            ${user.email}
          </p>

          <p style="
            margin:0 0 10px;
            color:#304b65;
            font-size:13px;
          ">
            <strong>Login Type:</strong>
            ${roleLabel}
          </p>

          <p style="
            margin:0;
            color:#304b65;
            font-size:13px;
          ">
            <strong>Login Time:</strong>
            ${loginTime}
          </p>

        </div>

        <p style="
          margin:0 0 12px;
          color:#667b90;
          font-size:13px;
          line-height:1.6;
        ">
          If this login was made by you, no action is required.
        </p>

        <p style="
          margin:0;
          color:#dc2626;
          font-size:13px;
          line-height:1.6;
          font-weight:600;
        ">
          If you did not perform this login, please reset
          your password immediately.
        </p>

        <div style="
          margin-top:25px;
          padding-top:18px;
          border-top:1px solid #e8eef4;
        ">

          <p style="
            margin:0;
            color:#9aa8b7;
            font-size:11px;
          ">
            © ${new Date().getFullYear()}
            Saiyed Travels. All Rights Reserved.
          </p>

        </div>

      </div>

    </div>

  </div>

</body>
</html>
            `,
          });

        if (error) {
          console.error(
            "Login Security Email Error:",
            error
          );
        } else {
          console.log(
            "Login security email sent:",
            data
          );
        }
      }
    } catch (emailError) {
      // Email fail hone par login fail nahi hoga
      console.error(
        "Login Security Email Error:",
        emailError
      );
    }

    // ========================================
    // SUCCESS LOGIN RESPONSE
    // ========================================

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: getUserResponse(user),
      newCustomer: false,
    });

  } catch (error) {
    console.error("Login Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "This email is already registered. Please login again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during login.",
    });
  }
};

// ==========================================
// FORGOT PASSWORD
// SEND OTP
// ==========================================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    // ========================================
    // FIND USER
    // ========================================

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "No account found with this email address.",
      });
    }

    // ========================================
    // PASSWORD CHECK
    // ========================================

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message:
          "Password reset is not available for this account.",
      });
    }

    // ========================================
    // RESEND ENV CHECK
    // ========================================

    const resendApiKey = getEnv(
      "RESEND_API_KEY"
    );

    const fromEmail =
      getEnv("RESEND_FROM_EMAIL") ||
      "onboarding@resend.dev";

    const fromName =
      getEnv("RESEND_FROM_NAME") ||
      "Saiyed Travels";

    if (!resendApiKey) {
      console.error(
        "RESEND_API_KEY is missing."
      );

      return res.status(500).json({
        success: false,
        message:
          "Email service is not configured. Please add RESEND_API_KEY in backend .env.",
      });
    }

    // ========================================
    // BASIC KEY FORMAT CHECK
    // ========================================

    if (!resendApiKey.startsWith("re_")) {
      console.error(
        "Invalid RESEND_API_KEY format."
      );

      return res.status(500).json({
        success: false,
        message:
          "Invalid Resend API key format. Your API key should start with re_.",
      });
    }

    // ========================================
    // CREATE RESEND CLIENT
    // ========================================

    const resend = new Resend(
      resendApiKey
    );

    // ========================================
    // GENERATE OTP
    // ========================================

    const otp = Math.floor(
      100000 +
      Math.random() * 900000
    ).toString();

    const expires = new Date(
      Date.now() +
      10 * 60 * 1000
    );

    // ========================================
    // SEND EMAIL FIRST
    // ========================================

    const {
      data,
      error,
    } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,

      to: [user.email],

      subject:
        "Saiyed Travels - Password Reset OTP",

      html: `
        <!DOCTYPE html>
        <html>
          <body style="
            margin:0;
            padding:0;
            background:#f4f8fc;
            font-family:Arial,Helvetica,sans-serif;
          ">

            <div style="
              max-width:600px;
              margin:35px auto;
              padding:0 15px;
            ">

              <div style="
                background:#ffffff;
                border-radius:18px;
                overflow:hidden;
                border:1px solid #e4edf5;
                box-shadow:0 10px 35px rgba(25,70,110,0.08);
              ">

                <div style="
                  padding:28px 30px;
                  background:linear-gradient(135deg,#176fe1,#08a9e8);
                ">

                  <h1 style="
                    margin:0;
                    color:#ffffff;
                    font-size:28px;
                    font-weight:800;
                  ">
                    Saiyed Travels
                  </h1>

                  <p style="
                    margin:8px 0 0;
                    color:rgba(255,255,255,0.88);
                    font-size:13px;
                  ">
                    Secure Flight Booking & Travel Services
                  </p>

                </div>

                <div style="
                  padding:30px;
                ">

                  <h2 style="
                    margin:0 0 12px;
                    color:#162d46;
                    font-size:22px;
                  ">
                    Password Reset
                  </h2>

                  <p style="
                    margin:0 0 14px;
                    color:#60758a;
                    font-size:14px;
                    line-height:1.6;
                  ">
                    Hello ${
                      user.firstName ||
                      "Customer"
                    },
                  </p>

                  <p style="
                    margin:0 0 14px;
                    color:#60758a;
                    font-size:14px;
                    line-height:1.6;
                  ">
                    We received a request to reset the password
                    for your Saiyed Travels account.
                  </p>

                  <p style="
                    margin:22px 0 8px;
                    color:#304b65;
                    font-size:13px;
                    font-weight:700;
                  ">
                    Your verification OTP:
                  </p>

                  <div style="
                    margin:10px 0 24px;
                    padding:18px;
                    text-align:center;
                    background:#eef7ff;
                    border:2px solid #2380df;
                    border-radius:14px;
                  ">

                    <span style="
                      color:#176ddd;
                      font-size:34px;
                      font-weight:800;
                      letter-spacing:8px;
                    ">
                      ${otp}
                    </span>

                  </div>

                  <p style="
                    margin:0 0 10px;
                    color:#667b90;
                    font-size:13px;
                    line-height:1.6;
                  ">
                    This OTP is valid for
                    <strong>10 minutes</strong>.
                  </p>

                  <p style="
                    margin:18px 0 0;
                    color:#8a9aab;
                    font-size:12px;
                    line-height:1.6;
                  ">
                    If you did not request a password reset,
                    please ignore this email.
                  </p>

                  <div style="
                    margin-top:25px;
                    padding-top:18px;
                    border-top:1px solid #e8eef4;
                  ">

                    <p style="
                      margin:0;
                      color:#9aa8b7;
                      font-size:11px;
                    ">
                      © ${new Date().getFullYear()}
                      Saiyed Travels. All Rights Reserved.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </body>
        </html>
      `,
    });

    // ========================================
    // RESEND ERROR
    // ========================================

    if (error) {
      console.error(
        "RESEND ERROR:",
        error
      );

      const resendMessage =
        error.message ||
        error.name ||
        "Resend email service failed.";

      return res.status(500).json({
        success: false,
        message: resendMessage,
      });
    }

    // ========================================
    // SAVE OTP ONLY AFTER EMAIL SUCCESS
    // ========================================

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordOTP: otp,
          resetPasswordOTPExpires: expires,
          resetPasswordVerified: false,
        },
      }
    );

    console.log(
      "OTP email sent successfully:",
      data
    );

    return res.json({
      success: true,
      message:
        "OTP has been sent to your email address.",
    });

  } catch (error) {
    console.error(
      "FORGOT PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to send OTP.",
    });
  }
};

// ==========================================
// VERIFY OTP
// ==========================================

const verifyOTP = async (req, res) => {
  try {
    const {
      email,
      otp,
    } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message:
          "Email and OTP are required.",
      });
    }

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    const cleanOTP = String(otp).trim();

    if (!/^\d{6}$/.test(cleanOTP)) {
      return res.status(400).json({
        success: false,
        message:
          "OTP must be a 6-digit number.",
      });
    }

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.resetPasswordOTP) {
      return res.status(400).json({
        success: false,
        message:
          "No password reset request found.",
      });
    }

    if (
      !user.resetPasswordOTPExpires ||
      user.resetPasswordOTPExpires <
        new Date()
    ) {
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            resetPasswordOTP: null,
            resetPasswordOTPExpires: null,
            resetPasswordVerified: false,
          },
        }
      );

      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please request a new OTP.",
      });
    }

    if (
      String(user.resetPasswordOTP) !==
      cleanOTP
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid OTP. Please try again.",
      });
    }

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordVerified: true,
        },
      }
    );

    return res.json({
      success: true,
      message:
        "OTP verified successfully.",
    });

  } catch (error) {
    console.error(
      "Verify OTP Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while verifying OTP.",
    });
  }
};

// ==========================================
// RESET PASSWORD
// ==========================================

const resetPassword = async (req, res) => {
  try {
    const {
      email,
      newPassword,
    } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Email and new password are required.",
      });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters.",
      });
    }

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.resetPasswordVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify the OTP first.",
      });
    }

    // ========================================
    // EXTRA EXPIRY CHECK
    // ========================================

    if (
      user.resetPasswordOTPExpires &&
      user.resetPasswordOTPExpires <
        new Date()
    ) {
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            resetPasswordOTP: null,
            resetPasswordOTPExpires: null,
            resetPasswordVerified: false,
          },
        }
      );

      return res.status(400).json({
        success: false,
        message:
          "Password reset session expired. Please request a new OTP.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        12
      );

    // ========================================
    // UPDATE PASSWORD
    // WITHOUT FULL DOCUMENT VALIDATION
    // ========================================

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          resetPasswordOTP: null,
          resetPasswordOTPExpires: null,
          resetPasswordVerified: false,
        },
      }
    );

    return res.json({
      success: true,
      message:
        "Password reset successfully. You can now login.",
    });

  } catch (error) {
    console.error(
      "Reset Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while resetting password.",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  signup,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
};