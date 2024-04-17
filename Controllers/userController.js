import { User } from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { transporter, verifyTransporter } from "../Config/mailTransporter.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const client_URL = process.env.CLIENT_URL;

// register new user
export const handleRegisterUser = async (req, res) => {
  try {
    const { new_User } = req.body;
    if (!new_User) {
      return res.status(400).send({ message: "User details not received" });
    }

    const existingUser = await User.findOne({ email: new_User.email });
    if (existingUser) {
      return res.status(409).send({ message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_User.password, salt);

    const user = new User({
      ...new_User,
      password: hashedPassword,
      isActivated: false,
    });

    const savedUser = await user.save();
    if (!savedUser) {
      return res.status(500).send({ message: "Error adding user" });
    }

    // create JWT for account activation
    const validateToken = jwt.sign(
      { email: savedUser.email, role: savedUser.role },
      process.env.ACC_VALIDATION_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    // Send activation email
    const activationLink = `${client_URL}/activate/${savedUser._id}?activateToken=${validateToken}`;

    const mailOptions = {
      from: process.env.MAIL_ID,
      to: savedUser.email,
      subject: "Account Activation Link",
      text: `Greetings from Clean Life! Click on the link to activate your account: ${activationLink}. This link is valid for 15 minutes.`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Activation email not sent", error);
        return res
          .status(500)
          .send({ message: "Error sending activation email" });
      } else {
        console.log("Activation email sent", info.response);
        // Respond after sending email
        res.status(201).json({ message: "Account created" });
      }
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

//User Login
export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find user by email
    const foundUser = await User.findOne({ email });

    // If user not found, return 404
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user account is activated
    if (!foundUser.isActivated) {
      return res.status(401).json({ message: "User account not activated" });
    }

    // Check if USER_ACCESS_TOKEN_SECRET is defined
    if (!process.env.USER_ACCESS_TOKEN_SECRET) {
      // Log the error
      console.error("USER_ACCESS_TOKEN_SECRET is not defined");

      // Return 500 Internal Server Error with informative message
      return res.status(500).json({
        message: "Internal server error: Access token secret not defined",
      });
    }

    // Evaluate password
    const validPwd = await bcrypt.compare(password, foundUser.password);

    // If password is valid, generate access token and return user data
    if (validPwd) {
      const accessToken = jwt.sign(
        {
          userDetail: {
            email: foundUser.email,
            role: foundUser.role,
          },
        },
        process.env.USER_ACCESS_TOKEN_SECRET,
        { expiresIn: "3h" }
      );

      const userdata = {
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
        pic_URL: foundUser.pic_URL,
        pic_URL_ID: foundUser.pic_URL_ID,
        phone: foundUser.phone || "",
      };

      return res.status(200).json({ accessToken, userdata });
    } else {
      // If password is invalid, return 401
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    // Log and handle internal server error
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// New user account activation
export const accountActivation = async (req, res) => {
  try {
    const { id, token } = req.params;

    // Check if id and token are present
    if (!id || !token) {
      return res.status(400).json({ message: "Invalid activation link" });
    }

    // Find the user by id
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is already activated
    if (user.isActivated) {
      return res.status(400).json({ message: "Account already activated" });
    }

    // Verify the activation token
    const tokenCheck = jwt.verify(
      token,
      process.env.ACC_VALIDATION_TOKEN_SECRET
    );
    if (!tokenCheck.userDetail || tokenCheck.userDetail.email !== user.email) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Activate the user account
    user.isActivated = true;
    await user.save();

    // Respond with success message
    return res.status(200).json({ message: "Account activated successfully" });
  } catch (error) {
    console.error("Error activating account:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Re-send Activation Email :
export const resendActivation = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (foundUser.isActivated) {
      return res
        .status(400)
        .json({ message: "User account already activated" });
    }

    const validateToken = jwt.sign(
      {
        userDetail: {
          email: foundUser.email,
          role: foundUser.role,
        },
      },
      process.env.ACC_VALIDATION_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    verifyTransporter();
    const link = `${client_URL}/activate/${foundUser._id}?activateToken=${validateToken}`;

    const mailOptions = {
      from: process.env.MAIL_ID,
      to: foundUser.email,
      subject: "Account Activation link sent",
      text: `Greetings from Clean Life! Click on the link to activate your account: ${link}. This link is valid for 15 minutes.`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Activation email not sent", error);
        return res
          .status(500)
          .json({ message: "Error sending activation email" });
      } else {
        console.log("Activation email sent", info.response);
        return res.status(200).json({ message: "Activation link sent" });
      }
    });
  } catch (error) {
    console.error("Error resending activation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Forgot Password - Send reset link mail
// forgotPassword function
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    // Find user by email
    const foundUser = await User.findOne({ email });

    // If user not found, return 404
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user account is activated
    if (!foundUser.isActivated) {
      return res.status(400).json({ message: "User account not activated" });
    }

    // Generate token for password reset
    const resetToken = jwt.sign(
      {
        userDetail: {
          email: foundUser.email,
          role: foundUser.role,
          id: foundUser._id,
        },
      },
      process.env.RESET_PWD_TOKEN_SECRET, // Use fixed secret
      { expiresIn: "15m" }
    );

    // Verify transporter before sending email
    verifyTransporter();

    // Construct reset link
    const resetLink = `${client_URL}/forgotpwd/authorize/?id=${foundUser._id}&token=${resetToken}`;

    // Prepare email options
    const mailOptions = {
      from: process.env.MAIL_ID,
      to: foundUser.email,
      subject: "Password Reset Link",
      text: `Greetings from Clean Life! Click on the below link to reset your password. This link is valid for 15 minutes: ${resetLink}`,
    };

    // Send email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Reset link email not sent:", error);
        return res
          .status(500)
          .json({ message: "Error sending reset link email" });
      } else {
        console.log("Reset link email sent:", info.response);
        return res.status(200).json({ message: "Password reset link sent" });
      }
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// verifying and authorizing token to allow reset password
// authorizePwdReset function
export const authorizePwdReset = async (req, res) => {
  try {
    const { id, token } = req.params;

    // Check if both ID and token are provided
    if (!id || !token) {
      return res.status(400).json({ message: "Invalid link" });
    }

    // Find user by ID
    const user = await User.findOne({ _id: id });

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the token using the fixed secret
    jwt.verify(token, process.env.RESET_PWD_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        // Log the error for debugging
        console.error("Token verification error:", err);

        // Return detailed error response
        return res.status(401).json({ message: "Token Error", error: err });
      } else {
        // Log successful token verification
        console.log("Token verified successfully:", decoded);

        // Return success response with ID and token
        return res.status(200).json({ id, token });
      }
    });
  } catch (error) {
    // Log internal server error
    console.error("Internal server error in authorizePwdReset:", error);

    // Return internal server error response
    return res.status(500).json({ message: "Internal server error", error });
  }
};
// Resetting password in DB
export const resetPassword = async (req, res) => {
  console.log("Reset password request");
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    // Check if both ID, token, and password are provided
    if (!id || !token || !password) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // Find user by ID
    const user = await User.findOne({ _id: id });

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the token using the reset password secret
    const decodedToken = jwt.verify(token, process.env.RESET_PWD_TOKEN_SECRET);

    // Log successful token verification
    console.log("Token verified successfully:", decodedToken);

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password
    const result = await User.findByIdAndUpdate(
      { _id: user.id },
      { password: hashedPassword },
      { new: true }
    );

    // Check if password reset was successful
    if (result) {
      return res.status(200).json({ message: "Password reset successfully" });
    } else {
      return res.status(400).json({ message: "Error resetting password" });
    }
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// update Profile Pic
export const updateProfilePic = async (req, res) => {
  try {
    const { email, pic_URL, pic_URL_ID } = req.body;

    // Check if required data is provided
    if (!email || !pic_URL || !pic_URL_ID) {
      return res.status(400).json({
        message: "Invalid data: Email, pic_URL, and pic_URL_ID are required.",
      });
    }

    // Find user by email and update profile pic
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { pic_URL: pic_URL, pic_URL_ID: pic_URL_ID },
      { new: true }
    );

    // Check if user was found and profile pic was updated
    if (updatedUser) {
      return res
        .status(200)
        .json({ message: "Profile pic updated successfully" });
    } else {
      return res
        .status(404)
        .json({ message: "User not found or profile pic update failed" });
    }
  } catch (error) {
    console.error("Error updating profile pic:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// update Phone
export const updatePhone = async (req, res) => {
  console.log("Updating phone number");
  try {
    const { email, phone } = req.body;

    // Check if required data is provided
    if (!email || !phone) {
      return res.status(400).json({
        message: "Invalid data: Email and phone number are required.",
      });
    }

    // Find user by email and update phone number
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { phone: phone },
      { new: true }
    );

    // Check if user was found and phone number was updated
    if (updatedUser) {
      return res
        .status(200)
        .json({ message: "Phone number updated successfully" });
    } else {
      return res
        .status(404)
        .json({ message: "User not found or phone number update failed" });
    }
  } catch (error) {
    console.error("Error updating phone number:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//  Delete old pic from Cloudinary
export const deleteOldPic = async (req, res) => {
  console.log("Deleting image from Cloudinary");
  const { public_id } = req.query;

  try {
    // Check if public_id is provided
    if (!public_id) {
      return res.status(400).json({ message: "public_id is required" });
    }

    // Delete image from Cloudinary
    const response = await cloudinary.uploader.destroy(public_id);

    // Check if deletion was successful
    if (response.result === "ok") {
      console.log("Image deleted successfully:", response);
      return res
        .status(200)
        .json({ message: "Image deleted from Cloudinary", response });
    } else {
      console.error("Error deleting image:", response);
      return res
        .status(404)
        .json({ message: "Image not found in Cloudinary", response });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
