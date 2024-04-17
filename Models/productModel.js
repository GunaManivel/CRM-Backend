import mongoose from "mongoose";
import { PRODUCT_TYPE, PRODUCT_STATUS } from "../Config/products_Types.js";

// Extract product type values
const PRODUCT_TYPE_VALUES = Object.values(PRODUCT_TYPE).map(
  (type) => type.code
);

// Extract product status values
const PRODUCT_STATUS_VALUES = Object.values(PRODUCT_STATUS).map(
  (status) => status.code
);

const productSchema = new mongoose.Schema({
  product_ID: {
    type: String,
    required: true,
    trim: true,
  },
  product_name: {
    type: String,
    required: true,
    trim: true,
  },
  product_model: {
    type: String,
    required: true,
    trim: true,
  },
  product_type: {
    type: String,
    required: true,
    enum: PRODUCT_TYPE_VALUES,
    default: PRODUCT_TYPE.New_Product.code,
  },
  product_price: {
    type: Number,
    required: true,
  },
  product_stock: {
    type: Number,
    required: true,
    default: 5,
  },
  product_discount: {
    type: Number,
    required: true,
    default: 0,
  },
  product_desc: {
    type: String,
    required: true,
    trim: true,
  },
  product_pic: {
    type: String,
    required: true,
    trim: true,
    default: "na",
  },
  product_color: {
    type: String,
    required: true,
    trim: true,
  },
  product_warranty: {
    type: String,
    required: true,
    trim: true,
  },
  product_status: {
    type: String,
    required: true,
    trim: true,
    enum: PRODUCT_STATUS_VALUES,
    default: PRODUCT_STATUS.Available.code,
  },
  launched_yr: {
    type: String,
    required: true,
    trim: true,
  },
});

export const Product = mongoose.model("product", productSchema);
