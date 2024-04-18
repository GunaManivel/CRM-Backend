import mongoose from "mongoose";

// Define the schema for the Admin model
const adminSchema = new mongoose.Schema({
  // Username of the admin
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // Email of the admin
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Password of the admin
  password: {
    type: String,
    required: true,
  },
  // Role of the admin
  role: {
    type: String,
    required: true,
    enum: ["admin"],
    default: "admin",
  },
  // Timestamp of admin creation
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Admin model
const Admin = mongoose.model("Admin", adminSchema);

// Export the Admin model
export default Admin;
