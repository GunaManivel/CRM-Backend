import mongoose from "mongoose";
import { ORDER_STATUS } from "../Config/order_status.js";

// Extract order status codes from ORDER_STATUS
const ORDER_STATUS_VALUES = Object.values(ORDER_STATUS).map(
  (status) => status.code
);

// Define the schema for the Order model
const orderSchema = new mongoose.Schema({
  // Unique identifier for the order
  orderID: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  // Array containing order items
  order_items: [],
  // Address of the customer
  cust_address: {
    type: String,
    required: true,
    trim: true,
  },
  // Email of the customer
  cust_email: {
    type: String,
    required: true,
    trim: true,
  },
  // Phone number of the customer
  cust_phone: {
    type: String,
    required: true,
    trim: true,
  },
  // Status of the order
  order_status: {
    type: String,
    required: true,
    enum: ORDER_STATUS_VALUES,
  },
  // Quantity of items in the order
  order_qty: {
    type: Number,
    required: true,
  },
  // Total amount of the order
  order_amount: {
    type: Number,
    required: true,
  },
  // Date of the order
  order_date: {
    type: String,
    required: true,
    trim: true,
  },
  // Estimated time of arrival for the order
  order_ETA: {
    type: String,
    required: true,
    trim: true,
  },
  // Date the order was delivered
  order_delivered_on: {
    type: String,
    trim: true,
    default: "na",
  },
  // Array containing ratings for order items
  order_items_rating: {
    type: Array,
    default: [],
  },
  // ID of the customer who placed the order
  customer_id: {
    type: String,
    required: true,
    trim: true,
  },
});

// Create the Order model
export const Order = mongoose.model("order", orderSchema);
