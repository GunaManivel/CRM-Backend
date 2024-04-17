import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { USER_ROLES } from "../Config/user_roles.js";

// Extract role codes from USER_ROLES
const USER_ROLE_CODES = Object.values(USER_ROLES).map((role) => role.code);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
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
    password: {
      type: String,
      required: true,
    },
    pic_URL: {
      type: String,
      default: "na",
    },
    pic_URL_ID: {
      type: String,
      default: "na",
    },
    role: {
      type: String,
      required: true,
      enum: USER_ROLE_CODES, // Use role codes as enum values
      default: USER_ROLES.Customer.code, // Set default role code
    },
    phone: {
      type: String,
    },
    isActivated: {
      type: Boolean,
      required: true,
      default: false,
    },
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

export const User = mongoose.model("user", userSchema);
