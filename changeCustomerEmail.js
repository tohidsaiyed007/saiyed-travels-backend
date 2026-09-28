const dotenv = require("dotenv");

const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const changeCustomerEmail = async () => {
  try {
    await connectDB();

    const oldEmail = "tohidsaiyed007@gmail.com";
    const newEmail = "customer@saiyedtravels.com";

    // Find account only by email
    const user = await User.findOne({
      email: oldEmail.toLowerCase().trim(),
    });

    if (!user) {
      console.log("❌ Account not found.");
      process.exit(1);
    }

    console.log("Account found:");
    console.log("Email:", user.email);
    console.log("Role:", user.role);

    // Check temporary email
    const existingUser = await User.findOne({
      email: newEmail.toLowerCase().trim(),
    });

    if (existingUser) {
      console.log(
        "❌ customer@saiyedtravels.com is already registered."
      );
      process.exit(1);
    }

    // Change only email
    user.email = newEmail;

    await user.save();

    console.log("");
    console.log("==============================");
    console.log("EMAIL CHANGED SUCCESSFULLY ✅");
    console.log("==============================");
    console.log("Old Email:", oldEmail);
    console.log("New Email:", newEmail);
    console.log("Role:", user.role);
    console.log("==============================");

    process.exit(0);

  } catch (error) {
    console.error(
      "❌ Change Email Error:",
      error
    );

    process.exit(1);
  }
};

changeCustomerEmail();