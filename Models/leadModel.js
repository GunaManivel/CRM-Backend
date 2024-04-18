import mongoose from "mongoose";
import { LEAD_STATUS } from "../Config/lead_status.js";

// Extract lead status codes from LEAD_STATUS
const LEAD_STATUS_CODES = Object.values(LEAD_STATUS).map(
  (status) => status.code
);

// Define the lead schema
const leadSchema = new mongoose.Schema(
  {
    // Unique identifier for the lead
    lead_id: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    // Name of the lead
    lead_name: {
      type: String,
      required: true,
      trim: true,
    },
    // Email of the lead
    lead_email: {
      type: String,
      unique: true,
      trim: true,
    },
    // Phone number of the lead
    lead_phone: {
      type: String,
      unique: true,
      trim: true,
    },
    // Address of the lead
    lead_address: {
      type: String,
      trim: true,
      default: "na",
    },
    // Source of the lead
    lead_source: {
      type: String,
      trim: true,
      default: "na",
    },
    // Status of the lead
    lead_status: {
      type: String,
      required: true,
      enum: LEAD_STATUS_CODES,
      default: LEAD_STATUS.Approached.code,
    },
    // Timestamp of lead creation
    lead_created: {
      type: String,
      trim: true,
      default: "na",
    },
  },
  // Timestamps option to automatically add createdAt and updatedAt fields
  { timestamps: true }
);

// Create Lead model from leadSchema
export const Lead = mongoose.model("lead", leadSchema);
