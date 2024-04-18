import { Product } from "../Models/productModel.js";
import { nanoid } from "nanoid";
import { User } from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { transporter, verifyTransporter } from "../Config/mailTransporter.js";
import Admin from "../Models/adminModel.js";
const client_URL = process.env.CLIENT_URL;

//Add an admin
export const addAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if required fields are provided
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required." });
    }

    // Check if an admin with the same email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "An admin with this email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin with hashed password
    const newAdmin = new Admin({ username, email, password: hashedPassword });

    // Save the admin to the database
    await newAdmin.save();

    // Generate an access token
    const accessToken = jwt.sign(
      { email: newAdmin.email, role: "admin" },
      process.env.USER_ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    return res
      .status(201)
      .json({ message: "Admin created successfully", accessToken });
  } catch (error) {
    console.error("Error adding admin:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Admin login
export const adminLogin = async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Find the admin by email
    const existingAdmin = await Admin.findOne({ email });

    // Check if admin exists
    if (!existingAdmin) {
      console.log("Admin not found:", email);
      return res.status(404).json({ message: "Admin not found." });
    }

    console.log("Existing admin:", existingAdmin);

    // Trim and log hashed passwords
    const trimmedPassword = password.trim();
    const trimmedDBPassword = existingAdmin.password.trim();
    console.log("Trimmed password from request body:", trimmedPassword);
    console.log("Trimmed password from database:", trimmedDBPassword);

    // Validate password
    const isValidPassword = await bcrypt.compare(
      trimmedPassword,
      trimmedDBPassword
    );

    console.log("isValidPassword:", isValidPassword);

    // If password is not valid, return error
    if (!isValidPassword) {
      console.log("Invalid password for admin:", email);
      return res.status(401).json({ message: "Invalid password." });
    }

    // Generate access token
    const accessToken = jwt.sign(
      { email: existingAdmin.email, role: "admin" },
      process.env.USER_ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    // Return access token
    return res
      .status(201)
      .json({ message: "Admin loggedin successfully", accessToken });
  } catch (error) {
    console.error("Error during admin login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Add a new product
export const handleAddProduct = async (req, res) => {
  try {
    // Extract product data from request body
    const { product } = req.body;

    // Validate incoming product data
    if (!product || !product.product_type) {
      return res.status(400).json({ message: "Product data is incomplete" });
    }

    // Generate a unique product ID
    const id = nanoid(7);
    const product_ID = product.product_type + "-" + id;

    // Create a new product document
    const newProduct = new Product({ ...product, product_ID });

    // Save the new product to the database
    const result = await newProduct.save();

    // Check if product creation was successful
    if (result) {
      return res.status(200).json({ message: "Product added successfully" });
    } else {
      return res.status(400).json({ message: "Failed to add product" });
    }
  } catch (error) {
    // Check if the error is related to JWT token verification
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    } else {
      // Handle other errors
      console.error("Error adding product:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
};

// Update an existing product
export const handleUpdateProduct = async (req, res) => {
  try {
    // Extract product data from request body
    const { product } = req.body;

    // Validate incoming product data
    if (!product || !product.product_ID) {
      return res.status(400).json({ message: "Product data is incomplete" });
    }

    // Find the existing product by its ID
    const existingProduct = await Product.findOne({
      product_ID: product.product_ID,
    });

    // Check if the product exists
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the existing product document
    existingProduct.set(product);

    // Save the updated product to the database
    const result = await existingProduct.save();

    // Check if product update was successful
    if (result) {
      return res.status(200).json({ message: "Product updated successfully" });
    } else {
      return res.status(400).json({ message: "Failed to update product" });
    }
  } catch (error) {
    // Check if the error is related to JWT token verification
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    } else {
      // Handle other errors
      console.error("Error updating product:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
};

// Add a new employee
export const handleAddEmployee = async (req, res) => {
  console.log("Adding new employee");
  try {
    const { new_User } = req.body;

    console.log("Request body:", new_User);

    // Check if new user details are provided
    if (!new_User) {
      return res.status(400).send({ message: "Employee details not received" });
    }

    // Check if the provided email is already in use
    const found = await User.find({ email: new_User.email });
    if (found.length) {
      return res.status(409).send({ message: "Email already in use" });
    }

    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_User.password, salt);

    // Create a new user document with hashed password and default activation status
    const newUser = new User({
      ...new_User,
      password: hashedPassword,
      isActivated: false,
    });

    console.log("New user document:", newUser);

    // Save the new user to the database
    const result = await newUser.save();

    if (!result) {
      return res.status(400).json({ message: "Error adding employee" });
    }

    // Create JWT for account activation
    const validateToken = jwt.sign(
      {
        userDetail: {
          email: result.email,
          role: result.role,
        },
      },
      process.env.ACC_VALIDATION_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Send activation email
    verifyTransporter();
    const link = `${client_URL}/activate/${result._id}?activateToken=${validateToken}`;
    const mailOptions = {
      from: process.env.MAIL_ID,
      to: result.email,
      subject: "Account Activation Link",
      text: `Greetings from Clean Life! Click on the below link to activate your account. This link is valid for 15 minutes. ${link}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Activation email not sent", error);
        return res
          .status(500)
          .send({ message: "Error sending activation email" });
      } else {
        console.log("Activation email sent:", info.response);
        return res.status(201).json({ message: "Account created" });
      }
    });
  } catch (error) {
    console.error("Error adding employee:", error);
    return res
      .status(500)
      .send({ message: "Internal server error", error: error });
  }
};

// Update user details
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = req.body;

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    user.username = updatedUser.username || user.username;
    user.email = updatedUser.email || user.email;
    user.password = updatedUser.password
      ? await bcrypt.hash(updatedUser.password, 10)
      : user.password;
    user.role = updatedUser.role || user.role;
    user.phone = updatedUser.phone || user.phone;
    user.pic_URL = updatedUser.pic_URL || user.pic_URL;
    user.pic_URL_ID = updatedUser.pic_URL_ID || user.pic_URL_ID;

    // Save the updated user
    const updatedResult = await user.save();

    return res.status(200).json({
      message: "User details updated successfully",
      user: updatedResult,
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Controller function to remove an employee
export const removeEmployee = async (req, res) => {
  try {
    const { userId } = req.params;

    // Remove the employee from the database
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ message: "Employee removed successfully" });
  } catch (error) {
    console.error("Error removing employee:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
