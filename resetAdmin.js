const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const resetAdmin = async () => {
  try {
    await connectDB();

    const email = "tohidsaiyed007@gmail.com";
    const password = "SaiyedT@786786";

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    const admin = await User.findOneAndUpdate(
      {
        role: "admin",
      },
      {
        $set: {
          email: email,
          password: hashedPassword,
          role: "admin",
          isActive: true,
        },
      },
      {
        new: true,
      }
    );

    if (!admin) {
      console.log("❌ Admin account not found.");
      process.exit(1);
    }

    console.log("");
    console.log("==============================");
    console.log("ADMIN RESET SUCCESSFULLY ✅");
    console.log("==============================");
    console.log("Email:", admin.email);
    console.log("Password:", password);
    console.log("Role:", admin.role);
    console.log("Active:", admin.isActive);
    console.log("==============================");
    console.log("");

    process.exit(0);

  } catch (error) {
    console.error(
      "❌ Reset Admin Error:",
      error
    );

    process.exit(1);
  }
};

resetAdmin();