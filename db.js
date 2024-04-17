import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function mongoConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo database connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Terminate the process on connection error
  }
}
