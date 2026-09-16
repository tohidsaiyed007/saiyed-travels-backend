const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {

  try {

    await connectDB();

    const email = "admin@saiyedtravels.com";
    const password = "Admin@12345";

    // Check existing admin
    const existingAdmin = await User.findOne({
      email,
    });

    if (existingAdmin) {

      console.log("Admin already exists.");

      process.exit(0);
    }


    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 12);


    // Create admin
    const admin = await User.create({

      firstName: "Saiyed",

      lastName: "Travels",

      email,

      phone: "",

      password: hashedPassword,

      role: "admin",

      agencyName: "",

      city: "",

      state: "",

      gstNumber: "",

      isActive: true,

    });


    console.log(
      "================================"
    );

    console.log(
      "Admin Created Successfully"
    );

    console.log(
      "Email:",
      admin.email
    );

    console.log(
      "Password:",
      password
    );

    console.log(
      "Role:",
      admin.role
    );

    console.log(
      "================================"
    );


    process.exit(0);

  } catch (error) {

    console.error(
      "Admin Creation Error:",
      error
    );

    process.exit(1);

  }

};

createAdmin();