import mongoose from "mongoose";
import { REQUEST_STATUS } from "../Config/request_status.js";

// Extract REQUEST_STATUS codes
const REQUEST_STATUS_VALUES = Object.values(REQUEST_STATUS).map(
  (status) => status.code
);

// Define the schema for the Request model
const requestSchema = new mongoose.Schema({
  // Unique identifier for the request
  requestID: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  // Order ID associated with the request
  orderID: {
    type: String,
    required: true,
    trim: true,
  },
  // Customer address for the request
  cust_address: {
    type: String,
    required: true,
    trim: true,
  },
  // Customer email for the request
  cust_email: {
    type: String,
    required: true,
    trim: true,
  },
  // Customer phone number for the request
  cust_phone: {
    type: String,
    required: true,
    trim: true,
  },
  // Date of the request
  request_date: {
    type: String,
    required: true,
    trim: true,
  },
  // Engineer assigned to the request
  request_engg: {
    type: String,
    required: true,
    trim: true,
  },
  // Status of the request
  request_status: {
    type: String,
    required: true,
    enum: REQUEST_STATUS_VALUES,
  },
  // Summary of the request
  request_summary: {
    type: Array,
    required: true,
  },
});

// Create the Request model
export const Request = mongoose.model("request", requestSchema);
