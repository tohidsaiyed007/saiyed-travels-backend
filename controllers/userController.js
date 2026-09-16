// const User = require("../models/User");


// // ==========================================
// // GET ALL USERS
// // ==========================================

// const getUsers = async (req, res) => {
//   try {

//     const users = await User.find()
//       .select("-password")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: users.length,
//       users,
//     });

//   } catch (error) {

//     console.error("Get Users Error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching users.",
//     });

//   }
// };


// // ==========================================
// // GET SINGLE USER
// // ==========================================

// const getUserById = async (req, res) => {
//   try {

//     const user = await User.findById(
//       req.params.id
//     ).select("-password");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       user,
//     });

//   } catch (error) {

//     console.error("Get User Error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching user.",
//     });

//   }
// };


// // ==========================================
// // UPDATE USER
// // ==========================================

// const updateUser = async (req, res) => {
//   try {

//     const {
//       firstName,
//       lastName,
//       email,
//       phone,
//       role,
//       agencyName,
//       city,
//       state,
//       gstNumber,
//       isActive,
//     } = req.body;


//     const user = await User.findById(
//       req.params.id
//     );

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }


//     // Check duplicate email

//     if (
//       email &&
//       email.toLowerCase().trim() !==
//         user.email
//     ) {

//       const existingUser =
//         await User.findOne({
//           email: email.toLowerCase().trim(),
//           _id: { $ne: user._id },
//         });

//       if (existingUser) {
//         return res.status(409).json({
//           success: false,
//           message:
//             "Another user already has this email.",
//         });
//       }

//       user.email =
//         email.toLowerCase().trim();
//     }


//     if (firstName !== undefined)
//       user.firstName = firstName;

//     if (lastName !== undefined)
//       user.lastName = lastName;

//     if (phone !== undefined)
//       user.phone = phone;

//     if (role !== undefined) {

//       if (
//         ![
//           "customer",
//           "agent",
//           "admin",
//         ].includes(role)
//       ) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid user role.",
//         });
//       }

//       user.role = role;
//     }


//     if (agencyName !== undefined)
//       user.agencyName = agencyName;

//     if (city !== undefined)
//       user.city = city;

//     if (state !== undefined)
//       user.state = state;

//     if (gstNumber !== undefined)
//       user.gstNumber = gstNumber;

//     if (isActive !== undefined)
//       user.isActive = isActive;


//     await user.save();


//     const updatedUser =
//       await User.findById(user._id)
//         .select("-password");


//     res.status(200).json({
//       success: true,
//       message: "User updated successfully.",
//       user: updatedUser,
//     });

//   } catch (error) {

//     console.error("Update User Error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error while updating user.",
//     });

//   }
// };


// // ==========================================
// // DELETE USER
// // ==========================================

// const deleteUser = async (req, res) => {
//   try {

//     const user = await User.findById(
//       req.params.id
//     );

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }


//     // Prevent deleting the currently
//     // logged-in admin

//     if (
//       req.user._id.toString() ===
//       user._id.toString()
//     ) {

//       return res.status(400).json({
//         success: false,
//         message:
//           "You cannot delete your own admin account.",
//       });

//     }


//     await User.findByIdAndDelete(
//       req.params.id
//     );


//     res.status(200).json({
//       success: true,
//       message: "User deleted successfully.",
//     });

//   } catch (error) {

//     console.error("Delete User Error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error while deleting user.",
//     });

//   }
// };


// module.exports = {
//   getUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
// };


const bcrypt = require("bcryptjs");
const User = require("../models/User");


// ==========================================
// GET ALL USERS
// ADMIN ONLY
// ==========================================

const getUsers = async (req, res) => {
  try {

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {

    console.error(
      "Get Users Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while fetching users.",
    });

  }
};


// ==========================================
// GET SINGLE USER
// ADMIN ONLY
// ==========================================

const getUserById = async (req, res) => {
  try {

    const user =
      await User.findById(
        req.params.id
      ).select("-password");

    if (!user) {

      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });

    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    console.error(
      "Get User Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while fetching user.",
    });

  }
};


// ==========================================
// UPDATE USER
// ADMIN ONLY
// ==========================================

const updateUser = async (req, res) => {
  try {

    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      agencyName,
      city,
      state,
      gstNumber,
      isActive,
    } = req.body;


    const user =
      await User.findById(
        req.params.id
      );


    if (!user) {

      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });

    }


    // ======================================
    // DUPLICATE EMAIL CHECK
    // ======================================

    if (
      email &&
      email.toLowerCase().trim() !==
        user.email
    ) {

      const existingUser =
        await User.findOne({
          email:
            email.toLowerCase().trim(),

          _id: {
            $ne: user._id,
          },
        });


      if (existingUser) {

        return res.status(409).json({
          success: false,
          message:
            "Another user already has this email.",
        });

      }


      user.email =
        email.toLowerCase().trim();
    }


    // ======================================
    // BASIC DETAILS
    // ======================================

    if (
      firstName !== undefined
    ) {
      user.firstName =
        firstName.trim();
    }


    if (
      lastName !== undefined
    ) {
      user.lastName =
        lastName.trim();
    }


    if (
      phone !== undefined
    ) {
      user.phone =
        phone.trim();
    }


    // ======================================
    // ROLE
    // ======================================

    if (
      role !== undefined
    ) {

      if (
        ![
          "customer",
          "agent",
          "admin",
        ].includes(role)
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Invalid user role.",
        });

      }

      user.role = role;
    }


    // ======================================
    // AGENT DETAILS
    // ======================================

    if (
      agencyName !== undefined
    ) {
      user.agencyName =
        agencyName.trim();
    }


    if (
      city !== undefined
    ) {
      user.city =
        city.trim();
    }


    if (
      state !== undefined
    ) {
      user.state =
        state.trim();
    }


    if (
      gstNumber !== undefined
    ) {
      user.gstNumber =
        gstNumber.trim();
    }


    // ======================================
    // ACTIVE STATUS
    // ======================================

    if (
      isActive !== undefined
    ) {
      user.isActive =
        isActive;
    }


    await user.save();


    const updatedUser =
      await User.findById(
        user._id
      ).select("-password");


    res.status(200).json({
      success: true,
      message:
        "User updated successfully.",
      user: updatedUser,
    });

  } catch (error) {

    console.error(
      "Update User Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while updating user.",
    });

  }
};


