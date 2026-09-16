const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const changeAdminCredentials = async () => {
  try {
    await connectDB();

    const oldEmail = "admin@saiyedtravels.com";

    const newEmail = "tohidsaiyed007@gmail.com";
    const newPassword = "SaiyedT@786786";

    // Find existing admin
    const admin = await User.findOne({
      email: oldEmail,
      role: "admin",
    });

    if (!admin) {
      console.log("Admin account not found.");
      process.exit(1);
    }

    // Check whether new email is already used
    const existingUser = await User.findOne({
      email: newEmail,
      _id: { $ne: admin._id },
    });

    if (existingUser) {
      console.log("This email is already registered.");
      process.exit(1);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      12
    );

    // Update credentials
    admin.email = newEmail;
    admin.password = hashedPassword;
    admin.role = "admin";
    admin.isActive = true;

    await admin.save();

    console.log("================================");
    console.log("Admin Credentials Updated ✅");
    console.log("New Email:", newEmail);
    console.log("New Password:", newPassword);
    console.log("Role:", admin.role);
    console.log("================================");

    process.exit(0);

  } catch (error) {
    console.error(
      "Change Admin Credentials Error:",
      error
    );

    process.exit(1);
  }
};

changeAdminCredentials();