import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/**
 * Establishes connection to MongoDB database.
 */
export async function mongoConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URL); // Connect to MongoDB using the provided URL
    console.log("Mongo database connected successfully"); // Log success message if connection is established
  } catch (error) {
    console.error("Error connecting to MongoDB:", error); // Log error message if connection fails
    process.exit(1); // Terminate the process on connection error
  }
}
