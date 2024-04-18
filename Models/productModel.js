import mongoose from "mongoose";
import { PRODUCT_TYPE, PRODUCT_STATUS } from "../Config/products_Types.js";

// Extract product type values from PRODUCT_TYPE
const PRODUCT_TYPE_VALUES = Object.values(PRODUCT_TYPE).map(
  (type) => type.code
);

// Extract product status values from PRODUCT_STATUS
const PRODUCT_STATUS_VALUES = Object.values(PRODUCT_STATUS).map(
  (status) => status.code
);

// Define the schema for the Product model
const productSchema = new mongoose.Schema({
  // Unique identifier for the product
  product_ID: {
    type: String,
    required: true,
    trim: true,
  },
  // Name of the product
  product_name: {
    type: String,
    required: true,
    trim: true,
  },
  // Model of the product
  product_model: {
    type: String,
    required: true,
    trim: true,
  },
  // Type of the product (e.g., Washing Machine, Kitchen Chimney)
  product_type: {
    type: String,
    required: true,
    enum: PRODUCT_TYPE_VALUES,
    default: PRODUCT_TYPE.New_Product.code,
  },
  // Price of the product
  product_price: {
    type: Number,
    required: true,
  },
  // Stock quantity of the product
  product_stock: {
    type: Number,
    required: true,
    default: 5,
  },
  // Discount percentage of the product
  product_discount: {
    type: Number,
    required: true,
    default: 0,
  },
  // Description of the product
  product_desc: {
    type: String,
    required: true,
    trim: true,
  },
  // URL of the product image
  product_pic: {
    type: String,
    required: true,
    trim: true,
    default: "na",
  },
  // Color of the product
  product_color: {
    type: String,
    required: true,
    trim: true,
  },
  // Warranty information of the product
  product_warranty: {
    type: String,
    required: true,
    trim: true,
  },
  // Status of the product (e.g., Available, Not Available)
  product_status: {
    type: String,
    required: true,
    trim: true,
    enum: PRODUCT_STATUS_VALUES,
    default: PRODUCT_STATUS.Available.code,
  },
  // Year the product was launched
  launched_yr: {
    type: String,
    required: true,
    trim: true,
  },
});

// Create the Product model
export const Product = mongoose.model("product", productSchema);