// ==========================================
// DELETE USER
// ADMIN ONLY
// ==========================================

const deleteUser = async (req, res) => {
  try {

    const user =
      await User.findById(
        req.params.id
      );


    if (!user) {

      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });

    }


    // ======================================
    // PREVENT ADMIN SELF DELETE
    // ======================================

    if (
      req.user._id.toString() ===
      user._id.toString()
    ) {

      return res.status(400).json({
        success: false,
        message:
          "You cannot delete your own admin account.",
      });

    }


    await User.findByIdAndDelete(
      req.params.id
    );


    res.status(200).json({
      success: true,
      message:
        "User deleted successfully.",
    });

  } catch (error) {

    console.error(
      "Delete User Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while deleting user.",
    });

  }
};


// ==========================================
// GET MY PROFILE
// CUSTOMER + AGENT + ADMIN
// ==========================================

const getMyProfile = async (
  req,
  res
) => {

  try {

    const user =
      await User.findById(
        req.user._id
      ).select("-password");


    if (!user) {

      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });

    }


    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    console.error(
      "Get My Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while loading profile.",
    });

  }
};


// ==========================================
// UPDATE MY PROFILE
// CUSTOMER + AGENT + ADMIN
// ==========================================

const updateMyProfile = async (
  req,
  res
) => {

  try {

    const {
      firstName,
      lastName,
      phone,
      agencyName,
      city,
      state,
      gstNumber,
    } = req.body;


    if (
      !firstName ||
      !firstName.trim()
    ) {

      return res.status(400).json({
        success: false,
        message:
          "First name is required.",
      });

    }


    const user =
      await User.findById(
        req.user._id
      );


    if (!user) {

      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });

    }


    // ======================================
    // BASIC DETAILS
    // ======================================

    user.firstName =
      firstName.trim();


    user.lastName =
      lastName
        ? lastName.trim()
        : "";


    user.phone =
      phone
        ? phone.trim()
        : "";


    // ======================================
    // AGENT DETAILS
    // ======================================

    if (
      user.role === "agent"
    ) {

      user.agencyName =
        agencyName
          ? agencyName.trim()
          : "";


      user.city =
        city
          ? city.trim()
          : "";


      user.state =
        state
          ? state.trim()
          : "";


      user.gstNumber =
        gstNumber
          ? gstNumber.trim()
          : "";

    }


    // ======================================
    // ADMIN / CUSTOMER
    // ======================================

    /*
      Customer aur Admin apni role,
      email aur active status change
      nahi kar sakte.
    */


    await user.save();


    const updatedUser =
      await User.findById(
        user._id
      ).select("-password");


    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully.",
      user: updatedUser,
    });

  } catch (error) {

    console.error(
      "Update My Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating profile.",
    });

  }
};


// ==========================================
// CHANGE PASSWORD
// CUSTOMER + AGENT + ADMIN
// ==========================================

const changePassword = async (
  req,
  res
) => {

  try {

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;


    // ======================================
    // REQUIRED
    // ======================================

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {

      return res.status(400).json({
        success: false,
        message:
          "All password fields are required.",
      });

    }


    // ======================================
    // CONFIRM PASSWORD
    // ======================================

    if (
      newPassword !==
      confirmPassword
    ) {

      return res.status(400).json({
        success: false,
        message:
          "New password and confirm password do not match.",
      });

    }


    // ======================================
    // PASSWORD LENGTH
    // ======================================

    if (
      newPassword.length < 6
    ) {

      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters.",
      });

    }


    // ======================================
    // FIND USER
    // ======================================

    const user =
      await User.findById(
        req.user._id
      );


    if (!user) {

      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });

    }


    // ======================================
    // CURRENT PASSWORD CHECK
    // ======================================

    const passwordMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );


    if (!passwordMatch) {

      return res.status(401).json({
        success: false,
        message:
          "Current password is incorrect.",
      });

    }


    // ======================================
    // HASH NEW PASSWORD
    // ======================================

    user.password =
      await bcrypt.hash(
        newPassword,
        12
      );


    await user.save();


    return res.status(200).json({
      success: true,
      message:
        "Password updated successfully.",
    });

  } catch (error) {

    console.error(
      "Change Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while changing password.",
    });

  }
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {

  // ADMIN USER MANAGEMENT
  getUsers,
  getUserById,
  updateUser,
  deleteUser,

  // PROFILE
  getMyProfile,
  updateMyProfile,
  changePassword,

};