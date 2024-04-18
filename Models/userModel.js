import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { USER_ROLES } from "../Config/user_roles.js";

// Extract role codes from USER_ROLES
const USER_ROLE_CODES = Object.values(USER_ROLES).map((role) => role.code);

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    // Username of the user
    username: {
      type: String,
      required: true,
      trim: true,
    },
    // Email of the user
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
        "Please fill a valid email address",
      ],
    },
    // Password of the user
    password: {
      type: String,
      required: true,
    },
    // Profile picture URL of the user
    pic_URL: {
      type: String,
      default: "na",
    },
    // Profile picture URL ID of the user
    pic_URL_ID: {
      type: String,
      default: "na",
    },
    // Role of the user
    role: {
      type: String,
      required: true,
      enum: USER_ROLE_CODES, // Use role codes as enum values
      default: USER_ROLES.Customer.code, // Set default role code
    },
    // Phone number of the user
    phone: {
      type: String,
    },
    // Indicates whether the user account is activated
    isActivated: {
      type: Boolean,
      required: true,
      default: false,
    },
    // Date when the account was created
    acct_created: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Create the User model
export const User = mongoose.model("user", userSchema);
