import mongoose from "mongoose";
import { LEAD_STATUS } from "../Config/lead_status.js";

// Extract lead status codes from LEAD_STATUS
const LEAD_STATUS_CODES = Object.values(LEAD_STATUS).map(
  (status) => status.code
);

const leadSchema = new mongoose.Schema(
  {
    lead_id: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    lead_name: {
      type: String,
      required: true,
      trim: true,
    },
    lead_email: {
      type: String,
      unique: true,
      trim: true,
    },
    lead_phone: {
      type: String,
      unique: true,
      trim: true,
    },
    lead_address: {
      type: String,
      trim: true,
      default: "na",
    },
    lead_source: {
      type: String,
      trim: true,
      default: "na",
    },
    lead_status: {
      type: String,
      required: true,
      enum: LEAD_STATUS_CODES,
      default: LEAD_STATUS.Approached.code,
    },
    lead_created: {
      type: String,
      trim: true,
      default: "na",
    },
  },

  { timestamps: true }
);

export const Lead = mongoose.model("lead", leadSchema);
