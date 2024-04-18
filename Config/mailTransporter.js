// Import necessary modules
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Create transporter for sending emails
export const transporter = nodemailer.createTransport({
  // Specify email service provider
  service: process.env.MAIL_SERVICE,
  // Set secure connection to false
  secure: false,
  // Authenticate with email credentials from environment variables
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PWD,
  },
});

// Function to verify transporter connection
export async function verifyTransporter() {
  try {
    // Verify transporter connection
    await transporter.verify();
    // Log confirmation message when transporter is ready
    console.log("Email server is ready to take our messages");
  } catch (error) {
    // Log error if transporter verification fails
    console.error("Error verifying email server:", error);
  }
}

// Export transporter for use in other modules
export default transporter;
