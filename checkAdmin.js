// // // const dotenv = require("dotenv");
// // // const bcrypt = require("bcryptjs");

// // // const connectDB = require("./config/db");
// // // const User = require("./models/User");

// // // dotenv.config();

// // // const checkAdmin = async () => {

// // //   try {

// // //     await connectDB();

// // //     const email = "admin@saiyedtravels.com";
// // //     const password = "Admin@12345";

// // //     const user = await User.findOne({
// // //       email: email.toLowerCase().trim(),
// // //     });

// // //     console.log("\n==============================");

// // //     if (!user) {

// // //       console.log("ADMIN NOT FOUND ❌");

// // //       console.log(
// // //         "Email searched:",
// // //         email
// // //       );

// // //       console.log("==============================\n");

// // //       process.exit(0);
// // //     }

// // //     console.log("ADMIN FOUND ✅");

// // //     console.log(
// // //       "Email:",
// // //       user.email
// // //     );

// // //     console.log(
// // //       "Role:",
// // //       user.role
// // //     );

// // //     console.log(
// // //       "Active:",
// // //       user.isActive
// // //     );

// // //     console.log(
// // //       "Password Hash Exists:",
// // //       !!user.password
// // //     );


// // //     const passwordMatch =
// // //       await bcrypt.compare(
// // //         password,
// // //         user.password
// // //       );

// // //     console.log(
// // //       "Password Match:",
// // //       passwordMatch
// // //         ? "YES ✅"
// // //         : "NO ❌"
// // //     );

// // //     console.log("==============================\n");

// // //     process.exit(0);

// // //   } catch (error) {

// // //     console.error(
// // //       "Check Admin Error:",
// // //       error
// // //     );

// // //     process.exit(1);

// // //   }

// // // };

// // // checkAdmin();


// // const dotenv = require("dotenv");
// // const bcrypt = require("bcryptjs");

// // const connectDB = require("./config/db");
// // const User = require("./models/User");

// // dotenv.config();

// // const checkAdmin = async () => {
// //   try {
// //     await connectDB();

// //     const email = "tohidsaiyed007@gmail.com";
// //     const password = "SaiyedT@786786";

// //     const user = await User.findOne({
// //       email: email.toLowerCase().trim(),
// //     });

// //     console.log("\n==============================");

// //     if (!user) {
// //       console.log("ADMIN NOT FOUND ❌");
// //       process.exit(0);
// //     }

// //     console.log("ADMIN FOUND ✅");
// //     console.log("Email:", user.email);
// //     console.log("Role:", user.role);
// //     console.log("Active:", user.isActive);
// //     console.log("Password Hash Exists:", !!user.password);

// //     const passwordMatch = await bcrypt.compare(
// //       password,
// //       user.password
// //     );

// //     console.log(
// //       "Password Match:",
// //       passwordMatch ? "YES ✅" : "NO ❌"
// //     );

// //     console.log("==============================\n");

// //     process.exit(0);

// //   } catch (error) {
// //     console.error("Check Admin Error:", error);
// //     process.exit(1);
// //   }
// // };

// // checkAdmin();



// const dotenv = require("dotenv");
// const bcrypt = require("bcryptjs");

// const connectDB = require("./config/db");
// const User = require("./models/User");

// dotenv.config();

// const checkAdmin = async () => {
//   try {
//     await connectDB();

//     const email = "tohidsaiyed007@gmail.com";
//     const password = "SaiyedT@786786";

//     const user = await User.findOne({
//       email: email.toLowerCase().trim(),
//     });

//     console.log("\n==============================");

//     if (!user) {
//       console.log("ADMIN NOT FOUND ❌");
//       console.log("Email searched:", email);
//       console.log("==============================\n");
//       process.exit(0);
//     }

//     console.log("ADMIN FOUND ✅");
//     console.log("Email:", user.email);
//     console.log("Role:", user.role);
//     console.log("Active:", user.isActive);
//     console.log(
//       "Password Hash Exists:",
//       !!user.password
//     );

//     const passwordMatch = await bcrypt.compare(
//       password,
//       user.password
//     );

//     console.log(
//       "Password Match:",
//       passwordMatch
//         ? "YES ✅"
//         : "NO ❌"
//     );

//     console.log("==============================\n");

//     process.exit(0);

//   } catch (error) {
//     console.error(
//       "Check Admin Error:",
//       error
//     );

//     process.exit(1);
//   }
// };

// checkAdmin();


const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

console.log("CHECK ADMIN STARTED...");

const checkAdmin = async () => {
  try {
    await connectDB();

    console.log("DATABASE CONNECTED...");

    const email = "tohidsaiyed007@gmail.com";
    const password = "SaiyedT@786786";

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      console.log("❌ ADMIN NOT FOUND");
      console.log("Searched Email:", email);
      process.exit(0);
    }

    console.log("✅ ADMIN FOUND");
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log("Active:", user.isActive);
    console.log("Password Hash:", !!user.password);

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log(
      "Password Match:",
      passwordMatch
        ? "✅ YES"
        : "❌ NO"
    );

    console.log("CHECK COMPLETE.");

    process.exit(0);

  } catch (error) {

    console.error(
      "❌ ERROR:",
      error
    );

    process.exit(1);
  }
};

checkAdmin();