const dotenv = require("dotenv");

const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const findEmail = async () => {
  try {
    await connectDB();

    const email = "tohidsaiyed007@gmail.com";

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select(
      "firstName lastName email role isActive"
    );

    console.log("");
    console.log("==============================");

    if (!user) {
      console.log("EMAIL NOT FOUND ❌");
    } else {
      console.log("EMAIL FOUND ✅");
      console.log("Name:", user.firstName, user.lastName);
      console.log("Email:", user.email);
      console.log("Role:", user.role);
      console.log("Active:", user.isActive);
      console.log("User ID:", user._id);
    }

    console.log("==============================");
    console.log("");

    process.exit(0);

  } catch (error) {
    console.error("Find Email Error:", error);
    process.exit(1);
  }
};

findEmail();